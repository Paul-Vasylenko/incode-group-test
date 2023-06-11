import { NextFunction, Request, Response } from 'express';
import ms from 'ms';
import { loginSchema, registerSchema, updateBossSchema } from './schema';
import {
  listUsersService,
  loginService,
  userService,
  registerService,
} from '../../services';
import {
  TTokenPayload,
  getValidEnv,
  checkPermissions,
  isAllowedAll,
  getTransaction,
} from '../../utils';
import ApiError from '../../utils/errors';

class UserController {
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user as TTokenPayload;
      // Administrator may see all users
      if (isAllowedAll(user, ['list_all_users'])) {
        const users = await listUsersService.listAll();

        return res.json({
          data: users,
          meta: {
            total: users.length,
          },
        });
      }

      const me = await userService.getById(user.id);
      const subordinates = await listUsersService.listSubordinates(me);

      return res.json({
        data: [me, ...subordinates],
        meta: {
          total: subordinates.length + 1,
        },
      });
    } catch (e) {
      next(e);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginData = loginSchema.parse(req.body);

      const user = await loginService.validateLoginData(loginData);
      const tokens = await loginService.login(user);
      const env = getValidEnv();

      res.cookie('accessToken', tokens.accessToken, {
        maxAge: ms(env.ACCESS_EXPIRE),
        httpOnly: true,
      }); // on HTTPS should also be secure: true
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: ms(env.REFRESH_EXPIRE),
        httpOnly: true,
      });

      res.json({
        user,
        tokens,
      });
    } catch (e) {
      next(e);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await getTransaction();
    try {
      const user = res.locals.user as TTokenPayload;
      checkPermissions(user, ['create_user']);

      const registerData = registerSchema.parse(req.body);
      await registerService.validateRegisterData(registerData);
      const newUser = await registerService.register(registerData);

      // Make user boss, because it now has subordinate
      registerData.bossId &&
        (await userService.changeRole(registerData.bossId, 'BOSS'));

      await transaction.commit();
      res.json(newUser);
    } catch (e) {
      await transaction.rollback();
      next(e);
    }
  };

  updateBoss = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await getTransaction();

    try {
      const user = res.locals.user as TTokenPayload;

      checkPermissions(user, ['change_boss']); // validate if user can use this service
      const data = updateBossSchema.parse({
        ...req.body,
        ...req.params,
      });

      const userToChange = await userService.getById(data.id);
      if (
        isAllowedAll(user, ['only_subordinates']) &&
        userToChange.bossId !== user.id
      )
        throw new ApiError({
          message: 'Boss may change boss only for his subordinates',
          type: 'PERMISSION_DENIED',
          status: 403,
        });

      await userService.validateBecomeBoss(data.bossId); // validate if provided bossId may become boss
      await userService.changeBoss(userToChange, data.bossId);

      await transaction.commit();
      res.json({});
    } catch (e) {
      await transaction.rollback();
      next(e);
    }
  };
}

export default new UserController();

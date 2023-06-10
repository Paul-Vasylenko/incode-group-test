import { NextFunction, Request, Response } from 'express';
import ms from 'ms';
import { loginSchema, registerSchema } from './schema';
import {
  listUsersService,
  loginService,
  registerService,
} from '../../services';
import {
  TTokenPayload,
  getValidEnv,
  checkPermissions,
  isAllowedAll,
} from '../../utils';

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

      const me = await listUsersService.getById(user.id);
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
    try {
      const user = res.locals.user as TTokenPayload;
      checkPermissions(user, ['create_user']);

      const registerData = registerSchema.parse(req.body);
      await registerService.validateRegisterData(registerData);
      const newUser = await registerService.register(registerData);

      res.json(newUser);
    } catch (e) {
      next(e);
    }
  };
}

export default new UserController();

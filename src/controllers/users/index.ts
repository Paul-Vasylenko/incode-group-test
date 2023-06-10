import { NextFunction, Request, Response } from 'express';
import ms from 'ms';
import User from '../../models/User';
import { loginSchema, registerSchema } from './schema';
import { loginService, registerService } from '../../services';
import { TTokenPayload, getValidEnv, isAllowed } from '../../utils';

class UserController {
  list = async (req: Request, res: Response) => {
    const users = await User.findAll();

    res.json(users);
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

  register = async (req: Request, res: Response) => {
    const user = res.locals.user as TTokenPayload;
    isAllowed(user, ['create_user']);

    const registerData = registerSchema.parse(req.body);
    await registerService.validateRegisterData(registerData);
    const newUser = await registerService.register(registerData);

    res.json(newUser);
  };
}

export default new UserController();

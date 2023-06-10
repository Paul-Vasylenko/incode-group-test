import { Request, Response } from 'express';
import User from '../../models/User';
import { loginSchema } from './schema';
import { loginService } from '../../services';

export default {
  list: async (req: Request, res: Response) => {
    const users = await User.findAll();

    res.json(users);
  },
  login: async (req: Request, res: Response) => {
    const loginData = loginSchema.parse(req.body);

    const user = await loginService.validateLoginData(loginData);
    const tokens = await loginService.login(user);

    res.cookie('accessToken', tokens.accessToken, { maxAge: 900000, httpOnly: true }) // on HTTPS should also be secure: true
    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 9000000, httpOnly: true })
    
    res.json({
      user,
      tokens
    });
  },
};

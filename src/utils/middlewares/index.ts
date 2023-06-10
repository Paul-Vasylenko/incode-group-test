import { NextFunction, Request, Response } from 'express';
import { checkAccessToken } from '../crypto';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  try {
    const decoded = checkAccessToken(accessToken);
    res.locals.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid access token' });
  }
};

import { NextFunction, Request, Response } from 'express';
import { checkAccessToken } from '../crypto';
import ApiError from '../errors';
import { ZodError } from 'zod';

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

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ApiError) {
    console.error(error.toString());

    return res.status(error.status).json({
      message: error.message,
      type: error.type,
      payload: error.payload,
    });
  }
  if (error instanceof ZodError) {
    const validationErrors = error.flatten();
    res
      .status(400)
      .json({ type: 'VALIDATION_ERROR', errors: validationErrors });
  }

  console.log(error);

  res.status(500).json({
    type: 'INTERNAL_SERVER_ERROR',
    message: 'Unpredictable error happend. Please contact your system admin',
  });
};

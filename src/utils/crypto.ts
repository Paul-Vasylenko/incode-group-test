import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../constants';
import User from '../models/User';
import { getValidEnv } from './env';

export const encrypt = async (plain: string) => {
  const hash = await bcrypt.hash(plain, SALT_ROUNDS);

  return hash;
};

export const compare = async (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};

const getJWTPayload = (user: User) => {
  const payload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.roleId,
    permissions: user.role?.permissions || [],
  };

  return payload;
};

export const getAccessToken = (user: User) => {
  const payload = getJWTPayload(user);
  const env = getValidEnv();
  return jsonwebtoken.sign(payload, env.JWT_SECRET, {
    expiresIn: env.ACCESS_EXPIRE,
  });
};

export const getRefreshToken = (user: User) => {
  const payload = getJWTPayload(user);
  const env = getValidEnv();
  return jsonwebtoken.sign(payload, env.JWT_SECRET, {
    expiresIn: env.REFRESH_EXPIRE,
  });
};

export const generateTokens = (user: User) => {
    return {
        accessToken: getAccessToken(user),
        refreshToken: getRefreshToken(user),
    }
}
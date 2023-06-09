import {Sequelize} from 'sequelize-typescript';
import { getValidEnv } from 'utils';

const env = getValidEnv();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASS,
  models: [__dirname + '/models']
});
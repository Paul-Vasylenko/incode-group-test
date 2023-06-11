import { Sequelize } from 'sequelize-typescript';
import { getValidEnv } from './src/utils';

const env = getValidEnv();
const isTest = env.NODE_ENV === 'test';
const DB_NAME = isTest ? env.DB_TEST_NAME : env.DB_NAME;
const DB_USER = isTest ? env.DB_TEST_USER : env.DB_USER;
const DB_PASS = isTest ? env.DB_TEST_PASS : env.DB_PASS;

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASS,
  host: '127.0.0.1',
  port: 5432,
  logging: false,
  sync: {
    force: false,
  },
  models: [__dirname + '/src/models'],
});

export default sequelize;

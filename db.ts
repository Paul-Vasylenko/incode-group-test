import { Sequelize } from 'sequelize-typescript';
import { getValidEnv } from './src/utils';

const env = getValidEnv();

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASS,
  host: '127.0.0.1',
  port: 5432,
  sync: {
    force : false
  },
  models: [__dirname + '/src/models'],
});

export default sequelize;

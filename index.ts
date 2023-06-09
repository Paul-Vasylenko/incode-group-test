import express from 'express';
import { getValidEnv } from './src/utils/env';
import sequelize from './db';
import routers from './src/routers';

const { PORT } = getValidEnv();
const app = express();

for (const router of routers) {
  app.use('/api/v1', router);
}

(async function () {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error('Unable to connect to the database:', e);
  }
})();

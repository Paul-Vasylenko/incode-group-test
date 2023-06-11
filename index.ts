import express from 'express';
import cookie from 'cookie-parser';
import { getValidEnv } from './src/utils/env';
import sequelize from './db';
import routers from './src/routers';
import { errorHandler } from './src/utils/middlewares';

const { PORT, NODE_ENV } = getValidEnv();
const app = express();
app.use(express.json());
app.use(cookie());

for (const router of routers) {
  app.use('/api/v1', router);
}
app.use(errorHandler);

if (NODE_ENV !== 'test') {
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
}

export default app;

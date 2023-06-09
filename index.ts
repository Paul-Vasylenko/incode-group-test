import express from 'express';
import { getValidEnv } from './src/utils/env';
import sequelize from './db';

const { PORT } = getValidEnv();
const app = express();

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

(async function() {
  try{
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch(e) {
    console.error('Unable to connect to the database:', e);
  }
})();
  
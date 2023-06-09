import express from 'express';
import { config } from 'dotenv';
import { getValidEnv } from './src/utils';

config();
const { PORT } = getValidEnv();
const app = express();

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
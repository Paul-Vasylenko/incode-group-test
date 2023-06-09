import express from 'express';

const app = express();
const port = process.env.PORT;

console.log(port);

app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
  });

  
app.listen(port, () => {
    console.log('Server running');
})
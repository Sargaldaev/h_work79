import express from 'express';
import fileDb from './file.db';

const app = express();
const port = 8008;

app.use(express.static('public'));
app.use(express.json());



const run = async () => {
  await fileDb.init();

  app.listen(port, () => {
    console.log(`server running in ${port} port`);
  });
};

run().catch(e => console.error(e));
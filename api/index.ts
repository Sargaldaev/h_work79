import express from 'express';
import fileDb from './file.db';
import categoriesRouter from './routers/categories';
import placesRouter from './routers/places';

const app = express();
const port = 8008;

app.use(express.static('public'));
app.use(express.json());
app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);


const run = async () => {
  await fileDb.init();

  app.listen(port, () => {
    console.log(`server running in ${port} port`);
  });
};

run().catch(e => console.error(e));
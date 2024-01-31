import express from 'express';
import {IPlaceCreate, IPlaces} from '../types';
import fileDb from '../file.db';

const placesRouter = express.Router();

placesRouter.post('/', async (req, res) => {

  if (!req.body.title) {
    return res.status(400).send({'error': 'title required'});
  }

  const place: IPlaceCreate = {
    title: req.body.title,
    description: req.body.description || null,
  };

  const savedPlace = await fileDb.addItem(place, 'places');

  res.send(savedPlace);
});


placesRouter.get('/', async (req, res) => {
  const places = await fileDb.getItems('places');

  res.send(places);
});

placesRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const places = await fileDb.getItems('places', id);

  const placesId = places.find(item => item.id === id);

  if (!placesId) {
    res.status(404).send('Not Found');
  }
  res.send(placesId);
});

placesRouter.put('/:id', async (req, res) => {
  const id = req.params.id;

  const places: IPlaces = {
    id: req.body.id,
    title: req.body.title,
    description: req.body.description || null,
  };

  const editId = await fileDb.editItem(places, 'places', id);

  if (!editId) {
    return res.status(404).send('Not Found');
  }

  res.send(editId);
});


placesRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const places = await fileDb.deleteItem('places', id);

  if (!places) {
    res.status(404).send('Not Found');
    return;
  }

  res.send(places);

});

export default placesRouter;
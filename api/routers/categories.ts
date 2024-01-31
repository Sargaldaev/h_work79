import express from 'express';
import {ICategories, ICategoryCreate} from '../types';
import fileDb from '../file.db';

const categoriesRouter = express.Router();

categoriesRouter.post('/', async (req, res) => {

  if (!req.body.title) {
    return res.status(400).send({'error': 'Title  required'});
  }

  const category: ICategoryCreate = {
    title: req.body.title,
    description: req.body.description || null,
  };

  const savedCategory = await fileDb.addItem(category, 'categories');

  res.send(savedCategory);
});


categoriesRouter.get('/', async (req, res) => {
  const categories = await fileDb.getItems('categories');

  res.send(categories);
});


categoriesRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const categories = await fileDb.getItems('categories', id);

  const categoriesId = categories.find(item => item.id === id);

  if (!categoriesId) {
    res.status(404).send('Not Found');
  }
  res.send(categoriesId);
});

categoriesRouter.put('/:id', async (req, res) => {
  const id = req.params.id;

  const category: ICategories = {
    id: req.body.id,
    title: req.body.title,
    description: req.body.description || null,
  };

  const editId = await fileDb.editItem(category, 'categories', id);

  if (!editId) {
    return res.status(404).send('Not Found');
  }

  res.send(editId);
});


categoriesRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const categories = await fileDb.deleteItem('categories', id);

  if (!categories) {
    return res.status(404).send('Not Found');
  }

  res.send(categories);

});

export default categoriesRouter;
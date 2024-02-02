import express from 'express';
import {ICategories, ICategoryCreate} from '../types';
import fileDb from '../file.db';

const categoriesRouter = express.Router();

categoriesRouter.post('/', async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).send({'error': 'Title required'});
    }

    const category: ICategoryCreate = {
      title: req.body.title,
      description: req.body.description || null,
    };

    const savedCategory = await fileDb.addItem(category, 'categories');

    res.send(savedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


categoriesRouter.get('/', async (req, res) => {
  try {
    const categories = await fileDb.getItems('categories');
    res.send(categories);
  } catch (error) {
    console.error(error);

    res.status(500).send('Internal Server Error');
  }
});


categoriesRouter.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const categories = await fileDb.getItems('categories', id);

    const categoriesId = categories.find(item => item.id === id);

    if (!categoriesId) {
      return res.status(404).send('Not Found');
    }

    res.send(categoriesId);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

categoriesRouter.put('/:id', async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


categoriesRouter.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const categories = await fileDb.deleteItem('categories', id);

    if (!categories) {
      return res.status(404).send('Not Found');
    }

    res.send(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export default categoriesRouter;

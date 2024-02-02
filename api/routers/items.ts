import express from 'express';
import {IItems, IItemsCreate} from '../types';
import fileDb from '../file.db';
import {imagesUpload} from '../multer';

const itemsRouter = express.Router();

itemsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).send({'error': 'title required'});
    }

    const item: IItemsCreate = {
      placeId: req.body.placeId,
      categoryId: req.body.categoryId,
      image: req.file ? req.file.filename : null,
      title: req.body.title,
      description: req.body.description || null,
    };

    const savedItem = await fileDb.addItems(item, 'items');
    res.send(savedItem);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


itemsRouter.put('/:id', imagesUpload.single('image'), async (req, res) => {
  try {
    const id = req.params.id;

    const items: IItems = {
      id: req.body.id,
      placeId: req.body.placeId,
      categoryId: req.body.categoryId,
      title: req.body.title,
      description: req.body.description || null,
      image: req.file ? req.file.filename : null
    };

    const editId = await fileDb.editItems(items, 'items', id);

    if (!editId) {
      return res.status(404).send('Not Found');
    }

    res.send(editId);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


itemsRouter.get('/', async (req, res) => {
  try {
    const items = await fileDb.getItems('items');
    res.send(items);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

itemsRouter.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const items = await fileDb.getItems('items', id);

    const itemId = items.find(item => item.id === id);

    if (!itemId) {
      return res.status(404).send('Not Found');
    }

    res.send(itemId);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


itemsRouter.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const items = await fileDb.deleteItem('items', id);

    if (!items) {
      return res.status(404).send('Not Found');
    }

    res.send(items);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export default itemsRouter;

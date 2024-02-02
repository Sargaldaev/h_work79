import {promises as fs} from 'fs';
import {randomUUID} from 'crypto';
import {ICategories, ICategoryCreate, IItems, IItemsCreate, IPlaceCreate, IPlaces} from './types';

const filename = './db.json';
let data: {
  categories: ICategories[];
  places: IPlaces[];
  items: IItems[];
} = {
  categories: [],
  places: [],
  items: []
};

const fileDb = {

  async init() {
    try {
      const fileContents = await fs.readFile(filename);
      data = JSON.parse(fileContents.toString());
    } catch (e) {
      data = {
        items: [],
        categories: [],
        places: []
      };
    }
  },

  async getItemsById(key: 'items', id: string) {
    const placeId = data[key].find(item => item.placeId === id);
    const categoryId = data[key].find(item => item.categoryId === id);

    return placeId || categoryId;
  },


  async getItems(key: keyof typeof data, id?: string) {

    if (key === 'items' && id) {
      return data[key];
    }

    if (key === 'items') {
      return data[key].map(item => ({
        id: item.id,
        title: item.title,
        categoryId: item.categoryId,
        placeId: item.placeId,
      }));
    }

    if (!id) {
      return data[key].map(item => ({
        title: item.title,
        id: item.id,
      }));
    } else {
      return data[key];
    }
  },

  async addItem(item: ICategoryCreate | IPlaceCreate, key: 'categories' | 'places') {
    const newItem = {
      ...item,
      id: randomUUID(),
    };

    data[key].push(newItem);
    await this.save();

    return newItem;
  },

  async addItems(item: IItemsCreate, key: 'items') {
    const category = data.categories.find(value => value.id === item.categoryId);
    const place = data.places.find(value => value.id === item.placeId);

    if (!category || !place) {
      return 'id Not Found';
    }

    const newItem = {
      ...item,
      id: randomUUID(),
    };

    data[key].push(newItem);
    await this.save();

    return newItem;
  },

  async deleteItem(key: keyof typeof data, id: string) {

    const item = data[key].find(item => item.id === id);

    if (item) {
      const itemId = await this.getItemsById('items', item.id);

      if (itemId) {
        return 'Cannot be deleted';
      }
    }


    const index = data[key].findIndex(item => item.id === id);

    if (index !== -1) {

      data[key].splice(index, 1);
      await this.save();
      return 'successfully deleted';
    }

    return false;
  },

  async editItem(item: ICategories | IPlaces, key: 'categories' | 'places', id: string) {

    const index = data[key].findIndex(item => item.id === id);

    if (index !== -1) {
      const updatedItem = {
        ...data[key][index],
        ...item,
        id,
      };

      data[key][index] = updatedItem;

      await this.save();

      return updatedItem;
    } else {
      return false;
    }
  },


  async editItems(item: IItems, key: 'items', id: string) {

    const index = data[key].findIndex(item => item.id === id);

    if (index !== -1) {
      const updatedItem = {
        ...data[key][index],
        ...item,
        id,
      };
      data[key][index] = updatedItem;

      await this.save();

      return updatedItem;
    } else {
      return false;
    }
  },

  async save() {
    return fs.writeFile(filename, JSON.stringify(data));
  }
};

export default fileDb;
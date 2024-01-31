export interface IPlaces {
  id: string;
  title: string;
  description: string | null;
}

export interface ICategories {
  id: string;
  title: string;
  description: string | null;
}

export interface IItems {
  id: string;
  categoryId: string;
  placeId: string;
  title: string;
  description: string | null;
  image: string | null;
}

export interface IPlaceCreate {
  title: string;
  description: string | null;
}

export interface ICategoryCreate {
  title: string;
  description: string | null;
}


export interface IItemsCreate {
  categoryId: string;
  placeId: string;
  title: string;
  description: string | null;
  image: string | null;
}
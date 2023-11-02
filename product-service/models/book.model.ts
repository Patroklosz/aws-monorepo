export interface Product<T = number> {
  id: number;
  name: string;
  price: T;
  description: string;
  author: string;
}

export interface Stock {
  product_id: number;
  count: number;
}

export interface Book<T = number> extends Product<T> {
  count: T;
}

export interface RawProduct extends Omit<Book<string>, "id"> {}

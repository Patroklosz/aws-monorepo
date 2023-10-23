export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  author: string;
}

export interface Stock {
  product_id: number;
  count: number;
}

export interface Book extends Product {
  count: number;
}

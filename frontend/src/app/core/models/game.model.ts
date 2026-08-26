export interface Game {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  price: number;
  stock: number;
  genre: string;
  platform: ('PC' | 'PlayStation' | 'Xbox' | 'Nintendo')[];
  images: string[];
  description: string;
}

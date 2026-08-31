export interface Game {
  _id: string;
  title: string;
  price: number;
  stock: number;
  genre: string;
  platform: string[];
  images: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

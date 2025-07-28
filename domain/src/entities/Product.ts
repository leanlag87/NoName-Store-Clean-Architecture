export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId?: string;
  brandId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

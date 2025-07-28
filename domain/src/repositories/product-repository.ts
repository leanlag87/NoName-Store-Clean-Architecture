import { Product } from "../entities/Product";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(product: Omit<Product, "id">): Promise<Product>;
  update(product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<boolean>;
  search(data: Partial<Product>): Promise<Product[]>;
  count(): Promise<number>;
}

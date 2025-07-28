import { Product } from "../../entities/Product";
import { ProductRepository } from "../../repositories/product-repository";
import { InvalidDataError } from "../../errors/error";

export type CreateProductRequestModel = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
>;

export interface CreateProductDependencies {
  productRepository: ProductRepository;
}

export async function createProduct(
  _dependencies: CreateProductDependencies,
  _payload: CreateProductRequestModel
): Promise<InvalidDataError | Product> {
  return null as any;
}

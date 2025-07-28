import { Product } from "../../entities/Product";
import { ProductRepository } from "../../repositories/product-repository";
import { createInvalidDataError, InvalidDataError } from "../../errors/error";

export type CreateProductRequestModel = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
>;

export interface CreateProductDependencies {
  productRepository: ProductRepository;
}

export async function createProduct(
  { productRepository }: CreateProductDependencies,
  { name, description, price, categoryId, brandId }: CreateProductRequestModel
): Promise<InvalidDataError | Product> {
  const hasErrors = validateProductData(name, description, price);
  if (hasErrors) return hasErrors;

  const productData: Omit<Product, "id"> = {
    name,
    description,
    price,
    categoryId,
    brandId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return await productRepository.create(productData);
}

function validateProductData(
  name: string,
  description: string,
  price: number
): InvalidDataError | void {
  if (name.trim() === "") {
    return createInvalidDataError("Name must be not empty");
  }

  if (name.length > 20) {
    return createInvalidDataError("Name cannot be longer than 20 characters");
  }

  if (description.length > 500) {
    return createInvalidDataError(
      "Description cannot be longer than 500 characters"
    );
  }

  if (price <= 0) {
    return createInvalidDataError("Price must be greater than zero");
  }
}

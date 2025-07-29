import { Product } from "../../../../domain/src/entities/Product";
import { ProductRepository } from "../../../../domain/src/repositories/product-repository";

export function productService(): ProductRepository {
  return {
    async findById(id: string): Promise<Product | null> {
      const product = await ProductModel.findById(id);
      if (!product) {
        throw new Error("No existe un producto con el ID " + id);
      }
      return _mapToProductResponseDto(product);
    },
    async update(id: string, product: Product): Promise<Product | Error> {
      try {
        const productToUpdate = await ProductModel.findById(id);
        if (!productToUpdate) {
          throw new Error("No existe un producto con el ID " + product.id);
        }
        const updatedProduct = await productToUpdate.update(product);
        return _mapToProductResponseDto(updatedProduct);
      } catch (error) {
        return error as Error;
      }
    },
  };
}

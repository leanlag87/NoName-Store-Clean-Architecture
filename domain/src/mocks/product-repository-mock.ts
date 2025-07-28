import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product-repository";

export interface MockedProductRepository extends ProductRepository {
  products: Product[];
}

export function mockProductRepository(
  products: Product[] = []
): MockedProductRepository {
  return {
    products,
    findAll: async () => {
      return [...products];
    },
    findById: async (id: string) => {
      const product = products.find((p) => p.id === id);
      return product ? { ...product } : null;
    },
    create: async (productData: Omit<Product, "id">) => {
      const product: Product = {
        id: crypto.randomUUID(),
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      products.push(product);
      return { ...product };
    },
    update: async (productData: Partial<Product>) => {
      const index = products.findIndex((p) => p.id === productData.id);
      if (index !== -1) {
        products[index] = {
          ...products[index],
          ...productData,
          updatedAt: new Date(),
        };
        return { ...products[index] };
      }
      throw new Error("Product not found");
    },
    delete: async (id: string) => {
      const index = products.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.splice(index, 1);
        return true;
      }
      return false;
    },
    search: async (data: Partial<Product>) => {
      return products.filter((p) => {
        return Object.keys(data).every(
          (key) => p[key as keyof Product] === data[key as keyof Product]
        );
      });
    },
    count: async () => {
      return products.length;
    },
  };
}

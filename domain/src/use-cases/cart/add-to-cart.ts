import { CartItem } from "../../entities/Cart";
import { CartRepository } from "../../repositories/cart-repository";
import { ProductRepository } from "../../repositories/product-repository";
import { InvalidDataError, NotFoundError } from "../../errors/error";

export interface AddToCartRequestModel {
  userId: string;
  productId: string;
  quantity: number;
}

export interface AddToCartDependencies {
  cartRepository: CartRepository;
  productRepository: ProductRepository;
}

export async function addToCart(
  _dependencies: AddToCartDependencies,
  _payload: AddToCartRequestModel
): Promise<InvalidDataError | NotFoundError | CartItem> {
  return null as any;
}

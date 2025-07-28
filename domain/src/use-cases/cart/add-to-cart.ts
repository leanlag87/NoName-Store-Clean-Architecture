import { CartItem } from "../../entities/Cart";
import { CartRepository } from "../../repositories/cart-repository";
import { ProductRepository } from "../../repositories/product-repository";
import {
  createInvalidDataError,
  createNotFoundError,
  InvalidDataError,
  NotFoundError,
} from "../../errors/error";
import { UserRepository } from "../../repositories/user-repository";

export interface AddToCartRequestModel {
  userId: string;
  productId: string;
  quantity: number;
}

export interface AddToCartDependencies {
  cartRepository: CartRepository;
  productRepository: ProductRepository;
  userRepository: UserRepository;
}

export async function addToCart(
  { cartRepository, productRepository, userRepository }: AddToCartDependencies,
  { userId, productId, quantity }: AddToCartRequestModel
): Promise<InvalidDataError | NotFoundError | CartItem> {
  const user = await userRepository.findById(userId);
  if (!user) {
    return createNotFoundError("User not found");
  }

  if (quantity <= 0) {
    return createInvalidDataError("Quantity must be greater than zero");
  }

  const product = await productRepository.findById(productId);
  if (!product) {
    return createNotFoundError("Product not found");
  }

  let cart = await cartRepository.findByUserId(userId);

  if (!cart) {
    cart = await cartRepository.create({
      userId,
      items: [],
      totalAmount: 0,
    });
  }

  const existingItem = await cartRepository.findItemByProductId(
    cart.id,
    productId
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    const updatedItem = await cartRepository.updateItem(
      cart.id,
      existingItem.id,
      newQuantity
    );
    return updatedItem!;
  } else {
    const newItem = await cartRepository.addItem(cart.id, {
      productId,
      quantity,
      price: product.price,
      addedAt: new Date(),
    });
    return newItem;
  }
}

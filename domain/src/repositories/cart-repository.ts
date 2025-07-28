import { Cart, CartItem } from "../entities/Cart";

export interface CartRepository {
  findByUserId(userId: string): Promise<Cart | null>;
  create(cart: Omit<Cart, "id">): Promise<Cart>;
  update(cart: Cart): Promise<Cart>;
  delete(id: string): Promise<boolean>;

  addItem(cartId: string, item: Omit<CartItem, "id">): Promise<CartItem>;
  updateItem(
    cartId: string,
    itemId: string,
    quantity: number
  ): Promise<CartItem | null>;
  removeItem(cartId: string, itemId: string): Promise<boolean>;
  findItemByProductId(
    cartId: string,
    productId: string
  ): Promise<CartItem | null>;

  calculateTotal(cartId: string): Promise<number>;
  clearCart(cartId: string): Promise<boolean>;
}

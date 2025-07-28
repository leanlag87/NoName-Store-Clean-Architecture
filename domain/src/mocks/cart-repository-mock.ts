import { Cart, CartItem } from "../entities/Cart";
import { CartRepository } from "../repositories/cart-repository";

export interface MockedCartRepository extends CartRepository {
  carts: Cart[];
}

export function mockCartRepository(carts: Cart[] = []): MockedCartRepository {
  return {
    carts,

    findByUserId: async (userId: string) => {
      const cart = carts.find((c) => c.userId === userId);
      return cart ? { ...cart } : null;
    },

    create: async (cartData: Omit<Cart, "id">) => {
      const cart: Cart = {
        id: crypto.randomUUID(),
        ...cartData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      carts.push(cart);
      return { ...cart };
    },

    update: async (cartData: Cart) => {
      const index = carts.findIndex((c) => c.id === cartData.id);
      if (index !== -1) {
        carts[index] = { ...cartData, updatedAt: new Date() };
        return { ...carts[index] };
      }
      throw new Error("Cart not found");
    },

    delete: async (id: string) => {
      const index = carts.findIndex((c) => c.id === id);
      if (index !== -1) {
        carts.splice(index, 1);
        return true;
      }
      return false;
    },

    addItem: async (cartId: string, itemData: Omit<CartItem, "id">) => {
      const cart = carts.find((c) => c.id === cartId);
      if (!cart) throw new Error("Cart not found");

      const item: CartItem = {
        id: crypto.randomUUID(),
        ...itemData,
        addedAt: new Date(),
      };

      cart.items.push(item);
      cart.totalAmount = await mockCartRepository().calculateTotal(cartId);
      cart.updatedAt = new Date();

      return { ...item };
    },

    updateItem: async (cartId: string, itemId: string, quantity: number) => {
      const cart = carts.find((c) => c.id === cartId);
      if (!cart) return null;

      const itemIndex = cart.items.findIndex((i) => i.id === itemId);
      if (itemIndex === -1) return null;

      cart.items[itemIndex].quantity = quantity;
      cart.totalAmount = await mockCartRepository().calculateTotal(cartId);
      cart.updatedAt = new Date();

      return { ...cart.items[itemIndex] };
    },

    removeItem: async (cartId: string, itemId: string) => {
      const cart = carts.find((c) => c.id === cartId);
      if (!cart) return false;

      const itemIndex = cart.items.findIndex((i) => i.id === itemId);
      if (itemIndex === -1) return false;

      cart.items.splice(itemIndex, 1);
      cart.totalAmount = await mockCartRepository().calculateTotal(cartId);
      cart.updatedAt = new Date();

      return true;
    },

    findItemByProductId: async (cartId: string, productId: string) => {
      const cart = carts.find((c) => c.id === cartId);
      if (!cart) return null;

      const item = cart.items.find((i) => i.productId === productId);
      return item ? { ...item } : null;
    },

    calculateTotal: async (cartId: string) => {
      const cart = carts.find((c) => c.id === cartId);
      if (!cart) return 0;

      return cart.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },

    clearCart: async (cartId: string) => {
      const cart = carts.find((c) => c.id === cartId);
      if (!cart) return false;

      cart.items = [];
      cart.totalAmount = 0;
      cart.updatedAt = new Date();

      return true;
    },
  };
}

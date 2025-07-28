export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItemResponseDto {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    addedAt: Date;
  }
  
  export interface CartResponseDto {
    id: string;
    userId: string;
    items: CartItemResponseDto[];
    totalAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
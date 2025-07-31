
export interface ProductResponseDto {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId?: string;
    brandId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
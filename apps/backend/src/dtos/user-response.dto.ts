export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    role?: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export type UserRole = "admin" | "user";
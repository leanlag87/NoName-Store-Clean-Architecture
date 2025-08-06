export interface UserResponseDto {
  id: string;
  name: string;
  surname: string;
  email: string;
  image?: string;
  validated: boolean;
  locked: boolean;
  role?: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRole = "admin" | "user";

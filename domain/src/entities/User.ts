export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  image?: string;
  validated: boolean;
  locked: boolean;
  token?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

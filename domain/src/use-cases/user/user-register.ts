import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/user-repository";

export type UserRegisterRequestModel = Omit<User, "id" | "role">;

export interface UserRegisterDependencies {
  users: UserRepository;
}

export async function UserRegister(
  { users }: UserRegisterDependencies,
  { email, password, name, createdAt, updatedAt }: UserRegisterRequestModel
): Promise<User> {
  const user: User = {
    id: crypto.randomUUID(),
    email,
    password,
    name,
    role: "user",
    createdAt: createdAt || new Date(),
    updatedAt: updatedAt || new Date(),
  };

  return await users.create(user);
}

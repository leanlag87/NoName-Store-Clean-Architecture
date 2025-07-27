import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/user-repository";

export type UserRegisterRequestModel = Omit<User, "id" | "role">;

export interface UserRegisterDependencies {
  users: UserRepository;
}

export function UserRegister(
  _dependencies: UserRegisterDependencies,
  _payload: UserRegisterRequestModel
): any {
  // Retorna algo que haga fallar el test
  return null;
}

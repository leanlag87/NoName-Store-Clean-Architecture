import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/user-repository";
import { CryptoRepository } from "../../repositories/crypto-repository";
import {
  AuthenticationError,
  createAuthenticationError,
} from "../../errors/error";

export interface UserLoginRequestModel {
  email: string;
  password: string;
}

export interface UserLoginDependencies {
  users: UserRepository;
  crypto: CryptoRepository;
}

export async function UserLogin(
  { users, crypto }: UserLoginDependencies,
  { email, password }: UserLoginRequestModel
): Promise<User | AuthenticationError> {
  const user = await users.findByEmail(email);
  if (!user) return createAuthenticationError();
  const isValid = await crypto.comparePassword(password, user.password);
  if (!isValid) return createAuthenticationError();
  return user;
}

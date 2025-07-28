import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/user-repository";
import { CryptoRepository } from "../../repositories/crypto-repository";
import { createCredentialsError, CredentialsError } from "../../errors/error";

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
): Promise<User | CredentialsError> {
  const user = await users.findByEmail(email);
  if (!user) return createCredentialsError();
  const isValid = await crypto.comparePassword(password, user.password);
  if (!isValid) return createCredentialsError();
  return user;
}

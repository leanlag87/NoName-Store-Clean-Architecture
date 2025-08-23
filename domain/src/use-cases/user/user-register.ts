import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/user-repository";
import { InvalidDataError, createInvalidDataError } from "../../errors/error";
import { CryptoRepository } from "@domain/repositories/crypto-repository";

export type UserRegisterRequestModel = Omit<
  User,
  "id" | "role" | "createdAt" | "updatedAt" | "validated" | "locked" | "token"
>;

export interface UserRegisterDependencies {
  users: UserRepository;
  cryptoRepository: CryptoRepository;
}

export async function UserRegister(
  { users, cryptoRepository }: UserRegisterDependencies,
  { email, password, name, surname }: UserRegisterRequestModel
): Promise<InvalidDataError | User> {
  const hasErrors = validateData(email, password, name, surname);
  if (hasErrors) return hasErrors;

  try {
    await users.findByEmail(email);
    return createInvalidDataError("Email already in use");
  } catch (error) {
    if (
      !(
        error &&
        typeof error === "object" &&
        "type" in error &&
        error.type === "Not Found"
      )
    ) {
      throw error;
    }
  }

  const user: User = {
    id: await cryptoRepository.generateNewID(),
    email,
    password: await cryptoRepository.hashPassword(password),
    name,
    surname,
    image: undefined,
    validated: false,
    locked: false,
    token: undefined,
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return await users.create(user);
}

function validateData(
  email: string,
  password: string,
  name: string,
  surname: string
): InvalidDataError | void {
  if (email.trim() === "") {
    return createInvalidDataError("Email must be not empty");
  }
  if (password.trim() === "") {
    return createInvalidDataError("Password must be not empty");
  }
  if (name.trim() === "") {
    return createInvalidDataError("Name must be not empty");
  }
  if (surname.trim() === "") {
    return createInvalidDataError("Surname must be not empty");
  }
}

import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/user-repository";
import { InvalidDataError, createInvalidDataError } from "../../errors/error";

export type UserRegisterRequestModel = Omit<
  User,
  "id" | "role" | "createdAt" | "updatedAt"
>;

export interface UserRegisterDependencies {
  users: UserRepository;
}

export async function UserRegister(
  { users }: UserRegisterDependencies,
  { email, password, name }: UserRegisterRequestModel
): Promise<InvalidDataError | User> {
  const hasErrors = validateData(email, password, name);
  if (hasErrors) return hasErrors;
  
  const existingUser = await users.findByEmail(email);
  if (existingUser) return createInvalidDataError("Email already in use");

  const user: User = {
    id: crypto.randomUUID(),
    email,
    password,
    name,
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return await users.create(user);
}

function validateData(
  email: string,
  password: string,
  name: string
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
}

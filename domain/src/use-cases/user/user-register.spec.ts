import { beforeEach, describe, expect, test } from "vitest";
import {
  MockedUserRepository,
  mockUserRepository,
} from "../../mocks/user-repository-mock";
import {
  UserRegister,
  UserRegisterDependencies,
  UserRegisterRequestModel,
} from "./user-register";
import { UserRole } from "../../entities/User";
import { createInvalidDataError } from "../../errors/error";

describe("User register use case", () => {
  let _mockedUserRepository: MockedUserRepository = mockUserRepository([]);
  let _dependencies: UserRegisterDependencies;

  beforeEach(() => {
    _mockedUserRepository = mockUserRepository([]);
    _dependencies = {
      users: _mockedUserRepository,
    };

    _mockedUserRepository.create({
      id: "existing user id",
      password: "12345678",
      email: "existing@user.com",
      name: "Existing User",
      role: "user" as UserRole,
    });
  });

  test("should fail if email is already in use", async () => {
    const payload: UserRegisterRequestModel = {
      email: "existing@user.com",
      password: "12345678",
      name: "Test User",
    };
    const result = await UserRegister(_dependencies, payload);
    expect(result).toEqual(createInvalidDataError("Email already in use"));
  });

  test("should fail if email is empty", async () => {
    const payload: UserRegisterRequestModel = {
      email: "",
      password: "12345678",
      name: "Test User",
    };
    const result = await UserRegister(_dependencies, payload);
    expect(result).toEqual(createInvalidDataError("Email must be not empty"));
  });

  test("should fail if password is empty", async () => {
    const payload: UserRegisterRequestModel = {
      email: "valid@email.com",
      password: "",
      name: "Test User",
    };
    const result = await UserRegister(_dependencies, payload);
    expect(result).toEqual(
      createInvalidDataError("Password must be not empty")
    );
  });

  test("should fail if name is empty", async () => {
    const payload: UserRegisterRequestModel = {
      email: "valid@email.com",
      password: "12345678",
      name: "",
    };
    const result = await UserRegister(_dependencies, payload);
    expect(result).toEqual(createInvalidDataError("Name must be not empty"));
  });

  test("should register user successfully with valid data", async () => {
    const payload: UserRegisterRequestModel = {
      email: "test@email.com",
      password: "12345678",
      name: "Test User",
    };

    const result = await UserRegister(_dependencies, payload);

    const user = await _mockedUserRepository.findByEmail(payload.email);
    expect(user).not.toBeNull();
    expect(result).toEqual(user);
  });
});

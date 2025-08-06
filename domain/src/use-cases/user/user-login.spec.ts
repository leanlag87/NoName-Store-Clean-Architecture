import { describe, test, expect, beforeEach } from "vitest";
import {
  mockUserRepository,
  MockedUserRepository,
} from "../../mocks/user-repository-mock";
import {
  UserLogin,
  UserLoginDependencies,
  UserLoginRequestModel,
} from "./user-login";
import { createAuthenticationError } from "../../errors/error";
import { createCryptoServiceMock } from "../../mocks/crypto-service-mock";

describe("User Login Use Case", () => {
  let _mockedUserRepository: MockedUserRepository;
  let _dependencies: UserLoginDependencies;

  beforeEach(() => {
    _mockedUserRepository = mockUserRepository([]);
    _dependencies = {
      users: _mockedUserRepository,
      crypto: createCryptoServiceMock(),
    };
    _mockedUserRepository.create({
      id: "user-id",
      email: "test@email.com",
      password: "[HASHED]12345678",
      name: "Test User",
      surname: "Surname Test",
      validated: true,
      locked: false,
      role: "user",
    });
  });

  test("should login successfully with correct credentials", async () => {
    const payload: UserLoginRequestModel = {
      email: "test@email.com",
      password: "12345678",
    };
    const result = await UserLogin(_dependencies, payload);
    expect(result).toHaveProperty("email", payload.email);
  });

  test("should fail if email does not exist", async () => {
    const payload: UserLoginRequestModel = {
      email: "notfound@email.com",
      password: "12345678",
    };
    const result = await UserLogin(_dependencies, payload);
    expect(result).toEqual(createAuthenticationError());
  });

  test("should fail if password is incorrect", async () => {
    const payload: UserLoginRequestModel = {
      email: "test@email.com",
      password: "wrongpasswordx234QW",
    };
    const result = await UserLogin(_dependencies, payload);
    expect(result).toEqual(createAuthenticationError());
  });
});

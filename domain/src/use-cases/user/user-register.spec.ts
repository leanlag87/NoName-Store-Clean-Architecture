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

describe("User register use case", () => {
  let _mockedUserRepository: MockedUserRepository = mockUserRepository([]);
  let _dependencies: UserRegisterDependencies;

  beforeEach(() => {
    _mockedUserRepository = mockUserRepository([]);
    _dependencies = {
      users: _mockedUserRepository,
    };
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

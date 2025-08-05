import { describe, it, expect, beforeEach, vi } from "vitest";
import { userService, getUserForResponse } from "./user.service";
import { User } from "@domain/entities/User";
import UserModel from "../../database/models/user";

vi.mock("../../database/models/user"); //UserModel como mock

describe("userService", () => {
  let service: ReturnType<typeof userService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = userService();
  });

  describe("findByEmail", () => {
    it("should return user when exists", async () => {
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@test.com",
        password: "password123",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(UserModel.findOne).mockResolvedValue(mockUser as any);

      const result = await service.findByEmail("test@test.com");

      expect(result).toEqual({
        id: "1",
        name: "Test User",
        email: "test@test.com",
        password: "password123",
        role: "user",
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it("should throw NotFoundError when user does not exist", async () => {
      vi.mocked(UserModel.findOne).mockResolvedValue(null);

      await expect(service.findByEmail("nonexistent@test.com")).rejects.toEqual(
        {
          type: "Not Found",
          message: "No existe un usuario con el email nonexistent@test.com",
          httpStatus: 404,
        }
      );
    });
  });

  describe("findById", () => {
    it("should return user when exists", async () => {
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@test.com",
        password: "password123",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(UserModel.findByPk).mockResolvedValue(mockUser as any);

      const result = await service.findById("1");

      expect((result as User).id).toBe("1");
      expect((result as User).name).toBe("Test User");
    });

    it("should throw NotFoundError when user does not exist", async () => {
      vi.mocked(UserModel.findByPk).mockResolvedValue(null);

      await expect(service.findById("999")).rejects.toEqual({
        type: "Not Found",
        message: "No existe un usuario con el ID 999",
        httpStatus: 404,
      });
    });
  });

  describe("create", () => {
    it("should create user successfully", async () => {
      const mockCreatedUser = {
        id: 1,
        name: "New User",
        email: "new@test.com",
        password: "password123",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(UserModel.create).mockResolvedValue(mockCreatedUser as any);

      const newUser: User = {
        id: undefined,
        name: "New User",
        email: "new@test.com",
        password: "password123",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await service.create(newUser);

      expect(result.id).toBe("1");
      expect(result.name).toBe("New User");
      expect(UserModel.create).toHaveBeenCalledWith({
        name: "New User",
        email: "new@test.com",
        password: "password123",
        role: "user",
      });
    });

    it("should set default role to 'user'", async () => {
      const mockCreatedUser = {
        id: 1,
        name: "New User",
        email: "new@test.com",
        password: "password123",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(UserModel.create).mockResolvedValue(mockCreatedUser as any);

      const newUser: User = {
        id: undefined,
        name: "New User",
        email: "new@test.com",
        password: "password123",
        role: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await service.create(newUser);

      expect(UserModel.create).toHaveBeenCalledWith({
        name: "New User",
        email: "new@test.com",
        password: "password123",
        role: "user",
      });
    });
  });

  describe("save", () => {
    it("should call update when user has id", async () => {
      const updateSpy = vi.spyOn(service, "update").mockResolvedValue({
        id: "1",
        name: "Test User",
        email: "test@test.com",
        password: "password123",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User);

      const user: User = {
        id: "1",
        name: "Test User",
        email: "test@test.com",
        password: "password123",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await service.save(user);

      expect(updateSpy).toHaveBeenCalledWith(user);

      updateSpy.mockRestore();
    });

    it("should call create when user has no id", async () => {
      const createSpy = vi.spyOn(service, "create").mockResolvedValue({
        id: "1",
        name: "Test User",
        email: "test@test.com",
        password: "password123",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User);

      const user: User = {
        id: undefined,
        name: "Test User",
        email: "test@test.com",
        password: "password123",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await service.save(user);

      expect(createSpy).toHaveBeenCalledWith(user);

      createSpy.mockRestore();
    });
  });
});

describe("getUserForResponse", () => {
  it("should return DTO without password", () => {
    const user: User = {
      id: "1",
      name: "Test User",
      email: "test@test.com",
      password: "secret123",
      role: "user",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-02"),
    };

    const result = getUserForResponse(user);

    expect(result).toEqual({
      id: "1",
      name: "Test User",
      email: "test@test.com",
      role: "user",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-02"),
    });

    //Verificar que no incluye el password
    expect(result).not.toHaveProperty("password");
  });
});

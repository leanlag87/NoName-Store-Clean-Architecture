import { describe, it, expect, beforeEach } from "vitest";
import { cryptoService } from "./crypto.service";
import { User } from "@domain/entities/User";
import { CryptoRepository } from "@domain/repositories/crypto-repository";

describe("cryptoService", () => {
  let service: CryptoRepository;

  beforeEach(() => {
    service = cryptoService();
  });

  describe("generateNewID", () => {
    it("should generate a valid UUID", async () => {
      const id = await service.generateNewID();

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      expect(id).toMatch(uuidRegex);
      expect(typeof id).toBe("string");
      expect(id).toHaveLength(36);
    });

    it("should generate unique IDs", async () => {
      const id1 = await service.generateNewID();
      const id2 = await service.generateNewID();

      expect(id1).not.toBe(id2);
    });
  });

  describe("hashPassword", () => {
    it("should hash password successfully", async () => {
      const password = "testPassword123";
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).not.toBe(password);
      expect(typeof hashedPassword).toBe("string");
      expect(hashedPassword.length).toBeGreaterThan(50);
      expect(hashedPassword).toMatch(/^\$2b\$/);
    });

    it("should generate different hashes for same password", async () => {
      const password = "testPassword123";
      const hash1 = await service.hashPassword(password);
      const hash2 = await service.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it("should handle empty password", async () => {
      const emptyPassword = "";
      const hashedPassword = await service.hashPassword(emptyPassword);

      expect(hashedPassword).not.toBe(emptyPassword);
      expect(typeof hashedPassword).toBe("string");
    });
  });

  describe("comparePassword", () => {
    it("should return true for correct password", async () => {
      const password = "testPassword123";
      const hashedPassword = await service.hashPassword(password);

      const isValid = await service.comparePassword(password, hashedPassword);

      expect(isValid).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      const correctPassword = "testPassword123";
      const incorrectPassword = "wrongPassword456";
      const hashedPassword = await service.hashPassword(correctPassword);

      const isValid = await service.comparePassword(
        incorrectPassword,
        hashedPassword
      );

      expect(isValid).toBe(false);
    });

    it("should return false for empty password against hash", async () => {
      const password = "testPassword123";
      const hashedPassword = await service.hashPassword(password);

      const isValid = await service.comparePassword("", hashedPassword);

      expect(isValid).toBe(false);
    });

    it("should handle case sensitivity", async () => {
      const password = "TestPassword123";
      const hashedPassword = await service.hashPassword(password);

      const isValidLower = await service.comparePassword(
        "testpassword123",
        hashedPassword
      );
      const isValidCorrect = await service.comparePassword(
        "TestPassword123",
        hashedPassword
      );

      expect(isValidLower).toBe(false);
      expect(isValidCorrect).toBe(true);
    });
  });

  describe("generateJWT", () => {
    const mockUser: User = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Juan",
      surname: "Diaz",
      email: "juan.diaz@test.com",
      password: "hashedPassword123",
      role: "user",
      validated: true,
      locked: false,
      image: "avatar.jpg",
      token: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should generate a valid JWT token", async () => {
      const token = await service.generateJWT(mockUser);

      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT format: header.payload.signature
      expect(token.length).toBeGreaterThan(100);
    });

    it("should generate different tokens for different users", async () => {
      const user2: User = {
        ...mockUser,
        id: "different-id",
        email: "different@test.com",
      };

      const token1 = await service.generateJWT(mockUser);
      const token2 = await service.generateJWT(user2);

      expect(token1).not.toBe(token2);
    });

    it("should include user data in token payload", async () => {
      const token = await service.generateJWT(mockUser);

      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );

      expect(payload.id).toBe(mockUser.id);
      expect(payload.name).toBe(mockUser.name);
      expect(payload.surname).toBe(mockUser.surname);
      expect(payload.email).toBe(mockUser.email);
      expect(payload.role).toBe(mockUser.role);
      expect(payload.validated).toBe(mockUser.validated);
      expect(payload).toHaveProperty("iat");
      expect(payload).toHaveProperty("exp");
    });

    it("should set correct expiration time", async () => {
      const token = await service.generateJWT(mockUser);

      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      const now = Math.floor(Date.now() / 1000);
      const expectedExp = now + 24 * 60 * 60;

      expect(payload.exp).toBeCloseTo(expectedExp, -2);
    });
  });

  describe("validateToken", () => {
    const mockUser: User = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Juan",
      surname: "Diaz",
      email: "juan.diaz@test.com",
      password: "hashedPassword123",
      role: "user",
      validated: true,
      locked: false,
      image: "avatar.jpg",
      token: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should validate and decode valid token", async () => {
      const token = await service.generateJWT(mockUser);
      const decodedUser = await service.validateToken(token);

      expect(decodedUser.id).toBe(mockUser.id);
      expect(decodedUser.name).toBe(mockUser.name);
      expect(decodedUser.surname).toBe(mockUser.surname);
      expect(decodedUser.email).toBe(mockUser.email);
      expect(decodedUser.role).toBe(mockUser.role);
      expect(decodedUser.validated).toBe(mockUser.validated);
    });

    it("should reject invalid token", async () => {
      const invalidToken = "invalid.token.here";

      await expect(service.validateToken(invalidToken)).rejects.toThrow();
    });

    it("should reject malformed token", async () => {
      const malformedToken = "not-a-jwt-token";

      await expect(service.validateToken(malformedToken)).rejects.toThrow();
    });

    it("should reject empty token", async () => {
      const emptyToken = "";

      await expect(service.validateToken(emptyToken)).rejects.toThrow();
    });

    it("should reject token with wrong signature", async () => {
      const validToken = await service.generateJWT(mockUser);
      const [header, payload] = validToken.split(".");
      const wrongSignature = "wrong_signature";
      const tamperedToken = `${header}.${payload}.${wrongSignature}`;

      await expect(service.validateToken(tamperedToken)).rejects.toThrow();
    });
  });

  describe("generateRandomToken", () => {
    it("should generate a random token", async () => {
      const token = await service.generateRandomToken();

      expect(typeof token).toBe("string");
      expect(token.length).toBe(64);
      expect(token).toMatch(/^[0-9a-f]+$/i);
    });

    it("should generate unique tokens", async () => {
      const token1 = await service.generateRandomToken();
      const token2 = await service.generateRandomToken();

      expect(token1).not.toBe(token2);
    });

    it("should generate tokens with consistent format", async () => {
      const tokens = await Promise.all([
        service.generateRandomToken(),
        service.generateRandomToken(),
        service.generateRandomToken(),
      ]);

      tokens.forEach((token) => {
        expect(token.length).toBe(64);
        expect(token).toMatch(/^[0-9a-f]+$/i);
      });
    });
  });

  describe("Integration tests", () => {
    it("should work with complete password flow", async () => {
      const originalPassword = "mySecurePassword123";

      const hashedPassword = await service.hashPassword(originalPassword);

      const isCorrectPassword = await service.comparePassword(
        originalPassword,
        hashedPassword
      );
      expect(isCorrectPassword).toBe(true);

      const isIncorrectPassword = await service.comparePassword(
        "wrongPassword",
        hashedPassword
      );
      expect(isIncorrectPassword).toBe(false);
    });

    it("should work with complete JWT flow", async () => {
      const user: User = {
        id: "user-123",
        name: "Test",
        surname: "User",
        email: "test@example.com",
        password: "hashed",
        role: "admin",
        validated: true,
        locked: false,
        image: undefined,
        token: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const token = await service.generateJWT(user);

      const decodedUser = await service.validateToken(token);

      expect(decodedUser.id).toBe(user.id);
      expect(decodedUser.email).toBe(user.email);
      expect(decodedUser.role).toBe(user.role);
    });

    it("should generate different types of IDs and tokens", async () => {
      const uuid = await service.generateNewID();
      const randomToken = await service.generateRandomToken();

      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
      expect(randomToken).toMatch(/^[0-9a-f]{64}$/i);

      expect(uuid.length).toBe(36);
      expect(randomToken.length).toBe(64);
      expect(uuid).not.toBe(randomToken);
    });
  });
});

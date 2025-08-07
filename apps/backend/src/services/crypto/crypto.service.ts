import { User } from "@domain/entities/User";
import { CryptoRepository } from "@domain/repositories/crypto-repository";
import { JWT_SECRET_KEY } from "src/env";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export function cryptoService(): CryptoRepository {
  return {
    generateNewID: async function (): Promise<string> {
      return crypto.randomUUID();
    },

    hashPassword: async function (password: string): Promise<string> {
      return bcrypt.hash(password, SALT_ROUNDS);
    },

    comparePassword: async function (
      password: string,
      hashedPassword: string
    ): Promise<boolean> {
      return bcrypt.compare(password, hashedPassword);
    },

    generateJWT: async function (user: User): Promise<string> {
      const payload = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        validated: user.validated,
      };

      return new Promise((resolve, reject) => {
        jwt.sign(
          payload,
          JWT_SECRET_KEY,
          { expiresIn: "24h" },
          (err, token) => {
            if (err) return reject(err);
            resolve(token as string);
          }
        );
      });
    },

    validateToken: async function (token: string): Promise<User> {
      return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded as User);
        });
      });
    },

    generateRandomToken: async function (): Promise<string> {
      return crypto.randomBytes(32).toString("hex");
    },
  };
}

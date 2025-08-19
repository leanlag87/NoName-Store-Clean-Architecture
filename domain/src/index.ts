// Entities
export * from "./entities/User";
export * from "./entities/Product";
export * from "./entities/Cart";

// Errors
export * from "./errors/error";

// Repositories
export * from "./repositories/user-repository";
export * from "./repositories/product-repository";
export * from "./repositories/cart-repository";
export * from "./repositories/crypto-repository";

// Use Cases
export * from "./use-cases/user/user-register";
export * from "./use-cases/user/user-login";
export * from "./use-cases/product/create.product";
export * from "./use-cases/cart/add-to-cart";

/**
 * ¿Para qué sirve?
Este archivo index.ts actúa como punto de entrada único del dominio, permitiendo que desde el backend puedas importar así:

// En lugar de:
import { userRegister } from "@domain/use-cases/user/user-register";
import { User } from "@domain/entities/User";

// Podrás usar:
import { userRegister, User } from "@domain";
 */

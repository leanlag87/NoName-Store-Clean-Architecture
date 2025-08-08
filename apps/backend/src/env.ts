import dotenv from "dotenv";
import path from "path";

const envDir = path.resolve(__dirname, "environments");
dotenv.config({ path: path.join(envDir, ".env") });
dotenv.config({
  path: path.join(envDir, `.env.${process.env.NODE_ENV || "development"}`),
});

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 3000;
export const DB_DIALECT = process.env.DB_DIALECT || "mysql";
export const DB_HOST = process.env.DB_HOST || "127.0.0.1";
export const DB_NAME = process.env.DB_NAME || "noname_store";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_USERNAME = process.env.DB_USERNAME || "root";

export const JWT_SECRET_KEY =
  process.env.JWT_SECRET_KEY || "default_secret_key";

export default {
  NODE_ENV,
  PORT,
  db: {
    dialect: DB_DIALECT,
    host: DB_HOST,
    name: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
    username: DB_USERNAME,
  },

  jwt: {
    secretKey: JWT_SECRET_KEY,
  },
};

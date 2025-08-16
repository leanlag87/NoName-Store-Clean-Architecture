import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotenv.config({
  path: path.resolve(__dirname, "./environments/.env"),
});

import express, { NextFunction, Request, Response } from "express";
import { NODE_ENV, PORT } from "./env";

import userRoutes from "./routes/user.routes";
//import productRoutes from "./routes/product.routes";
//import cartRoutes from "./routes/cart.routes";
import sequelizeConnection from "./database/connection";

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "NoName Store API RESTful con TypeScript y Express",
  });
});

// API Routes
app.use("/api/users", userRoutes);
//app.use("/api/products", productRoutes);
//app.use("/api/carts", cartRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: "Recurso no encontrado",
  });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    ok: false,
    message: "Error interno del servidor",
  });
});

// Database connection
sequelizeConnection
  .authenticate()
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

// Start server
try {
  app.listen(PORT, () => {
    console.log(
      `Servidor NoName Store corriendo en el puerto ${PORT} | MODO: ${
        NODE_ENV ? NODE_ENV.toUpperCase() : "TEST (default)"
      }`
    );
  });
} catch (error) {
  console.error("\n ERROR: Error al iniciar la aplicación:", error);
  process.exit(1);
}

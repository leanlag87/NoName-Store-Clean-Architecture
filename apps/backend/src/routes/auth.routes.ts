import { Router } from "express";
import { authController } from "../controllers/auth.controller";

const router = Router();

const { register } = authController();

router.post("/register", register);

// Aquí luego agregarás login y logout
// router.post("/login", login);
// router.post("/logout", logout);

export default router;

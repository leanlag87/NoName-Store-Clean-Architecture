import { Router } from "express";
import { authController } from "../controllers/auth.controller";

const router = Router();

const { register, login } = authController();

router.post("/register", register);
router.post("/login", login);
// router.post("/logout", logout);

export default router;

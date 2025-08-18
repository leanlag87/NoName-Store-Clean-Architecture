import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

const { registerNewUser } = userController();

router.post("/register", registerNewUser);

export default router;

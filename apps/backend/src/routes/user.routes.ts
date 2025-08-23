import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

const { getUserById } = userController();

router.get("/:id", getUserById);

export default router;

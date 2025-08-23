import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { requireAdmin } from "src/middleware/auth.middleware";

const router = Router();

const { getUserById, getAllUsers } = userController();

router.get("/:id", getUserById);
router.get("/", requireAdmin, getAllUsers);

export default router;

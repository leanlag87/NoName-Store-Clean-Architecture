import { userController } from "src/controllers/user.controller";

const controller = userController();
router.post("/register", controller.registerNewUser);
router.get("/profile", authMiddleware, controller.getCurrentUser);
router.get("/:id", controller.getUserById);
router.get("/", controller.getAllUsers);
router.put("/:id", authMiddleware, controller.updateUser);
router.delete("/:id", authMiddleware, controller.deleteUser);

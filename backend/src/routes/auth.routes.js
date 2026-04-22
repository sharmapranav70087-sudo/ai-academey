import { Router } from "express";
import { loginController, signupController, profileController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/profile", authMiddleware, profileController);

export default router;

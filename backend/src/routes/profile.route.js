import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getProfileController } from "../controllers/profile.controller.js";

const router = Router();

router.get("/profile", authMiddleware, getProfileController);

export default router;

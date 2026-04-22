import { Router } from "express";
import {
  createContentController,
  getContentsByModuleController
} from "../controllers/content.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";

const router = Router();

// ✅ ADMIN only → create content
router.post(
  "/contents",
  authMiddleware,
  requireAdmin,
  createContentController
);

// ✅ Protected (user must be logged in)
// optionally restrict further based on hasPaid
router.get(
  "/contents/:moduleId",
  authMiddleware,
  getContentsByModuleController
);

export default router;
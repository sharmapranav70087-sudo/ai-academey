import { Router } from "express";
import {
  createModuleController,
  getModulesByCourseController,
  purchaseModuleController,
  getAllModulesController
} from "../controllers/module.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post("/modules", authMiddleware, requireAdmin, createModuleController);

router.get("/modules", authMiddleware, getAllModulesController);
router.get("/modules/:courseId", authMiddleware, getModulesByCourseController);
router.post("/modules/:moduleId/purchase", authMiddleware, purchaseModuleController);

export default router;

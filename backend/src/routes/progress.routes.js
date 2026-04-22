import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import {getCourseProgress} from "../controllers/progress.controller.js"
import {getDashboard} from "../controllers/dashboard.controller.js"
const router = Router();
router.get(
  "/courses/:courseId/progress",
  authMiddleware ,
  getCourseProgress
);
router.get("/dashboard", authMiddleware, getDashboard);
export default router;

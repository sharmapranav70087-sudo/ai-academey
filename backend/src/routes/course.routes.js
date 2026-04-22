import { Router } from "express";
import {
  createCourseController,
  getCoursesController,
  getCourseByIdController,
  deleteCourseController
} from "../controllers/course.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post("/courses", authMiddleware, requireAdmin, createCourseController);
router.get("/courses", getCoursesController);
router.get("/courses/:id", getCourseByIdController);
router.delete("/courses/:id", authMiddleware, requireAdmin, deleteCourseController);

export default router;

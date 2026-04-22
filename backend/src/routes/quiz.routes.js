import { Router } from "express";
import {
  createQuiz,
  submitQuiz,
  getQuizzesByContentController
} from "../controllers/quiz.controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";

const router = Router();

// ✅ ADMIN → create quiz
router.post(
  "/quiz",
  authMiddleware,
  requireAdmin,
  createQuiz
);

// ✅ USER → get quiz for a content (to attempt)
router.get("/quizzes/:contentId", getQuizzesByContentController);

// ✅ USER → submit quiz
router.post(
  "/quiz/submit",
  authMiddleware,
  submitQuiz
);

export default router;
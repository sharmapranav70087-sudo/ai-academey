import { createQuizService,submitQuizService } from "../services/quiz.service.js";
import Quiz from "../models/Quiz.js";

export const submitQuiz = async (req, res) => {
  try {
    const { contentId, answers } = req.body;

    // 🔥 user comes from authMiddleware
    const userId = req.user.userId;
    console.log(userId)

    const result = await submitQuizService({
      contentId,
      answers,
      userId
    });

    res.status(200).json({
      message: "Quiz submitted successfully",
      result
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};
export const createQuiz = async (req, res) => {
  try {
    const { contentId, questions } = req.body;

    if (!contentId) {
      return res.status(400).json({ ok: false, error: "contentId is required" });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ ok: false, error: "questions must be a non-empty array" });
    }

    const created = await Quiz.create({ contentId, questions });
    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    return res.status(400).json({ ok: false, error: err.message });
  }
};

export const getQuizzesByContentController = async (req, res) => {
  try {
    const { contentId } = req.params;
    const quizzes = await Quiz.find({ contentId }).sort({ createdAt: -1 });
    return res.status(200).json({ ok: true, count: quizzes.length, data: quizzes });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
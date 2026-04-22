import Quiz from "../models/Quiz.js";
import Progress from "../models/Progress.js";



export const submitQuizService = async ({ contentId, answers, userId }) => {
  if (!contentId) throw new Error("contentId is required");
  if (!Array.isArray(answers)) throw new Error("answers must be an array");
  if (!userId) throw new Error("userId missing (auth required)");

  const quiz = await Quiz.findOne({ contentId });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  const total = quiz.questions.length;

  if (total === 0) {
    throw new Error("Quiz has no questions");
  }

  let score = 0;

  quiz.questions.forEach((q, index) => {
    const userAnswer = answers[index]; // safe access

    if (userAnswer === q.correctAnswer) {
      score++;
    }
  });

  const percentage = (score / total) * 100;
  const passed = percentage >= 50;

  // 🔥 Progress handling
  let progress = await Progress.findOne({ userId, contentId });

  if (!progress) {
    // first attempt
    progress = await Progress.create({
      userId,
      contentId,
      completed: passed
    });
  } else {
    // only upgrade (never downgrade)
    if (passed && !progress.completed) {
      progress.completed = true;
      await progress.save();
    }
  }

  return {
    totalQuestions: total,
    attempted: answers.length, // 🔥 useful info
    score,
    percentage: Number(percentage.toFixed(2)),
    passed,
    message: passed
      ? "🎉 Passed! Content marked as completed"
      : "❌ Failed! Score at least 50% to complete"
  };
};
export const createQuizService = async ({ contentId, questions }) => {
  // check if quiz already exists
  const existing = await Quiz.findOne({ contentId });

  if (existing) {
    throw new Error("Quiz already exists for this content");
  }

  const quiz = await Quiz.create({
    contentId,
    questions
  });

  return quiz;
};
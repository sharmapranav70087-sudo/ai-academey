import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
      unique: true, // one quiz per content
      index: true
    },

    questions: [
      {
        question: { type: String, required: true },

        options: [
          {
            text: { type: String, required: true }
          }
        ],

        correctAnswer: {
          type: Number, // index of correct option
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
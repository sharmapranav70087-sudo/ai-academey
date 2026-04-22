import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    unitNumber: {
      type: Number,
      required: true
    },

    items: [
      {
        type: {
          type: String,
          enum: ["video", "text", "quiz"],
          required: true
        },
        value: {
          type: String,
          required: true
        }
      }
    ],

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true
    }
  },
  { timestamps: true }
);

// ✅ THIS LINE WAS MISSING
const Content = mongoose.model("Content", contentSchema);

export default Content;
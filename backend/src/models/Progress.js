import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
      index: true
    },

    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// one record per user per content
progressSchema.index({ userId: 1, contentId: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
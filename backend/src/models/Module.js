import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 140
    },
    learningUnits: {
      type: Number,
      min: 1,
      default: 1
    },
    duration: {
      type: mongoose.Schema.Types.Mixed,
      validate: {
        validator: (v) => typeof v === "string" || typeof v === "number",
        message: "duration must be a string or number"
      }
    },
    isFree: {
      type: Boolean,
      default: false,
      index: true
    },
    price: {
      type: Number,
      min: 0,
      default: 0
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

moduleSchema.index({ courseId: 1, title: 1 });

export default mongoose.model("Module", moduleSchema);

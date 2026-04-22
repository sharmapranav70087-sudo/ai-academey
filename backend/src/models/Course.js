import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 140
    },
    description: {
      type: String,
      trim: true,
      maxlength: 3000
    },
    price: {
      type: Number,
      min: 0,
      default: 0
    },
    isFree: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

courseSchema.index({ title: 1 });

export default mongoose.model("Course", courseSchema);

import Module from "../models/Module.js";
import Content from "../models/Content.js";
import Progress from "../models/Progress.js";

export const getCourseProgressService = async ({ userId, courseId }) => {
  // 1. Get modules of this course
  const modules = await Module.find({ courseId }).select("_id");

  const moduleIds = modules.map(m => m._id);

  if (moduleIds.length === 0) {
    return { total: 0, completed: 0, percentage: 0 };
  }

  // 2. Get contents inside those modules
  const contents = await Content.find({
    moduleId: { $in: moduleIds }
  }).select("_id");

  const contentIds = contents.map(c => c._id);
  const total = contentIds.length;

  if (total === 0) {
    return { total: 0, completed: 0, percentage: 0 };
  }

  // 3. Count completed progress
  const completedCount = await Progress.countDocuments({
    userId,
    contentId: { $in: contentIds },
    completed: true
  });

  const percentage = (completedCount / total) * 100;

  return {
    total,
    completed: completedCount,
    percentage: Number(percentage.toFixed(2))
  };
};

export async function markContentCompleted({ userId, contentId }) {
  return Progress.findOneAndUpdate(
    { userId, contentId },
    { $set: { completed: true } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function getUserContentProgress({ userId, contentId }) {
  return Progress.findOne({ userId, contentId }).lean();
}
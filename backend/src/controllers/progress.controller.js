import { getCourseProgressService } from "../services/progress.service.js";

export const getCourseProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    const progress = await getCourseProgressService({
      userId,
      courseId
    });

    res.json({
      message: "Course progress fetched",
      progress
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
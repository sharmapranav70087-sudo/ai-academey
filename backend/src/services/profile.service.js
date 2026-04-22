import User from "../models/User.js";
import Progress from "../models/Progress.js";
import Certificate from "../models/Certificate.js";
import Content from "../models/Content.js";
import Module from "../models/Module.js";

export const getProfileService = async (userId) => {

  // USER
  const user = await User.findById(userId)
    .select("fullName email createdAt purchasedModules")
    .populate("purchasedModules", "title")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  // TOTAL CONTENTS
  const totalContents = await Content.countDocuments();

  // COMPLETED CONTENTS
  const completedContents = await Progress.countDocuments({
    userId,
    completed: true
  });

  // PROGRESS %
  const overallProgress =
    totalContents === 0
      ? 0
      : Math.round((completedContents / totalContents) * 100);

  // CERTIFICATES
  const certificates = await Certificate.find({ userId })
    .populate("courseId", "title")
    .lean();

  // COURSES COUNT
  const totalCourses = await Module.distinct("courseId");

  return {

    user: {
      fullName: user.fullName,
      email: user.email,
      joinedAt: user.createdAt
    },

    stats: {
      courses: totalCourses.length,
      completedContents,
      totalContents,
      overallProgress,
      certificates: certificates.length
    },

    purchasedModules: user.purchasedModules,

    certificates: certificates.map((cert) => ({
      id: cert._id,
      course: cert.courseId?.title || "Course",
      certificateUrl: cert.certificateUrl,
      issuedAt: cert.issuedAt
    }))
  };
};

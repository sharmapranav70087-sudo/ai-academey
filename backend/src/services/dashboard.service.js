import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Content from "../models/Content.js";
import Progress from "../models/Progress.js";
import { handleCertificate } from "./certificate.service.js";

const toPercent = (done, total) => (total > 0 ? Math.round((done / total) * 100) : 0);

async function countCompletedForUser(userId, contentIds) {
  if (!contentIds.length) return 0;
  return Progress.countDocuments({
    userId,
    contentId: { $in: contentIds },
    completed: true
  });
}

export const getDashboardService = async ({ userId }) => {
  // 🔹 1. Get all data
  const courses = await Course.find().lean();
  const modules = await Module.find().lean();
  const contents = await Content.find().lean();
  const progresses = await Progress.find({ userId, completed: true }).lean();

  const completedSet = new Set(
    progresses.map(p => p.contentId.toString())
  );

  // 🔹 GLOBAL
  const totalContents = contents.length;
  const completedContents = contents.filter(c =>
    completedSet.has(c._id.toString())
  ).length;

  const globalPercentage =
    totalContents === 0
      ? 0
      : (completedContents / totalContents) * 100;

  // 🔹 Build maps
  const moduleMap = {};
  modules.forEach(m => {
    moduleMap[m._id] = { ...m, contents: [] };
  });

  const courseMap = {};
  courses.forEach(c => {
    courseMap[c._id] = { ...c, modules: [] };
  });

  // attach contents → modules
  contents.forEach(c => {
    if (moduleMap[c.moduleId]) {
      moduleMap[c.moduleId].contents.push(c);
    }
  });

  // attach modules → courses
  modules.forEach(m => {
    if (courseMap[m.courseId]) {
      courseMap[m.courseId].modules.push(moduleMap[m._id]);
    }
  });

  // 🔹 Build response
  const courseResults = Object.values(courseMap).map(course => {
    let courseTotal = 0;
    let courseCompleted = 0;

    const moduleResults = course.modules.map(module => {
      const total = module.contents.length;
      const completed = module.contents.filter(c =>
        completedSet.has(c._id.toString())
      ).length;

      courseTotal += total;
      courseCompleted += completed;

      return {
        moduleId: module._id,
        title: module.title,
        progress: {
          total,
          completed,
          percentage:
            total === 0 ? 0 : Number(((completed / total) * 100).toFixed(2))
        }
      };
    });

    return {
      courseId: course._id,
      title: course.title,
      progress: {
        total: courseTotal,
        completed: courseCompleted,
        percentage:
          courseTotal === 0
            ? 0
            : Number(((courseCompleted / courseTotal) * 100).toFixed(2))
      },
      modules: moduleResults
    };
  });

  return {
    global: {
      total: totalContents,
      completed: completedContents,
      percentage: Number(globalPercentage.toFixed(2))
    },
    courses: courseResults
  };
};

export async function getDashboardData(userId) {
  const dashboardData = await getDashboardService(userId);

  // non-blocking + safe for sync/mocked implementations
  Promise.resolve(handleCertificate(userId, dashboardData)).catch((err) => {
    console.error("certificate trigger failed:", err?.message || err);
  });

  return dashboardData;
}
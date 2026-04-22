import path from "path";
import Certificate from "../models/Certificate.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import { generateCertificate } from "../utils/certificate.js";
import { sendCertificateEmail } from "../utils/email.js";

const toCourseId = (course) => {
  if (!course) return null;
  if (course.courseId) return String(course.courseId);
  if (course._id) return String(course._id);
  if (course.id) return String(course.id);
  if (course.course?._id) return String(course.course._id);
  return null;
};

const toCoursePercentage = (course) => {
  const value =
    course?.percentage ??
    course?.progressPercentage ??
    course?.progress?.percentage ??
    0;
  return Number(value) || 0;
};

export async function handleCertificate(userId, dashboardData) {
  const globalPercentage = Number(dashboardData?.global?.percentage || 0);
  if (globalPercentage < 100) return;

  const courses = Array.isArray(dashboardData?.courses) ? dashboardData.courses : [];
  const completed = courses.filter((c) => toCourseId(c) && toCoursePercentage(c) >= 100);

  if (!completed.length) return;

  const user = await User.findById(userId).lean();
  if (!user) return;

  for (const item of completed) {
    const courseId = toCourseId(item);
    if (!courseId) continue;

    const alreadyIssued = await Certificate.findOne({ userId, courseId }).lean();
    if (alreadyIssued) continue;

    const course = await Course.findById(courseId).lean();
    if (!course) continue;

    try {
      const filePath = await generateCertificate(user, course);
      const certificateUrl = `/certificates/${path.basename(filePath)}`;

      await Certificate.create({
        userId,
        courseId,
        certificateUrl,
        issuedAt: new Date()
      });

      const recipient = user.email || process.env.BREVO_TEST_TO;
      if (recipient) {
        await sendCertificateEmail({ to: recipient, filePath });
      } else {
        console.warn("certificate email skipped: no user.email and no BREVO_TEST_TO");
      }
    } catch (err) {
      if (err?.code !== 11000) {
        console.error("certificate generation/email failed:", err?.message || err);
      }
    }
  }
}

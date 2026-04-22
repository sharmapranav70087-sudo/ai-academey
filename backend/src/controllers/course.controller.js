import {
  createCourse,
  getCourses,
  getCourseById,
  deleteCourseById
} from "../services/course.service.js";

export async function createCourseController(req, res) {
  try {
    const course = await createCourse(req.body);
    return res.status(201).json({ ok: true, data: course });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function getCoursesController(_req, res) {
  try {
    const courses = await getCourses();
    return res.status(200).json({ ok: true, data: courses });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}

export async function getCourseByIdController(req, res) {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) return res.status(404).json({ ok: false, message: "Course not found" });
    return res.status(200).json({ ok: true, data: course });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function deleteCourseController(req, res) {
  try {
    const deleted = await deleteCourseById(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, message: "Course not found" });
    return res.status(200).json({ ok: true, message: "Course deleted" });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
}

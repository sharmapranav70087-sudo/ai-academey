import Course from "../models/Course.js";

export async function createCourse(payload) {
  return Course.create(payload);
}

export async function getCourses() {
  return Course.find().sort({ createdAt: -1 });
}

export async function getCourseById(id) {
  return Course.findById(id);
}

export async function deleteCourseById(id) {
  return Course.findByIdAndDelete(id);
}

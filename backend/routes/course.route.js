import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { createCourse, getMyCourses, getFacultyCourses, getAllCourses, getAvailableCourses, enrollStudent, unenrollFromCourse, getTotalCredits } from "../controllers/course.controller.js";

const router = express.Router();

router.use(protect);

router.get(
  "/my-credits",
  protect,
  allowRoles("student"),
  getTotalCredits
);

// Admin: list all courses
router.get("/", allowRoles("admin"), getAllCourses);

// Faculty create course
router.post("/", allowRoles("faculty"), createCourse);

// Students get their enrolled courses
router.get("/my", allowRoles("student"), getMyCourses);

// Students get available courses (not enrolled in) to browse and enroll
router.get("/available", allowRoles("student"), getAvailableCourses);

// Faculty get their courses
router.get("/faculty", allowRoles("faculty"), getFacultyCourses);

// Enrol student in the course
router.post("/:courseId/enroll", allowRoles("student"), enrollStudent);

// Unenroll student from the course
router.post("/:courseId/unenroll", allowRoles("student"), unenrollFromCourse);


export default router; 
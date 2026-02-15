import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { markAttendance, getMyAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

router.use(protect);

// FACULTY marks attendance
router.post("/:courseId", allowRoles("faculty"), markAttendance);

// STUDENT gets their attendance
router.get("/my/:courseId", allowRoles("student"), getMyAttendance);

// FACULTY gets full course report
// router.get("/course/:courseId", allowRoles("faculty"), getCourseAttendance);

export default router;
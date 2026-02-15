import express from "express";
import { createAssignment, getAssignmentsByCourse } from "../controllers/assignment.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/course/:courseId",
  protect,
  getAssignmentsByCourse
);

router.post(
  "/upload-assignment",
  protect,
  allowRoles("faculty"),
  upload.single("pdfFile"),
  createAssignment
);

export default router;
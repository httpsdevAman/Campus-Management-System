import express from "express";
import { submitAssignment, getSubmissionsByAssignment, getMySubmissions } from "../controllers/submission.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/upload-submission/:assignmentId",
    protect,
    allowRoles("student"), 
    upload.single("zipFile"),
    submitAssignment
);

router.get(
    "/assignment/:assignmentId",
    protect,
    allowRoles("faculty"),
    getSubmissionsByAssignment
);

router.get(
    "/my",
    protect,
    allowRoles("student"),
    getMySubmissions
)

export default router;
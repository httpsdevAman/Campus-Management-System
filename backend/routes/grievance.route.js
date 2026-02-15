import express from "express";
import {
    createGrievance,
    getMyGrievances,
    getAllGrievances,
    getGrievanceById,
    updateGrievanceStatus,
    assignGrievance,
    deleteGrievance
} from "../controllers/grievance.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/* Student + Faculty */
router.post("/", protect, allowRoles("student", "faculty"), createGrievance);
router.get("/my", protect, allowRoles("student", "faculty"), getMyGrievances);

/* Authority + Admin */
router.get("/", protect, allowRoles("authority", "admin"), getAllGrievances);
router.patch("/:id/status", protect, allowRoles("authority", "admin"), updateGrievanceStatus);

/* Shared access (with restrictions inside controller) */
router.get("/:id", protect, getGrievanceById);

/* Admin only */
router.patch("/:id/assign", protect, allowRoles("admin"), assignGrievance);
router.delete("/:id", protect, allowRoles("admin"), deleteGrievance);

export default router;
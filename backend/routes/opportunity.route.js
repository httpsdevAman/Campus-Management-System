import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

import {
  createOpportunity,
  getAllOpportunities,
  updateOpportunity,
  deleteOpportunity
} from "../controllers/opportunity.controller.js";

import {
  applyToOpportunity,
  getApplicants,
  updateApplicationStatus
} from "../controllers/application.controller.js";

const router = express.Router();

// Get all (everyone logged in)
router.get("/", protect, getAllOpportunities);

// Faculty create
router.post("/", protect, allowRoles("faculty"), createOpportunity);

// Faculty update
router.put("/:id", protect, allowRoles("faculty"), updateOpportunity);

// Faculty delete
router.delete("/:id", protect, allowRoles("faculty"), deleteOpportunity);

// Student apply
router.post("/apply/:id", protect, allowRoles("student"), applyToOpportunity);

// Faculty view all applicants; Student view their own application status
router.get("/:id/applicants", protect, allowRoles("faculty", "student"), getApplicants);

// Faculty accept/reject
router.put("/application/:id", protect, allowRoles("faculty"), updateApplicationStatus);

export default router;
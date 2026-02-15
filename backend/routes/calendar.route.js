import express from "express";
import {
  createFacultyEvent,
  createAdminEvent,
  updateEvent,
  updateFacultyEvent,
  deleteEvent
} from "../controllers/calendar.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { getCalendar } from "../controllers/calendar.controller.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/* 
   FACULTY CREATE (course only)
*/

router.post(
  "/faculty",
  protect,
  allowRoles("faculty"),
  createFacultyEvent
);

/* 
   ADMIN CREATE (global or course)
*/

router.post(
  "/admin",
  protect,
  allowRoles("admin"),
  createAdminEvent
);

/*
   ADMIN UPDATE
*/

router.put(
  "/admin/:id",
  protect,
  allowRoles("admin"),
  updateEvent
);

// Faculty Update
router.put(
  "/faculty/:id",
  protect,
  allowRoles("faculty"),
  updateFacultyEvent
);

/*
   ADMIN DELETE
*/

router.delete(
  "/:id",
  protect,
  allowRoles("admin"),
  deleteEvent
);

router.get(
  "/",
  protect,
  getCalendar
);

export default router;
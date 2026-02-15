import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { getUsersByRole, getUsersCount } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/count", protect, allowRoles("admin"), getUsersCount);
router.get("/", protect, allowRoles("admin"), getUsersByRole);

export default router;

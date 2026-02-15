import express from "express";
import {
    uploadResource,
    getResourcesByCourse,
    getSingleResource,
    deleteResource
} from "../controllers/resource.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Upload Resource (Faculty)
router.post( 
    "/upload-resource",
    protect,
    allowRoles("faculty"),
    upload.single("file"),
    uploadResource
);

// Get Resources by Course
router.get(
    "/course/:courseId",
    protect,
    getResourcesByCourse
);

// Get Single Resource
router.get(
    "/:id",
    protect,
    getSingleResource
);

// Delete Resource (Admin only)
router.delete(
    "/:id",
    protect,
    allowRoles("faculty"),
    deleteResource
);

export default router;
// src/routes/instructor.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import {
    getInstructorDashboard,
    getInstructorCourses,
    getCourseById,
    publishCourse,
    createCourse,
    updateCourse,
    deleteCourse,
} from "../controllers/instructor.contoller";
import { UserRole } from "../shared/Authtypes";

const router = Router();

// Require auth + instructor role for all these routes
router.use(authMiddleware, roleMiddleware([UserRole.Instructor]));

// Dashboard
router.get("/instructor-dashboard", getInstructorDashboard);

// Courses
router.get("/courses", getInstructorCourses);
router.get("/courses/:id", getCourseById); // Fetch single course
router.post("/courses", createCourse); // Create new course
router.put("/courses/:id", updateCourse); // Update course
router.delete("/courses/:id", deleteCourse); // Delete course
router.post("/courses/:courseId/publish", publishCourse); // Publish/unpublish

export default router;

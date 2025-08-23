// src/routes/progressRoutes.ts
import express from "express";
import { updateLessonProgress, getCourseProgress, updateCourseProgress } from "../controllers/progress.controller";
import { validateLessonProgress } from "../middleware/progess.middleware";
import { authMiddleware } from "../middleware/auth.middleware"; 

const router = express.Router();

// POST lesson progress
router.post("/lesson", authMiddleware, validateLessonProgress, updateLessonProgress);

// GET course progress
router.get("/course/:id", authMiddleware, getCourseProgress);

// PUT update overall course progress (recalculate)
router.put("/course/:id", authMiddleware, updateCourseProgress);

export default router;

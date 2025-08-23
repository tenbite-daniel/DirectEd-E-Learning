// src/middleware/validateProgress.ts
import { Request, Response, NextFunction } from "express";
import { LessonProgress } from "../types/progress";

export const validateLessonProgress = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lessonId, progress, lastWatched } = req.body as LessonProgress;

  if (!lessonId || progress === undefined || lastWatched === undefined) {
    return res.status(400).json({ message: "Invalid progress data" });
  }

  if (progress < 0 || progress > 100) {
    return res.status(400).json({ message: "Progress must be 0–100" });
  }

  next();
};

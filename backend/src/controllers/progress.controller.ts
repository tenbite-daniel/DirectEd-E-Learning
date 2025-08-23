// src/controllers/progressController.ts
import { Request, Response } from "express";
import { Progress } from "../models/progress.model";
import { LessonProgress } from "../types/progress";

export const updateLessonProgress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // comes from authMiddleware
    const { courseId, lessonId, completed, progress, lastWatched } = req.body as LessonProgress & { courseId: string };

    let courseProgress = await Progress.findOne({ userId, courseId });
    if (!courseProgress) {
      courseProgress = new Progress({ userId, courseId, lessons: [] });
    }

    // Update or insert lesson progress
    const lessonIndex = courseProgress.lessons.findIndex(l => l.lessonId === lessonId);
    if (lessonIndex > -1) {
      courseProgress.lessons[lessonIndex] = { lessonId, completed, progress, lastWatched };
    } else {
      courseProgress.lessons.push({ lessonId, completed, progress, lastWatched });
    }

    // Recalculate overall progress
    const totalLessons = courseProgress.lessons.length;
    const totalProgress = courseProgress.lessons.reduce((sum, l) => sum + l.progress, 0);
    courseProgress.overallProgress = Math.round(totalProgress / totalLessons);

    await courseProgress.save();

    res.json(courseProgress);
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error });
  }
};

export const getCourseProgress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const courseId = req.params.id;

    const courseProgress = await Progress.findOne({ userId, courseId });
    if (!courseProgress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.json(courseProgress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress", error });
  }
};

export const updateCourseProgress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const courseId = req.params.id;

    const courseProgress = await Progress.findOne({ userId, courseId });
    if (!courseProgress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    // Recalculate overall progress
    const totalLessons = courseProgress.lessons.length;
    const totalProgress = courseProgress.lessons.reduce((sum, l) => sum + l.progress, 0);
    courseProgress.overallProgress = Math.round(totalProgress / totalLessons);

    await courseProgress.save();

    res.json(courseProgress);
  } catch (error) {
    res.status(500).json({ message: "Error updating course progress", error });
  }
};

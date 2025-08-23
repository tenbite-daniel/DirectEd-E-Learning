// src/models/Progress.ts
import { Schema, model, Document } from "mongoose";
import { LessonProgress } from "../types/progress";

export interface ICourseProgress extends Document {
    courseId: string;
    userId: string;
    lessons: LessonProgress[];
    overallProgress: number;
}

const LessonProgressSchema = new Schema<LessonProgress>({
    lessonId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    lastWatched: { type: Number, default: 0 },
});

const CourseProgressSchema = new Schema<ICourseProgress>(
    {
        courseId: { type: String, required: true },
        userId: { type: String, required: true },
        lessons: [LessonProgressSchema],
        overallProgress: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Progress = model<ICourseProgress>(
    "Progress",
    CourseProgressSchema
);

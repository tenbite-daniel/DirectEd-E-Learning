// src/types/progress.ts
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  progress: number; // percentage (0–100)
  lastWatched: number; // seconds
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  lessons: LessonProgress[];
  overallProgress: number; // percentage across lessons
}

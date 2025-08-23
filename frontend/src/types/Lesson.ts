// src/types/lesson.ts
export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: number; // in seconds
  notes?: string;   // markdown notes
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  progress: number; // percentage 0–100
  lastWatched: number; // timestamp in seconds
}

export interface CourseProgress {
  courseId: string;
  lessons: LessonProgress[];
  overallProgress: number; // percentage
}

export interface VideoPlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
}

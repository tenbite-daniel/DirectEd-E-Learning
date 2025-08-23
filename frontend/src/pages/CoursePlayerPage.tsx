// src/pages/CoursePlayerPage.tsx
import React, { useState } from "react";
import LessonPlayer from "../components/modules/LessonPlayer";
import type{ Lesson, LessonProgress } from "../types/Lesson";

const lessons: Lesson[] = [
  { id: "1", title: "Intro", videoUrl: "/videos/intro.mp4", duration: 300, notes: "### Welcome to the course!" },
  { id: "2", title: "Lesson 2", videoUrl: "/videos/lesson2.mp4", duration: 600 },
];

const CoursePlayerPage: React.FC = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({});

  const handleProgressUpdate = (progress: LessonProgress) => {
    setProgressMap((prev) => ({ ...prev, [progress.lessonId]: progress }));
  };

  return (
    <LessonPlayer
      lesson={lessons[currentLessonIndex]}
      progress={progressMap[lessons[currentLessonIndex].id] || null}
      onProgressUpdate={handleProgressUpdate}
      onNextLesson={() =>
        setCurrentLessonIndex((i) => Math.min(i + 1, lessons.length - 1))
      }
      onPrevLesson={() =>
        setCurrentLessonIndex((i) => Math.max(i - 1, 0))
      }
    />
  );
};

export default CoursePlayerPage;

import React, { useState } from "react";
import LessonPlayer from "./LessonPlayer";
import type { LessonProgress } from "../../types/Lesson"; // It's a good practice to import this type

interface CourseViewProps {
    course: {
        title: string;
        modules: Array<{
            id: string;
            name: string;
            lessons: Array<{
                id: string;
                title: string;
                videoUrl: string;
                notes: string;
                duration: number;
            }>;
        }>;
    };
}

const CourseView: React.FC<CourseViewProps> = ({ course }) => {
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [progress, setProgress] = useState<{ [key: string]: LessonProgress }>(
        {}
    );
    const allLessons = course.modules.flatMap((module) => module.lessons);

    const currentLesson = allLessons[currentLessonIndex];

    const currentProgress = progress[currentLesson.id] || {
        lessonId: currentLesson.id, // This is the corrected line
        progress: 0,
        lastWatched: 0,
        completed: false,
    };

    const handleProgressUpdate = (newProgress: LessonProgress) => {
        setProgress((prev) => ({
            ...prev,
            [newProgress.lessonId]: newProgress,
        }));
    };

    const handleNextLesson = () => {
        if (currentLessonIndex < allLessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
        }
    };

    const handlePrevLesson = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(currentLessonIndex - 1);
        }
    };

    const handleLessonClick = (lessonId: string) => {
        const index = allLessons.findIndex((lesson) => lesson.id === lessonId);
        if (index !== -1) {
            setCurrentLessonIndex(index);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-800 pt-32">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content (Player & Notes) */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md">
                        <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                            {course.title}
                        </h1>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-2">
                            <span className="font-semibold">MODULE 1</span>
                            <span>•</span>
                            <span className="font-semibold">LESSON 1</span>
                            <div className="w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 ml-4">
                                <div
                                    className="bg-[#c27c26] h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${currentProgress.progress}%`,
                                    }}
                                ></div>
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-white">
                                {currentProgress.progress}%
                            </span>
                        </div>
                    </div>
                    <LessonPlayer
                        lesson={currentLesson}
                        progress={currentProgress}
                        onProgressUpdate={handleProgressUpdate}
                    />
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={handlePrevLesson}
                            className="px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                            disabled={currentLessonIndex === 0}
                        >
                            &lt; Previous
                        </button>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Autoplay
                            </span>
                            <label
                                htmlFor="autoplay-toggle"
                                className="relative inline-flex items-center cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    id="autoplay-toggle"
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600"></div>
                            </label>
                        </div>
                        <button
                            onClick={handleNextLesson}
                            className="px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                            disabled={
                                currentLessonIndex === allLessons.length - 1
                            }
                        >
                            Next &gt;
                        </button>
                    </div>
                </div>

                {/* Lesson List */}
                <div className="md:col-span-1 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Lessons
                    </h2>
                    {course.modules.map((module) => (
                        <div key={module.id} className="space-y-2">
                            {module.lessons.map((lesson) => (
                                <button
                                    key={lesson.id}
                                    onClick={() => handleLessonClick(lesson.id)}
                                    className={`w-full text-left p-4 rounded-lg shadow-md transition-colors duration-200 ${
                                        lesson.id === currentLesson.id
                                            ? "bg-[#c27c26] text-white"
                                            : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    <h4 className="font-semibold">
                                        {lesson.title}
                                    </h4>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseView;

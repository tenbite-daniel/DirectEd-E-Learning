import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Award, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    //Mock data for student dashboard
    const recentCourses = [
        {
            id: "1",
            title: "Modern CSS and Flexbox",
            progress: 67, // from progressData
            thumbnail:
                "https://images.unsplash.com/photo-1581091012184-2b28c30a57da?w=400&h=250&fit=crop",
            instructor: "Emily Davis",
            nextLesson: "Grid Layouts",
        },
        {
            id: "2",
            title: "AWS Cloud Fundamentals",
            progress: 0, // from progressData
            thumbnail:
                "https://images.unsplash.com/photo-1581091012184-9a21d6cfa6e5?w=400&h=250&fit=crop",
            instructor: "James Rodriguez",
            nextLesson: "Introduction to AWS",
        },
        {
            id: "3",
            title: "React Advanced Concepts",
            progress: 50, // from progressData
            thumbnail:
                "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
            instructor: "Liam Johnson",
            nextLesson: "Context API",
        },
        {
            id: "4",
            title: "Machine Learning with Python",
            progress: 100, // from progressData
            thumbnail:
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
            instructor: "Ava Brown",
            nextLesson: "Completed",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-6 mx-auto max-w-7xl">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {user?.role === "student"
                            ? "Continue your learning journey"
                            : "Manage your courses and students"}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {user?.role === "student"
                                        ? "Enrolled Courses"
                                        : "Total Courses"}
                                </h3>
                                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                    {user?.role === "student" ? "4" : "12"}
                                </p>
                            </div>
                            <div
                                className="p-3 rounded-full"
                                style={{ backgroundColor: "#006d3a20" }}
                            >
                                <BookOpen
                                    className="w-6 h-6"
                                    style={{ color: "#006d3a" }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {user?.role === "student"
                                        ? "Completed"
                                        : "Students"}
                                </h3>
                                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                    {user?.role === "student" ? "1" : "156"}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/20">
                                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {user?.role === "student"
                                        ? "Hours Learned"
                                        : "Revenue"}
                                </h3>
                                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                    {user?.role === "student" ? "10" : "$2,450"}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full dark:bg-purple-900/20">
                                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Continue Learning */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {user?.role === "student"
                                        ? "Continue Learning"
                                        : "Recent Courses"}
                                </h2>
                                <button
                                    onClick={() => navigate("/my-courses")}
                                    className="text-sm font-medium hover:underline"
                                    style={{ color: "#006d3a" }}
                                >
                                    View All
                                </button>
                            </div>

                            <div className="space-y-4">
                                {recentCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="flex items-center gap-4 p-4 transition-colors rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        onClick={() => navigate(`/my-courses`)}
                                    >
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="object-cover w-16 h-16 rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                by {course.instructor}
                                            </p>
                                            {user?.role === "student" && (
                                                <>
                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        Next:{" "}
                                                        {course.nextLesson}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="flex-1 h-2 bg-gray-200 rounded-full dark:bg-gray-600">
                                                            <div
                                                                className="h-2 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        "#006d3a",
                                                                    width: `${course.progress}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {course.progress}%
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => navigate("/courses")}
                                className="p-4 text-left transition-colors rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                <BookOpen
                                    className="w-8 h-8 mb-2"
                                    style={{ color: "#006d3a" }}
                                />
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Browse Courses
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Discover new learning opportunities
                                </p>
                            </button>

                            <button
                                onClick={() => navigate("/my-courses")}
                                className="p-4 text-left transition-colors rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                <Award className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    My Courses
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Track your learning journey
                                </p>
                            </button>
                            <button
                                onClick={() => navigate("/quiz")}
                                className="p-4 text-left transition-colors rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                <Award className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Take Quiz
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Assess your knowledge
                                </p>
                            </button>
                            <button
                                onClick={() => navigate("/assistant")}
                                className="p-4 text-left transition-colors rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                <Award className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    AI Assistant
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Get help with your studies
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;

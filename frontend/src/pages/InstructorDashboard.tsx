import React, { useEffect, useState } from "react";
import { fetchDashboardData } from "../api/instructorApi";
import type { InstructorDashboardData } from "../types/instructor";
import MetricsCard from "../components/analytics/MetricsCard";
import { Users, BookOpen, Badge } from "lucide-react";
import { Link } from "react-router-dom";

const InstructorDashboard: React.FC = () => {
    const [data, setData] = useState<InstructorDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData()
            .then((res) => {
                setData(res);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <p className="p-6 text-center text-gray-700 dark:text-gray-200">
                Loading...
            </p>
        );
    if (!data)
        return (
            <p className="p-6 text-center text-red-500">Failed to load data.</p>
        );

    return (
        <div className="pt-24 px-4 md:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
                Welcome Back
            </h1>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <Link to="/instructor/courses">
                    <MetricsCard
                        title="Total Courses"
                        value={data.totalCourses}
                        icon={<BookOpen className="text-[#395241]" />}
                    />
                </Link>
                <Link to="/instructor/:id/students">
                    <MetricsCard
                        title="Total Students"
                        value={3}
                        icon={<Users className="text-[#395241]" />}
                    />
                </Link>
            </div>

            {/* Overview Section */}
            <div className="text-gray-900 dark:text-white text-2xl font-bold text-center mb-6">
                Overview
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Assessments Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">
                        Assessments
                    </h2>
                    <div className="flex items-center mb-4">
                        <span className="mr-2 font-medium dark:text-white">
                            3 submitted
                        </span>
                        <div className="flex-1 bg-gray-300 rounded-full h-2 relative">
                            <div
                                className="bg-[#395241] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${100}%` }}
                            />
                        </div>
                        <span className="ml-2 font-medium dark:text-white">
                            0 left
                        </span>
                    </div>
                </div>

                {/* Top Learners Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">
                        Top Learners
                    </h2>
                    <ul className="space-y-2 mb-4">
                        <li className="flex justify-between items-center">
                            <span className="dark:text-white">1. John Doe</span>
                            <span className="text-green-500 font-semibold">
                                83 pts
                            </span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="dark:text-white">
                                2. Jane Smith
                            </span>
                            <span className="text-gray-400 font-semibold">
                                77 pts
                            </span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="dark:text-white">
                                3. Alex Johnson
                            </span>
                            <span className="text-yellow-600 font-semibold">
                                74 pts
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Quick Links Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md mb-10">
                <h2 className="text-3xl font-bold mb-6 text-center dark:text-white">
                    Quick Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        to="/instructor/courses/new"
                        className="bg-[#395241] text-white py-3 px-6 rounded-xl text-center font-semibold hover:bg-[#2e4034] transition shadow-md transform hover:scale-105"
                    >
                        Create Course
                    </Link>
                    <Link
                        to="/instructor/my-courses"
                        className="bg-[#395241] text-white py-3 px-6 rounded-xl text-center font-semibold hover:bg-[#2e4034] transition shadow-md transform hover:scale-105"
                    >
                        My Courses
                    </Link>
                    <Link
                        to="/quiz"
                        className="bg-[#395241] text-white py-3 px-6 rounded-xl text-center font-semibold hover:bg-[#2e4034] transition shadow-md transform hover:scale-105"
                    >
                        Create Quiz
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;

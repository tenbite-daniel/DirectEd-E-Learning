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

    if (loading) return <p className="p-6">Loading...</p>;
    if (!data) return <p className="p-6 text-red-500">Failed to load data.</p>;

    return (
        <div className="pt-28">
            <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">
                Welcome back
            </h1>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Link to={"/instructor/courses"}>
                    <MetricsCard
                        title="Total Courses"
                        value={data.totalCourses}
                        icon={<BookOpen />}
                    />
                </Link>
                <Link to={"/instructor/:id/students"}>
                    <MetricsCard
                        title="Total Students"
                        value={data.totalStudents}
                        icon={<Users />}
                    />
                </Link>
                <Link to={"/"}>
                    <MetricsCard
                        title="Course Progress"
                        value={`$${data.totalRevenue}`}
                        icon={<Badge />}
                    />
                </Link>
            </div>

            <div className="text-gray-900 dark:text-white pt-11 pb-5 text-2xl font-bold text-center">
                <h1>Overview</h1>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Assessments Card */}
                    <div className="bg-yellow-100 dark:bg-gray-700 rounded-xl p-6 shadow-md">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">
                            Assessments
                        </h2>
                        <div className="flex items-center mb-4">
                            <span className="mr-2 font-medium dark:text-white">
                                29 submitted
                            </span>
                            <div className="flex-1 bg-gray-300 rounded-full h-2 relative">
                                <div
                                    className="bg-yellow-600 h-2 rounded-full"
                                    style={{
                                        width: `${(29 / (29 + 8)) * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <span className="ml-2 font-medium dark:text-white">
                                8 left
                            </span>
                        </div>
                        <button className="bg-yellow-700 text-white px-4 py-2 rounded-md hover:bg-yellow-800">
                            See All Assignments
                        </button>
                    </div>

                    {/* Top Learners Card */}
                    <div className="bg-yellow-100 dark:bg-gray-700 rounded-xl p-6 shadow-md">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">
                            Top Learners
                        </h2>
                        <ul className="space-y-2 mb-4">
                            <li className="flex justify-between items-center">
                                <span className="dark:text-white">
                                    1. Mayweather Beckham
                                </span>
                                <span className="text-yellow-500 font-semibold">
                                    72pts
                                </span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="dark:text-white">
                                    2. Mary Anna
                                </span>
                                <span className="text-gray-400 font-semibold">
                                    67pts
                                </span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="dark:text-white">
                                    3. Noise Talerman
                                </span>
                                <span className="text-yellow-800 font-semibold">
                                    59pts
                                </span>
                            </li>
                        </ul>
                        <button className="bg-yellow-700 text-white px-4 py-2 rounded-md hover:bg-yellow-800 dark:text-white">
                            See All Learners
                        </button>
                    </div>

                    {/* My Schedule Card */}
                    <div className="bg-yellow-100 dark:bg-gray-700 rounded-xl p-6 shadow-md">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">
                            My Schedule
                        </h2>
                        <div className="flex space-x-2 mb-4">
                            {[
                                "Mo 17",
                                "Tu 18",
                                "We 19",
                                "Th 20",
                                "Fr 21",
                                "Sa 22",
                            ].map((day, i) => (
                                <div
                                    key={i}
                                    className={`px-3 py-1 rounded border ${
                                        day === "We 19"
                                            ? "bg-black text-white"
                                            : "bg-yellow-200"
                                    }`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                        <ul className="space-y-2 text-gray-700">
                            <li className="dark:text-white">
                                Web Development - Introduction to TypeScript
                            </li>
                            <li className="dark:text-white">
                                10:15AM - 12:45PM
                            </li>
                            <li className="dark:text-white">
                                Assignment Grading: 2:00PM - 2:40PM
                            </li>
                            <li className="dark:text-white">
                                Assignment Review: 3:50PM - 4:50PM
                            </li>
                        </ul>
                    </div>

                    {/*Uploads card */}
                    <div className="bg-yellow-100 dark:bg-gray-700 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center">
                        <h2 className="text-3xl font-bold mb-6 dark:text-white tracking-wide">
                            Uploads
                        </h2>
                        <div className="space-y-4 w-full px-4">
                            <Link
                                to={"/upload/video"}
                                className="bg-[#c27c26] text-[#fcf8e8] w-full py-3 px-6 rounded-xl hover:bg-[#a96b20] transition-colors duration-200 text-lg font-semibold text-center block shadow-lg transform hover:scale-105"
                            >
                                Upload Video
                            </Link>
                            <Link
                                to={"/upload/file"}
                                className="bg-[#c27c26] text-[#fcf8e8] w-full py-3 px-6 rounded-xl hover:bg-[#a96b20] transition-colors duration-200 text-lg font-semibold text-center block shadow-lg transform hover:scale-105"
                            >
                                Upload Files
                            </Link>
                            <Link
                                to={"/quiz"}
                                className="bg-[#c27c26] text-[#fcf8e8] w-full py-3 px-6 rounded-xl hover:bg-[#a96b20] transition-colors duration-200 text-lg font-semibold text-center block shadow-lg transform hover:scale-105"
                            >
                                Create Quiz
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;

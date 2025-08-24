import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    fetchCourses,
    deleteCourse as apiDeleteCourse,
} from "../../api/instructorApi";
import type { Course } from "../../types/instructor";
import { Plus, Edit, BookOpen, Trash2 } from "lucide-react";

const Courses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchCourses();
            if (Array.isArray(data)) setCourses(data);
            else if (Array.isArray((data as any)?.courses))
                setCourses((data as any).courses);
            else setCourses([]);
        } catch (err) {
            console.error(err);
            setError("Failed to load courses. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const handleDelete = async (courseId: string) => {
        if (!window.confirm("Are you sure you want to delete this course?"))
            return;
        try {
            await apiDeleteCourse(courseId);
            setCourses((prev) => prev.filter((c) => c._id !== courseId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete course.");
        }
    };

    if (loading)
        return (
            <p className="p-6 text-center text-gray-600 dark:text-gray-300">
                Loading courses...
            </p>
        );
    if (error)
        return (
            <div className="p-6 text-center text-red-600 dark:text-red-400">
                {error}{" "}
                <button
                    onClick={loadCourses}
                    className="underline text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                    Retry
                </button>
            </div>
        );

    return (
        <div className="p-6 max-w-5xl mx-auto mt-20">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Courses
                    </h1>
                </div>
                <Link
                    to="/instructor/courses/new"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                    <Plus className="w-4 h-4" /> New Course
                </Link>
            </div>

            {courses.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-300">
                    No courses found.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr className="text-left">
                                <th className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                    Title
                                </th>
                                <th className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                    Price
                                </th>
                                <th className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                    Published
                                </th>
                                <th className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr
                                    key={course._id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                        {course.title}
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                        ${course.price}
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                        {course.published ? (
                                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300 rounded">
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300 rounded">
                                                No
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex gap-2">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/instructor/courses/${course._id}`
                                                )
                                            }
                                            className="flex items-center gap-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        >
                                            <Edit className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(course._id)
                                            }
                                            className="flex items-center gap-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />{" "}
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Courses;

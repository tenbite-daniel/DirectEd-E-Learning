import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
    createCourse,
    updateCourse,
    fetchCourseById,
} from "../api/instructorApi";
import type { Lesson } from "../types/instructor";
import { Plus, Trash2, Save, Book } from "lucide-react";

type CourseFormValues = {
    title: string;
    description: string;
    price: number;
    published: boolean;
    lessons: Lesson[];
};

const CourseForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(!!id);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { isSubmitting },
    } = useForm<CourseFormValues>({
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            published: false,
            lessons: [{ title: "", videoUrl: "", duration: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "lessons",
    });

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetchCourseById(id)
            .then((course) => {
                if (course) {
                    reset({
                        title: course.title || "",
                        description: course.description || "",
                        price: course.price || 0,
                        published: course.published || false,
                        lessons:
                            Array.isArray(course.lessons) &&
                            course.lessons.length
                                ? course.lessons
                                : [{ title: "", videoUrl: "", duration: 0 }],
                    });
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id, reset]);

    const onSubmit = async (data: CourseFormValues) => {
        try {
            if (id) await updateCourse(id, data);
            else await createCourse(data);
            navigate("/instructor/courses");
        } catch (err) {
            console.error(err);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-600 dark:text-gray-300">
                    Loading course...
                </p>
            </div>
        );

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <Book className="w-6 h-6 text-indigo-600" />
                <h1 className="text-3xl font-bold">
                    {id ? "Edit Course" : "Create Course"}
                </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input
                        {...register("title", { required: true })}
                        placeholder="Course Title"
                        className="w-full border rounded-md p-2 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        Description
                    </label>
                    <textarea
                        {...register("description", { required: true })}
                        className="w-full border rounded-md p-2 dark:bg-gray-800 dark:text-white"
                        rows={4}
                        placeholder="Write a course description"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        Price (USD)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("price", {
                            required: true,
                            valueAsNumber: true,
                        })}
                        placeholder="Price"
                        className="w-full border rounded-md p-2 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        {...register("published")}
                        className="w-5 h-5"
                    />
                    <label className="font-medium">Published</label>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">Lessons</h2>
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="border p-4 rounded-lg mb-4 bg-gray-50 dark:bg-gray-800"
                        >
                            <div className="mb-2">
                                <label className="block font-medium mb-1">
                                    Lesson Title
                                </label>
                                <input
                                    {...register(
                                        `lessons.${index}.title` as const,
                                        { required: true }
                                    )}
                                    placeholder="Lesson Title"
                                    className="w-full border rounded-md p-2 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block font-medium mb-1">
                                    Video URL
                                </label>
                                <input
                                    {...register(
                                        `lessons.${index}.videoUrl` as const,
                                        { required: true }
                                    )}
                                    placeholder="https://video-link.com"
                                    className="w-full border rounded-md p-2 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block font-medium mb-1">
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    {...register(
                                        `lessons.${index}.duration` as const,
                                        { required: true, valueAsNumber: true }
                                    )}
                                    placeholder="Duration"
                                    className="w-full border rounded-md p-2 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="flex items-center gap-2 text-red-600 hover:underline"
                            >
                                <Trash2 className="w-4 h-4" /> Remove Lesson
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            append({ title: "", videoUrl: "", duration: 0 })
                        }
                        className="flex items-center gap-2 px-4 py-2 mt-2 border rounded-md text-indigo-600 hover:bg-indigo-50 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                        <Plus className="w-4 h-4" /> Add Lesson
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    <Save className="w-4 h-4" />{" "}
                    {isSubmitting
                        ? "Saving..."
                        : id
                        ? "Update Course"
                        : "Create Course"}
                </button>
            </form>
        </div>
    );
};

export default CourseForm;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getQuizByLesson, setAuthToken } from "../../api/quizApi";
import { type Quiz } from "../../shared/quiztypes";

// Extend the Quiz type to include createdAt
interface QuizWithMetadata extends Quiz {
    createdAt?: string;
    updatedAt?: string;
}

const ViewQuizPage: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const { token } = useAuth();
    const [quiz, setQuiz] = useState<QuizWithMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Set token and fetch quiz
    useEffect(() => {
        if (!lessonId || !token) {
            console.log("Missing lessonId or token:", {
                lessonId,
                token: token ? "present" : "missing",
            });
            return;
        }

        const fetchQuiz = async () => {
            try {
                setLoading(true);
                setError(null); // Clear previous errors

                console.log(
                    "Setting auth token and fetching quiz for lesson:",
                    lessonId
                );
                console.log("Token present:", !!token);
                setAuthToken(token);

                const data = (await getQuizByLesson(
                    lessonId
                )) as QuizWithMetadata;
                console.log("Quiz loaded successfully:", data);
                setQuiz(data);
            } catch (err) {
                console.error("Error loading quiz:", err);
                let errorMessage = "Failed to load quiz";

                // Handle Axios errors specifically
                if (err && typeof err === "object" && "response" in err) {
                    const axiosError = err as {
                        response?: {
                            data?: { message?: string };
                            status?: number;
                            statusText?: string;
                        };
                        message?: string;
                    };

                    const status = axiosError.response?.status;
                    const serverMessage = axiosError.response?.data?.message;

                    if (status === 401) {
                        errorMessage =
                            serverMessage ||
                            "Authentication failed. Please log in again.";
                    } else if (status === 403) {
                        errorMessage =
                            serverMessage ||
                            "You don't have permission to view this quiz.";
                    } else if (status === 404) {
                        errorMessage =
                            serverMessage || "Quiz not found for this lesson.";
                    } else {
                        errorMessage =
                            serverMessage || axiosError.message || errorMessage;
                    }
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }

                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [lessonId, token]);

    if (loading)
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>Error:</strong> {error}
                </div>
            </div>
        );

    if (!quiz)
        return (
            <div className="max-w-4xl mx-auto p-6">
                <p>No quiz found for lesson {lessonId}</p>
            </div>
        );

    // Helper function to safely format date
    const formatCreatedDate = (quiz: QuizWithMetadata): string => {
        if (quiz.createdAt) {
            try {
                return new Date(quiz.createdAt).toLocaleDateString();
            } catch {
                return "Invalid date";
            }
        }
        return "Not available";
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-blue-900">
                        {quiz.title}
                    </h1>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        📋 Instructor Preview
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="font-medium text-gray-600">
                            Lesson ID:
                        </span>
                        <p className="text-gray-900">{quiz.lessonId}</p>
                    </div>
                    <div>
                        <span className="font-medium text-gray-600">
                            Total Questions:
                        </span>
                        <p className="text-gray-900">
                            {quiz.questions?.length || 0}
                        </p>
                    </div>
                    <div>
                        <span className="font-medium text-gray-600">
                            Question Types:
                        </span>
                        <p className="text-gray-900">
                            {[
                                ...new Set(
                                    quiz.questions?.map((q) =>
                                        q.type.replace("-", " ")
                                    ) || []
                                ),
                            ].join(", ")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Questions Preview */}
            <div className="space-y-6">
                {quiz.questions &&
                    quiz.questions.map((question, index) => (
                        <div
                            key={question._id}
                            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                        >
                            {/* Question Header */}
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Question {index + 1}
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                                        {question.type.replace("-", " ")}
                                    </span>
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                                        Answer: {question.correctAnswer}
                                    </span>
                                </div>
                            </div>

                            {/* Question Text */}
                            <p className="text-lg mb-4 text-gray-900">
                                {question.text}
                            </p>

                            {/* Question Options/Format */}
                            {question.type === "multiple-choice" &&
                                question.options && (
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 mb-2">
                                            Available Options:
                                        </p>
                                        <ul className="space-y-1">
                                            {question.options.map(
                                                (option, optIndex) => (
                                                    <li
                                                        key={optIndex}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <span
                                                            className={`w-2 h-2 rounded-full ${
                                                                option ===
                                                                question.correctAnswer
                                                                    ? "bg-green-500"
                                                                    : "bg-gray-300"
                                                            }`}
                                                        ></span>
                                                        <span
                                                            className={
                                                                option ===
                                                                question.correctAnswer
                                                                    ? "font-medium text-green-700"
                                                                    : "text-gray-700"
                                                            }
                                                        >
                                                            {option}{" "}
                                                            {option ===
                                                                question.correctAnswer &&
                                                                "✓ Correct"}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                            {question.type === "true-false" && (
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 mb-2">
                                        Format: True/False Question
                                    </p>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    question.correctAnswer ===
                                                    "true"
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                }`}
                                            ></span>
                                            <span
                                                className={
                                                    question.correctAnswer ===
                                                    "true"
                                                        ? "font-medium text-green-700"
                                                        : "text-gray-700"
                                                }
                                            >
                                                True{" "}
                                                {question.correctAnswer ===
                                                    "true" && "✓ Correct"}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    question.correctAnswer ===
                                                    "false"
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                }`}
                                            ></span>
                                            <span
                                                className={
                                                    question.correctAnswer ===
                                                    "false"
                                                        ? "font-medium text-green-700"
                                                        : "text-gray-700"
                                                }
                                            >
                                                False{" "}
                                                {question.correctAnswer ===
                                                    "false" && "✓ Correct"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {question.type === "short-answer" && (
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 mb-2">
                                        Format: Short Answer (Text Input)
                                    </p>
                                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                        <p className="text-sm text-gray-600">
                                            Expected Answer:
                                        </p>
                                        <p className="font-medium text-green-700">
                                            {question.correctAnswer}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
            </div>

            {/* Footer Summary */}
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Quiz Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p>
                            <strong>Quiz ID:</strong> {quiz._id}
                        </p>
                        <p>
                            <strong>Created:</strong> {formatCreatedDate(quiz)}
                        </p>
                    </div>
                    <div>
                        <p>
                            <strong>Total Questions:</strong>{" "}
                            {quiz.questions?.length || 0}
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            <span className="text-green-600">Published</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewQuizPage;

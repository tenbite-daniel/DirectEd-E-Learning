// src/components/QuizPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuestionCard from "./QuestionCard";
import { useAuth } from "../hooks/useAuth";
import { setAuthToken } from "../api/axiosInstance";
import { getQuizByLesson, submitQuizAttempt } from "../api/quizApi";
import { type Quiz, type QuizAttempt } from "../shared/quiztypes";

const QuizPage: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const { user } = useAuth(); // user now has _id and token
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Set token in axios headers
    useEffect(() => {
        if (user?.token) {
            setAuthToken(user.token);
        }
    }, [user]);

    // Fetch quiz
    useEffect(() => {
        if (!lessonId) return;

        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const data = await getQuizByLesson(lessonId);
                setQuiz(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load quiz.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [lessonId]);

    // Handle answer selection
    const handleAnswer = (questionId: string, answer: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    // Submit quiz
    const handleSubmit = async () => {
        if (!quiz || !user) return;

        try {
            const attemptPayload = {
                quizId: quiz._id,
                userId: user._id,
                answers: Object.entries(answers).map(([qId, answer]) => ({
                    questionId: qId,
                    answer,
                })),
            };

            const result: QuizAttempt = await submitQuizAttempt(attemptPayload);
            setScore(result.score);
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setError("Failed to submit quiz.");
        }
    };

    if (loading) return <p>Loading quiz...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!quiz) return <p>No quiz found for this lesson.</p>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>

            {!submitted ? (
                <>
                    {quiz.questions.map((q) => (
                        <QuestionCard
                            key={q._id}
                            question={q}
                            onAnswer={(ans) => handleAnswer(q._id, ans)}
                        />
                    ))}

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                    >
                        Submit the Quiz
                    </button>
                </>
            ) : (
                <p className="text-green-600 font-bold text-xl">
                    You scored {score} / {quiz.questions.length}
                </p>
            )}
        </div>
    );
};

export default QuizPage;

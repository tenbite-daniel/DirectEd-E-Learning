// src/pages/Quiz/QuizPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useQuiz } from "../../hooks/useQuiz";

const QuizPage: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const { token, user } = useAuth();
    const { state, fetchQuiz, setAnswer, submitQuiz, resetQuizTaking } =
        useQuiz();

    const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
    const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {
        if (lessonId && token) {
            fetchQuiz(lessonId, token);
        }
    }, [lessonId, token, fetchQuiz]);

    // Timer logic
    useEffect(() => {
        if (timerActive && timeLeft > 0 && !state.submitted) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && timerActive && !state.submitted) {
            // Auto-submit when time runs out
            handleAutoSubmit();
        }
    }, [timeLeft, timerActive, state.submitted]);

    // Start timer when quiz loads
    useEffect(() => {
        if (state.currentQuiz && !state.submitted && !timerActive) {
            setTimerActive(true);
        }
    }, [state.currentQuiz, state.submitted, timerActive]);

    const handleAutoSubmit = async () => {
        setTimerActive(false);
        if (token && user?._id && state.currentQuiz) {
            await submitQuiz(user._id, token);
            alert("Time's up! Your quiz has been automatically submitted.");
        }
    };

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswer(questionId, value);
    };

    const handleSubmit = async () => {
        setTimerActive(false);
        if (token && user?._id && state.currentQuiz) {
            await submitQuiz(user._id, token);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Timer warning styles
    const getTimerColor = () => {
        if (timeLeft <= 30) return "text-red-600 animate-pulse";
        if (timeLeft <= 60) return "text-orange-500";
        return "text-gray-700";
    };

    const getTimerBgColor = () => {
        if (timeLeft <= 30) return "bg-red-100 border-red-300";
        if (timeLeft <= 60) return "bg-orange-100 border-orange-300";
        return "bg-blue-50 border-blue-200";
    };

    if (state.loading) return <p>Loading quiz...</p>;
    if (state.error) return <p className="text-red-600">{state.error}</p>;
    if (!state.currentQuiz) return <p>No quiz found for this lesson.</p>;

    // After submission: calculate score and show feedback
    if (state.submitted) {
        const totalQuestions = state.currentQuiz.questions.length;
        const correctAnswers = state.currentQuiz.questions.filter(
            (q) => state.answers[q._id] === q.correctAnswer
        ).length;

        const feedbackMessage =
            correctAnswers / totalQuestions === 1
                ? "Excellent! You got all correct 🎉"
                : correctAnswers / totalQuestions >= 0.7
                ? "Good job! Most answers are correct 👍"
                : "Keep trying! Review and try again 💡";

        return (
            <div className="max-w-3xl mx-auto p-4 text-center">
                <h2 className="text-3xl font-bold text-green-600 mb-4">
                    Quiz Submitted!
                </h2>
                <p className="text-xl mb-2">
                    Your score: {correctAnswers} / {totalQuestions}
                </p>
                <p className="mb-6">{feedbackMessage}</p>

                <div className="space-y-4 text-left">
                    {state.currentQuiz.questions.map((q, idx) => {
                        const userAnswer = state.answers[q._id] ?? "No answer";
                        const isCorrect = userAnswer === q.correctAnswer;
                        return (
                            <div
                                key={q._id}
                                className={`p-3 border rounded ${
                                    isCorrect
                                        ? "bg-green-50 border-green-300"
                                        : "bg-red-50 border-red-300"
                                }`}
                            >
                                <p className="font-medium">{`Q${idx + 1}: ${
                                    q.text
                                }`}</p>
                                <p>
                                    Your answer:{" "}
                                    <span
                                        className={
                                            isCorrect
                                                ? "text-green-700"
                                                : "text-red-700 font-medium"
                                        }
                                    >
                                        {userAnswer}
                                    </span>
                                </p>
                                {!isCorrect && (
                                    <p>
                                        Correct answer:{" "}
                                        <span className="text-green-700">
                                            {q.correctAnswer}
                                        </span>
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={resetQuizTaking}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Quiz-taking UI
    return (
        <div className="max-w-3xl mx-auto p-4">
            {/* Timer Display */}
            <div
                className={`fixed top-4 right-4 p-3 border rounded-lg shadow-lg ${getTimerBgColor()} transition-colors duration-300`}
            >
                <div className="text-center">
                    <p className="text-sm font-semibold mb-1">Time Remaining</p>
                    <p className={`text-2xl font-bold ${getTimerColor()}`}>
                        {formatTime(timeLeft)}
                    </p>
                </div>
            </div>

            {/* Low time warning modal */}
            {timeLeft <= 30 && timeLeft > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg text-center">
                        <h3 className="text-xl font-bold text-red-600 mb-4">
                            Time Almost Up!
                        </h3>
                        <p className="mb-4">
                            Only {timeLeft} seconds remaining. Submit your
                            answers soon!
                        </p>
                        <button
                            onClick={handleSubmit}
                            className="bg-red-600 text-white px-4 py-2 rounded mr-2"
                        >
                            Submit Now
                        </button>
                        <button
                            onClick={() => setTimerActive(true)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            <h1 className="text-2xl font-bold mb-4">
                {state.currentQuiz.title}
            </h1>

            {/* Progress indicator */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                        Answered: {Object.keys(state.answers).length}/
                        {state.currentQuiz.questions.length}
                    </span>
                    <span className="text-sm text-gray-600">
                        {formatTime(timeLeft)} remaining
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                            width: `${
                                (Object.keys(state.answers).length /
                                    state.currentQuiz.questions.length) *
                                100
                            }%`,
                        }}
                    ></div>
                </div>
            </div>

            {state.currentQuiz.questions.map((q, idx) => (
                <div key={q._id} className="mb-4 border p-3 rounded">
                    <p className="font-medium">{`Q${idx + 1}: ${q.text}`}</p>
                    {q.type === "multiple-choice" && q.options && (
                        <div className="ml-4">
                            {q.options.map((opt, i) => (
                                <label key={i} className="block">
                                    <input
                                        type="radio"
                                        name={q._id ?? `q-${idx}`}
                                        value={opt}
                                        checked={state.answers[q._id!] === opt}
                                        onChange={() =>
                                            handleAnswerChange(q._id!, opt)
                                        }
                                    />{" "}
                                    {opt}
                                </label>
                            ))}
                        </div>
                    )}
                    {q.type === "true-false" && (
                        <div className="ml-4">
                            {["true", "false"].map((opt) => (
                                <label key={opt} className="block">
                                    <input
                                        type="radio"
                                        name={q._id ?? `q-${idx}`}
                                        value={opt}
                                        checked={state.answers[q._id!] === opt}
                                        onChange={() =>
                                            handleAnswerChange(q._id!, opt)
                                        }
                                    />{" "}
                                    {opt}
                                </label>
                            ))}
                        </div>
                    )}
                    {q.type === "short-answer" && (
                        <input
                            type="text"
                            className="border p-1 w-full mt-2"
                            value={state.answers[q._id!] ?? ""}
                            onChange={(e) =>
                                handleAnswerChange(q._id!, e.target.value)
                            }
                            placeholder="Type your answer here..."
                        />
                    )}
                </div>
            ))}

            <div className="flex gap-4">
                <button
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
                    onClick={handleSubmit}
                    disabled={Object.keys(state.answers).length === 0}
                >
                    Submit Quiz
                </button>

                {timeLeft <= 60 && (
                    <button
                        className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
                        onClick={handleSubmit}
                    >
                        Submit Early
                    </button>
                )}
            </div>

            {/* Unanswered questions warning */}
            {Object.keys(state.answers).length <
                state.currentQuiz.questions.length && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
                    <p className="text-yellow-700">
                        ⚠️ You have{" "}
                        {state.currentQuiz.questions.length -
                            Object.keys(state.answers).length}{" "}
                        unanswered questions.
                    </p>
                </div>
            )}
        </div>
    );
};

export default QuizPage;

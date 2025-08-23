// src/pages/CreateQuizPage.tsx
import React, { useState } from "react";
import { createQuiz } from "../../api/quizApi";
import {
    type QuestionType,
    type NewQuiz,
    type NewQuestion,
} from "../../shared/quiztypes";

export const CreateQuizPage: React.FC = () => {
    const [quiz, setQuiz] = useState<NewQuiz>({
        title: "",
        lessonId: "",
        questions: [],
    });

    const addQuestion = () => {
        const newQuestion: NewQuestion = {
            text: "",
            type: "multiple-choice",
            options: [""],
            correctAnswer: "",
        };
        setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
    };

    const updateQuestion = <K extends keyof NewQuestion>(
        index: number,
        field: K,
        value: NewQuestion[K]
    ) => {
        const updated = [...quiz.questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuiz({ ...quiz, questions: updated });
    };

    const handleSave = async () => {
        try {
            await createQuiz(quiz);
            alert("Quiz created successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to create quiz");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>

            <input
                className="border p-2 mb-2 w-full"
                placeholder="Lesson ID"
                value={quiz.lessonId}
                onChange={(e) => setQuiz({ ...quiz, lessonId: e.target.value })}
            />

            <input
                className="border p-2 mb-2 w-full"
                placeholder="Quiz Title"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            />

            {quiz.questions.map((q, idx) => (
                <div key={idx} className="border p-3 mb-3 rounded">
                    <input
                        className="border p-2 mb-2 w-full"
                        placeholder="Question text"
                        value={q.text}
                        onChange={(e) =>
                            updateQuestion(idx, "text", e.target.value)
                        }
                    />

                    <select
                        className="border p-2 mb-2 w-full"
                        value={q.type}
                        onChange={(e) =>
                            updateQuestion(
                                idx,
                                "type",
                                e.target.value as QuestionType
                            )
                        }
                    >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                    </select>

                    {q.type === "multiple-choice" && (
                        <div>
                            {q.options?.map((opt, optIdx) => (
                                <input
                                    key={optIdx}
                                    className="border p-1 mb-1 w-full"
                                    placeholder={`Option ${optIdx + 1}`}
                                    value={opt}
                                    onChange={(e) => {
                                        const updated = [...quiz.questions];
                                        updated[idx].options![optIdx] =
                                            e.target.value;
                                        setQuiz({
                                            ...quiz,
                                            questions: updated,
                                        });
                                    }}
                                />
                            ))}
                            <button
                                type="button"
                                className="bg-gray-200 px-2 py-1 rounded"
                                onClick={() => {
                                    const updated = [...quiz.questions];
                                    updated[idx].options!.push("");
                                    setQuiz({ ...quiz, questions: updated });
                                }}
                            >
                                + Add Option
                            </button>
                        </div>
                    )}

                    <input
                        className="border p-2 mt-2 w-full"
                        placeholder="Correct Answer"
                        value={q.correctAnswer}
                        onChange={(e) =>
                            updateQuestion(idx, "correctAnswer", e.target.value)
                        }
                    />
                </div>
            ))}

            <button
                className="bg-blue-500 text-white px-3 py-2 rounded mr-2"
                onClick={addQuestion}
            >
                Add Question
            </button>

            <button
                className="bg-green-500 text-white px-3 py-2 rounded"
                onClick={handleSave}
            >
                Save Quiz
            </button>
        </div>
    );
};

export default CreateQuizPage;

// src/contexts/QuizContext.tsx
import React, { createContext, useReducer, useCallback } from "react";
import { type Quiz, type QuizAttempt } from "../shared/quiztypes";
import {
    getQuizByLesson,
    submitQuizAttempt,
    createQuiz,
    setAuthToken,
} from "../api/quizApi";

// Types
interface Question {
    _id?: string;
    type: "multiple-choice" | "true-false" | "short-answer";
    text: string;
    options?: string[];
    correctAnswer: string;
}

interface QuizDraft {
    title: string;
    lessonId: string;
    questions: Question[];
}

interface QuizState {
    // Current quiz being viewed/taken
    currentQuiz: Quiz | null;

    // Quiz draft for creation/editing
    quizDraft: QuizDraft | null;

    // Quiz taking state
    answers: { [questionId: string]: string };
    submitted: boolean;
    score: number | null;

    // UI state
    loading: boolean;
    error: string | null;
    success: boolean;
}

type QuizAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_SUCCESS"; payload: boolean }
    | { type: "SET_CURRENT_QUIZ"; payload: Quiz | null }
    | { type: "SET_QUIZ_DRAFT"; payload: QuizDraft }
    | { type: "UPDATE_QUIZ_DRAFT"; payload: Partial<QuizDraft> }
    | { type: "ADD_QUESTION_TO_DRAFT" }
    | {
          type: "UPDATE_QUESTION_IN_DRAFT";
          payload: { index: number; question: Partial<Question> };
      }
    | { type: "REMOVE_QUESTION_FROM_DRAFT"; payload: number }
    | { type: "SET_ANSWER"; payload: { questionId: string; answer: string } }
    | {
          type: "SET_QUIZ_RESULT";
          payload: { score: number; submitted: boolean };
      }
    | { type: "RESET_QUIZ_TAKING" }
    | { type: "RESET_QUIZ_DRAFT" }
    | { type: "CLEAR_ALL" };

const initialState: QuizState = {
    currentQuiz: null,
    quizDraft: null,
    answers: {},
    submitted: false,
    score: null,
    loading: false,
    error: null,
    success: false,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload };

        case "SET_ERROR":
            return { ...state, error: action.payload, loading: false };

        case "SET_SUCCESS":
            return { ...state, success: action.payload };

        case "SET_CURRENT_QUIZ":
            return {
                ...state,
                currentQuiz: action.payload,
                loading: false,
                error: null,
            };

        case "SET_QUIZ_DRAFT":
            return { ...state, quizDraft: action.payload };

        case "UPDATE_QUIZ_DRAFT":
            return {
                ...state,
                quizDraft: state.quizDraft
                    ? { ...state.quizDraft, ...action.payload }
                    : null,
            };

        case "ADD_QUESTION_TO_DRAFT": {
            if (!state.quizDraft) return state;
            const newQuestion: Question = {
                type: "multiple-choice",
                text: "",
                options: ["", "", "", ""],
                correctAnswer: "",
            };
            return {
                ...state,
                quizDraft: {
                    ...state.quizDraft,
                    questions: [...state.quizDraft.questions, newQuestion],
                },
            };
        }

        case "UPDATE_QUESTION_IN_DRAFT": {
            if (!state.quizDraft) return state;
            const { index, question } = action.payload;
            const updatedQuestions = state.quizDraft.questions.map((q, i) =>
                i === index ? { ...q, ...question } : q
            );
            return {
                ...state,
                quizDraft: {
                    ...state.quizDraft,
                    questions: updatedQuestions,
                },
            };
        }

        case "REMOVE_QUESTION_FROM_DRAFT": {
            if (!state.quizDraft) return state;
            const updatedQuestions = state.quizDraft.questions.filter(
                (_, i) => i !== action.payload
            );
            return {
                ...state,
                quizDraft: {
                    ...state.quizDraft,
                    questions: updatedQuestions,
                },
            };
        }

        case "SET_ANSWER":
            return {
                ...state,
                answers: {
                    ...state.answers,
                    [action.payload.questionId]: action.payload.answer,
                },
            };

        case "SET_QUIZ_RESULT":
            return {
                ...state,
                score: action.payload.score,
                submitted: action.payload.submitted,
                loading: false,
            };

        case "RESET_QUIZ_TAKING":
            return {
                ...state,
                answers: {},
                submitted: false,
                score: null,
                error: null,
            };

        case "RESET_QUIZ_DRAFT":
            return {
                ...state,
                quizDraft: null,
                error: null,
                success: false,
            };

        case "CLEAR_ALL":
            return initialState;

        default:
            return state;
    }
}

// Context
interface QuizContextType {
    state: QuizState;

    // Quiz fetching
    fetchQuiz: (lessonId: string, token: string) => Promise<void>;

    // Quiz creation
    initializeQuizDraft: (lessonId: string) => void;
    updateQuizDraft: (updates: Partial<QuizDraft>) => void;
    addQuestion: () => void;
    updateQuestion: (index: number, updates: Partial<Question>) => void;
    removeQuestion: (index: number) => void;
    saveQuiz: (token: string) => Promise<void>;

    // Quiz taking
    setAnswer: (questionId: string, answer: string) => void;
    submitQuiz: (userId: string, token: string) => Promise<void>;
    resetQuizTaking: () => void;

    // General
    clearError: () => void;
    resetQuizDraft: () => void;
    clearAll: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Provider component
export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(quizReducer, initialState);

    // Quiz fetching
    const fetchQuiz = useCallback(async (lessonId: string, token: string) => {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        try {
            setAuthToken(token);
            const quiz = await getQuizByLesson(lessonId);
            dispatch({ type: "SET_CURRENT_QUIZ", payload: quiz });
        } catch (error) {
            let errorMessage = "Failed to load quiz";

            if (error && typeof error === "object" && "response" in error) {
                const axiosError = error as {
                    response?: {
                        data?: { message?: string };
                        status?: number;
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
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            dispatch({ type: "SET_ERROR", payload: errorMessage });
        }
    }, []);

    // Quiz creation
    const initializeQuizDraft = useCallback((lessonId: string) => {
        dispatch({
            type: "SET_QUIZ_DRAFT",
            payload: {
                title: "",
                lessonId,
                questions: [],
            },
        });
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_SUCCESS", payload: false });
    }, []);

    const updateQuizDraft = useCallback((updates: Partial<QuizDraft>) => {
        dispatch({ type: "UPDATE_QUIZ_DRAFT", payload: updates });
    }, []);

    const addQuestion = useCallback(() => {
        dispatch({ type: "ADD_QUESTION_TO_DRAFT" });
    }, []);

    const updateQuestion = useCallback(
        (index: number, updates: Partial<Question>) => {
            dispatch({
                type: "UPDATE_QUESTION_IN_DRAFT",
                payload: { index, question: updates },
            });
        },
        []
    );

    const removeQuestion = useCallback((index: number) => {
        dispatch({ type: "REMOVE_QUESTION_FROM_DRAFT", payload: index });
    }, []);

    const saveQuiz = useCallback(
        async (token: string) => {
            if (!state.quizDraft) {
                dispatch({
                    type: "SET_ERROR",
                    payload: "No quiz draft to save",
                });
                return;
            }

            dispatch({ type: "SET_LOADING", payload: true });
            dispatch({ type: "SET_ERROR", payload: null });

            try {
                setAuthToken(token);
                await createQuiz(state.quizDraft);
                dispatch({ type: "SET_SUCCESS", payload: true });
                dispatch({ type: "SET_LOADING", payload: false });
            } catch (error) {
                let errorMessage = "Failed to create quiz";

                if (error && typeof error === "object" && "response" in error) {
                    const axiosError = error as {
                        response?: {
                            data?: { message?: string };
                            status?: number;
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
                            "You don't have permission to create quizzes.";
                    } else if (status === 400) {
                        errorMessage =
                            serverMessage ||
                            "Invalid quiz data. Please check your inputs.";
                    } else {
                        errorMessage =
                            serverMessage || axiosError.message || errorMessage;
                    }
                } else if (error instanceof Error) {
                    errorMessage = error.message;
                }

                dispatch({ type: "SET_ERROR", payload: errorMessage });
            }
        },
        [state.quizDraft]
    );

    // Quiz taking
    const setAnswer = useCallback((questionId: string, answer: string) => {
        dispatch({ type: "SET_ANSWER", payload: { questionId, answer } });
    }, []);

    const submitQuiz = useCallback(
        async (userId: string, token: string) => {
            if (!state.currentQuiz) {
                dispatch({ type: "SET_ERROR", payload: "No quiz to submit" });
                return;
            }

            dispatch({ type: "SET_LOADING", payload: true });

            try {
                setAuthToken(token);
                const attemptPayload = {
                    quizId: state.currentQuiz._id,
                    userId,
                    answers: Object.entries(state.answers).map(
                        ([qId, answer]) => ({
                            questionId: qId,
                            answer,
                        })
                    ),
                };

                const result: QuizAttempt = await submitQuizAttempt(
                    attemptPayload
                );
                dispatch({
                    type: "SET_QUIZ_RESULT",
                    payload: { score: result.score, submitted: true },
                });
            } catch (error) {
                let errorMessage = "Failed to submit quiz";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                dispatch({ type: "SET_ERROR", payload: errorMessage });
            }
        },
        [state.currentQuiz, state.answers]
    );

    const resetQuizTaking = useCallback(() => {
        dispatch({ type: "RESET_QUIZ_TAKING" });
    }, []);

    // General
    const clearError = useCallback(() => {
        dispatch({ type: "SET_ERROR", payload: null });
    }, []);

    const resetQuizDraft = useCallback(() => {
        dispatch({ type: "RESET_QUIZ_DRAFT" });
    }, []);

    const clearAll = useCallback(() => {
        dispatch({ type: "CLEAR_ALL" });
    }, []);

    const contextValue: QuizContextType = {
        state,
        fetchQuiz,
        initializeQuizDraft,
        updateQuizDraft,
        addQuestion,
        updateQuestion,
        removeQuestion,
        saveQuiz,
        setAnswer,
        submitQuiz,
        resetQuizTaking,
        clearError,
        resetQuizDraft,
        clearAll,
    };

    return (
        <QuizContext.Provider value={contextValue}>
            {children}
        </QuizContext.Provider>
    );
};

// Export the context for the custom hook
export { QuizContext, type QuizContextType };

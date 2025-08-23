import { api } from "./axiosInstance";
import { type Quiz, type QuizAttempt } from "../shared/quiztypes";

// Fetch quiz by lesson
export const getQuizByLesson = async (lessonId: string): Promise<Quiz> => {
    const res = await api.get(`/quizzes/${lessonId}`);
    return res.data;
};

// Submit quiz attempt
export const submitQuizAttempt = async (
    attempt: Omit<QuizAttempt, "_id" | "score">
) => {
    const res = await api.post(`/quiz-attempts`, attempt);
    return res.data;
};

// Get quiz attempts
export const getQuizAttempts = async (
    quizId: string
): Promise<QuizAttempt[]> => {
    const res = await api.get(`/quiz-attempts/${quizId}`);
    return res.data;
};

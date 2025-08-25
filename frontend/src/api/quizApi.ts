import axios from "axios";
import type {
    Quiz,
    NewQuiz,
    QuizAttempt,
    NewQuizAttempt,
} from "../shared/quiztypes";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export const api = axios.create({ baseURL: API_BASE });

export const setAuthToken = (token: string | null) => {
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete api.defaults.headers.common.Authorization;
};

export const getQuizByLesson = async (lessonId: string): Promise<Quiz> => {
    const res = await api.get<Quiz>(`/quizzes/${lessonId}`);
    return res.data;
};

// ✔ Accept NewQuiz (no IDs) and return Quiz (with IDs)
export const createQuiz = async (payload: NewQuiz): Promise<Quiz> => {
    const token = localStorage.getItem("token");
    const res = await api.post<Quiz>("/quizzes", payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const submitQuizAttempt = async (
    attempt: NewQuizAttempt
): Promise<QuizAttempt> => {
    const res = await api.post<QuizAttempt>("/quiz-attempts", attempt);
    return res.data;
};

export const getQuizAttempts = async (
    quizId: string
): Promise<QuizAttempt[]> => {
    const res = await api.get<QuizAttempt[]>(`/quiz-attempts/${quizId}`);
    return res.data;
};

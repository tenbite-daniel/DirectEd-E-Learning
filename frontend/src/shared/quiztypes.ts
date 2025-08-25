export type QuestionType = "multiple-choice" | "true-false" | "short-answer";

export interface NewQuestion {
    text: string;
    type: QuestionType;
    options?: string[];
    correctAnswer: string;
}

export interface Question extends NewQuestion {
    _id: string;
}

export interface NewQuiz {
    title: string;
    lessonId: string;
    questions: NewQuestion[];
}

export interface Quiz extends Omit<NewQuiz, "questions"> {
    _id: string;
    questions: Question[];
    duration?: number;
}

export interface QuizAttempt {
    _id: string;
    quizId: string;
    userId: string;
    answers: { questionId: string; answer: string }[];
    score: number;
}

// ✅ Use `type` instead of empty `interface`
export type NewQuizAttempt = Omit<QuizAttempt, "_id" | "score">;

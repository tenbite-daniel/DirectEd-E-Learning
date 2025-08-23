export type QuestionType = "multiple-choice" | "true-false" | "short-answer";

export interface Question {
  _id: string; // from backend
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
}

export interface Quiz {
  _id: string;
  title: string;
  lessonId: string;
  questions: Question[];
}

export interface QuizAttempt {
  _id: string;
  quizId: string;
  userId: string;
  answers: { questionId: string; answer: string }[];
  score: number;
}

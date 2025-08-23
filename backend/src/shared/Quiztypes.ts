import { Types } from "mongoose";

export type QuestionType = "multiple-choice" | "true-false" | "short-answer";

export interface Question {
  _id: Types.ObjectId;
  text: string;
  type: QuestionType;
  options?: string[]; // For multiple-choice
  correctAnswer: string;
}

export interface Quiz {
  title: string;
  lessonId: string;
  questions: Question[];
}

export interface QuizAttempt {
  quizId: Types.ObjectId; // <-- use ObjectId type
  userId: string;
  answers: { questionId: string; answer: string }[];
  score: number;
}

export interface SubmitQuizAttemptBody {
  quizId: string;
  userId: string;
  answers: { questionId: string; answer: string }[];
}

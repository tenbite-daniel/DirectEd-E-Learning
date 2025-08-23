import { Request, Response } from "express";
import Quiz from "../models/quiz.model";

// GET /api/quizzes/:lessonId
export const getQuizByLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const quiz = await Quiz.findOne({ lessonId });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// POST /api/quizzes
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { title, lessonId, questions } = req.body;
    const newQuiz = new Quiz({ title, lessonId, questions });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

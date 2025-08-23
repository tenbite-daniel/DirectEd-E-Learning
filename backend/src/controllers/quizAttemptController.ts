import { Request, Response } from "express";
import { Types } from "mongoose";
import Quiz from "../models/quiz.model";
import QuizAttempt from "../models/QuizAttempt";
import { SubmitQuizAttemptBody } from "../shared/Quiztypes";

// POST /api/quiz-attempts
export const submitQuizAttempt = async (
    req: Request<{}, {}, SubmitQuizAttemptBody>,
    res: Response
) => {
    try {
        const { quizId, userId, answers } = req.body;

        // Convert quizId string to ObjectId
        const quizObjectId = new Types.ObjectId(quizId);

        // Fetch quiz
        const quiz = await Quiz.findById(quizObjectId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        // Calculate score
        let score = 0;
        quiz.questions.forEach((q) => {
            const userAnswer = answers.find(
                (a) => a.questionId === q._id.toString()
            );
            if (userAnswer && userAnswer.answer === q.correctAnswer) score++;
        });

        // Save attempt
        const newAttempt = new QuizAttempt({
            quizId: quizObjectId,
            userId,
            answers,
            score,
        });

        await newAttempt.save();

        res.status(201).json(newAttempt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

// GET /api/quiz-attempts/:quizId
export const getQuizAttempts = async (req: Request, res: Response) => {
    try {
        const { quizId } = req.body; // or req.params

        if (!quizId || !Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ message: "Invalid quizId" });
        }

        const quizObjectId = Types.ObjectId(quizId); // <-- correct

        const attempts = await QuizAttempt.find({ quizId: quizObjectId });
        res.json(attempts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

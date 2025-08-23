import { Request, Response } from "express";
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

        // Fetch quiz directly with string ID
        const quiz = await Quiz.findById(quizId);
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
            quizId, // string is fine
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
        const { quizId } = req.params;

        // Query directly using string ID
        const attempts = await QuizAttempt.find({ quizId });
        res.json(attempts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

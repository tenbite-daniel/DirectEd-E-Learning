import mongoose, { Schema, Document } from "mongoose";
import { Question, Quiz as QuizType } from "../shared/Quiztypes";

interface QuizDocument extends QuizType, Document {}

const QuestionSchema: Schema = new Schema<Question>({
    text: { type: String, required: true },
    type: {
        type: String,
        enum: ["multiple-choice", "true-false", "short-answer"],
        required: true,
    },
    options: { type: [String] },
    correctAnswer: { type: String, required: true },
});

const QuizSchema: Schema = new Schema<QuizDocument>(
    {
        title: { type: String, required: true },
        lessonId: { type: String, required: true },
        questions: [QuestionSchema],
    },
    { timestamps: true }
);

export default mongoose.model<QuizDocument>("Quiz", QuizSchema);

import mongoose, { Schema, Document } from "mongoose";
import { QuizAttempt as QuizAttemptType } from "../shared/Quiztypes";

interface QuizAttemptDocument extends QuizAttemptType, Document {}

const QuizAttemptSchema: Schema = new Schema<QuizAttemptDocument>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    userId: { type: String, required: true },
    answers: [
      {
        questionId: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<QuizAttemptDocument>(
  "QuizAttempt",
  QuizAttemptSchema
);

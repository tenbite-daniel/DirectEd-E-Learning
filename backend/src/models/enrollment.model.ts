import mongoose, { Document, Schema } from "mongoose";

export interface IProgressPerLesson {
    lessonId: mongoose.Types.ObjectId;
    watchedSeconds: number;
    completed: boolean;
}

export interface IEnrollment extends Document {
    course: mongoose.Types.ObjectId;
    student: mongoose.Types.ObjectId;
    progress: IProgressPerLesson[];
    percentComplete: number; // cache for quick queries
    enrolledAt: Date;
    lastActivity?: Date;
}

const ProgressPerLessonSchema = new Schema<IProgressPerLesson>(
    {
        lessonId: { type: Schema.Types.ObjectId, required: true },
        watchedSeconds: { type: Number, default: 0 },
        completed: { type: Boolean, default: false },
    },
    { _id: false }
);

const EnrollmentSchema = new Schema<IEnrollment>({
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    progress: [ProgressPerLessonSchema],
    percentComplete: { type: Number, default: 0 },
    enrolledAt: { type: Date, default: Date.now },
    lastActivity: Date,
});

EnrollmentSchema.index({ course: 1, student: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollment>(
    "Enrollment",
    EnrollmentSchema
);

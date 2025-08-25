import mongoose, { Document, Schema } from "mongoose";

export interface ILesson {
    _id?: mongoose.Types.ObjectId;
    title: string;
    durationSeconds?: number;
    videoUrl?: string;
    order?: number;
}

export interface ICourse extends Document {
    title: string;
    description?: string;
    instructor: mongoose.Types.ObjectId;
    price?: number;
    published: boolean;
    lessons: ILesson[];
    createdAt: Date;
    updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
    title: { type: String, required: true },
    durationSeconds: Number,
    videoUrl: String,
    order: Number,
});

const CourseSchema = new Schema<ICourse>(
    {
        title: { type: String, required: true },
        description: String,
        instructor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        price: { type: Number, default: 0 },
        published: { type: Boolean, default: false },
        lessons: [LessonSchema],
    },
    { timestamps: true }
);

const Course = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;

import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  instructor: mongoose.Types.ObjectId; // Reference to User
  price: number;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, default: 0 },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>("Course", courseSchema);

import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface
export interface ITestimonial extends Document {
  name: string;
  role: string;
  review: string;
}

// Define the schema
const TestimonialSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    review: { type: String, required: true }
  },
  { timestamps: true }
);

// Export the model
export default mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

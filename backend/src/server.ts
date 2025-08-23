import joi from "joi";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/errorHandler";
import quizRoutes from "./routes/Quiz/quiz.routes"; // <-- import quizzes
import quizAttemptRoutes from "./routes/Quiz/quizAttempts";

import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import searchRoutes from "./routes/search.route";
import notificationRoutes from "./routes/notification.route";
import progressRoutes from "./routes/progress.routes";
import testimonialRoutes from "./routes/testimonial.routes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;
const MONGO_URI = process.env.MONGO_URI || "";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes); // <-- register quiz routes
app.use("/api/quiz-attempts", quizAttemptRoutes);

// The global error handler middleware. It MUST be placed after all other routes
// so that it can catch any errors that are passed to the 'next' function.
app.use(errorMiddleware);
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "API is running...🚀🚀" });
});
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/testimonials", testimonialRoutes);

// Connect to the database and then start the server
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ Database connected successfully!");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error connecting to the database:", err);
        // Exit the process if the database connection fails
        process.exit(1);
    });

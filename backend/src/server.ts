import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGO_URI as string;
connectDB(mongoURI);

// Routes
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "API is running...🚀🚀" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));

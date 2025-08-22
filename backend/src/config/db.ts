import mongoose from "mongoose";

const connectDB = async (mongoURI: string) => {
    try {
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected Successfully!`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;

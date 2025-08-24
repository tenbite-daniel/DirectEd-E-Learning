// src/models/Content.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IContent extends Document {
    title: string;
    description?: string;
    fileUrl: string;
    publicId: string;
    contentType: "document" | "image" | "video";
    uploadDate: Date;
}

const ContentSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        enum: ["document", "image", "video"],
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IContent>("Content", ContentSchema);

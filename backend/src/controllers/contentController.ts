import { Request, Response } from "express";
import Content from "../models/Content";
import cloudinary from "../config/cloudinary";

// Upload document controller
export const uploadDocument = async (req: Request, res: Response) => {
    try {
        console.log("Upload request received:", {
            body: req.body,
            file: req.file
                ? {
                      originalname: req.file.originalname,
                      mimetype: req.file.mimetype,
                      size: req.file.size,
                      // print all keys of req.file for debugging
                      keys: Object.keys(req.file),
                      // print entire req.file for deeper debugging (remove in production)
                      fullFile: req.file,
                  }
                : "No file",
        });

        if (!req.file) {
            console.log("No file uploaded");
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Multer storage-cloudinary typically returns the URL in `req.file.path`
        // and public ID in `req.file.filename`
        const uploadedFile = req.file as any;

        const fileUrl = uploadedFile.secure_url || uploadedFile.path;
        const publicId = uploadedFile.public_id || uploadedFile.filename;

        if (!fileUrl || !publicId) {
            console.log("Cloudinary upload failed:", uploadedFile);
            return res
                .status(500)
                .json({ message: "Cloudinary upload failed" });
        }

        // Create content record in database
        const content = new Content({
            title: req.body.title || req.file.originalname,
            description: req.body.description,
            fileUrl: fileUrl,
            publicId: publicId,
            contentType: "document",
            uploadDate: new Date(),
        });

        await content.save();
        console.log("Content saved to database:", content._id);

        res.status(201).json({
            message: "Document uploaded successfully",
            content: {
                id: content._id,
                title: content.title,
                url: content.fileUrl,
                uploadDate: content.uploadDate,
            },
        });
    } catch (error) {
        console.error("Upload error details:", error);

        let errorMessage = "Something went wrong on the server.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        res.status(500).json({
            status: "error",
            message: "Something went wrong on the server.",
            error:
                process.env.NODE_ENV === "development"
                    ? errorMessage
                    : undefined,
        });
    }
};

// Get content and deleteContent controllers remain unchanged

// Get content by ID
export const getContent = async (req: Request, res: Response) => {
    try {
        console.log("Get content request:", req.params.id);
        const content = await Content.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        res.json({
            id: content._id,
            title: content.title,
            description: content.description,
            url: content.fileUrl,
            uploadDate: content.uploadDate,
            contentType: content.contentType,
        });
    } catch (error) {
        console.error("Error fetching content:", error);

        // Proper error handling
        let errorMessage = "Error fetching content";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        res.status(500).json({ message: errorMessage });
    }
};

// Delete content
export const deleteContent = async (req: Request, res: Response) => {
    try {
        const content = await Content.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        // Delete from Cloudinary first
        await cloudinary.uploader.destroy(content.publicId);

        // Then delete from database
        await Content.findByIdAndDelete(req.params.id);

        res.json({ message: "Content deleted successfully" });
    } catch (error) {
        console.error("Error deleting content:", error);

        // Proper error handling
        let errorMessage = "Error deleting content";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        res.status(500).json({ message: errorMessage });
    }
};

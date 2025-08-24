import express from "express";
import {
    uploadDocument,
    getContent,
    deleteContent,
} from "../controllers/contentController";
import { uploadDocument as uploadDocumentMiddleware } from "../middleware/upload";
const router = express.Router();

// Add debug route for quick tests
router.post("/upload/debug", (req, res) => {
    console.log("Debug route hit");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    res.json({ message: "Debug route working" });
});

// Upload document route using renamed middleware uploadDocumentMiddleware
router.post(
    "/upload/document",
    uploadDocumentMiddleware.single("document"), // Make sure client uses 'document' as field name
    (req, res, next) => {
        console.log("Uploaded file info in middleware route:", req.file);
        next();
    },
    uploadDocument
);

router.get("/:id", getContent);
router.delete("/:id", deleteContent);

export default router;

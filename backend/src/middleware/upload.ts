import multer from "multer";

console.log("=== CREATING SIMPLE TEST MIDDLEWARE ===");

// Simple memory storage for testing (no Cloudinary for now)
const storage = multer.memoryStorage();

export const uploadDocument = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

import express from "express";
import {
    getProfile,
    updateProfile,
    changePassword,
    getProtectedRoute,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// GET current user profile
router.get("/profile", authMiddleware, getProfile);

// UPDATE current user profile
router.put("/profile", authMiddleware, updateProfile);

// CHANGE password
router.post("/change-password", authMiddleware, changePassword);

// TEST protected route
router.get("/protected", authMiddleware, getProtectedRoute);

export default router;

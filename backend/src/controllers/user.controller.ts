import { Request, Response, NextFunction } from "express";
import UserModel from "../models/user.model";
import { AppError } from "../middleware/errorHandler";
import { IChangePasswordRequest } from "../shared/Authtypes";

/**
 * @desc Get logged-in user's profile
 * @route GET /api/profile
 * @access Private
 */
export const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user || !req.user.id) {
        return next(new AppError("Not authenticated.", 401));
    }

    try {
        const user = await UserModel.findById(req.user.id).select("-password");
        if (!user) return next(new AppError("User not found.", 404));

        res.status(200).json(user);
    } catch (error) {
        next(new AppError("Failed to fetch profile.", 500));
    }
};

/**
 * @desc Update logged-in user's profile
 * @route PUT /api/profile
 * @access Private
 */
export const updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user || !req.user.id) {
        return next(new AppError("Not authenticated.", 401));
    }

    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) return next(new AppError("User not found.", 404));

        const { name, email } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt.toISOString(),
                updatedAt: updatedUser.updatedAt.toISOString(),
            },
        });
    } catch (error) {
        next(new AppError("Failed to update profile.", 500));
    }
};

/**
 * @desc Change password for logged-in user
 * @route POST /api/change-password
 * @access Private
 */
export const changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { oldPassword, newPassword } = req.body as IChangePasswordRequest;

    if (!req.user || !req.user.id) {
        return next(new AppError("Not authenticated.", 401));
    }

    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) return next(new AppError("User not found.", 404));

        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return next(new AppError("Invalid old password.", 400));
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        next(new AppError("Failed to update password.", 500));
    }
};

/**
 * @desc Protected test route
 * @route GET /api/protected
 * @access Private
 */
export const getProtectedRoute = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({
        message: `You have access because you're a ${req.user.role} with ID: ${req.user.id}.`,
    });
};

import { Router } from "express";
import {
    signup,
    login,
    changePassword,
    getProtectedRoute,
    forgotPassword,
    verifyOtp,
    resetPasswordWithOtp,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { signupSchema, loginSchema, changePasswordSchema } from "../validation";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { UserRole } from "../shared/Authtypes";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.put(
    "/reset-password",
    authMiddleware,
    validate(changePasswordSchema),
    changePassword
);

router.get(
    "/protected",
    authMiddleware,
    roleMiddleware([UserRole.Instructor]),
    getProtectedRoute
);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password-otp", resetPasswordWithOtp);

export default router;

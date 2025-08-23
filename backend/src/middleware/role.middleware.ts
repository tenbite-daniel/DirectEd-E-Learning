// Updated role.middleware.ts
import { Request, Response, NextFunction } from "express"; // Add Request import
import { UserRole } from "../shared/Authtypes"; // Remove IRequestWithUser import
import { AppError } from "./errorHandler";

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // ✅ req.user is now automatically recognized by TypeScript
    // Thanks to module augmentation in types/express.d.ts
    if (!req.user || !req.user.role) {
      return next(new AppError("Access denied. No user role found.", 403));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Access denied. Insufficient permissions.", 403)
      );
    }

    next();
  };
};

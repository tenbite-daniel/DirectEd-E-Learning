import { Request, Response, NextFunction } from "express";

/**
 * Middleware to allow only instructors to create quizzes
 * Assumes that req.user is already set by authMiddleware
 */
export const instructorOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized: No user logged in" });
  }

  if (user.role !== "instructor") {
    return res
      .status(403)
      .json({ message: "Only instructors can perform this action" });
  }

  next();
};

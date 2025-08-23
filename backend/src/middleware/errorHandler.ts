import { Request, Response, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Capture stack trace only in development
    if (process.env.NODE_ENV !== "production") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorMiddleware = (
  error: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errorMessages = error.issues.map((issue: ZodIssue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      status: "fail",
      errors: errorMessages,
    });
  }

  // Handle custom AppError
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "fail",
      message: error.message,
    });
  }

  // Handle generic server error
  return res.status(500).json({
    status: "error",
    message: "Something went wrong on the server.",
  });
};

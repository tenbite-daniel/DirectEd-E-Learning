import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "../shared/Authtypes";
import { AppError } from "./errorHandler";
import { getJwtSecret } from "../config/env"; // Import the function

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, getJwtSecret()) as IJwtPayload;
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (error) {
      next(new AppError("Not authorized, token failed.", 401));
    }
  } else {
    next(new AppError("Not authorized, no token provided.", 401));
  }
};

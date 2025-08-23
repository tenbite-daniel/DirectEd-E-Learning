import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export const validate =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      next(error);
    }
  };

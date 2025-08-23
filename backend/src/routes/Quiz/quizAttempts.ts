import { Router } from "express";
import {
  submitQuizAttempt,
  getQuizAttempts,
} from "../../controllers/quizAttemptController";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
router.post("/", authMiddleware, submitQuizAttempt);
router.get("/:quizId", authMiddleware, getQuizAttempts);
export default router;

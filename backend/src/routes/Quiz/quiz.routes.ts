import { Router } from "express";
import { getQuizByLesson, createQuiz } from "../../controllers/quiz.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";
import { UserRole } from "../../shared/Authtypes";

const router = Router();

router.get("/:lessonId", authMiddleware, getQuizByLesson);
router.post(
  "/",
  authMiddleware,
  roleMiddleware([UserRole.Instructor]),
  createQuiz
);

export default router;

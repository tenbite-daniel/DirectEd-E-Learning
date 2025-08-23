// routes/notifications.ts
import { Router, Request, Response } from "express";
import Notification from "../models/notification.model";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// GET /api/notifications
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

export default router;

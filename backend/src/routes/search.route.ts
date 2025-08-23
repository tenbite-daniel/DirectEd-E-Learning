// routes/search.ts
import { Router, Request, Response } from "express";
import Course from "../models/course.model";

const router = Router();

// GET /api/search/courses?q=javascript&level=beginner
router.get("/courses", async (req: Request, res: Response) => {
  try {
    const { q, level, category } = req.query;

    const query: any = {};
    if (q) query.title = { $regex: q.toString(), $options: "i" };
    if (level) query.level = level;
    if (category) query.category = category;

    const courses = await Course.find(query).limit(20);

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses" });
  }
});

export default router;

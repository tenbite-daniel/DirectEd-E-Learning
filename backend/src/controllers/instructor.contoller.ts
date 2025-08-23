import { Request, Response } from "express";
import Course from "../models/course.model";
import { Enrollment } from "../models/enrollment.model";

/**
 * GET /api/instructor/dashboard
 */
export const getInstructorDashboard = async (req: Request, res: Response) => {
    try {
        const instructorId = (req as any).user.id;
        const courses = await Course.find({ instructor: instructorId }).lean();
        const totalCourses = courses.length; // Get the count here
        const courseIds = courses.map((c) => c._id);

        const enrollAgg = await Enrollment.aggregate([
            { $match: { course: { $in: courseIds } } },
            {
                $group: {
                    _id: "$course",
                    studentsCount: { $sum: 1 },
                    avgComplete: { $avg: "$percentComplete" },
                    completions: {
                        $sum: {
                            $cond: [{ $eq: ["$percentComplete", 100] }, 1, 0],
                        },
                    },
                },
            },
        ]);

        const perCourseStats: Record<string, any> = {};
        enrollAgg.forEach((e) => {
            perCourseStats[e._id.toString()] = e;
        });

        const coursesWithStats = courses.map((c) => {
            const stats = perCourseStats[c._id.toString()] || {
                studentsCount: 0,
                avgComplete: 0,
                completions: 0,
            };
            return {
                courseId: c._id,
                title: c.title,
                price: c.price,
                published: c.published,
                studentsCount: stats.studentsCount,
                avgComplete: Math.round((stats.avgComplete || 0) * 100) / 100,
                completions: stats.completions,
            };
        });

        return res.json({ totalCourses, courses: coursesWithStats });
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

/**
 * GET /api/instructor/courses
 */
export const getInstructorCourses = async (req: Request, res: Response) => {
    try {
        const instructorId = (req as any).user.id;
        const page = parseInt((req.query.page as string) || "1");
        const limit = Math.min(
            50,
            parseInt((req.query.limit as string) || "20")
        );
        const skip = (page - 1) * limit;

        const [courses, total] = await Promise.all([
            Course.find({ instructor: instructorId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Course.countDocuments({ instructor: instructorId }),
        ]);

        const courseIds = courses.map((c) => c._id);
        const enrollCounts = await Enrollment.aggregate([
            { $match: { course: { $in: courseIds } } },
            {
                $group: {
                    _id: "$course",
                    studentsCount: { $sum: 1 },
                    avgComplete: { $avg: "$percentComplete" },
                },
            },
        ]);

        const coursesWithStats = courses.map((c) => {
            const stat = enrollCounts.find(
                (ec) => ec._id.toString() === c._id.toString()
            );
            return {
                ...c,
                studentsCount: stat?.studentsCount || 0,
                avgComplete: stat?.avgComplete || 0,
            };
        });

        return res.json({ page, limit, total, courses: coursesWithStats });
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

/**
 * GET /api/instructor/courses/:id
 */
export const getCourseById = async (req: Request, res: Response) => {
    try {
        const instructorId = (req as any).user.id;
        const { id } = req.params;

        const course = await Course.findOne({
            _id: id,
            instructor: instructorId,
        }).lean();
        if (!course)
            return res.status(404).json({
                message: "Course not found or you are not the instructor",
            });

        return res.json(course);
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

/**
 * POST /api/instructor/courses
 */
export const createCourse = async (req: Request, res: Response) => {
    try {
        const instructorId = (req as any).user.id;
        const course = new Course({ ...req.body, instructor: instructorId });
        await course.save();
        return res.status(201).json(course);
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

/**
 * PUT /api/instructor/courses/:id
 */
export const updateCourse = async (req: Request, res: Response) => {
    try {
        const instructorId = (req as any).user.id;
        const { id } = req.params;

        const course = await Course.findOneAndUpdate(
            { _id: id, instructor: instructorId },
            req.body,
            { new: true }
        );
        if (!course)
            return res.status(404).json({
                message: "Course not found or you are not the instructor",
            });

        return res.json(course);
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

/**
 * DELETE /api/instructor/courses/:id
 */
export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const instructorId = (req as any).user.id;
        const { id } = req.params;

        const course = await Course.findOneAndDelete({
            _id: id,
            instructor: instructorId,
        });
        if (!course)
            return res.status(404).json({
                message: "Course not found or you are not the instructor",
            });

        // Optional: delete associated enrollments
        await Enrollment.deleteMany({ course: id });

        return res.json({
            message: "Course deleted successfully",
            courseId: id,
        });
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

/**
 * POST /api/instructor/courses/:id/publish
 */
export const publishCourse = async (req: Request, res: Response) => {
    try {
        const instructorId = (req as any).user.id;
        const { id } = req.params;
        const { publish } = req.body;

        const course = await Course.findOne({
            _id: id,
            instructor: instructorId,
        });
        if (!course)
            return res.status(404).json({
                message: "Course not found or you are not the instructor",
            });

        course.published = Boolean(publish);
        await course.save();

        return res.json({
            message: `Course ${course.published ? "published" : "unpublished"}`,
            courseId: id,
            published: course.published,
        });
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

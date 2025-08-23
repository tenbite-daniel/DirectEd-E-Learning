import { Router, Request, Response } from "express";
import Testimonial, { ITestimonial } from "../models/testimonial.model";

const router = Router();

// Create a testimonial
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, role, review } = req.body;

    const newTestimonial: ITestimonial = new Testimonial({
      name,
      role,
      review
    });

    const savedTestimonial = await newTestimonial.save();
    res.status(201).json({
      success: true,
      data: savedTestimonial
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving testimonial", error });
  }
});

// Get all testimonials
router.get("/", async (_req: Request, res: Response) => {
  try {
    const testimonials = await Testimonial.find();
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching testimonials", error });
  }
});

export default router;

import express from "express";
import { courses } from "../data/store.js";

const router = express.Router();

// GET /courses
router.get("/", (req, res) => {
  res.status(200).json(courses);
});

// GET /courses/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const course = courses.find((course) => course.id === id);

  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }

  res.status(200).json(course);
});

export default router;
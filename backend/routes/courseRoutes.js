const express = require("express");

const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

// GET /api/courses
router.get("/", getCourses);

// GET /api/courses/:id
router.get("/:id", getCourseById);

// POST /api/courses
router.post("/", createCourse);

// PUT /api/courses/:id
router.put("/:id", updateCourse);

// DELETE /api/courses/:id
router.delete("/:id", deleteCourse);

module.exports = router;
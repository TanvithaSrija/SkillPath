const express = require("express");

const {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");

const router = express.Router();

// GET /api/lessons/course/:courseId
router.get(
  "/course/:courseId",
  getLessonsByCourse
);

// GET /api/lessons/:id
router.get(
  "/:id",
  getLessonById
);

// POST /api/lessons
router.post(
  "/",
  createLesson
);

// PUT /api/lessons/:id
router.put(
  "/:id",
  updateLesson
);

// DELETE /api/lessons/:id
router.delete(
  "/:id",
  deleteLesson
);

module.exports = router;
const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  startLesson,
  getLessonProgress,
  updateLessonProgress,
  getMyLessonProgress,
  getCourseProgress,
} = require("../controllers/lessonProgressController");

const router = express.Router();

// Start a lesson
router.post(
  "/",
  protect,
  startLesson
);

// Get all lesson progress
router.get(
  "/",
  protect,
  getMyLessonProgress
);

// Get course progress
router.get(
  "/course/:courseId",
  protect,
  getCourseProgress
);

// Get one lesson progress
router.get(
  "/:lessonId",
  protect,
  getLessonProgress
);

// Update one lesson progress
router.put(
  "/:lessonId",
  protect,
  updateLessonProgress
);

module.exports = router;
const express = require("express");

const {
  getQuizBySkill,
  submitQuiz,
} = require("../controllers/quizController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:skillId", protect, getQuizBySkill);

router.post("/submit", protect, submitQuiz);

module.exports = router;
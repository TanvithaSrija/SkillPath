const express = require("express");

const {
  getMySkillProgress,
  getSkillProgress,
  createSkillProgress,
  updateSkillProgress,
} = require("../controllers/skillProgressController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMySkillProgress);

router.get("/:skillId", protect, getSkillProgress);

router.post("/", protect, createSkillProgress);

router.put("/:skillId", protect, updateSkillProgress);

module.exports = router;
const express = require("express");

const {
    getSkills,
    getSkillById,
    getSkillsByCareerGoal,
    createSkill,
    updateSkill,
    deleteSkill
} = require("../controllers/skillController");

const router = express.Router();

// GET all skills
router.get("/", getSkills);

// GET skills for a particular career goal
router.get("/career/:careerGoalId", getSkillsByCareerGoal);

// GET a single skill
router.get("/:id", getSkillById);

// CREATE a skill
router.post("/", createSkill);

// UPDATE a skill
router.put("/:id", updateSkill);

// DELETE a skill
router.delete("/:id", deleteSkill);

module.exports = router;
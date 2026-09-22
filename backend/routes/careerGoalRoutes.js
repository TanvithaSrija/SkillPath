const express = require("express");

const {
    getCareerGoals,
    getCareerGoalById,
    createCareerGoal,
    updateCareerGoal,
    deleteCareerGoal
} = require("../controllers/careerGoalController");

const router = express.Router();

// GET all career goals
router.get("/", getCareerGoals);

// GET a single career goal
router.get("/:id", getCareerGoalById);

// CREATE a career goal
router.post("/", createCareerGoal);

// UPDATE a career goal
router.put("/:id", updateCareerGoal);

// DELETE a career goal
router.delete("/:id", deleteCareerGoal);

module.exports = router;
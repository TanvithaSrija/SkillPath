const CareerGoal = require("../models/CareerGoal");

// Get all career goals
const getCareerGoals = async (req, res) => {
    try {
        const careerGoals = await CareerGoal.find().sort({ createdAt: -1 });

        res.status(200).json(careerGoals);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch career goals",
            error: error.message
        });
    }
};

// Get a single career goal
const getCareerGoalById = async (req, res) => {
    try {
        const careerGoal = await CareerGoal.findById(req.params.id);

        if (!careerGoal) {
            return res.status(404).json({
                message: "Career goal not found"
            });
        }

        res.status(200).json(careerGoal);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch career goal",
            error: error.message
        });
    }
};

// Create a career goal
const createCareerGoal = async (req, res) => {
    try {
        const {
            title,
            description,
            icon,
            estimatedDuration,
            difficulty
        } = req.body;

        if (!title || !description || !estimatedDuration || !difficulty) {
            return res.status(400).json({
                message: "Title, description, estimated duration and difficulty are required"
            });
        }

        const existingCareerGoal = await CareerGoal.findOne({
            title: title.trim()
        });

        if (existingCareerGoal) {
            return res.status(409).json({
                message: "Career goal already exists"
            });
        }

        const careerGoal = await CareerGoal.create({
            title: title.trim(),
            description: description.trim(),
            icon: icon || "",
            estimatedDuration,
            difficulty
        });

        res.status(201).json(careerGoal);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create career goal",
            error: error.message
        });
    }
};

// Update a career goal
const updateCareerGoal = async (req, res) => {
    try {
        const careerGoal = await CareerGoal.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!careerGoal) {
            return res.status(404).json({
                message: "Career goal not found"
            });
        }

        res.status(200).json(careerGoal);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update career goal",
            error: error.message
        });
    }
};

// Delete a career goal
const deleteCareerGoal = async (req, res) => {
    try {
        const careerGoal = await CareerGoal.findByIdAndDelete(req.params.id);

        if (!careerGoal) {
            return res.status(404).json({
                message: "Career goal not found"
            });
        }

        res.status(200).json({
            message: "Career goal deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete career goal",
            error: error.message
        });
    }
};

module.exports = {
    getCareerGoals,
    getCareerGoalById,
    createCareerGoal,
    updateCareerGoal,
    deleteCareerGoal
};
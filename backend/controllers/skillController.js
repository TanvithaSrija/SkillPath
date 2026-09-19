const Skill = require("../models/Skill");
const CareerGoal = require("../models/CareerGoal");

// Get all skills
const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find()
            .populate("careerGoalId", "title")
            .populate("prerequisiteSkill", "title")
            .sort({ careerGoalId: 1, order: 1 });

        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch skills",
            error: error.message
        });
    }
};

// Get a single skill
const getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id)
            .populate("careerGoalId", "title")
            .populate("prerequisiteSkill", "title");

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        res.status(200).json(skill);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch skill",
            error: error.message
        });
    }
};

// Get skills for a particular career goal
const getSkillsByCareerGoal = async (req, res) => {
    try {
        const { careerGoalId } = req.params;

        const careerGoal = await CareerGoal.findById(careerGoalId);

        if (!careerGoal) {
            return res.status(404).json({
                message: "Career goal not found"
            });
        }

        const skills = await Skill.find({ careerGoalId })
            .populate("prerequisiteSkill", "title")
            .sort({ order: 1 });

        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch skills for career goal",
            error: error.message
        });
    }
};

// Create a skill
const createSkill = async (req, res) => {
    try {
        const {
            title,
            description,
            careerGoalId,
            order,
            estimatedHours,
            difficulty,
            prerequisiteSkill
        } = req.body;

        if (
            !title ||
            !description ||
            !careerGoalId ||
            order === undefined ||
            estimatedHours === undefined ||
            !difficulty
        ) {
            return res.status(400).json({
                message:
                    "Title, description, career goal, order, estimated hours and difficulty are required"
            });
        }

        const careerGoal = await CareerGoal.findById(careerGoalId);

        if (!careerGoal) {
            return res.status(404).json({
                message: "Career goal not found"
            });
        }

        const existingSkill = await Skill.findOne({
            careerGoalId,
            order
        });

        if (existingSkill) {
            return res.status(409).json({
                message: "A skill with this order already exists for this career goal"
            });
        }

        const skill = await Skill.create({
            title: title.trim(),
            description: description.trim(),
            careerGoalId,
            order,
            estimatedHours,
            difficulty,
            prerequisiteSkill: prerequisiteSkill || null
        });

        res.status(201).json(skill);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create skill",
            error: error.message
        });
    }
};

// Update a skill
const updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        res.status(200).json(skill);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update skill",
            error: error.message
        });
    }
};

// Delete a skill
const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        res.status(200).json({
            message: "Skill deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete skill",
            error: error.message
        });
    }
};

module.exports = {
    getSkills,
    getSkillById,
    getSkillsByCareerGoal,
    createSkill,
    updateSkill,
    deleteSkill
};
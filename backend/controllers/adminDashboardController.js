const User = require("../models/User");
const CareerGoal = require("../models/CareerGoal");
const Skill = require("../models/Skill");
const LearningResource = require("../models/LearningResource");
const Quiz = require("../models/Quiz");

const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalCareerGoals,
            totalSkills,
            totalResources,
            totalQuizzes
        ] = await Promise.all([
            User.countDocuments(),
            CareerGoal.countDocuments(),
            Skill.countDocuments(),
            LearningResource.countDocuments(),
            Quiz.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalCareerGoals,
                totalSkills,
                totalResources,
                totalQuizzes
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};

module.exports = {
    getDashboardStats
};
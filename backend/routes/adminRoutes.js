const express = require("express");

const {
    getAllUsers,
    deleteUser
} = require("../controllers/adminController");

const {
    getCareerGoals,
    getCareerGoalById,
    createCareerGoal,
    updateCareerGoal,
    deleteCareerGoal
} = require("../controllers/careerGoalController");

const {
    getSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill
} = require("../controllers/skillController");

const {
    getResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource
} = require("../controllers/resourceController");

const {
    getAllQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz
} = require("../controllers/quizController");

const {
    getDashboardStats
} = require("../controllers/adminDashboardController");

const protect = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ==================== ADMIN ACCESS TEST ====================

router.get(
    "/",
    protect,
    adminMiddleware,
    (req, res) => {
        res.json({
            message: "Welcome to SkillPath Admin Panel"
        });
    }
);


// ==================== ADMIN DASHBOARD ====================

router.get(
    "/dashboard",
    protect,
    adminMiddleware,
    getDashboardStats
);


// ==================== USER MANAGEMENT ====================

router.get(
    "/users",
    protect,
    adminMiddleware,
    getAllUsers
);

router.delete(
    "/users/:id",
    protect,
    adminMiddleware,
    deleteUser
);


// ==================== CAREER GOAL MANAGEMENT ====================

router.get(
    "/career-goals",
    protect,
    adminMiddleware,
    getCareerGoals
);

router.get(
    "/career-goals/:id",
    protect,
    adminMiddleware,
    getCareerGoalById
);

router.post(
    "/career-goals",
    protect,
    adminMiddleware,
    createCareerGoal
);

router.put(
    "/career-goals/:id",
    protect,
    adminMiddleware,
    updateCareerGoal
);

router.delete(
    "/career-goals/:id",
    protect,
    adminMiddleware,
    deleteCareerGoal
);


// ==================== SKILL MANAGEMENT ====================

router.get(
    "/skills",
    protect,
    adminMiddleware,
    getSkills
);

router.get(
    "/skills/:id",
    protect,
    adminMiddleware,
    getSkillById
);

router.post(
    "/skills",
    protect,
    adminMiddleware,
    createSkill
);

router.put(
    "/skills/:id",
    protect,
    adminMiddleware,
    updateSkill
);

router.delete(
    "/skills/:id",
    protect,
    adminMiddleware,
    deleteSkill
);


// ==================== RESOURCE MANAGEMENT ====================

router.get(
    "/resources",
    protect,
    adminMiddleware,
    getResources
);

router.get(
    "/resources/:id",
    protect,
    adminMiddleware,
    getResourceById
);

router.post(
    "/resources",
    protect,
    adminMiddleware,
    createResource
);

router.put(
    "/resources/:id",
    protect,
    adminMiddleware,
    updateResource
);

router.delete(
    "/resources/:id",
    protect,
    adminMiddleware,
    deleteResource
);


// ==================== QUIZ MANAGEMENT ====================

router.get(
    "/quizzes",
    protect,
    adminMiddleware,
    getAllQuizzes
);

router.get(
    "/quizzes/:id",
    protect,
    adminMiddleware,
    getQuizById
);

router.post(
    "/quizzes",
    protect,
    adminMiddleware,
    createQuiz
);

router.put(
    "/quizzes/:id",
    protect,
    adminMiddleware,
    updateQuiz
);

router.delete(
    "/quizzes/:id",
    protect,
    adminMiddleware,
    deleteQuiz
);


module.exports = router;
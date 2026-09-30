const Quiz = require("../models/Quiz");
const SkillProgress = require("../models/SkillProgress");

// ==================== GET QUIZ FOR A SKILL ====================

const getQuizBySkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const quiz = await Quiz.findOne({ skillId });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found for this skill",
      });
    }

    const safeQuestions = quiz.questions.map(
      (question) => ({
        _id: question._id,
        question: question.question,
        options: question.options,
      })
    );

    res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        skillId: quiz.skillId,
        questions: safeQuestions,
        passingMarks: quiz.passingMarks,
        timeLimit: quiz.timeLimit,
      },
    });
  } catch (error) {
    console.error("Get quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
    });
  }
};


// ==================== SUBMIT QUIZ ====================

const submitQuiz = async (req, res) => {
  try {
    const { skillId, answers } = req.body;

    if (!skillId) {
      return res.status(400).json({
        success: false,
        message: "skillId is required",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
      });
    }

    const quiz = await Quiz.findOne({ skillId });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found for this skill",
      });
    }

    let score = 0;

    answers.forEach((submittedAnswer) => {
      const question = quiz.questions.id(
        submittedAnswer.questionId
      );

      if (!question) {
        return;
      }

      if (
        Number(submittedAnswer.answer) ===
        question.correctAnswer
      ) {
        score += 1;
      }
    });

    const totalQuestions = quiz.questions.length;

    const percentage =
      totalQuestions > 0
        ? Math.round(
            (score / totalQuestions) * 100
          )
        : 0;

    const passed =
      score >= quiz.passingMarks;

    let skillProgress =
      await SkillProgress.findOne({
        userId: req.user.userId,
        skillId,
      });

    if (!skillProgress) {
      skillProgress = await SkillProgress.create({
        userId: req.user.userId,
        skillId,
        status: passed
          ? "Verified"
          : "In Progress",
        verified: passed,
        quizScore: score,
        completionPercentage: passed ? 100 : 0,
        completedAt: passed
          ? new Date()
          : null,
      });
    } else {
      skillProgress.quizScore = score;

      if (passed) {
        skillProgress.status = "Verified";
        skillProgress.verified = true;
        skillProgress.completionPercentage = 100;
        skillProgress.completedAt =
          skillProgress.completedAt ||
          new Date();
      } else {
        skillProgress.status = "In Progress";
        skillProgress.verified = false;
      }

      await skillProgress.save();
    }

    res.status(200).json({
      success: true,
      score,
      totalQuestions,
      percentage,
      passingMarks: quiz.passingMarks,
      passed,
      verified: skillProgress.verified,
      message: passed
        ? "Congratulations! Skill verified successfully."
        : "Quiz not passed. You can retake the quiz.",
    });
  } catch (error) {
    console.error("Submit quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
    });
  }
};


// ==================== ADMIN: GET ALL QUIZZES ====================

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    console.error("Get all quizzes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
    });
  }
};


// ==================== ADMIN: GET QUIZ BY ID ====================

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("Get quiz by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
    });
  }
};


// ==================== ADMIN: CREATE QUIZ ====================

const createQuiz = async (req, res) => {
  try {
    const {
      skillId,
      questions,
      passingMarks,
      timeLimit,
    } = req.body;

    if (
      !skillId ||
      !Array.isArray(questions) ||
      questions.length < 10 ||
      passingMarks === undefined ||
      timeLimit === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "skillId, at least 10 questions, passingMarks and timeLimit are required",
      });
    }

    const existingQuiz = await Quiz.findOne({
      skillId,
    });

    if (existingQuiz) {
      return res.status(400).json({
        success: false,
        message: "Quiz already exists for this skill",
      });
    }

    const quiz = await Quiz.create({
      skillId,
      questions,
      passingMarks,
      timeLimit,
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    console.error("Create quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create quiz",
    });
  }
};


// ==================== ADMIN: UPDATE QUIZ ====================

const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    console.error("Update quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update quiz",
    });
  }
};


// ==================== ADMIN: DELETE QUIZ ====================

const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(
      req.params.id
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Delete quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete quiz",
    });
  }
};


module.exports = {
  getQuizBySkill,
  submitQuiz,

  // Admin functions
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
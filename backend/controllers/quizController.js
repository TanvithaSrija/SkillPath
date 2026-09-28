const Quiz = require("../models/Quiz");
const SkillProgress = require("../models/SkillProgress");

// GET quiz for a skill
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

    // Never send correct answers to frontend
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

// Submit quiz
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

    // Find or create skill progress
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

module.exports = {
  getQuizBySkill,
  submitQuiz,
};
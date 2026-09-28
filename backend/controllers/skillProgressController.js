const SkillProgress = require("../models/SkillProgress");

const getMySkillProgress = async (req, res) => {
  try {
    const progress = await SkillProgress.find({
      userId: req.user.userId,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Get skill progress error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch skill progress",
    });
  }
};

const getSkillProgress = async (req, res) => {
  try {
    const { skillId } = req.params;

    const progress = await SkillProgress.findOne({
      userId: req.user.userId,
      skillId,
    });

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Get single skill progress error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch skill progress",
    });
  }
};

const createSkillProgress = async (req, res) => {
  try {
    const {
      skillId,
      status,
      verified,
      quizScore,
      completionPercentage,
    } = req.body;

    if (!skillId) {
      return res.status(400).json({
        success: false,
        message: "skillId is required",
      });
    }

    const existingProgress = await SkillProgress.findOne({
      userId: req.user.userId,
      skillId,
    });

    if (existingProgress) {
      return res.status(409).json({
        success: false,
        message: "Progress already exists for this skill",
        progress: existingProgress,
      });
    }

    const percentage = Math.min(
      100,
      Math.max(0, Number(completionPercentage) || 0)
    );

    const progress = await SkillProgress.create({
      userId: req.user.userId,
      skillId,
      status:
        verified === true
          ? "Verified"
          : status || (percentage > 0 ? "In Progress" : "Not Started"),
      verified: verified === true,
      quizScore: Number(quizScore) || 0,
      completionPercentage: percentage,
      completedAt: percentage >= 100 ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: "Skill progress created successfully",
      progress,
    });
  } catch (error) {
    console.error("Create skill progress error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create skill progress",
    });
  }
};

const updateSkillProgress = async (req, res) => {
  try {
    const { skillId } = req.params;

    const {
      status,
      verified,
      quizScore,
      completionPercentage,
    } = req.body;

    let progress = await SkillProgress.findOne({
      userId: req.user.userId,
      skillId,
    });

    if (!progress) {
      progress = new SkillProgress({
        userId: req.user.userId,
        skillId,
      });
    }

    if (status !== undefined) {
      progress.status = status;
    }

    if (verified !== undefined) {
      progress.verified = Boolean(verified);
    }

    if (quizScore !== undefined) {
      progress.quizScore = Math.max(
        0,
        Number(quizScore) || 0
      );
    }

    if (completionPercentage !== undefined) {
      progress.completionPercentage = Math.min(
        100,
        Math.max(0, Number(completionPercentage) || 0)
      );
    }

    if (progress.verified) {
      progress.status = "Verified";
      progress.completionPercentage = 100;

      if (!progress.completedAt) {
        progress.completedAt = new Date();
      }
    } else if (progress.completionPercentage >= 100) {
      progress.status = "Completed";

      if (!progress.completedAt) {
        progress.completedAt = new Date();
      }
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Skill progress updated successfully",
      progress,
    });
  } catch (error) {
    console.error("Update skill progress error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update skill progress",
    });
  }
};

module.exports = {
  getMySkillProgress,
  getSkillProgress,
  createSkillProgress,
  updateSkillProgress,
};
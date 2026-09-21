const LearningProgress = require("../models/LearningProgress");
const LearningResource = require("../models/LearningResource");

// ======================================================
// CREATE / START LEARNING
// ======================================================

const startLearning = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { resourceId } = req.body;

    if (!resourceId) {
      return res.status(400).json({
        success: false,
        message: "Resource ID is required",
      });
    }

    // Check whether resource exists
    const resource = await LearningResource.findById(
      resourceId
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Learning resource not found",
      });
    }

    // Check whether progress already exists
    let progress = await LearningProgress.findOne({
      user: userId,
      resource: resourceId,
    });

    // If already started, return existing record
    if (progress) {
      return res.status(200).json({
        success: true,
        message: "Learning progress already exists",
        progress,
      });
    }

    // Create new progress record
    progress = await LearningProgress.create({
      user: userId,
      resource: resourceId,
      status: "In Progress",
      progress: 0,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Learning started successfully",
      progress,
    });
  } catch (error) {
    console.error(
      "Start learning error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to start learning",
    });
  }
};

// ======================================================
// GET ALL USER PROGRESS
// ======================================================

const getMyProgress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const progress = await LearningProgress.find({
      user: userId,
    })
      .populate(
        "resource",
        "title description url platform type skill difficulty isFree thumbnail"
      )
      .sort({
        lastAccessedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: progress.length,
      progress,
    });
  } catch (error) {
    console.error(
      "Get progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch learning progress",
    });
  }
};

// ======================================================
// GET PROGRESS FOR ONE RESOURCE
// ======================================================

const getResourceProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { resourceId } = req.params;

    const progress = await LearningProgress.findOne({
      user: userId,
      resource: resourceId,
    }).populate(
      "resource",
      "title description url platform type skill difficulty isFree thumbnail"
    );

    if (!progress) {
      return res.status(200).json({
        success: true,
        progress: null,
      });
    }

    return res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(
      "Get resource progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resource progress",
    });
  }
};

// ======================================================
// UPDATE LEARNING PROGRESS
// ======================================================

const updateProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { resourceId } = req.params;

    const { progress: progressValue } = req.body;

    // Validate progress value
    if (
      progressValue === undefined ||
      progressValue < 0 ||
      progressValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Progress must be between 0 and 100",
      });
    }

    const progress = await LearningProgress.findOne({
      user: userId,
      resource: resourceId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message:
          "Learning progress not found. Start learning first.",
      });
    }

    progress.progress = progressValue;
    progress.lastAccessedAt = new Date();

    // Automatically determine status
    if (progressValue === 0) {
      progress.status = "Not Started";
    } else if (progressValue === 100) {
      progress.status = "Completed";

      if (!progress.completedAt) {
        progress.completedAt = new Date();
      }
    } else {
      progress.status = "In Progress";
    }

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Learning progress updated",
      progress,
    });
  } catch (error) {
    console.error(
      "Update progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update learning progress",
    });
  }
};

// ======================================================
// DELETE LEARNING PROGRESS
// ======================================================

const deleteProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { resourceId } = req.params;

    const progress =
      await LearningProgress.findOneAndDelete({
        user: userId,
        resource: resourceId,
      });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Learning progress not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Learning progress removed",
    });
  } catch (error) {
    console.error(
      "Delete progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete learning progress",
    });
  }
};

module.exports = {
  startLearning,
  getMyProgress,
  getResourceProgress,
  updateProgress,
  deleteProgress,
};
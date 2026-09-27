const LessonProgress = require("../models/LessonProgress");
const Lesson = require("../models/Lesson");

// START LESSON
const startLesson = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const userId = req.user.userId;

    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: "Lesson ID is required",
      });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    let lessonProgress =
      await LessonProgress.findOne({
        user: userId,
        lesson: lessonId,
      });

    if (!lessonProgress) {
      lessonProgress =
        await LessonProgress.create({
          user: userId,
          lesson: lessonId,
          status: "In Progress",
          progress: 0,
          startedAt: new Date(),
          lastAccessedAt: new Date(),
        });
    } else {
      lessonProgress.status =
        lessonProgress.progress === 100
          ? "Completed"
          : "In Progress";

      if (!lessonProgress.startedAt) {
        lessonProgress.startedAt = new Date();
      }

      lessonProgress.lastAccessedAt =
        new Date();

      await lessonProgress.save();
    }

    return res.status(200).json({
      success: true,
      message: "Lesson started successfully",
      progress: lessonProgress,
    });
  } catch (error) {
    console.error(
      "Start lesson error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to start lesson",
    });
  }
};

// GET LESSON PROGRESS
const getLessonProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.userId;

    const progress =
      await LessonProgress.findOne({
        user: userId,
        lesson: lessonId,
      });

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
      "Get lesson progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch lesson progress",
    });
  }
};

// UPDATE LESSON PROGRESS
const updateLessonProgress = async (
  req,
  res
) => {
  try {
    const { lessonId } = req.params;
    const { progress } = req.body;
    const userId = req.user.userId;

    if (
      progress === undefined ||
      progress < 0 ||
      progress > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Progress must be between 0 and 100",
      });
    }

    const lesson =
      await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    let lessonProgress =
      await LessonProgress.findOne({
        user: userId,
        lesson: lessonId,
      });

    if (!lessonProgress) {
      lessonProgress =
        new LessonProgress({
          user: userId,
          lesson: lessonId,
          startedAt: new Date(),
        });
    }

    lessonProgress.progress = progress;
    lessonProgress.lastAccessedAt =
      new Date();

    if (progress === 100) {
      lessonProgress.status = "Completed";
      lessonProgress.completedAt =
        lessonProgress.completedAt ||
        new Date();
    } else if (progress > 0) {
      lessonProgress.status = "In Progress";
      lessonProgress.completedAt = null;
    } else {
      lessonProgress.status = "Not Started";
      lessonProgress.completedAt = null;
    }

    await lessonProgress.save();

    return res.status(200).json({
      success: true,
      message:
        "Lesson progress updated successfully",
      progress: lessonProgress,
    });
  } catch (error) {
    console.error(
      "Update lesson progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update lesson progress",
    });
  }
};

// GET ALL LESSON PROGRESS FOR USER
const getMyLessonProgress = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId;

    const progress =
      await LessonProgress.find({
        user: userId,
      })
        .populate(
          "lesson",
          "title order type course duration"
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
      "Get my lesson progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch lesson progress",
    });
  }
};
// GET COURSE PROGRESS
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    const lessons = await Lesson.find({
      course: courseId,
    }).sort({
      order: 1,
    });

    if (lessons.length === 0) {
      return res.status(200).json({
        success: true,
        courseProgress: {
          progress: 0,
          totalLessons: 0,
          completedLessons: 0,
          startedLessons: 0,
        },
      });
    }

    const lessonIds = lessons.map(
      (lesson) => lesson._id
    );

    const progressRecords =
      await LessonProgress.find({
        user: userId,
        lesson: {
          $in: lessonIds,
        },
      });

    const progressMap = {};

    progressRecords.forEach((record) => {
      progressMap[
        record.lesson.toString()
      ] = record;
    });

    let totalProgress = 0;
    let completedLessons = 0;
    let startedLessons = 0;

    lessons.forEach((lesson) => {
      const record =
        progressMap[
          lesson._id.toString()
        ];

      const lessonProgress =
        record?.progress || 0;

      totalProgress += lessonProgress;

      if (record && record.status !== "Not Started") {
        startedLessons++;
    }

      if (
        record?.status ===
        "Completed"
      ) {
        completedLessons++;
      }
    });

    const courseProgress = Math.round(
      totalProgress / lessons.length
    );

    return res.status(200).json({
      success: true,
      courseProgress: {
        progress: courseProgress,
        totalLessons: lessons.length,
        completedLessons,
        startedLessons,
      },
    });
  } catch (error) {
    console.error(
      "Get course progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to calculate course progress",
    });
  }
};

module.exports = {
  startLesson,
  getLessonProgress,
  updateLessonProgress,
  getMyLessonProgress,
  getCourseProgress,
};
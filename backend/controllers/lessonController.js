const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

// ======================================================
// GET LESSONS FOR A COURSE
// GET /api/lessons/course/:courseId
// ======================================================

const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lessons = await Lesson.find({
      course: courseId,
    }).sort({
      order: 1,
    });

    return res.status(200).json({
      success: true,
      count: lessons.length,
      lessons,
    });
  } catch (error) {
    console.error(
      "Get lessons error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch lessons",
    });
  }
};

// ======================================================
// GET LESSON BY ID
// GET /api/lessons/:id
// ======================================================

const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id)
      .populate(
        "course",
        "title skill difficulty"
      );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error(
      "Get lesson error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch lesson",
    });
  }
};

// ======================================================
// CREATE LESSON
// POST /api/lessons
// ======================================================

const createLesson = async (req, res) => {
  try {
    const {
      course,
      title,
      description,
      order,
      type,
      videoUrl,
      resourceUrl,
      duration,
      isFree,
    } = req.body;

    if (
      !course ||
      !title ||
      !order
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Course, title and order are required",
      });
    }

    const courseExists =
      await Course.findById(course);

    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lesson = await Lesson.create({
      course,
      title,
      description,
      order,
      type,
      videoUrl,
      resourceUrl,
      duration,
      isFree,
    });

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error(
      "Create lesson error:",
      error
    );

    // Duplicate course + order
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A lesson with this order already exists in this course",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create lesson",
    });
  }
};

// ======================================================
// UPDATE LESSON
// PUT /api/lessons/:id
// ======================================================

const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson =
      await Lesson.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson,
    });
  } catch (error) {
    console.error(
      "Update lesson error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update lesson",
    });
  }
};

// ======================================================
// DELETE LESSON
// DELETE /api/lessons/:id
// ======================================================

const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson =
      await Lesson.findByIdAndDelete(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete lesson error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete lesson",
    });
  }
};

module.exports = {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
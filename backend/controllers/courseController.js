const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

// ======================================================
// GET ALL COURSES
// GET /api/courses
// ======================================================

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      published: true,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

// ======================================================
// GET COURSE BY ID
// GET /api/courses/:id
// ======================================================

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lessons = await Lesson.find({
      course: id,
    }).sort({
      order: 1,
    });

    return res.status(200).json({
      success: true,
      course,
      lessons,
    });
  } catch (error) {
    console.error("Get course error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};

// ======================================================
// CREATE COURSE
// POST /api/courses
// ======================================================

const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      thumbnail,
      skill,
      difficulty,
      duration,
      isFree,
      platform,
      instructor,
      published,
    } = req.body;

    if (!title || !description || !skill) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description and skill are required",
      });
    }

    const course = await Course.create({
      title,
      description,
      thumbnail,
      skill,
      difficulty,
      duration,
      isFree,
      platform,
      instructor,
      published,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

// ======================================================
// UPDATE COURSE
// PUT /api/courses/:id
// ======================================================

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};

// ======================================================
// DELETE COURSE
// DELETE /api/courses/:id
// ======================================================

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Delete lessons belonging to this course
    await Lesson.deleteMany({
      course: id,
    });

    return res.status(200).json({
      success: true,
      message:
        "Course and associated lessons deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
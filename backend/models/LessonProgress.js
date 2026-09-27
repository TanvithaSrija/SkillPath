const mongoose = require("mongoose");

const lessonProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Completed",
      ],
      default: "Not Started",
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

lessonProgressSchema.index(
  {
    user: 1,
    lesson: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "LessonProgress",
  lessonProgressSchema
);
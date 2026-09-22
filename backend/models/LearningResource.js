const mongoose = require("mongoose");

const learningResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
  type: String,
    enum: [
      "Course",
      "Video",
      "Article",
      "Book",
      "Documentation",
      "Tutorial",
      "Practice",
      "Project",
    ],
    required: true,
  },

    skill: {
      type: String,
      required: true,
      trim: true,
    },

    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      default: null,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    isFree: {
      type: Boolean,
      default: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "LearningResource",
  learningResourceSchema
);
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    skill: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    duration: {
      type: Number,
      default: 0,
      min: 0,
    },

    isFree: {
      type: Boolean,
      default: true,
    },

    platform: {
      type: String,
      default: "SkillPath",
      trim: true,
    },

    instructor: {
      type: String,
      default: "",
      trim: true,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
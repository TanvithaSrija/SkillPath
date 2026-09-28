const mongoose = require("mongoose");

const skillProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skillId: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Completed",
        "Verified",
      ],
      default: "Not Started",
    },

    verified: {
      type: Boolean,
      default: false,
    },

    quizScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

skillProgressSchema.index(
  { userId: 1, skillId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "SkillProgress",
  skillProgressSchema
);
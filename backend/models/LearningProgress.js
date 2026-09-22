const mongoose = require("mongoose");

const learningProgressSchema = new mongoose.Schema(
  {
    // Logged-in user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Learning resource
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningResource",
      required: true,
    },

    // Current learning status
    status: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Completed",
      ],
      default: "Not Started",
    },

    // Completion percentage
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // When the user started learning
    startedAt: {
      type: Date,
      default: null,
    },

    // When the resource was completed
    completedAt: {
      type: Date,
      default: null,
    },

    // Last time the user interacted with this resource
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// A user should have only one progress record
// for a particular resource.
learningProgressSchema.index(
  {
    user: 1,
    resource: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "LearningProgress",
  learningProgressSchema
);
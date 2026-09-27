const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },

    type: {
      type: String,
      enum: [
        "Video",
        "Article",
        "Quiz",
        "Practice",
        "Project",
      ],
      default: "Video",
    },

    videoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    resourceUrl: {
      type: String,
      default: "",
      trim: true,
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
  },
  {
    timestamps: true,
  }
);

lessonSchema.index(
  {
    course: 1,
    order: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);
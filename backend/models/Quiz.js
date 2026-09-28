const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: (options) => options.length >= 2,
        message: "A question must have at least 2 options",
      },
    },

    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    skillId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: (questions) =>
          questions.length >= 10,
        message: "Quiz must contain at least 10 questions",
      },
    },

    passingMarks: {
      type: Number,
      required: true,
      min: 0,
    },

    timeLimit: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
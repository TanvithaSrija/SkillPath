const mongoose = require("mongoose");

const careerGoalSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        icon: {
            type: String,
            default: ""
        },

        estimatedDuration: {
            type: String,
            required: true
        },

        difficulty: {
            type: String,
            required: true,
            enum: ["Beginner", "Intermediate", "Advanced"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("CareerGoal", careerGoalSchema);
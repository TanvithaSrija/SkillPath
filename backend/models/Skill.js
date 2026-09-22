const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        careerGoalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CareerGoal",
            required: true
        },

        order: {
            type: Number,
            required: true,
            min: 1
        },

        estimatedHours: {
            type: Number,
            required: true,
            min: 1
        },

        difficulty: {
            type: String,
            required: true,
            enum: ["Beginner", "Intermediate", "Advanced"]
        },

        prerequisiteSkill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            default: null
        }
    },
    {
        timestamps: true
    }
);

skillSchema.index(
    { careerGoalId: 1, order: 1 },
    { unique: true }
);

module.exports = mongoose.model("Skill", skillSchema);
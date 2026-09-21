const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
},

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        careerGoal: {
            type: String,
            default: ""
        },

        preferredLanguage: {
            type: String,
            default: ""
        },

        preferredPlatform: {
            type: String,
            default: ""
        },

        courseType: {
            type: String,
            default: ""
        },

        experienceLevel: {
            type: String,
            default: ""
        },

        studyHours: {
            type: Number,
            default: 0
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);
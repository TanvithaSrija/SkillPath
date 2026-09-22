const mongoose = require("mongoose");
require("dotenv").config();

const CareerGoal = require("../models/CareerGoal");
const connectDB = require("../config/db");

const careerGoals = [
    {
        title: "MERN Stack Developer",
        description:
            "Become a full-stack web developer using MongoDB, Express.js, React.js and Node.js.",
        icon: "💻",
        estimatedDuration: "6-8 months",
        difficulty: "Intermediate"
    },
    {
        title: "Java Backend Developer",
        description:
            "Build strong Java programming and backend development skills for developing scalable applications.",
        icon: "☕",
        estimatedDuration: "5-7 months",
        difficulty: "Intermediate"
    },
    {
        title: "Data Analyst",
        description:
            "Learn data analysis, visualization, SQL and Python to extract useful insights from data.",
        icon: "📊",
        estimatedDuration: "4-6 months",
        difficulty: "Beginner"
    },
    {
        title: "AI Engineer",
        description:
            "Learn artificial intelligence, machine learning and deep learning to build intelligent applications.",
        icon: "🤖",
        estimatedDuration: "8-12 months",
        difficulty: "Advanced"
    },
    {
        title: "DevOps Engineer",
        description:
            "Learn cloud platforms, CI/CD, containers and automation for reliable software deployment.",
        icon: "⚙️",
        estimatedDuration: "6-9 months",
        difficulty: "Advanced"
    },
    {
        title: "Cyber Security Engineer",
        description:
            "Develop skills in network security, ethical hacking, vulnerability assessment and security practices.",
        icon: "🔐",
        estimatedDuration: "6-9 months",
        difficulty: "Advanced"
    }
];

const seedCareerGoals = async () => {
    try {
        await connectDB();

        await CareerGoal.deleteMany();

        await CareerGoal.insertMany(careerGoals);

        console.log("Career goals seeded successfully!");

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding career goals:", error.message);

        await mongoose.connection.close();
        process.exit(1);
    }
};

seedCareerGoals();
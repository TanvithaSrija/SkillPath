const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const careerGoalRoutes = require("./routes/careerGoalRoutes");
const skillRoutes = require("./routes/skillRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Member 1 - Authentication routes
app.use("/api/auth", authRoutes);

// Member 2 - Career Goal routes
app.use("/api/career-goals", careerGoalRoutes);

// Member 2 - Skill routes
app.use("/api/skills", skillRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("SkillPath Backend is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
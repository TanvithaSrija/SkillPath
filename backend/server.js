const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const progressRoutes = require("./routes/progressRoutes");
const careerGoalRoutes = require("./routes/careerGoalRoutes");
const skillRoutes = require("./routes/skillRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const lessonProgressRoutes = require("./routes/lessonProgressRoutes");
const skillProgressRoutes = require("./routes/skillProgressRoutes");
const noteRoutes = require("./routes/noteRoutes");
const quizRoutes = require("./routes/quizRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();

// Connect MongoDB
connectDB();


// Middleware
app.use(cors());
app.use(express.json());

// Member 1 - Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
// Member 2 - Career Goal routes
app.use("/api/career-goals", careerGoalRoutes);

// Member 2 - Skill routes
app.use("/api/skills", skillRoutes);
app.use(
  "/api/lesson-progress",
  lessonProgressRoutes
);
app.use("/api/skill-progress", skillProgressRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/admin", adminRoutes);
// Test route
app.get("/", (req, res) => {
    res.send("SkillPath Backend is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
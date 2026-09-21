const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const progressRoutes = require("./routes/progressRoutes");
const app = express();

// Connect MongoDB
connectDB();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/progress", progressRoutes);
// Test route
app.get("/", (req, res) => {
    res.send("SkillPath Backend is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
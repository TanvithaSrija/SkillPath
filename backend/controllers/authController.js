const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
};


// ================= REGISTER =================

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            careerGoal,
            preferredLanguage,
            preferredPlatform,
            courseType,
            experienceLevel,
            studyHours
        } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            careerGoal,
            preferredLanguage,
            preferredPlatform,
            courseType,
            experienceLevel,
            studyHours
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                careerGoal: user.careerGoal,
                preferredLanguage: user.preferredLanguage,
                preferredPlatform: user.preferredPlatform,
                courseType: user.courseType,
                experienceLevel: user.experienceLevel,
                studyHours: user.studyHours
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ================= LOGIN =================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                careerGoal: user.careerGoal,
                preferredLanguage: user.preferredLanguage,
                preferredPlatform: user.preferredPlatform,
                courseType: user.courseType,
                experienceLevel: user.experienceLevel,
                studyHours: user.studyHours
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ================= GET PROFILE =================

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};


// ================= UPDATE PROFILE =================

const updateProfile = async (req, res) => {
    try {
        const {
            name,
            careerGoal,
            preferredLanguage,
            preferredPlatform,
            courseType,
            experienceLevel,
            studyHours
        } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name !== undefined) user.name = name;
        if (careerGoal !== undefined) user.careerGoal = careerGoal;
        if (preferredLanguage !== undefined)
            user.preferredLanguage = preferredLanguage;
        if (preferredPlatform !== undefined)
            user.preferredPlatform = preferredPlatform;
        if (courseType !== undefined)
            user.courseType = courseType;
        if (experienceLevel !== undefined)
            user.experienceLevel = experienceLevel;
        if (studyHours !== undefined)
            user.studyHours = studyHours;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                careerGoal: user.careerGoal,
                preferredLanguage: user.preferredLanguage,
                preferredPlatform: user.preferredPlatform,
                courseType: user.courseType,
                experienceLevel: user.experienceLevel,
                studyHours: user.studyHours
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};
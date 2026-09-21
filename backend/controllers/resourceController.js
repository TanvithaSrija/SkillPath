const LearningResource = require("../models/LearningResource");
const User = require("../models/User");
// ==========================================
// GET ALL RESOURCES + SEARCH + FILTER
// ==========================================
const getResources = async (req, res) => {
  try {
    const {
      search,
      platform,
      type,
      difficulty,
      isFree,
      skill,
    } = req.query;

    const filter = {};

    // Search by title, description, platform or skill
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { platform: { $regex: search, $options: "i" } },
        { skill: { $regex: search, $options: "i" } },
      ];
    }

    // Platform filter
    if (platform) {
      filter.platform = {
        $regex: platform,
        $options: "i",
      };
    }

    // Resource type filter
    if (type) {
      filter.type = type;
    }

    // Difficulty filter
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    // Free / Paid filter
    if (isFree !== undefined) {
      filter.isFree = isFree === "true";
    }

    // Skill filter
    if (skill) {
      filter.skill = {
        $regex: skill,
        $options: "i",
      };
    }

    const resources = await LearningResource.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("Get resources error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch learning resources",
    });
  }
};

// ==========================================
// GET SINGLE RESOURCE
// ==========================================
const getResourceById = async (req, res) => {
  try {
    const resource = await LearningResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Learning resource not found",
      });
    }

    res.status(200).json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error("Get resource error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resource",
    });
  }
};

// ==========================================
// CREATE RESOURCE
// ==========================================
const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      url,
      platform,
      type,
      skill,
      difficulty,
      isFree,
      thumbnail,
    } = req.body;

    // Required field validation
    if (!title || !url || !platform || !type || !skill) {
      return res.status(400).json({
        success: false,
        message:
          "Title, URL, platform, type and skill are required",
      });
    }

    const resource = await LearningResource.create({
      title,
      description,
      url,
      platform,
      type,
      skill,
      difficulty,
      isFree,
      thumbnail,
    });

    res.status(201).json({
      success: true,
      message: "Learning resource created successfully",
      resource,
    });
  } catch (error) {
    console.error("Create resource error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create learning resource",
    });
  }
};

// ==========================================
// UPDATE RESOURCE
// ==========================================
const updateResource = async (req, res) => {
  try {
    const resource = await LearningResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Learning resource not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Learning resource updated successfully",
      resource,
    });
  } catch (error) {
    console.error("Update resource error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update resource",
    });
  }
};

// ==========================================
// DELETE RESOURCE
// ==========================================
const deleteResource = async (req, res) => {
  try {
    const resource = await LearningResource.findByIdAndDelete(
      req.params.id
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Learning resource not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Learning resource deleted successfully",
    });
  } catch (error) {
    console.error("Delete resource error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete resource",
    });
  }
};
// ======================================================
// PERSONALIZED RESOURCE RECOMMENDATIONS
// ======================================================

const getRecommendedResources = async (req, res) => {
  try {
    // ----------------------------------------------
    // Get logged-in user
    // ----------------------------------------------
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ----------------------------------------------
    // Get user preferences
    // ----------------------------------------------
    const {
      careerGoal = "",
      preferredLanguage = "",
      preferredPlatform = "",
      courseType = "",
      experienceLevel = "",
    } = user;

    // ----------------------------------------------
    // Get all resources
    // ----------------------------------------------
    const resources = await LearningResource.find({});

    // ----------------------------------------------
    // Convert user data to lowercase
    // ----------------------------------------------
    const goal = careerGoal.toLowerCase();
    const language = preferredLanguage.toLowerCase();
    const platform = preferredPlatform.toLowerCase();
    const selectedCourseType = courseType.toLowerCase();
    const experience = experienceLevel.toLowerCase();

    // ----------------------------------------------
    // Calculate recommendation score
    // ----------------------------------------------
    const recommendations = resources.map((resource) => {
      let score = 0;
      const reasons = [];

      const resourceTitle =
        (resource.title || "").toLowerCase();

      const resourceDescription =
        (resource.description || "").toLowerCase();

      const resourceSkill =
        (resource.skill || "").toLowerCase();

      const resourcePlatform =
        (resource.platform || "").toLowerCase();

      const resourceType =
        (resource.type || "").toLowerCase();

      const resourceDifficulty =
        (resource.difficulty || "").toLowerCase();

      // ============================================
      // 1. PREFERRED LANGUAGE
      // ============================================
      if (language) {
        if (
          resourceSkill.includes(language) ||
          resourceTitle.includes(language) ||
          resourceDescription.includes(language)
        ) {
          score += 30;
          reasons.push(
            "Matches your preferred programming language"
          );
        }
      }

      // ============================================
      // 2. PREFERRED PLATFORM
      // ============================================
      if (platform) {
        if (
          resourcePlatform.includes(platform)
        ) {
          score += 20;
          reasons.push(
            "Matches your preferred platform"
          );
        }
      }

      // ============================================
      // 3. COURSE TYPE
      // ============================================
      if (selectedCourseType) {
        if (
          resourceType.includes(
            selectedCourseType
          )
        ) {
          score += 15;
          reasons.push(
            "Matches your preferred learning format"
          );
        }
      }

      // ============================================
      // 4. EXPERIENCE LEVEL
      // ============================================
      if (experience) {
        if (
          resourceDifficulty === experience
        ) {
          score += 15;
          reasons.push(
            "Matches your experience level"
          );
        }
      }

      // ============================================
      // 5. CAREER GOAL
      // ============================================
      if (goal) {
        const careerKeywords = [];

        // Software / Full Stack
        if (
          goal.includes("software") ||
          goal.includes("developer") ||
          goal.includes("full stack") ||
          goal.includes("web")
        ) {
          careerKeywords.push(
            "software",
            "developer",
            "full stack",
            "web",
            "javascript",
            "react",
            "java",
            "spring",
            "api",
            "git",
            "sql",
            "dsa"
          );
        }

        // Data Analyst
        if (
          goal.includes("data analyst") ||
          goal.includes("data analysis")
        ) {
          careerKeywords.push(
            "data",
            "sql",
            "python",
            "pandas",
            "numpy",
            "excel",
            "analytics"
          );
        }

        // Data Scientist
        if (
          goal.includes("data scientist") ||
          goal.includes("data science")
        ) {
          careerKeywords.push(
            "data",
            "python",
            "machine learning",
            "numpy",
            "pandas",
            "statistics"
          );
        }

        // AI / ML
        if (
          goal.includes("artificial intelligence") ||
          goal.includes("ai") ||
          goal.includes("machine learning") ||
          goal.includes("ml")
        ) {
          careerKeywords.push(
            "python",
            "machine learning",
            "ai",
            "numpy",
            "pandas",
            "scikit",
            "deep learning"
          );
        }

        // Cloud / DevOps
        if (
          goal.includes("cloud") ||
          goal.includes("devops")
        ) {
          careerKeywords.push(
            "aws",
            "azure",
            "cloud",
            "docker",
            "kubernetes",
            "ci/cd",
            "devops"
          );
        }

        // Cybersecurity
        if (
          goal.includes("cyber") ||
          goal.includes("security")
        ) {
          careerKeywords.push(
            "security",
            "cybersecurity",
            "owasp"
          );
        }

        // Check career keywords
        const resourceText =
          `${resourceTitle} ${resourceDescription} ${resourceSkill}`
            .toLowerCase();

        const matchedKeyword =
          careerKeywords.some((keyword) =>
            resourceText.includes(keyword)
          );

        if (matchedKeyword) {
          score += 20;

          reasons.push(
            "Relevant to your career goal"
          );
        }
      }

      // ============================================
      // CAP SCORE AT 100
      // ============================================
      score = Math.min(score, 100);

      return {
        resource,
        matchScore: score,
        reasons,
      };
    });

    // ----------------------------------------------
    // Sort highest match first
    // ----------------------------------------------
    recommendations.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    // ----------------------------------------------
    // Return top 6 recommendations
    // ----------------------------------------------
    const topRecommendations =
      recommendations
        .filter(
          (item) => item.matchScore > 0
        )
        .slice(0, 6);

    return res.status(200).json({
      success: true,
      count: topRecommendations.length,
      recommendations: topRecommendations,
    });
  } catch (error) {
    console.error(
      "Recommendation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate recommendations",
    });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getRecommendedResources,
};
const express = require("express");

const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getRecommendedResources,
} = require("../controllers/resourceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET all resources / search / filters
router.get("/", getResources);

// GET personalized recommendations
// IMPORTANT: this MUST come before /:id
router.get(
  "/recommended",
  protect,
  getRecommendedResources
);

// GET single resource
router.get("/:id", getResourceById);

// CREATE resource
router.post("/", createResource);

// UPDATE resource
router.put("/:id", updateResource);

// DELETE resource
router.delete("/:id", deleteResource);

module.exports = router;
const express = require("express");

const {
  startLearning,
  getMyProgress,
  getResourceProgress,
  updateProgress,
  deleteProgress,
} = require("../controllers/progressController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// START LEARNING
// POST /api/progress
// ======================================================

router.post(
  "/",
  protect,
  startLearning
);

// ======================================================
// GET ALL MY PROGRESS
// GET /api/progress
// ======================================================

router.get(
  "/",
  protect,
  getMyProgress
);

// ======================================================
// GET PROGRESS FOR ONE RESOURCE
// GET /api/progress/:resourceId
// ======================================================

router.get(
  "/:resourceId",
  protect,
  getResourceProgress
);

// ======================================================
// UPDATE PROGRESS
// PUT /api/progress/:resourceId
// ======================================================

router.put(
  "/:resourceId",
  protect,
  updateProgress
);

// ======================================================
// DELETE PROGRESS
// DELETE /api/progress/:resourceId
// ======================================================

router.delete(
  "/:resourceId",
  protect,
  deleteProgress
);

module.exports = router;
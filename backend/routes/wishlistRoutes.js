const express = require("express");
console.log("✅ Wishlist routes loaded");
const {
  getWishlist,
  addToWishlist,
  checkWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user's wishlist
router.get("/", protect, getWishlist);

// Add resource to wishlist
router.post("/", protect, addToWishlist);

// Check whether resource is wishlisted
router.get("/check/:resourceId", protect, checkWishlist);

// Remove resource from wishlist
router.delete("/:resourceId", protect, removeFromWishlist);

module.exports = router;
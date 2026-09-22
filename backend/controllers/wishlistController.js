const Wishlist = require("../models/Wishlist");
const LearningResource = require("../models/LearningResource");

// ==========================================
// GET USER WISHLIST
// ==========================================
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlist = await Wishlist.find({ user: userId })
      .populate("resource")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};

// ==========================================
// ADD RESOURCE TO WISHLIST
// ==========================================
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { resourceId } = req.body;

    // Check resource ID
    if (!resourceId) {
      return res.status(400).json({
        success: false,
        message: "Resource ID is required",
      });
    }

    // Check whether resource exists
    const resource = await LearningResource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Learning resource not found",
      });
    }

    // Check whether already in wishlist
    const existingWishlist = await Wishlist.findOne({
      user: userId,
      resource: resourceId,
    });

    if (existingWishlist) {
      return res.status(409).json({
        success: false,
        message: "Resource is already in your wishlist",
      });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      user: userId,
      resource: resourceId,
    });

    // Return resource details also
    await wishlistItem.populate("resource");

    res.status(201).json({
      success: true,
      message: "Resource added to wishlist",
      wishlistItem,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add resource to wishlist",
    });
  }
};

// ==========================================
// CHECK WHETHER RESOURCE IS IN WISHLIST
// ==========================================
const checkWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { resourceId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      user: userId,
      resource: resourceId,
    });

    res.status(200).json({
      success: true,
      isWishlisted: !!wishlistItem,
    });
  } catch (error) {
    console.error("Check wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check wishlist",
    });
  }
};

// ==========================================
// REMOVE RESOURCE FROM WISHLIST
// ==========================================
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { resourceId } = req.params;

    const wishlistItem = await Wishlist.findOneAndDelete({
      user: userId,
      resource: resourceId,
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: "Resource not found in wishlist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resource removed from wishlist",
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove resource from wishlist",
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  checkWishlist,
  removeFromWishlist,
};
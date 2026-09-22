const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningResource",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same resource from being added twice
wishlistSchema.index(
  { user: 1, resource: 1 },
  { unique: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
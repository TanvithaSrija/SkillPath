import axios from "axios";

const API_URL = "http://localhost:5000/api/wishlist";

// Get user's wishlist
const getWishlist = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Add resource to wishlist
const addToWishlist = async (resourceId, token) => {
  const response = await axios.post(
    API_URL,
    {
      resourceId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Check whether resource is wishlisted
const checkWishlist = async (resourceId, token) => {
  const response = await axios.get(
    `${API_URL}/check/${resourceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Remove resource from wishlist
const removeFromWishlist = async (resourceId, token) => {
  const response = await axios.delete(
    `${API_URL}/${resourceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export default {
  getWishlist,
  addToWishlist,
  checkWishlist,
  removeFromWishlist,
};
import axios from "axios";

const API_URL = "http://localhost:5000/api/resources";

// --------------------------------------------------
// Get all resources with filters
// --------------------------------------------------
const getResources = async (params = {}) => {
  const response = await axios.get(API_URL, {
    params,
  });

  return response.data;
};

// --------------------------------------------------
// Get single resource by ID
// --------------------------------------------------
const getResourceById = async (resourceId) => {
  const response = await axios.get(
    `${API_URL}/${resourceId}`
  );

  return response.data;
};

// --------------------------------------------------
// Get personalized recommendations
// --------------------------------------------------
const getRecommendedResources = async (token) => {
  const response = await axios.get(
    `${API_URL}/recommended`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export default {
  getResources,
  getResourceById,
  getRecommendedResources,
};
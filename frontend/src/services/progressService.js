import axios from "axios";

const API_URL = "http://localhost:5000/api/progress";

// =============================================
// Start learning
// =============================================

const startLearning = async (resourceId, token) => {
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

// =============================================
// Get all learning progress
// =============================================

const getMyProgress = async (token) => {
  const response = await axios.get(
    API_URL,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =============================================
// Get progress for one resource
// =============================================

const getResourceProgress = async (
  resourceId,
  token
) => {
  const response = await axios.get(
    `${API_URL}/${resourceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =============================================
// Update progress
// =============================================

const updateProgress = async (
  resourceId,
  progress,
  token
) => {
  const response = await axios.put(
    `${API_URL}/${resourceId}`,
    {
      progress,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =============================================
// Delete progress
// =============================================

const deleteProgress = async (
  resourceId,
  token
) => {
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
  startLearning,
  getMyProgress,
  getResourceProgress,
  updateProgress,
  deleteProgress,
};
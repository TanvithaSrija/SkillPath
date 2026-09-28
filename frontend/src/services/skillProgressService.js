import axios from "axios";

const API_URL = "http://localhost:5000/api/skill-progress";

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getMySkillProgress = async (token) => {
  const response = await axios.get(
    API_URL,
    getHeaders(token)
  );

  return response.data;
};

const getSkillProgress = async (skillId, token) => {
  const response = await axios.get(
    `${API_URL}/${skillId}`,
    getHeaders(token)
  );

  return response.data;
};

const createSkillProgress = async (data, token) => {
  const response = await axios.post(
    API_URL,
    data,
    getHeaders(token)
  );

  return response.data;
};

const updateSkillProgress = async (
  skillId,
  data,
  token
) => {
  const response = await axios.put(
    `${API_URL}/${skillId}`,
    data,
    getHeaders(token)
  );

  return response.data;
};

export default {
  getMySkillProgress,
  getSkillProgress,
  createSkillProgress,
  updateSkillProgress,
};
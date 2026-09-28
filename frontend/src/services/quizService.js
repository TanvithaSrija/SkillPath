import axios from "axios";

const API_URL = "http://localhost:5000/api/quizzes";

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getQuizBySkill = async (skillId, token) => {
  const response = await axios.get(
    `${API_URL}/${skillId}`,
    getAuthHeaders(token)
  );

  return response.data;
};

const submitQuiz = async (quizData, token) => {
  const response = await axios.post(
    `${API_URL}/submit`,
    quizData,
    getAuthHeaders(token)
  );

  return response.data;
};

export default {
  getQuizBySkill,
  submitQuiz,
};
import axios from "axios";

const API_URL = "http://localhost:5000/api/courses";

// Get all published courses
const getCourses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get a single course with its lessons
const getCourseById = async (courseId) => {
  const response = await axios.get(
    `${API_URL}/${courseId}`
  );

  return response.data;
};

export default {
  getCourses,
  getCourseById,
};
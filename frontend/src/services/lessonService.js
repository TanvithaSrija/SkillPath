import axios from "axios";

const API_URL = "http://localhost:5000/api/lessons";

// Get all lessons for a course
const getLessonsByCourse = async (courseId) => {
  const response = await axios.get(
    `${API_URL}/course/${courseId}`
  );

  return response.data;
};

// Get a single lesson
const getLessonById = async (lessonId) => {
  const response = await axios.get(
    `${API_URL}/${lessonId}`
  );

  return response.data;
};

export default {
  getLessonsByCourse,
  getLessonById,
};
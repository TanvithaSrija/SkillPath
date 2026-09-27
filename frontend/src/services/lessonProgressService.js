import axios from "axios";

const API_URL =
  "http://localhost:5000/api/lesson-progress";

// Start a lesson
const startLesson = async (
  lessonId,
  token
) => {
  const response = await axios.post(
    API_URL,
    { lessonId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get progress for one lesson
const getLessonProgress = async (
  lessonId,
  token
) => {
  const response = await axios.get(
    `${API_URL}/${lessonId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Update lesson progress
const updateLessonProgress = async (
  lessonId,
  progress,
  token
) => {
  const response = await axios.put(
    `${API_URL}/${lessonId}`,
    { progress },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get all lesson progress
const getMyLessonProgress = async (
  token
) => {
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
// Get course progress
const getCourseProgress = async (
  courseId,
  token
) => {
  const response = await axios.get(
    `${API_URL}/course/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export default {
  startLesson,
  getLessonProgress,
  updateLessonProgress,
  getMyLessonProgress,
  getCourseProgress,
};
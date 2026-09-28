import axios from "axios";

const API_URL = "http://localhost:5000/api/notes";

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Get all notes
const getMyNotes = async (token) => {
  const response = await axios.get(
    API_URL,
    getAuthHeaders(token)
  );

  return response.data;
};

// Get notes for a specific skill
const getNotesBySkill = async (skillId, token) => {
  const response = await axios.get(
    `${API_URL}/${skillId}`,
    getAuthHeaders(token)
  );

  return response.data;
};

// Create note
const createNote = async (noteData, token) => {
  const response = await axios.post(
    API_URL,
    noteData,
    getAuthHeaders(token)
  );

  return response.data;
};

// Update note
const updateNote = async (noteId, noteData, token) => {
  const response = await axios.put(
    `${API_URL}/${noteId}`,
    noteData,
    getAuthHeaders(token)
  );

  return response.data;
};

// Delete note
const deleteNote = async (noteId, token) => {
  const response = await axios.delete(
    `${API_URL}/${noteId}`,
    getAuthHeaders(token)
  );

  return response.data;
};

export default {
  getMyNotes,
  getNotesBySkill,
  createNote,
  updateNote,
  deleteNote,
};
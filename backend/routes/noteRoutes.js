const express = require("express");

const {
  getMyNotes,
  getNotesBySkill,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMyNotes);

router.get("/:skillId", protect, getNotesBySkill);

router.post("/", protect, createNote);

router.put("/:id", protect, updateNote);

router.delete("/:id", protect, deleteNote);

module.exports = router;
const Note = require("../models/Note");

const getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.userId,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
};

const getNotesBySkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const notes = await Note.find({
      userId: req.user.userId,
      skillId,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error("Get skill notes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch skill notes",
    });
  }
};

const createNote = async (req, res) => {
  try {
    const { skillId, title, content } = req.body;

    if (!skillId || !title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Skill, title and content are required",
      });
    }

    const note = await Note.create({
      userId: req.user.userId,
      skillId: skillId.trim(),
      title: title.trim(),
      content: content.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create note",
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, skillId } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and content cannot be empty",
      });
    }

    const note = await Note.findOne({
      _id: id,
      userId: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    note.title = title.trim();
    note.content = content.trim();

    if (skillId?.trim()) {
      note.skillId = skillId.trim();
    }

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error("Update note error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update note",
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete note",
    });
  }
};

module.exports = {
  getMyNotes,
  getNotesBySkill,
  createNote,
  updateNote,
  deleteNote,
};
import { useEffect, useState } from "react";
import {
    Link,
    useParams,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import noteService from "../services/noteService";

import "../styles/Notes.css";

function Notes() {
    const { skillId } = useParams();
    const { token } = useAuth();

    const [notes, setNotes] = useState([]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedSkill, setSelectedSkill] =
        useState(skillId || "");

    const [editingId, setEditingId] =
        useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadNotes = async () => {
        try {
            setLoading(true);

            const data = skillId
                ? await noteService.getNotesBySkill(
                    skillId,
                    token
                )
                : await noteService.getMyNotes(
                    token
                );

            setNotes(data.notes || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load notes"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            loadNotes();
        }
    }, [token, skillId]);

    const resetForm = () => {
        setTitle("");
        setContent("");
        setSelectedSkill(skillId || "");
        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!selectedSkill.trim()) {
            setError(
                "Please enter a skill."
            );
            return;
        }

        if (!title.trim()) {
            setError(
                "Note title cannot be empty."
            );
            return;
        }

        if (!content.trim()) {
            setError(
                "Note content cannot be empty."
            );
            return;
        }

        try {
            setSaving(true);

            if (editingId) {
                await noteService.updateNote(
                    editingId,
                    {
                        skillId: selectedSkill,
                        title,
                        content,
                    },
                    token
                );

                setMessage(
                    "Note updated successfully."
                );
            } else {
                await noteService.createNote(
                    {
                        skillId: selectedSkill,
                        title,
                        content,
                    },
                    token
                );

                setMessage(
                    "Note created successfully."
                );
            }

            resetForm();
            await loadNotes();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save note"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (note) => {
        setEditingId(note._id);
        setSelectedSkill(note.skillId);
        setTitle(note.title);
        setContent(note.content);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (noteId) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this note?"
            );

        if (!confirmed) return;

        try {
            await noteService.deleteNote(
                noteId,
                token
            );

            setMessage(
                "Note deleted successfully."
            );

            await loadNotes();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete note"
            );
        }
    };

    return (
        <div className="notes-page">

            <div className="notes-header">

                <div>
                    <Link
                        to="/dashboard"
                        className="notes-back"
                    >
                        ← Dashboard
                    </Link>

                    <h1>
                        My Learning Notes
                    </h1>

                    <p>
                        Capture important concepts,
                        examples and learning points.
                    </p>
                </div>

            </div>

            {message && (
                <div className="notes-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="notes-error">
                    {error}
                </div>
            )}

            <div className="notes-editor">

                <div className="editor-header">
                    <h2>
                        {editingId
                            ? "Edit Note"
                            : "Create a New Note"}
                    </h2>
                </div>

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            Skill
                        </label>

                        <input
                            type="text"
                            value={selectedSkill}
                            onChange={(event) =>
                                setSelectedSkill(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. Java"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            placeholder="Enter note title"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Content
                        </label>

                        <textarea
                            value={content}
                            onChange={(event) =>
                                setContent(
                                    event.target.value
                                )
                            }
                            placeholder="Write your learning notes..."
                            rows={7}
                        />

                    </div>

                    <div className="editor-actions">

                        <button
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                ? "Update Note"
                                : "Create Note"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={
                                    resetForm
                                }
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </div>

            <div className="notes-list-section">

                <div className="notes-list-header">
                    <h2>
                        Your Notes
                    </h2>

                    <span>
                        {notes.length} notes
                    </span>
                </div>

                {loading ? (
                    <p>Loading notes...</p>
                ) : notes.length === 0 ? (
                    <div className="notes-empty">
                        <h3>
                            No notes yet
                        </h3>

                        <p>
                            Create your first learning
                            note above.
                        </p>
                    </div>
                ) : (
                    <div className="notes-grid">

                        {notes.map((note) => (
                            <div
                                className="note-card"
                                key={note._id}
                            >

                                <div className="note-card-header">

                                    <div>
                                        <span className="note-skill">
                                            {note.skillId}
                                        </span>

                                        <h3>
                                            {note.title}
                                        </h3>
                                    </div>

                                </div>

                                <p className="note-content">
                                    {note.content}
                                </p>

                                <div className="note-date">
                                    Updated{" "}
                                    {new Date(
                                        note.updatedAt
                                    ).toLocaleDateString()}
                                </div>

                                <div className="note-actions">

                                    <button
                                        onClick={() =>
                                            handleEdit(
                                                note
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-note"
                                        onClick={() =>
                                            handleDelete(
                                                note._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Notes;
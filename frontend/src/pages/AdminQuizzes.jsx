import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import QuizTable from "../components/QuizTable";
import AdminForm from "../components/AdminForm";

const AdminQuizzes = () => {
    const { token } = useAuth();

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);

    const [formData, setFormData] = useState({
        skillId: "",
        questions: "",
        passingMarks: "",
        timeLimit: ""
    });

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/admin/quizzes",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch quizzes"
                );
            }

            setQuizzes(
                data.quizzes ||
                data ||
                []
            );

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [token]);

    const handleAdd = () => {
        setEditingQuiz(null);

        setFormData({
            skillId: "",
            questions: "",
            passingMarks: "",
            timeLimit: ""
        });

        setShowForm(true);
    };

    const handleEdit = (quiz) => {
        setEditingQuiz(quiz);

        setFormData({
            skillId: quiz.skillId || "",
            questions: JSON.stringify(
                quiz.questions || [],
                null,
                2
            ),
            passingMarks:
                quiz.passingMarks || "",
            timeLimit:
                quiz.timeLimit || ""
        });

        setShowForm(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let questions;

            try {
                questions = JSON.parse(
                    formData.questions
                );
            } catch {
                throw new Error(
                    "Questions must be valid JSON"
                );
            }

            const payload = {
                skillId: formData.skillId,
                questions,
                passingMarks:
                    Number(formData.passingMarks),
                timeLimit:
                    Number(formData.timeLimit)
            };

            const url = editingQuiz
                ? `http://localhost:5000/api/admin/quizzes/${editingQuiz._id}`
                : "http://localhost:5000/api/admin/quizzes";

            const response = await fetch(url, {
                method: editingQuiz
                    ? "PUT"
                    : "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save quiz"
                );
            }

            setShowForm(false);
            setEditingQuiz(null);

            fetchQuizzes();

        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this quiz?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/admin/quizzes/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete quiz"
                );
            }

            fetchQuizzes();

        } catch (error) {
            setError(error.message);
        }
    };

    const fields = [
        {
            name: "skillId",
            label: "Skill ID",
            type: "text"
        },
        {
            name: "questions",
            label: "Questions JSON",
            type: "textarea"
        },
        {
            name: "passingMarks",
            label: "Passing Marks",
            type: "number"
        },
        {
            name: "timeLimit",
            label: "Time Limit (minutes)",
            type: "number"
        }
    ];

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh"
            }}
        >

            <AdminSidebar />

            <div style={{ flex: 1 }}>

                <AdminNavbar />

                <main style={{ padding: "30px" }}>

                    <h1>Manage Quizzes</h1>

                    <button onClick={handleAdd}>
                        Add Quiz
                    </button>

                    {showForm && (
                        <AdminForm
                            title={
                                editingQuiz
                                    ? "Edit Quiz"
                                    : "Add Quiz"
                            }
                            fields={fields}
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingQuiz(null);
                            }}
                            submitText={
                                editingQuiz
                                    ? "Update"
                                    : "Create"
                            }
                        />
                    )}

                    {loading && (
                        <p>Loading quizzes...</p>
                    )}

                    {error && (
                        <p>{error}</p>
                    )}

                    {!loading && (
                        <QuizTable
                            quizzes={quizzes}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}

                </main>

            </div>

        </div>
    );
};

export default AdminQuizzes;
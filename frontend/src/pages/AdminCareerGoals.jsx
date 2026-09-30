import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import CareerGoalTable from "../components/CareerGoalTable";
import AdminForm from "../components/AdminForm";

const AdminCareerGoals = () => {
    const { token } = useAuth();

    const [careerGoals, setCareerGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        icon: "",
        estimatedDuration: "",
        difficulty: "Beginner"
    });

    const fetchCareerGoals = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/admin/career-goals",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch career goals"
                );
            }

            setCareerGoals(
                data.careerGoals ||
                data.goals ||
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
        fetchCareerGoals();
    }, [token]);

    const handleAdd = () => {
        setEditingGoal(null);

        setFormData({
            title: "",
            description: "",
            icon: "",
            estimatedDuration: "",
            difficulty: "Beginner"
        });

        setShowForm(true);
    };

    const handleEdit = (goal) => {
        setEditingGoal(goal);

        setFormData({
            title: goal.title || "",
            description: goal.description || "",
            icon: goal.icon || "",
            estimatedDuration:
                goal.estimatedDuration || "",
            difficulty:
                goal.difficulty || "Beginner"
        });

        setShowForm(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const url = editingGoal
                ? `http://localhost:5000/api/admin/career-goals/${editingGoal._id}`
                : "http://localhost:5000/api/admin/career-goals";

            const response = await fetch(url, {
                method: editingGoal ? "PUT" : "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save career goal"
                );
            }

            setShowForm(false);
            setEditingGoal(null);

            setFormData({
                title: "",
                description: "",
                icon: "",
                estimatedDuration: "",
                difficulty: "Beginner"
            });

            fetchCareerGoals();

        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this career goal?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/admin/career-goals/${id}`,
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
                    data.message || "Failed to delete career goal"
                );
            }

            fetchCareerGoals();

        } catch (error) {
            setError(error.message);
        }
    };

    const fields = [
        {
            name: "title",
            label: "Career Goal Title",
            type: "text"
        },
        {
            name: "description",
            label: "Description",
            type: "textarea"
        },
        {
            name: "icon",
            label: "Icon",
            type: "text",
            required: false
        },
        {
            name: "estimatedDuration",
            label: "Estimated Duration",
            type: "text"
        },
        {
            name: "difficulty",
            label: "Difficulty",
            type: "text"
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

                    <h1>Manage Career Goals</h1>

                    <button onClick={handleAdd}>
                        Add Career Goal
                    </button>

                    {showForm && (
                        <AdminForm
                            title={
                                editingGoal
                                    ? "Edit Career Goal"
                                    : "Add Career Goal"
                            }
                            fields={fields}
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingGoal(null);
                            }}
                            submitText={
                                editingGoal
                                    ? "Update"
                                    : "Create"
                            }
                        />
                    )}

                    {loading && (
                        <p>Loading career goals...</p>
                    )}

                    {error && (
                        <p>{error}</p>
                    )}

                    {!loading && (
                        <CareerGoalTable
                            careerGoals={careerGoals}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}

                </main>

            </div>

        </div>
    );
};

export default AdminCareerGoals;
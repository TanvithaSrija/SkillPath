import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import SkillTable from "../components/SkillTable";
import AdminForm from "../components/AdminForm";

const AdminSkills = () => {
    const { token } = useAuth();

    const [skills, setSkills] = useState([]);
    const [careerGoals, setCareerGoals] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        careerGoalId: "",
        order: "",
        estimatedHours: "",
        difficulty: "Beginner",
        prerequisiteSkill: ""
    });

    const fetchSkills = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/admin/skills",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch skills"
                );
            }

            setSkills(
                data.skills ||
                data ||
                []
            );

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCareerGoals = async () => {
        try {
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
                    data.message ||
                    "Failed to fetch career goals"
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
        }
    };

    useEffect(() => {
        fetchSkills();
        fetchCareerGoals();
    }, [token]);

    const handleAdd = () => {
        setEditingSkill(null);

        setFormData({
            title: "",
            description: "",
            careerGoalId: "",
            order: "",
            estimatedHours: "",
            difficulty: "Beginner",
            prerequisiteSkill: ""
        });

        setShowForm(true);
    };

    const handleEdit = (skill) => {
        setEditingSkill(skill);

        setFormData({
            title: skill.title || "",
            description: skill.description || "",
            careerGoalId: skill.careerGoalId || "",
            order: skill.order || "",
            estimatedHours: skill.estimatedHours || "",
            difficulty: skill.difficulty || "Beginner",
            prerequisiteSkill:
                skill.prerequisiteSkill || ""
        });

        setShowForm(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const payload = {
                ...formData,
                order: Number(formData.order),
                estimatedHours: Number(
                    formData.estimatedHours
                ),
                prerequisiteSkill:
                    formData.prerequisiteSkill || null
            };

            const url = editingSkill
                ? `http://localhost:5000/api/admin/skills/${editingSkill._id}`
                : "http://localhost:5000/api/admin/skills";

            const response = await fetch(url, {
                method: editingSkill ? "PUT" : "POST",

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
                    "Failed to save skill"
                );
            }

            setShowForm(false);
            setEditingSkill(null);

            fetchSkills();

        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this skill?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/admin/skills/${id}`,
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
                    "Failed to delete skill"
                );
            }

            fetchSkills();

        } catch (error) {
            setError(error.message);
        }
    };

    const fields = [
        {
            name: "title",
            label: "Skill Title",
            type: "text"
        },
        {
            name: "description",
            label: "Description",
            type: "textarea"
        },
        {
            name: "careerGoalId",
            label: "Career Goal ID",
            type: "text"
        },
        {
            name: "order",
            label: "Order",
            type: "number"
        },
        {
            name: "estimatedHours",
            label: "Estimated Hours",
            type: "number"
        },
        {
            name: "difficulty",
            label: "Difficulty",
            type: "text"
        },
        {
            name: "prerequisiteSkill",
            label: "Prerequisite Skill ID",
            type: "text",
            required: false
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

                    <h1>Manage Skills</h1>

                    <button onClick={handleAdd}>
                        Add Skill
                    </button>

                    {showForm && (
                        <AdminForm
                            title={
                                editingSkill
                                    ? "Edit Skill"
                                    : "Add Skill"
                            }
                            fields={fields}
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingSkill(null);
                            }}
                            submitText={
                                editingSkill
                                    ? "Update"
                                    : "Create"
                            }
                        />
                    )}

                    {loading && (
                        <p>Loading skills...</p>
                    )}

                    {error && (
                        <p>{error}</p>
                    )}

                    {!loading && (
                        <SkillTable
                            skills={skills}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}

                </main>

            </div>

        </div>
    );
};

export default AdminSkills;
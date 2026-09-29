import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import ResourceTable from "../components/ResourceTable";
import AdminForm from "../components/AdminForm";

const AdminResources = () => {
    const { token } = useAuth();

    const [resources, setResources] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingResource, setEditingResource] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        url: "",
        platform: "",
        type: "Course",
        skill: "",
        skillId: "",
        difficulty: "Beginner",
        isFree: true,
        thumbnail: ""
    });

    const fetchResources = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/admin/resources",
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
                    "Failed to fetch resources"
                );
            }

            setResources(
                data.resources ||
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
        fetchResources();
    }, [token]);

    const handleAdd = () => {
        setEditingResource(null);

        setFormData({
            title: "",
            description: "",
            url: "",
            platform: "",
            type: "Course",
            skill: "",
            skillId: "",
            difficulty: "Beginner",
            isFree: true,
            thumbnail: ""
        });

        setShowForm(true);
    };

    const handleEdit = (resource) => {
        setEditingResource(resource);

        setFormData({
            title: resource.title || "",
            description: resource.description || "",
            url: resource.url || "",
            platform: resource.platform || "",
            type: resource.type || "Course",
            skill: resource.skill || "",
            skillId: resource.skillId || "",
            difficulty:
                resource.difficulty || "Beginner",
            isFree:
                resource.isFree !== false,
            thumbnail:
                resource.thumbnail || ""
        });

        setShowForm(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const payload = {
                ...formData,
                isFree: Boolean(formData.isFree),
                skillId: formData.skillId || null
            };

            const url = editingResource
                ? `http://localhost:5000/api/admin/resources/${editingResource._id}`
                : "http://localhost:5000/api/admin/resources";

            const response = await fetch(url, {
                method: editingResource
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
                    "Failed to save resource"
                );
            }

            setShowForm(false);
            setEditingResource(null);

            fetchResources();

        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this resource?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/admin/resources/${id}`,
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
                    "Failed to delete resource"
                );
            }

            fetchResources();

        } catch (error) {
            setError(error.message);
        }
    };

    const fields = [
        {
            name: "title",
            label: "Title",
            type: "text"
        },
        {
            name: "description",
            label: "Description",
            type: "textarea",
            required: false
        },
        {
            name: "url",
            label: "URL",
            type: "url"
        },
        {
            name: "platform",
            label: "Platform",
            type: "text"
        },
        {
            name: "type",
            label: "Type",
            type: "text"
        },
        {
            name: "skill",
            label: "Skill",
            type: "text"
        },
        {
            name: "skillId",
            label: "Skill ID",
            type: "text",
            required: false
        },
        {
            name: "difficulty",
            label: "Difficulty",
            type: "text"
        },
        {
            name: "thumbnail",
            label: "Thumbnail URL",
            type: "url",
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

                    <h1>Manage Resources</h1>

                    <button onClick={handleAdd}>
                        Add Resource
                    </button>

                    {showForm && (
                        <AdminForm
                            title={
                                editingResource
                                    ? "Edit Resource"
                                    : "Add Resource"
                            }
                            fields={fields}
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingResource(null);
                            }}
                            submitText={
                                editingResource
                                    ? "Update"
                                    : "Create"
                            }
                        />
                    )}

                    {loading && (
                        <p>Loading resources...</p>
                    )}

                    {error && (
                        <p>{error}</p>
                    )}

                    {!loading && (
                        <ResourceTable
                            resources={resources}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}

                </main>

            </div>

        </div>
    );
};

export default AdminResources;
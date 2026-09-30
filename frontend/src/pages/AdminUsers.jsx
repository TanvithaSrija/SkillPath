import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import UserTable from "../components/UserTable";

const AdminUsers = () => {
    const { token } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/admin/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch users"
                );
            }

            setUsers(data.users || []);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/admin/users/${id}`,
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
                    data.message || "Failed to delete user"
                );
            }

            setUsers((currentUsers) =>
                currentUsers.filter(
                    (user) => user._id !== id
                )
            );

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh"
            }}
        >

            <AdminSidebar />

            <div
                style={{
                    flex: 1
                }}
            >

                <AdminNavbar />

                <main
                    style={{
                        padding: "30px"
                    }}
                >

                    <h1>Manage Users</h1>

                    <p>
                        View and manage SkillPath users.
                    </p>

                    {loading && (
                        <p>Loading users...</p>
                    )}

                    {error && (
                        <p>{error}</p>
                    )}

                    {!loading && !error && (
                        <UserTable
                            users={users}
                            onDelete={handleDelete}
                        />
                    )}

                </main>

            </div>

        </div>
    );
};

export default AdminUsers;
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import DashboardStats from "../components/DashboardStats";

const AdminDashboard = () => {
    const { token } = useAuth();

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCareerGoals: 0,
        totalSkills: 0,
        totalResources: 0,
        totalQuizzes: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:5000/api/admin/dashboard",
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
                        "Failed to load dashboard"
                    );
                }

                setStats(data.stats);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token]);

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

                    <h1>SkillPath Admin Dashboard</h1>

                    <p>
                        Manage users, career goals, skills,
                        resources and quizzes.
                    </p>

                    {loading && (
                        <p>Loading dashboard...</p>
                    )}

                    {error && (
                        <p>{error}</p>
                    )}

                    {!loading && !error && (
                        <DashboardStats stats={stats} />
                    )}

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
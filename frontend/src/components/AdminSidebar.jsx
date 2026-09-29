import { Link } from "react-router-dom";

const AdminSidebar = () => {
    return (
        <div
            style={{
                width: "240px",
                minHeight: "100vh",
                padding: "20px",
                borderRight: "1px solid #ddd",
                boxSizing: "border-box"
            }}
        >

            <h2>SkillPath Admin</h2>

            <nav
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    marginTop: "30px"
                }}
            >

                <Link to="/admin">
                    Dashboard
                </Link>

                <Link to="/admin/users">
                    Users
                </Link>

                <Link to="/admin/career-goals">
                    Career Goals
                </Link>

                <Link to="/admin/skills">
                    Skills
                </Link>

                <Link to="/admin/resources">
                    Resources
                </Link>

                <Link to="/admin/quizzes">
                    Quizzes
                </Link>

            </nav>

        </div>
    );
};

export default AdminSidebar;
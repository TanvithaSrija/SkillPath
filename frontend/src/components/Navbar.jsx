import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { logout } = useAuth();

    return (
        <nav className="profile-nav">
            <div className="brand-area">
                <Link to="/dashboard" className="brand-link">
                    <div className="brand-mark">S</div>

                    <span className="profile-logo">
                        SkillPath
                    </span>
                </Link>
            </div>

            <div className="nav-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/career-goals">Career Goals</Link>
                <Link to="/courses">Courses</Link>
                <Link to="/resources">Resources</Link>
                <Link to="/notes">Notes</Link>
                <Link to="/progress">Progress</Link>
                <Link to="/profile">Profile</Link>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
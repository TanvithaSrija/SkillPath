import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import "../styles/Auth.css";

const Profile = () => {
    const { user, token, logout, updateProfile } = useAuth();

    const [profile, setProfile] = useState(user);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await authService.getProfile(token);
                setProfile(data.user);
            } catch (error) {
                setError("Unable to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            loadProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const data = await updateProfile(profile);
            setProfile(data.user);

            setMessage("Profile updated successfully!");

            setTimeout(() => {
                setMessage("");
            }, 3000);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Profile update failed"
            );
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    const firstLetter =
        profile?.name?.charAt(0).toUpperCase() || "U";

    return (
        <div className="profile-page">

            {/* ================= NAVBAR ================= */}

            <nav className="profile-nav">

                <div className="brand-area">
                    <div className="brand-mark">
                        S
                    </div>

                    <span className="profile-logo">
                        SkillPath
                    </span>
                </div>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </nav>


            {/* ================= MAIN CONTENT ================= */}

            <main className="profile-container">

                {/* Profile Header */}

                <section className="profile-intro">

                    <div className="profile-avatar">
                        {firstLetter}
                    </div>

                    <div className="profile-intro-text">
                        <div className="profile-title-row">
                            <h1>My Profile</h1>
                            <span className="profile-status">
                                Active
                            </span>
                        </div>

                        <p>
                            Manage your account and personalize
                            your learning journey.
                        </p>
                    </div>

                </section>


                {/* ================= QUICK SUMMARY ================= */}

                <section className="profile-summary">

                    <div className="summary-card">

                        <div className="summary-icon">
                            🎯
                        </div>

                        <div>
                            <span>Career Goal</span>
                            <strong>
                                {profile?.careerGoal || "Not set"}
                            </strong>
                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-icon">
                            💻
                        </div>

                        <div>
                            <span>Learning Platform</span>
                            <strong>
                                {profile?.preferredPlatform || "Not set"}
                            </strong>
                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-icon">
                            ⏱
                        </div>

                        <div>
                            <span>Study Time</span>
                            <strong>
                                {profile?.studyHours || 0} hrs / day
                            </strong>
                        </div>

                    </div>

                </section>


                {/* ================= PROFILE CARD ================= */}

                <section className="profile-card">

                    <div className="profile-section-title">

                        <div>
                            <h2>Profile Information</h2>

                            <p>
                                Update your information and
                                learning preferences.
                            </p>
                        </div>

                    </div>


                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="success-message">
                            ✓ {message}
                        </div>
                    )}


                    {profile && (
                        <form onSubmit={handleUpdate}>

                            {/* PERSONAL INFORMATION */}

                            <div className="form-section">

                                <div className="form-section-heading">
                                    <h3>
                                        Personal Information
                                    </h3>

                                    <p>
                                        Your basic account details
                                    </p>
                                </div>


                                <div className="profile-grid">

                                    <div className="form-group">
                                        <label>Name</label>

                                        <input
                                            type="text"
                                            value={profile.name || ""}
                                            disabled
                                        />
                                    </div>


                                    <div className="form-group">
                                        <label>Email Address</label>

                                        <input
                                            type="email"
                                            value={profile.email || ""}
                                            disabled
                                        />
                                    </div>

                                </div>

                            </div>


                            {/* LEARNING PREFERENCES */}

                            <div className="form-section">

                                <div className="form-section-heading">
                                    <h3>
                                        Learning Preferences
                                    </h3>

                                    <p>
                                        Customize your learning
                                        experience.
                                    </p>
                                </div>


                                <div className="profile-grid">

                                    <div className="form-group">
                                        <label>Career Goal</label>

                                        <input
                                            type="text"
                                            name="careerGoal"
                                            value={
                                                profile.careerGoal || ""
                                            }
                                            onChange={handleChange}
                                            placeholder="e.g. Software Engineer"
                                        />
                                    </div>


                                    <div className="form-group">
                                        <label>
                                            Preferred Language
                                        </label>

                                        <input
                                            type="text"
                                            name="preferredLanguage"
                                            value={
                                                profile.preferredLanguage || ""
                                            }
                                            onChange={handleChange}
                                            placeholder="e.g. Java"
                                        />
                                    </div>


                                    <div className="form-group">
                                        <label>
                                            Preferred Platform
                                        </label>

                                        <input
                                            type="text"
                                            name="preferredPlatform"
                                            value={
                                                profile.preferredPlatform || ""
                                            }
                                            onChange={handleChange}
                                            placeholder="e.g. LeetCode"
                                        />
                                    </div>


                                    <div className="form-group">
                                        <label>
                                            Course Type
                                        </label>

                                        <input
                                            type="text"
                                            name="courseType"
                                            value={
                                                profile.courseType || ""
                                            }
                                            onChange={handleChange}
                                            placeholder="e.g. Full Stack Development"
                                        />
                                    </div>


                                    <div className="form-group">
                                        <label>
                                            Experience Level
                                        </label>

                                        <select
                                            name="experienceLevel"
                                            value={
                                                profile.experienceLevel || ""
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select level
                                            </option>

                                            <option value="Beginner">
                                                Beginner
                                            </option>

                                            <option value="Intermediate">
                                                Intermediate
                                            </option>

                                            <option value="Advanced">
                                                Advanced
                                            </option>
                                        </select>
                                    </div>


                                    <div className="form-group">
                                        <label>
                                            Study Hours / Day
                                        </label>

                                        <input
                                            type="number"
                                            name="studyHours"
                                            value={
                                                profile.studyHours || 0
                                            }
                                            onChange={handleChange}
                                            min="0"
                                            max="24"
                                        />
                                    </div>

                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div className="profile-actions">

                                <div className="action-text">
                                    <strong>
                                        Keep your profile updated
                                    </strong>

                                    <span>
                                        Your preferences help SkillPath
                                        personalize your experience.
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="primary-button profile-save-button"
                                >
                                    Save Changes
                                </button>

                            </div>

                        </form>
                    )}

                </section>

            </main>

        </div>
    );
};

export default Profile;
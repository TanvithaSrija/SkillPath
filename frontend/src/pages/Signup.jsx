import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const Signup = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        careerGoal: "",
        preferredLanguage: "",
        preferredPlatform: "",
        courseType: "",
        experienceLevel: "",
        studyHours: 2
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: name === "studyHours"
                ? Number(value)
                : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await register(formData);

            navigate("/profile");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="auth-page">
        <div className="auth-container">

            <div className="auth-brand">
                <h1>SkillPath</h1>
                <p>Start building your personalized learning path.</p>
            </div>

            <div className="auth-card">
                <h2>Create your account</h2>

                <p className="auth-subtitle">
                    Tell us about your learning goals.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            minLength="6"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Career Goal</label>
                        <input
                            type="text"
                            name="careerGoal"
                            value={formData.careerGoal}
                            onChange={handleChange}
                            placeholder="e.g. Software Engineer"
                        />
                    </div>

                    <div className="form-group">
                        <label>Preferred Programming Language</label>
                        <input
                            type="text"
                            name="preferredLanguage"
                            value={formData.preferredLanguage}
                            onChange={handleChange}
                            placeholder="e.g. Java"
                        />
                    </div>

                    <div className="form-group">
                        <label>Preferred Platform</label>
                        <input
                            type="text"
                            name="preferredPlatform"
                            value={formData.preferredPlatform}
                            onChange={handleChange}
                            placeholder="e.g. LeetCode"
                        />
                    </div>

                    <div className="form-group">
                        <label>Course Type</label>
                        <input
                            type="text"
                            name="courseType"
                            value={formData.courseType}
                            onChange={handleChange}
                            placeholder="e.g. Full Stack Development"
                        />
                    </div>

                    <div className="form-group">
                        <label>Experience Level</label>
                        <select
                            name="experienceLevel"
                            value={formData.experienceLevel}
                            onChange={handleChange}
                        >
                            <option value="">Select experience level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">
                                Intermediate
                            </option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Study Hours Per Day</label>
                        <input
                            type="number"
                            name="studyHours"
                            value={formData.studyHours}
                            onChange={handleChange}
                            min="1"
                            max="24"
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button
                        className="primary-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Sign in</Link>
                </div>
            </div>

        </div>
    </div>
);
};

export default Signup;
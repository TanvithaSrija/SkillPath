import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import skillProgressService from "../services/skillProgressService";

import "../styles/Progress.css";

function Progress() {
    const { token } = useAuth();

    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProgress = async () => {
        try {
            setLoading(true);

            const data =
                await skillProgressService.getMySkillProgress(
                    token
                );

            setProgress(data.progress || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load progress"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            loadProgress();
        }
    }, [token]);

    const overallProgress = useMemo(() => {
        if (!progress.length) return 0;

        const total = progress.reduce(
            (sum, item) =>
                sum +
                Number(item.completionPercentage || 0),
            0
        );

        return Math.round(total / progress.length);
    }, [progress]);

    const completedCount = progress.filter(
        (item) =>
            item.completionPercentage >= 100
    ).length;

    const verifiedCount = progress.filter(
        (item) => item.verified
    ).length;

    if (loading) {
        return (
            <div className="progress-page">
                <p>Loading progress...</p>
            </div>
        );
    }

    return (
        <div className="progress-page">

            <div className="progress-header">

                <div>
                    <Link
                        to="/dashboard"
                        className="progress-back"
                    >
                        ← Dashboard
                    </Link>

                    <h1>Learning Progress</h1>

                    <p>
                        Track your skill completion and
                        verification status.
                    </p>
                </div>

            </div>

            {error && (
                <div className="progress-error">
                    {error}
                </div>
            )}

            <div className="progress-summary">

                <div className="summary-card">
                    <span>Overall Progress</span>
                    <strong>
                        {overallProgress}%
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Skills Completed</span>
                    <strong>
                        {completedCount}
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Skills Verified</span>
                    <strong>
                        {verifiedCount}
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Total Skills Tracked</span>
                    <strong>
                        {progress.length}
                    </strong>
                </div>

            </div>

            <div className="overall-progress-card">

                <div className="overall-progress-header">
                    <div>
                        <h2>Overall Learning Progress</h2>
                        <p>
                            Keep learning and complete quizzes
                            to verify your skills.
                        </p>
                    </div>

                    <strong>
                        {overallProgress}%
                    </strong>
                </div>

                <div className="large-progress-track">
                    <div
                        className="large-progress-fill"
                        style={{
                            width:
                                `${overallProgress}%`,
                        }}
                    />
                </div>

            </div>

            <div className="skills-progress-section">

                <h2>Skill Progress</h2>

                {progress.length === 0 ? (
                    <div className="empty-progress">
                        <h3>No skill progress yet</h3>
                        <p>
                            Start learning a skill to see
                            your progress here.
                        </p>
                    </div>
                ) : (
                    <div className="skill-progress-grid">

                        {progress.map((item) => (
                            <div
                                className="skill-progress-card"
                                key={item._id}
                            >

                                <div className="skill-card-top">

                                    <div>
                                        <h3>
                                            {item.skillId}
                                        </h3>

                                        <span
                                            className={`progress-status ${
                                                item.verified
                                                    ? "verified"
                                                    : item.status
                                                          .toLowerCase()
                                                          .replace(
                                                              /\s+/g,
                                                              "-"
                                                          )
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>

                                    {item.verified && (
                                        <div className="verified-icon">
                                            ✓
                                        </div>
                                    )}

                                </div>

                                <div className="skill-progress-values">
                                    <span>
                                        Completion
                                    </span>

                                    <strong>
                                        {
                                            item.completionPercentage
                                        }%
                                    </strong>
                                </div>

                                <div className="progress-track">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width:
                                                `${
                                                    item.completionPercentage
                                                }%`,
                                        }}
                                    />
                                </div>

                                {item.quizScore > 0 && (
                                    <div className="quiz-score">
                                        Quiz Score:
                                        <strong>
                                            {" "}
                                            {item.quizScore}
                                        </strong>
                                    </div>
                                )}

                                <div className="skill-card-actions">

                                    <Link
                                        to={`/notes/${item.skillId}`}
                                    >
                                        Notes
                                    </Link>

                                    {!item.verified && (
                                        <Link
                                            to={`/quiz/${item.skillId}`}
                                        >
                                            Take Quiz
                                        </Link>
                                    )}

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Progress;
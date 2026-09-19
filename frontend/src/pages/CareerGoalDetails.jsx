import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCareerGoalById } from "../services/careerService";

function CareerGoalDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [career, setCareer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCareerGoal = async () => {
            try {
                const data = await getCareerGoalById(id);
                setCareer(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCareerGoal();
    }, [id]);

    if (loading) {
        return (
            <div className="career-details-page">
                <p>Loading career goal...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="career-details-page">
                <p>Error: {error}</p>

                <Link to="/career-goals">
                    ← Back to Career Goals
                </Link>
            </div>
        );
    }

    if (!career) {
        return (
            <div className="career-details-page">
                <p>Career goal not found.</p>

                <Link to="/career-goals">
                    ← Back to Career Goals
                </Link>
            </div>
        );
    }

    return (
        <div className="career-details-page">

            <Link
                className="career-details-back"
                to="/career-goals"
            >
                ← Back to Career Goals
            </Link>

            <div className="career-details-card">

                <div className="career-details-icon">
                    {career.icon}
                </div>

                <h1>{career.title}</h1>

                <p className="career-details-description">
                    {career.description}
                </p>

                <div className="career-details-info">

                    <div>
                        <span>Difficulty</span>
                        <strong>{career.difficulty}</strong>
                    </div>

                    <div>
                        <span>Estimated Duration</span>
                        <strong>{career.estimatedDuration}</strong>
                    </div>

                </div>

                <button
                    className="career-details-button"
                    onClick={() =>
                        navigate(`/roadmap/${career._id}`)
                    }
                >
                    View Skill Roadmap →
                </button>

            </div>

        </div>
    );
}

export default CareerGoalDetails;
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSkillById } from "../services/skillService";
import SkillCard from "../components/SkillCard";

function SkillDetails() {
    const { skillId } = useParams();

    const [skill, setSkill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSkill = async () => {
            try {
                const data = await getSkillById(skillId);
                setSkill(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSkill();
    }, [skillId]);

    if (loading) {
        return (
            <div className="skill-details-page">
                <p>Loading skill details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="skill-details-page">
                <p>Error: {error}</p>

                <Link to="/career-goals">
                    ← Back to Career Goals
                </Link>
            </div>
        );
    }

    if (!skill) {
        return (
            <div className="skill-details-page">
                <p>Skill not found.</p>

                <Link to="/career-goals">
                    ← Back to Career Goals
                </Link>
            </div>
        );
    }

    return (
        <div className="skill-details-page">

            <Link
                className="skill-back"
                to={`/roadmap/${skill.careerGoalId._id}`}
            >
                ← Back to Roadmap
            </Link>

            <div className="skill-details-card">

                <div className="skill-icon">
                    📚
                </div>

                <h1>{skill.title}</h1>

                <p className="skill-description">
                    {skill.description}
                </p>

                <div className="skill-info">

                    <div className="skill-info-box">
                        <span className="info-label">
                            Difficulty
                        </span>

                        <span className="info-value">
                            {skill.difficulty}
                        </span>
                    </div>

                    <div className="skill-info-box">
                        <span className="info-label">
                            Estimated Time
                        </span>

                        <span className="info-value">
                            {skill.estimatedHours} hours
                        </span>
                    </div>

                    <div className="skill-info-box">
                        <span className="info-label">
                            Order
                        </span>

                        <span className="info-value">
                            Skill {skill.order}
                        </span>
                    </div>

                </div>

                {skill.prerequisiteSkill && (
                    <div className="related-skill-section">

                        <h2>Prerequisite Skill</h2>

                        <p className="related-skill-description">
                            Complete this skill before learning{" "}
                            <strong>{skill.title}</strong>.
                        </p>

                        <SkillCard
                            skill={skill.prerequisiteSkill}
                        />

                    </div>
                )}

                <div className="career-goal-box">

                    <h3>Career Goal</h3>

                    <p>
                        This skill is part of the{" "}
                        <strong>
                            {skill.careerGoalId.title}
                        </strong>{" "}
                        career roadmap.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default SkillDetails;
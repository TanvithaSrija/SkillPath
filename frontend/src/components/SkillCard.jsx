import { Link } from "react-router-dom";

function SkillCard({ skill }) {
    return (
        <div className="skill-card">

            <div className="skill-card-header">
                <h3>{skill.title}</h3>

                <span className="skill-order">
                    Skill {skill.order}
                </span>
            </div>

            <p className="skill-card-description">
                {skill.description}
            </p>

            <div className="skill-card-info">

                <span>
                    {skill.difficulty}
                </span>

                <span>
                    {skill.estimatedHours} hours
                </span>

            </div>

            {skill.prerequisiteSkill && (
                <p className="skill-prerequisite">
                    <strong>Prerequisite:</strong>{" "}
                    {skill.prerequisiteSkill.title}
                </p>
            )}

            <Link
                className="skill-card-link"
                to={`/skills/${skill._id}`}
            >
                View Skill Details →
            </Link>

        </div>
    );
}

export default SkillCard;
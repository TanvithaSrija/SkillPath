import { Link } from "react-router-dom";

function RoadmapCard({ skill, index }) {
    return (
        <div className="roadmap-item">

            <div className="roadmap-number">
                {index + 1}
            </div>

            <div className="roadmap-content">

                <h3>{skill.title}</h3>

                <p>
                    {skill.description}
                </p>

                <div className="career-info">

                    <span>
                        {skill.difficulty}
                    </span>

                    <span>
                        {skill.estimatedHours} hours
                    </span>

                </div>

                {skill.prerequisiteSkill && (
                    <p>
                        <strong>
                            Prerequisite:
                        </strong>{" "}
                        {skill.prerequisiteSkill.title}
                    </p>
                )}

                <Link to={`/skills/${skill._id}`}>
                    View Skill Details →
                </Link>

            </div>

        </div>
    );
}

export default RoadmapCard;
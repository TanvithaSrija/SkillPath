import { Link } from "react-router-dom";

function RoadmapCard({
    skill,
    index,
    skillProgress = [],
}) {

    const currentProgress = skillProgress.find(
        (item) =>
            item.skillId === skill._id ||
            item.skillId === skill.title
    );

    const prerequisiteProgress =
        skill.prerequisiteSkill
            ? skillProgress.find(
                (item) =>
                    item.skillId ===
                        skill.prerequisiteSkill._id ||
                    item.skillId ===
                        skill.prerequisiteSkill.title
            )
            : null;

    /*
     * Legacy Java quiz compatibility.
     *
     * Existing progress uses:
     * skillId = "Java"
     *
     * Java Programming Fundamentals is the
     * corresponding first Java roadmap skill.
     */
    const isLegacyJavaVerified =
        skill.title === "Java Programming Fundamentals" &&
        skillProgress.some(
            (item) =>
                item.skillId === "Java" &&
                item.verified === true
        );

    const isVerified =
        currentProgress?.verified === true ||
        isLegacyJavaVerified;

    const isUnlocked =
        !skill.prerequisiteSkill ||
        prerequisiteProgress?.verified === true ||
        (
            skill.prerequisiteSkill.title ===
                "Java Programming Fundamentals" &&
            skillProgress.some(
                (item) =>
                    item.skillId === "Java" &&
                    item.verified === true
            )
        );

    const progressPercentage =
        isVerified
            ? 100
            : currentProgress?.completionPercentage || 0;

    return (
        <div
            className={`roadmap-item ${
                !isUnlocked ? "roadmap-item-locked" : ""
            } ${
                isVerified ? "roadmap-item-verified" : ""
            }`}
        >

            <div className="roadmap-number">
                {isVerified ? "✓" : index + 1}
            </div>

            <div className="roadmap-content">

                <div className="roadmap-card-header">

                    <div>
                        <h3>{skill.title}</h3>

                        <p>
                            {skill.description}
                        </p>
                    </div>

                    <div className="roadmap-status">

                        {isVerified ? (
                            <span className="status-verified">
                                ✓ Verified
                            </span>
                        ) : isUnlocked ? (
                            <span className="status-unlocked">
                                Unlocked
                            </span>
                        ) : (
                            <span className="status-locked">
                                🔒 Locked
                            </span>
                        )}

                    </div>

                </div>

                <div className="career-info">

                    <span>
                        {skill.difficulty}
                    </span>

                    <span>
                        {skill.estimatedHours} hours
                    </span>

                </div>

                {skill.prerequisiteSkill && (
                    <p className="roadmap-prerequisite">
                        <strong>
                            Prerequisite:
                        </strong>{" "}
                        {skill.prerequisiteSkill.title}
                    </p>
                )}

                {isUnlocked && (
                    <div className="roadmap-progress">

                        <div className="progress-header">
                            <span>Progress</span>
                            <span>
                                {progressPercentage}%
                            </span>
                        </div>

                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${progressPercentage}%`,
                                }}
                            />
                        </div>

                    </div>
                )}

                {!isUnlocked && (
                    <div className="locked-message">
                        🔒 Complete and verify the prerequisite
                        skill to unlock this skill.
                    </div>
                )}

                {isUnlocked && (
                    <div className="roadmap-actions">

                        <Link
                            to={`/skills/${skill._id}`}
                            className="roadmap-view-button"
                        >
                            View Skill Details →
                        </Link>

                        {!isVerified && (
                            <Link
                                to={`/quiz/${
                                    skill.title === "Java Programming Fundamentals"
                                        ? "Java"
                                        : skill._id
                                }`}
                                className="roadmap-quiz-button"
                            >
                                Take Quiz
                            </Link>
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}

export default RoadmapCard;
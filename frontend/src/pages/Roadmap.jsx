import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCareerGoalById } from "../services/careerService";
import { getSkillsByCareerGoal } from "../services/skillService";
import RoadmapCard from "../components/RoadmapCard";

function Roadmap() {
    const { careerGoalId } = useParams();

    const [career, setCareer] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const [careerData, skillsData] = await Promise.all([
                    getCareerGoalById(careerGoalId),
                    getSkillsByCareerGoal(careerGoalId)
                ]);

                setCareer(careerData);
                setSkills(skillsData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmap();
    }, [careerGoalId]);

    if (loading) {
        return (
            <div className="roadmap-page">
                <p>Loading roadmap...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="roadmap-page">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="roadmap-page">

            <Link
                className="roadmap-back"
                to="/career-goals"
            >
                ← Back to Career Goals
            </Link>

            {career && (
                <div className="roadmap-header">

                    <div className="career-icon">
                        {career.icon}
                    </div>

                    <h1>{career.title}</h1>

                    <p>{career.description}</p>

                    <div className="career-info">
                        <span>{career.difficulty}</span>
                        <span>{career.estimatedDuration}</span>
                    </div>

                </div>
            )}

            <h2>Skill Roadmap</h2>

            <div className="roadmap-list">

                {skills.length === 0 ? (
                    <p>No skills found for this career goal.</p>
                ) : (
                    skills.map((skill, index) => (
                        <RoadmapCard
                            key={skill._id}
                            skill={skill}
                            index={index}
                        />
                    ))
                )}

            </div>

        </div>
    );
}

export default Roadmap;
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getCareerGoalById } from "../services/careerService";
import { getSkillsByCareerGoal } from "../services/skillService";
import skillProgressService from "../services/skillProgressService";

import { useAuth } from "../context/AuthContext";
import RoadmapCard from "../components/RoadmapCard";

function Roadmap() {
    const { careerGoalId } = useParams();
    const { token } = useAuth();

    const [career, setCareer] = useState(null);
    const [skills, setSkills] = useState([]);
    const [skillProgress, setSkillProgress] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const [careerData, skillsData, progressData] =
                    await Promise.all([
                        getCareerGoalById(careerGoalId),
                        getSkillsByCareerGoal(careerGoalId),
                        skillProgressService.getMySkillProgress(token),
                    ]);

                setCareer(careerData);
                setSkills(skillsData);
                setSkillProgress(
                    progressData.progress || []
                );
            } catch (error) {
                console.error(error);
                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load roadmap"
                );
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchRoadmap();
        }
    }, [careerGoalId, token]);

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

            <div className="roadmap-title-row">
                <div>
                    <h2>Skill Roadmap</h2>
                    <p>
                        Complete each skill and verify it through
                        the quiz to unlock the next skill.
                    </p>
                </div>
            </div>

            <div className="roadmap-list">

                {skills.length === 0 ? (
                    <p>
                        No skills found for this career goal.
                    </p>
                ) : (
                    skills.map((skill, index) => (
                        <RoadmapCard
                            key={skill._id}
                            skill={skill}
                            index={index}
                            skillProgress={skillProgress}
                        />
                    ))
                )}

            </div>

        </div>
    );
}

export default Roadmap;
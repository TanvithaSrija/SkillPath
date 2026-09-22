import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CareerList from "../components/CareerList";
import { getCareerGoals } from "../services/careerService";

function CareerGoals() {
    const navigate = useNavigate();

    const [careers, setCareers] = useState([]);
    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCareers = async () => {
            try {
                const data = await getCareerGoals();
                setCareers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCareers();
    }, []);

    const filteredCareers = careers.filter((career) => {
        const matchesSearch = career.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesDifficulty =
            difficulty === "All" ||
            career.difficulty === difficulty;

        return matchesSearch && matchesDifficulty;
    });

    if (loading) {
        return (
            <div className="career-page">
                <p>Loading career goals...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="career-page">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="career-page">
            <h1>Choose Your Career Goal</h1>

            <p>
                Select a career path and follow a personalized skill roadmap.
            </p>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search career goals..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="All">All Difficulties</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>

            <CareerList
                careers={filteredCareers}
                onSelect={(career) =>
                    navigate(`/roadmap/${career._id}`)
                }
            />
        </div>
    );
}

export default CareerGoals;
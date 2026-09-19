const API_URL = "http://localhost:5000/api/skills";

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Request failed");
    }

    return response.json();
};

// Get all skills
export const getSkills = async () => {
    const response = await fetch(API_URL);
    return handleResponse(response);
};

// Get a single skill
export const getSkillById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return handleResponse(response);
};

// Get skills for a particular career goal
export const getSkillsByCareerGoal = async (careerGoalId) => {
    const response = await fetch(
        `${API_URL}/career/${careerGoalId}`
    );

    return handleResponse(response);
};
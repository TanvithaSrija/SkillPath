const API_URL = "http://localhost:5000/api/career-goals";

export const getCareerGoals = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch career goals");
    }

    return await response.json();
};

export const getCareerGoalById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch career goal");
    }

    return await response.json();
};
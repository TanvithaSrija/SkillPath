const DashboardStats = ({ stats }) => {
    const cards = [
        {
            title: "Total Users",
            value: stats?.totalUsers || 0
        },
        {
            title: "Career Goals",
            value: stats?.totalCareerGoals || 0
        },
        {
            title: "Skills",
            value: stats?.totalSkills || 0
        },
        {
            title: "Resources",
            value: stats?.totalResources || 0
        },
        {
            title: "Quizzes",
            value: stats?.totalQuizzes || 0
        }
    ];

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "20px",
                marginTop: "25px"
            }}
        >
            {cards.map((card) => (
                <div
                    key={card.title}
                    style={{
                        padding: "25px",
                        border: "1px solid #ddd",
                        borderRadius: "10px"
                    }}
                >
                    <h3>{card.title}</h3>

                    <h1>{card.value}</h1>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
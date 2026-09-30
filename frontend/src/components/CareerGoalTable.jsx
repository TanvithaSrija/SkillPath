const CareerGoalTable = ({
    careerGoals,
    onEdit,
    onDelete
}) => {
    return (
        <div style={{ overflowX: "auto" }}>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px"
                }}
            >

                <thead>
                    <tr>
                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Title
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Description
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Duration
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Difficulty
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {careerGoals && careerGoals.length > 0 ? (

                        careerGoals.map((goal) => (

                            <tr key={goal._id}>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {goal.title}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {goal.description}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {goal.estimatedDuration}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {goal.difficulty}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>

                                    <button
                                        onClick={() => onEdit(goal)}
                                        style={{ marginRight: "8px" }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => onDelete(goal._id)}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan="5"
                                style={{
                                    padding: "20px",
                                    textAlign: "center"
                                }}
                            >
                                No career goals found
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>
    );
};

export default CareerGoalTable;
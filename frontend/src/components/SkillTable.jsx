const SkillTable = ({
    skills,
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
                            Career Goal
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Order
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Hours
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
                    {skills && skills.length > 0 ? (
                        skills.map((skill) => (
                            <tr key={skill._id}>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {skill.title}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {skill.careerGoalId}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {skill.order}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {skill.estimatedHours}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {skill.difficulty}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    <button
                                        onClick={() => onEdit(skill)}
                                        style={{ marginRight: "8px" }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => onDelete(skill._id)}
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="6"
                                style={{
                                    padding: "20px",
                                    textAlign: "center"
                                }}
                            >
                                No skills found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SkillTable;
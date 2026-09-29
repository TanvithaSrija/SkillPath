const QuizTable = ({
    quizzes,
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
                            Skill
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Questions
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Passing Marks
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Time Limit
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Actions
                        </th>

                    </tr>
                </thead>

                <tbody>

                    {quizzes && quizzes.length > 0 ? (

                        quizzes.map((quiz) => (

                            <tr key={quiz._id}>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {quiz.skillId}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {quiz.questions?.length || 0}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {quiz.passingMarks}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {quiz.timeLimit} min
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>

                                    <button
                                        onClick={() => onEdit(quiz)}
                                        style={{ marginRight: "8px" }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => onDelete(quiz._id)}
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
                                No quizzes found
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>
    );
};

export default QuizTable;
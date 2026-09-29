const ResourceTable = ({
    resources,
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
                            Platform
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Type
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Skill
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Difficulty
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Free
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {resources && resources.length > 0 ? (
                        resources.map((resource) => (
                            <tr key={resource._id}>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {resource.title}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {resource.platform}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {resource.type}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {resource.skill}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {resource.difficulty}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {resource.isFree ? "Yes" : "No"}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    <button
                                        onClick={() => onEdit(resource)}
                                        style={{ marginRight: "8px" }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => onDelete(resource._id)}
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="7"
                                style={{
                                    padding: "20px",
                                    textAlign: "center"
                                }}
                            >
                                No resources found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ResourceTable;
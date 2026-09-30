const UserTable = ({ users, onDelete }) => {
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
                            Name
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Email
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Role
                        </th>

                        <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {users && users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user._id}>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {user.name}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {user.email}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                    {user.role}
                                </td>

                                <td style={{ padding: "12px", border: "1px solid #ddd" }}>

                                    <button
                                        onClick={() => onDelete(user._id)}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="4"
                                style={{
                                    padding: "20px",
                                    textAlign: "center"
                                }}
                            >
                                No users found
                            </td>
                        </tr>
                    )}

                </tbody>

            </table>

        </div>
    );
};

export default UserTable;
import { useAuth } from "../context/AuthContext";

const AdminNavbar = () => {
    const { user, logout } = useAuth();

    return (
        <div
            style={{
                height: "70px",
                padding: "0 25px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxSizing: "border-box"
            }}
        >

            <h2>Administration Panel</h2>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px"
                }}
            >

                <span>
                    {user?.name || "Admin"}
                </span>

                <button onClick={logout}>
                    Logout
                </button>

            </div>

        </div>
    );
};

export default AdminNavbar;
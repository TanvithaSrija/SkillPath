import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}
                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
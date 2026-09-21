import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import ResourceDetails from "./pages/ResourceDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

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
                     <Route
                        path="/resources"
                        element={<Resources />}
                    />
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />
                    <Route
                        path="/resources/:id"
                        element={<ResourceDetails />}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
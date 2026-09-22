import "./App.css";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// Member 1 - Authentication
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import ResourceDetails from "./pages/ResourceDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import LearningPlayer from "./pages/LearningPlayer";

// Member 2 - Career Goals & Roadmap
import CareerGoals from "./pages/CareerGoals";
import CareerGoalDetails from "./pages/CareerGoalDetails";
import Roadmap from "./pages/Roadmap";
import SkillDetails from "./pages/SkillDetails";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}

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
                    <Route
                        path="/learn/:id"
                        element={<LearningPlayer />}
                    />

                    {/* Member 2 - Career Goals */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/career-goals"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/career-goals"
                        element={<CareerGoals />}
                    />

                    <Route
                        path="/career-goals/:id"
                        element={<CareerGoalDetails />}
                    />

                    <Route
                        path="/roadmap/:careerGoalId"
                        element={<Roadmap />}
                    />

                    <Route
                        path="/skills/:skillId"
                        element={<SkillDetails />}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
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
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import LessonPlayer from "./pages/LessonPlayer";

// Member 2 - Career Goals & Roadmap
import CareerGoals from "./pages/CareerGoals";
import CareerGoalDetails from "./pages/CareerGoalDetails";
import Roadmap from "./pages/Roadmap";
import SkillDetails from "./pages/SkillDetails";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz";
import Progress from "./pages/Progress";

// Member 5 - Administration
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminCareerGoals from "./pages/AdminCareerGoals";
import AdminSkills from "./pages/AdminSkills";
import AdminResources from "./pages/AdminResources";
import AdminQuizzes from "./pages/AdminQuizzes";


function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* ==================== PUBLIC ROUTES ==================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/courses"
                    element={<Courses />}
                />

                <Route
                    path="/courses/:id"
                    element={<CourseDetails />}
                />

                <Route
                    path="/lessons/:id"
                    element={<LessonPlayer />}
                />


                {/* ==================== PROTECTED USER ROUTES ==================== */}

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

                    <Route
                        path="/notes"
                        element={<Notes />}
                    />

                    <Route
                        path="/notes/:skillId"
                        element={<Notes />}
                    />

                    <Route
                        path="/quiz/:skillId"
                        element={<Quiz />}
                    />

                    <Route
                        path="/progress"
                        element={<Progress />}
                    />

                </Route>


                {/* ==================== MEMBER 5 - ADMIN ROUTES ==================== */}

                <Route element={<AdminProtectedRoute />}>

                    <Route
                        path="/admin"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin/users"
                        element={<AdminUsers />}
                    />

                    <Route
                        path="/admin/career-goals"
                        element={<AdminCareerGoals />}
                    />

                    <Route
                        path="/admin/skills"
                        element={<AdminSkills />}
                    />

                    <Route
                        path="/admin/resources"
                        element={<AdminResources />}
                    />

                    <Route
                        path="/admin/quizzes"
                        element={<AdminQuizzes />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;
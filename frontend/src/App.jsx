import "./App.css";

import Layout from "./components/Layout";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// ==================== MEMBER 1 - AUTHENTICATION ====================
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

// ==================== MEMBER 3 - RESOURCES & COURSES ====================
import Resources from "./pages/Resources";
import ResourceDetails from "./pages/ResourceDetails";

import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";

import LearningPlayer from "./pages/LearningPlayer";
import LessonPlayer from "./pages/LessonPlayer";

// ==================== MEMBER 4 - DASHBOARD & PROGRESS ====================
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz";
import Progress from "./pages/Progress";

// ==================== MEMBER 2 - CAREER GOALS & ROADMAP ====================
import CareerGoals from "./pages/CareerGoals";
import CareerGoalDetails from "./pages/CareerGoalDetails";
import Roadmap from "./pages/Roadmap";
import SkillDetails from "./pages/SkillDetails";

// ==================== MEMBER 5 - ADMINISTRATION ====================
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
                    <Route element={<Layout />}>

                        {/* Dashboard */}
                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        {/* Profile */}
                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                        {/* Resources */}
                        <Route
                            path="/resources"
                            element={<Resources />}
                        />

                        <Route
                            path="/resources/:id"
                            element={<ResourceDetails />}
                        />

                        {/* Learning */}
                        <Route
                            path="/learn/:id"
                            element={<LearningPlayer />}
                        />

                        {/* ==================== MEMBER 2 - CAREER GOALS ==================== */}

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

                        {/* ==================== MEMBER 4 - NOTES & QUIZ ==================== */}

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

                        {/* Progress */}
                        <Route
                            path="/progress"
                            element={<Progress />}
                        />

                        {/* Default authenticated page */}
                        <Route
                            path="/"
                            element={
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            }
                        />

                    </Route>
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
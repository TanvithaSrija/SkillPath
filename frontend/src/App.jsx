import "./App.css";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import CareerGoals from "./pages/CareerGoals";
import CareerGoalDetails from "./pages/CareerGoalDetails";
import Roadmap from "./pages/Roadmap";
import SkillDetails from "./pages/SkillDetails";

function App() {
    return (
        <BrowserRouter>

            <Routes>

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

            </Routes>

        </BrowserRouter>
    );
}

export default App;
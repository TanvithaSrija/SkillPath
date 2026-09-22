import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import progressService from "../services/progressService";
import "../styles/Dashboard.css";

function Dashboard() {
  const { user, token } = useAuth();

  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // FETCH USER PROGRESS
  // ============================================

  const fetchProgress = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await progressService.getMyProgress(token);

      setProgress(data.progress || []);
    } catch (error) {
      console.error(
        "Failed to fetch dashboard progress:",
        error
      );

      setError("Unable to load your learning data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [token]);

  // ============================================
  // CALCULATE STATISTICS
  // ============================================

  const totalStarted = progress.length;

  const completedCount = progress.filter(
    (item) => item.status === "Completed"
  ).length;

  const inProgressCount = progress.filter(
    (item) => item.status === "In Progress"
  ).length;

  const overallProgress =
    totalStarted === 0
      ? 0
      : Math.round(
          progress.reduce(
            (sum, item) => sum + (item.progress || 0),
            0
          ) / totalStarted
        );

  // ============================================
  // CONTINUE LEARNING
  // ============================================

  const continueLearning = progress
    .filter(
      (item) => item.status === "In Progress"
    )
    .slice(0, 4);

  // ============================================
  // RECENTLY COMPLETED
  // ============================================

  const recentlyCompleted = progress
    .filter(
      (item) => item.status === "Completed"
    )
    .slice(0, 4);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="dashboard-page">

      {/* ======================================
          HERO
      ====================================== */}

      <section className="dashboard-hero">

        <div className="dashboard-hero-content">

          <span className="dashboard-badge">
            YOUR LEARNING DASHBOARD
          </span>

          <h1>
            Welcome back,
            <span>
              {" "}
              {user?.name || "Learner"} 👋
            </span>
          </h1>

          <p>
            Keep building your skills and make
            consistent progress toward your career
            goals.
          </p>

        </div>

      </section>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="dashboard-container">

        {loading ? (
          <div className="dashboard-message">
            <div className="dashboard-loader"></div>
            <p>
              Loading your learning dashboard...
            </p>
          </div>
        ) : error ? (
          <div className="dashboard-message dashboard-error">
            <h3>
              Something went wrong
            </h3>

            <p>{error}</p>

            <button onClick={fetchProgress}>
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* ==================================
                STATISTICS
            ================================== */}

            <section className="dashboard-stats">

              <div className="stat-card">
                <div className="stat-icon">
                  📚
                </div>

                <div>
                  <span>
                    Resources Started
                  </span>

                  <strong>
                    {totalStarted}
                  </strong>
                </div>
              </div>


              <div className="stat-card">
                <div className="stat-icon">
                  🔄
                </div>

                <div>
                  <span>
                    In Progress
                  </span>

                  <strong>
                    {inProgressCount}
                  </strong>
                </div>
              </div>


              <div className="stat-card">
                <div className="stat-icon">
                  ✓
                </div>

                <div>
                  <span>
                    Completed
                  </span>

                  <strong>
                    {completedCount}
                  </strong>
                </div>
              </div>


              <div className="stat-card">
                <div className="stat-icon">
                  📈
                </div>

                <div>
                  <span>
                    Overall Progress
                  </span>

                  <strong>
                    {overallProgress}%
                  </strong>
                </div>
              </div>

            </section>


            {/* ==================================
                OVERALL PROGRESS
            ================================== */}

            <section className="dashboard-panel">

              <div className="panel-header">

                <div>
                  <span className="panel-label">
                    YOUR JOURNEY
                  </span>

                  <h2>
                    Overall Learning Progress
                  </h2>

                  <p>
                    Track how far you've progressed
                    across your learning resources.
                  </p>
                </div>

                <div className="overall-circle">
                  <strong>
                    {overallProgress}%
                  </strong>

                  <span>
                    Complete
                  </span>
                </div>

              </div>


              <div className="large-progress">

                <div
                  className="large-progress-fill"
                  style={{
                    width: `${overallProgress}%`,
                  }}
                ></div>

              </div>

            </section>


            {/* ==================================
                CONTINUE LEARNING
            ================================== */}

            <section className="dashboard-section">

              <div className="section-heading">

                <div>
                  <span className="section-label">
                    KEEP GOING
                  </span>

                  <h2>
                    Continue Learning
                  </h2>

                  <p>
                    Pick up where you left off.
                  </p>
                </div>

                <Link
                  to="/resources"
                  className="view-all-link"
                >
                  Explore Resources →
                </Link>

              </div>


              {continueLearning.length === 0 ? (

                <div className="empty-dashboard">

                  <div className="empty-dashboard-icon">
                    🚀
                  </div>

                  <h3>
                    Start your learning journey
                  </h3>

                  <p>
                    Explore resources and start
                    learning to see your progress
                    here.
                  </p>

                  <Link
                    to="/resources"
                    className="dashboard-primary-button"
                  >
                    Explore Resources
                  </Link>

                </div>

              ) : (

                <div className="continue-grid">

                  {continueLearning.map(
                    (item) => (
                      <article
                        className="continue-card"
                        key={item._id}
                      >

                        <div className="continue-card-top">

                          <div className="resource-icon">
                            📚
                          </div>

                          <span className="progress-percent">
                            {item.progress}%
                          </span>

                        </div>


                        <h3>
                          {item.resource?.title ||
                            "Learning Resource"}
                        </h3>


                        <div className="continue-meta">

                          <span>
                            {item.resource?.skill ||
                              "Skill"}
                          </span>

                          <span>
                            {item.resource?.difficulty ||
                              "Level"}
                          </span>

                        </div>


                        <div className="small-progress">

                          <div
                            className="small-progress-fill"
                            style={{
                              width: `${item.progress}%`,
                            }}
                          ></div>

                        </div>


                        <div className="continue-footer">

                          <span>
                            {item.progress}% completed
                          </span>

                          {item.resource?.url && (
                            <a
                              href={
                                item.resource.url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Continue →
                            </a>
                          )}

                        </div>

                      </article>
                    )
                  )}

                </div>

              )}

            </section>


            {/* ==================================
                COMPLETED
            ================================== */}

            {recentlyCompleted.length > 0 && (

              <section className="dashboard-section">

                <div className="section-heading">

                  <div>
                    <span className="section-label">
                      ACHIEVEMENTS
                    </span>

                    <h2>
                      Recently Completed
                    </h2>

                    <p>
                      Resources you've successfully
                      completed.
                    </p>
                  </div>

                </div>


                <div className="completed-list">

                  {recentlyCompleted.map(
                    (item) => (
                      <div
                        className="completed-card"
                        key={item._id}
                      >

                        <div className="completed-check">
                          ✓
                        </div>

                        <div className="completed-info">

                          <h3>
                            {item.resource?.title ||
                              "Learning Resource"}
                          </h3>

                          <p>
                            {item.resource?.platform ||
                              "Learning Platform"}
                          </p>

                        </div>

                        <span className="completed-badge">
                          Completed
                        </span>

                      </div>
                    )
                  )}

                </div>

              </section>

            )}


            {/* ==================================
                CAREER GOAL
            ================================== */}

            <section className="career-goal-card">

              <div className="career-goal-icon">
                🎯
              </div>

              <div className="career-goal-content">

                <span>
                  YOUR CAREER GOAL
                </span>

                <h2>
                  {user?.careerGoal ||
                    "Build your career skills"}
                </h2>

                <p>
                  Keep learning consistently and
                  turn your career goal into reality.
                </p>

              </div>

              <Link
                to="/profile"
                className="profile-button"
              >
                View Profile
              </Link>

            </section>

          </>
        )}

      </main>

    </div>
  );
}

export default Dashboard;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import progressService from "../services/progressService";
import courseService from "../services/courseService";
import lessonProgressService from "../services/lessonProgressService";

import "../styles/Dashboard.css";

function Dashboard() {
  const { user, token } = useAuth();

  /* ============================================
     RESOURCE PROGRESS
  ============================================ */

  const [progress, setProgress] = useState([]);

  /* ============================================
     COURSE PROGRESS
  ============================================ */

  const [courseProgress, setCourseProgress] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ============================================
     FETCH DASHBOARD DATA
  ============================================ */

  const fetchProgress = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      /* ==========================================
         1. FETCH RESOURCE PROGRESS
      ========================================== */

      const resourceData =
        await progressService.getMyProgress(token);

      setProgress(resourceData.progress || []);

      /* ==========================================
         2. FETCH ALL COURSES
      ========================================== */

      const courseData =
        await courseService.getCourses();

      const courses =
        courseData.courses || [];

      /* ==========================================
         3. FETCH PROGRESS FOR EACH COURSE
      ========================================== */

      const courseProgressResults =
        await Promise.all(
          courses.map(async (course) => {
            try {
              const progressData =
                await lessonProgressService.getCourseProgress(
                  course._id,
                  token
                );

              return {
                ...course,
                courseProgress:
                  progressData.courseProgress,
              };
            } catch (courseError) {
              console.error(
                `Failed to fetch progress for ${course.title}:`,
                courseError
              );

              return {
                ...course,
                courseProgress: null,
              };
            }
          })
        );

      /* ==========================================
         4. KEEP ONLY COURSES USER HAS STARTED
      ========================================== */

      const activeCourses =
        courseProgressResults.filter(
          (course) =>
            course.courseProgress &&
            course.courseProgress.startedLessons > 0
        );

      setCourseProgress(activeCourses);

    } catch (error) {
      console.error(
        "Failed to fetch dashboard progress:",
        error
      );

      setError(
        "Unable to load your learning data."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================
     FETCH WHEN TOKEN CHANGES
  ============================================ */

  useEffect(() => {
    fetchProgress();
  }, [token]);

  /* ============================================
     RESOURCE STATISTICS
  ============================================ */

  const totalStarted =
    progress.length;

  const completedCount =
    progress.filter(
      (item) =>
        item.status === "Completed"
    ).length;

  const inProgressCount =
    progress.filter(
      (item) =>
        item.status === "In Progress"
    ).length;

  const overallProgress =
    totalStarted === 0
      ? 0
      : Math.round(
          progress.reduce(
            (sum, item) =>
              sum + (item.progress || 0),
            0
          ) / totalStarted
        );

  /* ============================================
     COURSE STATISTICS
  ============================================ */

  const coursesStarted =
    courseProgress.length;

  const coursesCompleted =
    courseProgress.filter(
      (course) =>
        course.courseProgress?.progress === 100
    ).length;

  const lessonsCompleted =
    courseProgress.reduce(
      (sum, course) =>
        sum +
        (course.courseProgress
          ?.completedLessons || 0),
      0
    );

  /* ============================================
     CONTINUE COURSES
  ============================================ */

  const continueCourses =
    courseProgress
      .filter(
        (course) =>
          course.courseProgress?.progress < 100
      )
      .slice(0, 3);

  /* ============================================
     COMPLETED COURSES
  ============================================ */

  const completedCourses =
    courseProgress.filter(
      (course) =>
        course.courseProgress?.progress === 100
    );

  /* ============================================
     CONTINUE RESOURCE LEARNING
  ============================================ */

  const continueLearning =
    progress
      .filter(
        (item) =>
          item.status === "In Progress"
      )
      .slice(0, 4);

  /* ============================================
     RECENTLY COMPLETED RESOURCES
  ============================================ */

  const recentlyCompleted =
    progress
      .filter(
        (item) =>
          item.status === "Completed"
      )
      .slice(0, 4);

  /* ============================================
     RENDER
  ============================================ */

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

          /* ==================================
             LOADING
          ================================== */

          <div className="dashboard-message">

            <div className="dashboard-loader"></div>

            <p>
              Loading your learning dashboard...
            </p>

          </div>

        ) : error ? (

          /* ==================================
             ERROR
          ================================== */

          <div className="dashboard-message dashboard-error">

            <h3>
              Something went wrong
            </h3>

            <p>
              {error}
            </p>

            <button
              onClick={fetchProgress}
            >
              Try Again
            </button>

          </div>

        ) : (

          <>


            {/* ==================================
                RESOURCE STATISTICS
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
                COURSE STATISTICS
            ================================== */}

            {coursesStarted > 0 && (

              <section className="dashboard-stats course-stats">

                <div className="stat-card">

                  <div className="stat-icon">
                    🎓
                  </div>

                  <div>

                    <span>
                      Courses Started
                    </span>

                    <strong>
                      {coursesStarted}
                    </strong>

                  </div>

                </div>


                <div className="stat-card">

                  <div className="stat-icon">
                    🏆
                  </div>

                  <div>

                    <span>
                      Courses Completed
                    </span>

                    <strong>
                      {coursesCompleted}
                    </strong>

                  </div>

                </div>


                <div className="stat-card">

                  <div className="stat-icon">
                    📖
                  </div>

                  <div>

                    <span>
                      Lessons Completed
                    </span>

                    <strong>
                      {lessonsCompleted}
                    </strong>

                  </div>

                </div>

              </section>

            )}


            {/* ==================================
                OVERALL RESOURCE PROGRESS
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
                CONTINUE COURSES
            ================================== */}

            {continueCourses.length > 0 && (

              <section className="dashboard-section">

                <div className="section-heading">

                  <div>

                    <span className="section-label">
                      YOUR COURSES
                    </span>

                    <h2>
                      Continue Your Courses
                    </h2>

                    <p>
                      Continue learning from where
                      you stopped.
                    </p>

                  </div>


                  <Link
                    to="/courses"
                    className="view-all-link"
                  >
                    View All Courses →
                  </Link>

                </div>


                <div className="course-dashboard-grid">

                  {continueCourses.map(
                    (course) => {

                      const progress =
                        course.courseProgress;

                      return (

                        <article
                          className="course-dashboard-card"
                          key={course._id}
                        >

                          {/* COURSE IMAGE */}

                          <div className="course-dashboard-image">

                            {course.thumbnail ? (

                              <img
                                src={
                                  course.thumbnail
                                }
                                alt={
                                  course.title
                                }
                              />

                            ) : (

                              <div className="course-dashboard-placeholder">
                                📘
                              </div>

                            )}

                          </div>


                          {/* COURSE CONTENT */}

                          <div className="course-dashboard-content">

                            <div className="course-dashboard-top">

                              <span className="course-dashboard-skill">
                                {course.skill}
                              </span>

                              <span className="course-dashboard-level">
                                {course.difficulty}
                              </span>

                            </div>


                            <h3>
                              {course.title}
                            </h3>


                            <p>
                              {course.description}
                            </p>


                            {/* PROGRESS */}

                            <div className="course-dashboard-progress-header">

                              <span>
                                Course Progress
                              </span>

                              <strong>
                                {progress.progress}%
                              </strong>

                            </div>


                            <div className="course-dashboard-progress">

                              <div
                                className="course-dashboard-progress-fill"
                                style={{
                                  width: `${progress.progress}%`,
                                }}
                              ></div>

                            </div>


                            <div className="course-dashboard-progress-info">

                              <span>
                                {
                                  progress.completedLessons
                                }{" "}
                                of{" "}
                                {
                                  progress.totalLessons
                                }{" "}
                                lessons completed
                              </span>

                              <span>
                                {
                                  progress.startedLessons
                                }{" "}
                                started
                              </span>

                            </div>


                            {/* CONTINUE */}

                            <Link
                              to={`/courses/${course._id}`}
                              className="course-dashboard-button"
                            >
                              Continue Course →
                            </Link>

                          </div>

                        </article>

                      );

                    }
                  )}

                </div>

              </section>

            )}


            {/* ==================================
                COMPLETED COURSES
            ================================== */}

            {completedCourses.length > 0 && (

              <section className="dashboard-section completed-courses-section">

                <div className="section-heading">

                  <div>

                    <span className="section-label">
                      YOUR ACHIEVEMENTS
                    </span>

                    <h2>
                      Completed Courses
                    </h2>

                    <p>
                      Courses you have successfully
                      completed.
                    </p>

                  </div>


                  <Link
                    to="/courses"
                    className="view-all-link"
                  >
                    View All Courses →
                  </Link>

                </div>


                <div className="course-dashboard-grid">

                  {completedCourses.map(
                    (course) => {

                      const progress =
                        course.courseProgress;

                      return (

                        <article
                          className="course-dashboard-card"
                          key={course._id}
                        >

                          {/* COURSE IMAGE */}

                          <div className="course-dashboard-image">

                            {course.thumbnail ? (

                              <img
                                src={
                                  course.thumbnail
                                }
                                alt={
                                  course.title
                                }
                              />

                            ) : (

                              <div className="course-dashboard-placeholder">
                                🏆
                              </div>

                            )}

                          </div>


                          {/* COURSE CONTENT */}

                          <div className="course-dashboard-content">

                            <div className="course-dashboard-top">

                              <span className="course-dashboard-skill">
                                {course.skill}
                              </span>

                              <span className="course-dashboard-level">
                                {course.difficulty}
                              </span>

                            </div>


                            <h3>
                              {course.title}
                            </h3>


                            <p>
                              {course.description}
                            </p>


                            {/* COMPLETED PROGRESS */}

                            <div className="course-dashboard-progress-header">

                              <span>
                                Course Progress
                              </span>

                              <strong>
                                100%
                              </strong>

                            </div>


                            <div className="course-dashboard-progress">

                              <div
                                className="course-dashboard-progress-fill"
                                style={{
                                  width: "100%",
                                }}
                              ></div>

                            </div>


                            <div className="course-dashboard-progress-info">

                              <span>
                                ✓{" "}
                                {
                                  progress.completedLessons
                                }{" "}
                                of{" "}
                                {
                                  progress.totalLessons
                                }{" "}
                                lessons completed
                              </span>

                              <span>
                                Course Completed
                              </span>

                            </div>


                            {/* REVIEW COURSE */}

                            <Link
                              to={`/courses/${course._id}`}
                              className="course-dashboard-button"
                            >
                              Review Course →
                            </Link>

                          </div>

                        </article>

                      );

                    }
                  )}

                </div>

              </section>

            )}


            {/* ==================================
                RESOURCE CONTINUE LEARNING
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
                            {item.progress}%
                            {" "}
                            completed
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
                RECENTLY COMPLETED RESOURCES
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


                        {/* COMPLETED RESOURCE ACTIONS */}

                        <div className="completed-card-actions">

                          <span className="completed-badge">
                            Completed
                          </span>

                          {item.resource?._id && (

                            <Link
                              to={`/resources/${item.resource._id}`}
                              className="completed-review-button"
                            >
                              Review →
                            </Link>

                          )}

                        </div>

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
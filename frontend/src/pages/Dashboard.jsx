import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  Chart,
  ArcElement,
  DoughnutController,
  BarController,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

import { useAuth } from "../context/AuthContext";

import progressService from "../services/progressService";
import courseService from "../services/courseService";
import lessonProgressService from "../services/lessonProgressService";
import skillProgressService from "../services/skillProgressService";
import noteService from "../services/noteService";

import "../styles/Dashboard.css";

Chart.register(
  DoughnutController,
  BarController,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

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

  /* ============================================
     SKILL PROGRESS
  ============================================ */

  const [skillProgress, setSkillProgress] = useState([]);

  /* ============================================
     NOTES
  ============================================ */

  const [notes, setNotes] = useState([]);

  /* ============================================
     PAGE STATE
  ============================================ */

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ============================================
     CHART REFERENCES
  ============================================ */

  const skillChartRef = useRef(null);
  const weeklyChartRef = useRef(null);

  const skillChartInstance = useRef(null);
  const weeklyChartInstance = useRef(null);

  /* ============================================
     FETCH DASHBOARD DATA
  ============================================ */

  const fetchDashboardData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      /* ==========================================
         1. RESOURCE PROGRESS
      ========================================== */

      const resourceData =
        await progressService.getMyProgress(token);

      setProgress(resourceData.progress || []);

      /* ==========================================
         2. ALL COURSES
      ========================================== */

      const courseData =
        await courseService.getCourses();

      const courses =
        courseData.courses || [];

      /* ==========================================
         3. COURSE PROGRESS
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
         4. ONLY STARTED COURSES
      ========================================== */

      const activeCourses =
        courseProgressResults.filter(
          (course) =>
            course.courseProgress &&
            course.courseProgress.startedLessons > 0
        );

      setCourseProgress(activeCourses);

      /* ==========================================
         5. SKILL PROGRESS
      ========================================== */

      try {
        const skillData =
          await skillProgressService.getMySkillProgress(token);

        setSkillProgress(
          skillData.progress || []
        );
      } catch (skillError) {
        console.error(
          "Failed to fetch skill progress:",
          skillError
        );

        setSkillProgress([]);
      }

      /* ==========================================
         6. NOTES
      ========================================== */

      try {
        const noteData =
          await noteService.getMyNotes(token);

        setNotes(
          noteData.notes || []
        );
      } catch (noteError) {
        console.error(
          "Failed to fetch notes:",
          noteError
        );

        setNotes([]);
      }

    } catch (error) {
      console.error(
        "Failed to fetch dashboard data:",
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
    fetchDashboardData();
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
     SKILL STATISTICS
  ============================================ */

  const skillsTracked =
    skillProgress.length;

  const skillsCompleted =
    skillProgress.filter(
      (skill) =>
        skill.completionPercentage >= 100
    ).length;

  const skillsVerified =
    skillProgress.filter(
      (skill) =>
        skill.verified === true ||
        skill.status === "Verified"
    ).length;

  const skillOverallProgress =
    skillsTracked === 0
      ? 0
      : Math.round(
          skillProgress.reduce(
            (sum, skill) =>
              sum +
              (skill.completionPercentage || 0),
            0
          ) / skillsTracked
        );

  /* ============================================
     CURRENT SKILL
  ============================================ */

  const currentSkill = useMemo(() => {
    if (skillProgress.length === 0) {
      return null;
    }

    const activeSkill =
      skillProgress.find(
        (skill) =>
          skill.status === "In Progress" ||
          !skill.verified
      );

    if (activeSkill) {
      return activeSkill;
    }

    return skillProgress[
      skillProgress.length - 1
    ];
  }, [skillProgress]);

  /* ============================================
     LEARNING STREAK
  ============================================ */

  const learningStreak = useMemo(() => {
    const dates = [];

    progress.forEach((item) => {
      if (item.lastAccessedAt) {
        dates.push(
          new Date(item.lastAccessedAt)
        );
      }

      if (item.startedAt) {
        dates.push(
          new Date(item.startedAt)
        );
      }

      if (item.completedAt) {
        dates.push(
          new Date(item.completedAt)
        );
      }
    });

    skillProgress.forEach((skill) => {
      if (skill.updatedAt) {
        dates.push(
          new Date(skill.updatedAt)
        );
      }
    });

    if (dates.length === 0) {
      return 0;
    }

    const uniqueDays = [
      ...new Set(
        dates.map((date) =>
          date.toISOString().split("T")[0]
        )
      ),
    ].sort(
      (a, b) =>
        new Date(b) - new Date(a)
    );

    let streak = 0;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let expectedDate = today;

    for (const day of uniqueDays) {
      const activityDate =
        new Date(day);

      activityDate.setHours(0, 0, 0, 0);

      const difference =
        Math.round(
          (expectedDate - activityDate) /
            (1000 * 60 * 60 * 24)
        );

      if (
        difference === 0 ||
        difference === 1
      ) {
        streak++;

        expectedDate =
          activityDate;

        expectedDate.setDate(
          expectedDate.getDate() - 1
        );
      } else {
        break;
      }
    }

    return streak;
  }, [progress, skillProgress]);

  /* ============================================
     STUDY HOURS
  ============================================ */

  const dailyStudyHours = useMemo(() => {
    if (!user?.studyHours) {
      return 0;
    }

    const value =
      String(user.studyHours)
        .match(/\d+(\.\d+)?/);

    return value
      ? Number(value[0])
      : 0;
  }, [user]);

  const weeklyStudyHours =
    dailyStudyHours * 7;

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
     RECENT NOTES
  ============================================ */

  const recentNotes =
    [...notes]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      )
      .slice(0, 4);

  /* ============================================
     SKILL CHART
  ============================================ */

  useEffect(() => {
    if (
      loading ||
      !skillChartRef.current
    ) {
      return;
    }

    if (skillChartInstance.current) {
      skillChartInstance.current.destroy();
    }

    const completed =
      skillsCompleted;

    const remaining =
      Math.max(
        skillsTracked - skillsCompleted,
        0
      );

    skillChartInstance.current =
      new Chart(
        skillChartRef.current,
        {
          type: "doughnut",

          data: {
            labels: [
              "Completed",
              "Remaining",
            ],

            datasets: [
              {
                data: [
                  completed,
                  remaining,
                ],

                backgroundColor: [
                  "#3157d5",
                  "#e8edf5",
                ],

                borderWidth: 0,
              },
            ],
          },

          options: {
            responsive: true,

            maintainAspectRatio: false,

            cutout: "72%",

            plugins: {
              legend: {
                position: "bottom",

                labels: {
                  padding: 20,

                  usePointStyle: true,
                },
              },
            },
          },
        }
      );

    return () => {
      if (skillChartInstance.current) {
        skillChartInstance.current.destroy();
      }
    };
  }, [
    loading,
    skillsCompleted,
    skillsTracked,
  ]);

  /* ============================================
     WEEKLY CHART
  ============================================ */

  useEffect(() => {
    if (
      loading ||
      !weeklyChartRef.current
    ) {
      return;
    }

    if (weeklyChartInstance.current) {
      weeklyChartInstance.current.destroy();
    }

    weeklyChartInstance.current =
      new Chart(
        weeklyChartRef.current,
        {
          type: "bar",

          data: {
            labels: [
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
              "Sun",
            ],

            datasets: [
              {
                label:
                  "Planned Study Hours",

                data: [
                  dailyStudyHours,
                  dailyStudyHours,
                  dailyStudyHours,
                  dailyStudyHours,
                  dailyStudyHours,
                  dailyStudyHours,
                  dailyStudyHours,
                ],

                backgroundColor:
                  "#3157d5",

                borderRadius: 8,

                borderSkipped: false,
              },
            ],
          },

          options: {
            responsive: true,

            maintainAspectRatio: false,

            plugins: {
              legend: {
                display: false,
              },

              title: {
                display: false,
              },
            },

            scales: {
              y: {
                beginAtZero: true,

                ticks: {
                  stepSize: 1,
                },

                grid: {
                  color: "#edf1f6",
                },
              },

              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        }
      );

    return () => {
      if (weeklyChartInstance.current) {
        weeklyChartInstance.current.destroy();
      }
    };
  }, [
    loading,
    dailyStudyHours,
  ]);

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

            <p>
              {error}
            </p>

            <button
              onClick={fetchDashboardData}
            >
              Try Again
            </button>

          </div>

        ) : (

          <>

            {/* ==================================
                SKILL STATISTICS
            ================================== */}

            <section className="dashboard-stats skill-dashboard-stats">

              <div className="stat-card">

                <div className="stat-icon">
                  🎯
                </div>

                <div>
                  <span>
                    Skill Progress
                  </span>

                  <strong>
                    {skillOverallProgress}%
                  </strong>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  🏆
                </div>

                <div>
                  <span>
                    Skills Completed
                  </span>

                  <strong>
                    {skillsCompleted}
                  </strong>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  ✓
                </div>

                <div>
                  <span>
                    Skills Verified
                  </span>

                  <strong>
                    {skillsVerified}
                  </strong>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  🔥
                </div>

                <div>
                  <span>
                    Learning Streak
                  </span>

                  <strong>
                    {learningStreak} days
                  </strong>
                </div>

              </div>

            </section>


            {/* ==================================
                CURRENT SKILL
            ================================== */}

            <section className="current-skill-card">

              <div className="current-skill-icon">
                🎯
              </div>

              <div className="current-skill-content">

                <span>
                  CURRENT SKILL
                </span>

                <h2>
                  {currentSkill
                    ? currentSkill.skillId
                    : "No skill started yet"}
                </h2>

                <p>
                  {currentSkill
                    ? `${currentSkill.completionPercentage || 0}% completed`
                    : "Start learning a skill to track your progress."}
                </p>

                {currentSkill && (
                  <div className="current-skill-progress">

                    <div
                      className="current-skill-progress-fill"
                      style={{
                        width: `${
                          currentSkill.completionPercentage || 0
                        }%`,
                      }}
                    ></div>

                  </div>
                )}

              </div>

              <Link
                to="/progress"
                className="current-skill-button"
              >
                View Progress →
              </Link>

            </section>


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
                    Resources Completed
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
                    Resource Progress
                  </span>

                  <strong>
                    {overallProgress}%
                  </strong>
                </div>

              </div>

            </section>


            {/* ==================================
                LEARNING ANALYTICS
            ================================== */}

            <section className="analytics-grid">

              {/* SKILL CHART */}

              <div className="analytics-card">

                <div className="analytics-card-header">

                  <div>
                    <span>
                      SKILL ANALYTICS
                    </span>

                    <h2>
                      Skill Completion
                    </h2>

                    <p>
                      Completed vs remaining skills.
                    </p>
                  </div>

                </div>

                <div className="skill-chart-container">

                  {skillsTracked > 0 ? (

                    <canvas
                      ref={skillChartRef}
                    ></canvas>

                  ) : (

                    <div className="chart-empty">
                      <span>📊</span>

                      <p>
                        Start learning skills to
                        see your progress chart.
                      </p>
                    </div>

                  )}

                </div>

              </div>


              {/* WEEKLY CHART */}

              <div className="analytics-card">

                <div className="analytics-card-header">

                  <div>
                    <span>
                      STUDY ACTIVITY
                    </span>

                    <h2>
                      Weekly Study Hours
                    </h2>

                    <p>
                      Based on your study-hours
                      preference.
                    </p>
                  </div>

                  <div className="weekly-hours-value">
                    {weeklyStudyHours}
                    <small>
                      hrs/week
                    </small>
                  </div>

                </div>

                <div className="weekly-chart-container">

                  <canvas
                    ref={weeklyChartRef}
                  ></canvas>

                </div>

              </div>

            </section>


            {/* ==================================
                STUDY SUMMARY
            ================================== */}

            <section className="study-summary-grid">

              <div className="study-summary-card">

                <span>
                  DAILY STUDY GOAL
                </span>

                <strong>
                  {dailyStudyHours || 0}
                </strong>

                <small>
                  hours / day
                </small>

              </div>


              <div className="study-summary-card">

                <span>
                  WEEKLY STUDY PLAN
                </span>

                <strong>
                  {weeklyStudyHours || 0}
                </strong>

                <small>
                  hours / week
                </small>

              </div>


              <div className="study-summary-card">

                <span>
                  LESSONS COMPLETED
                </span>

                <strong>
                  {lessonsCompleted}
                </strong>

                <small>
                  across your courses
                </small>

              </div>


              <div className="study-summary-card">

                <span>
                  COURSES COMPLETED
                </span>

                <strong>
                  {coursesCompleted}
                </strong>

                <small>
                  successfully completed
                </small>

              </div>

            </section>


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
                RECENT NOTES
            ================================== */}

            <section className="dashboard-section">

              <div className="section-heading">

                <div>

                  <span className="section-label">
                    YOUR NOTES
                  </span>

                  <h2>
                    Recent Notes
                  </h2>

                  <p>
                    Quickly access your latest
                    learning notes.
                  </p>

                </div>

                <Link
                  to="/notes"
                  className="view-all-link"
                >
                  View All Notes →
                </Link>

              </div>


              {recentNotes.length === 0 ? (

                <div className="empty-dashboard">

                  <div className="empty-dashboard-icon">
                    📝
                  </div>

                  <h3>
                    No notes yet
                  </h3>

                  <p>
                    Create notes while learning
                    to keep important concepts
                    organized.
                  </p>

                  <Link
                    to="/notes"
                    className="dashboard-primary-button"
                  >
                    Create Your First Note
                  </Link>

                </div>

              ) : (

                <div className="dashboard-notes-grid">

                  {recentNotes.map(
                    (note) => (

                      <article
                        className="dashboard-note-card"
                        key={note._id}
                      >

                        <div className="dashboard-note-top">

                          <span className="dashboard-note-skill">
                            {note.skillId}
                          </span>

                          <span>
                            📝
                          </span>

                        </div>

                        <h3>
                          {note.title}
                        </h3>

                        <p>
                          {note.content}
                        </p>

                        <div className="dashboard-note-footer">

                          <span>
                            {new Date(
                              note.updatedAt ||
                              note.createdAt
                            ).toLocaleDateString()}
                          </span>

                          <Link
                            to={`/notes/${note.skillId}`}
                          >
                            Open →
                          </Link>

                        </div>

                      </article>

                    )
                  )}

                </div>

              )}

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
                                  width:
                                    `${progress.progress}%`,
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
                              width:
                                `${item.progress}%`,
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
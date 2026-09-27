import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import courseService from "../services/courseService";
import lessonProgressService from "../services/lessonProgressService";

import { useAuth } from "../context/AuthContext";

import "../styles/Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] =
    useState("All");
  const [skillFilter, setSkillFilter] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { token } = useAuth();

  /* ============================================
     FETCH COURSES + PROGRESS
  ============================================ */

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        /* ==========================================
           FETCH COURSES
        ========================================== */

        const data =
          await courseService.getCourses();

        const fetchedCourses =
          data.courses || [];

        setCourses(fetchedCourses);

        /* ==========================================
           FETCH USER COURSE PROGRESS
        ========================================== */

        if (
          token &&
          fetchedCourses.length > 0
        ) {
          const progressResults =
            await Promise.all(
              fetchedCourses.map(
                async (course) => {
                  try {
                    const progressData =
                      await lessonProgressService.getCourseProgress(
                        course._id,
                        token
                      );

                    return {
                      courseId: course._id,
                      progress:
                        progressData.courseProgress,
                    };
                  } catch (progressError) {
                    console.error(
                      `Failed to fetch progress for ${course.title}:`,
                      progressError
                    );

                    return {
                      courseId: course._id,
                      progress: null,
                    };
                  }
                }
              )
            );

          const progressMap = {};

          progressResults.forEach(
            ({ courseId, progress }) => {
              if (progress) {
                progressMap[courseId] =
                  progress;
              }
            }
          );

          setCourseProgress(progressMap);
        }
      } catch (error) {
        console.error(
          "Fetch courses error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  /* ============================================
     SKILLS
  ============================================ */

  const skills = [
    ...new Set(
      courses
        .map((course) => course.skill)
        .filter(Boolean)
    ),
  ];

  /* ============================================
     FILTER COURSES
  ============================================ */

  const filteredCourses = courses.filter(
    (course) => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      const matchesSearch =
        !search ||
        course.title
          ?.toLowerCase()
          .includes(search) ||
        course.skill
          ?.toLowerCase()
          .includes(search) ||
        course.description
          ?.toLowerCase()
          .includes(search);

      const matchesDifficulty =
        difficultyFilter === "All" ||
        course.difficulty ===
          difficultyFilter;

      const matchesSkill =
        skillFilter === "All" ||
        course.skill === skillFilter;

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesSkill
      );
    }
  );

  /* ============================================
     LOADING
  ============================================ */

  if (loading) {
    return (
      <div className="courses-page">

        <div className="courses-loading">
          Loading courses...
        </div>

      </div>
    );
  }

  /* ============================================
     ERROR
  ============================================ */

  if (error) {
    return (
      <div className="courses-page">

        <div className="courses-error">

          <h3>
            Something went wrong
          </h3>

          <p>
            {error}
          </p>

        </div>

      </div>
    );
  }

  /* ============================================
     RENDER
  ============================================ */

  return (
    <div className="courses-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="courses-header">

        <div>

          <span className="courses-eyebrow">
            SKILLPATH LEARNING
          </span>

          <h1>
            Explore Courses
          </h1>

          <p>
            Build practical skills through
            structured, step-by-step learning
            paths.
          </p>

        </div>

        <div className="courses-count">

          <strong>
            {filteredCourses.length}
          </strong>

          <span>
            {filteredCourses.length === 1
              ? "Course"
              : "Courses"}
          </span>

        </div>

      </div>


      {/* ========================================
          SEARCH + FILTERS
      ======================================== */}

      <div className="courses-filters">

        {/* SEARCH */}

        <div className="courses-search">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search courses or skills..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>


        {/* DIFFICULTY */}

        <select
          value={difficultyFilter}
          onChange={(e) =>
            setDifficultyFilter(
              e.target.value
            )
          }
        >

          <option value="All">
            All Difficulties
          </option>

          <option value="Beginner">
            Beginner
          </option>

          <option value="Intermediate">
            Intermediate
          </option>

          <option value="Advanced">
            Advanced
          </option>

        </select>


        {/* SKILL */}

        <select
          value={skillFilter}
          onChange={(e) =>
            setSkillFilter(
              e.target.value
            )
          }
        >

          <option value="All">
            All Skills
          </option>

          {skills.map((skill) => (
            <option
              key={skill}
              value={skill}
            >
              {skill}
            </option>
          ))}

        </select>


        {/* CLEAR FILTERS */}

        {(searchTerm ||
          difficultyFilter !== "All" ||
          skillFilter !== "All") && (

          <button
            className="clear-course-filters"
            onClick={() => {
              setSearchTerm("");
              setDifficultyFilter("All");
              setSkillFilter("All");
            }}
          >
            Clear
          </button>

        )}

      </div>


      {/* ========================================
          NO COURSES AT ALL
      ======================================== */}

      {courses.length === 0 ? (

        <div className="courses-empty">

          <h2>
            No courses available
          </h2>

          <p>
            Courses will appear here when they
            are published.
          </p>

        </div>

      ) : filteredCourses.length === 0 ? (

        /* ======================================
           NO FILTER RESULTS
        ====================================== */

        <div className="courses-empty">

          <div className="courses-empty-icon">
            🔍
          </div>

          <h2>
            No courses found
          </h2>

          <p>
            Try changing your search or filters
            to find a course.
          </p>

          <button
            className="clear-course-filters empty-clear-button"
            onClick={() => {
              setSearchTerm("");
              setDifficultyFilter("All");
              setSkillFilter("All");
            }}
          >
            Clear Filters
          </button>

        </div>

      ) : (

        /* ========================================
           COURSE GRID
        ======================================== */

        <div className="courses-grid">

          {filteredCourses.map(
            (course) => {

              const progress =
                courseProgress[
                  course._id
                ];

              const percentage =
                progress?.progress || 0;

              const isCompleted =
                percentage >= 100;

              const hasStarted =
                progress?.startedLessons >
                0;

              return (

                <article
                  className={`course-card ${
                    isCompleted
                      ? "course-card-completed"
                      : ""
                  }`}
                  key={course._id}
                >

                  {/* ==================================
                      COURSE THUMBNAIL
                  ================================== */}

                  <div className="course-thumbnail">

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

                      <div className="course-thumbnail-placeholder">

                        {course.skill?.charAt(
                          0
                        ) || "C"}

                      </div>

                    )}


                    {/* DIFFICULTY */}

                    <span className="course-difficulty">
                      {course.difficulty}
                    </span>


                    {/* COMPLETED BADGE */}

                    {isCompleted && (

                      <span className="course-completed-badge">
                        ✓ Completed
                      </span>

                    )}

                  </div>


                  {/* ==================================
                      COURSE CONTENT
                  ================================== */}

                  <div className="course-content">

                    <div className="course-skill">
                      {course.skill}
                    </div>


                    <h2>
                      {course.title}
                    </h2>


                    <p>
                      {course.description}
                    </p>


                    {/* ==================================
                        COURSE META
                    ================================== */}

                    <div className="course-meta">

                      <span>
                        ⏱ {course.duration} hours
                      </span>

                      <span>
                        {course.isFree
                          ? "Free"
                          : "Paid"}
                      </span>

                    </div>


                    {/* ==================================
                        COURSE PROGRESS
                    ================================== */}

                    {hasStarted && (

                      <div className="course-card-progress">

                        <div className="course-card-progress-header">

                          <span>
                            Your Progress
                          </span>

                          <strong>
                            {percentage}%
                          </strong>

                        </div>


                        <div className="course-card-progress-bar">

                          <div
                            className={`course-card-progress-fill ${
                              isCompleted
                                ? "completed"
                                : ""
                            }`}
                            style={{
                              width: `${percentage}%`,
                            }}
                          />

                        </div>


                        <div className="course-card-progress-info">

                          <span>
                            {
                              progress.completedLessons
                            }{" "}
                            of{" "}
                            {
                              progress.totalLessons
                            }{" "}
                            lessons
                          </span>


                          {isCompleted ? (

                            <span className="course-completed-text">
                              ✓ Completed
                            </span>

                          ) : (

                            <span>
                              {
                                progress.startedLessons
                              }{" "}
                              started
                            </span>

                          )}

                        </div>

                      </div>

                    )}


                    {/* ==================================
                        COURSE BUTTON
                    ================================== */}

                    <button
                      className={`course-view-button ${
                        isCompleted
                          ? "course-review-button"
                          : ""
                      }`}
                      onClick={() =>
                        navigate(
                          `/courses/${course._id}`
                        )
                      }
                    >

                      {isCompleted
                        ? "Review Course →"
                        : hasStarted
                        ? "Continue Course →"
                        : "View Course →"}

                    </button>

                  </div>

                </article>

              );
            }
          )}

        </div>

      )}

    </div>
  );
};

export default Courses;
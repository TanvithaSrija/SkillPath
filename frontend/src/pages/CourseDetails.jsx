import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import courseService from "../services/courseService";
import lessonProgressService from "../services/lessonProgressService";

import { useAuth } from "../context/AuthContext";

import "../styles/CourseDetails.css";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [courseProgress, setCourseProgress] =
    useState(null);

  const [lessonProgress, setLessonProgress] =
    useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =========================================
     FETCH COURSE DATA
  ========================================= */

  useEffect(() => {
    fetchCourse();
  }, [id, token]);


  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await courseService.getCourseById(id);

      setCourse(data.course);
      setLessons(data.lessons || []);


      /* =====================================
         FETCH OVERALL COURSE PROGRESS
      ===================================== */

      if (token) {

        try {

          const progressData =
            await lessonProgressService.getCourseProgress(
              id,
              token
            );

          setCourseProgress(
            progressData.courseProgress
          );

        } catch (progressError) {

          console.error(
            "Fetch course progress error:",
            progressError
          );

        }


        /* =====================================
           FETCH INDIVIDUAL LESSON PROGRESS
        ===================================== */

        try {

          const lessonProgressData =
            await lessonProgressService.getMyLessonProgress(
              token
            );

          const progressMap = {};

          (
            lessonProgressData.progress || []
          ).forEach((record) => {

            if (record.lesson?._id) {

              progressMap[
                record.lesson._id
              ] = record;

            }

          });

          setLessonProgress(
            progressMap
          );

        } catch (progressError) {

          console.error(
            "Fetch lesson progress error:",
            progressError
          );

        }

      } else {

        setCourseProgress(null);
        setLessonProgress({});

      }

    } catch (error) {

      console.error(
        "Fetch course error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load course."
      );

    } finally {

      setLoading(false);

    }
  };


  /* =========================================
     COURSE COMPLETION STATUS
  ========================================= */

  const coursePercentage =
    courseProgress?.progress || 0;

  const isCourseCompleted =
    coursePercentage >= 100;


  /* =========================================
     START / CONTINUE COURSE
  ========================================= */

  const handleStartCourse = () => {

    if (!lessons.length) {
      return;
    }

    /*
      If course is completed, open the
      first lesson for review.

      Otherwise continue from the first
      incomplete lesson.
    */

    if (isCourseCompleted) {

      navigate(
        `/lessons/${lessons[0]._id}`
      );

      return;
    }


    /*
      Find the first lesson that is not
      completed.
    */

    const nextLesson =
      lessons.find(
        (lesson) =>
          lessonProgress[
            lesson._id
          ]?.status !== "Completed"
      );


    navigate(
      `/lessons/${
        nextLesson?._id ||
        lessons[0]._id
      }`
    );

  };


  /* =========================================
     START INDIVIDUAL LESSON
  ========================================= */

  const handleStartLesson = (
    lessonId
  ) => {

    navigate(
      `/lessons/${lessonId}`
    );

  };


  /* =========================================
     LOADING STATE
  ========================================= */

  if (loading) {

    return (
      <div className="course-details-page">

        <div className="course-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading course...
          </p>

        </div>

      </div>
    );

  }


  /* =========================================
     ERROR STATE
  ========================================= */

  if (error || !course) {

    return (
      <div className="course-details-page">

        <div className="course-error">

          <h2>
            Unable to load course
          </h2>

          <p>
            {error ||
              "Course information could not be found."}
          </p>

          <button
            onClick={() =>
              navigate("/courses")
            }
          >
            ← Back to Courses
          </button>

        </div>

      </div>
    );

  }


  /* =========================================
     MAIN UI
  ========================================= */

  return (
    <div className="course-details-page">


      {/* =====================================
          BACK BUTTON
      ===================================== */}

      <div className="course-details-container">

        <button
          className="back-button"
          onClick={() =>
            navigate("/courses")
          }
        >
          ← Back to Courses
        </button>

      </div>


      {/* =====================================
          COURSE HERO
      ===================================== */}

      <section className="course-hero">

        <div className="course-details-container">

          <div className="course-hero-grid">


            {/* =================================
                LEFT SIDE
            ================================= */}

            <div className="course-hero-content">

              <div className="course-badges">

                <span className="course-badge">
                  {course.difficulty}
                </span>


                {course.isFree && (

                  <span className="course-badge free">
                    Free
                  </span>

                )}


                <span className="course-badge">
                  {course.skill}
                </span>

              </div>


              <h1>
                {course.title}
              </h1>


              <p className="course-hero-description">
                {course.description}
              </p>


              {/* COURSE META */}

              <div className="course-meta">


                <div className="course-meta-item">

                  <span className="meta-icon">
                    🎓
                  </span>

                  <div>

                    <span>
                      Instructor
                    </span>

                    <strong>
                      {course.instructor ||
                        "SkillPath Learning Team"}
                    </strong>

                  </div>

                </div>


                <div className="course-meta-item">

                  <span className="meta-icon">
                    ⏱
                  </span>

                  <div>

                    <span>
                      Duration
                    </span>

                    <strong>
                      {course.duration} hours
                    </strong>

                  </div>

                </div>


                <div className="course-meta-item">

                  <span className="meta-icon">
                    📚
                  </span>

                  <div>

                    <span>
                      Lessons
                    </span>

                    <strong>
                      {lessons.length} Lessons
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================
                RIGHT SIDE
            ================================= */}

            <div className="course-hero-card">


              {course.thumbnail ? (

                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="course-hero-thumbnail"
                />

              ) : (

                <div className="course-thumbnail-placeholder">

                  <span>
                    📘
                  </span>

                  <p>
                    {course.skill}
                  </p>

                </div>

              )}


              <div className="course-hero-card-content">


                <div className="course-price">

                  {course.isFree
                    ? "Free"
                    : "Premium Course"}

                </div>


                {/* COURSE ACTION */}

                <button
                  className={
                    isCourseCompleted
                      ? "start-course-button course-completed-action"
                      : "start-course-button"
                  }
                  onClick={
                    handleStartCourse
                  }
                  disabled={
                    !lessons.length
                  }
                >

                  {isCourseCompleted
                    ? "✓ Course Completed · Review Course →"
                    : coursePercentage > 0
                    ? "Continue Course →"
                    : "Start Course →"}

                </button>


                <div className="course-card-info">

                  {isCourseCompleted ? (

                    <>
                      <span>
                        ✓ All Lessons Completed
                      </span>

                      <span>
                        ✓ Course Progress: 100%
                      </span>

                      <span>
                        ✓ Course Ready for Review
                      </span>
                    </>

                  ) : (

                    <>
                      <span>
                        ✓ Lifetime Access
                      </span>

                      <span>
                        ✓ Structured Lessons
                      </span>

                      <span>
                        ✓ Track Your Progress
                      </span>
                    </>

                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="course-main">

        <div className="course-details-container">

          <div className="course-content-grid">


            {/* =================================
                LEFT CONTENT
            ================================= */}

            <div className="course-lessons-section">


              {/* =================================
                  COURSE PROGRESS
              ================================= */}

              {courseProgress && (

                <div className="course-progress-card">

                  <div className="course-progress-header">

                    <div>

                      <span className="course-progress-label">
                        {isCourseCompleted
                          ? "COURSE COMPLETED"
                          : "YOUR PROGRESS"}
                      </span>

                      <h3>

                        {courseProgress.progress}%
                        {" "}
                        {isCourseCompleted
                          ? "Course Complete"
                          : "Complete"}

                      </h3>

                    </div>


                    <strong>

                      {
                        courseProgress.completedLessons
                      }

                      /

                      {
                        courseProgress.totalLessons
                      }

                    </strong>

                  </div>


                  <div className="course-progress-bar">

                    <div
                      className="course-progress-fill"
                      style={{
                        width: `${courseProgress.progress}%`,
                      }}
                    />

                  </div>


                  <div className="course-progress-footer">

                    <span>

                      {
                        courseProgress.completedLessons
                      }{" "}
                      completed

                    </span>


                    <span>

                      {
                        courseProgress.startedLessons
                      }{" "}
                      started

                    </span>


                    {isCourseCompleted && (

                      <span>
                        ✓ Course Completed
                      </span>

                    )}

                  </div>

                </div>

              )}


              {/* =================================
                  LESSONS HEADER
              ================================= */}

              <div className="lessons-header">

                <div>

                  <span className="section-label">
                    COURSE CONTENT
                  </span>

                  <h2>
                    Course Lessons
                  </h2>

                </div>


                <span className="lesson-count">
                  {lessons.length} Lessons
                </span>

              </div>


              {/* =================================
                  LESSON LIST
              ================================= */}

              <div className="lesson-list">

                {lessons.length === 0 ? (

                  <div className="empty-lessons">

                    <p>
                      No lessons available yet.
                    </p>

                  </div>

                ) : (

                  lessons.map(
                    (lesson, index) => {

                      /*
                        Existing lesson progress
                      */

                      const progress =
                        lessonProgress[
                          lesson._id
                        ];


                      /*
                        Lesson status
                      */

                      const isCompleted =
                        progress?.status ===
                        "Completed";


                      const isInProgress =
                        progress?.status ===
                        "In Progress";


                      return (

                        <article
                          key={lesson._id}
                          className={`lesson-card ${
                            isCompleted
                              ? "lesson-completed"
                              : ""
                          }`}
                        >


                          {/* LESSON NUMBER */}

                          <div className="lesson-number">

                            {isCompleted ? (

                              <span className="completed-icon">
                                ✓
                              </span>

                            ) : (

                              index + 1

                            )}

                          </div>


                          {/* LESSON INFORMATION */}

                          <div className="lesson-info">

                            <div className="lesson-top-row">

                              <span className="lesson-type">
                                {lesson.type}
                              </span>


                              {lesson.isFree && (

                                <span className="lesson-free">
                                  Free
                                </span>

                              )}

                            </div>


                            <h3>
                              {lesson.title}
                            </h3>


                            {/* LESSON PROGRESS STATUS */}

                            <div
                              className={`lesson-progress-status ${
                                isCompleted
                                  ? "completed"
                                  : isInProgress
                                  ? "in-progress"
                                  : "not-started"
                              }`}
                            >

                              {isCompleted
                                ? "✓ Completed"
                                : isInProgress
                                ? `▶ In Progress${
                                    progress?.progress
                                      ? ` · ${progress.progress}%`
                                      : ""
                                  }`
                                : "○ Not Started"}

                            </div>


                            {lesson.description && (

                              <p className="lesson-description">
                                {lesson.description}
                              </p>

                            )}


                            {/* LESSON META */}

                            <div className="lesson-meta">

                              <span>
                                ⏱{" "}
                                {lesson.duration} min
                              </span>

                              <span>
                                📖 Lesson{" "}
                                {lesson.order}
                              </span>

                            </div>

                          </div>


                          {/* LESSON ACTION */}

                          <div className="lesson-action">

                            <button
                              className={
                                isCompleted
                                  ? "lesson-button completed-button"
                                  : "lesson-button"
                              }
                              onClick={() =>
                                handleStartLesson(
                                  lesson._id
                                )
                              }
                            >

                              {isCompleted
                                ? "Review Lesson"
                                : isInProgress
                                ? "Continue →"
                                : "Start Lesson →"}

                            </button>

                          </div>

                        </article>

                      );

                    }
                  )

                )}

              </div>

            </div>


            {/* =================================
                RIGHT SIDEBAR
            ================================= */}

            <aside className="course-sidebar">


              {/* COURSE INFORMATION */}

              <div className="sidebar-card">

                <h3>
                  Course Information
                </h3>


                <div className="sidebar-info-list">


                  <div className="sidebar-info-item">

                    <span>
                      Skill
                    </span>

                    <strong>
                      {course.skill}
                    </strong>

                  </div>


                  <div className="sidebar-info-item">

                    <span>
                      Level
                    </span>

                    <strong>
                      {course.difficulty}
                    </strong>

                  </div>


                  <div className="sidebar-info-item">

                    <span>
                      Duration
                    </span>

                    <strong>
                      {course.duration} hours
                    </strong>

                  </div>


                  <div className="sidebar-info-item">

                    <span>
                      Lessons
                    </span>

                    <strong>
                      {lessons.length}
                    </strong>

                  </div>


                  <div className="sidebar-info-item">

                    <span>
                      Platform
                    </span>

                    <strong>
                      {course.platform}
                    </strong>

                  </div>

                </div>

              </div>


              {/* WHAT YOU WILL LEARN */}

              <div className="sidebar-card">

                <h3>
                  What You'll Learn
                </h3>


                <ul className="learning-outcomes">

                  <li>
                    <span>✓</span>
                    Learn {course.skill} fundamentals
                  </li>

                  <li>
                    <span>✓</span>
                    Follow structured lessons
                  </li>

                  <li>
                    <span>✓</span>
                    Practice through hands-on exercises
                  </li>

                  <li>
                    <span>✓</span>
                    Track your learning progress
                  </li>

                  <li>
                    <span>✓</span>
                    Build practical knowledge
                  </li>

                </ul>

              </div>


              {/* PROGRESS SUMMARY */}

              {courseProgress && (

                <div className="sidebar-card">

                  <h3>
                    Your Progress
                  </h3>


                  <div className="sidebar-progress">

                    <div className="sidebar-progress-value">
                      {courseProgress.progress}%
                    </div>

                    <p>
                      {isCourseCompleted
                        ? "Course completed"
                        : "Course completed"}
                    </p>

                  </div>


                  <div className="sidebar-progress-stats">


                    <div>

                      <strong>
                        {
                          courseProgress.completedLessons
                        }
                      </strong>

                      <span>
                        Completed
                      </span>

                    </div>


                    <div>

                      <strong>
                        {
                          courseProgress.startedLessons
                        }
                      </strong>

                      <span>
                        Started
                      </span>

                    </div>


                    <div>

                      <strong>
                        {
                          courseProgress.totalLessons -
                          courseProgress.completedLessons
                        }
                      </strong>

                      <span>
                        Remaining
                      </span>

                    </div>

                  </div>


                  {isCourseCompleted && (

                    <div className="course-completion-message">

                      <span>
                        ✓
                      </span>

                      <div>

                        <strong>
                          Course Completed!
                        </strong>

                        <p>
                          You've completed every
                          lesson in this course.
                        </p>

                      </div>

                    </div>

                  )}

                </div>

              )}

            </aside>

          </div>

        </div>

      </main>

    </div>
  );
};

export default CourseDetails;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import lessonService from "../services/lessonService";
import lessonProgressService from "../services/lessonProgressService";

import { useAuth } from "../context/AuthContext";

import "../styles/LessonPlayer.css";

const LessonPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [completed, setCompleted] = useState(false);

  const [allLessonProgress, setAllLessonProgress] =
    useState({});


  /*
    =========================================
    FETCH CURRENT LESSON + COURSE LESSONS
    =========================================
  */

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError("");

        /*
          Fetch current lesson
        */

        const data =
          await lessonService.getLessonById(id);

        const currentLesson = data.lesson;

        setLesson(currentLesson);


        /*
          Fetch all lessons in the course
        */

        if (currentLesson?.course?._id) {
          const courseData =
            await lessonService.getLessonsByCourse(
              currentLesson.course._id
            );

          setCourseLessons(
            courseData.lessons || []
          );
        }


        /*
          Fetch lesson progress
        */

        if (token) {

          /*
            Current lesson progress
          */

          const progressData =
            await lessonProgressService.getLessonProgress(
              id,
              token
            );

          if (
            progressData.success &&
            progressData.progress
          ) {
            setCompleted(
              progressData.progress.status ===
                "Completed"
            );
          } else {
            setCompleted(false);
          }


          /*
            All lesson progress

            Used for the course-content
            sidebar.
          */

          const allProgressData =
            await lessonProgressService.getMyLessonProgress(
              token
            );

          const progressMap = {};

          (
            allProgressData.progress || []
          ).forEach((record) => {

            if (record.lesson?._id) {
              progressMap[
                record.lesson._id
              ] = record;
            }

          });

          setAllLessonProgress(
            progressMap
          );

        } else {
          setCompleted(false);
          setAllLessonProgress({});
        }

      } catch (error) {

        console.error(
          "Fetch lesson error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load lesson."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchLesson();

  }, [id, token]);


  /*
    =========================================
    COMPLETE LESSON
    =========================================
  */

  const handleComplete = async () => {

    if (!token) {
      alert(
        "Please login to complete the lesson."
      );

      return;
    }

    try {

      const data =
        await lessonProgressService.updateLessonProgress(
          id,
          100,
          token
        );

      if (
        data.success &&
        data.progress
      ) {

        setCompleted(
          data.progress.status ===
            "Completed"
        );


        /*
          Update sidebar progress
          immediately without requiring
          a refresh.
        */

        setAllLessonProgress(
          (previous) => ({
            ...previous,
            [id]: data.progress,
          })
        );

      }

    } catch (error) {

      console.error(
        "Complete lesson error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to complete lesson."
      );

    }
  };


  /*
    =========================================
    YOUTUBE EMBED URL
    =========================================
  */

  const getYouTubeEmbedUrl = (url) => {

    if (!url) return "";

    try {

      const parsedUrl = new URL(url);


      if (
        parsedUrl.hostname.includes(
          "youtube.com"
        )
      ) {

        const videoId =
          parsedUrl.searchParams.get("v");

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }

      }


      if (
        parsedUrl.hostname.includes(
          "youtu.be"
        )
      ) {

        const videoId =
          parsedUrl.pathname.substring(1);

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }

      }


      return url;

    } catch {

      return url;

    }
  };


  /*
    =========================================
    FIND CURRENT LESSON POSITION
    =========================================
  */

  const currentLessonIndex =
    courseLessons.findIndex(
      (courseLesson) =>
        courseLesson._id === id
    );


  const totalLessons =
    courseLessons.length;


  const isFirstLesson =
    currentLessonIndex <= 0;


  const isLastLesson =
    currentLessonIndex ===
    totalLessons - 1;


  /*
    =========================================
    PREVIOUS LESSON
    =========================================
  */

  const handlePreviousLesson = () => {

    if (
      isFirstLesson ||
      !courseLessons.length
    ) {
      return;
    }

    const previousLesson =
      courseLessons[
        currentLessonIndex - 1
      ];

    navigate(
      `/lessons/${previousLesson._id}`
    );

  };


  /*
    =========================================
    NEXT LESSON
    =========================================
  */

  const handleNextLesson = () => {

    if (
      isLastLesson ||
      !courseLessons.length
    ) {
      return;
    }

    const nextLesson =
      courseLessons[
        currentLessonIndex + 1
      ];

    navigate(
      `/lessons/${nextLesson._id}`
    );

  };


  /*
    =========================================
    COMPLETED LESSON COUNT
    =========================================
  */

  const completedLessonCount =
    Object.values(
      allLessonProgress
    ).filter(
      (item) =>
        item.status === "Completed"
    ).length;


  /*
    =========================================
    LOADING STATE
    =========================================
  */

  if (loading) {

    return (
      <div className="lesson-player-page">

        <div className="lesson-player-loading">
          Loading lesson...
        </div>

      </div>
    );

  }


  /*
    =========================================
    ERROR STATE
    =========================================
  */

  if (error || !lesson) {

    return (
      <div className="lesson-player-page">

        <div className="lesson-player-error">

          <h2>
            {error ||
              "Lesson not found"}
          </h2>

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


  /*
    =========================================
    MAIN UI
    =========================================
  */

  return (
    <div className="lesson-player-page">


      {/* =====================================
          TOP NAVIGATION
      ===================================== */}

      <div className="lesson-player-topbar">

        <button
          className="lesson-back-button"
          onClick={() => {

            if (lesson.course?._id) {

              navigate(
                `/courses/${lesson.course._id}`
              );

            } else {

              navigate("/courses");

            }

          }}
        >
          ← Back to Course
        </button>


        <div className="lesson-course-name">
          {lesson.course?.title}
        </div>

      </div>


      {/* =====================================
          LESSON POSITION
      ===================================== */}

      <div className="lesson-position">

        <span>

          Lesson{" "}

          {currentLessonIndex >= 0
            ? currentLessonIndex + 1
            : lesson.order || 1}

          {" "}of{" "}

          {totalLessons || "—"}

        </span>

      </div>


      {/* =====================================
          MAIN LAYOUT
      ===================================== */}

      <div className="lesson-player-layout">


        {/* ===================================
            MAIN CONTENT
        =================================== */}

        <main className="lesson-main">


          {/* =================================
              VIDEO
          ================================= */}

          <div className="lesson-video-container">

            {lesson.videoUrl ? (

              <iframe
                src={getYouTubeEmbedUrl(
                  lesson.videoUrl
                )}
                title={lesson.title}
                className="lesson-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

            ) : (

              <div className="lesson-no-video">

                <div className="no-video-icon">
                  📖
                </div>

                <h3>
                  This lesson does not contain
                  a video.
                </h3>

                {lesson.resourceUrl && (

                  <a
                    href={lesson.resourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Learning Resource →
                  </a>

                )}

              </div>

            )}

          </div>


          {/* =================================
              LESSON INFORMATION
          ================================= */}

          <div className="lesson-information">

            <div className="lesson-heading">

              <span className="lesson-player-type">
                {lesson.type}
              </span>

              <h1>
                {lesson.title}
              </h1>

              {lesson.description && (

                <p>
                  {lesson.description}
                </p>

              )}

            </div>


            <div className="lesson-information-meta">

              <span>
                ⏱ {lesson.duration} minutes
              </span>

              <span>
                {lesson.isFree
                  ? "✓ Free Lesson"
                  : "Premium Lesson"}
              </span>

            </div>


            {/* =================================
                COMPLETION
            ================================= */}

            <div className="lesson-completion-box">

              <div>

                <strong>
                  {completed
                    ? "Lesson Completed ✓"
                    : "Ready to complete this lesson?"}
                </strong>

                <p>
                  Mark this lesson as completed
                  after finishing the content.
                </p>

              </div>


              <button
                className={
                  completed
                    ? "lesson-completed-button"
                    : "lesson-complete-button"
                }
                onClick={handleComplete}
                disabled={completed}
              >
                {completed
                  ? "Completed ✓"
                  : "Mark as Complete"}
              </button>

            </div>


            {/* =================================
                PREVIOUS / NEXT NAVIGATION
            ================================= */}

            <div className="lesson-navigation">


              {/* PREVIOUS */}

              <button
                className="lesson-navigation-button previous"
                onClick={
                  handlePreviousLesson
                }
                disabled={isFirstLesson}
              >

                <span className="navigation-arrow">
                  ←
                </span>

                <span>

                  <small>
                    Previous
                  </small>

                  <strong>
                    {isFirstLesson
                      ? "First Lesson"
                      : "Previous Lesson"}
                  </strong>

                </span>

              </button>


              {/* POSITION */}

              <div className="lesson-navigation-progress">

                <span>
                  {currentLessonIndex >= 0
                    ? currentLessonIndex + 1
                    : lesson.order || 1}

                  {" / "}

                  {totalLessons || "—"}

                </span>

              </div>


              {/* NEXT */}

              <button
                className="lesson-navigation-button next"
                onClick={
                  handleNextLesson
                }
                disabled={isLastLesson}
              >

                <span>

                  <small>
                    Next
                  </small>

                  <strong>
                    {isLastLesson
                      ? "Course Complete"
                      : "Next Lesson"}
                  </strong>

                </span>

                <span className="navigation-arrow">
                  →
                </span>

              </button>

            </div>

          </div>

        </main>


        {/* =====================================
            SIDEBAR
        ===================================== */}

        <aside className="lesson-sidebar">


          {/* =================================
              CURRENT LESSON CARD
          ================================= */}

          <div className="lesson-sidebar-card">

            <span className="sidebar-eyebrow">
              CURRENT LESSON
            </span>


            <div className="sidebar-lesson-number">

              {String(
                lesson.order || 1
              ).padStart(2, "0")}

            </div>


            <h3>
              {lesson.title}
            </h3>


            <div className="sidebar-divider" />


            <div className="sidebar-detail">

              <span>
                Course
              </span>

              <strong>
                {lesson.course?.title ||
                  "Course"}
              </strong>

            </div>


            <div className="sidebar-detail">

              <span>
                Skill
              </span>

              <strong>
                {lesson.course?.skill ||
                  "Learning"}
              </strong>

            </div>


            <div className="sidebar-detail">

              <span>
                Difficulty
              </span>

              <strong>
                {lesson.course?.difficulty ||
                  "Beginner"}
              </strong>

            </div>


            <div className="sidebar-detail">

              <span>
                Progress
              </span>

              <strong>
                {completed
                  ? "Completed ✓"
                  : "In Progress"}
              </strong>

            </div>


            <button
              className="view-course-button"
              onClick={() => {

                if (lesson.course?._id) {

                  navigate(
                    `/courses/${lesson.course._id}`
                  );

                }

              }}
            >
              View All Lessons →
            </button>

          </div>


          {/* =================================
              COURSE LESSON SUMMARY
          ================================= */}

          {courseLessons.length > 0 && (

            <div className="lesson-sidebar-card lesson-list-sidebar">

              <span className="sidebar-eyebrow">
                COURSE CONTENT
              </span>


              {/* COURSE PROGRESS */}

              <div className="sidebar-course-progress">

                <span>
                  Lesson{" "}
                  {currentLessonIndex + 1}
                  {" / "}
                  {totalLessons}
                </span>

                <strong>
                  {completedLessonCount}
                  {" / "}
                  {totalLessons}
                  {" completed"}
                </strong>

              </div>


              {/* LESSON LIST */}

              <div className="sidebar-mini-lessons">

                {courseLessons.map(
                  (courseLesson, index) => {

                    const isCurrent =
                      courseLesson._id === id;


                    const lessonProgress =
                      allLessonProgress[
                        courseLesson._id
                      ];


                    const isCompleted =
                      lessonProgress?.status ===
                      "Completed";


                    const isInProgress =
                      lessonProgress?.status ===
                      "In Progress";


                    return (

                      <button
                        key={
                          courseLesson._id
                        }
                        className={`sidebar-mini-lesson ${
                          isCurrent
                            ? "active"
                            : ""
                        } ${
                          isCompleted
                            ? "completed"
                            : ""
                        }`}
                        onClick={() =>
                          navigate(
                            `/lessons/${courseLesson._id}`
                          )
                        }
                      >


                        {/* STATUS ICON */}

                        <span className="mini-lesson-status">

                          {isCompleted
                            ? "✓"
                            : isCurrent
                            ? "▶"
                            : isInProgress
                            ? "●"
                            : String(
                                index + 1
                              ).padStart(2, "0")}

                        </span>


                        {/* LESSON TITLE */}

                        <span className="mini-lesson-title">

                          {courseLesson.title}

                        </span>


                        {/* CURRENT INDICATOR */}

                        {isCurrent && (

                          <span className="mini-current-label">
                            Current
                          </span>

                        )}

                      </button>

                    );

                  }
                )}

              </div>

            </div>

          )}

        </aside>

      </div>

    </div>
  );
};

export default LessonPlayer;
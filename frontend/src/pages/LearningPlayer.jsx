import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import resourceService from "../services/resourceService";
import progressService from "../services/progressService";
import { useAuth } from "../context/AuthContext";
import "../styles/LearningPlayer.css";

function getYouTubeEmbedUrl(url) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    // youtube.com/watch?v=VIDEO_ID
    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // youtube.com/embed/VIDEO_ID
      if (parsedUrl.pathname.startsWith("/embed/")) {
        return `https://www.youtube.com${parsedUrl.pathname}`;
      }
    }

    // youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.substring(1);

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function LearningPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [resource, setResource] = useState(null);
  const [learningProgress, setLearningProgress] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // FETCH RESOURCE
  // --------------------------------------------------

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await resourceService.getResourceById(id);

        setResource(data.resource);
      } catch (error) {
        console.error(
          "Failed to load learning resource:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load learning resource."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResource();
    }
  }, [id]);

  // --------------------------------------------------
  // FETCH PROGRESS
  // --------------------------------------------------

  useEffect(() => {
    const fetchProgress = async () => {
      if (!token || !id) return;

      try {
        const data =
          await progressService.getResourceProgress(
            id,
            token
          );

        setLearningProgress(data.progress || null);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error(
            "Failed to fetch learning progress:",
            error
          );
        }

        setLearningProgress(null);
      }
    };

    fetchProgress();
  }, [id, token]);

  // --------------------------------------------------
  // START LEARNING
  // --------------------------------------------------

  const handleStartLearning = async () => {
    if (!token) {
      alert("Please login to start learning.");
      return;
    }

    try {
      const data =
        await progressService.startLearning(
          id,
          token
        );

      setLearningProgress(data.progress);
    } catch (error) {
      console.error(
        "Start learning error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to start learning."
      );
    }
  };

  // --------------------------------------------------
  // UPDATE PROGRESS
  // --------------------------------------------------

  const handleProgressUpdate = async (value) => {
    if (!token) {
      alert("Please login to update progress.");
      return;
    }

    try {
      setUpdating(true);

      const data =
        await progressService.updateProgress(
          id,
          Number(value),
          token
        );

      setLearningProgress(data.progress);
    } catch (error) {
      console.error(
        "Progress update error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update progress."
      );
    } finally {
      setUpdating(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="learning-player-page">
        <div className="player-loading">
          <div className="player-loader"></div>
          <p>Preparing your learning workspace...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error || !resource) {
    return (
      <div className="learning-player-page">
        <div className="player-error">
          <div className="player-error-icon">
            ⚠️
          </div>

          <h2>Unable to open resource</h2>

          <p>
            {error ||
              "This learning resource could not be found."}
          </p>

          <button
            onClick={() =>
              navigate(`/resources/${id}`)
            }
          >
            ← Back to Resource
          </button>
        </div>
      </div>
    );
  }

  const currentProgress =
    learningProgress?.progress || 0;

  const learningStatus =
    learningProgress?.status || "Not Started";

  const youtubeEmbedUrl =
    getYouTubeEmbedUrl(resource.url);

  return (
    <div className="learning-player-page">

      {/* HEADER */}

      <header className="learning-player-header">

        <button
          className="player-back-button"
          onClick={() =>
            navigate(`/resources/${id}`)
          }
        >
          ← Back to Resource
        </button>

        <div className="player-header-content">

          <div>
            <span className="player-eyebrow">
              NOW LEARNING
            </span>

            <h1>{resource.title}</h1>

            <div className="player-meta">
              <span>{resource.platform}</span>
              <span>{resource.type}</span>
              <span>{resource.difficulty}</span>
            </div>
          </div>

          <div className="player-progress-summary">
            <strong>{currentProgress}%</strong>
            <span>Complete</span>
          </div>

        </div>
      </header>

      {/* MAIN */}

      <main className="learning-player-container">

        {/* PLAYER */}

        <section className="learning-player-card">

          <div className="player-wrapper">

            {youtubeEmbedUrl ? (
              <iframe
                src={`${youtubeEmbedUrl}?rel=0`}
                title={resource.title}
                className="learning-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="player-unavailable">

                <div className="unavailable-icon">
                  📚
                </div>

                <h2>
                  This resource is hosted externally
                </h2>

                <p>
                  SkillPath cannot embed this type of
                  resource directly, but you can continue
                  learning on the original platform.
                </p>

                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="open-resource-button"
                >
                  Open Original Resource →
                </a>

              </div>
            )}

          </div>

          {/* PLAYER INFO */}

          <div className="player-content">

            <div className="player-title-row">

              <div>
                <span className="player-label">
                  LEARNING RESOURCE
                </span>

                <h2>{resource.title}</h2>
              </div>

              <span
                className={`player-status ${
                  learningStatus
                    .toLowerCase()
                    .replace(" ", "-")
                }`}
              >
                {learningStatus}
              </span>

            </div>

            <p className="player-description">
              {resource.description}
            </p>

          </div>

        </section>

        {/* PROGRESS PANEL */}

        <section className="player-progress-card">

          <div className="progress-card-header">

            <div>
              <span className="player-label">
                YOUR PROGRESS
              </span>

              <h2>Keep going</h2>
            </div>

            <strong>
              {currentProgress}%
            </strong>

          </div>

          <div className="player-progress-track">

            <div
              className="player-progress-fill"
              style={{
                width: `${currentProgress}%`,
              }}
            ></div>

          </div>

          {!learningProgress ? (
            <button
              className="player-primary-button"
              onClick={handleStartLearning}
            >
              ▶ Start Learning
            </button>
          ) : learningStatus === "Completed" ? (
            <div className="player-completed">
              ✓ Learning completed
            </div>
          ) : (
            <div className="progress-controls">

              <label htmlFor="progress-slider">
                Update your progress
              </label>

              <input
                id="progress-slider"
                type="range"
                min="0"
                max="100"
                value={currentProgress}
                disabled={updating}
                onChange={(event) =>
                  handleProgressUpdate(
                    event.target.value
                  )
                }
              />

              <div className="progress-scale">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>

            </div>
          )}

        </section>

        {/* RESOURCE INFORMATION */}

        <section className="player-info-grid">

          <div className="player-info-card">

            <span>SKILL</span>

            <strong>
              {resource.skill || "General"}
            </strong>

          </div>

          <div className="player-info-card">

            <span>TYPE</span>

            <strong>
              {resource.type}
            </strong>

          </div>

          <div className="player-info-card">

            <span>PLATFORM</span>

            <strong>
              {resource.platform}
            </strong>

          </div>

          <div className="player-info-card">

            <span>DIFFICULTY</span>

            <strong>
              {resource.difficulty}
            </strong>

          </div>

        </section>

      </main>
    </div>
  );
}

export default LearningPlayer;
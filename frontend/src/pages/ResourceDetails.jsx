import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import resourceService from "../services/resourceService";
import wishlistService from "../services/wishlistService";
import progressService from "../services/progressService";
import { useAuth } from "../context/AuthContext";
import "../styles/ResourceDetails.css";

function ResourceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [learningProgress, setLearningProgress] = useState(null);

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
          "Failed to fetch resource:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load resource."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
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
        // 404 simply means the user has not started
        // learning this resource yet.
        if (error.response?.status !== 404) {
          console.error(
            "Failed to fetch progress:",
            error
          );
        }

        setLearningProgress(null);
      }
    };

    fetchProgress();
  }, [id, token]);

  // --------------------------------------------------
  // CHECK WISHLIST
  // --------------------------------------------------
  useEffect(() => {
    const checkWishlist = async () => {
      if (!token || !id) return;

      try {
        const data =
          await wishlistService.checkWishlist(
            id,
            token
          );

        setIsWishlisted(
          data.isWishlisted || false
        );
      } catch (error) {
        console.error(
          "Failed to check wishlist:",
          error
        );
      }
    };

    checkWishlist();
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

    navigate(`/learn/${id}`);
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
  // WISHLIST
  // --------------------------------------------------
  const handleWishlist = async () => {
    if (!token) {
      alert("Please login to use wishlist.");
      return;
    }

    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(
          id,
          token
        );

        setIsWishlisted(false);
      } else {
        await wishlistService.addToWishlist(
          id,
          token
        );

        setIsWishlisted(true);
      }
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update wishlist."
      );
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="resource-details-page">
        <div className="details-loading">
          <div className="details-loader"></div>
          <p>Loading resource...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------
  if (error || !resource) {
    return (
      <div className="resource-details-page">
        <div className="details-error">
          <div className="error-icon">⚠️</div>

          <h2>
            Resource not found
          </h2>

          <p>
            {error ||
              "This resource could not be found."}
          </p>

          <button
            onClick={() =>
              navigate("/resources")
            }
          >
            ← Back to Resources
          </button>
        </div>
      </div>
    );
  }

  const currentProgress =
    learningProgress?.progress || 0;

  const learningStatus =
    learningProgress?.status ||
    "Not Started";

  return (
    <div className="resource-details-page">

      {/* BACK BUTTON */}
      <button
        className="back-button"
        onClick={() =>
          navigate("/resources")
        }
      >
        ← Back to Resources
      </button>

      {/* MAIN CONTAINER */}
      <div className="resource-details-container">

        {/* HERO */}
        <section className="resource-details-hero">

          <div className="details-thumbnail">
            {resource.thumbnail ? (
              <img
                src={resource.thumbnail}
                alt={resource.title}
              />
            ) : (
              <div className="details-thumbnail-placeholder">
                🎓
              </div>
            )}
          </div>

          <div className="details-hero-content">

            <div className="details-badges">

              <span className="details-platform">
                {resource.platform}
              </span>

              {resource.isFree ? (
                <span className="details-free">
                  FREE
                </span>
              ) : (
                <span className="details-paid">
                  PAID
                </span>
              )}

            </div>

            <h1>
              {resource.title}
            </h1>

            <p className="details-description">
              {resource.description}
            </p>

            <div className="details-tags">

              {resource.skill && (
                <span>
                  {resource.skill}
                </span>
              )}

              {resource.difficulty && (
                <span>
                  {resource.difficulty}
                </span>
              )}

              {resource.type && (
                <span>
                  {resource.type}
                </span>
              )}

            </div>

          </div>

        </section>

        {/* CONTENT */}
        <div className="resource-details-content">

          {/* LEFT */}
          <main className="details-main">

            {/* ABOUT */}
            <section className="details-section">

              <h2>
                About this resource
              </h2>

              <p>
                {resource.description}
              </p>

            </section>

            {/* RESOURCE INFORMATION */}
            <section className="details-section">

              <h2>
                Resource Information
              </h2>

              <div className="info-grid">

                <div className="info-item">
                  <span>
                    Platform
                  </span>

                  <strong>
                    {resource.platform}
                  </strong>
                </div>

                <div className="info-item">
                  <span>
                    Type
                  </span>

                  <strong>
                    {resource.type}
                  </strong>
                </div>

                <div className="info-item">
                  <span>
                    Skill
                  </span>

                  <strong>
                    {resource.skill}
                  </strong>
                </div>

                <div className="info-item">
                  <span>
                    Difficulty
                  </span>

                  <strong>
                    {resource.difficulty}
                  </strong>
                </div>

              </div>

            </section>

            {/* LEARNING PROGRESS */}
            <section className="details-section">

              <div className="progress-title">

                <h2>
                  Learning Progress
                </h2>

                <strong>
                  {currentProgress}%
                </strong>

              </div>

              <div className="details-progress-bar">

                <div
                  className="details-progress-fill"
                  style={{
                    width:
                      `${currentProgress}%`
                  }}
                ></div>

              </div>

              <p className="details-progress-status">

                {learningStatus ===
                "Completed" ? (
                  <span className="status-completed">
                    ✓ Completed
                  </span>
                ) : learningStatus ===
                  "In Progress" ? (
                  <span className="status-progress">
                    ● In Progress
                  </span>
                ) : (
                  <span className="status-not-started">
                    ○ Not Started
                  </span>
                )}

              </p>

            </section>

          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="details-sidebar">

            <div className="action-card">

              <h3>
                Start Learning
              </h3>

              <p>
                Begin learning this resource
                and track your progress on
                SkillPath.
              </p>

              {!learningProgress ? (
                <button
                  className="primary-action"
                  onClick={
                    handleStartLearning
                  }
                >
                  ▶ Start Learning
                </button>
              ) : learningStatus ===
                "Completed" ? (
                <button
                  className="primary-action completed-action"
                  disabled
                >
                  ✓ Completed
                </button>
              ) : (
                <button
                  className="primary-action"
                  onClick={
                    handleStartLearning
                  }
                >
                  ▶ Continue Learning
                </button>
              )}

              <button
                className={`secondary-action ${
                  isWishlisted
                    ? "wishlist-active"
                    : ""
                }`}
                onClick={
                  handleWishlist
                }
              >
                {isWishlisted
                  ? "♥ Saved to Wishlist"
                  : "♡ Save to Wishlist"}
              </button>

              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="external-action"
              >
                Open Original Resource →
              </a>

            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}

export default ResourceDetails;
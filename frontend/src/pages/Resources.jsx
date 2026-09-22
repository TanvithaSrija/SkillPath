import { useEffect, useState } from "react";
import resourceService from "../services/resourceService";
import wishlistService from "../services/wishlistService";
import progressService from "../services/progressService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Resources.css";

function Resources() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState([]);
const [recommendationsLoading, setRecommendationsLoading] =
  useState(true);
const [recommendationsError, setRecommendationsError] =
  useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isFree, setIsFree] = useState("");
  const [type, setType] = useState("");
  const [platform, setPlatform] = useState("");

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [progressLoading, setProgressLoading] = useState(true);
  const fetchRecommendations = async () => {
  if (!token) {
    setRecommendations([]);
    setRecommendationsLoading(false);
    return;
  }

  try {
    setRecommendationsLoading(true);
    setRecommendationsError("");

    const data =
      await resourceService.getRecommendedResources(
        token
      );

    setRecommendations(
      data.recommendations || []
    );
  } catch (error) {
    console.error(
      "Failed to fetch recommendations:",
      error
    );

    setRecommendationsError(
      "Unable to load recommendations."
    );
  } finally {
    setRecommendationsLoading(false);
  }
};
const fetchProgress = async () => {
  if (!token) {
    setProgressData({});
    setProgressLoading(false);
    return;
  }

  try {
    setProgressLoading(true);

    const data =
      await progressService.getMyProgress(token);

    const progressMap = {};

    (data.progress || []).forEach((item) => {
      if (item.resource?._id) {
        progressMap[item.resource._id] = item;
      }
    });

    setProgressData(progressMap);
  } catch (error) {
    console.error(
      "Failed to fetch learning progress:",
      error
    );
  } finally {
    setProgressLoading(false);
  }
};
  // --------------------------------------------------
  // FETCH RESOURCES
  // --------------------------------------------------
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (skill) {
        params.skill = skill;
      }

      if (difficulty) {
        params.difficulty = difficulty;
      }

      if (isFree !== "") {
        params.isFree = isFree;
      }

      if (type) {
        params.type = type;
      }
      if (platform) {
        params.platform = platform;
      }

      const data = await resourceService.getResources(params);

      setResources(data.resources || []);
    } catch (err) {
      console.error("Failed to fetch resources:", err);

      setError("Unable to load learning resources.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------
  useEffect(() => {
    fetchResources();
  }, []);
  useEffect(() => {
    fetchRecommendations();
  }, [token]);
  useEffect(() => {
  fetchProgress();
}, [token]);
  // --------------------------------------------------
  // SEARCH + FILTER DEBOUNCE
  // --------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResources();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, skill, difficulty, isFree, type, platform]);

  // --------------------------------------------------
  // WISHLIST HANDLER
  // --------------------------------------------------
  const handleWishlist = async (resourceId) => {
    if (!token) {
      alert("Please login to use wishlist.");
      return;
    }

    try {
      if (wishlistIds.includes(resourceId)) {
        await wishlistService.removeFromWishlist(
          resourceId,
          token
        );

        setWishlistIds((prev) =>
          prev.filter((id) => id !== resourceId)
        );
      } else {
        await wishlistService.addToWishlist(
          resourceId,
          token
        );

        setWishlistIds((prev) => [
          ...prev,
          resourceId,
        ]);
      }
    } catch (error) {
      console.error("Wishlist error:", error);

      if (error.response?.status === 409) {
        setWishlistIds((prev) => {
          if (prev.includes(resourceId)) {
            return prev;
          }

          return [...prev, resourceId];
        });
      } else {
        alert(
          error.response?.data?.message ||
            "Unable to update wishlist."
        );
      }
    }
  };

  // --------------------------------------------------
  // RESET FILTERS
  // --------------------------------------------------
  const clearFilters = () => {
    setSearch("");
    setSkill("");
    setDifficulty("");
    setIsFree("");
    setType("");
    setPlatform("");
  };

  // --------------------------------------------------
  // RESOURCE TYPE ICON
  // --------------------------------------------------
  const getTypeIcon = (resourceType) => {
    switch (resourceType) {
      case "Video":
        return "🎥";

      case "Practice":
        return "💻";

      case "Project":
        return "🚀";

      case "Course":
        return "🎓";

      case "Tutorial":
        return "📘";

      case "Documentation":
        return "📚";

      case "Article":
        return "📝";

      case "Book":
        return "📖";

      default:
        return "📚";
    }
  };
  const handleStartLearning = async (resourceId) => {
  if (!token) {
    alert("Please login to start learning.");
    return;
  }

  try {
    const data =
      await progressService.startLearning(
        resourceId,
        token
      );

    setProgressData((prev) => ({
      ...prev,
      [resourceId]: data.progress,
    }));
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
const handleUpdateProgress = async (
  resourceId,
  newProgress
) => {
  if (!token) {
    alert("Please login to update progress.");
    return;
  }

  try {
    const data =
      await progressService.updateProgress(
        resourceId,
        newProgress,
        token
      );

    setProgressData((prev) => ({
      ...prev,
      [resourceId]: data.progress,
    }));
  } catch (error) {
    console.error(
      "Update progress error:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Unable to update progress."
    );
  }
};

  return (
    <div className="resources-page">

      {/* ==================================================
          HERO SECTION
      ================================================== */}
      <section className="resources-hero">
        <div>
          <span className="hero-badge">
            SKILLPATH LEARNING HUB
          </span>

          <h1>
            Discover resources that
            <span> move your career forward.</span>
          </h1>

          <p>
            Explore carefully selected courses, tutorials,
            practice platforms, projects and learning
            materials to build the skills you need.
          </p>
        </div>
      </section>

      {/* ==================================================
          SEARCH + FILTERS
      ================================================== */}
      <section className="resource-controls">

        {/* Search */}
        <div className="search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search courses, skills, resources..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* Filters */}
        <div className="filters">

          {/* Skill */}
          <select
            value={skill}
            onChange={(e) =>
              setSkill(e.target.value)
            }
          >
            <option value="">
              All Skills
            </option>

            <option value="Java">
              Java
            </option>

            <option value="Python">
              Python
            </option>

            <option value="JavaScript">
              JavaScript
            </option>

            <option value="SQL">
              SQL
            </option>

            <option value="React">
              React
            </option>

            <option value="DSA">
              DSA
            </option>

            <option value="MongoDB">
              MongoDB
            </option>

            <option value="Git">
              Git
            </option>

            <option value="GitHub">
              GitHub
            </option>

            <option value="Spring Boot">
              Spring Boot
            </option>

            <option value="REST API">
              REST API
            </option>

            <option value="API Testing">
              API Testing
            </option>

            <option value="AWS">
              AWS
            </option>

            <option value="Azure">
              Azure
            </option>

            <option value="Docker">
              Docker
            </option>

            <option value="Kubernetes">
              Kubernetes
            </option>

            <option value="CI/CD">
              CI/CD
            </option>

            <option value="System Design">
              System Design
            </option>

            <option value="Software Testing">
              Software Testing
            </option>

            <option value="Cybersecurity">
              Cybersecurity
            </option>

            <option value="Pandas">
              Pandas
            </option>

            <option value="NumPy">
              NumPy
            </option>

            <option value="Machine Learning">
              Machine Learning
            </option>

            <option value="Interview Preparation">
              Interview Preparation
            </option>
          </select>

          {/* Difficulty */}
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
          >
            <option value="">
              All Levels
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

          {/* Free / Paid */}
          <select
            value={isFree}
            onChange={(e) =>
              setIsFree(e.target.value)
            }
          >
            <option value="">
              All Resources
            </option>

            <option value="true">
              Free
            </option>

            <option value="false">
              Paid
            </option>
          </select>

          {/* Resource Type */}
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >
            <option value="">
              All Types
            </option>

            <option value="Course">
              Course
            </option>

            <option value="Video">
              Video
            </option>

            <option value="Tutorial">
              Tutorial
            </option>

            <option value="Practice">
              Practice
            </option>

            <option value="Project">
              Project
            </option>

            <option value="Documentation">
              Documentation
            </option>

            <option value="Article">
              Article
            </option>

            <option value="Book">
              Book
            </option>
          </select>
          <select
        value={platform}
        onChange={(e) =>
          setPlatform(e.target.value)
        }
>
    <option value="">
      All Platforms
    </option>

    <option value="YouTube">
      YouTube
    </option>

    <option value="Udemy">
      Udemy
    </option>

    <option value="LeetCode">
      LeetCode
    </option>

    <option value="HackerRank">
      HackerRank
    </option>

    <option value="GeeksforGeeks">
      GeeksforGeeks
    </option>

    <option value="MDN">
      MDN
    </option>

    <option value="Oracle">
      Oracle
    </option>

    <option value="Python">
      Python
    </option>

    <option value="React">
      React
    </option>

    <option value="MongoDB">
      MongoDB
    </option>

    <option value="Git">
      Git
    </option>

    <option value="GitHub">
      GitHub
    </option>

    <option value="AWS">
      AWS
    </option>

    <option value="Microsoft Azure">
      Microsoft Azure
    </option>

    <option value="Google Cloud">
      Google Cloud
    </option>

    <option value="Postman">
      Postman
    </option>

    <option value="Docker">
      Docker
    </option>

    <option value="Kubernetes">
      Kubernetes
    </option>

    <option value="OWASP">
      OWASP
    </option>

    <option value="JUnit">
      JUnit
    </option>
  </select>

          {/* Clear Filters */}
          {(search ||
            skill ||
            difficulty ||
            isFree ||
            type||platform) && (
            <button
              className="clear-filter-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>
      {/* ==================================================
    PERSONALIZED RECOMMENDATIONS
================================================== */}

{token && (
  <section className="recommendations-section">

    <div className="recommendations-header">

      <div>
        <span className="recommendation-badge">
          PERSONALIZED FOR YOU
        </span>

        <h2>
          🎯 Recommended for You
        </h2>

        <p>
          Learning resources selected based on
          your career goals and preferences.
        </p>
      </div>

    </div>

    {recommendationsLoading && (
      <div className="recommendation-loading">
        <div className="loader"></div>

        <p>
          Finding resources that match your
          learning goals...
        </p>
      </div>
    )}

    {!recommendationsLoading &&
      recommendationsError && (
        <div className="recommendation-error">
          <p>
            {recommendationsError}
          </p>
        </div>
      )}

    {!recommendationsLoading &&
      !recommendationsError &&
      recommendations.length === 0 && (
        <div className="recommendation-empty">

          <span>🎯</span>

          <h3>
            Complete your profile
          </h3>

          <p>
            Add your career goal, preferred
            language and experience level to
            receive personalized recommendations.
          </p>

        </div>
      )}

    {!recommendationsLoading &&
      !recommendationsError &&
      recommendations.length > 0 && (

        <div className="recommendations-grid">

          {recommendations.map(
            ({ resource, matchScore, reasons }) => (

              <article
                className="recommendation-card"
                key={resource._id}
              >

                <div className="recommendation-card-top">

                  <span className="match-score">
                    ⭐ {matchScore}% Match
                  </span>

                  {resource.isFree ? (
                    <span className="free-badge">
                      FREE
                    </span>
                  ) : (
                    <span className="paid-badge">
                      PAID
                    </span>
                  )}

                </div>

                <div className="recommendation-icon">
                  {resource.type === "Video"
                    ? "🎥"
                    : resource.type === "Practice"
                    ? "💻"
                    : resource.type === "Project"
                    ? "🚀"
                    : resource.type === "Course"
                    ? "🎓"
                    : "📚"}
                </div>

                <h3>
                  {resource.title}
                </h3>

                <p className="recommendation-description">
                  {resource.description}
                </p>

                <div className="recommendation-tags">

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

                {reasons &&
                  reasons.length > 0 && (
                    <div className="recommendation-reason">

                      <strong>
                        Why this is recommended
                      </strong>

                      <p>
                        {reasons[0]}
                      </p>

                    </div>
                  )}

                <div className="recommendation-footer">

                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="open-button"
                  >
                    Open Resource →
                  </a>

                  <button
                    className="save-button"
                    onClick={() =>
                      handleWishlist(
                        resource._id
                      )
                    }
                  >
                    ♡ Save
                  </button>

                </div>

              </article>

            )
          )}

        </div>

      )}

  </section>
)}

      {/* ==================================================
          RESOURCE SECTION
      ================================================== */}
      <section className="resources-section">

        {/* Heading */}
        <div className="section-heading">
          <div>
            <h2>
              Learning Resources
            </h2>

            <p>
              {resources.length} resource
              {resources.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>
        </div>

        {/* ==================================================
            LOADING
        ================================================== */}
        {loading && (
          <div className="resource-message">

            <div className="loader"></div>

            <p>
              Finding the best resources
              for you...
            </p>

          </div>
        )}

        {/* ==================================================
            ERROR
        ================================================== */}
        {!loading && error && (
          <div className="resource-message error">

            <h3>
              Something went wrong
            </h3>

            <p>
              {error}
            </p>

            <button
              onClick={fetchResources}
            >
              Try Again
            </button>

          </div>
        )}

        {/* ==================================================
            EMPTY STATE
        ================================================== */}
        {!loading &&
          !error &&
          resources.length === 0 && (
            <div className="resource-message">

              <div className="empty-icon">
                📚
              </div>

              <h3>
                No resources found
              </h3>

              <p>
                Try changing your search
                or filters.
              </p>

              <button
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>
          )}

        {/* ==================================================
            RESOURCE CARDS
        ================================================== */}
        {!loading &&
          !error &&
          resources.length > 0 && (
            <div className="resources-grid">

              {resources.map((resource) => {

                const isWishlisted =
                  wishlistIds.includes(
                    resource._id
                  );
                  const learningProgress =
                    progressData[resource._id];

                  const currentProgress =
                    learningProgress?.progress || 0;

                  const learningStatus =
                    learningProgress?.status || "Not Started";

                return (
                  <article
                    className="resource-card"
                    key={resource._id}
                  >

                    {/* ======================================
                        THUMBNAIL
                    ====================================== */}
                    <div className="resource-thumbnail">

                      {resource.thumbnail ? (
                        <img
                          src={
                            resource.thumbnail
                          }
                          alt={
                            resource.title
                          }
                        />
                      ) : (
                        <div className="thumbnail-placeholder">
                          {getTypeIcon(
                            resource.type
                          )}
                        </div>
                      )}

                      {/* Wishlist */}
                      <button
                        className={`wishlist-button ${
                          isWishlisted
                            ? "wishlisted"
                            : ""
                        }`}
                        onClick={() =>
                          handleWishlist(
                            resource._id
                          )
                        }
                        title={
                          isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        {isWishlisted
                          ? "♥"
                          : "♡"}
                      </button>

                    </div>

                    {/* ======================================
                        CONTENT
                    ====================================== */}
                    <div className="resource-content">

                      {/* Badges */}
                      <div className="resource-meta">

                        <span className="platform-badge">
                          {resource.platform}
                        </span>

                        {resource.isFree ? (
                          <span className="free-badge">
                            FREE
                          </span>
                        ) : (
                          <span className="paid-badge">
                            PAID
                          </span>
                        )}

                      </div>

                      {/* Title */}
                      <h3>
                        {resource.title}
                      </h3>

                      {/* Description */}
                      <p className="resource-description">
                        {resource.description}
                      </p>
                      {/* Learning Progress */}

<div className="learning-progress">

  <div className="progress-header">

    <span>
      Learning Progress
    </span>

    <strong>
      {currentProgress}%
    </strong>

  </div>

  <div className="progress-bar">
    <div
      className="progress-bar-fill"
      style={{
        width: `${currentProgress}%`,
      }}
    ></div>
  </div>

  <div className="progress-status">

    {learningStatus === "Completed" ? (
      <span className="completed-status">
        ✓ Completed
      </span>
    ) : learningStatus === "In Progress" ? (
      <span className="in-progress-status">
        ● In Progress
      </span>
    ) : (
      <span className="not-started-status">
        ○ Not Started
      </span>
    )}

  </div>

</div>

                      {/* Tags */}
                      <div className="resource-tags">

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
                            {getTypeIcon(
                              resource.type
                            )}{" "}
                            {resource.type}
                          </span>
                        )}

                      </div>

                      {/* Footer */}
                      <div className="resource-footer">

                        {/* VIEW DETAILS */}
                        <button
                          className="details-button"
                          onClick={() =>
                            navigate(`/resources/${resource._id}`)
                          }
                        >
                          View Details →
                        </button>

                        {/* LEARNING */}
                        {!learningProgress ? (
                          <button
                            className="learning-button"
                            onClick={() =>
                              handleStartLearning(resource._id)
                            }
                          >
                            ▶ Start Learning
                          </button>
                        ) : learningStatus === "Completed" ? (
                          <button
                            className="learning-button completed"
                            disabled
                          >
                            ✓ Completed
                          </button>
                        ) : (
                          <button
                            className="learning-button"
                            onClick={() =>
                              handleUpdateProgress(
                                resource._id,
                                Math.min(currentProgress + 10, 100)
                              )
                            }
                          >
                            ▶ Continue Learning
                          </button>
                        )}

                        {/* SAVE */}
                        <button
                          className={`save-button ${
                            isWishlisted ? "saved" : ""
                          }`}
                          onClick={() =>
                            handleWishlist(resource._id)
                          }
                        >
                          {isWishlisted
                            ? "♥ Saved"
                            : "♡ Save"}
                        </button>

                        {/* OPEN ORIGINAL RESOURCE */}
                        <a
                          className="open-button"
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open Resource →
                        </a>

                      </div>

                    </div>
                  </article>
                );
              })}

            </div>
          )}

      </section>
    </div>
  );
}

export default Resources;
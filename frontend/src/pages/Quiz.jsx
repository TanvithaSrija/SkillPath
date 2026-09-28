import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import quizService from "../services/quizService";

import "../styles/Quiz.css";

function Quiz() {
    const { skillId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [timeLeft, setTimeLeft] = useState(null);

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                setLoading(true);

                const data =
                    await quizService.getQuizBySkill(
                        skillId,
                        token
                    );

                setQuiz(data.quiz);

                setTimeLeft(
                    (data.quiz.timeLimit || 10) * 60
                );
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load quiz"
                );
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            loadQuiz();
        }
    }, [skillId, token]);

    useEffect(() => {
        if (
            timeLeft === null ||
            timeLeft <= 0 ||
            result
        ) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((previous) =>
                previous > 0
                    ? previous - 1
                    : 0
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, result]);

    useEffect(() => {
        if (
            timeLeft === 0 &&
            quiz &&
            !result &&
            !submitting
        ) {
            handleSubmit(true);
        }
    }, [timeLeft]);

    const handleAnswer = (questionId, answer) => {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: answer,
        }));
    };

    const handleSubmit = async (
        automatic = false
    ) => {
        if (submitting || result) return;

        const unanswered = quiz.questions.filter(
            (question) =>
                answers[question._id] === undefined
        );

        if (
            unanswered.length > 0 &&
            !automatic
        ) {
            const shouldSubmit =
                window.confirm(
                    `You have ${unanswered.length} unanswered question(s). Submit anyway?`
                );

            if (!shouldSubmit) {
                return;
            }
        }

        try {
            setSubmitting(true);

            const formattedAnswers =
                Object.entries(answers).map(
                    ([questionId, answer]) => ({
                        questionId,
                        answer,
                    })
                );

            const data =
                await quizService.submitQuiz(
                    {
                        skillId,
                        answers: formattedAnswers,
                    },
                    token
                );

            setResult(data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to submit quiz"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;

        return `${String(minutes).padStart(
            2,
            "0"
        )}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="quiz-page">
                <p>Loading quiz...</p>
            </div>
        );
    }

    if (error && !quiz) {
        return (
            <div className="quiz-page">
                <div className="quiz-error">
                    {error}
                </div>

                <Link to="/progress">
                    ← Back to Progress
                </Link>
            </div>
        );
    }

    if (!quiz) {
        return null;
    }

    if (result) {
        return (
            <div className="quiz-page">

                <div className="quiz-result-card">

                    <div
                        className={`result-icon ${
                            result.passed
                                ? "passed"
                                : "failed"
                        }`}
                    >
                        {result.passed
                            ? "✓"
                            : "!"}
                    </div>

                    <h1>
                        {result.passed
                            ? "Quiz Passed!"
                            : "Quiz Not Passed"}
                    </h1>

                    <p>
                        {result.message}
                    </p>

                    <div className="score-display">
                        <strong>
                            {result.score}
                        </strong>

                        <span>
                            / {result.totalQuestions}
                        </span>
                    </div>

                    <div className="percentage-display">
                        {result.percentage}%
                    </div>

                    <div className="result-details">

                        <div>
                            <span>
                                Passing Marks
                            </span>

                            <strong>
                                {result.passingMarks}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Status
                            </span>

                            <strong>
                                {result.verified
                                    ? "Verified"
                                    : "In Progress"}
                            </strong>
                        </div>

                    </div>

                    <div className="result-actions">

                        {result.passed ? (
                            <button
                                onClick={() =>
                                    navigate(
                                        "/progress"
                                    )
                                }
                            >
                                View Progress
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setResult(null);
                                    setAnswers({});
                                    setCurrentQuestion(0);
                                    setTimeLeft(
                                        quiz.timeLimit *
                                            60
                                    );
                                }}
                            >
                                Retake Quiz
                            </button>
                        )}

                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                    </div>

                </div>

            </div>
        );
    }

    const question =
        quiz.questions[currentQuestion];

    return (
        <div className="quiz-page">

            <div className="quiz-header">

                <Link
                    to="/progress"
                    className="quiz-back"
                >
                    ← Back to Progress
                </Link>

                <div>
                    <h1>
                        {quiz.skillId} Quiz
                    </h1>

                    <p>
                        Answer all questions and
                        submit before the timer ends.
                    </p>
                </div>

                <div className="quiz-timer">
                    ⏱ {formatTime(timeLeft)}
                </div>

            </div>

            {error && (
                <div className="quiz-error">
                    {error}
                </div>
            )}

            <div className="quiz-progress-info">

                <span>
                    Question{" "}
                    {currentQuestion + 1}
                    {" "}
                    of{" "}
                    {quiz.questions.length}
                </span>

                <span>
                    {
                        Object.keys(answers).length
                    } answered
                </span>

            </div>

            <div className="quiz-progress-track">
                <div
                    className="quiz-progress-fill"
                    style={{
                        width:
                            `${
                                ((currentQuestion + 1) /
                                    quiz.questions.length) *
                                100
                            }%`,
                    }}
                />
            </div>

            <div className="question-card">

                <div className="question-number">
                    Question {currentQuestion + 1}
                </div>

                <h2>
                    {question.question}
                </h2>

                <div className="question-options">

                    {question.options.map(
                        (option, index) => {

                            const selected =
                                Number(
                                    answers[
                                        question._id
                                    ]
                                ) === index;

                            return (
                                <button
                                    key={index}
                                    className={`option-button ${
                                        selected
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleAnswer(
                                            question._id,
                                            index
                                        )
                                    }
                                >
                                    <span>
                                        {String.fromCharCode(
                                            65 + index
                                        )}
                                    </span>

                                    {option}
                                </button>
                            );
                        }
                    )}

                </div>

            </div>

            <div className="quiz-navigation">

                <button
                    disabled={
                        currentQuestion === 0
                    }
                    onClick={() =>
                        setCurrentQuestion(
                            (previous) =>
                                previous - 1
                        )
                    }
                >
                    ← Previous
                </button>

                {currentQuestion <
                quiz.questions.length - 1 ? (
                    <button
                        onClick={() =>
                            setCurrentQuestion(
                                (previous) =>
                                    previous + 1
                            )
                        }
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        className="submit-quiz-button"
                        disabled={submitting}
                        onClick={() =>
                            handleSubmit(false)
                        }
                    >
                        {submitting
                            ? "Submitting..."
                            : "Submit Quiz"}
                    </button>
                )}

            </div>

        </div>
    );
}

export default Quiz;
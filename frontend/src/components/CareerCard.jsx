function CareerCard({ career, onSelect }) {
    return (
        <div className="career-card">
            <div className="career-icon">
                {career.icon}
            </div>

            <h2>{career.title}</h2>

            <p>{career.description}</p>

            <div className="career-info">
                <span>{career.difficulty}</span>
                <span>{career.estimatedDuration}</span>
            </div>

            <button onClick={() => onSelect(career)}>
                View Roadmap
            </button>
        </div>
    );
}

export default CareerCard;
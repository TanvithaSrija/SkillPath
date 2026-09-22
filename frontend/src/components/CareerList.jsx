import CareerCard from "./CareerCard";

function CareerList({ careers, onSelect }) {
    if (careers.length === 0) {
        return <p>No career goals found.</p>;
    }

    return (
        <div className="career-list">
            {careers.map((career) => (
                <CareerCard
                    key={career._id}
                    career={career}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}

export default CareerList;
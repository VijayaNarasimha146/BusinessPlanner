import React from 'react';

const PlannerHeader = ({ onAddMonth }) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    return (
        <div className="planner-header">
            <h1>Planner Header</h1>
            <p>{formattedDate}</p>
            <button onClick={onAddMonth}>
                <span>+</span> Add Month
            </button>
        </div>
    );
};

export default PlannerHeader;
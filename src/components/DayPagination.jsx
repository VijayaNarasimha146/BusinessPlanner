import React from 'react';
import PropTypes from 'prop-types';

const DayPagination = ({ currentDay, onDayChange }) => {
    const handlePrevDay = () => {
        const prevDay = new Date(currentDay);
        prevDay.setDate(prevDay.getDate() - 1);
        onDayChange(prevDay);
    };

    const handleNextDay = () => {
        const nextDay = new Date(currentDay);
        nextDay.setDate(nextDay.getDate() + 1);
        onDayChange(nextDay);
    };

    return (
        <div className="day-pagination">
            <button onClick={handlePrevDay}>Previous Day</button>
            <span>{currentDay.toISOString().split('T')[0]}</span>
            <button onClick={handleNextDay}>Next Day</button>
        </div>
    );
};

DayPagination.propTypes = {
    currentDay: PropTypes.instanceOf(Date).isRequired,
    onDayChange: PropTypes.func.isRequired,
};

export default DayPagination;
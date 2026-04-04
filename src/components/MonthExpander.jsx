import React, { useState } from 'react';

const MonthExpander = () => {
    const [expandedMonth, setExpandedMonth] = useState(null);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const toggleMonth = (index) => {
        setExpandedMonth(expandedMonth === index ? null : index);
    };

    return (
        <div>
            <h2>Expandable Months</h2>
            <ul>
                {months.map((month, index) => (
                    <li key={index}>
                        <button onClick={() => toggleMonth(index)}>{month}</button>
                        {expandedMonth === index && <div>{`Details for ${month}`}</div>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MonthExpander;
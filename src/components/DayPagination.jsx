const DayPagination = ({ days, activeDay, onSelectDay }) => {
  return (
    <div className="pagination">
      {days.map(day => (
        <button
          key={day.id}
          className={`pagination-button${activeDay === day.id ? " active" : ""}`}
          onClick={() => onSelectDay(day.id)}
        >
          <span className="pagination-day">{day.shortDay}</span>
          <strong>{day.dateLabel}</strong>
        </button>
      ))}
    </div>
  );
};

export default DayPagination;

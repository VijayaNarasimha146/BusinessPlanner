const PlannedMonthsOverview = ({ months, activeMonthId, onSelectMonth }) => {
  if (months.length === 0) {
    return null;
  }

  return (
    <section className="planned-months card">
      <div className="section-heading">
        <div>
          <p className="section-label">Planned Months</p>
          <h3>Month Summary</h3>
        </div>
        <span className="muted-meta">{months.length} planned</span>
      </div>

      <div className="planned-months-list">
        {months.map(month => (
          <button
            key={month.id}
            className={`month-summary-chip${activeMonthId === month.id ? " active" : ""}`}
            onClick={() => onSelectMonth(month.id)}
          >
            {month.month}
          </button>
        ))}
      </div>
    </section>
  );
};

export default PlannedMonthsOverview;

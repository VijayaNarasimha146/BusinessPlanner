import WeekList from "./WeekList";

const MonthItem = ({
  month,
  isActive,
  onClick,
  onAddTask,
  onDeleteTask,
  onCompleteTask,
  defaultDayId
}) => {
  return (
    <section className={`card month-card${isActive ? " active" : ""}`}>
      <button className="card-header" onClick={onClick}>
        <div>
          <p className="section-label">Planning Month</p>
          <h2>
            {month.month} {month.year}
          </h2>
        </div>
        <span className="card-pill">{month.weeks.length} weeks</span>
      </button>

      {isActive && (
        <WeekList
          monthId={month.id}
          weeks={month.weeks}
          onAddTask={onAddTask}
          onDeleteTask={onDeleteTask}
          onCompleteTask={onCompleteTask}
          initialDayId={defaultDayId}
        />
      )}
    </section>
  );
};

export default MonthItem;

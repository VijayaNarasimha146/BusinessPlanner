import MonthItem from "./MonthItem";

const MonthList = ({
  months,
  activeMonthId,
  setActiveMonthId,
  onAddTask,
  onDeleteTask,
  onCompleteTask,
  todayMonthId,
  todayDayId,
  isLoading
}) => {
  if (isLoading) {
    return (
      <section className="empty-state card">
        <span className="empty-state-badge">Loading</span>
        <h2>Preparing your planner</h2>
        <p>Loading saved months, weeks, and tasks from the local planner database.</p>
      </section>
    );
  }

  if (months.length === 0) {
    return (
      <section className="empty-state card">
        <span className="empty-state-badge">Ready to plan</span>
        <h2>No months added yet</h2>
        <p>
          Start by adding a month to create a structured view for weekly planning
          and task tracking.
        </p>
      </section>
    );
  }

  return (
    <section className="month-list">
      {months.map(month => (
        <MonthItem
          key={month.id}
          month={month}
          isActive={month.id === activeMonthId}
          onClick={() => setActiveMonthId(month.id)}
          onAddTask={onAddTask}
          onDeleteTask={onDeleteTask}
          onCompleteTask={onCompleteTask}
          defaultDayId={
            month.id === todayMonthId
              ? todayDayId
              : month.weeks[0]?.days[0]?.id ?? null
          }
        />
      ))}
    </section>
  );
};

export default MonthList;

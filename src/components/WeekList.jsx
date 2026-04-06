import { useEffect, useState } from "react";
import DayPagination from "./DayPagination";
import DayPage from "./DayPage";

const findWeekByDay = (weeks, dayId) =>
  weeks.find(week => week.days.some(day => day.id === dayId)) ?? weeks[0];

const getInitialDayId = (weeks, preferredDayId) => {
  if (preferredDayId && weeks.some(week => week.days.some(day => day.id === preferredDayId))) {
    return preferredDayId;
  }

  return weeks[0]?.days[0]?.id ?? null;
};

const WeekList = ({
  monthId,
  weeks,
  onAddTask,
  onDeleteTask,
  onCompleteTask,
  initialDayId
}) => {
  const [activeWeek, setActiveWeek] = useState(
    findWeekByDay(weeks, initialDayId)?.id ?? weeks[0]?.id ?? null
  );
  const [activeDay, setActiveDay] = useState(getInitialDayId(weeks, initialDayId));

  const selectedWeek = weeks.find(week => week.id === activeWeek) ?? weeks[0];
  const selectedDay =
    selectedWeek?.days.find(day => day.id === activeDay) ?? selectedWeek?.days[0];

  useEffect(() => {
    setActiveWeek(findWeekByDay(weeks, initialDayId)?.id ?? weeks[0]?.id ?? null);
    setActiveDay(getInitialDayId(weeks, initialDayId));
  }, [initialDayId, weeks]);

  useEffect(() => {
    setActiveDay(currentDay => {
      if (selectedWeek?.days.some(day => day.id === currentDay)) {
        return currentDay;
      }

      return selectedWeek?.days[0]?.id ?? null;
    });
  }, [selectedWeek]);

  if (!selectedWeek || !selectedDay) {
    return null;
  }

  return (
    <div className="week-panel">
      <div className="week-selector">
        {weeks.map(week => (
          <button
            key={week.id}
            className={`week-chip${activeWeek === week.id ? " active" : ""}`}
            onClick={() => setActiveWeek(week.id)}
          >
            <span>Week {week.order}</span>
            <small>{week.rangeLabel}</small>
          </button>
        ))}
      </div>

      <div className="week-content card-subsection">
        <div className="section-heading">
          <div>
            <p className="section-label">Weekly Focus</p>
            <h3>Week {selectedWeek.order}</h3>
          </div>
          <span className="muted-meta">{selectedWeek.rangeLabel}</span>
        </div>

        <DayPagination
          days={selectedWeek.days}
          activeDay={selectedDay.id}
          onSelectDay={setActiveDay}
        />

        <DayPage
          day={selectedDay}
          onAddTask={taskText =>
            onAddTask(monthId, selectedWeek.id, selectedDay.id, taskText)
          }
          onDeleteTask={taskId =>
            onDeleteTask(monthId, selectedWeek.id, selectedDay.id, taskId)
          }
          onCompleteTask={taskId =>
            onCompleteTask(monthId, selectedWeek.id, selectedDay.id, taskId)
          }
        />
      </div>
    </div>
  );
};

export default WeekList;

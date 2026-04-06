import { useEffect, useState } from "react";
import PlannerHeader from "./components/PlannerHeader";
import MonthList from "./components/MonthList";
import PlannedMonthsOverview from "./components/PlannedMonthsOverview";

const PLANNER_STORAGE_KEY = "business-planner-data";

const padNumber = value => String(value).padStart(2, "0");

const getMonthId = (year, monthIndex) => `${year}-${padNumber(monthIndex + 1)}`;

const getDayId = (monthId, dayOfMonth) => `${monthId}-${padNumber(dayOfMonth)}`;

const formatRangeLabel = (startDate, endDate) => {
  const startMonth = startDate.toLocaleString("default", { month: "short" });
  const endMonth = endDate.toLocaleString("default", { month: "short" });

  if (startMonth === endMonth) {
    return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}`;
  }

  return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}`;
};

const createMonthPlan = baseDate => {
  const year = baseDate.getFullYear();
  const monthIndex = baseDate.getMonth();
  const monthStart = new Date(year, monthIndex, 1);
  const monthEnd = new Date(year, monthIndex + 1, 0);
  const totalDays = monthEnd.getDate();
  const monthId = getMonthId(year, monthIndex);

  const days = Array.from({ length: totalDays }, (_, offset) => {
    const date = new Date(year, monthIndex, offset + 1);

    return {
      id: getDayId(monthId, offset + 1),
      dayOfMonth: offset + 1,
      dateLabel: padNumber(offset + 1),
      shortDay: date.toLocaleString("default", { weekday: "short" }),
      fullDay: date.toLocaleString("default", { weekday: "long" }),
      fullDate: date.toLocaleDateString("default", {
        month: "long",
        day: "numeric",
        year: "numeric"
      }),
      dateKey: `${year}-${padNumber(monthIndex + 1)}-${padNumber(offset + 1)}`,
      tasks: []
    };
  });

  const weeks = [];

  for (let index = 0; index < days.length; index += 7) {
    const weekDays = days.slice(index, index + 7);

    weeks.push({
      id: `${monthId}-week-${weeks.length + 1}`,
      order: weeks.length + 1,
      rangeLabel: formatRangeLabel(
        new Date(year, monthIndex, weekDays[0].dayOfMonth),
        new Date(year, monthIndex, weekDays[weekDays.length - 1].dayOfMonth)
      ),
      days: weekDays
    });
  }

  return {
    id: monthId,
    month: monthStart.toLocaleString("default", { month: "long" }),
    year,
    monthIndex,
    weeks
  };
};

const normalizeTasks = tasks =>
  Array.isArray(tasks)
    ? tasks
        .map((task, index) => {
          if (typeof task === "string") {
            return {
              id: `task-${Date.now()}-${index}`,
              text: task.trim(),
              isDone: false
            };
          }

          return {
            id: task?.id ?? `task-${Date.now()}-${index}`,
            text: task?.text?.trim?.() ?? "",
            isDone: Boolean(task?.isDone)
          };
        })
        .filter(task => task.text)
    : [];

const normalizeMonthPlan = storedMonth => {
  if (
    typeof storedMonth?.year !== "number" ||
    typeof storedMonth?.monthIndex !== "number"
  ) {
    return null;
  }

  const baseMonth = createMonthPlan(
    new Date(storedMonth.year, storedMonth.monthIndex, 1)
  );
  const storedDays = storedMonth.weeks?.flatMap(week => week.days ?? []) ?? [];
  const taskLookup = new Map();

  storedDays.forEach(day => {
    const dayKey =
      day?.dateKey ??
      (typeof day?.dayOfMonth === "number"
        ? `${baseMonth.year}-${padNumber(baseMonth.monthIndex + 1)}-${padNumber(day.dayOfMonth)}`
        : typeof day?.id === "string" && day.id.startsWith(baseMonth.id)
          ? `${baseMonth.year}-${padNumber(baseMonth.monthIndex + 1)}-${day.id.split("-").at(-1)}`
          : null);

    if (dayKey) {
      taskLookup.set(dayKey, normalizeTasks(day.tasks));
    }
  });

  return {
    ...baseMonth,
    weeks: baseMonth.weeks.map(week => ({
      ...week,
      days: week.days.map(day => ({
        ...day,
        tasks: taskLookup.get(day.dateKey) ?? []
      }))
    }))
  };
};

const sortMonths = months =>
  [...months].sort(
    (firstMonth, secondMonth) =>
      new Date(firstMonth.year, firstMonth.monthIndex, 1) -
      new Date(secondMonth.year, secondMonth.monthIndex, 1)
  );

const getTodayReference = () => {
  const today = new Date();
  const monthId = getMonthId(today.getFullYear(), today.getMonth());

  return {
    today,
    monthId,
    dayId: getDayId(monthId, today.getDate())
  };
};

const ensureTodayMonth = months => {
  const { today, monthId } = getTodayReference();

  if (months.some(month => month.id === monthId)) {
    return sortMonths(months);
  }

  return sortMonths([...months, createMonthPlan(today)]);
};

const App = () => {
  const [months, setMonths] = useState([]);
  const [activeMonthId, setActiveMonthId] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawData = window.localStorage.getItem(PLANNER_STORAGE_KEY);
      const payload = rawData ? JSON.parse(rawData) : { months: [] };
      const normalizedMonths = Array.isArray(payload.months)
        ? payload.months.map(normalizeMonthPlan).filter(Boolean)
        : [];
      const preparedMonths = ensureTodayMonth(normalizedMonths);
      const { monthId } = getTodayReference();

      setMonths(preparedMonths);
      setActiveMonthId(monthId);
      setIsHydrated(true);
    } catch (error) {
      const fallbackMonths = ensureTodayMonth([]);
      const { monthId } = getTodayReference();

      console.error("Unable to load planner data from localStorage.", error);
      setMonths(fallbackMonths);
      setActiveMonthId(monthId);
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        PLANNER_STORAGE_KEY,
        JSON.stringify({ months })
      );
    } catch (error) {
      console.error("Unable to save planner data to localStorage.", error);
    }
  }, [isHydrated, months]);

  const addMonth = () => {
    const lastMonth = sortMonths(months)[months.length - 1];
    const { today } = getTodayReference();
    const nextMonthDate = lastMonth
      ? new Date(lastMonth.year, lastMonth.monthIndex + 1, 1)
      : new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const newMonth = createMonthPlan(nextMonthDate);

    setMonths(prev => sortMonths([...prev, newMonth]));
    setActiveMonthId(newMonth.id);
  };

  const addTaskToDay = (monthId, weekId, dayId, taskText) => {
    const cleanTask = taskText.trim();

    if (!cleanTask) {
      return;
    }

    setMonths(prevMonths =>
      prevMonths.map(month => {
        if (month.id !== monthId) {
          return month;
        }

        return {
          ...month,
          weeks: month.weeks.map(week => {
            if (week.id !== weekId) {
              return week;
            }

            return {
              ...week,
              days: week.days.map(day => {
                if (day.id !== dayId) {
                  return day;
                }

                return {
                  ...day,
                  tasks: [
                    ...day.tasks,
                    {
                      id: `${dayId}-${Date.now()}-${day.tasks.length + 1}`,
                      text: cleanTask,
                      isDone: false
                    }
                  ]
                };
              })
            };
          })
        };
      })
    );
  };

  const deleteTaskFromDay = (monthId, weekId, dayId, taskId) => {
    setMonths(prevMonths =>
      prevMonths.map(month => {
        if (month.id !== monthId) {
          return month;
        }

        return {
          ...month,
          weeks: month.weeks.map(week => {
            if (week.id !== weekId) {
              return week;
            }

            return {
              ...week,
              days: week.days.map(day => {
                if (day.id !== dayId) {
                  return day;
                }

                return {
                  ...day,
                  tasks: day.tasks.filter(task => task.id !== taskId)
                };
              })
            };
          })
        };
      })
    );
  };

  const completeTaskForDay = (monthId, weekId, dayId, taskId) => {
    setMonths(prevMonths =>
      prevMonths.map(month => {
        if (month.id !== monthId) {
          return month;
        }

        return {
          ...month,
          weeks: month.weeks.map(week => {
            if (week.id !== weekId) {
              return week;
            }

            return {
              ...week,
              days: week.days.map(day => {
                if (day.id !== dayId) {
                  return day;
                }

                return {
                  ...day,
                  tasks: day.tasks.map(task =>
                    task.id === taskId ? { ...task, isDone: true } : task
                  )
                };
              })
            };
          })
        };
      })
    );
  };

  const { monthId: todayMonthId, dayId: todayDayId } = getTodayReference();

  return (
    <div className="app-shell">
      <div className="app-backdrop" />
      <PlannerHeader onAddMonth={addMonth} />
      <main className="app-content">
        <PlannedMonthsOverview
          months={months}
          activeMonthId={activeMonthId}
          onSelectMonth={setActiveMonthId}
        />
        <MonthList
          months={months}
          activeMonthId={activeMonthId}
          setActiveMonthId={setActiveMonthId}
          onAddTask={addTaskToDay}
          onDeleteTask={deleteTaskFromDay}
          onCompleteTask={completeTaskForDay}
          todayMonthId={todayMonthId}
          todayDayId={todayDayId}
          isLoading={!isHydrated}
        />
      </main>
    </div>
  );
};

export default App;

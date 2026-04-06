import React, { useEffect, useState } from "react";

const DayPage = ({ day, onAddTask, onDeleteTask, onCompleteTask }) => {
  const [taskInput, setTaskInput] = useState("");

  const handleAddTask = () => {
    onAddTask(taskInput);
    setTaskInput("");
  };

  const handleDeleteTask = taskId => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDeleteTask(taskId);
    }
  };

  useEffect(() => {
    setTaskInput("");
  }, [day?.id]);

  if (!day) {
    return null;
  }

  return (
    <section className="task-panel">
      <div className="section-heading">
        <div>
          <p className="section-label">Daily Tasks</p>
          <h3>{day.fullDay}</h3>
          <p className="selected-date">{day.fullDate}</p>
        </div>
        <span className="muted-meta">{day.tasks.length} tasks</span>
      </div>

      <div className="task-entry">
        <input
          className="task-input"
          type="text"
          value={taskInput}
          onChange={event => setTaskInput(event.target.value)}
          placeholder="Enter a task for the selected day"
        />
        <button className="primary-button" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      {day.tasks.length === 0 ? (
        <div className="task-empty">
          No tasks for {day.shortDay}, {day.dateLabel} yet. Add one to build the
          day plan.
        </div>
      ) : (
        <ul className="task-list">
          {day.tasks.map(task => (
            <li className={`task-item${task.isDone ? " completed" : ""}`} key={task.id}>
              <div className="task-copy">
                <strong>
                  {day.shortDay} {day.dateLabel}
                </strong>
                <span>{task.text}</span>
              </div>
              <div className="task-actions">
                <button
                  className={`success-button${task.isDone ? " disabled" : ""}`}
                  disabled={task.isDone}
                  onClick={() => onCompleteTask(task.id)}
                >
                  {task.isDone ? "Done" : "Mark Done"}
                </button>
                <button
                  className="danger-button"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default DayPage;

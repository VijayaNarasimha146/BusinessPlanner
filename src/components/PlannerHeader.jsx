const PlannerHeader = ({ onAddMonth }) => {
  return (
    <header className="planner-header">
      <div>
        <p className="eyebrow">Operations Dashboard</p>
        <h1>Business Planner</h1>
        <p className="header-copy">
          Organize months, weeks, and daily priorities from one clean workspace.
        </p>
      </div>
      <button className="primary-button" onClick={onAddMonth}>
        + Add Month
      </button>
    </header>
  );
};

export default PlannerHeader;

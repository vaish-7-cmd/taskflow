import React from 'react';

const StatsBar = ({ stats }) => {
  const pct = (val) => stats.total ? Math.round((val / stats.total) * 100) : 0;

  return (
    <div className="stats-bar">
      <div className="stat-card stat-total">
        <span className="stat-number">{stats.total}</span>
        <span className="stat-label">Total Tasks</span>
      </div>
      <div className="stat-card stat-todo">
        <span className="stat-number">{stats.todo}</span>
        <span className="stat-label">To Do</span>
        <div className="stat-bar"><div style={{ width: `${pct(stats.todo)}%` }} /></div>
      </div>
      <div className="stat-card stat-progress">
        <span className="stat-number">{stats['in-progress']}</span>
        <span className="stat-label">In Progress</span>
        <div className="stat-bar"><div style={{ width: `${pct(stats['in-progress'])}%` }} /></div>
      </div>
      <div className="stat-card stat-done">
        <span className="stat-number">{stats.done}</span>
        <span className="stat-label">Completed</span>
        <div className="stat-bar"><div style={{ width: `${pct(stats.done)}%` }} /></div>
      </div>
    </div>
  );
};

export default StatsBar;
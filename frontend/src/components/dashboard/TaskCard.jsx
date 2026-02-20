import React from 'react';
import { format } from 'date-fns';

const STATUS_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };
const STATUS_NEXT = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' };

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`task-card priority-border-${task.priority} ${task.status === 'done' ? 'task-done' : ''}`}>
      <div className="task-card-header">
        <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
        <span className={`status-badge status-${task.status}`}>{STATUS_LABELS[task.status]}</span>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-desc">{task.description}</p>}

      {task.dueDate && (
        <div className={`task-due ${isOverdue ? 'overdue' : ''}`}>
          📅 {isOverdue ? '⚠ Overdue · ' : ''}{format(new Date(task.dueDate), 'MMM d, yyyy')}
        </div>
      )}

      <div className="task-card-footer">
        <button
          className="btn-status-toggle"
          onClick={() => onStatusChange(task, STATUS_NEXT[task.status])}
          title={`Move to ${STATUS_NEXT[task.status]}`}
        >
          {task.status === 'done' ? '↩ Reopen' : '→ Move forward'}
        </button>
        <div className="task-actions">
          <button className="icon-btn edit-btn" onClick={() => onEdit(task)} title="Edit">✎</button>
          <button className="icon-btn delete-btn" onClick={() => onDelete(task._id)} title="Delete">✕</button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
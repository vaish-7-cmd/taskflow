import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { taskAPI } from '../../api/services';
import { format } from 'date-fns';

const TaskModal = ({ task, onSave, onClose }) => {
  const isEdit = Boolean(task);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
    },
  });

  useEffect(() => {
    // Close on Escape key
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await taskAPI.update(task._id, data);
        toast.success('Task updated!');
      } else {
        await taskAPI.create(data);
        toast.success('Task created!');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              placeholder="What needs to be done?"
              className={errors.title ? 'input-error' : ''}
              {...register('title', {
                required: 'Title is required',
                maxLength: { value: 100, message: 'Max 100 characters' },
              })}
            />
            {errors.title && <span className="error-msg">{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={3}
              placeholder="Add some details..."
              {...register('description', {
                maxLength: { value: 500, message: 'Max 500 characters' },
              })}
            />
            {errors.description && <span className="error-msg">{errors.description.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select {...register('status')}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select {...register('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input type="date" {...register('dueDate')} />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : isEdit ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
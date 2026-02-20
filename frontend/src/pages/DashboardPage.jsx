import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../api/services';
import TaskModal from '../components/dashboard/TaskModal';
import TaskCard from '../components/dashboard/TaskCard';
import StatsBar from '../components/dashboard/StatsBar';
import Sidebar from '../components/dashboard/Sidebar';

const STATUSES = ['all', 'todo', 'in-progress', 'done'];
const PRIORITIES = ['all', 'high', 'medium', 'low'];

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ todo: 0, 'in-progress': 0, done: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;

      const [tasksRes, statsRes] = await Promise.all([
        taskAPI.getAll(params),
        taskAPI.getStats(),
      ]);
      setTasks(tasksRes.data.tasks);
      setStats(statsRes.data.stats);
    } catch (err) {
      toast.error('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchTasks, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchTasks, search]);

  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskAPI.delete(id);
      toast.success('Task deleted.');
      fetchTasks();
    } catch {
      toast.error('Failed to delete task.');
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await taskAPI.update(task._id, { ...task, status: newStatus });
      fetchTasks();
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleModalSave = () => {
    setModalOpen(false);
    fetchTasks();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully.');
  };

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className={`dashboard-main ${sidebarOpen ? 'sidebar-pushed' : ''}`}>
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span /><span /><span />
            </button>
            <div className="brand">TaskFlow</div>
          </div>
          <div className="topbar-right">
            <button className="btn-new-task" onClick={handleCreate}>
              + New Task
            </button>
            <div className="avatar" title={user?.name}>
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="page-body">
          <div className="page-hero">
            <div>
              <h1>Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
              <p>Here's what's on your plate today.</p>
            </div>
          </div>

          <StatsBar stats={stats} />

          {/* Filters */}
          <div className="filters-row">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              {search && (
                <button className="clear-search" onClick={() => setSearch('')}>✕</button>
              )}
            </div>

            <div className="filter-chips">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  className={`chip ${statusFilter === s ? 'chip-active' : ''}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s === 'all' ? 'All status' : s}
                </button>
              ))}
            </div>

            <div className="filter-chips">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  className={`chip priority-chip priority-${p} ${priorityFilter === p ? 'chip-active' : ''}`}
                  onClick={() => setPriorityFilter(p)}
                >
                  {p === 'all' ? 'All priority' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Task list */}
          {loading ? (
            <div className="loading-tasks">
              {[...Array(4)].map((_, i) => <div key={i} className="task-skeleton" />)}
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◻</div>
              <h3>No tasks found</h3>
              <p>{search || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters.'
                : 'Create your first task to get started.'}</p>
              {!search && statusFilter === 'all' && priorityFilter === 'all' && (
                <button className="btn-primary" onClick={handleCreate}>+ Create task</button>
              )}
            </div>
          ) : (
            <div className="task-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Task modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleModalSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};

export default DashboardPage;
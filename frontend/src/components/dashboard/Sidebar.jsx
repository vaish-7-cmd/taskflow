import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  const location = useLocation();

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-mark">TF</span>
          <span className="brand-name">TaskFlow</span>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{getInitials(user?.name)}</div>
          <div>
            <div className="sidebar-name">{user?.name}</div>
            <div className="sidebar-email">{user?.email}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/dashboard"
            className={`nav-item ${location.pathname === '/dashboard' ? 'nav-active' : ''}`}
            onClick={onClose}
          >
            <span>◈</span> Dashboard
          </Link>
          <Link
            to="/profile"
            className={`nav-item ${location.pathname === '/profile' ? 'nav-active' : ''}`}
            onClick={onClose}
          >
            <span>◎</span> Profile
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-item" onClick={onLogout}>
            <span>→</span> Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
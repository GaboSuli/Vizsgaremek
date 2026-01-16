import React from 'react';
import './Foldal.css';

const navItems = [
  { id: 'about', label: 'Rólunk', icon: 'users' },
  { id: 'features', label: 'Funkciók', icon: 'sparkles' },
  { id: 'how', label: 'Hogyan működik', icon: 'steps' },
  { id: 'stats', label: 'Statisztikák', icon: 'chart' },
  { id: 'contact', label: 'Kapcsolat', icon: 'mail' },
];

function Icon({ name }) {
  switch (name) {
    case 'users':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      );
    case 'sparkles':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3l1.9 4.4L18 9l-4.1 1.6L12 15l-1.9-4.4L6 9l4.1-1.6z"/></svg>
      );
    case 'steps':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h4v8H3zM9 8h4v12H9zM15 4h6v16h-6z"/></svg>
      );
    case 'chart':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18"/><path d="M7 14V7"/><path d="M12 14v-4"/><path d="M17 14v-7"/></svg>
      );
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l9 6 9-6"/><path d="M21 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/></svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({ collapsed, onToggle, active, onNavigate }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Oldalsó navigáció">
      <div className="sidebar-top">
        <div className="logo" onClick={() => onNavigate('hero')}>
          <div className="logo-mark">VB</div>
          {!collapsed && <div className="logo-text">VevesBazar</div>}
        </div>
        <button className="collapse-btn" onClick={onToggle} aria-label="Menü összecsukása">{collapsed ? '›' : '‹'}</button>
      </div>

      <nav className="nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-current={active === item.id ? 'page' : undefined}
          >
            <span className="nav-icon"><Icon name={item.icon} /></span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {!collapsed && <small className="muted">© {new Date().getFullYear()} VevesBazar</small>}
      </div>
    </aside>
  );
}

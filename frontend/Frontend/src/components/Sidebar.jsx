import React from 'react';
import './Foldal.css';

const navItems = [
  { id: 'home', label: 'Főoldal', icon: 'home', page: true },
  { id: 'about', label: 'Rólunk', icon: 'users' },
  { id: 'features', label: 'Funkciók', icon: 'sparkles' },
  { id: 'how', label: 'Hogyan működik', icon: 'steps' },
  { id: 'stats', label: 'Statisztikák', icon: 'chart', page: true },
  { id: 'lista', label: 'Bevásárlás', icon: 'shopping', page: true },
  { id: 'shopping', label: 'Bevásárlólista', icon: 'cart', page: true },
  { id: 'kupon', label: 'Kuponok', icon: 'ticket', page: true },
  { id: 'user', label: 'Felhasználó', icon: 'user', page: true },
  { id: 'contact', label: 'Kapcsolat', icon: 'mail', page: true },
  { id: 'admin', label: 'Admin Panel', icon: 'settings', page: true },
];

function Icon({ name }) {
  switch (name) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      );
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
    case 'shopping':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      );
    case 'ticket':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/><line x1="6" y1="9" x2="18" y2="9"/><line x1="6" y1="15" x2="18" y2="15"/></svg>
      );
    case 'cart':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      );
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l9 6 9-6"/><path d="M21 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/></svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m3.08-3.08l4.24-4.24M19.78 19.78l-4.24-4.24m-3.08-3.08l-4.24-4.24"/></svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({ collapsed, onToggle, active, onNavigate, onPageChange }) {
  const handleNavClick = (item) => {
    if (item.page) {
      // Navigáció az oldal szinten
      onPageChange && onPageChange(item.id);
    } else {
      // Navigáció a lap szinten
      onNavigate(item.id);
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Oldalsó navigáció">
      <div className="sidebar-top">
        <div className="logo" onClick={() => handleNavClick({ id: 'home', page: true })}>
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
            onClick={() => handleNavClick(item)}
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

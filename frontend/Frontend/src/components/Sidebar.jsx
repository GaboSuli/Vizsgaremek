import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';
import './Sidebar.css';

const navItems = [
  {
    to: '/dashboard', label: 'Főoldal',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    )
  },
  {
    to: '/groups', label: 'Csoportok',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  },
  {
    to: '/shopping', label: 'Bevásárlólisták',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    )
  },
  {
    to: '/kupon', label: 'Kuponok',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="15" x2="15.01" y2="15"/>
        <line x1="9.5" y1="14.5" x2="14.5" y2="9.5"/>
      </svg>
    )
  },
  {
    to: '/stats', label: 'Statisztikák',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
        <line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    )
  },
  {
    to: '/contact', label: 'Kapcsolat',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )
  },
];

const profileItems = [
  {
    to: '/user', label: 'Profil',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  },
];

const adminItems = [
  {
    to: '/admin', label: 'Admin Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    )
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const { logout, user, isAdmin, isModerator } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const resize = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const closeMobile = () => setMobileOpen(false);
  const handleToggle = () => {
    if (window.innerWidth < 768) setMobileOpen(o => !o);
    else onToggle();
  };

  const initials = user ? (user.Nev || user.nev || user.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U';
  const displayName = user ? (user.Nev || user.nev || user.name || 'Felhasználó') : 'Felhasználó';
  const displayEmail = user ? (user.Email || user.email || '') : '';

  return (
    <>
      {/* Mobile hamburger */}
      <button className="sidebar-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menü megnyitása">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--mobile-open' : ''}`}>
        {/* Header / Logo */}
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-logo" onClick={closeMobile}>
            <div className="sidebar-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2"/>
                <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="sidebar-logo-text">Szaldon</span>
          </NavLink>

          <button className="sidebar-collapse-btn" onClick={handleToggle} aria-label="Sidebar összecsukása">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              {collapsed
                ? <path d="M9 18l6-6-6-6"/>
                : <path d="M15 18l-6-6 6-6"/>}
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-group">
            {!collapsed && <span className="sidebar-nav-label">Navigáció</span>}
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobile}
                data-tooltip={item.label}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                {!collapsed && <span className="sidebar-nav-text">{item.label}</span>}
              </NavLink>
            ))}
          </div>

          <div className="sidebar-nav-group">
            {!collapsed && <span className="sidebar-nav-label">Fiók</span>}
            {profileItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobile}
                data-tooltip={item.label}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                {!collapsed && <span className="sidebar-nav-text">{item.label}</span>}
              </NavLink>
            ))}
          </div>

          {isModerator && (
            <div className="sidebar-nav-group">
              {!collapsed && <span className="sidebar-nav-label" style={{color:'var(--clr-info, #06b6d4)'}}>Moderátor</span>}
              <NavLink
                to="/kupon-moderator"
                onClick={closeMobile}
                data-tooltip="Kupon Moderátor"
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-nav-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
                  </svg>
                </span>
                {!collapsed && <span className="sidebar-nav-text">Kupon Moderátor</span>}
              </NavLink>
            </div>
          )}

          {isAdmin && (
            <div className="sidebar-nav-group">
              {!collapsed && <span className="sidebar-nav-label" style={{color:'var(--clr-warning, #f59e0b)'}}>Admin</span>}
              {adminItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobile}
                  data-tooltip={item.label}
                  className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  {!collapsed && <span className="sidebar-nav-text">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {/* User + Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{initials}</div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{displayName}</div>
                <div className="sidebar-user-email">{displayEmail}</div>
              </div>
            )}
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout} title="Kijelentkezés">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
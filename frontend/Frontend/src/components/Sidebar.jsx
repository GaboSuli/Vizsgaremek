import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';
import './Foldal.css';

const navItems = [
  { to: '/dashboard', label: 'Főoldal', icon: 'home' },
  { to: '/stats', label: 'Statisztikák', icon: 'chart' },
  { to: '/shopping', label: 'Bevásárlólista', icon: 'cart' },
  { to: '/kupon', label: 'Kuponok', icon: 'ticket' },
  { to: '/user', label: 'Profil', icon: 'user' },
  { to: '/contact', label: 'Kapcsolat', icon: 'mail' },
  { to: '/admin', label: 'Admin', icon: 'settings' }
];

function Icon({ name }) {
  switch (name) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      );
    case 'chart':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3v18h18"/>
          <path d="M7 14V7"/>
          <path d="M12 14v-4"/>
          <path d="M17 14v-7"/>
        </svg>
      );
    case 'shopping':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      );
    case 'cart':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      );
    case 'ticket':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
          <line x1="6" y1="9" x2="18" y2="9"/>
          <line x1="6" y1="15" x2="18" y2="15"/>
        </svg>
      );
    case 'user':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M4 21v-2a4 4 0 0 1 3-3.87"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      );
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 8l9 6 9-6"/>
          <path d="M21 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/>
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m3.08-3.08l4.24-4.24"/>
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({ collapsed, onToggle }) {

  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>

        <div className="sidebar-top">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <NavLink to="/dashboard" className="logo">
              <div className="logo-mark">VB</div>
              {!collapsed && <div className="logo-text">VevesBazar</div>}
            </NavLink>
            <button
              className="collapse-btn"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileOpen(!mobileOpen);
                } else {
                  onToggle();
                }
              }}
            >
              {collapsed ? '›' : '‹'}
            </button>
          </div>
        </div>

        {user && !collapsed && (
          <div className="sidebar-user">
            <small>{user.name || user.Nev || 'Felhasználó'}</small>
          </div>
        )}

        <nav className="nav">
          {user && (
            (user.jogosultsag_szint > 2
              ? [
                  { to: '/kupon', label: 'Kuponok', icon: 'ticket' },
                  { to: '/admin', label: 'Admin', icon: 'settings' }
                ]
              : navItems.filter(item => {
                  if (item.to === '/admin') {
                    return user.jogosultsag_szint > 2;
                  }
                  return true;
                })
            ).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="nav-icon">
                  <Icon name={item.icon}/>
                </span>
                {!collapsed && (
                  <span className="nav-label">{item.label}</span>
                )}
              </NavLink>
            ))
          )}

          {user && (
            <button className="nav-item logout" onClick={handleLogout}>
              <span className="nav-icon">
                <Icon name="settings"/>
              </span>
              {!collapsed && <span className="nav-label">Kijelentkezés</span>}
            </button>
          )}
        </nav>

        <div className="sidebar-bottom">
          {!collapsed && (
            <small className="muted">
              © {new Date().getFullYear()} VevesBazar
            </small>
          )}
        </div>

      </aside>
    </>
  );
}
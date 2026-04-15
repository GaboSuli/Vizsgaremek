import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';
import useCookieConsent from '../context/useCookieConsent.js';
import Avatar from './Profile/Avatar.jsx';
import './Sidebar.css';

/* ── Icons — all original SVGs preserved unchanged ── */
const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  groups: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  shopping: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  kupon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="15" x2="15.01" y2="15"/>
      <line x1="9.5" y1="14.5" x2="14.5" y2="9.5"/>
    </svg>
  ),
  stats: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  admin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  moderator: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
    </svg>
  ),
};

/* ── Build menu sections dynamically by role ── */
function buildSections(isAdmin, isModerator) {
  if (isAdmin) {
    return [
      {
        id: 'overview',
        label: 'Áttekintés',
        items: [
          { to: '/dashboard', label: 'Főoldal', icon: icons.dashboard },
        ],
      },  
      {
        id: 'admin',
        label: 'Adminisztráció',
        variant: 'admin',
        items: [
          { to: '/admin', label: 'Vezérlőközpont', icon: icons.admin, badge: 'ADMIN' },
          { to: '/kupon-moderator', label: 'Kupon Moderátor', icon: icons.moderator },
        ],
      },
      {
        id: 'system',
        label: 'Rendszer',
        items: [
          { to: '/stats', label: 'Statisztikák', icon: icons.stats },
          { to: '/contact', label: 'Kapcsolat', icon: icons.contact },
        ],
      },
      {
        id: 'account',
        label: 'Fiók',
        items: [
          { to: '/user', label: 'Admin Profil', icon: icons.profile },
        ],
      },
    ];
  }

  const sections = [
    {
      id: 'nav',
      label: 'Navigáció',
      items: [
        { to: '/dashboard', label: 'Főoldal', icon: icons.dashboard },
        { to: '/groups', label: 'Csoportok', icon: icons.groups },
        { to: '/shopping', label: 'Bevásárlólisták', icon: icons.shopping },
        { to: '/kupon', label: 'Kuponok', icon: icons.kupon },
        { to: '/stats', label: 'Statisztikák', icon: icons.stats },
        { to: '/contact', label: 'Kapcsolat', icon: icons.contact },
      ],
    },
  ];

  if (isModerator) {
    sections.push({
      id: 'moderator',
      label: 'Moderátor',
      variant: 'moderator',
      items: [
        { to: '/kupon-moderator', label: 'Kupon Moderátor', icon: icons.moderator },
      ],
    });
  }

  sections.push({
    id: 'account',
    label: 'Fiók',
    items: [
      { to: '/user', label: 'Profil', icon: icons.profile },
    ],
  });

  return sections;
}

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const { logout, user, isAdmin, isModerator } = useAuth();
  const { openSettings: openCookieSettings } = useCookieConsent();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = useMemo(
    () => buildSections(isAdmin, isModerator),
    [isAdmin, isModerator]
  );

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

  const sidebarClass = [
    'sidebar',
    collapsed && 'sidebar--collapsed',
    mobileOpen && 'sidebar--mobile-open',
    isAdmin && 'sidebar--admin',
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className={`sidebar-hamburger${isAdmin ? ' sidebar-hamburger--admin' : ''}`}
        onClick={() => setMobileOpen(o => !o)}
        aria-label="Menü megnyitása"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

      <aside className={sidebarClass}>
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

          {isAdmin && !collapsed && (
            <span className="sidebar-role-badge">Admin</span>
          )}

          <button className="sidebar-collapse-btn" onClick={handleToggle} aria-label="Sidebar összecsukása">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              {collapsed
                ? <path d="M9 18l6-6-6-6"/>
                : <path d="M15 18l-6-6 6-6"/>}
            </svg>
          </button>
        </div>

        {/* Dynamic navigation sections */}
        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`sidebar-nav-group${section.variant ? ` sidebar-nav-group--${section.variant}` : ''}`}
            >
              {!collapsed && (
                <span className={`sidebar-nav-label${section.variant ? ` sidebar-nav-label--${section.variant}` : ''}`}>
                  {section.label}
                </span>
              )}
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobile}
                  data-tooltip={item.label}
                  className={({ isActive }) =>
                    `sidebar-nav-item${section.variant ? ` sidebar-nav-item--${section.variant}` : ''} ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  {!collapsed && <span className="sidebar-nav-text">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="sidebar-item-badge">{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Legal links */}
        {!collapsed && (
          <div className="sidebar-legal">
            <NavLink to="/adatkezeles" onClick={closeMobile} className="sidebar-legal-link">Adatkezelés</NavLink>
            <NavLink to="/cookie-szabalyzat" onClick={closeMobile} className="sidebar-legal-link">Cookie szabályzat</NavLink>
            <button className="sidebar-legal-link sidebar-legal-btn" onClick={() => { closeMobile(); openCookieSettings(); }}>Cookie beállítások</button>
          </div>
        )}

        {/* User + Logout */}
        <div className={`sidebar-footer${isAdmin ? ' sidebar-footer--admin' : ''}`}>
          <div className="sidebar-user">
            <Avatar src={user?.profilkep_url} name={displayName} size="sm" className={`sidebar-user-avatar${isAdmin ? ' sidebar-user-avatar--admin' : ''}`} />
            {!collapsed && (
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">
                  {displayName}
                  {isAdmin && <span className="sidebar-user-role">Admin</span>}
                </div>
                <div className="sidebar-user-email">{displayEmail}</div>
              </div>
            )}
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout} title="Kijelentkezés" data-tooltip="Kijelentkezés">
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
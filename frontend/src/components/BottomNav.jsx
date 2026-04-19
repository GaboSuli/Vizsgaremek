import React, { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';
import './BottomNav.css';

/* ── Icons ────────────────────────────────── */
const IcoDashboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IcoGroups = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoShopping = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const IcoKupon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
    <line x1="9.5" y1="14.5" x2="14.5" y2="9.5"/>
  </svg>
);
const IcoStats = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const IcoAdmin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);
const IcoModerator = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
  </svg>
);
const IcoProfile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

function buildNavItems(isAdmin, isModerator) {
  if (isAdmin) {
    return [
      { to: '/dashboard', label: 'Főoldal',   icon: <IcoDashboard /> },
      { to: '/admin',     label: 'Admin',      icon: <IcoAdmin />, admin: true },
      { to: '/stats',     label: 'Statisztika',icon: <IcoStats /> },
      { to: '/kupon-moderator', label: 'Kupon', icon: <IcoModerator />, admin: true },
      { to: '/user',      label: 'Profil',     icon: <IcoProfile /> },
    ];
  }
  const items = [
    { to: '/dashboard', label: 'Főoldal',  icon: <IcoDashboard /> },
    { to: '/groups',    label: 'Csoportok',icon: <IcoGroups /> },
    { to: '/shopping',  label: 'Listák',   icon: <IcoShopping /> },
    { to: '/kupon',     label: 'Kuponok',  icon: <IcoKupon /> },
    { to: '/user',      label: 'Profil',   icon: <IcoProfile /> },
  ];
  if (isModerator) {
    items.splice(4, 0, { to: '/kupon-moderator', label: 'Mod', icon: <IcoModerator />, moderator: true });
    items.length = 5; // cap at 5
  }
  return items;
}

export default function BottomNav() {
  const { isAdmin, isModerator } = useAuth();

  const items = useMemo(
    () => buildNavItems(isAdmin, isModerator),
    [isAdmin, isModerator]
  );

  return (
    <nav className={`bottom-nav${isAdmin ? ' bottom-nav--admin' : ''}`} aria-label="Fő navigáció">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/dashboard'}
          className={({ isActive }) =>
            [
              'bottom-nav-item',
              item.admin && 'bottom-nav-item--admin',
              item.moderator && 'bottom-nav-item--moderator',
              isActive && 'active',
            ].filter(Boolean).join(' ')
          }
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';

const quickActions = [
  {
    label: 'Kupon Moderátor',
    desc: 'Teljes kuponkezelő felület',
    path: '/kupon-moderator',
    color: 'info',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    label: 'Statisztikák',
    desc: 'Termékárak és trendek',
    path: '/stats',
    color: 'purple',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    label: 'Csoportok',
    desc: 'Csoportok böngészése',
    path: '/groups',
    color: 'success',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: 'Bevásárlólisták',
    desc: 'Listák kezelése',
    path: '/shopping',
    color: 'warning',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    label: 'Kapcsolat üzenetek',
    desc: 'Beérkezett üzenetek',
    path: '/contact',
    color: 'danger',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    label: 'Profil',
    desc: 'Saját fiók kezelése',
    path: '/user',
    color: 'primary',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Gyors műveletek
        </h2>
      </div>
      <div className="admin-section-body">
        <div className="admin-quick-grid">
          {quickActions.map(action => (
            <div
              key={action.path}
              className="admin-quick-card"
              onClick={() => navigate(action.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(action.path)}
            >
              <div className={`admin-quick-card-icon admin-stat-icon--${action.color}`}>
                {action.icon}
              </div>
              <div className="admin-quick-card-label">{action.label}</div>
              <div className="admin-quick-card-desc">{action.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

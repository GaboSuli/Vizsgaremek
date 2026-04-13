import React from 'react';

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const GroupsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const CouponsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

export default function AdminStats({ stats, loading }) {
  const cards = [
    {
      label: 'Felhasználók',
      value: stats.users?.length ?? 0,
      icon: <UsersIcon />,
      color: 'primary',
      sub: `${stats.users?.filter(u => (u.jogosultsag_szint ?? u.Jogosultsag_szint ?? 0) === 255).length ?? 0} admin`,
    },
    {
      label: 'Csoportok',
      value: stats.groups?.length ?? 0,
      icon: <GroupsIcon />,
      color: 'success',
      sub: 'Aktív csoportok',
    },
    {
      label: 'Kuponok',
      value: stats.coupons?.length ?? 0,
      icon: <CouponsIcon />,
      color: 'warning',
      sub: 'Összes kupon',
    },
    {
      label: 'Üzenetek',
      value: stats.contacts?.length ?? 0,
      icon: <MailIcon />,
      color: 'info',
      sub: 'Beérkezett üzenetek',
    },
  ];

  return (
    <div className="admin-stats-grid">
      {cards.map((card) => (
        <div key={card.label} className={`admin-stat-card admin-stat-card--${card.color}`}>
          <div className={`admin-stat-icon admin-stat-icon--${card.color}`}>
            {card.icon}
          </div>
          <div className="admin-stat-content">
            <div className="admin-stat-label">{card.label}</div>
            <div className="admin-stat-value">
              {loading ? '—' : card.value}
            </div>
            <div className="admin-stat-sub">{card.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

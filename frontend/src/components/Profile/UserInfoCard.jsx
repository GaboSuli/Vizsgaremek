import React from 'react';
import './UserInfoCard.css';

function InfoRow({ icon, label, value }) {
  return (
    <div className="uinfo-row">
      <span className="uinfo-row__icon">{icon}</span>
      <div className="uinfo-row__content">
        <span className="uinfo-row__label">{label}</span>
        <span className="uinfo-row__value">
          {value || <span className="uinfo-row__empty">Nincs megadva</span>}
        </span>
      </div>
    </div>
  );
}

export default function UserInfoCard({ user }) {
  if (!user) return null;

  const roleText =
    user.jogosultsag_szint === 255
      ? 'Adminisztrátor'
      : (user.jogosultsag_szint ?? 0) > 0
      ? `Moderátor (szint: ${user.jogosultsag_szint})`
      : 'Felhasználó';

  const roleBadgeCls =
    user.jogosultsag_szint === 255
      ? 'uinfo-badge--admin'
      : (user.jogosultsag_szint ?? 0) > 0
      ? 'uinfo-badge--mod'
      : 'uinfo-badge--user';

  return (
    <div className="uinfo-card">
      <div className="uinfo-card__header">
        <h3 className="uinfo-card__title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Személyes adatok
        </h3>
        <span className={`uinfo-badge ${roleBadgeCls}`}>{roleText}</span>
      </div>
      <div className="uinfo-card__body">
        <InfoRow
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          label="Teljes név"
          value={user.nev}
        />
        <InfoRow
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          label="Becenév"
          value={user.becenev}
        />
        <InfoRow
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
          label="E-mail cím"
          value={user.email}
        />
        <InfoRow
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          label="Regisztrálva"
          value={
            user.created_at
              ? new Date(user.created_at).toLocaleDateString('hu-HU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : null
          }
        />
      </div>
    </div>
  );
}

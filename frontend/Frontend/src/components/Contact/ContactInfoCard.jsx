import React from 'react';

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const teamMembers = [
  {
    name: 'Fejlesztői csapat',
    role: 'Backend & Frontend fejlesztés',
    email: 'dev@vevesbazar.hu',
    color: 'primary',
    initials: 'FE',
  },
  {
    name: 'Támogatás',
    role: 'Ügyfélszolgálat & Segítség',
    email: 'cashentis@gmail.com',
    color: 'success',
    initials: 'TÁ',
    github: 'https://github.com',
  },
];

function getAvatarColor(color) {
  const colors = {
    primary: { bg: 'var(--clr-primary-light)', text: 'var(--clr-primary-dark)' },
    success: { bg: 'var(--clr-success-light)', text: 'var(--clr-success-dark)' },
    info: { bg: 'var(--clr-info-light)', text: 'var(--clr-info-dark)' },
    purple: { bg: 'var(--clr-purple-light)', text: 'var(--clr-purple)' },
  };
  return colors[color] || colors.primary;
}

export default function ContactInfoCard() {
  return (
    <div className="contact-info-section">
      <div className="contact-info-header">
        <h2 className="contact-info-title">Elérhetőségek</h2>
        <p className="contact-info-subtitle">Csapatunk tagjai készen állnak a segítségre</p>
      </div>

      <div className="contact-team-list">
        {teamMembers.map((member, idx) => {
          const colorSet = getAvatarColor(member.color);
          return (
            <div className="contact-team-card" key={idx}>
              <div className="contact-team-avatar" style={{ background: colorSet.bg, color: colorSet.text }}>
                {member.initials}
              </div>
              <div className="contact-team-details">
                <h4 className="contact-team-name">{member.name}</h4>
                <span className="contact-team-role">{member.role}</span>
                <a href={`mailto:${member.email}`} className="contact-team-email">
                  <MailIcon />
                  {member.email}
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick info cards */}
      <div className="contact-quick-info">
        <div className="contact-quick-card">
          <div className="contact-quick-icon" style={{ background: 'var(--clr-info-light)', color: 'var(--clr-info-dark)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <h5 className="contact-quick-label">Válaszidő</h5>
            <p className="contact-quick-value">24-48 órán belül</p>
          </div>
        </div>
        <div className="contact-quick-card">
          <div className="contact-quick-icon" style={{ background: 'var(--clr-success-light)', color: 'var(--clr-success-dark)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h5 className="contact-quick-label">Biztonságos kapcsolat</h5>
            <p className="contact-quick-value">Adataid biztonságban vannak</p>
          </div>
        </div>
      </div>
    </div>
  );
}

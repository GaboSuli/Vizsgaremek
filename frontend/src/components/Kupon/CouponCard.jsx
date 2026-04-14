import React from 'react';

function getKuponStatus(kezdesi_datum, lejarasi_datum) {
  const today = new Date().toISOString().split('T')[0];
  if (!lejarasi_datum) return 'unknown';
  if (lejarasi_datum < today) return 'expired';
  if (kezdesi_datum && kezdesi_datum > today) return 'upcoming';
  return 'active';
}

function formatDate(dateStr) {
  if (!dateStr) return '–';
  try {
    return new Date(dateStr).toLocaleDateString('hu-HU', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const NoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

export default function CouponCard({ kupon, isModerator = false, onEdit, onDelete }) {
  const status = getKuponStatus(kupon.kezdesi_datum, kupon.lejarasi_datum);

  const statusLabel = { active: 'Aktív', expired: 'Lejárt', upcoming: 'Hamarosan', unknown: '?' };
  const statusBadge = { active: 'badge-success', expired: 'badge-danger', upcoming: 'badge-warning', unknown: 'badge-gray' };

  return (
    <div className={`coup-card coup-card--${status}`}>
      {/* Header: Code + Status badge */}
      <div className="coup-card-header">
        <div className="coup-kod-wrap">
          <span className="coup-kod">{kupon.kod}</span>
        </div>
        <span className={`badge ${statusBadge[status]}`}>{statusLabel[status]}</span>
      </div>

      {/* Discount highlight */}
      {kupon.kedvezmeny && (
        <div className="coup-discount-banner">
          <span className="coup-discount-value">{kupon.kedvezmeny}</span>
          <span className="coup-discount-label">% kedvezmény</span>
        </div>
      )}

      {/* Details */}
      <div className="coup-details">
        {kupon.hasznalasi_hely && (
          <div className="coup-detail-row">
            <span className="coup-detail-icon"><LocationIcon /></span>
            <span className="coup-detail-label">Felhasználási hely</span>
            <span className="coup-detail-value">{kupon.hasznalasi_hely}</span>
          </div>
        )}
        <div className="coup-detail-row">
          <span className="coup-detail-icon"><CalendarIcon /></span>
          <span className="coup-detail-label">Kezdési dátum</span>
          <span className="coup-detail-value">{formatDate(kupon.kezdesi_datum)}</span>
        </div>
        <div className="coup-detail-row">
          <span className="coup-detail-icon"><CalendarIcon /></span>
          <span className="coup-detail-label">Lejárati dátum</span>
          <span className={`coup-detail-value${status === 'expired' ? ' coup-expired-text' : ''}`}>
            {formatDate(kupon.lejarasi_datum)}
          </span>
        </div>
        {kupon.megjegyzes && (
          <div className="coup-detail-row coup-detail-row--note">
            <span className="coup-detail-icon"><NoteIcon /></span>
            <span className="coup-detail-label">Megjegyzés</span>
            <span className="coup-detail-value coup-note">{kupon.megjegyzes}</span>
          </div>
        )}
      </div>

      {/* Admin actions */}
      {isModerator && (
        <div className="coup-actions">
          <button
            className="coup-btn-edit"
            onClick={() => onEdit(kupon)}
            title="Szerkesztés"
          >
            <EditIcon /> Szerkesztés
          </button>
          <button
            className="coup-btn-delete"
            onClick={() => onDelete(kupon)}
            title="Törlés"
          >
            <TrashIcon /> Törlés
          </button>
        </div>
      )}
    </div>
  );
}

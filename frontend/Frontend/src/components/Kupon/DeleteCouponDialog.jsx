import React, { useState } from 'react';
import { deleteKupon } from '../../services/kuponService.js';

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default function DeleteCouponDialog({ kupon, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await deleteKupon(kupon.id);
      if (res.success) {
        onDeleted();
      } else {
        setError(res.message || 'Hiba a kupon törlésekor.');
      }
    } catch {
      setError('Váratlan hiba történt.');
    } finally {
      setLoading(false);
    }
  };

  if (!kupon) return null;

  return (
    <div className="cm-overlay" onClick={e => e.target === e.currentTarget && !loading && onClose()}>
      <div className="cm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
        <div className="cm-dialog-icon cm-dialog-icon--danger">
          <WarningIcon />
        </div>

        <h2 id="delete-title" className="cm-dialog-title">Kupon törlése</h2>
        <p className="cm-dialog-text">
          Biztosan törölni szeretnéd a(z){' '}
          <strong className="cm-dialog-highlight">{kupon.kod}</strong>{' '}
          kuponkódú kupont? Ez a művelet nem vonható vissza.
        </p>

        {kupon.hasznalasi_hely && (
          <p className="cm-dialog-meta">
            Felhasználási hely: <strong>{kupon.hasznalasi_hely}</strong>
            {kupon.kedvezmeny && <> &nbsp;·&nbsp; Kedvezmény: <strong>{kupon.kedvezmeny}</strong></>}
          </p>
        )}

        {error && <div className="alert alert-danger" style={{ marginTop: '1rem' }}>{error}</div>}

        <div className="cm-dialog-actions">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Mégse
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? <><span className="spinner-sm" /> Törlés...</> : 'Igen, törlöm'}
          </button>
        </div>
      </div>
    </div>
  );
}

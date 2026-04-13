import React, { useState } from 'react';
import { updateCsoport } from '../../services/api';
import './groups.css';

const CSOPORT_TIPUSOK = [
  { id: 1, megnevezes: 'Család' },
  { id: 2, megnevezes: 'Egyesület' },
  { id: 3, megnevezes: 'Vállalat' },
];

export default function EditGroupModal({ csoport, onClose, onUpdated }) {
  const [megnevezes, setMegnevezes] = useState(csoport?.megnevezes ?? '');
  const [tipusId, setTipusId] = useState(csoport?.csoport_tipus_id ?? 1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!megnevezes.trim()) errs.megnevezes = 'A csoport neve kötelező';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError(null);
    const res = await updateCsoport(csoport.id, {
      megnevezes: megnevezes.trim(),
      csoport_tipus_id: Number(tipusId),
    });
    setLoading(false);

    if (res.success) {
      if (onUpdated) onUpdated();
      onClose();
    } else {
      if (res.errors) {
        const mapped = {};
        if (res.errors.megnevezes) mapped.megnevezes = res.errors.megnevezes[0];
        setErrors(mapped);
      } else {
        setApiError(res.message || 'Hiba történt a mentés során');
      }
    }
  };

  return (
    <div className="grp-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="grp-modal" role="dialog" aria-modal="true" aria-labelledby="eg-title">
        <div className="grp-modal-header">
          <h2 id="eg-title">Csoport szerkesztése</h2>
          <button className="grp-modal-close" onClick={onClose} aria-label="Bezárás">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grp-modal-body">
            {apiError && (
              <div className="grp-alert grp-alert-error" style={{ marginBottom: '1rem' }}>
                {apiError}
                <button className="grp-alert-close" type="button" onClick={() => setApiError(null)}>×</button>
              </div>
            )}

            <div className="grp-field">
              <label className="grp-label" htmlFor="eg-nev">Csoport neve *</label>
              <input
                id="eg-nev"
                className="grp-input"
                type="text"
                value={megnevezes}
                onChange={(e) => { setMegnevezes(e.target.value); setErrors(p => ({ ...p, megnevezes: undefined })); }}
                placeholder="Csoport neve"
                autoFocus
                maxLength={80}
              />
              {errors.megnevezes && <div className="grp-field-error">{errors.megnevezes}</div>}
            </div>

            <div className="grp-field">
              <label className="grp-label" htmlFor="eg-tipus">Csoport típusa</label>
              <select
                id="eg-tipus"
                className="grp-select"
                value={tipusId}
                onChange={(e) => setTipusId(e.target.value)}
              >
                {CSOPORT_TIPUSOK.map(t => (
                  <option key={t.id} value={t.id}>{t.megnevezes}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grp-modal-footer">
            <button type="button" className="grp-btn grp-btn-secondary" onClick={onClose} disabled={loading}>
              Mégse
            </button>
            <button type="submit" className="grp-btn grp-btn-primary" disabled={loading}>
              {loading ? (
                <><span className="grp-spinner grp-spinner-sm" />Mentés...</>
              ) : 'Mentés'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

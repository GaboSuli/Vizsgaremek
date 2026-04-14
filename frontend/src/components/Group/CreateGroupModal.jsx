import React, { useState } from 'react';
import { createCsoport } from '../../services/api';
import './groups.css';

const CSOPORT_TIPUSOK = [
  { id: 1, megnevezes: 'Család' },
  { id: 2, megnevezes: 'Egyesület' },
  { id: 3, megnevezes: 'Vállalat' },
];

export default function CreateGroupModal({ onClose, onCreated }) {
  const [megnevezes, setMegnevezes] = useState('');
  const [tipusId, setTipusId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!megnevezes.trim()) errs.megnevezes = 'A csoport neve kötelező';
    if (!tipusId) errs.tipus = 'A csoport típusa kötelező';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError(null);
    const res = await createCsoport({ megnevezes: megnevezes.trim(), csoport_tipus_id: Number(tipusId) });
    setLoading(false);

    if (res.success) {
      if (onCreated) onCreated();
      onClose();
    } else {
      if (res.errors) {
        const mapped = {};
        if (res.errors.megnevezes) mapped.megnevezes = res.errors.megnevezes[0];
        if (res.errors.csoport_tipus_id) mapped.tipus = res.errors.csoport_tipus_id[0];
        setErrors(mapped);
      } else {
        setApiError(res.message || 'Hiba történt a csoport létrehozásakor');
      }
    }
  };

  return (
    <div className="grp-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="grp-modal" role="dialog" aria-modal="true" aria-labelledby="cg-title">
        <div className="grp-modal-header">
          <h2 id="cg-title">Új csoport létrehozása</h2>
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
              <label className="grp-label" htmlFor="cg-nev">Csoport neve *</label>
              <input
                id="cg-nev"
                className="grp-input"
                type="text"
                value={megnevezes}
                onChange={(e) => { setMegnevezes(e.target.value); setErrors(p => ({ ...p, megnevezes: undefined })); }}
                placeholder="pl. Családi bevásárlás"
                autoFocus
                maxLength={80}
              />
              {errors.megnevezes && <div className="grp-field-error">{errors.megnevezes}</div>}
            </div>

            <div className="grp-field">
              <label className="grp-label" htmlFor="cg-tipus">Csoport típusa *</label>
              <select
                id="cg-tipus"
                className="grp-select"
                value={tipusId}
                onChange={(e) => { setTipusId(e.target.value); setErrors(p => ({ ...p, tipus: undefined })); }}
              >
                {CSOPORT_TIPUSOK.map(t => (
                  <option key={t.id} value={t.id}>{t.megnevezes}</option>
                ))}
              </select>
              {errors.tipus && <div className="grp-field-error">{errors.tipus}</div>}
            </div>
          </div>

          <div className="grp-modal-footer">
            <button type="button" className="grp-btn grp-btn-secondary" onClick={onClose} disabled={loading}>
              Mégse
            </button>
            <button type="submit" className="grp-btn grp-btn-primary" disabled={loading}>
              {loading ? (
                <><span className="grp-spinner grp-spinner-sm" />Létrehozás...</>
              ) : '+ Csoport létrehozása'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

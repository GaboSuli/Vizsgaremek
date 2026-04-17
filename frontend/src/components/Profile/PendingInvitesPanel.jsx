import React, { useState, useEffect, useCallback } from 'react';
import { getCsoportMeghivasok, decideCsoportMeghivas } from '../../services/api';
import './pending-invites.css';

export default function PendingInvitesPanel({ onCountChange }) {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deciding, setDeciding] = useState({}); // { csoport_id: true/false }

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getCsoportMeghivasok();
    setLoading(false);
    if (res.success) {
      const list = Array.isArray(res.data) ? res.data : [];
      setInvites(list);
      if (onCountChange) onCountChange(list.length);
    } else {
      setError(res.message || 'Nem sikerült betölteni a meghívásokat');
    }
  }, [onCountChange]);

  useEffect(() => { load(); }, [load]);

  const handleDecision = async (csoportId, elfogadott) => {
    setDeciding(prev => ({ ...prev, [csoportId]: true }));
    const res = await decideCsoportMeghivas(csoportId, elfogadott);
    setDeciding(prev => ({ ...prev, [csoportId]: false }));
    if (res.success) {
      const updated = invites.filter(i => (i.csoport_id ?? i.id) !== csoportId);
      setInvites(updated);
      if (onCountChange) onCountChange(updated.length);
    } else {
      setError(res.message || 'Hiba a döntés során');
    }
  };

  if (loading) {
    return (
      <div className="pi-loading">
        <div className="pi-spinner" />
        <span>Meghívások betöltése...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pi-error">
        <span>⚠️ {error}</span>
        <button className="pi-retry-btn" onClick={load}>Újra</button>
      </div>
    );
  }

  if (invites.length === 0) {
    return (
      <div className="pi-empty">
        <div className="pi-empty-icon">📭</div>
        <p className="pi-empty-title">Nincsenek függő meghívások</p>
        <p className="pi-empty-sub">Ha valaki meghív egy csoportba, itt fog megjelenni.</p>
      </div>
    );
  }

  return (
    <div className="pi-list">
      {invites.map((invite) => {
        const csoportId = invite.csoport_id ?? invite.id;
        const isDeciding = deciding[csoportId];

        return (
          <div key={csoportId} className="pi-card">
            <div className="pi-card-icon">👥</div>
            <div className="pi-card-body">
              <div className="pi-card-name">{invite.csoport?.nev ?? invite.csoport_nev ?? 'Ismeretlen csoport'}</div>
              {invite.meghivo_nev && (
                <div className="pi-card-meta">
                  <span className="pi-card-meta-label">Meghívó:</span> {invite.meghivo_nev}
                </div>
              )}
              {invite.csoport?.tipus && (
                <div className="pi-card-meta">
                  <span className="pi-card-meta-label">Típus:</span> {invite.csoport.tipus}
                </div>
              )}
              {invite.created_at && (
                <div className="pi-card-meta pi-card-date">
                  {new Date(invite.created_at).toLocaleDateString('hu-HU', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </div>
              )}
            </div>
            <div className="pi-card-actions">
              <button
                className="pi-btn pi-btn-accept"
                disabled={isDeciding}
                onClick={() => handleDecision(csoportId, 1)}
              >
                {isDeciding ? '...' : '✓ Elfogad'}
              </button>
              <button
                className="pi-btn pi-btn-reject"
                disabled={isDeciding}
                onClick={() => handleDecision(csoportId, 0)}
              >
                {isDeciding ? '...' : '✕ Elutasít'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

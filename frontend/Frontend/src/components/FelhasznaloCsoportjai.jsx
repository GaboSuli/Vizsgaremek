import React, { useEffect, useState } from "react";
import { getFelhasznaloCsoportjai } from "../services/api";
import { useNavigate } from "react-router-dom";

function getRoleLabel(level) {
  const lvl = Number(level);
  if (lvl >= 2) return 'Admin';
  if (lvl === 1) return 'Moderátor';
  return 'Tag';
}
function getRoleBadge(level) {
  const lvl = Number(level);
  if (lvl >= 2) return 'danger';
  if (lvl === 1) return 'warning';
  return 'gray';
}

function FelhasznaloCsoportjai() {
  const [csoportok, setCsoportok] = useState([]);
  const [hiba, setHiba] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getFelhasznaloCsoportjai()
      .then(data => setCsoportok(Array.isArray(data) ? data : []))
      .catch(err => setHiba(err.message || "Hiba történt"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state"><div className="spinner"/><span>Betöltés...</span></div>;
  if (hiba) return <div className="alert alert-danger">{hiba}</div>;

  return (
    <div>
      <div className="section-header">
        <h3 className="section-title">Csoportjaim</h3>
      </div>
      {csoportok.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <div className="empty-state-title">Még nincsenek csoportjaid</div>
        </div>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
          {csoportok.map(csoport => (
            <button
              key={csoport.id || csoport.CsoportId}
              className="group-card"
              onClick={() => navigate(`/csoport/${csoport.id || csoport.CsoportId}`)}
            >
              <div className="group-card-avatar">
                {(csoport.megnevezes || csoport.Becenev || 'G').charAt(0).toUpperCase()}
              </div>
              <div className="group-card-body">
                <div className="group-card-name">{csoport.megnevezes || csoport.Becenev}</div>
                <div className="group-card-meta">
                  <span className={`badge badge-${getRoleBadge(csoport.jogosultsag_szint || csoport.JogosultsagSzint)}`}>
                    {getRoleLabel(csoport.jogosultsag_szint || csoport.JogosultsagSzint)}
                  </span>
                </div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="group-card-arrow">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FelhasznaloCsoportjai;


  useEffect(() => {
    setLoading(true);
    getFelhasznaloCsoportjai()
      .then(data => setCsoportok(Array.isArray(data) ? data : []))
      .catch(err => setHiba(err.message || "Hiba történt"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Betöltés...</div>;
  if (hiba) return <div style={{color:'red'}}>Hiba: {hiba}</div>;

  return (
    <div>
      <h3>Csoportjaim</h3>
      {csoportok.length === 0 ? (
        <div>Nincs még csoportod.</div>
      ) : (
        <ul style={{listStyle:'none', padding:0}}>
          {csoportok.map(csoport => (
            <li
              key={csoport.id || csoport.CsoportId}
              style={{ marginBottom: 8 }}
            >
              <button
                style={{
                  background: '#f5faff',
                  border: '1px solid #007bff',
                  color: '#007bff',
                  borderRadius: 4,
                  padding: '6px 16px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textDecoration: 'underline',
                  width: '100%',
                  textAlign: 'left'
                }}
                onClick={() => navigate(`/csoport/${csoport.id || csoport.CsoportId}`)}
              >
                {csoport.megnevezes || csoport.Becenev} <span style={{fontSize:12, color:'#555'}}>– jogosultság: {csoport.jogosultsag_szint || csoport.JogosultsagSzint}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FelhasznaloCsoportjai;

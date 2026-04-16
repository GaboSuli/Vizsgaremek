import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../services/api.js';
import useAuth from '../context/useAuth.js';
import './LandingPage.css';

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color + '18', color }}>
        {icon}
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value ?? '—'}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [csoportok, setCsoportok] = useState([]);
  const [listak, setListak] = useState([]);
  const [haviKolts, setHaviKolts] = useState(null);
  const [eviKolts, setEviKolts] = useState(null);
  const [osszKolts, setOsszKolts] = useState([]);
  const [loadingKolts, setLoadingKolts] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingLists, setLoadingLists] = useState(true);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [creating, setCreating] = useState(false);

  const displayName = user ? (user.Nev || user.nev || user.name || 'Felhasználó') : 'Felhasználó';
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Jó reggelt';
    if (h < 17) return 'Jó napot';
    return 'Jó estét';
  };

  useEffect(() => {
    setLoadingKolts(true);
    Promise.all([
      apiCall('/felhasznalo/eHaviKoltesei'),
      apiCall('/felhasznalo/eEviKoltesei'),
      apiCall('/felhasznalo/osszKoltesei'),
    ]).then(([havi, evi, ossz]) => {
      if (havi.success) setHaviKolts(Array.isArray(havi.data) ? havi.data : []);
      if (evi.success) setEviKolts(Array.isArray(evi.data) ? evi.data : []);
      if (ossz.success) setOsszKolts(Array.isArray(ossz.data) ? ossz.data : []);
    }).catch(() => {}).finally(() => setLoadingKolts(false));
  }, []);

  useEffect(() => {
    setLoadingGroups(true);
    apiCall('/felhasznalo/csoportjai')
      .then(r => { setCsoportok(Array.isArray(r.data) ? r.data : []); })
      .catch(() => setCsoportok([]))
      .finally(() => setLoadingGroups(false));
  }, []);

  useEffect(() => {
    setLoadingLists(true);
    apiCall('/felhasznalo/vevesiListak')
      .then(r => { setListak(Array.isArray(r.data) ? r.data : []); })
      .catch(() => setListak([]))
      .finally(() => setLoadingLists(false));
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setCreating(true);
    try {
      const res = await apiCall('/csoport/create', 'POST', { csoport_tipus_id: 1, megnevezes: newGroupName.trim() });
      if (res.success) {
        setShowNewGroupModal(false);
        setNewGroupName('');
        const r = await apiCall('/felhasznalo/csoportjai');
        setCsoportok(Array.isArray(r.data) ? r.data : []);
      }
    } catch {}
    finally { setCreating(false); }
  };

  const sumKolts = (arr) => {
    if (!Array.isArray(arr)) return null;
    return arr.reduce((s, row) => s + Number(row.Osszegzett ?? 0), 0);
  };

  const formatFt = (val) => {
    if (val == null) return '—';
    const arr = Array.isArray(val) ? val : null;
    const num = arr ? sumKolts(arr) : (typeof val === 'object' ? (val.Osszegzett ?? val.osszeg ?? val.total ?? val.sum ?? Object.values(val)[0] ?? 0) : val);
    if (num == null) return '—';
    return Number(num).toLocaleString('hu-HU') + ' Ft';
  };

  return (
    <div className="dashboard">
      {/* Welcome header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-greeting">{greeting()}, {displayName}! 👋</h1>
          <p className="dashboard-sub">Áttekintés a legfontosabb adataidról</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/shopping')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Új lista
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewGroupModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Új csoport
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <StatCard
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" stroke="none"/></svg>}
          label="Havi kiadás"
          value={loadingKolts ? '...' : formatFt(haviKolts)}
          sub="Ebben a hónapban"
          color="var(--clr-primary)"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
          label="Éves kiadás"
          value={loadingKolts ? '...' : formatFt(eviKolts)}
          sub="Ebben az évben"
          color="var(--clr-success)"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          label="Csoportok"
          value={loadingGroups ? '...' : csoportok.length}
          sub="Aktív csoport"
          color="var(--clr-purple)"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
          label="Vevési listák"
          value={loadingLists ? '...' : listak.length}
          sub="Összes lista"
          color="var(--clr-warning)"
        />
      </div>

      <div className="dashboard-grid">
        {/* Groups */}
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Csoportjaim</h2>
              <p className="section-subtitle">Kattints egy csoportra a részletekért</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/groups')}>
              Összes megtekintése →
            </button>
          </div>

          {loadingGroups ? (
            <div className="loading-state"><div className="spinner"/><span>Betöltés...</span></div>
          ) : csoportok.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <div className="empty-state-title">Még nincsenek csoportjaid</div>
              <div className="empty-state-sub">Hozz létre egy csoportot és hívj meg másokat!</div>
              <button className="btn btn-primary btn-sm" style={{marginTop:'12px'}} onClick={() => setShowNewGroupModal(true)}>
                Csoport létrehozása
              </button>
            </div>
          ) : (
            <div className="dashboard-groups-grid">
              {csoportok.slice(0, 6).map(g => (
                <button
                  key={g.id || g.CsoportId}
                  className="group-card"
                  onClick={() => navigate(`/csoport/${g.id || g.CsoportId}`)}
                >
                  <div className="group-card-avatar">
                    {(g.megnevezes || g.Megnevezes || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div className="group-card-body">
                    <div className="group-card-name">{g.megnevezes || g.Megnevezes || 'Csoport'}</div>
                    <div className="group-card-meta">
                      <span className={`badge badge-${getRoleBadge(g.jogosultsag_szint ?? g.JogosultsagSzint)}`}>
                        {getRoleLabel(g.jogosultsag_szint ?? g.JogosultsagSzint)}
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
        </section>

        {/* Recent Lists */}
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Legutóbbi listák</h2>
              <p className="section-subtitle">Vevési listáid áttekintése</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/shopping')}>
              Összes megtekintése →
            </button>
          </div>

          {loadingLists ? (
            <div className="loading-state"><div className="spinner"/><span>Betöltés...</span></div>
          ) : listak.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <div className="empty-state-title">Még nincsenek listáid</div>
              <div className="empty-state-sub">Kezdj el tervezni a következő bevásárlást!</div>
              <button className="btn btn-primary btn-sm" style={{marginTop:'12px'}} onClick={() => navigate('/shopping')}>
                Lista létrehozása
              </button>
            </div>
          ) : (
            <div className="card" style={{overflow:'hidden'}}>
              {listak.slice(0, 5).map((lista, i) => (
                <div
                  key={lista.id || i}
                  className="list-row"
                  onClick={() => navigate('/shopping')}
                  style={{cursor:'pointer'}}
                >
                  <div className="list-row-icon">🛒</div>
                  <div className="list-row-body">
                    <div className="list-row-name">
                      {lista.megnevezes || lista.Megnevezes || `Lista #${lista.id || i + 1}`}
                    </div>
                    <div className="list-row-meta">
                      {lista.created_at ? new Date(lista.created_at).toLocaleDateString('hu-HU') : ''}
                    </div>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{color:'var(--clr-text-3)', flexShrink:0}}>
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Category spending breakdown */}
      {osszKolts.length > 0 && (
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Kategóriák szerinti kiadások</h2>
              <p className="section-subtitle">Összes kiadásod alkategória bontásban</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/stats')}>Statisztikák →</button>
          </div>
          <div className="card db-cats">
            {(() => {
              const total = osszKolts.reduce((s, r) => s + Number(r.Osszegzett ?? 0), 0);
              const sorted = [...osszKolts].sort((a, b) => Number(b.Osszegzett) - Number(a.Osszegzett)).slice(0, 8);
              return sorted.map((row, i) => {
                const pct = total > 0 ? Math.round((Number(row.Osszegzett) / total) * 100) : 0;
                const colors = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#14b8a6'];
                return (
                  <div key={i} className="db-cat-row">
                    <div className="db-cat-name">{row.megnevezes}</div>
                    <div className="db-cat-bar-wrap">
                      <div className="db-cat-bar" style={{ width: pct + '%', background: colors[i % colors.length] }} />
                    </div>
                    <div className="db-cat-amount">{Number(row.Osszegzett).toLocaleString('hu-HU')} Ft</div>
                    <div className="db-cat-pct">{pct}%</div>
                  </div>
                );
              });
            })()}
          </div>
        </section>
      )}

      {/* Quick actions */}
      <section className="section">
        <h2 className="section-title" style={{marginBottom:'16px'}}>Gyors műveletek</h2>
        <div className="dashboard-quick-grid">
          {[
            { icon: '📊', label: 'Statisztikák', sub: 'Kiadások áttekintése', path: '/stats', color: '#6366f1' },
            { icon: '🎟️', label: 'Kuponok', sub: 'Kedvezmények kezelése', path: '/kupon', color: '#f59e0b' },
            { icon: '✉️', label: 'Kapcsolat', sub: 'Írj nekünk', path: '/contact', color: '#06b6d4' },
            { icon: '👤', label: 'Profil', sub: 'Adatok szerkesztése', path: '/user', color: '#10b981' },
          ].map((item, i) => (
            <button key={i} className="quick-card" onClick={() => navigate(item.path)}>
              <div className="quick-card-icon" style={{color: item.color}}>{item.icon}</div>
              <div>
                <div className="quick-card-label">{item.label}</div>
                <div className="quick-card-sub">{item.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* New group modal */}
      {showNewGroupModal && (
        <div className="modal-overlay" onClick={() => setShowNewGroupModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Új csoport létrehozása</h3>
              <button className="modal-close" onClick={() => setShowNewGroupModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateGroup}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Csoport neve</label>
                  <input className="form-control" value={newGroupName}
                    onChange={e => setNewGroupName(e.target.value)} placeholder="Pl. Vasárnapi bevásárlás" required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewGroupModal(false)}>Mégse</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Létrehozás...' : 'Létrehozás'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

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


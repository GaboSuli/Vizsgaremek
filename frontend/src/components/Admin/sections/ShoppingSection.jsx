import React, { useState, useEffect } from 'react';
import { getAdminShoppingActivity } from '../../../services/adminService.js';

function fmtDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return '—'; }
}

function fmtCur(n) {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toLocaleString('hu-HU') + ' Ft';
}

export default function ShoppingSection({ onToast }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getAdminShoppingActivity();
        if (res.success) {
          const d = res.data;
          setLists(Array.isArray(d) ? d : (d?.data ? d.data : []));
        } else {
          setError(res.message || 'Nem sikerült betölteni az aktivitást.');
        }
      } catch { setError('Hálózati hiba.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = lists.filter(item => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      String(item.id || '').includes(q) ||
      (item.felhasznalo?.nev || '').toLowerCase().includes(q) ||
      String(item.felhasznalo_id || '').includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="adm2-section">
      <div className="adm2-section-head">
        <div>
          <h2 className="adm2-section-title">Bevásárlólista aktivitás</h2>
          <p className="adm2-section-sub">Legfrissebb bevásárlólista aktivitás az admin végponton</p>
        </div>
      </div>

      <div className="adm2-toolbar">
        <div className="adm2-search">
          <SearchIcon />
          <input placeholder="Keresés ID vagy felhasználó alapján..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          {search && <button className="adm2-search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <span className="adm2-result-count">{filtered.length} találat</span>
      </div>

      {loading ? (
        <div className="adm2-loading"><div className="adm2-spinner" /><span>Betöltés...</span></div>
      ) : error ? (
        <div className="adm2-error-box">
          <p>{error}</p>
          <small>Az admin végpont lehet, hogy nem elérhető az API-n keresztül (web route). Az adat betöltéséhez szükség lehet közvetlen hozzáférésre.</small>
        </div>
      ) : pageItems.length === 0 ? (
        <div className="adm2-empty"><ShoppingIcon /><p>Nincs aktivitás</p></div>
      ) : (
        <div className="adm2-table-wrap">
          <table className="adm2-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Felhasználó</th>
                <th>Csoport</th>
                <th>Összeg</th>
                <th>Létrehozva</th>
                <th>Módosítva</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="adm2-cell-id">{item.id || '—'}</td>
                  <td>
                    <div className="adm2-user-cell">
                      <div className="adm2-avatar-sm">{String(item.felhasznalo?.nev || item.felhasznalo_id || '?').charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="adm2-cell-name">{item.felhasznalo?.nev || '—'}</div>
                        <div className="adm2-cell-sub">ID: {item.felhasznalo_id || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td>{item.csoport_id ? <span className="adm2-badge adm2-badge--info">Csoport #{item.csoport_id}</span> : <span className="adm2-badge adm2-badge--ghost">Személyes</span>}</td>
                  <td>{item.vevesi_objektumok ? fmtCur(item.vevesi_objektumok.reduce((a, b) => a + (b.ar * (b.mennyiseg || 1)), 0)) : '—'}</td>
                  <td className="adm2-cell-date">{fmtDate(item.created_at)}</td>
                  <td className="adm2-cell-date">{fmtDate(item.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="adm2-pagination">
          <button className="adm2-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = Math.max(1, page - 2) + i;
            return p <= totalPages ? (
              <button key={p} className={`adm2-page-btn ${p === page ? 'adm2-page-btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ) : null;
          })}
          <button className="adm2-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}
    </div>
  );
}

const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const ShoppingIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;

import React, { useState, useMemo } from 'react';
import Avatar from '../../Profile/Avatar.jsx';
import ConfirmDialog from '../../ui/ConfirmDialog.jsx';
import { deleteUser } from '../../../services/adminService.js';
import useAuth from '../../../context/useAuth.js';
import { useDebounce } from '../../../hooks/useDebounce.js';

/* ── Helpers ───────────────────────────────────────── */
function fmtDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return '—'; }
}

function roleInfo(lvl) {
  if (lvl === 255) return { label: 'Admin', cls: 'admin' };
  if (lvl > 0) return { label: 'Moderátor', cls: 'mod' };
  return { label: 'Felhasználó', cls: 'user' };
}

/* ── Main Component ───────────────────────────────── */
export default function UsersSection({ data, loading, onRefresh, onToast }) {
  const { user: me } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const PER_PAGE = 15;

  const users = data.users || [];

  const debouncedSearch = useDebounce(search, 200);

  const filtered = useMemo(() => {
    let list = [...users];
    const q = debouncedSearch.toLowerCase().trim();
    if (q) list = list.filter(u => (u.nev || u.Nev || '').toLowerCase().includes(q) || (u.email || u.Email || '').toLowerCase().includes(q));
    if (roleFilter !== 'all') {
      list = list.filter(u => {
        const l = u.jogosultsag_szint ?? u.Jogosultsag_szint ?? 0;
        if (roleFilter === 'admin') return l === 255;
        if (roleFilter === 'mod') return l > 0 && l < 255;
        return l === 0;
      });
    }
    list.sort((a, b) => {
      let va = a[sortBy] ?? a[sortBy.charAt(0).toUpperCase() + sortBy.slice(1)] ?? '';
      let vb = b[sortBy] ?? b[sortBy.charAt(0).toUpperCase() + sortBy.slice(1)] ?? '';
      if (sortBy === 'jogosultsag_szint') { va = a.jogosultsag_szint ?? a.Jogosultsag_szint ?? 0; vb = b.jogosultsag_szint ?? b.Jogosultsag_szint ?? 0; }
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return list;
  }, [users, debouncedSearch, roleFilter, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const page_users = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const SortArrow = ({ col }) => (
    <span className={`adm2-sort-arrow ${sortBy === col ? 'adm2-sort--active' : ''}`}>
      {sortBy === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteUser(deleteTarget.id);
      if (res.success) { onToast?.('Felhasználó törölve.', 'success'); onRefresh?.(); }
      else onToast?.(res.message || 'Hiba a törlés során.', 'error');
    } catch { onToast?.('Hálózati hiba.', 'error'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  return (
    <div className="adm2-section">
      <div className="adm2-section-head">
        <div>
          <h2 className="adm2-section-title">Felhasználók kezelése</h2>
          <p className="adm2-section-sub">{users.length} regisztrált felhasználó</p>
        </div>
      </div>

      {/* Filters */}
      <div className="adm2-toolbar">
        <div className="adm2-search">
          <SearchIcon />
          <input
            placeholder="Keresés név vagy email alapján..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && <button className="adm2-search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className="adm2-filters">
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="all">Minden szerepkör</option>
            <option value="admin">Admin</option>
            <option value="mod">Moderátor</option>
            <option value="user">Felhasználó</option>
          </select>
        </div>
        <span className="adm2-result-count">{filtered.length} találat</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="adm2-loading"><div className="adm2-spinner" /><span>Betöltés...</span></div>
      ) : page_users.length === 0 ? (
        <div className="adm2-empty"><EmptyIcon /><p>Nincs találat</p></div>
      ) : (
        <div className="adm2-table-wrap">
          <table className="adm2-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('nev')} className="adm2-th-sort">Felhasználó <SortArrow col="nev" /></th>
                <th onClick={() => toggleSort('email')} className="adm2-th-sort">Email <SortArrow col="email" /></th>
                <th onClick={() => toggleSort('jogosultsag_szint')} className="adm2-th-sort">Szerepkör <SortArrow col="jogosultsag_szint" /></th>
                <th onClick={() => toggleSort('created_at')} className="adm2-th-sort">Regisztráció <SortArrow col="created_at" /></th>
                <th className="adm2-th-actions">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {page_users.map(u => {
                const name = u.nev || u.Nev || 'Ismeretlen';
                const email = u.email || u.Email || '—';
                const lvl = u.jogosultsag_szint ?? u.Jogosultsag_szint ?? 0;
                const role = roleInfo(lvl);
                const isSelf = u.id === me?.id;
                return (
                  <tr key={u.id ?? u.Id ?? u.email} className={isSelf ? 'adm2-tr--self' : ''}>
                    <td>
                      <div className="adm2-user-cell">
                        <Avatar src={u.profilkep_url} name={name} size="sm" />
                        <div>
                          <div className="adm2-cell-name">{name}{isSelf && <span className="adm2-you-badge">Te</span>}</div>
                          {u.becenev && <div className="adm2-cell-sub">@{u.becenev}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="adm2-cell-email">{email}</td>
                    <td><span className={`adm2-role-badge adm2-role--${role.cls}`}>{role.label}</span></td>
                    <td className="adm2-cell-date">{fmtDate(u.created_at)}</td>
                    <td>
                      <div className="adm2-row-actions">
                        <button
                          className="adm2-icon-btn adm2-icon-btn--danger"
                          title={isSelf ? 'Saját fiókod nem törölheted' : 'Törlés'}
                          disabled={isSelf}
                          onClick={() => !isSelf && setDeleteTarget(u)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="adm2-pagination">
          <button className="adm2-page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
          <button className="adm2-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = Math.max(1, Math.min(page - 3, totalPages - 6)) + i;
            return p <= totalPages ? (
              <button key={p} className={`adm2-page-btn ${p === page ? 'adm2-page-btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ) : null;
          })}
          <button className="adm2-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
          <button className="adm2-page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
          <span className="adm2-page-info">{page} / {totalPages} oldal</span>
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Felhasználó törlése"
        message={`Biztosan törölni szeretnéd: ${deleteTarget?.nev || deleteTarget?.Nev || ''}? Ez nem vonható vissza.`}
        confirmLabel="Törlés"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

/* ── Icons ───────────────────────────────────────── */
const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const TrashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const EmptyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;

import React, { useState, useMemo } from 'react';
import ConfirmDialog from '../../ui/ConfirmDialog.jsx';
import { deleteGroup } from '../../../services/adminService.js';
import { useDebounce } from '../../../hooks/useDebounce.js';

function fmtDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return '—'; }
}

export default function GroupsSection({ data, loading, onRefresh, onToast }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const PER_PAGE = 12;

  const groups = data.groups || [];

  const debouncedSearch = useDebounce(search, 200);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return groups;
    return groups.filter(g =>
      (g.megnevezes || g.nev || g.Nev || '').toLowerCase().includes(q) ||
      String(g.id || '').includes(q)
    );
  }, [groups, debouncedSearch]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const page_groups = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteGroup(deleteTarget.id);
      if (res.success) { onToast?.('Csoport törölve.', 'success'); onRefresh?.(); }
      else onToast?.(res.message || 'Hiba a törlés során.', 'error');
    } catch { onToast?.('Hálózati hiba.', 'error'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  return (
    <div className="adm2-section">
      <div className="adm2-section-head">
        <div>
          <h2 className="adm2-section-title">Csoportok kezelése</h2>
          <p className="adm2-section-sub">{groups.length} aktív csoport</p>
        </div>
      </div>

      {/* Search */}
      <div className="adm2-toolbar">
        <div className="adm2-search">
          <SearchIcon />
          <input
            placeholder="Keresés csoport neve alapján..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && <button className="adm2-search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <span className="adm2-result-count">{filtered.length} találat</span>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="adm2-loading"><div className="adm2-spinner" /><span>Betöltés...</span></div>
      ) : page_groups.length === 0 ? (
        <div className="adm2-empty"><GroupEmptyIcon /><p>Nincs csoport</p></div>
      ) : (
        <div className="adm2-groups-grid">
          {page_groups.map(g => {
            const name = g.megnevezes || g.nev || g.Nev || 'Névtelen csoport';
            const initial = (name[0] || 'C').toUpperCase();
            const type = g.csoport_tipus_id ?? g.tipus ?? '—';
            return (
              <div key={g.id} className="adm2-group-card">
                <div className="adm2-group-avatar">{initial}</div>
                <div className="adm2-group-info">
                  <span className="adm2-group-name">{name}</span>
                  <span className="adm2-group-meta">
                    <span>ID: {g.id}</span>
                    <span>Típus: {type}</span>
                  </span>
                  <span className="adm2-group-date">{fmtDate(g.created_at)}</span>
                </div>
                <button
                  className="adm2-icon-btn adm2-icon-btn--danger"
                  title="Törlés"
                  onClick={() => setDeleteTarget(g)}
                >
                  <TrashIcon />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
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
          <span className="adm2-page-info">{page} / {totalPages}</span>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Csoport törlése"
        message={`Biztosan törölni szeretnéd: "${deleteTarget?.megnevezes || deleteTarget?.nev || ''}"?`}
        confirmLabel="Törlés"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const TrashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const GroupEmptyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>;

import React, { useState, useMemo } from 'react';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import { deleteGroup } from '../../services/adminService.js';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

export default function GroupManagement({ groups, loading, onRefresh, onToast }) {
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (!groups) return [];
    const q = search.toLowerCase().trim();
    if (!q) return groups;
    return groups.filter(g => {
      const name = (g.nev || g.Nev || g.name || '').toLowerCase();
      return name.includes(q);
    });
  }, [groups, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteGroup(deleteTarget.id);
      if (res.success) {
        onToast?.('Csoport sikeresen törölve.', 'success');
        onRefresh?.();
      } else {
        onToast?.(res.message || 'Hiba a törlés során.', 'error');
      }
    } catch {
      onToast?.('Hálózati hiba.', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <span className="admin-loading-text">Csoportok betöltése...</span>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
          Csoportok kezelése
        </h2>
        <div className="admin-section-actions">
          <div className="admin-search">
            <span className="admin-search-icon"><SearchIcon /></span>
            <input
              type="text"
              placeholder="Keresés csoport névre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="admin-section-body">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <h3>{search ? 'Nincs találat' : 'Nincsenek csoportok'}</h3>
            <p>{search ? 'Próbálj más keresési kifejezést.' : 'Még nem hoztak létre csoportot.'}</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Csoport neve</th>
                  <th>Típus</th>
                  <th>Létrehozva</th>
                  <th style={{ width: 80 }}>Művelet</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(group => {
                  const name = group.nev || group.Nev || group.name || 'Névtelen';
                  const type = group.csoport_tipus_id ?? group.tipus ?? '—';
                  const date = group.created_at ? new Date(group.created_at).toLocaleDateString('hu-HU') : '—';

                  return (
                    <tr key={group.id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-avatar" style={{ background: 'linear-gradient(135deg, var(--clr-success) 0%, var(--clr-info) 100%)' }}>
                            {(name[0] || 'C').toUpperCase()}
                          </div>
                          <div className="admin-user-details">
                            <div className="admin-user-name">{name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-status-badge admin-status-badge--active">
                          <span className="admin-status-dot" />
                          Típus: {type}
                        </span>
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>{date}</td>
                      <td>
                        <div className="admin-action-group">
                          <button
                            className="admin-action-btn admin-action-btn--danger"
                            title="Csoport törlése"
                            onClick={() => setDeleteTarget(group)}
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
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Csoport törlése"
        message={`Biztosan törölni szeretnéd a "${deleteTarget?.nev || deleteTarget?.Nev || deleteTarget?.name || 'Névtelen'}" csoportot? Ez a művelet nem vonható vissza.`}
        confirmLabel="Törlés"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

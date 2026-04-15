import React, { useState, useMemo } from 'react';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import { deleteUser } from '../../services/adminService.js';
import Avatar from '../Profile/Avatar.jsx';

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

function getRoleBadge(level) {
  if (level === 255) return <span className="admin-role-badge admin-role-badge--admin">Admin</span>;
  if (level > 0) return <span className="admin-role-badge admin-role-badge--moderator">Moderátor</span>;
  return <span className="admin-role-badge admin-role-badge--user">Felhasználó</span>;
}

function getInitials(name) {
  return (name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function UserManagement({ users, loading, onRefresh, onToast }) {
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(u => {
      const name = (u.nev || u.Nev || '').toLowerCase();
      const email = (u.email || u.Email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [users, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteUser(deleteTarget.id);
      if (res.success) {
        onToast?.('Felhasználó sikeresen törölve.', 'success');
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
        <span className="admin-loading-text">Felhasználók betöltése...</span>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Felhasználók kezelése
        </h2>
        <div className="admin-section-actions">
          <div className="admin-search">
            <span className="admin-search-icon"><SearchIcon /></span>
            <input
              type="text"
              placeholder="Keresés név vagy email..."
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <h3>{search ? 'Nincs találat' : 'Nincsenek felhasználók'}</h3>
            <p>{search ? 'Próbálj más keresési kifejezést.' : 'Még nem regisztrált senki.'}</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Felhasználó</th>
                  <th>Szerepkör</th>
                  <th>Regisztráció</th>
                  <th style={{ width: 80 }}>Művelet</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => {
                  const name = user.nev || user.Nev || 'Ismeretlen';
                  const email = user.email || user.Email || '';
                  const level = user.jogosultsag_szint ?? user.Jogosultsag_szint ?? 0;
                  const date = user.created_at ? new Date(user.created_at).toLocaleDateString('hu-HU') : '—';

                  return (
                    <tr key={user.id}>
                      <td data-label="Felhasználó">
                        <div className="admin-user-cell">
                          <Avatar src={user.profilkep_url} name={name} size="sm" className="admin-user-avatar" />
                          <div className="admin-user-details">
                            <div className="admin-user-name">{name}</div>
                            <div className="admin-user-email">{email}</div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Szerepkör">{getRoleBadge(level)}</td>
                      <td data-label="Regisztráció" style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>{date}</td>
                      <td data-label="Művelet">
                        <div className="admin-action-group">
                          <button
                            className="admin-action-btn admin-action-btn--danger"
                            title="Felhasználó törlése"
                            onClick={() => setDeleteTarget(user)}
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
        title="Felhasználó törlése"
        message={`Biztosan törölni szeretnéd a következő felhasználót: "${deleteTarget?.nev || deleteTarget?.Nev || 'Ismeretlen'}"? Ez a művelet nem vonható vissza.`}
        confirmLabel="Törlés"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

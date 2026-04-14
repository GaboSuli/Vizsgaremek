import React, { useState, useMemo } from 'react';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import { deleteCoupon } from '../../services/adminService.js';

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

function formatDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('hu-HU'); } catch { return '—'; }
}

export default function CouponModerator({ coupons, loading, onRefresh, onToast }) {
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (!coupons) return [];
    const q = search.toLowerCase().trim();
    if (!q) return coupons;
    return coupons.filter(c => {
      const code = (c.kod || c.code || '').toLowerCase();
      const desc = (c.leiras || c.description || '').toLowerCase();
      return code.includes(q) || desc.includes(q);
    });
  }, [coupons, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteCoupon(deleteTarget.id);
      if (res.success) {
        onToast?.('Kupon sikeresen törölve.', 'success');
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
        <span className="admin-loading-text">Kuponok betöltése...</span>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
          </svg>
          Kupon moderátor
        </h2>
        <div className="admin-section-actions">
          <div className="admin-search">
            <span className="admin-search-icon"><SearchIcon /></span>
            <input
              type="text"
              placeholder="Keresés kuponkódra..."
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
                <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
              </svg>
            </div>
            <h3>{search ? 'Nincs találat' : 'Nincsenek kuponok'}</h3>
            <p>{search ? 'Próbálj más keresési kifejezést.' : 'Még nincsenek kuponok a rendszerben.'}</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Kuponkód</th>
                  <th>Kedvezmény</th>
                  <th>Bolt</th>
                  <th>Lejárat</th>
                  <th style={{ width: 80 }}>Művelet</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(coupon => {
                  const code = coupon.kod || coupon.code || '—';
                  const discount = coupon.kedvezmeny ?? coupon.discount ?? '—';
                  const shop = coupon.bolt || coupon.shop || '—';
                  const expiry = formatDate(coupon.lejarati_datum || coupon.expiry);
                  const isExpired = coupon.lejarati_datum && new Date(coupon.lejarati_datum) < new Date();

                  return (
                    <tr key={coupon.id}>
                      <td>
                        <code style={{
                          background: 'var(--clr-primary-light)',
                          color: 'var(--clr-primary)',
                          padding: '3px 8px',
                          borderRadius: 'var(--r-sm)',
                          fontWeight: 'var(--fw-semibold)',
                          fontSize: 'var(--text-xs)',
                        }}>
                          {code}
                        </code>
                      </td>
                      <td>
                        <span style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--clr-success)' }}>
                          {discount}%
                        </span>
                      </td>
                      <td style={{ color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)' }}>{shop}</td>
                      <td>
                        <span className={`admin-status-badge ${isExpired ? 'admin-status-badge--inactive' : 'admin-status-badge--active'}`}>
                          <span className="admin-status-dot" />
                          {expiry}
                        </span>
                      </td>
                      <td>
                        <div className="admin-action-group">
                          <button
                            className="admin-action-btn admin-action-btn--danger"
                            title="Kupon törlése"
                            onClick={() => setDeleteTarget(coupon)}
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
        title="Kupon törlése"
        message={`Biztosan törölni szeretnéd a "${deleteTarget?.kod || deleteTarget?.code || '—'}" kuponkódot? Ez a művelet nem vonható vissza.`}
        confirmLabel="Törlés"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

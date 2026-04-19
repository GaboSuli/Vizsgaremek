import React, { useState, useMemo } from 'react';
import ConfirmDialog from '../../ui/ConfirmDialog.jsx';
import { deleteContact } from '../../../services/adminService.js';
import { useDebounce } from '../../../hooks/useDebounce.js';

function fmtDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return '—'; }
}

/* ── Detail Modal ─────────────────────────────── */
function ContactDetailModal({ contact, onClose }) {
  return (
    <div className="adm2-modal-overlay" onClick={onClose}>
      <div className="adm2-modal" onClick={e => e.stopPropagation()}>
        <div className="adm2-modal-head">
          <h3>Üzenet részletei</h3>
          <button className="adm2-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="adm2-contact-detail">
          <div className="adm2-contact-field">
            <span className="adm2-field-label">Feladó</span>
            <span className="adm2-field-value">{contact.nev || contact.Nev || '—'}</span>
          </div>
          <div className="adm2-contact-field">
            <span className="adm2-field-label">Email</span>
            <span className="adm2-field-value">
              <a href={`mailto:${contact.email || contact.Email}`} className="adm2-link">{contact.email || contact.Email || '—'}</a>
            </span>
          </div>
          <div className="adm2-contact-field">
            <span className="adm2-field-label">Típus</span>
            <span className="adm2-field-value">{contact.contactTipusId || contact.contact_tipusok?.megnevezes || '—'}</span>
          </div>
          <div className="adm2-contact-field">
            <span className="adm2-field-label">Beküldve</span>
            <span className="adm2-field-value">{fmtDate(contact.created_at)}</span>
          </div>
          <div className="adm2-contact-field adm2-contact-field--full">
            <span className="adm2-field-label">Üzenet</span>
            <div className="adm2-contact-text">{contact.text || contact.uzenet || contact.message || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────── */
export default function ContactsSection({ data, loading, onRefresh, onToast }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const PER_PAGE = 15;

  const contacts = data.contacts || [];

  const debouncedSearch = useDebounce(search, 200);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return contacts;
    return contacts.filter(c =>
      (c.nev || c.Nev || '').toLowerCase().includes(q) ||
      (c.email || c.Email || '').toLowerCase().includes(q) ||
      (c.text || c.uzenet || '').toLowerCase().includes(q)
    );
  }, [contacts, debouncedSearch]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteContact(deleteTarget.id);
      if (res.success) { onToast?.('Üzenet törölve.', 'success'); onRefresh?.(); }
      else onToast?.(res.message || 'Hiba.', 'error');
    } catch { onToast?.('Hálózati hiba.', 'error'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  return (
    <div className="adm2-section">
      <div className="adm2-section-head">
        <div>
          <h2 className="adm2-section-title">Kapcsolatfelvételi üzenetek</h2>
          <p className="adm2-section-sub">{contacts.length} beérkezett üzenet</p>
        </div>
      </div>

      <div className="adm2-toolbar">
        <div className="adm2-search">
          <SearchIcon />
          <input placeholder="Keresés feladó, email vagy szöveg alapján..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          {search && <button className="adm2-search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <span className="adm2-result-count">{filtered.length} találat</span>
      </div>

      {loading ? (
        <div className="adm2-loading"><div className="adm2-spinner" /><span>Betöltés...</span></div>
      ) : pageItems.length === 0 ? (
        <div className="adm2-empty"><MailEmptyIcon /><p>Nincs üzenet</p></div>
      ) : (
        <div className="adm2-table-wrap">
          <table className="adm2-table">
            <thead>
              <tr>
                <th>Feladó</th>
                <th>Email</th>
                <th>Típus</th>
                <th>Üzenet</th>
                <th>Beküldve</th>
                <th className="adm2-th-actions">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((c, i) => {
                const name = c.nev || c.Nev || 'Ismeretlen';
                const email = c.email || c.Email || '—';
                const text = c.text || c.uzenet || c.message || '';
                const type = c.contact_tipusok?.megnevezes || c.contactTipusId || '—';
                return (
                  <tr key={c.id || i}>
                    <td>
                      <div className="adm2-user-cell">
                        <div className="adm2-avatar-sm">{name.charAt(0).toUpperCase()}</div>
                        <span className="adm2-cell-name">{name}</span>
                      </div>
                    </td>
                    <td className="adm2-cell-email">{email}</td>
                    <td>
                      {type !== '—'
                        ? <span className="adm2-badge adm2-badge--info">{type}</span>
                        : <span className="adm2-cell-sub">—</span>
                      }
                    </td>
                    <td className="adm2-cell-note">
                      <span title={text}>{text.slice(0, 60)}{text.length > 60 ? '…' : ''}</span>
                    </td>
                    <td className="adm2-cell-date">{fmtDate(c.created_at)}</td>
                    <td>
                      <div className="adm2-row-actions">
                        <button className="adm2-icon-btn adm2-icon-btn--view" title="Megtekintés" onClick={() => setViewTarget(c)}>
                          <EyeIcon />
                        </button>
                        <button className="adm2-icon-btn adm2-icon-btn--danger" title="Törlés" onClick={() => setDeleteTarget(c)}>
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

      {totalPages > 1 && (
        <div className="adm2-pagination">
          <button className="adm2-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = Math.max(1, page - 3) + i;
            return p <= totalPages ? (
              <button key={p} className={`adm2-page-btn ${p === page ? 'adm2-page-btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ) : null;
          })}
          <button className="adm2-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
          <span className="adm2-page-info">{page} / {totalPages}</span>
        </div>
      )}

      {viewTarget && <ContactDetailModal contact={viewTarget} onClose={() => setViewTarget(null)} />}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Üzenet törlése"
        message={`Biztosan törölni szeretnéd ezt az üzenetet? (${deleteTarget?.nev || deleteTarget?.Nev || 'Ismeretlen feladó'})`}
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
const EyeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const MailEmptyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;

import React, { useState, useMemo } from 'react';
import ConfirmDialog from '../../ui/ConfirmDialog.jsx';
import { createCoupon, updateCoupon, deleteCoupon } from '../../../services/adminService.js';

function fmtDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('hu-HU'); }
  catch { return '—'; }
}

function isExpired(d) {
  if (!d) return false;
  return new Date(d) < new Date();
}

const EMPTY_FORM = {
  kezdesi_datum: '',
  lejarasi_datum: '',
  kod: '',
  kedvezmeny: '',
  megjegyzes: '',
  hasznalasi_hely: '',
};

/* ── Coupon Form Modal ─────────────────────────── */
function CouponFormModal({ coupon, onClose, onSave }) {
  const isEdit = !!coupon;
  const [form, setForm] = useState(
    isEdit
      ? {
          kezdesi_datum: coupon.kezdesi_datum?.split('T')[0] || coupon.kezdesi_datum || '',
          lejarasi_datum: (coupon.lejarati_datum || coupon.lejarasi_datum)?.split('T')[0] || '',
          kod: coupon.kod || coupon.code || '',
          kedvezmeny: String(coupon.kedvezmeny ?? coupon.discount ?? ''),
          megjegyzes: coupon.megjegyzes || coupon.note || '',
          hasznalasi_hely: coupon.hasznalasi_hely || coupon.bolt || '',
        }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handle = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => { const n = { ...e }; delete n[name]; return n; });
  };

  const validate = () => {
    const errs = {};
    if (!form.kezdesi_datum) errs.kezdesi_datum = 'Kötelező';
    if (!form.lejarasi_datum) errs.lejarasi_datum = 'Kötelező';
    if (!form.kod.trim()) errs.kod = 'Kötelező';
    if (!form.kedvezmeny) errs.kedvezmeny = 'Kötelező';
    else if (isNaN(Number(form.kedvezmeny)) || Number(form.kedvezmeny) <= 0 || Number(form.kedvezmeny) > 100) errs.kedvezmeny = '1–100 közötti szám';
    if (!form.hasznalasi_hely.trim()) errs.hasznalasi_hely = 'Kötelező';
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { ...form, kedvezmeny: Number(form.kedvezmeny) };
      const res = isEdit ? await updateCoupon(coupon.id, payload) : await createCoupon(payload);
      if (res.success) { onSave(isEdit ? 'Kupon frissítve.' : 'Kupon létrehozva.'); onClose(); }
      else setErrors({ _global: res.message || 'Hiba a mentés során.' });
    } catch { setErrors({ _global: 'Hálózati hiba.' }); }
    finally { setSaving(false); }
  };

  return (
    <div className="adm2-modal-overlay" onClick={onClose}>
      <div className="adm2-modal adm2-modal--lg" onClick={e => e.stopPropagation()}>
        <div className="adm2-modal-head">
          <h3>{isEdit ? 'Kupon szerkesztése' : 'Új kupon létrehozása'}</h3>
          <button className="adm2-modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="adm2-form" onSubmit={submit}>
          <div className="adm2-form-grid">
            <div className="adm2-form-row">
              <label>Kuponkód *</label>
              <input name="kod" value={form.kod} onChange={handle} placeholder="pl. SUMMER20" className={errors.kod ? 'adm2-input--err' : ''} />
              {errors.kod && <span className="adm2-field-err">{errors.kod}</span>}
            </div>
            <div className="adm2-form-row">
              <label>Kedvezmény (%) *</label>
              <input name="kedvezmeny" type="number" min="1" max="100" value={form.kedvezmeny} onChange={handle} placeholder="pl. 15" className={errors.kedvezmeny ? 'adm2-input--err' : ''} />
              {errors.kedvezmeny && <span className="adm2-field-err">{errors.kedvezmeny}</span>}
            </div>
            <div className="adm2-form-row">
              <label>Felhasználási hely *</label>
              <input name="hasznalasi_hely" value={form.hasznalasi_hely} onChange={handle} placeholder="pl. Aldi, Lidl, Online" className={errors.hasznalasi_hely ? 'adm2-input--err' : ''} />
              {errors.hasznalasi_hely && <span className="adm2-field-err">{errors.hasznalasi_hely}</span>}
            </div>
            <div className="adm2-form-row">
              <label>Kezdési dátum *</label>
              <input name="kezdesi_datum" type="date" value={form.kezdesi_datum} onChange={handle} className={errors.kezdesi_datum ? 'adm2-input--err' : ''} />
              {errors.kezdesi_datum && <span className="adm2-field-err">{errors.kezdesi_datum}</span>}
            </div>
            <div className="adm2-form-row">
              <label>Lejárati dátum *</label>
              <input name="lejarasi_datum" type="date" value={form.lejarasi_datum} onChange={handle} className={errors.lejarasi_datum ? 'adm2-input--err' : ''} />
              {errors.lejarasi_datum && <span className="adm2-field-err">{errors.lejarasi_datum}</span>}
            </div>
            <div className="adm2-form-row adm2-form-row--full">
              <label>Megjegyzés</label>
              <textarea name="megjegyzes" value={form.megjegyzes} onChange={handle} placeholder="Opcionális megjegyzés..." rows={3} />
            </div>
          </div>
          {errors._global && <p className="adm2-form-err">{errors._global}</p>}
          <div className="adm2-form-actions">
            <button type="button" className="adm2-btn adm2-btn--ghost" onClick={onClose}>Mégse</button>
            <button type="submit" className="adm2-btn adm2-btn--primary" disabled={saving}>
              {saving && <span className="adm2-spinner-sm" />}
              {isEdit ? 'Mentés' : 'Létrehozás'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────── */
export default function CouponsSection({ data, loading, onRefresh, onToast }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [formTarget, setFormTarget] = useState(null); // null = closed, 'new' = create, obj = edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const PER_PAGE = 10;

  const coupons = data.coupons || [];

  const filtered = useMemo(() => {
    let list = [...coupons];
    const q = search.toLowerCase().trim();
    if (q) list = list.filter(c =>
      (c.kod || c.code || '').toLowerCase().includes(q) ||
      (c.hasznalasi_hely || c.bolt || '').toLowerCase().includes(q)
    );
    if (statusFilter === 'active') list = list.filter(c => !isExpired(c.lejarati_datum || c.lejarasi_datum || c.expiry));
    if (statusFilter === 'expired') list = list.filter(c => isExpired(c.lejarati_datum || c.lejarasi_datum || c.expiry));
    return list;
  }, [coupons, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteCoupon(deleteTarget.id);
      if (res.success) { onToast?.('Kupon törölve.', 'success'); onRefresh?.(); }
      else onToast?.(res.message || 'Hiba.', 'error');
    } catch { onToast?.('Hálózati hiba.', 'error'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  const activeCnt = coupons.filter(c => !isExpired(c.lejarati_datum || c.lejarasi_datum || c.expiry)).length;
  const expiredCnt = coupons.length - activeCnt;

  return (
    <div className="adm2-section">
      <div className="adm2-section-head">
        <div>
          <h2 className="adm2-section-title">Kuponok kezelése</h2>
          <p className="adm2-section-sub">
            {coupons.length} kupon · <span className="adm2-clr-success">{activeCnt} aktív</span> · <span className="adm2-clr-danger">{expiredCnt} lejárt</span>
          </p>
        </div>
        <button className="adm2-btn adm2-btn--primary" onClick={() => setFormTarget('new')}>
          <PlusIcon /> Új kupon
        </button>
      </div>

      <div className="adm2-toolbar">
        <div className="adm2-search">
          <SearchIcon />
          <input placeholder="Keresés kód vagy hely alapján..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          {search && <button className="adm2-search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className="adm2-filters">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="all">Minden állapot</option>
            <option value="active">Csak aktív</option>
            <option value="expired">Csak lejárt</option>
          </select>
        </div>
        <span className="adm2-result-count">{filtered.length} találat</span>
      </div>

      {loading ? (
        <div className="adm2-loading"><div className="adm2-spinner" /><span>Betöltés...</span></div>
      ) : pageItems.length === 0 ? (
        <div className="adm2-empty"><CouponEmptyIcon /><p>Nincs kupon{search ? ' a keresési feltételekre' : ''}</p></div>
      ) : (
        <div className="adm2-table-wrap">
          <table className="adm2-table">
            <thead>
              <tr>
                <th>Kód</th>
                <th>Kedvezmény</th>
                <th>Felhasználási hely</th>
                <th>Érvényesség</th>
                <th>Állapot</th>
                <th>Megjegyzés</th>
                <th className="adm2-th-actions">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(c => {
                const code = c.kod || c.code || '—';
                const discount = c.kedvezmeny ?? c.discount ?? '—';
                const place = c.hasznalasi_hely || c.bolt || '—';
                const start = c.kezdesi_datum || c.kezdes;
                const end = c.lejarati_datum || c.lejarasi_datum || c.expiry;
                const expired = isExpired(end);
                const note = c.megjegyzes || c.note || '';
                return (
                  <tr key={c.id}>
                    <td>
                      <code className="adm2-coupon-code">{code}</code>
                    </td>
                    <td>
                      <span className="adm2-discount-badge">{discount}%</span>
                    </td>
                    <td>{place}</td>
                    <td className="adm2-cell-date">
                      <div>{fmtDate(start)}</div>
                      <div className="adm2-cell-sub">→ {fmtDate(end)}</div>
                    </td>
                    <td>
                      <span className={`adm2-status-pill ${expired ? 'adm2-status--danger' : 'adm2-status--success'}`}>
                        {expired ? 'Lejárt' : 'Aktív'}
                      </span>
                    </td>
                    <td className="adm2-cell-note">{note ? <span title={note}>{note.slice(0, 40)}{note.length > 40 ? '…' : ''}</span> : '—'}</td>
                    <td>
                      <div className="adm2-row-actions">
                        <button className="adm2-icon-btn adm2-icon-btn--edit" title="Szerkesztés" onClick={() => setFormTarget(c)}>
                          <EditIcon />
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

      {/* Form Modal */}
      {formTarget !== null && (
        <CouponFormModal
          coupon={formTarget === 'new' ? null : formTarget}
          onClose={() => setFormTarget(null)}
          onSave={(msg) => { onToast?.(msg, 'success'); onRefresh?.(); }}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Kupon törlése"
        message={`Biztosan törölni szeretnéd a(z) "${deleteTarget?.kod || deleteTarget?.code}" kupont?`}
        confirmLabel="Törlés"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

/* ── Icons ──────────────────────────────────────── */
const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const TrashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const EditIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const PlusIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const CouponEmptyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/></svg>;

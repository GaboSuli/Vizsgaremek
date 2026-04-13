import React, { useState, useEffect } from 'react';
import { updateKupon } from '../../services/kuponService.js';

export default function EditCouponModal({ kupon, onClose, onUpdated }) {
  const [form, setForm] = useState({
    kod: '',
    kedvezmeny: '',
    kezdesi_datum: '',
    lejarasi_datum: '',
    hasznalasi_hely: '',
    megjegyzes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    if (kupon) {
      setForm({
        kod: kupon.kod || '',
        kedvezmeny: kupon.kedvezmeny || '',
        kezdesi_datum: kupon.kezdesi_datum || '',
        lejarasi_datum: kupon.lejarasi_datum || '',
        hasznalasi_hely: kupon.hasznalasi_hely || '',
        megjegyzes: kupon.megjegyzes || '',
      });
      setErrors({});
      setGlobalError('');
    }
  }, [kupon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.kod.trim()) errs.kod = 'A kuponkód megadása kötelező.';
    if (!form.kedvezmeny.trim()) errs.kedvezmeny = 'A kedvezmény megadása kötelező.';
    if (!form.kezdesi_datum) errs.kezdesi_datum = 'A kezdési dátum megadása kötelező.';
    if (!form.lejarasi_datum) errs.lejarasi_datum = 'A lejárati dátum megadása kötelező.';
    if (!form.hasznalasi_hely.trim()) errs.hasznalasi_hely = 'A felhasználási hely megadása kötelező.';
    if (form.kezdesi_datum && form.lejarasi_datum && form.lejarasi_datum < form.kezdesi_datum) {
      errs.lejarasi_datum = 'A lejárati dátum nem lehet korábbi a kezdési dátumnál.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setGlobalError('');
    try {
      const res = await updateKupon(kupon.id, {
        kod: form.kod.trim(),
        kedvezmeny: form.kedvezmeny.trim(),
        kezdesi_datum: form.kezdesi_datum,
        lejarasi_datum: form.lejarasi_datum,
        hasznalasi_hely: form.hasznalasi_hely.trim(),
        megjegyzes: form.megjegyzes.trim() || undefined,
      });
      if (res.success) {
        onUpdated();
      } else {
        if (res.errors && typeof res.errors === 'object') {
          const mapped = {};
          Object.entries(res.errors).forEach(([k, v]) => {
            mapped[k] = Array.isArray(v) ? v[0] : v;
          });
          setErrors(mapped);
        }
        setGlobalError(res.message || 'Hiba a kupon frissítésekor.');
      }
    } catch {
      setGlobalError('Váratlan hiba történt.');
    } finally {
      setLoading(false);
    }
  };

  if (!kupon) return null;

  return (
    <div className="cm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cm-modal" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
        <div className="cm-modal-header">
          <h2 id="edit-modal-title" className="cm-modal-title">
            <span className="cm-modal-title-icon">✏️</span>
            Kupon szerkesztése
          </h2>
          <button className="cm-modal-close" onClick={onClose} aria-label="Bezárás">×</button>
        </div>

        {globalError && (
          <div className="alert alert-danger" style={{ margin: '0 1.5rem' }}>
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cm-modal-body" noValidate>
          <div className="cm-form-row cm-form-row--2">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-kod">
                Kuponkód <span className="cm-required">*</span>
              </label>
              <input
                id="edit-kod"
                name="kod"
                type="text"
                className={`form-control${errors.kod ? ' is-invalid' : ''}`}
                value={form.kod}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.kod && <div className="cm-field-error">{errors.kod}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-kedvezmeny">
                Kedvezmény <span className="cm-required">*</span>
              </label>
              <input
                id="edit-kedvezmeny"
                name="kedvezmeny"
                type="text"
                className={`form-control${errors.kedvezmeny ? ' is-invalid' : ''}`}
                value={form.kedvezmeny}
                onChange={handleChange}
              />
              {errors.kedvezmeny && <div className="cm-field-error">{errors.kedvezmeny}</div>}
            </div>
          </div>

          <div className="cm-form-row cm-form-row--2">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-kezdesi">
                Kezdési dátum <span className="cm-required">*</span>
              </label>
              <input
                id="edit-kezdesi"
                name="kezdesi_datum"
                type="date"
                className={`form-control${errors.kezdesi_datum ? ' is-invalid' : ''}`}
                value={form.kezdesi_datum}
                onChange={handleChange}
              />
              {errors.kezdesi_datum && <div className="cm-field-error">{errors.kezdesi_datum}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-lejarasi">
                Lejárati dátum <span className="cm-required">*</span>
              </label>
              <input
                id="edit-lejarasi"
                name="lejarasi_datum"
                type="date"
                className={`form-control${errors.lejarasi_datum ? ' is-invalid' : ''}`}
                value={form.lejarasi_datum}
                onChange={handleChange}
              />
              {errors.lejarasi_datum && <div className="cm-field-error">{errors.lejarasi_datum}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-hely">
              Felhasználási hely <span className="cm-required">*</span>
            </label>
            <input
              id="edit-hely"
              name="hasznalasi_hely"
              type="text"
              className={`form-control${errors.hasznalasi_hely ? ' is-invalid' : ''}`}
              value={form.hasznalasi_hely}
              onChange={handleChange}
            />
            {errors.hasznalasi_hely && <div className="cm-field-error">{errors.hasznalasi_hely}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-megjegyzes">
              Megjegyzés <span className="cm-optional">(opcionális)</span>
            </label>
            <textarea
              id="edit-megjegyzes"
              name="megjegyzes"
              className="form-control"
              value={form.megjegyzes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="cm-modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Mégse
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner-sm" /> Mentés...</> : 'Változások mentése'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

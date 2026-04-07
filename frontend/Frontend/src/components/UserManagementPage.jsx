import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService.js';
import useAuth from '../context/useAuth.js';
import useTheme from '../context/useTheme.js';
import Button from './ui/Button.jsx';
import ToggleSwitch from './ui/ToggleSwitch.jsx';
import './UserManagementPage.css';

/* ── small reusable sub-components ─────────── */

function SectionCard({ title, subtitle, children, danger = false }) {
  return (
    <div className={`ump-section-card${danger ? ' ump-section-card--danger' : ''}`}>
      <div className="ump-section-card__header">
        <div>
          <h2 className="ump-section-card__title">{title}</h2>
          {subtitle && <p className="ump-section-card__subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="ump-section-card__body">{children}</div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="ump-profile-row">
      <span className="ump-label">{label}</span>
      <span className="ump-value">
        {value || <span className="ump-empty">Nincs megadva</span>}
      </span>
    </div>
  );
}

function Avatar({ name }) {
  const initials = (name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
  return <div className="ump-avatar">{initials}</div>;
}

/* ── ProfileForm ────────────────────────────── */

function ProfileForm({ initialData, onSaved }) {
  const auth = useAuth();
  const [form, setForm] = useState({
    nev: initialData?.nev || '',
    becenev: initialData?.becenev || '',
    profilkep_url: initialData?.profilkep_url || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setForm({
      nev: initialData?.nev || '',
      becenev: initialData?.becenev || '',
      profilkep_url: initialData?.profilkep_url || '',
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nev.trim()) {
      setError('A név megadása kötelező.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {};
      if (form.nev !== initialData?.nev) payload.nev = form.nev;
      if (form.becenev !== initialData?.becenev) payload.becenev = form.becenev;
      if (form.profilkep_url !== initialData?.profilkep_url)
        payload.profilkep_url = form.profilkep_url;

      if (Object.keys(payload).length === 0) {
        setSuccess('Nincs változás a mentéshez.');
        setLoading(false);
        return;
      }

      const resp = await authService.updateUser(payload);
      if (resp.success) {
        setSuccess('Profil sikeresen mentve!');
        await auth.refreshUser();
        onSaved?.();
      } else {
        setError(resp.message || 'Hiba történt a mentés során.');
      }
    } catch {
      setError('Hiba történt a mentés során.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ump-form">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-group">
        <label className="form-label">Teljes név *</label>
        <input
          className="form-control"
          type="text"
          name="nev"
          value={form.nev}
          onChange={handleChange}
          disabled={loading}
          required
          placeholder="pl. Kovács János"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Becenév</label>
        <input
          className="form-control"
          type="text"
          name="becenev"
          value={form.becenev}
          onChange={handleChange}
          disabled={loading}
          placeholder="pl. KJ"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Profilkép URL</label>
        <input
          className="form-control"
          type="text"
          name="profilkep_url"
          value={form.profilkep_url}
          onChange={handleChange}
          disabled={loading}
          placeholder="https://..."
        />
        <p className="form-text">Hagyja üresen az alapértelmezett képhez.</p>
      </div>

      <div className="ump-form__actions">
        <Button type="submit" variant="primary" loading={loading}>
          Mentés
        </Button>
      </div>
    </form>
  );
}

/* ── ThemeSettings ──────────────────────────── */

function ThemeSettings() {
  const auth = useAuth();
  const { isDarkMode } = useTheme();
  const [error, setError] = useState('');
  const savedRef = React.useRef(isDarkMode);

  // Sync to backend whenever the theme changes
  useEffect(() => {
    if (savedRef.current === isDarkMode) return;
    savedRef.current = isDarkMode;
    const newTemaId = isDarkMode ? 2 : 1;
    authService.updateUser({ tema_id: newTemaId })
      .then(async (resp) => {
        if (resp.success) await auth.refreshUser();
      })
      .catch(() => {
        setError('Nem sikerült menteni a beállítást a szerverre.');
      });
  }, [isDarkMode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="ump-form">
      {error && <div className="alert alert-danger">{error}</div>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--clr-text)' }}>
            {isDarkMode ? '🌙 Sötét mód' : '☀️ Világos mód'}
          </p>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--clr-text-3)' }}>
            {isDarkMode
              ? 'Sötét háttér, kíméletes az éjszakai olvasáshoz'
              : 'Fehér háttér, könnyű olvasás nappal'}
          </p>
        </div>
        <ToggleSwitch showLabel={false} size="md" />
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────── */

export default function UserManagementPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const user = auth.user;

  const handleDelete = async () => {
    if (
      !window.confirm(
        'Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem vonható vissza.'
      )
    )
      return;

    setDeleteLoading(true);
    setDeleteError('');
    try {
      const userId = user?.id;
      if (!userId) {
        setDeleteError('Felhasználó azonosító nem található.');
        return;
      }
      const resp = await authService.deleteUser(userId);
      if (resp.success) {
        auth.logout();
        navigate('/', { replace: true });
      } else {
        setDeleteError(resp.message || 'Hiba történt a törlés során.');
      }
    } catch {
      setDeleteError('Hiba történt a törlés során.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil adatok', icon: '👤' },
    { id: 'edit', label: 'Szerkesztés', icon: '✏️' },
    { id: 'theme', label: 'Megjelenés', icon: '🎨' },
    { id: 'danger', label: 'Fiók törlése', icon: '🗑️' },
  ];

  return (
    <div className="ump-page">
      <div className="page-container" style={{ maxWidth: 760 }}>
        {/* Header */}
        <div className="ump-header">
          <Avatar name={user?.nev} />
          <div>
            <h1 className="page-title">{user?.nev || 'Felhasználó'}</h1>
            <p className="page-subtitle">{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: '1.75rem' }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="ump-tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile */}
        {activeTab === 'profile' && (
          <SectionCard
            title="Saját profil"
            subtitle="Az alábbi adatok láthatók a fiókodon"
          >
            {user ? (
              <div className="ump-profile-rows">
                <ProfileRow label="Teljes név" value={user.nev} />
                <ProfileRow label="Becenév" value={user.becenev} />
                <ProfileRow label="Email cím" value={user.email} />
                <ProfileRow
                  label="Profilkép"
                  value={user.profilkep_url !== 'user.png' ? user.profilkep_url : null}
                />
                <ProfileRow
                  label="Jogosultsági szint"
                  value={
                    user.jogosultsag_szint === 255
                      ? '⭐ Adminisztrátor'
                      : user.jogosultsag_szint > 0
                      ? `Moderátor (${user.jogosultsag_szint})`
                      : 'Felhasználó'
                  }
                />
              </div>
            ) : (
              <div className="loading-state">
                <div className="spinner" />
                <p>Betöltés...</p>
              </div>
            )}
          </SectionCard>
        )}

        {/* Edit */}
        {activeTab === 'edit' && (
          <SectionCard
            title="Profil szerkesztése"
            subtitle="Módosítsd a megjelenített adataidat"
          >
            <ProfileForm
              initialData={user}
              onSaved={() => setActiveTab('profile')}
            />
          </SectionCard>
        )}

        {/* Theme */}
        {activeTab === 'theme' && (
          <SectionCard
            title="Megjelenés"
            subtitle="Válaszd ki az alkalmazás témáját"
          >
            <ThemeSettings />
          </SectionCard>
        )}

        {/* Danger zone */}
        {activeTab === 'danger' && (
          <SectionCard
            title="Fiók törlése"
            subtitle="Ez a művelet végleges és visszafordíthatatlan"
            danger
          >
            {deleteError && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                {deleteError}
              </div>
            )}
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
              ⚠️ A fiók törlésével minden adatod véglegesen törlődik — vásárlási listák,
              csoporttagságok, statisztikák. A művelet nem vonható vissza.
            </div>
            <Button
              variant="danger"
              loading={deleteLoading}
              onClick={handleDelete}
            >
              Fiók végleges törlése
            </Button>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
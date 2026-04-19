import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth.js';
import * as authService from '../../services/authService.js';
import ProfileHeader from './ProfileHeader.jsx';
import UserInfoCard from './UserInfoCard.jsx';
import PreferencesPanel from './PreferencesPanel.jsx';
import PendingInvitesPanel from './PendingInvitesPanel.jsx';
import Button from '../ui/Button.jsx';
import './ProfilePage.css';

function EditProfileForm({ user, onSaved }) {
  const auth = useAuth();
  const [form, setForm] = useState({
    nev: user?.nev || '',
    becenev: user?.becenev || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setForm({ nev: user?.nev || '', becenev: user?.becenev || '' });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
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
      if (form.nev !== user?.nev) payload.nev = form.nev;
      if (form.becenev !== user?.becenev) payload.becenev = form.becenev;

      if (Object.keys(payload).length === 0) {
        setSuccess('Nincs változás.');
        setLoading(false);
        return;
      }

      const resp = await authService.updateUser(payload);
      if (resp.success) {
        setSuccess('Profil sikeresen módosítva!');
        await auth.refreshUser();
        onSaved?.();
      } else {
        setError(resp.message || 'Hiba történt a mentés során.');
      }
    } catch {
      setError('Hiba történt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pp-edit-card">
      <div className="pp-edit-card__header">
        <h3 className="pp-edit-card__title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Adatok szerkesztése
        </h3>
      </div>
      <div className="pp-edit-card__body">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit} className="pp-edit-form">
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
          <div className="pp-edit-form__actions">
            <Button type="submit" variant="primary" loading={loading}>
              Mentés
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DangerZone({ user }) {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem vonható vissza.'))
      return;

    setLoading(true);
    setError('');
    try {
      const userId = user?.id;
      if (!userId) {
        setError('Felhasználó azonosító nem található.');
        return;
      }
      const resp = await authService.deleteUser(userId);
      if (resp.success) {
        auth.logout();
        navigate('/', { replace: true });
      } else {
        setError(resp.message || 'Hiba történt.');
      }
    } catch {
      setError('Hiba történt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pp-danger-card">
      <div className="pp-danger-card__header">
        <h3 className="pp-danger-card__title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Veszélyzóna
        </h3>
      </div>
      <div className="pp-danger-card__body">
        {error && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}
        <p className="pp-danger-card__text">
          A fiók törlésével minden adatod véglegesen törlődik — vásárlási listák, csoporttagságok, statisztikák. A művelet nem vonható vissza.
        </p>
        <Button variant="danger" loading={loading} onClick={handleDelete}>
          Fiók végleges törlése
        </Button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const auth = useAuth();
  const user = auth.user;
  const [activeTab, setActiveTab] = useState('overview');
  const [inviteCount, setInviteCount] = useState(0);

  const tabs = [
    { id: 'overview', label: 'Áttekintés', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )},
    { id: 'invitations', label: 'Meghívások', badge: inviteCount > 0 ? inviteCount : null, icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    )},
    { id: 'edit', label: 'Szerkesztés', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    )},
    { id: 'settings', label: 'Beállítások', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4" />
      </svg>
    )},
    { id: 'danger', label: 'Fiók törlése', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    )},
  ];

  return (
    <div className="pp-page">
      <div className="pp-container">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Tab Navigation */}
        <div className="pp-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`pp-tab ${activeTab === t.id ? 'pp-tab--active' : ''} ${t.id === 'danger' ? 'pp-tab--danger' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="pp-tab__icon">{t.icon}</span>
              <span className="pp-tab__label">{t.label}</span>
              {t.badge != null && (
                <span className="pp-tab__badge">{t.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab body */}
        <div className="pp-body">
          {activeTab === 'overview' && <UserInfoCard user={user} />}

          {activeTab === 'invitations' && (
            <PendingInvitesPanel onCountChange={setInviteCount} />
          )}

          {activeTab === 'edit' && (
            <EditProfileForm
              user={user}
              onSaved={() => setActiveTab('overview')}
            />
          )}

          {activeTab === 'settings' && <PreferencesPanel />}

          {activeTab === 'danger' && <DangerZone user={user} />}
        </div>

        {/* Kijelentkezés — mobilon a BottomNav-ból elérhető, sidebar nélkül */}
        <div className="pp-logout-section">
          <Button
            variant="outline"
            className="pp-logout-btn"
            onClick={() => { auth.logout(); navigate('/', { replace: true }); }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Kijelentkezés
          </Button>
        </div>
      </div>
    </div>
  );
}

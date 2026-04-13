import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../../context/useAuth.js';
import { getSystemStats } from '../../services/adminService.js';
import AdminStats from './AdminStats.jsx';
import UserManagement from './UserManagement.jsx';
import GroupManagement from './GroupManagement.jsx';
import CouponModerator from './CouponModerator.jsx';
import QuickActions from './QuickActions.jsx';
import Toast from '../ui/Toast.jsx';
import './Admin.css';

const tabs = [
  {
    id: 'overview',
    label: 'Áttekintés',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'users',
    label: 'Felhasználók',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'groups',
    label: 'Csoportok',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'coupons',
    label: 'Kuponok',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
      </svg>
    ),
  },
  {
    id: 'quick',
    label: 'Gyors műveletek',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: [], groups: [], coupons: [], contacts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSystemStats();
      setStats(data);
    } catch {
      setError('Nem sikerült betölteni az adatokat.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const clearToast = () => setToast({ message: '', type: 'success' });

  const displayName = user?.Nev || user?.nev || user?.name || 'Admin';

  return (
    <div className="admin-page">
      <Toast message={toast.message} type={toast.type} onClose={clearToast} />

      {/* Page Header */}
      <div className="admin-page-header">
        <h1>
          Admin Panel
          <span className="admin-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Admin
          </span>
        </h1>
        <p>Üdvözöllek, {displayName}! Itt kezelheted a rendszer összes funkcióját.</p>
      </div>

      {/* Stats Summary — always visible */}
      <AdminStats stats={stats} loading={loading} />

      {/* Error Banner */}
      {error && (
        <div className="admin-error">
          <p>{error}</p>
          <button className="btn btn-primary btn-sm" onClick={loadData}>
            Újrapróbálkozás
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="admin-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`admin-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.id === 'users' && stats.users.length > 0 && (
              <span className="nav-count">{stats.users.length}</span>
            )}
            {tab.id === 'groups' && stats.groups.length > 0 && (
              <span className="nav-count">{stats.groups.length}</span>
            )}
            {tab.id === 'coupons' && stats.coupons.length > 0 && (
              <span className="nav-count">{stats.coupons.length}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
          <UserManagement
            users={stats.users.slice(0, 5)}
            loading={loading}
            onRefresh={loadData}
            onToast={showToast}
          />
          <GroupManagement
            groups={stats.groups.slice(0, 5)}
            loading={loading}
            onRefresh={loadData}
            onToast={showToast}
          />
          <QuickActions />
        </div>
      )}

      {activeTab === 'users' && (
        <UserManagement
          users={stats.users}
          loading={loading}
          onRefresh={loadData}
          onToast={showToast}
        />
      )}

      {activeTab === 'groups' && (
        <GroupManagement
          groups={stats.groups}
          loading={loading}
          onRefresh={loadData}
          onToast={showToast}
        />
      )}

      {activeTab === 'coupons' && (
        <CouponModerator
          coupons={stats.coupons}
          loading={loading}
          onRefresh={loadData}
          onToast={showToast}
        />
      )}

      {activeTab === 'quick' && <QuickActions />}
    </div>
  );
}

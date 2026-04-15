import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth.js';
import { getDashboardData, deleteUser, deleteGroup, deleteCoupon } from '../../services/adminService.js';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import Toast from '../ui/Toast.jsx';
import Avatar from '../Profile/Avatar.jsx';
import './Admin.css';

/* ═══════════════════════════════════════════════════════
   SVG Icon Components
═══════════════════════════════════════════════════════ */
const Icons = {
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Groups: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Coupon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Chart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Wallet: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
    </svg>
  ),
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Refresh: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  ShoppingBag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  TrendUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Server: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════════
   Helper Functions
═══════════════════════════════════════════════════════ */
function formatNumber(n) {
  if (n == null || isNaN(n)) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString('hu-HU');
}

function formatCurrency(n) {
  if (n == null || isNaN(n)) return '0 Ft';
  return Number(n).toLocaleString('hu-HU') + ' Ft';
}

function formatDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' }); } catch { return '—'; }
}

function formatRelative(d) {
  if (!d) return '—';
  try {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Most';
    if (mins < 60) return `${mins} perce`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} órája`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} napja`;
    return formatDate(d);
  } catch { return '—'; }
}

function getInitials(name) {
  return (name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function getRoleInfo(level) {
  if (level === 255) return { label: 'Admin', cls: 'admin' };
  if (level > 0) return { label: 'Moderátor', cls: 'moderator' };
  return { label: 'Felhasználó', cls: 'user' };
}

/* ═══════════════════════════════════════════════════════
   Mini Bar Chart (pure CSS)
═══════════════════════════════════════════════════════ */
function MiniBarChart({ data, color = 'var(--clr-primary)' }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  return (
    <div className="adm-mini-chart">
      {data.map((v, i) => (
        <div key={i} className="adm-mini-chart-bar" style={{
          height: `${Math.max((v / max) * 100, 4)}%`,
          background: color,
          opacity: 0.4 + (i / data.length) * 0.6,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
═══════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    users: [], groups: [], coupons: [], contacts: [],
    spending: null, monthlySpending: null, yearlySpending: null, statistics: null,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', target: null });
  const [deleting, setDeleting] = useState(false);
  const [searchUsers, setSearchUsers] = useState('');
  const [searchGroups, setSearchGroups] = useState('');
  const [searchCoupons, setSearchCoupons] = useState('');

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError('');
    try {
      const result = await getDashboardData();
      setData(result);
    } catch {
      setError('Nem sikerült betölteni az admin adatokat.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  /* ── Computed stats ────────────────────────────── */
  const computed = useMemo(() => {
    const users = data.users || [];
    const groups = data.groups || [];
    const coupons = data.coupons || [];
    const contacts = data.contacts || [];

    const admins = users.filter(u => (u.jogosultsag_szint ?? u.Jogosultsag_szint ?? 0) === 255);
    const moderators = users.filter(u => {
      const lvl = u.jogosultsag_szint ?? u.Jogosultsag_szint ?? 0;
      return lvl > 0 && lvl < 255;
    });
    const regularUsers = users.filter(u => (u.jogosultsag_szint ?? u.Jogosultsag_szint ?? 0) === 0);

    const now = new Date();
    const activeCoupons = coupons.filter(c => {
      const exp = c.lejarati_datum || c.expiry;
      return !exp || new Date(exp) >= now;
    });
    const expiredCoupons = coupons.filter(c => {
      const exp = c.lejarati_datum || c.expiry;
      return exp && new Date(exp) < now;
    });

    const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    const recentUsers = users.filter(u => u.created_at && new Date(u.created_at) >= weekAgo);

    let monthlyTotal = 0;
    const ms = data.monthlySpending;
    if (ms) {
      if (typeof ms === 'number') monthlyTotal = ms;
      else if (ms.osszeg != null) monthlyTotal = ms.osszeg;
      else if (ms.total != null) monthlyTotal = ms.total;
      else if (Array.isArray(ms)) monthlyTotal = ms.reduce((a, b) => a + (b.ar || b.osszeg || 0), 0);
    }

    let yearlyTotal = 0;
    const ys = data.yearlySpending;
    if (ys) {
      if (typeof ys === 'number') yearlyTotal = ys;
      else if (ys.osszeg != null) yearlyTotal = ys.osszeg;
      else if (ys.total != null) yearlyTotal = ys.total;
      else if (Array.isArray(ys)) yearlyTotal = ys.reduce((a, b) => a + (b.ar || b.osszeg || 0), 0);
    }

    let spendingCategories = [];
    const sp = data.spending;
    if (sp) {
      if (Array.isArray(sp)) {
        spendingCategories = sp.map(s => ({
          name: s.megnevezes || s.Megnevezes || s.name || 'Egyéb',
          amount: s.osszeg || s.total || s.ar || 0,
        }));
      } else if (typeof sp === 'object') {
        spendingCategories = Object.entries(sp).map(([key, val]) => ({
          name: val?.megnevezes || val?.Megnevezes || key,
          amount: val?.osszeg || val?.total || (typeof val === 'number' ? val : 0),
        }));
      }
    }
    spendingCategories.sort((a, b) => b.amount - a.amount);

    const regTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.toLocaleDateString('hu-HU', { month: 'short' });
      const count = users.filter(u => {
        if (!u.created_at) return false;
        const cd = new Date(u.created_at);
        return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
      }).length;
      regTrend.push({ month, count });
    }

    const activity = [];
    users.slice(0, 50).forEach(u => {
      if (u.created_at) {
        activity.push({
          type: 'user', text: `${u.nev || u.Nev || 'Felhasználó'} regisztrált`,
          time: u.created_at, icon: 'Users',
        });
      }
    });
    groups.slice(0, 20).forEach(g => {
      if (g.created_at) {
        activity.push({
          type: 'group', text: `"${g.nev || g.Nev || g.megnevezes || g.name || 'Csoport'}" csoport létrehozva`,
          time: g.created_at, icon: 'Groups',
        });
      }
    });
    contacts.slice(0, 20).forEach(c => {
      if (c.created_at) {
        activity.push({
          type: 'contact', text: `Üzenet: ${c.nev || c.Nev || 'Feladó'}`,
          time: c.created_at, icon: 'Mail',
        });
      }
    });
    activity.sort((a, b) => new Date(b.time) - new Date(a.time));

    return {
      admins, moderators, regularUsers, activeCoupons, expiredCoupons,
      recentUsers, monthlyTotal, yearlyTotal, spendingCategories,
      regTrend, activity: activity.slice(0, 12),
    };
  }, [data]);

  /* ── Filtered lists ────────────────────────────── */
  const filteredUsers = useMemo(() => {
    const q = searchUsers.toLowerCase().trim();
    if (!q) return data.users.slice(0, 8);
    return data.users.filter(u => {
      const name = (u.nev || u.Nev || '').toLowerCase();
      const email = (u.email || u.Email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    }).slice(0, 20);
  }, [data.users, searchUsers]);

  const filteredGroups = useMemo(() => {
    const q = searchGroups.toLowerCase().trim();
    if (!q) return data.groups.slice(0, 6);
    return data.groups.filter(g => {
      const name = (g.nev || g.Nev || g.megnevezes || g.name || '').toLowerCase();
      return name.includes(q);
    }).slice(0, 20);
  }, [data.groups, searchGroups]);

  const filteredCoupons = useMemo(() => {
    const q = searchCoupons.toLowerCase().trim();
    if (!q) return data.coupons.slice(0, 6);
    return data.coupons.filter(c => {
      const code = (c.kod || c.code || '').toLowerCase();
      const place = (c.hasznalasi_hely || c.bolt || '').toLowerCase();
      return code.includes(q) || place.includes(q);
    }).slice(0, 20);
  }, [data.coupons, searchCoupons]);

  /* ── Delete handler ────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteDialog.target) return;
    setDeleting(true);
    try {
      let res;
      if (deleteDialog.type === 'user') res = await deleteUser(deleteDialog.target.id);
      else if (deleteDialog.type === 'group') res = await deleteGroup(deleteDialog.target.id);
      else if (deleteDialog.type === 'coupon') res = await deleteCoupon(deleteDialog.target.id);

      if (res?.success) {
        showToast('Sikeresen törölve.', 'success');
        loadData(true);
      } else {
        showToast(res?.message || 'Hiba a törlés során.', 'error');
      }
    } catch {
      showToast('Hálózati hiba.', 'error');
    } finally {
      setDeleting(false);
      setDeleteDialog({ open: false, type: '', target: null });
    }
  };

  const displayName = user?.Nev || user?.nev || user?.name || 'Admin';
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Jó reggelt' : now.getHours() < 18 ? 'Jó napot' : 'Jó estét';

  /* ═══════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════ */
  if (loading) {
    return (
      <div className="adm-dashboard">
        <div className="adm-loading-screen">
          <div className="adm-loading-logo"><Icons.Shield /></div>
          <div className="adm-loading-spinner" />
          <p>Admin Vezérlőközpont betöltése...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-dashboard">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* ═══ HEADER ═══════════════════════════════════ */}
      <header className="adm-header">
        <div className="adm-header-left">
          <div className="adm-header-icon"><Icons.Shield /></div>
          <div>
            <h1 className="adm-header-title">
              Vezérlőközpont
              <span className="adm-header-badge">ADMIN</span>
            </h1>
            <p className="adm-header-subtitle">{greeting}, <strong>{displayName}</strong>! Rendszer áttekintés és kezelés.</p>
          </div>
        </div>
        <div className="adm-header-right">
          <div className="adm-header-meta">
            <span className="adm-server-status">
              <span className="adm-status-pulse" />
              Rendszer aktív
            </span>
            <span className="adm-header-date">
              {now.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <button className={`adm-refresh-btn ${refreshing ? 'spinning' : ''}`} onClick={() => loadData(true)} title="Adatok frissítése">
            <Icons.Refresh />
          </button>
        </div>
      </header>

      {error && (
        <div className="adm-error-banner">
          <p>{error}</p>
          <button onClick={() => loadData()}>Újrapróbálkozás</button>
        </div>
      )}

      {/* ═══ STAT CARDS ═══════════════════════════════ */}
      <section className="adm-stats-row">
        <div className="adm-stat-card adm-stat--primary">
          <div className="adm-stat-icon"><Icons.Users /></div>
          <div className="adm-stat-body">
            <span className="adm-stat-label">Felhasználók</span>
            <span className="adm-stat-value">{formatNumber(data.users.length)}</span>
            <span className="adm-stat-sub">{computed.admins.length} admin · {computed.moderators.length} moderátor</span>
          </div>
          <MiniBarChart data={computed.regTrend.map(r => r.count)} color="var(--clr-primary)" />
        </div>

        <div className="adm-stat-card adm-stat--success">
          <div className="adm-stat-icon"><Icons.Groups /></div>
          <div className="adm-stat-body">
            <span className="adm-stat-label">Csoportok</span>
            <span className="adm-stat-value">{formatNumber(data.groups.length)}</span>
            <span className="adm-stat-sub">Aktív csoportok</span>
          </div>
        </div>

        <div className="adm-stat-card adm-stat--warning">
          <div className="adm-stat-icon"><Icons.Coupon /></div>
          <div className="adm-stat-body">
            <span className="adm-stat-label">Kuponok</span>
            <span className="adm-stat-value">{formatNumber(data.coupons.length)}</span>
            <span className="adm-stat-sub">{computed.activeCoupons.length} aktív · {computed.expiredCoupons.length} lejárt</span>
          </div>
        </div>

        <div className="adm-stat-card adm-stat--info">
          <div className="adm-stat-icon"><Icons.Mail /></div>
          <div className="adm-stat-body">
            <span className="adm-stat-label">Üzenetek</span>
            <span className="adm-stat-value">{formatNumber(data.contacts.length)}</span>
            <span className="adm-stat-sub">Beérkezett kapcsolat</span>
          </div>
        </div>

        <div className="adm-stat-card adm-stat--purple">
          <div className="adm-stat-icon"><Icons.Wallet /></div>
          <div className="adm-stat-body">
            <span className="adm-stat-label">Havi költés</span>
            <span className="adm-stat-value">{formatCurrency(computed.monthlyTotal)}</span>
            <span className="adm-stat-sub">Éves: {formatCurrency(computed.yearlyTotal)}</span>
          </div>
        </div>

        <div className="adm-stat-card adm-stat--danger">
          <div className="adm-stat-icon"><Icons.TrendUp /></div>
          <div className="adm-stat-body">
            <span className="adm-stat-label">Új regisztrációk</span>
            <span className="adm-stat-value">{computed.recentUsers.length}</span>
            <span className="adm-stat-sub">Elmúlt 7 nap</span>
          </div>
        </div>
      </section>

      {/* ═══ MAIN GRID ════════════════════════════════ */}
      <div className="adm-grid">

        {/* ── USER INSIGHTS ────────────────────────── */}
        <section className="adm-panel adm-panel--wide">
          <div className="adm-panel-header">
            <div className="adm-panel-title">
              <Icons.Users />
              <h2>Felhasználók áttekintése</h2>
              <span className="adm-panel-count">{data.users.length}</span>
            </div>
            <div className="adm-panel-actions">
              <div className="adm-search-mini">
                <Icons.Search />
                <input placeholder="Keresés..." value={searchUsers} onChange={e => setSearchUsers(e.target.value)} />
              </div>
              <button className="adm-link-btn" onClick={() => navigate('/user')}>
                Összes <Icons.ArrowRight />
              </button>
            </div>
          </div>
          <div className="adm-panel-body">
            <div className="adm-role-distribution">
              <div className="adm-role-bar">
                {data.users.length > 0 && (
                  <>
                    <div className="adm-role-segment adm-role-segment--admin" style={{ width: `${(computed.admins.length / data.users.length) * 100}%` }} title={`Admin: ${computed.admins.length}`} />
                    <div className="adm-role-segment adm-role-segment--mod" style={{ width: `${(computed.moderators.length / data.users.length) * 100}%` }} title={`Moderátor: ${computed.moderators.length}`} />
                    <div className="adm-role-segment adm-role-segment--user" style={{ width: `${(computed.regularUsers.length / data.users.length) * 100}%` }} title={`Felhasználó: ${computed.regularUsers.length}`} />
                  </>
                )}
              </div>
              <div className="adm-role-legend">
                <span><i className="adm-dot adm-dot--admin" /> Admin ({computed.admins.length})</span>
                <span><i className="adm-dot adm-dot--mod" /> Moderátor ({computed.moderators.length})</span>
                <span><i className="adm-dot adm-dot--user" /> Felhasználó ({computed.regularUsers.length})</span>
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="adm-empty-mini">Nincs találat</div>
            ) : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead><tr><th>Felhasználó</th><th>Szerepkör</th><th>Regisztráció</th><th></th></tr></thead>
                  <tbody>
                    {filteredUsers.map(u => {
                      const name = u.nev || u.Nev || 'Ismeretlen';
                      const email = u.email || u.Email || '';
                      const level = u.jogosultsag_szint ?? u.Jogosultsag_szint ?? 0;
                      const role = getRoleInfo(level);
                      return (
                        <tr key={u.id}>
                          <td>
                            <div className="adm-user-cell">
                              <Avatar src={u.profilkep_url} name={name} size="sm" className="adm-avatar" />
                              <div><div className="adm-cell-name">{name}</div><div className="adm-cell-sub">{email}</div></div>
                            </div>
                          </td>
                          <td><span className={`adm-badge adm-badge--${role.cls}`}>{role.label}</span></td>
                          <td className="adm-cell-date">{formatDate(u.created_at)}</td>
                          <td>
                            <button className="adm-icon-btn adm-icon-btn--danger" title="Törlés" onClick={() => setDeleteDialog({ open: true, type: 'user', target: u })}>
                              <Icons.Trash />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* ── RECENT ACTIVITY ──────────────────────── */}
        <section className="adm-panel">
          <div className="adm-panel-header">
            <div className="adm-panel-title">
              <Icons.Activity />
              <h2>Legutóbbi aktivitás</h2>
            </div>
          </div>
          <div className="adm-panel-body adm-activity-list">
            {computed.activity.length === 0 ? (
              <div className="adm-empty-mini">Nincs aktivitás</div>
            ) : (
              computed.activity.map((a, i) => {
                const Icon = Icons[a.icon] || Icons.Activity;
                return (
                  <div key={i} className={`adm-activity-item adm-activity--${a.type}`}>
                    <div className="adm-activity-icon"><Icon /></div>
                    <div className="adm-activity-content">
                      <span className="adm-activity-text">{a.text}</span>
                      <span className="adm-activity-time">{formatRelative(a.time)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ── GROUP MANAGEMENT ─────────────────────── */}
        <section className="adm-panel">
          <div className="adm-panel-header">
            <div className="adm-panel-title">
              <Icons.Groups />
              <h2>Csoportok</h2>
              <span className="adm-panel-count">{data.groups.length}</span>
            </div>
            <div className="adm-panel-actions">
              <div className="adm-search-mini">
                <Icons.Search />
                <input placeholder="Keresés..." value={searchGroups} onChange={e => setSearchGroups(e.target.value)} />
              </div>
              <button className="adm-link-btn" onClick={() => navigate('/groups')}>
                Kezelés <Icons.ArrowRight />
              </button>
            </div>
          </div>
          <div className="adm-panel-body">
            {filteredGroups.length === 0 ? (
              <div className="adm-empty-mini">Nincs csoport</div>
            ) : (
              <div className="adm-card-list">
                {filteredGroups.map(g => {
                  const name = g.nev || g.Nev || g.megnevezes || g.name || 'Névtelen';
                  const type = g.csoport_tipus_id ?? g.tipus ?? '—';
                  return (
                    <div key={g.id} className="adm-mini-card">
                      <div className="adm-mini-card-avatar adm-mini-card-avatar--group">
                        {(name[0] || 'C').toUpperCase()}
                      </div>
                      <div className="adm-mini-card-info">
                        <span className="adm-mini-card-name">{name}</span>
                        <span className="adm-mini-card-sub">Típus: {type} · {formatDate(g.created_at)}</span>
                      </div>
                      <button className="adm-icon-btn adm-icon-btn--danger" title="Törlés" onClick={() => setDeleteDialog({ open: true, type: 'group', target: g })}>
                        <Icons.Trash />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── COUPON MODERATOR ─────────────────────── */}
        <section className="adm-panel">
          <div className="adm-panel-header">
            <div className="adm-panel-title">
              <Icons.Coupon />
              <h2>Kuponok</h2>
              <span className="adm-panel-count">{data.coupons.length}</span>
            </div>
            <div className="adm-panel-actions">
              <div className="adm-search-mini">
                <Icons.Search />
                <input placeholder="Keresés..." value={searchCoupons} onChange={e => setSearchCoupons(e.target.value)} />
              </div>
              <button className="adm-link-btn" onClick={() => navigate('/kupon-moderator')}>
                Moderátor <Icons.ArrowRight />
              </button>
            </div>
          </div>
          <div className="adm-panel-body">
            {filteredCoupons.length === 0 ? (
              <div className="adm-empty-mini">Nincs kupon</div>
            ) : (
              <div className="adm-card-list">
                {filteredCoupons.map(c => {
                  const code = c.kod || c.code || '—';
                  const discount = c.kedvezmeny ?? c.discount ?? '—';
                  const place = c.hasznalasi_hely || c.bolt || c.shop || '—';
                  const exp = c.lejarati_datum || c.expiry;
                  const isExpired = exp && new Date(exp) < new Date();
                  return (
                    <div key={c.id} className="adm-mini-card">
                      <div className={`adm-coupon-badge ${isExpired ? 'adm-coupon--expired' : 'adm-coupon--active'}`}>
                        {discount}%
                      </div>
                      <div className="adm-mini-card-info">
                        <span className="adm-mini-card-name"><code>{code}</code></span>
                        <span className="adm-mini-card-sub">{place} · {formatDate(exp)}</span>
                      </div>
                      <span className={`adm-status-pill ${isExpired ? 'adm-status-pill--danger' : 'adm-status-pill--success'}`}>
                        {isExpired ? 'Lejárt' : 'Aktív'}
                      </span>
                      <button className="adm-icon-btn adm-icon-btn--danger" title="Törlés" onClick={() => setDeleteDialog({ open: true, type: 'coupon', target: c })}>
                        <Icons.Trash />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── SPENDING / STATISTICS ────────────────── */}
        <section className="adm-panel">
          <div className="adm-panel-header">
            <div className="adm-panel-title">
              <Icons.Chart />
              <h2>Költési összesítés</h2>
            </div>
            <button className="adm-link-btn" onClick={() => navigate('/stats')}>
              Statisztikák <Icons.ArrowRight />
            </button>
          </div>
          <div className="adm-panel-body">
            <div className="adm-spend-summary">
              <div className="adm-spend-card">
                <Icons.Clock />
                <div>
                  <span className="adm-spend-label">Havi költés</span>
                  <span className="adm-spend-value">{formatCurrency(computed.monthlyTotal)}</span>
                </div>
              </div>
              <div className="adm-spend-card">
                <Icons.TrendUp />
                <div>
                  <span className="adm-spend-label">Éves költés</span>
                  <span className="adm-spend-value">{formatCurrency(computed.yearlyTotal)}</span>
                </div>
              </div>
            </div>
            {computed.spendingCategories.length > 0 && (
              <div className="adm-category-bars">
                <h3>Költések kategóriánként</h3>
                {computed.spendingCategories.slice(0, 6).map((cat, i) => {
                  const maxAmount = computed.spendingCategories[0]?.amount || 1;
                  return (
                    <div key={i} className="adm-cat-bar-row">
                      <span className="adm-cat-bar-label">{cat.name}</span>
                      <div className="adm-cat-bar-track">
                        <div className="adm-cat-bar-fill" style={{ width: `${Math.max((cat.amount / maxAmount) * 100, 2)}%` }} />
                      </div>
                      <span className="adm-cat-bar-value">{formatCurrency(cat.amount)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── REGISTRATION TREND ──────────────────── */}
        <section className="adm-panel">
          <div className="adm-panel-header">
            <div className="adm-panel-title">
              <Icons.TrendUp />
              <h2>Regisztrációs trend</h2>
            </div>
          </div>
          <div className="adm-panel-body">
            <div className="adm-bar-chart">
              {computed.regTrend.map((item, i) => {
                const max = Math.max(...computed.regTrend.map(r => r.count), 1);
                return (
                  <div key={i} className="adm-bar-col">
                    <div className="adm-bar-value">{item.count}</div>
                    <div className="adm-bar-track">
                      <div className="adm-bar-fill" style={{ height: `${Math.max((item.count / max) * 100, 4)}%` }} />
                    </div>
                    <div className="adm-bar-label">{item.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SYSTEM STATUS ───────────────────────── */}
        <section className="adm-panel">
          <div className="adm-panel-header">
            <div className="adm-panel-title">
              <Icons.Server />
              <h2>Rendszer állapot</h2>
            </div>
          </div>
          <div className="adm-panel-body">
            <div className="adm-system-grid">
              <div className="adm-system-item adm-system--ok">
                <span className="adm-system-dot" />
                <div><strong>Backend API</strong><span>Laravel · Aktív</span></div>
              </div>
              <div className="adm-system-item adm-system--ok">
                <span className="adm-system-dot" />
                <div><strong>Frontend</strong><span>React + Vite · Aktív</span></div>
              </div>
              <div className="adm-system-item adm-system--ok">
                <span className="adm-system-dot" />
                <div><strong>Adatbázis</strong><span>MySQL · Kapcsolódva</span></div>
              </div>
              <div className="adm-system-item adm-system--ok">
                <span className="adm-system-dot" />
                <div><strong>Autentikáció</strong><span>Sanctum · Aktív</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── QUICK ACTIONS ───────────────────────── */}
        <section className="adm-panel adm-panel--wide">
          <div className="adm-panel-header">
            <div className="adm-panel-title">
              <Icons.Bolt />
              <h2>Gyors műveletek</h2>
            </div>
          </div>
          <div className="adm-panel-body">
            <div className="adm-quick-grid">
              {[
                { label: 'Kupon Moderátor', desc: 'Kuponok kezelése', path: '/kupon-moderator', color: 'info', icon: <Icons.Coupon /> },
                { label: 'Statisztikák', desc: 'Trendek és árak', path: '/stats', color: 'purple', icon: <Icons.Chart /> },
                { label: 'Csoportok', desc: 'Csoportok böngészése', path: '/groups', color: 'success', icon: <Icons.Groups /> },
                { label: 'Bevásárlólisták', desc: 'Listák kezelése', path: '/shopping', color: 'warning', icon: <Icons.ShoppingBag /> },
                { label: 'Kapcsolat üzenetek', desc: 'Beérkezett üzenetek', path: '/contact', color: 'danger', icon: <Icons.Mail /> },
                { label: 'Profil', desc: 'Saját fiók', path: '/user', color: 'primary', icon: <Icons.Users /> },
              ].map(action => (
                <button key={action.path} className="adm-quick-card" onClick={() => navigate(action.path)}>
                  <div className={`adm-quick-card-icon adm-qc--${action.color}`}>{action.icon}</div>
                  <span className="adm-quick-card-label">{action.label}</span>
                  <span className="adm-quick-card-desc">{action.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT MESSAGES ────────────────────── */}
        {data.contacts.length > 0 && (
          <section className="adm-panel adm-panel--wide">
            <div className="adm-panel-header">
              <div className="adm-panel-title">
                <Icons.Mail />
                <h2>Legutóbbi üzenetek</h2>
                <span className="adm-panel-count">{data.contacts.length}</span>
              </div>
              <button className="adm-link-btn" onClick={() => navigate('/contact')}>
                Összes <Icons.ArrowRight />
              </button>
            </div>
            <div className="adm-panel-body">
              <div className="adm-card-list">
                {data.contacts.slice(0, 5).map((c, i) => (
                  <div key={c.id || i} className="adm-mini-card">
                    <Avatar name={c.nev || c.Nev || 'F'} size="sm" className="adm-avatar adm-avatar--mail" />
                    <div className="adm-mini-card-info">
                      <span className="adm-mini-card-name">{c.nev || c.Nev || 'Feladó'}</span>
                      <span className="adm-mini-card-sub">{c.email || c.Email || ''} · {formatRelative(c.created_at)}</span>
                      {(c.text || c.uzenet) && (
                        <span className="adm-mini-card-preview">{(c.text || c.uzenet || '').slice(0, 80)}{(c.text || c.uzenet || '').length > 80 ? '…' : ''}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        title={`${deleteDialog.type === 'user' ? 'Felhasználó' : deleteDialog.type === 'group' ? 'Csoport' : 'Kupon'} törlése`}
        message="Biztosan törölni szeretnéd? Ez a művelet nem vonható vissza."
        confirmLabel="Törlés"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, type: '', target: null })}
      />
    </div>
  );
}

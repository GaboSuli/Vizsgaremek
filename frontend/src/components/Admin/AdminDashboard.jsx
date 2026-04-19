import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import useAuth from '../../context/useAuth.js';
import { getDashboardData } from '../../services/adminService.js';
import Toast from '../ui/Toast.jsx';
import './Admin.css';

/* ── Lazy-load each section — only the active chunk is downloaded ── */
const OverviewSection   = lazy(() => import('./sections/OverviewSection.jsx'));
const UsersSection      = lazy(() => import('./sections/UsersSection.jsx'));
const GroupsSection     = lazy(() => import('./sections/GroupsSection.jsx'));
const ShoppingSection   = lazy(() => import('./sections/ShoppingSection.jsx'));
const CouponsSection    = lazy(() => import('./sections/CouponsSection.jsx'));
const CategoriesSection = lazy(() => import('./sections/CategoriesSection.jsx'));
const StatsSection      = lazy(() => import('./sections/StatsSection.jsx'));
const ContactsSection   = lazy(() => import('./sections/ContactsSection.jsx'));

/* ── Map section id → component — defined before NAV_ITEMS ── */
const SECTION_MAP = {
  overview:   OverviewSection,
  users:      UsersSection,
  groups:     GroupsSection,
  shopping:   ShoppingSection,
  coupons:    CouponsSection,
  categories: CategoriesSection,
  stats:      StatsSection,
  contacts:   ContactsSection,
};

/* Sections that fetch their own data — receive no sectionProps from parent */
const STANDALONE_SECTIONS = new Set(['categories', 'stats']);

/* ── Icons — defined BEFORE NAV_ITEMS to avoid TDZ ReferenceError ── */
const ShieldIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>;
const MenuIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const DashIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
const UsersIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const GroupsIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const CartIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const CouponIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/></svg>;
const CatIcon     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const ChartIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
const MailIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;

/* ═══════════════════════════════════════════════════════
   NAV ITEMS CONFIG  (icons are valid consts now ↑)
═══════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: 'overview',    label: 'Áttekintés',       icon: <DashIcon />,    badgeKey: null },
  { id: 'users',       label: 'Felhasználók',      icon: <UsersIcon />,   badgeKey: 'users' },
  { id: 'groups',      label: 'Csoportok',         icon: <GroupsIcon />,  badgeKey: 'groups' },
  { id: 'shopping',    label: 'Bevásárlólisták',   icon: <CartIcon />,    badgeKey: null },
  { id: 'coupons',     label: 'Kuponok',           icon: <CouponIcon />,  badgeKey: 'coupons' },
  { id: 'categories',  label: 'Alkategóriák',      icon: <CatIcon />,     badgeKey: null },
  { id: 'stats',       label: 'Statisztikák',      icon: <ChartIcon />,   badgeKey: null },
  { id: 'contacts',    label: 'Kapcsolat',         icon: <MailIcon />,    badgeKey: 'contacts' },
];

function SectionSkeleton() {
  return (
    <div className="adm2-loading">
      <div className="adm2-spinner" />
      <span>Betöltés...</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* Keep-alive: track which sections have ever been visited so they stay
     mounted (and don't re-fetch) when the user switches tabs.             */
  const [visited, setVisited] = useState(() => new Set(['overview']));

  const [data, setData] = useState({
    users: [], groups: [], coupons: [], contacts: [],
    spending: null, monthlySpending: null, yearlySpending: null, statistics: null,
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getDashboardData();
      setData(result || {
        users: [], groups: [], coupons: [], contacts: [],
        spending: null, monthlySpending: null, yearlySpending: null, statistics: null,
      });
    } catch { /* silently fail — sections show own error */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  /* Navigate to a section — mark it visited so it's rendered (and kept mounted) */
  const handleNav = useCallback((id) => {
    setActiveSection(id);
    setVisited(prev => {
      if (prev.has(id)) return prev; // already visited, skip state change
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  /* Memoize so section components don't re-render when unrelated state changes */
  const badges = useMemo(() => ({
    users:    data.users?.length    || 0,
    groups:   data.groups?.length   || 0,
    coupons:  data.coupons?.length  || 0,
    contacts: data.contacts?.length || 0,
  }), [data.users, data.groups, data.coupons, data.contacts]);

  const sectionProps = useMemo(
    () => ({ data, loading, onRefresh: loadData, onToast: showToast }),
    [data, loading, loadData, showToast]
  );

  const displayName = user?.Nev || user?.nev || user?.name || 'Admin';

  return (
    <div className="adm2-layout">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* ── Sidebar ───────────────────────────── */}
      <aside className={`adm2-sidebar ${sidebarOpen ? '' : 'adm2-sidebar--collapsed'}`}>
        <div className="adm2-sidebar-head">
          {sidebarOpen && (
            <div className="adm2-sidebar-brand">
              <ShieldIcon />
              <span>Admin</span>
            </div>
          )}
          <button className="adm2-sidebar-toggle" onClick={() => setSidebarOpen(o => !o)} title={sidebarOpen ? 'Összecsuk' : 'Kinyit'}>
            <MenuIcon />
          </button>
        </div>

        {sidebarOpen && (
          <div className="adm2-sidebar-user">
            <div className="adm2-sidebar-avatar">{(displayName[0] || 'A').toUpperCase()}</div>
            <div className="adm2-sidebar-userinfo">
              <span className="adm2-sidebar-name">{displayName}</span>
              <span className="adm2-sidebar-role">Admin</span>
            </div>
          </div>
        )}

        <nav className="adm2-sidebar-nav">
          {NAV_ITEMS.map(item => {
            const count = item.badgeKey ? badges[item.badgeKey] : 0;
            return (
              <button
                key={item.id}
                className={`adm2-nav-item ${activeSection === item.id ? 'adm2-nav-item--active' : ''}`}
                onClick={() => handleNav(item.id)}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="adm2-nav-icon">{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="adm2-nav-label">{item.label}</span>
                    {count > 0 && <span className="adm2-nav-badge">{count > 999 ? '999+' : count}</span>}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main content ─────────────────────── */}
      <main className="adm2-content">
        <div className="adm2-content-inner">
          {/* Keep-alive: render all visited sections, hide inactive ones with CSS.
              This prevents remounting (and re-fetching) when switching tabs.    */}
          {NAV_ITEMS.map(item => {
            if (!visited.has(item.id)) return null;
            const Section = SECTION_MAP[item.id];
            const props = STANDALONE_SECTIONS.has(item.id) ? {} : sectionProps;
            return (
              <div
                key={item.id}
                style={{ display: activeSection === item.id ? undefined : 'none' }}
                role="tabpanel"
                aria-hidden={activeSection !== item.id}
              >
                <Suspense fallback={<SectionSkeleton />}>
                  <Section {...props} />
                </Suspense>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}


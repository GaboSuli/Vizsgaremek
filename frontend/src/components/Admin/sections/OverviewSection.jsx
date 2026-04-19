import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../Profile/Avatar.jsx';

/* ── Helpers ────────────────────────────────────── */
function fmt(n) {
  if (n == null || isNaN(n)) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
function fmtCur(n) {
  if (n == null || isNaN(n)) return '0 Ft';
  return Number(n).toLocaleString('hu-HU') + ' Ft';
}
function fmtDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return '—'; }
}
function fmtRel(d) {
  if (!d) return '—';
  try {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Most';
    if (m < 60) return `${m} perce`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} órája`;
    const days = Math.floor(h / 24);
    return `${days} napja`;
  } catch { return '—'; }
}

/* ── Mini bar chart ───────────────────────────── */
function MiniBar({ data, color = 'var(--clr-primary)' }) {
  if (!data?.length) return null;
  const max = Math.max(...data, 1);
  return (
    <div className="adm2-mini-chart">
      {data.map((v, i) => (
        <div key={i} className="adm2-mini-bar"
          style={{ height: `${Math.max((v / max) * 100, 4)}%`, background: color, opacity: 0.4 + (i / data.length) * 0.6 }} />
      ))}
    </div>
  );
}

export default function OverviewSection({ data, loading }) {
  const navigate = useNavigate();

  const computed = useMemo(() => {
    const users = data.users || [];
    const groups = data.groups || [];
    const coupons = data.coupons || [];
    const contacts = data.contacts || [];
    const now = new Date();

    const admins = users.filter(u => (u.jogosultsag_szint ?? u.Jogosultsag_szint ?? 0) === 255).length;
    const mods = users.filter(u => { const l = u.jogosultsag_szint ?? u.Jogosultsag_szint ?? 0; return l > 0 && l < 255; }).length;
    const regular = users.length - admins - mods;

    const activeCoupons = coupons.filter(c => { const e = c.lejarati_datum || c.expiry; return !e || new Date(e) >= now; });
    const weekAgo = new Date(now.getTime() - 7 * 24 * 3600_000);
    const newUsers = users.filter(u => u.created_at && new Date(u.created_at) >= weekAgo).length;

    let monthly = 0;
    const ms = data.monthlySpending;
    if (ms) {
      if (typeof ms === 'number') monthly = ms;
      else if (ms.osszeg != null) monthly = ms.osszeg;
      else if (ms.total != null) monthly = ms.total;
      else if (Array.isArray(ms)) monthly = ms.reduce((a, b) => a + (b.ar || b.osszeg || 0), 0);
    }

    const regTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      regTrend.push({
        month: d.toLocaleDateString('hu-HU', { month: 'short' }),
        count: users.filter(u => {
          if (!u.created_at) return false;
          const cd = new Date(u.created_at);
          return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
        }).length,
      });
    }

    const activity = [];
    users.slice(0, 20).forEach(u => u.created_at && activity.push({ type: 'user', text: `${u.nev || u.Nev || 'Felhasználó'} regisztrált`, time: u.created_at, icon: 'users' }));
    groups.slice(0, 10).forEach(g => g.created_at && activity.push({ type: 'group', text: `"${g.megnevezes || g.nev || 'Csoport'}" létrehozva`, time: g.created_at, icon: 'groups' }));
    contacts.slice(0, 10).forEach(c => c.created_at && activity.push({ type: 'contact', text: `Üzenet: ${c.nev || 'Feladó'}`, time: c.created_at, icon: 'mail' }));
    activity.sort((a, b) => new Date(b.time) - new Date(a.time));

    let spendCats = [];
    const sp = data.spending;
    if (sp) {
      if (Array.isArray(sp)) spendCats = sp.map(s => ({ name: s.megnevezes || s.name || 'Egyéb', amount: s.osszeg || s.ar || 0 }));
      else if (typeof sp === 'object') spendCats = Object.entries(sp).map(([k, v]) => ({ name: v?.megnevezes || k, amount: v?.osszeg || (typeof v === 'number' ? v : 0) }));
    }
    spendCats.sort((a, b) => b.amount - a.amount);

    return { admins, mods, regular, activeCoupons: activeCoupons.length, newUsers, monthly, regTrend, activity: activity.slice(0, 10), spendCats };
  }, [data]);

  const statCards = [
    { label: 'Felhasználók', value: fmt(data.users?.length), sub: `${computed.admins} admin · ${computed.mods} mod`, color: 'primary', icon: 'users', trend: computed.regTrend.map(r => r.count) },
    { label: 'Csoportok', value: fmt(data.groups?.length), sub: 'Aktív csoportok', color: 'success', icon: 'groups' },
    { label: 'Kuponok', value: fmt(data.coupons?.length), sub: `${computed.activeCoupons} aktív`, color: 'warning', icon: 'coupon' },
    { label: 'Üzenetek', value: fmt(data.contacts?.length), sub: 'Beérkezett', color: 'info', icon: 'mail' },
    { label: 'Havi költés', value: fmtCur(computed.monthly), sub: 'Aktuális hónap', color: 'purple', icon: 'wallet' },
    { label: 'Új regisztráció', value: fmt(computed.newUsers), sub: 'Elmúlt 7 nap', color: 'danger', icon: 'trend' },
  ];

  return (
    <div className="adm2-section">
      {/* ── Stat cards ─────────────────────────────── */}
      <div className="adm2-stat-grid">
        {statCards.map(card => (
          <div key={card.label} className={`adm2-stat-card adm2-stat--${card.color}`}>
            <div className="adm2-stat-head">
              <span className="adm2-stat-label">{card.label}</span>
              <div className={`adm2-stat-icon adm2-icon--${card.color}`}>
                <StatIcon name={card.icon} />
              </div>
            </div>
            <div className="adm2-stat-value">{loading ? '—' : card.value}</div>
            <div className="adm2-stat-foot">
              <span className="adm2-stat-sub">{card.sub}</span>
              {card.trend && <MiniBar data={card.trend} color={`var(--clr-${card.color})`} />}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main content grid ──────────────────────── */}
      <div className="adm2-overview-grid">

        {/* Registration trend */}
        <div className="adm2-card adm2-card--wide">
          <div className="adm2-card-head">
            <h3>Regisztrációs trend (6 hónap)</h3>
          </div>
          <div className="adm2-card-body">
            <div className="adm2-bar-chart">
              {computed.regTrend.map((item, i) => {
                const max = Math.max(...computed.regTrend.map(r => r.count), 1);
                return (
                  <div key={i} className="adm2-bar-col">
                    <span className="adm2-bar-val">{item.count}</span>
                    <div className="adm2-bar-track">
                      <div className="adm2-bar-fill" style={{ height: `${Math.max((item.count / max) * 100, 4)}%` }} />
                    </div>
                    <span className="adm2-bar-lbl">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Activity feed */}
        <div className="adm2-card">
          <div className="adm2-card-head">
            <h3>Legutóbbi aktivitás</h3>
          </div>
          <div className="adm2-card-body adm2-activity">
            {computed.activity.length === 0
              ? <p className="adm2-empty-text">Nincs aktivitás</p>
              : computed.activity.map((a, i) => (
                <div key={i} className={`adm2-activity-item adm2-act--${a.type}`}>
                  <div className={`adm2-act-icon adm2-act-icon--${a.type}`}><StatIcon name={a.icon} /></div>
                  <div className="adm2-act-content">
                    <span className="adm2-act-text">{a.text}</span>
                    <span className="adm2-act-time">{fmtRel(a.time)}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Spending by category */}
        {computed.spendCats.length > 0 && (
          <div className="adm2-card">
            <div className="adm2-card-head">
              <h3>Költések kategóriánként</h3>
            </div>
            <div className="adm2-card-body">
              {computed.spendCats.slice(0, 7).map((cat, i) => {
                const pct = Math.max((cat.amount / (computed.spendCats[0]?.amount || 1)) * 100, 2);
                return (
                  <div key={i} className="adm2-cat-row">
                    <span className="adm2-cat-name">{cat.name}</span>
                    <div className="adm2-cat-bar-track">
                      <div className="adm2-cat-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="adm2-cat-amount">{fmtCur(cat.amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* System status */}
        <div className="adm2-card">
          <div className="adm2-card-head">
            <h3>Rendszer állapot</h3>
          </div>
          <div className="adm2-card-body">
            <div className="adm2-sys-grid">
              {[
                { label: 'Backend API', detail: 'Laravel · Actív' },
                { label: 'Frontend', detail: 'React + Vite · Actív' },
                { label: 'Adatbázis', detail: 'MySQL · Kapcsolódva' },
                { label: 'Autentikáció', detail: 'Sanctum · Actív' },
              ].map(s => (
                <div key={s.label} className="adm2-sys-item">
                  <span className="adm2-sys-dot" />
                  <div>
                    <strong>{s.label}</strong>
                    <span>{s.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="adm2-card adm2-card--wide">
          <div className="adm2-card-head"><h3>Gyors műveletek</h3></div>
          <div className="adm2-card-body">
            <div className="adm2-quick-grid">
              {[
                { label: 'Statisztikák', path: '/stats', color: 'purple', icon: 'chart' },
                { label: 'Csoportok', path: '/groups', color: 'success', icon: 'groups' },
                { label: 'Bevásárlólisták', path: '/shopping', color: 'warning', icon: 'shopping' },
                { label: 'Kapcsolat', path: '/contact', color: 'danger', icon: 'mail' },
                { label: 'Kupon moderátor', path: '/kupon-moderator', color: 'info', icon: 'coupon' },
                { label: 'Profil', path: '/user', color: 'primary', icon: 'users' },
              ].map(q => (
                <button key={q.path} className={`adm2-quick-btn adm2-quick--${q.color}`} onClick={() => navigate(q.path)}>
                  <span className="adm2-quick-icon"><StatIcon name={q.icon} /></span>
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Inline SVG icons ─────────────────────────────── */
function StatIcon({ name }) {
  switch (name) {
    case 'users': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'groups': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>;
    case 'coupon': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/></svg>;
    case 'mail': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case 'wallet': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>;
    case 'trend': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
    case 'chart': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
    case 'shopping': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
    default: return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>;
  }
}

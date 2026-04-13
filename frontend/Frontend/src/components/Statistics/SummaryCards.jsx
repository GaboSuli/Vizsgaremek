import React, { useState, useEffect } from 'react';
import {
  getUserTotalExpenses,
  getUserMonthlyExpenses,
  getUserYearlyExpenses,
  getYearMarketStats,
} from '../../services/statisticsService.js';

function fmt(val) {
  if (val === null || val === undefined || isNaN(val)) return '–';
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(val);
}

function sumArr(arr) {
  if (!Array.isArray(arr) || !arr.length) return 0;
  return arr.reduce((s, i) => s + (parseFloat(i.Osszegzett) || 0), 0);
}

function maxByOsszegzett(arr) {
  if (!Array.isArray(arr) || !arr.length) return null;
  return arr.reduce((m, i) => (parseFloat(i.Osszegzett) > parseFloat(m.Osszegzett) ? i : m), arr[0]);
}

function maxByAvg(arr) {
  if (!Array.isArray(arr) || !arr.length) return null;
  return arr.reduce((m, i) => (parseFloat(i.KiszamoltAtlag) > parseFloat(m.KiszamoltAtlag) ? i : m), arr[0]);
}

const ICONS = {
  total: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  monthly: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  yearly: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  top: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  market: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
};

export default function SummaryCards({ year }) {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    let active = true;
    setState({ loading: true, error: null, data: null });

    Promise.all([
      getUserTotalExpenses(),
      getUserMonthlyExpenses(),
      getUserYearlyExpenses(),
      getYearMarketStats(year),
    ]).then(([totalRes, monthlyRes, yearlyRes, marketRes]) => {
      if (!active) return;

      const topCat = maxByOsszegzett(totalRes.data);
      const topMarket = maxByAvg(marketRes.data);

      setState({
        loading: false,
        error: null,
        data: {
          total: sumArr(totalRes.data),
          monthly: sumArr(monthlyRes.data),
          yearly: sumArr(yearlyRes.data),
          topCat,
          topMarket,
        },
      });
    }).catch(() => {
      if (!active) return;
      setState({ loading: false, error: 'Hiba az adatok betöltésekor.', data: null });
    });

    return () => { active = false; };
  }, [year]);

  if (state.loading) {
    return (
      <div className="summary-cards-grid">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="stat-card sc-skeleton">
            <div className="sc-skel-icon" />
            <div className="sc-skel-body">
              <div className="sc-skel-label" />
              <div className="sc-skel-value" />
              <div className="sc-skel-sub" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (state.error) {
    return <div className="alert alert-warning">⚠️ {state.error}</div>;
  }

  const { data } = state;
  const monthLabel = new Date().toLocaleDateString('hu-HU', { month: 'long', year: 'numeric' });

  const cards = [
    {
      icon: ICONS.total,
      label: 'Összes kiadás',
      value: fmt(data.total),
      sub: 'Minden idők összesítve',
      color: 'primary',
    },
    {
      icon: ICONS.monthly,
      label: 'Havi kiadás',
      value: fmt(data.monthly),
      sub: monthLabel,
      color: 'info',
    },
    {
      icon: ICONS.yearly,
      label: 'Éves kiadás',
      value: fmt(data.yearly),
      sub: `${year}-ben összesen`,
      color: 'success',
    },
    {
      icon: ICONS.top,
      label: 'Legtöbbet vásárolt',
      value: data.topCat?.megnevezes || '–',
      sub: data.topCat ? fmt(data.topCat.Osszegzett) : 'Nincs adat',
      color: 'warning',
    },
    {
      icon: ICONS.market,
      label: 'Legdrágább piaci termék',
      value: data.topMarket?.Alkategoria || '–',
      sub: data.topMarket
        ? `Ø ${fmt(data.topMarket.KiszamoltAtlag)}${data.topMarket.Mertekegyseg ? ' / ' + data.topMarket.Mertekegyseg : ''}`
        : 'Nincs adat',
      color: 'danger',
    },
  ];

  return (
    <div className="summary-cards-grid">
      {cards.map((c, i) => (
        <div key={i} className={`stat-card sc-card sc-${c.color}`}>
          <div className={`stat-icon sc-icon sc-icon-${c.color}`}>{c.icon}</div>
          <div className="sc-body">
            <div className="stat-label">{c.label}</div>
            <div className="stat-value sc-val">{c.value}</div>
            <div className="stat-sub">{c.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

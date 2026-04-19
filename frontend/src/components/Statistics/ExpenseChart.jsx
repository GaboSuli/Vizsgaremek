import React, { useState, useEffect, useMemo } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { apiCall } from '../../services/api.js';
import useTheme from '../../context/useTheme.js';
import '../../utils/chartSetup.js';

const PALETTE = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
  '#0ea5e9', '#a855f7', '#64748b', '#f43f5e', '#22c55e',
];

function fmt(v) {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(v || 0);
}

export default function ExpenseChart() {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('doughnut');

  useEffect(() => {
    let active = true;
    apiCall('/felhasznalo/osszKoltesei', { includeAuth: true }).then(res => {
      if (!active) return;
      if (res.success && Array.isArray(res.data) && res.data.length) {
        setData([...res.data].sort((a, b) => parseFloat(b.Osszegzett) - parseFloat(a.Osszegzett)));
      } else if (res.success) {
        setData([]);
      } else {
        setError('Nem sikerült betölteni a kiadási adatokat.');
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const textColor = isDarkMode ? '#94a3b8' : '#475569';
  const gridColor = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const borderColor = isDarkMode ? '#1e293b' : '#ffffff';

  const total = useMemo(
    () => data.reduce((s, d) => s + (parseFloat(d.Osszegzett) || 0), 0),
    [data]
  );

  const doughnutData = useMemo(() => ({
    labels: data.map(d => d.megnevezes),
    datasets: [{
      data: data.map(d => parseFloat(d.Osszegzett) || 0),
      backgroundColor: data.map((_, i) => PALETTE[i % PALETTE.length]),
      borderColor,
      borderWidth: 2,
      hoverOffset: 10,
    }],
  }), [data, borderColor]);

  const barData = useMemo(() => ({
    labels: data.map(d => d.megnevezes),
    datasets: [{
      label: 'Kiadás (Ft)',
      data: data.map(d => parseFloat(d.Osszegzett) || 0),
      backgroundColor: data.map((_, i) => PALETTE[i % PALETTE.length] + 'cc'),
      borderColor: data.map((_, i) => PALETTE[i % PALETTE.length]),
      borderWidth: 1,
      borderRadius: 5,
    }],
  }), [data]);

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color: textColor, boxWidth: 13, padding: 14, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
            return ` ${ctx.label}: ${fmt(ctx.raw)} (${pct}%)`;
          },
        },
      },
    },
  };

  const barOpts = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${fmt(ctx.raw)}` } },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, callback: v => fmt(v) },
      },
      y: {
        grid: { color: 'transparent' },
        ticks: { color: textColor, font: { size: 11 } },
      },
    },
  };

  if (loading) return <div className="loading-state"><div className="spinner" /></div>;
  if (error) return <div className="alert alert-warning">⚠️ {error}</div>;
  if (!data.length) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">Nincs kiadási adat</div>
          <div className="empty-state-sub">Adjon hozzá jóváhagyott bevásárlásokat a statisztikák megjelenítéséhez</div>
        </div>
      </div>
    );
  }

  const chartHeight = chartType === 'bar' ? Math.max(320, data.length * 36) : 340;

  return (
    <div className="card ec-card">
      <div className="card-header ec-header">
        <div className="tabs ec-tabs">
          <button
            className={`tab-btn ${chartType === 'doughnut' ? 'active' : ''}`}
            onClick={() => setChartType('doughnut')}
          >
            Kördiagram
          </button>
          <button
            className={`tab-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
          >
            Sávdiagram
          </button>
        </div>
        <div className="ec-header-right">
          <span className="badge badge-primary">{data.length} alkategória</span>
          <span className="ec-total">Össz: {fmt(total)}</span>
        </div>
      </div>
      <div className="card-body">
        <div className="chart-wrapper" style={{ height: chartHeight + 'px' }}>
          {chartType === 'doughnut'
            ? <Doughnut data={doughnutData} options={doughnutOpts} />
            : <Bar data={barData} options={barOpts} />
          }
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { apiCall } from '../../services/api.js';
import useTheme from '../../context/useTheme.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

function fmt(v) {
  if (v === null || v === undefined || isNaN(v)) return '–';
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(v);
}

function fmtDatum(d) {
  if (!d) return d;
  const p = d.split('-');
  if (p.length !== 2) return d;
  const months = ['jan.', 'feb.', 'már.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szep.', 'okt.', 'nov.', 'dec.'];
  const m = parseInt(p[1], 10) - 1;
  return `20${p[0]} ${months[m] ?? p[1]}`;
}

export default function CategorySelector() {
  const { isDarkMode } = useTheme();
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    apiCall('/statisztika/all').then(res => {
      if (!active) return;
      if (res.success && Array.isArray(res.data) && res.data.length) {
        setRawData(res.data);
        const cats = [...new Set(res.data.map(d => d.Alkategoria))].sort();
        setSelected(cats[0] || '');
      } else if (res.success) {
        setRawData([]);
      } else {
        setError('Nem sikerült betölteni az adatokat.');
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, [retry]);

  const categories = useMemo(
    () => [...new Set(rawData.map(d => d.Alkategoria))].sort(),
    [rawData]
  );

  const catRows = useMemo(
    () => rawData.filter(d => d.Alkategoria === selected).sort((a, b) => a.Datum.localeCompare(b.Datum)),
    [rawData, selected]
  );

  const stats = useMemo(() => {
    if (!catRows.length) return null;
    const prices = catRows.map(d => parseFloat(d.KiszamoltAtlag) || 0);
    const unit = catRows[0]?.Mertekegyseg || '';
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((s, v) => s + v, 0) / prices.length,
      current: prices[prices.length - 1],
      ingadozas: catRows[catRows.length - 1]?.Ingadozas,
      unit,
    };
  }, [catRows]);

  const textColor = isDarkMode ? '#94a3b8' : '#475569';
  const gridColor = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  const chartData = useMemo(() => ({
    labels: catRows.map(d => fmtDatum(d.Datum)),
    datasets: [{
      label: `${selected} – átlagár`,
      data: catRows.map(d => parseFloat(d.KiszamoltAtlag) || 0),
      borderColor: '#6366f1',
      backgroundColor: isDarkMode ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.07)',
      borderWidth: 2.5,
      pointRadius: 4,
      pointHoverRadius: 8,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: isDarkMode ? '#1e293b' : '#ffffff',
      pointBorderWidth: 2,
      fill: true,
      tension: 0.35,
    }],
  }), [catRows, selected, isDarkMode]);

  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${fmt(ctx.raw)}${stats?.unit ? ' / ' + stats.unit : ''}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, callback: v => fmt(v) },
      },
    },
  };

  if (loading) return <div className="loading-state"><div className="spinner" /></div>;
  if (error) return (
    <div className="alert alert-warning" style={{display:'flex',alignItems:'center',gap:'12px'}}>
      <span>⚠️ {error}</span>
      <button className="btn btn-sm btn-ghost" onClick={() => setRetry(r => r + 1)}>Újratöltés</button>
    </div>
  );
  if (!rawData.length) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">Nincs elérhető piaci adat</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card cs-card">
      <div className="card-header cs-header">
        <label className="form-label cs-label">Alkategória</label>
        <select
          className="form-control cs-select"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {stats && (
        <div className="cs-stat-bar">
          <div className="cs-stat-item cs-stat-success">
            <span className="cs-stat-label">Min. ár</span>
            <span className="cs-stat-val">{fmt(stats.min)}</span>
            {stats.unit && <span className="cs-stat-unit">/ {stats.unit}</span>}
          </div>
          <div className="cs-stat-item cs-stat-danger">
            <span className="cs-stat-label">Max. ár</span>
            <span className="cs-stat-val">{fmt(stats.max)}</span>
            {stats.unit && <span className="cs-stat-unit">/ {stats.unit}</span>}
          </div>
          <div className="cs-stat-item cs-stat-primary">
            <span className="cs-stat-label">Átlagár</span>
            <span className="cs-stat-val">{fmt(stats.avg)}</span>
            {stats.unit && <span className="cs-stat-unit">/ {stats.unit}</span>}
          </div>
          <div className="cs-stat-item cs-stat-info">
            <span className="cs-stat-label">Jelenlegi</span>
            <span className="cs-stat-val">{fmt(stats.current)}</span>
            {stats.unit && <span className="cs-stat-unit">/ {stats.unit}</span>}
          </div>
          {stats.ingadozas !== undefined && (
            <div className="cs-stat-item cs-stat-warning">
              <span className="cs-stat-label">Ingadozás</span>
              <span className="cs-stat-val">{fmt(stats.ingadozas)}</span>
            </div>
          )}
        </div>
      )}

      <div className="card-body">
        <div className="chart-wrapper" style={{ height: '300px' }}>
          {catRows.length > 1 ? (
            <Line data={chartData} options={opts} />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📈</div>
              <div className="empty-state-title">
                {catRows.length === 1 ? 'Csak egy adatpont áll rendelkezésre' : 'Nincs adat ehhez az alkategóriához'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

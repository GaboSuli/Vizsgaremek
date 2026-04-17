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

function fmtDatum(d) {
  if (!d) return d;
  const p = d.split('-');
  if (p.length !== 2) return d;
  const months = ['jan.', 'feb.', 'már.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szep.', 'okt.', 'nov.', 'dec.'];
  const m = parseInt(p[1], 10) - 1;
  return `20${p[0]} ${months[m] ?? p[1]}`;
}

export default function MonthlyTrendChart() {
  const { isDarkMode } = useTheme();
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCats, setVisibleCats] = useState(new Set());
  const [retry, setRetry] = useState(0);
  const [kategoriak, setKategoriak] = useState([]);
  const [selectedFoKategoria, setSelectedFoKategoria] = useState('');

  useEffect(() => {
    apiCall('/alkategoriak').then(res => {
      if (res.success !== false && Array.isArray(res.data || res)) {
        const data = res.data || res;
        setKategoriak(data);
      }
    });
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    apiCall('/statisztika/all').then(res => {
      if (!active) return;
      if (res.success && Array.isArray(res.data) && res.data.length) {
        setRawData(res.data);
        const cats = [...new Set(res.data.map(d => d.Alkategoria))].sort();
        setVisibleCats(new Set(cats.slice(0, 6)));
      } else if (res.success) {
        setRawData([]);
      } else {
        setError('Nem sikerült betölteni a piaci adatokat.');
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, [retry]);

  // Build a map of alkategória name -> főkategória name
  const alkategoriaToFoKategoria = useMemo(() => {
    const map = {};
    kategoriak.forEach(kat => {
      const foNev = kat.megnevezes;
      (kat.alkategoriak || []).forEach(alk => {
        map[alk.megnevezes] = foNev;
      });
    });
    return map;
  }, [kategoriak]);

  const foKategoriaNames = useMemo(
    () => kategoriak.map(k => k.megnevezes).sort(),
    [kategoriak]
  );

  const allCats = useMemo(
    () => [...new Set(rawData.map(d => d.Alkategoria))].sort(),
    [rawData]
  );

  const filteredCats = useMemo(() => {
    if (!selectedFoKategoria) return [];
    return allCats.filter(c => alkategoriaToFoKategoria[c] === selectedFoKategoria);
  }, [allCats, selectedFoKategoria, alkategoriaToFoKategoria]);

  // When főkategória changes, auto-select all its alkategóriák
  const handleFoKategoriaChange = (value) => {
    setSelectedFoKategoria(value);
    if (value) {
      const catsInKat = allCats.filter(c => alkategoriaToFoKategoria[c] === value);
      setVisibleCats(new Set(catsInKat));
    } else {
      setVisibleCats(new Set());
    }
  };

  const { labels, datasets } = useMemo(() => {
    if (!rawData.length) return { labels: [], datasets: [] };
    const allMonths = [...new Set(rawData.map(d => d.Datum))].sort();
    const activeCats = allCats.filter(c => visibleCats.has(c));

    const ds = activeCats.map((cat, i) => {
      const catRows = rawData.filter(d => d.Alkategoria === cat);
      const pts = allMonths.map(m => {
        const e = catRows.find(d => d.Datum === m);
        return e !== undefined ? parseFloat(e.KiszamoltAtlag) : null;
      });
      const color = PALETTE[allCats.indexOf(cat) % PALETTE.length];
      return {
        label: cat,
        data: pts,
        borderColor: color,
        backgroundColor: color + '18',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 7,
        tension: 0.35,
        fill: false,
        spanGaps: true,
      };
    });

    return { labels: allMonths.map(fmtDatum), datasets: ds };
  }, [rawData, allCats, visibleCats]);

  const textColor = isDarkMode ? '#94a3b8' : '#475569';
  const gridColor = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        labels: { color: textColor, boxWidth: 12, padding: 12, font: { size: 11 } },
      },
      tooltip: {
        callbacks: { label: ctx => ` ${ctx.dataset.label}: ${fmt(ctx.raw)}` },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, maxRotation: 45, font: { size: 11 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, callback: v => fmt(v) },
      },
    },
  };

  const toggleCat = cat => {
    setVisibleCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const selectAll = () => setVisibleCats(new Set(filteredCats));
  const clearAll = () => setVisibleCats(new Set());

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
          <div className="empty-state-icon">📉</div>
          <div className="empty-state-title">Nincs piaci adat</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mtc-card">
      <div className="card-body mtc-body">
        <div className="mtc-filter-bar">
          <select
            className="form-control mtc-search"
            value={selectedFoKategoria}
            onChange={e => handleFoKategoriaChange(e.target.value)}
            style={{ minWidth: '180px', maxWidth: '240px' }}
          >
            <option value="">Összes főkategória</option>
            {foKategoriaNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <div className="mtc-actions">
            <button className="btn btn-secondary btn-sm" onClick={selectAll}>Mind</button>
            <button className="btn btn-ghost btn-sm" onClick={clearAll}>Töröl</button>
            <span className="badge badge-gray">{visibleCats.size} / {filteredCats.length} aktív</span>
          </div>
        </div>

        <div className="mtc-cat-tags">
          {filteredCats.map(cat => {
            const colorIdx = allCats.indexOf(cat) % PALETTE.length;
            const active = visibleCats.has(cat);
            return (
              <button
                key={cat}
                className={`cat-tag ${active ? 'cat-tag--on' : 'cat-tag--off'}`}
                style={active ? { borderColor: PALETTE[colorIdx], color: PALETTE[colorIdx], backgroundColor: PALETTE[colorIdx] + '18' } : {}}
                onClick={() => toggleCat(cat)}
              >
                {active && <span className="cat-tag-dot" style={{ background: PALETTE[colorIdx] }} />}
                {cat}
              </button>
            );
          })}
          {filteredCats.length === 0 && (
            <span style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)' }}>Nincs találat</span>
          )}
        </div>

        <div className="chart-wrapper mtc-chart" style={{ height: '380px' }}>
          {datasets.length > 0 ? (
            <Line data={{ labels, datasets }} options={opts} />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👆</div>
              <div className="empty-state-title">Válasszon ki legalább egy alkategóriát</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

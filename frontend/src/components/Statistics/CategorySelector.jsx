import React, { useState, useEffect, useMemo } from 'react';
import { apiCall } from '../../services/api.js';

const MAX_SELECTED = 5;

const PALETTE = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4',
];

function fmt(v) {
  if (v === null || v === undefined || isNaN(v)) return '–';
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(v);
}

function getStatsForCat(rows) {
  if (!rows.length) return null;
  const unit = rows[0]?.Mertekegyseg || '';
  const allMin = rows.map(d => parseFloat(d.LegolcsobbEgyMennyiseg) || 0);
  const allMax = rows.map(d => parseFloat(d.LegdragabbEgyMennyiseg) || 0);
  const allAvg = rows.map(d => parseFloat(d.KiszamoltAtlag) || 0);
  return {
    min: Math.min(...allMin),
    max: Math.max(...allMax),
    avg: allAvg.reduce((s, v) => s + v, 0) / allAvg.length,
    current: allAvg[allAvg.length - 1],
    ingadozas: rows.reduce((s, d) => s + (parseFloat(d.Ingadozas) || 0), 0),
    unit,
  };
}

export default function CategorySelector() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
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
        setSelectedCats(cats.length ? [cats[0]] : []);
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

  const availableToAdd = useMemo(
    () => categories.filter(c => !selectedCats.includes(c)),
    [categories, selectedCats]
  );

  const addCategory = (cat) => {
    if (!cat || selectedCats.includes(cat) || selectedCats.length >= MAX_SELECTED) return;
    setSelectedCats(prev => [...prev, cat]);
  };

  const removeCategory = (cat) => {
    setSelectedCats(prev => prev.filter(c => c !== cat));
  };

  // Stats per selected category
  const allStats = useMemo(() => {
    return selectedCats.map(cat => {
      const rows = rawData.filter(d => d.Alkategoria === cat).sort((a, b) => a.Datum.localeCompare(b.Datum));
      return { cat, rows, stats: getStatsForCat(rows) };
    });
  }, [rawData, selectedCats]);

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
        <label className="form-label cs-label">Alkategória ({selectedCats.length}/{MAX_SELECTED})</label>
        <select
          className="form-control cs-select"
          value=""
          onChange={e => { addCategory(e.target.value); }}
          disabled={selectedCats.length >= MAX_SELECTED}
        >
          <option value="">+ Alkategória hozzáadása...</option>
          {availableToAdd.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Comparison table */}
      {allStats.length > 0 && allStats.some(s => s.stats) && (
        <div className="cs-table-wrap">
          <table className="cs-compare-table">
            <thead>
              <tr>
                <th className="cs-th-name">Alkategória</th>
                <th className="cs-th cs-th-success">Min. ár</th>
                <th className="cs-th cs-th-danger">Max. ár</th>
                <th className="cs-th cs-th-primary">Átlagár</th>
                <th className="cs-th cs-th-info">Jelenlegi</th>
                <th className="cs-th cs-th-warning">Ingadozás</th>
                <th className="cs-th-action"></th>
              </tr>
            </thead>
            <tbody>
              {allStats.map(({ cat, stats }, i) => {
                const color = PALETTE[i % PALETTE.length];
                return stats ? (
                  <tr key={cat} className="cs-compare-row">
                    <td className="cs-td-name">
                      <span className="cs-dot" style={{ background: color }} />
                      <span className="cs-cat-name">{cat}</span>
                      {stats.unit && <span className="cs-cat-unit">/ {stats.unit}</span>}
                    </td>
                    <td className="cs-td cs-td-success">{fmt(stats.min)}</td>
                    <td className="cs-td cs-td-danger">{fmt(stats.max)}</td>
                    <td className="cs-td cs-td-primary">{fmt(stats.avg)}</td>
                    <td className="cs-td cs-td-info">{fmt(stats.current)}</td>
                    <td className="cs-td cs-td-warning">{fmt(stats.ingadozas)}</td>
                    <td className="cs-td-action">
                      <button className="cs-remove-btn" onClick={() => removeCategory(cat)} title="Eltávolítás">×</button>
                    </td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}


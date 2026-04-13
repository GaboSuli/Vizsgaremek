import React, { useState, useEffect, useMemo } from 'react';
import { apiCall } from '../../services/api.js';

function fmt(v) {
  if (v === null || v === undefined || isNaN(Number(v))) return '–';
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(Number(v));
}

function SortIcon({ active, dir }) {
  if (!active) return <span className="pt-sort-icon pt-sort-inactive">↕</span>;
  return <span className="pt-sort-icon pt-sort-active">{dir === 'asc' ? '↑' : '↓'}</span>;
}

export default function PriceTable({ year }) {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: 'KiszamoltAtlag', dir: 'desc' });

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setSearch('');

    apiCall(`/statisztika/ev/${year}`).then(res => {
      if (!active) return;
      if (res.success && Array.isArray(res.data)) {
        // Group by Alkategoria name, average KiszamoltAtlag, keep min/max aggregates
        const grouped = {};
        for (const row of res.data) {
          const key = row.Alkategoria;
          if (!grouped[key]) {
            grouped[key] = {
              Alkategoria: row.Alkategoria,
              Mertekegyseg: row.Mertekegyseg || '',
              _sum: parseFloat(row.KiszamoltAtlag) || 0,
              _count: 1,
              LegolcsobbEgyMennyiseg: parseFloat(row.LegolcsobbEgyMennyiseg) || 0,
              LegdragabbEgyMennyiseg: parseFloat(row.LegdragabbEgyMennyiseg) || 0,
              Ingadozas: parseFloat(row.Ingadozas) || 0,
            };
          } else {
            grouped[key]._sum += parseFloat(row.KiszamoltAtlag) || 0;
            grouped[key]._count++;
            grouped[key].LegolcsobbEgyMennyiseg = Math.min(
              grouped[key].LegolcsobbEgyMennyiseg,
              parseFloat(row.LegolcsobbEgyMennyiseg) || 0
            );
            grouped[key].LegdragabbEgyMennyiseg = Math.max(
              grouped[key].LegdragabbEgyMennyiseg,
              parseFloat(row.LegdragabbEgyMennyiseg) || 0
            );
            grouped[key].Ingadozas = Math.max(
              grouped[key].Ingadozas,
              parseFloat(row.Ingadozas) || 0
            );
          }
        }
        const result = Object.values(grouped).map(g => ({
          ...g,
          KiszamoltAtlag: g._sum / g._count,
        }));
        setRawData(result);
      } else if (res.success) {
        setRawData([]);
      } else {
        setError('Nem sikerült betölteni az éves árakat.');
      }
      setLoading(false);
    });

    return () => { active = false; };
  }, [year]);

  const displayed = useMemo(() => {
    let rows = rawData.filter(r =>
      (r.Alkategoria || '').toLowerCase().includes(search.toLowerCase())
    );
    rows = [...rows].sort((a, b) => {
      const av = parseFloat(a[sort.key]) || 0;
      const bv = parseFloat(b[sort.key]) || 0;
      return sort.dir === 'asc' ? av - bv : bv - av;
    });
    return rows;
  }, [rawData, search, sort]);

  const toggleSort = key => {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
  };

  if (loading) return <div className="loading-state"><div className="spinner" /></div>;
  if (error) return <div className="alert alert-warning">⚠️ {error}</div>;

  return (
    <div className="card pt-card">
      <div className="card-header pt-header">
        <div className="pt-controls">
          <div className="pt-search-wrap">
            <svg className="pt-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="form-control pt-search"
              placeholder="Keresés alkategória neve alapján..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="badge badge-primary">{displayed.length} termék</span>
        </div>
      </div>

      {!displayed.length ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">
            {rawData.length ? 'Nincs találat a keresésre' : `Nincs jóváhagyott adat ${year}-re`}
          </div>
          <div className="empty-state-sub">A statisztikák csak jóváhagyott bevásárlásokból készülnek</div>
        </div>
      ) : (
        <div className="table-container pt-table-container">
          <table className="data-table pt-table">
            <thead>
              <tr>
                <th>Alkategória</th>
                <th
                  className="pt-sortable"
                  onClick={() => toggleSort('KiszamoltAtlag')}
                >
                  Átlagár <SortIcon active={sort.key === 'KiszamoltAtlag'} dir={sort.dir} />
                </th>
                <th
                  className="pt-sortable"
                  onClick={() => toggleSort('LegolcsobbEgyMennyiseg')}
                >
                  Min. ár <SortIcon active={sort.key === 'LegolcsobbEgyMennyiseg'} dir={sort.dir} />
                </th>
                <th
                  className="pt-sortable"
                  onClick={() => toggleSort('LegdragabbEgyMennyiseg')}
                >
                  Max. ár <SortIcon active={sort.key === 'LegdragabbEgyMennyiseg'} dir={sort.dir} />
                </th>
                <th
                  className="pt-sortable"
                  onClick={() => toggleSort('Ingadozas')}
                >
                  Ingadozás <SortIcon active={sort.key === 'Ingadozas'} dir={sort.dir} />
                </th>
                <th>Mértékegység</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((row, i) => {
                const ing = parseFloat(row.Ingadozas) || 0;
                const ingClass = ing > 1000 ? 'badge-danger' : ing > 200 ? 'badge-warning' : 'badge-success';
                return (
                  <tr key={i}>
                    <td>
                      <span className="pt-row-name">{row.Alkategoria}</span>
                    </td>
                    <td><strong className="pt-avg">{fmt(row.KiszamoltAtlag)}</strong></td>
                    <td><span className="pt-min">{fmt(row.LegolcsobbEgyMennyiseg)}</span></td>
                    <td><span className="pt-max">{fmt(row.LegdragabbEgyMennyiseg)}</span></td>
                    <td>
                      <span className={`badge ${ingClass}`}>{fmt(row.Ingadozas)}</span>
                    </td>
                    <td><span className="pt-unit">{row.Mertekegyseg || '–'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

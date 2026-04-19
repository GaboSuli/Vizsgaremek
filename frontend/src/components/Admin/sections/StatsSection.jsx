import React, { useState, useEffect } from 'react';
import { getAllStatistics, getYearStatistics } from '../../../services/adminService.js';

function fmtCur(n) {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toLocaleString('hu-HU') + ' Ft';
}

/* ── Horizontal bar chart ─────────────────────── */
function HBarChart({ items, valueKey = 'atlag_ar', labelKey = 'megnevezes', color = 'var(--clr-primary)' }) {
  if (!items?.length) return <p className="adm2-empty-text">Nincs adat</p>;
  const maxVal = Math.max(...items.map(i => Number(i[valueKey] || 0)), 1);
  return (
    <div className="adm2-hbar-chart">
      {items.slice(0, 12).map((item, i) => {
        const val = Number(item[valueKey] || 0);
        const pct = Math.max((val / maxVal) * 100, 1);
        const label = item[labelKey] || item.megnevezes || item.nev || `#${i + 1}`;
        return (
          <div key={i} className="adm2-hbar-row">
            <span className="adm2-hbar-label" title={label}>{label.length > 18 ? label.slice(0, 18) + '…' : label}</span>
            <div className="adm2-hbar-track">
              <div className="adm2-hbar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="adm2-hbar-value">{fmtCur(val)}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Monthly trend line (pure CSS) ───────────── */
function MonthlyTrend({ data, months }) {
  if (!data?.length || !months?.length) return <p className="adm2-empty-text">Nincs havi adat</p>;
  const values = months.map(m => Number(allStats.find(d => d.Datum === m)?.KiszamoltAtlag || 0));
  const max = Math.max(...values, 1);
  return (
    <div className="adm2-trend-chart">
      {values.map((v, i) => (
        <div key={i} className="adm2-trend-col">
          <div className="adm2-trend-val">{v > 0 ? fmtCur(v) : ''}</div>
          <div className="adm2-trend-bar-track">
            <div className="adm2-trend-bar" style={{ height: `${Math.max((v / max) * 100, 2)}%` }} />
          </div>
          <div className="adm2-trend-lbl">{months[i]}</div>
        </div>
      ))}
    </div>
  );
}

export default function StatsSection() {
  const [allStats, setAllStats] = useState([]);
  const [yearStats, setYearStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearLoading, setYearLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('year');

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getAllStatistics();
      if (res.success) {
        const d = res.data;
        setAllStats(Array.isArray(d) ? d : (d?.data || []));
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setYearLoading(true);
      const res = await getYearStatistics(selectedYear);
      if (res.success) {
        const d = res.data;
        setYearStats(Array.isArray(d) ? d : (d?.data || []));
      }
      setYearLoading(false);
    })();
  }, [selectedYear]);

  // Build monthly pivot from allStats
  const monthlyData = React.useMemo(() => {
    if (!allStats.length) return { months: [], categories: [] };
    const months = [...new Set(allStats.map(s => s.Datum).filter(Boolean))].sort();
    const cats = [...new Set(allStats.map(s => s.Alkategoria).filter(Boolean))];
    return { months: months.slice(-6), categories: cats };
  }, [allStats]);

  return (
    <div className="adm2-section">
      <div className="adm2-section-head">
        <div>
          <h2 className="adm2-section-title">Statisztikák</h2>
          <p className="adm2-section-sub">Alkategória árak havi alakulása és éves összesítő</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="adm2-stat-tabs">
        <button className={`adm2-stat-tab ${activeTab === 'year' ? 'adm2-stat-tab--active' : ''}`} onClick={() => setActiveTab('year')}>
          Éves átlagárak
        </button>
        <button className={`adm2-stat-tab ${activeTab === 'monthly' ? 'adm2-stat-tab--active' : ''}`} onClick={() => setActiveTab('monthly')}>
          Havi trendek
        </button>
      </div>

      {activeTab === 'year' && (
        <div className="adm2-stats-panel">
          <div className="adm2-stats-toolbar">
            <label className="adm2-year-label">Év:</label>
            {yearOptions.map(y => (
              <button
                key={y}
                className={`adm2-year-btn ${selectedYear === y ? 'adm2-year-btn--active' : ''}`}
                onClick={() => setSelectedYear(y)}
              >{y}</button>
            ))}
          </div>
          {yearLoading ? (
            <div className="adm2-loading"><div className="adm2-spinner" /><span>Betöltés...</span></div>
          ) : (
            <div className="adm2-stats-content">
              <div className="adm2-card adm2-card--full">
                <div className="adm2-card-head">
                  <h3>Alkategóriák átlagára — {selectedYear}</h3>
                  <span className="adm2-badge adm2-badge--info">{yearStats.length} alkategória</span>
                </div>
                <div className="adm2-card-body">
                  <HBarChart items={yearStats} valueKey="KiszamoltAtlag" labelKey="Alkategoria" color="var(--clr-primary)" />
                </div>
              </div>
              {yearStats.length > 0 && (
                <div className="adm2-table-wrap">
                  <table className="adm2-table">
                    <thead><tr><th>#</th><th>Alkategória</th><th>Átlagár ({selectedYear})</th></tr></thead>
                    <tbody>
                      {yearStats.slice(0, 30).map((s, i) => (
                        <tr key={s.id || i}>
                          <td className="adm2-cell-id">{i + 1}</td>
                          <td>{s.Alkategoria || '—'}</td>
                          <td><strong>{fmtCur(s.KiszamoltAtlag)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'monthly' && (
        <div className="adm2-stats-panel">
          {loading ? (
            <div className="adm2-loading"><div className="adm2-spinner" /><span>Betöltés...</span></div>
          ) : allStats.length === 0 ? (
            <div className="adm2-empty"><ChartIcon /><p>Nincs statisztika adat</p></div>
          ) : (
            <div className="adm2-stats-content">
              <div className="adm2-card adm2-card--full">
                <div className="adm2-card-head">
                  <h3>Havi átlagár változások (utolsó 6 hónap)</h3>
                </div>
                <div className="adm2-card-body">
                  <MonthlyTrend data={allStats} months={monthlyData.months} />
                </div>
              </div>
              <div className="adm2-card adm2-card--full">
                <div className="adm2-card-head">
                  <h3>Összes statisztika adat</h3>
                  <span className="adm2-badge adm2-badge--info">{allStats.length} rekord</span>
                </div>
                <div className="adm2-table-wrap">
                  <table className="adm2-table">
                    <thead>
                      <tr>
                        <th>Alkategória</th>
                        <th>Hónap</th>
                        <th>Átlagár</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allStats.slice(0, 50).map((s, i) => (
                        <tr key={i}>
                          <td>{s.Alkategoria || '—'}</td>
                          <td className="adm2-cell-date">{s.Datum || '—'}</td>
                          <td>{fmtCur(s.KiszamoltAtlag)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const ChartIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;

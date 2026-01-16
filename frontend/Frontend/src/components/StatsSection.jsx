import React from 'react';
import './Foldal.css';

function StatCard({ value, label }) {
  return (
    <div className="stat-card card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section id="stats" className="stats-section">
      <h2>Statisztikák – gyors áttekintés</h2>
      <div className="stats-grid">
        <StatCard value="+12%" label="Átlagos árváltozás (hó)" />
        <StatCard value="1,234" label="Összes bevásárlólista" />
        <StatCard value="523" label="Aktív kuponok" />
        <StatCard value="89" label="Közösségi csoportok" />
      </div>
    </section>
  );
}

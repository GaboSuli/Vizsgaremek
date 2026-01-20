import React, { useEffect, useState } from 'react';
import './Foldal.css';
import { getAllAlkategoriasStats } from '../services/statisticsService';

function StatCard({ value, label }) {
  return (
    <div className="stat-card card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalCategories: '—',
    averagePrice: '—',
    minPrice: '—',
    maxPrice: '—'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await getAllAlkategoriasStats();
        if (result.success && result.statistics) {
          setStats({
            totalCategories: result.statistics.totalCategories,
            averagePrice: result.statistics.averagePrice?.toLocaleString() + ' Ft',
            minPrice: result.statistics.minPrice?.toLocaleString() + ' Ft',
            maxPrice: result.statistics.maxPrice?.toLocaleString() + ' Ft'
          });
        }
      } catch (error) {
        console.error('Hiba a statisztikák betöltéskor:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <section id="stats" className="stats-section">
      <h2>Statisztikák – gyors áttekintés</h2>
      <div className="stats-grid">
        <StatCard value={stats.totalCategories} label="Alkategóriák száma" />
        <StatCard value={stats.averagePrice} label="Átlagár" />
        <StatCard value={stats.minPrice} label="Legalacsonyabb ár" />
        <StatCard value={stats.maxPrice} label="Legmagasabb ár" />
      </div>
    </section>
  );
}

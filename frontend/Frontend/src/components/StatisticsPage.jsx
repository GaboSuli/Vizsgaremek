import React from 'react';
import UserStatistics from './UserStatistics.jsx';
import AlkategoriaMonthlyStats from './AlkategoriaMonthlyStats.jsx';
import AllAlkategoriasStats from './AllAlkategoriasStats.jsx';
import './StatisticsPage.css';

export default function StatisticsPage() {
  return (
    <div className="stats-page">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Statisztikák</h1>
            <p className="page-subtitle">Teljes áttekintés az Ön kiadásairól és megtakarításairól</p>
          </div>
        </div>

        <div className="stats-section">
          <UserStatistics />
        </div>

        <div className="stats-section">
          <AlkategoriaMonthlyStats />
        </div>

        <div className="stats-section">
          <AllAlkategoriasStats />
        </div>
      </div>
    </div>
  );
}

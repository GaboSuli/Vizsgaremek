import React from 'react';
import { Container } from 'react-bootstrap';
import UserStatistics from './UserStatistics.jsx';
import AlkategoriaMonthlyStats from './AlkategoriaMonthlyStats.jsx';
import AllAlkategoriasStats from './AllAlkategoriasStats.jsx';
import './StatisticsPage.css';

export default function StatisticsPage() {
  return (
    <div className="statistics-page">
      <div className="statistics-hero">
        <Container>
          <div className="hero-content">
            <h1 className="hero-title">Statisztikák & Elemzés</h1>
            <p className="hero-subtitle">Teljes áttekintés az Ön költségvetéséről, megtakarításairól és az árváltozásokról</p>
          </div>
        </Container>
      </div>

      <div className="statistics-content">
        <Container>
          <UserStatistics />
        </Container>
      </div>

      <div className="statistics-section price-trends-section">
        <Container>
          <AlkategoriaMonthlyStats />
        </Container>
      </div>

      <div className="statistics-section category-section">
        <Container>
          <AllAlkategoriasStats />
        </Container>
      </div>
    </div>
  );
}

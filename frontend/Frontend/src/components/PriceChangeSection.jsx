import React, { useEffect, useState } from 'react';
import { getAlkategoriaMonthlyStats } from '../services/statisticsService';
import './Foldal.css';

export default function PriceChangeSection() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getAlkategoriaMonthlyStats();
        if (result.success) {
          setMonthlyData(result.rawData);
          setStatistics(result.statistics);
        }
      } catch (error) {
        console.error('Hiba az árváltozás adatok betöltéskor:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return null;
  }

  const priceChange = statistics ? (
    ((statistics.current - statistics.min) / statistics.min * 100).toFixed(1)
  ) : '0';

  const trend = statistics && statistics.current >= statistics.min ? 'up' : 'down';

  return (
    <section className="price-change-section">
      <div className="price-change-container">
        <h2>Árváltozás az utóbbi hónapokban</h2>
        
        <div className="price-change-cards">
          <div className={`price-card trend-${trend}`}>
            <div className="price-icon">📊</div>
            <div className="price-info">
              <h3>{priceChange}%</h3>
              <p>{trend === 'up' ? 'Áremelkedés' : 'Árleszálást'}</p>
            </div>
          </div>

          <div className="price-card price-range">
            <div className="price-icon">💰</div>
            <div className="price-info">
              <h3>Árkategória</h3>
              <p>{statistics?.min?.toLocaleString()} - {statistics?.max?.toLocaleString()} Ft</p>
            </div>
          </div>

          <div className="price-card current-price">
            <div className="price-icon">📈</div>
            <div className="price-info">
              <h3>Jelenlegi ár</h3>
              <p>{statistics?.current?.toLocaleString()} Ft</p>
            </div>
          </div>
        </div>

        <div className="monthly-timeline">
          <h3>Havi áttekintés</h3>
          <div className="timeline-items">
            {monthlyData.map((item, index) => (
              <div key={index} className="timeline-item">
                <span className="timeline-month">{item.month}</span>
                <span className="timeline-price">{item.price.toLocaleString()} Ft</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

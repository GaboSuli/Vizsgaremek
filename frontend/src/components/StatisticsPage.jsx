import React, { useState } from 'react';
import SummaryCards    from './Statistics/SummaryCards.jsx';
import ExpenseChart    from './Statistics/ExpenseChart.jsx';
import MonthlyTrendChart from './Statistics/MonthlyTrendChart.jsx';
import CategorySelector from './Statistics/CategorySelector.jsx';
import PriceTable       from './Statistics/PriceTable.jsx';
import YearFilter       from './Statistics/YearFilter.jsx';
import './StatisticsPage.css';
import './Statistics/Statistics.css';

export default function StatisticsPage() {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <div className="stats-page">
      <div className="page-container">

        {/* ── Header ── */}
        <div className="page-header sp-header">
          <div>
            <h1 className="page-title">Statisztikák</h1>
            <p className="page-subtitle">Valós idejű pénzügyi kimutatások és piaci árelemzések</p>
          </div>
          <YearFilter value={year} onChange={setYear} />
        </div>

        {/* ── Quick overview cards ── */}
        <section className="sp-section">
          <SummaryCards year={year} />
        </section>

        {/* ── User expense breakdown ── */}
        <section className="sp-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Saját kiadásaim</h2>
              <p className="section-subtitle">Alkategóriák szerinti bontásban – összes idők</p>
            </div>
          </div>
          <ExpenseChart />
        </section>

        {/* ── Market price monitor ── */}
        <section className="sp-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Piaci árfigyelő</h2>
              <p className="section-subtitle">Alkategóriák havi átlagár változása – válasszon ki kategóriákat a tag gombokkal</p>
            </div>
          </div>
          <MonthlyTrendChart />
        </section>

        {/* ── Single-category detail ── */}
        <section className="sp-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Alkategória részletes trend</h2>
              <p className="section-subtitle">Válasszon egy alkategóriát a havi ármozgás részletes megtekintéséhez</p>
            </div>
          </div>
          <CategorySelector />
        </section>

        {/* ── Year price table ── */}
        <section className="sp-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">{year} – Éves átlagárak</h2>
              <p className="section-subtitle">Összes alkategória átlagára, minimuma, maximuma és ingadozása</p>
            </div>
          </div>
          <PriceTable year={year} />
        </section>

      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  getEURRate,
  getUSDRate,
  getInflationRate,
  getGBPRate,
  getCHFRate,
  getPLNRate,
} from "../services/currencyService";
import "./Foldal.css";

export default function PriceChangeSection() {
  const [eurData, setEurData] = useState(null);
  const [usdData, setUsdData] = useState(null);
  const [gbpData, setGbpData] = useState(null);
  const [chfData, setChfData] = useState(null);
  const [plnData, setPlnData] = useState(null);

  const [inflationData, setInflationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eur, usd, gbp, chf, pln, inflation] = await Promise.all([
          getEURRate(),
          getUSDRate(),
          getGBPRate(),
          getCHFRate(),
          getPLNRate(),
          getInflationRate(),
        ]);
        setEurData(eur);
        setUsdData(usd);
        setGbpData(gbp);
        setChfData(chf);
        setPlnData(pln),
        ( setInflationData(inflation));
      } catch (error) {
        console.error("Hiba az adatok betöltéskor:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <section className="price-change-section">
      <div className="price-change-container">
        <h2>Pénzügyi mutatók</h2>

        <div className="price-change-cards">
          {eurData && (
            <div
              className={`price-card trend-${eurData.change >= 0 ? "up" : "down"}`}
            >
              <div className="price-icon">€</div>
              <div className="price-info">
                <h3>{eurData.current} Ft</h3>
                <p>
                  EUR/HUF ({eurData.change > 0 ? "+" : ""}
                  {eurData.change}%)
                </p>
                {eurData.currentMonth && (
                  <small className="date-info">
                    {eurData.currentMonth.month} {eurData.currentMonth.year}
                  </small>
                )}
              </div>
            </div>
          )}

          {usdData && (
            <div
              className={`price-card trend-${usdData.change >= 0 ? "up" : "down"}`}
            >
              <div className="price-icon">$</div>
              <div className="price-info">
                <h3>{usdData.current} Ft</h3>
                <p>
                  USD/HUF ({usdData.change > 0 ? "+" : ""}
                  {usdData.change}%)
                </p>
                {usdData.currentMonth && (
                  <small className="date-info">
                    {usdData.currentMonth.month} {usdData.currentMonth.year}
                  </small>
                )}
              </div>
            </div>
          )}

          {gbpData && (
            <div
              className={`price-card trend-${gbpData.change >= 0 ? "up" : "down"}`}
            >
              <div className="price-icon">£</div>
              <div className="price-info">
                <h3>{gbpData.current} Ft</h3>
                <p>
                  GBP/HUF ({gbpData.change > 0 ? "+" : ""}
                  {gbpData.change}%)
                </p>
                {gbpData.currentMonth && (
                  <small className="date-info">
                    {gbpData.currentMonth.month} {gbpData.currentMonth.year}
                  </small>
                )}
              </div>
            </div>
          )}

          {chfData && (
            <div
              className={`price-card trend-${chfData.change >= 0 ? "up" : "down"}`}
            >
              <div className="price-icon">₣</div>
              <div className="price-info">
                <h3>{chfData.current} Ft</h3>
                <p>
                  CHF/HUF ({chfData.change > 0 ? "+" : ""}
                  {chfData.change}%)
                </p>
                {chfData.currentMonth && (
                  <small className="date-info">
                    {chfData.currentMonth.month} {chfData.currentMonth.year}
                  </small>
                )}
              </div>
            </div>
          )}
          {plnData && (
            <div
              className={`price-card trend-${plnData.change >= 0 ? "up" : "down"}`}
            >
              <div className="price-icon">zł</div>
              <div className="price-info">
                <h3>{plnData.current} Ft</h3>
                <p>
                  PLN/HUF ({plnData.change > 0 ? "+" : ""}
                  {plnData.change}%)
                </p>
                {plnData.currentMonth && (
                  <small className="date-info">
                    {plnData.currentMonth.month} {plnData.currentMonth.year}
                  </small>
                )}
              </div>
            </div>
          )}

          {inflationData && (
            <div className={`price-card inflation-${inflationData.trend}`}>
              <div className="price-icon">📊</div>
              <div className="price-info">
                <h3>{inflationData.current}%</h3>
                <p>Magyar infláció</p>
                {inflationData.currentMonth && (
                  <small className="date-info">
                    {inflationData.currentMonth.month}{" "}
                    {inflationData.currentMonth.year}
                  </small>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="monthly-timeline">
          <h3>Árfolyam és inflációs trend (havi)</h3>
          <div className="timeline-items">
            {eurData?.chartData?.labels?.map((monthData, index) => (
              <div key={index} className="timeline-item">
                <span className="timeline-month">
                  {monthData.month}{" "}
                  {monthData.year !== undefined ? monthData.year : ""}
                </span>
                <div className="timeline-values">
                  <span className="timeline-eur">
                    €: {eurData.chartData.data[index]} Ft
                  </span>
                  <span className="timeline-usd">
                    $: {usdData.chartData.data[index]} Ft
                  </span>
                  <span className="timeline-gbp">
                    £:{gbpData.chartData.data[index]} Ft
                  </span>
                  <span className="timeline-gbp">
                    ₣:{chfData.chartData.data[index]} Ft
                  </span>
                  <span className="timeline-gbp">
                    ₣:{chfData.chartData.data[index]} Ft
                  </span>
                  <span>

                  </span>
                  <span className="timeline-inflation">
                    I: {inflationData.chartData.data[index]}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

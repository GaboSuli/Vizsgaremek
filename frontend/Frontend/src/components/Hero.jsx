import React from 'react';
import './Foldal.css';

export default function Hero({ onPrimary, onSecondary }) {
  return (
    <section id="hero" className="hero">
      <div className="hero-inner">
        <h1 className="hero-title">Közösségi bevásárlólisták, kuponok és árstatisztikák — banki tranzakciók nélkül</h1>
        <p className="hero-lead">Egyszerűen hozhatsz létre és oszthatsz meg listákat, találsz kuponokat, és nyomon követheted az árakat — mindezt biztonságosan, pénzügyi integrációk nélkül.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={onPrimary}>Funkciók megtekintése</button>
          <button className="btn-secondary" onClick={onSecondary}>Belépés</button>
        </div>
      </div>
    </section>
  );
}

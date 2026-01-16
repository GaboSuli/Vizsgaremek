import React from 'react';
import './Foldal.css';

export default function HowItWorks() {
  return (
    <section id="how" className="how-section">
      <h2>Hogyan működik</h2>
      <div className="how-grid">
        <div className="how-step">
          <div className="step-badge">1</div>
          <h4>Regisztráció és csoport létrehozása</h4>
          <p>Hozd létre profilod, majd indíts egy csoportot, és hívd meg barátaidat.</p>
        </div>
        <div className="how-step">
          <div className="step-badge">2</div>
          <h4>Listák és kuponok hozzáadása</h4>
          <p>Készíts listákat, adj hozzá elemeket, és csatolj kuponokat a megtakarításhoz.</p>
        </div>
        <div className="how-step">
          <div className="step-badge">3</div>
          <h4>Nyomon követés és elemzés</h4>
          <p>Nézd meg az ártrendeket, és optimalizáld a vásárlásaidat a statisztikák alapján.</p>
        </div>
      </div>
    </section>
  );
}

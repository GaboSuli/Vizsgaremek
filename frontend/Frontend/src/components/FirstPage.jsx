import React, { useEffect } from 'react';
import { isAuthenticated } from '../services/authService.js';
import './FirstPage.css';

export default function FirstPage() {
  useEffect(() => {
    if (isAuthenticated()) {
      // If already authed, go to application root (App will render the dashboard)
      window.location.href = '/';
    }
  }, []);

  const goRegister = (target = null) => {
    // Navigate to registration view handled by App (uses ?page=register)
    const url = target ? `/?page=register&target=${encodeURIComponent(target)}` : '/?page=register';
    window.location.href = url;
  };

  const goLogin = (target = null) => {
    const url = target ? `/?page=login&target=${encodeURIComponent(target)}` : '/?page=login';
    window.location.href = url;
  };

  return (
    <div className="firstpage-root">
      <header className="fp-header">
        <div className="fp-logo">Szaldon</div>
        <div className="fp-actions">
          <button className="btn-outline" onClick={() => goLogin(null)}>Már van fiókom</button>
          <button className="btn-primary" onClick={() => goRegister(null)}>Regisztráció</button>
        </div>
      </header>

      <main className="fp-main">
        <section className="fp-hero">
          <div className="hero-inner">
            <h1 className="hero-title">Közösségi bevásárlólisták, kuponok és árstatisztika egy helyen</h1>
            <p className="hero-sub">Tervezd meg és oszd meg a bevásárlást, találj kuponokat és kövesd az árakat — takaríts meg időt és pénzt a közösségeddel.</p>
            <div className="hero-ctas">
              <button className="btn-primary large" onClick={() => goRegister(null)}>Kezdés most</button>
              <button className="btn-outline large" onClick={() => goLogin(null)}>Bejelentkezés</button>
            </div>

            <div className="fp-quicklinks" style={{marginTop: '1rem'}}>
              <small>Gyors hozzáférés (bejelentkezés után):</small>
              <div style={{display:'flex', gap:8, marginTop:8}}>
                <button className="btn-link" onClick={() => goLogin('lista')}>Vevési lista</button>
                <button className="btn-link" onClick={() => goLogin('kupon')}>Kuponok</button>
                <button className="btn-link" onClick={() => goLogin('shopping')}>Bevásárló lista</button>
                <button className="btn-link" onClick={() => goLogin('stats')}>Statisztika</button>
              </div>
            </div>

          </div>
          <div className="hero-visual" aria-hidden>
            {/* decorative illustration placeholder */}
            <div className="visual-card">🛒📊🎟️</div>
          </div>
        </section>

        <section className="fp-features">
          <h2>Főbb funkciók</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Felhasználók</h3>
              <p>Csapatokat és jogosultságokat kezelhetsz egyszerűen.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🧩</div>
              <h3>Csoportok</h3>
              <p>Oszd meg listáidat csoportokkal, együtt tervezve a vásárlást.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3>Bevásárlólisták</h3>
              <p>Készíts, oszd meg és kövess több bevásárlólistát.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎟️</div>
              <h3>Kuponok</h3>
              <p>Találd meg és használd a legjobb akciókat a költségcsökkentéshez.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Statisztikák</h3>
              <p>Árelemzések és megtakarítási betekintések egy kattintásra.</p>
            </div>
          </div>
        </section>

        <section className="fp-footer-cta">
          <div className="cta-inner">
            <h3>Csatlakozz még ma — könnyen és biztonságosan</h3>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => goRegister(null)}>Kezdés most</button>
              <button className="btn-outline" onClick={() => goLogin(null)}>Már van fiókom</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="fp-footer">
        <small>© {new Date().getFullYear()} Szaldon — Minden jog fenntartva.</small>
      </footer>
    </div>
  );
}

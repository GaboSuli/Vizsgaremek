import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';
import './FirstPage.css';

export default function FirstPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const goRegister = () => navigate('/register');
  const goLogin = () => navigate('/login');

  // quicklinks simply navigate to login with state from
  const goQuick = (path) => navigate('/login', { state: { from: { pathname: path } } });

  return (
    <div className="firstpage-root">
      <header className="fp-header">
        <div className="fp-logo">Szaldon</div>
        <div className="fp-actions">
          <button className="btn-outline" onClick={goLogin}>Már van fiókom</button>
          <button className="btn-primary" onClick={goRegister}>Regisztráció</button>
        </div>
      </header>

      <main className="fp-main">
        <section className="fp-hero">
          <div className="hero-inner">
            <h1 className="hero-title">Közösségi bevásárlólisták, kuponok és árstatisztika egy helyen</h1>
            <p className="hero-sub">Tervezd meg és oszd meg a bevásárlást, találj kuponokat és kövesd az árakat — takaríts meg időt és pénzt a közösségeddel.</p>
            <div className="hero-ctas">
              <button className="btn-primary large" onClick={goRegister}>Kezdés most</button>
              <button className="btn-outline large" onClick={goLogin}>Bejelentkezés</button>
            </div>

            <div className="fp-quicklinks" style={{marginTop: '1rem'}}>
              <small>Gyors hozzáférés (bejelentkezés után):</small>
              <div style={{display:'flex', gap:8, marginTop:8}}>
                <button className="btn-link" onClick={() => goQuick('/lista')}>Vevési lista</button>
                <button className="btn-link" onClick={() => goQuick('/kupon')}>Kuponok</button>
                <button className="btn-link" onClick={() => goQuick('/shopping')}>Bevásárló lista</button>
                <button className="btn-link" onClick={() => goQuick('/stats')}>Statisztika</button>
              </div>
            </div>

          </div>
          <div className="hero-visual" aria-hidden>
            {/* decorative illustration placeholder */}
            <div className="visual-card">🛒📊🎟️</div>
          </div>
        </section>
        {/* rest unchanged */}
      </main>

      <footer className="fp-footer">
        <small>© {new Date().getFullYear()} Szaldon — Minden jog fenntartva.</small>
      </footer>
    </div>
  );
}

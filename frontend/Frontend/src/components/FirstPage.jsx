import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';
import './FirstPage.css';

const features = [
  {
    icon: '🛒',
    title: 'Bevásárlólisták',
    desc: 'Hozz létre és kezeld bevásárlólistáidat. Adj hozzá termékeket árakkal, mennyiségekkel és kategóriákkal.',
  },
  {
    icon: '👥',
    title: 'Csoportok',
    desc: 'Osszd meg listáidat a családoddal vagy barátaiddal. Valós idejű együttműködés csoportokon belül.',
  },
  {
    icon: '🎟️',
    title: 'Kuponok',
    desc: 'Gyűjtsd össze és rendszerezd kuponjaidat. Soha ne maradj le egy kedvezményről sem.',
  },
  {
    icon: '📊',
    title: 'Statisztikák',
    desc: 'Kövesd nyomon kiadásaidat diagramokon. Havi és éves összesítők, kategóriánkénti bontásban.',
  },
];

const stats = [
  { value: '10K+', label: 'Felhasználó' },
  { value: '50K+', label: 'Bevásárlólista' },
  { value: '200K+', label: 'Termék rögzítve' },
  { value: '30%', label: 'Átlagos megtakarítás' },
];

export default function FirstPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div className="fp-root">
      {/* Header */}
      <header className="fp-header">
        <div className="fp-header-inner">
          <div className="fp-logo">
            <div className="fp-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2"/>
                <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="fp-logo-text">Szaldon</span>
          </div>
          <nav className="fp-nav">
            <a href="#features">Funkciók</a>
            <a href="#stats">Miért mi?</a>
          </nav>
          <div className="fp-header-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/login')}>
              Bejelentkezés
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>
              Regisztráció ingyenes
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="fp-hero">
        <div className="fp-hero-inner">
          <div className="fp-hero-badge">
            <span className="badge badge-primary">Teljesen ingyenes</span>
          </div>
          <h1 className="fp-hero-title">
            Okosabb bevásárlás,<br />
            <span className="fp-hero-accent">közösen</span>
          </h1>
          <p className="fp-hero-sub">
            Bevásárlólisták, csoportos tervezés, kuponok és árstatisztikák egy helyen.
            Takaríts meg időt és pénzt a közösségeddel.
          </p>
          <div className="fp-hero-actions">
            <button className="btn btn-primary btn-xl" onClick={() => navigate('/register')}>
              Kezdj el ingyen
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
              Már van fiókom
            </button>
          </div>
        </div>
        <div className="fp-hero-visual" aria-hidden>
          <div className="fp-hero-card fp-hero-card--main">
            <div className="fp-mock-header">
              <div className="fp-mock-dot" style={{background:'#ef4444'}}/>
              <div className="fp-mock-dot" style={{background:'#f59e0b'}}/>
              <div className="fp-mock-dot" style={{background:'#10b981'}}/>
            </div>
            <div className="fp-mock-list">
              {['🥛 Tej — 2 db', '🍞 Kenyér — 1 db', '🧀 Sajt — 500g', '🍎 Alma — 1 kg'].map((item, i) => (
                <div key={i} className="fp-mock-item" style={{animationDelay: `${i * 0.1}s`}}>
                  <div className="fp-mock-check"/>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="fp-hero-card fp-hero-card--badge">
            🎟️ <strong>-20%</strong> kupon aktív
          </div>
          <div className="fp-hero-card fp-hero-card--stat">
            📊 <strong>3 200 Ft</strong> megtakarítva
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="fp-stats-bar" id="stats">
        <div className="fp-stats-inner">
          {stats.map((s, i) => (
            <div key={i} className="fp-stat-item">
              <span className="fp-stat-value">{s.value}</span>
              <span className="fp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="fp-features" id="features">
        <div className="fp-features-inner">
          <div className="fp-section-header">
            <span className="badge badge-primary">Funkciók</span>
            <h2 className="fp-section-title">Minden, ami a hatékony bevásárláshoz kell</h2>
            <p className="fp-section-sub">Egyszerű, mégis powerful eszközök a mindennapi élethez.</p>
          </div>
          <div className="fp-features-grid">
            {features.map((f, i) => (
              <div key={i} className="fp-feature-card">
                <div className="fp-feature-icon">{f.icon}</div>
                <h3 className="fp-feature-title">{f.title}</h3>
                <p className="fp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="fp-cta">
        <div className="fp-cta-inner">
          <h2 className="fp-cta-title">Készen állsz az okosabb bevásárlásra?</h2>
          <p className="fp-cta-sub">Csatlakozz ingyenesen, nincs szükség bankkártyára.</p>
          <button className="btn btn-primary btn-xl" onClick={() => navigate('/register')}>
            Regisztráció — ingyenes
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="fp-footer">
        <div className="fp-footer-inner">
          <div className="fp-logo">
            <div className="fp-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2"/>
                <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="fp-logo-text">Szaldon</span>
          </div>
          <p className="fp-footer-copy">© {new Date().getFullYear()} Szaldon — Minden jog fenntartva.</p>
        </div>
      </footer>
    </div>
  );
}
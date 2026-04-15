import { useNavigate, Link } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import useCookieConsent from '../context/useCookieConsent.js';
import './FirstPage.css';

/* ── Data ──────────────────────────────────── */

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Csoportkezelés',
    desc: 'Hozz létre csoportokat családtagjaiddal, barátaiddal vagy kollégáiddal. Szervezd együtt a közös bevásárlásokat valós időben.',
    color: '#6366f1',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    title: 'Közös bevásárlólisták',
    desc: 'Készíts részletes listákat árakkal, mennyiségekkel és kategóriákkal. Oszd meg bárkivel egyetlen kattintással.',
    color: '#10b981',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="15" x2="15.01" y2="15"/>
        <line x1="9.5" y1="14.5" x2="14.5" y2="9.5"/>
      </svg>
    ),
    title: 'Kuponok',
    desc: 'Gyűjtsd és rendszerezd kuponjaidat egy helyen. Használd ki az akciók minden előnyét, és takaríts meg pénzt.',
    color: '#f59e0b',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
    title: 'Statisztikák',
    desc: 'Részletes diagramok havi és éves bontásban. Kövesd nyomon kiadásaidat és fedezd fel a megtakarítási lehetőségeket.',
    color: '#8b5cf6',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    title: 'Profil testreszabás',
    desc: 'Állítsd be profilodat, váltogass sötét és világos mód között, és szabd személyre az alkalmazást saját igényeid szerint.',
    color: '#06b6d4',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 9h6"/>
        <path d="M3 15h6"/>
      </svg>
    ),
    title: 'Admin rendszer',
    desc: 'Átfogó adminisztrációs felület felhasználók, csoportok és tartalmak kezeléséhez moderátorok és adminisztrátorok számára.',
    color: '#ef4444',
  },
];

const steps = [
  { num: '01', title: 'Regisztráció', desc: 'Hozd létre ingyenes fiókodat néhány másodperc alatt — nincs szükség bankkártyára.', icon: '📝' },
  { num: '02', title: 'Csoport létrehozása', desc: 'Hívd meg családtagjaidat, barátaidat vagy kollégáidat egy közös csoportba.', icon: '👥' },
  { num: '03', title: 'Listák megosztása', desc: 'Készíts bevásárlólistákat, add hozzá a termékeket, és oszd meg a csoportoddal.', icon: '📋' },
  { num: '04', title: 'Költések követése', desc: 'Elemezd kiadásaidat részletes statisztikákkal és diagramokkal.', icon: '📊' },
  { num: '05', title: 'Kuponok felhasználása', desc: 'Töltsd fel kuponjaidat, és spórolj minden bevásárlásnál.', icon: '🎟️' },
];

const benefits = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Villámgyors',
    desc: 'Azonnal reagáló felület, gyors betöltés és valós idejű szinkronizáció a csoporttagok között.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Időspórolás',
    desc: 'Nincs több felesleges körözés a boltban — előre tervezhetsz és hatékonyan vásárolhatsz.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    title: 'Átláthatóság',
    desc: 'Mindig tudod, ki mit vett, mennyit költött, és mire van még szükség — tiszta, áttekinthető felületen.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Közös szervezés',
    desc: 'Együtt tervezhetsz, vásárolhatsz és nyomon követheted a közös kiadásokat egy helyen.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Költségkontroll',
    desc: 'Részletes statisztikák segítenek kontrollálni kiadásaidat, és felfedezni hol spórolhatsz.',
  },
];

const testimonials = [
  {
    name: 'Kovács Anna',
    role: 'Családanya, 3 gyermek',
    text: 'A Szaldon teljesen megváltoztatta a heti bevásárlásainkat. Végre nem felejtünk el semmit, és sokkal kevesebbet költünk feleslegesen!',
    avatar: 'KA',
    rating: 5,
  },
  {
    name: 'Tóth Gábor',
    role: 'Egyetemi hallgató',
    text: 'Kollégiumi szobatársammal közösen vezetjük a listánkat. A kuponkezelés zseniális — havonta legalább 5000 Ft-ot spórolunk.',
    avatar: 'TG',
    rating: 5,
  },
  {
    name: 'Szabó Petra',
    role: 'Irodavezető',
    text: 'Az irodai bevásárlást is Szaldonnal intézzük. A statisztikák sokat segítenek a költségvetés tervezésében. Nagyon profi alkalmazás!',
    avatar: 'SP',
    rating: 5,
  },
];

const stats = [
  { value: '10K+', label: 'Felhasználó', icon: '👤' },
  { value: '50K+', label: 'Bevásárlólista', icon: '📋' },
  { value: '200K+', label: 'Termék rögzítve', icon: '🛒' },
  { value: '30%', label: 'Átlagos megtakarítás', icon: '💰' },
];

/* ── Scroll-reveal hook ────────────────────── */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

/* ── Component ─────────────────────────────── */

export default function FirstPage() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { openSettings: openCookieSettings } = useCookieConsent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  const [featRef, featVis] = useReveal();
  const [howRef, howVis] = useReveal();
  const [benRef, benVis] = useReveal();
  const [testRef, testVis] = useReveal();
  const [statRef, statVis] = useReveal();

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fp-root">
      {/* ── Header ────────────────────────── */}
      <header className={`fp-header${headerScrolled ? ' fp-header--scrolled' : ''}`}>
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
            <a href="#how">Hogyan működik?</a>
            <a href="#benefits">Előnyök</a>
            <a href="#testimonials">Vélemények</a>
          </nav>
          <div className="fp-header-actions">
            <button className="btn btn-icon fp-theme-btn" onClick={toggleTheme} aria-label="Téma váltás" title={isDarkMode ? 'Világos mód' : 'Sötét mód'}>
              {isDarkMode ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/login')}>
              Bejelentkezés
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>
              Regisztráció
            </button>
          </div>
          <button className="fp-mobile-menu-btn" aria-label="Menü" onClick={() => setMobileMenuOpen(o => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              {mobileMenuOpen
                ? <path d="M18 6 6 18M6 6l12 12"/>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="fp-mobile-menu">
            <nav className="fp-mobile-nav">
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Funkciók</a>
              <a href="#how" onClick={() => setMobileMenuOpen(false)}>Hogyan működik?</a>
              <a href="#benefits" onClick={() => setMobileMenuOpen(false)}>Előnyök</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Vélemények</a>
            </nav>
            <div className="fp-mobile-menu-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>
                Bejelentkezés
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}>
                Regisztráció
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ──────────────────────────── */}
      <section className="fp-hero">
        <div className="fp-hero-bg" aria-hidden="true">
          <div className="fp-hero-orb fp-hero-orb--1"/>
          <div className="fp-hero-orb fp-hero-orb--2"/>
          <div className="fp-hero-grid-pattern"/>
          <div className="fp-hero-noise"/>
        </div>
        <div className="fp-hero-content">
          <div className="fp-hero-inner">
            <div className="fp-hero-badge">
              <span className="fp-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Teljesen ingyenes
              </span>
            </div>
            <h1 className="fp-hero-title">
              Okosabb bevásárlás,<br />
              <span className="fp-hero-accent">közösen.</span>
            </h1>
            <p className="fp-hero-sub">
              Bevásárlólisták, csoportos tervezés, kuponok és részletes árstatisztikák egy helyen.
              Takaríts meg időt és pénzt a közösségeddel.
            </p>
            <div className="fp-hero-actions">
              <button className="btn btn-primary btn-xl fp-btn-glow" onClick={() => navigate('/register')}>
                Regisztráció
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
                Bejelentkezés
              </button>
              <a href="#features" className="btn btn-ghost btn-lg fp-features-link">
                További információ
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </a>
            </div>
            <div className="fp-hero-trust">
              <div className="fp-hero-trust-avatars">
                {['KA','TG','SP','NM','BZ'].map((initials, i) => (
                  <div key={i} className="fp-hero-trust-avatar" style={{zIndex: 5 - i}}>
                    {initials}
                  </div>
                ))}
              </div>
              <div className="fp-hero-trust-text">
                <div className="fp-hero-trust-stars">{'★★★★★'}</div>
                <span>10 000+ elégedett felhasználó</span>
              </div>
            </div>
          </div>
          <div className="fp-hero-visual" aria-hidden="true">
            <div className="fp-hero-card fp-hero-card--main">
              <div className="fp-mock-header">
                <div className="fp-mock-dot" style={{background:'#ef4444'}}/>
                <div className="fp-mock-dot" style={{background:'#f59e0b'}}/>
                <div className="fp-mock-dot" style={{background:'#10b981'}}/>
                <span className="fp-mock-title">Heti bevásárlás</span>
              </div>
              <div className="fp-mock-list">
                {['🥛 Tej — 2 db', '🍞 Kenyér — 1 db', '🧀 Sajt — 500g', '🍎 Alma — 1 kg'].map((item, i) => (
                  <div key={i} className="fp-mock-item" style={{animationDelay: `${i * 0.12}s`}}>
                    <div className="fp-mock-check"/>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="fp-hero-card fp-hero-card--badge fp-float-anim">
              🎟️ <strong>-20%</strong> kupon aktív
            </div>
            <div className="fp-hero-card fp-hero-card--stat fp-float-anim-delay">
              📊 <strong>3 200 Ft</strong> megtakarítva
            </div>
            <div className="fp-hero-card fp-hero-card--group fp-float-anim">
              👥 <strong>Család</strong> csoport
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────── */}
      <section className={`fp-stats-bar${statVis ? ' fp-reveal' : ''}`} id="stats" ref={statRef}>
        <div className="fp-stats-inner">
          {stats.map((s, i) => (
            <div key={i} className="fp-stat-item" style={{animationDelay: `${i * 0.1}s`}}>
              <span className="fp-stat-icon">{s.icon}</span>
              <span className="fp-stat-value">{s.value}</span>
              <span className="fp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────── */}
      <section className={`fp-features${featVis ? ' fp-reveal' : ''}`} id="features" ref={featRef}>
        <div className="fp-features-inner">
          <div className="fp-section-header">
            <span className="fp-pill">Funkciók</span>
            <h2 className="fp-section-title">Minden, ami a hatékony bevásárláshoz kell</h2>
            <p className="fp-section-sub">Egyszerű, mégis hatékony eszközök a mindennapi élethez.</p>
          </div>
          <div className="fp-features-grid">
            {features.map((f, i) => (
              <div key={i} className="fp-feature-card" style={{animationDelay: `${i * 0.08}s`}}>
                <div className="fp-feature-icon-wrap" style={{background: f.color + '15', color: f.color}}>
                  {f.icon}
                </div>
                <h3 className="fp-feature-title">{f.title}</h3>
                <p className="fp-feature-desc">{f.desc}</p>
                <div className="fp-feature-shine" aria-hidden="true"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────── */}
      <section className={`fp-how${howVis ? ' fp-reveal' : ''}`} id="how" ref={howRef}>
        <div className="fp-how-inner">
          <div className="fp-section-header">
            <span className="fp-pill">Hogyan működik?</span>
            <h2 className="fp-section-title">Kezdj el spórolni 5 lépésben</h2>
            <p className="fp-section-sub">A regisztrációtól a megspórolt forintokig — ilyen egyszerű.</p>
          </div>
          <div className="fp-steps">
            <div className="fp-steps-line" aria-hidden="true"/>
            {steps.map((s, i) => (
              <div key={i} className="fp-step" style={{animationDelay: `${i * 0.12}s`}}>
                <div className="fp-step-num-wrap">
                  <div className="fp-step-num">{s.num}</div>
                </div>
                <div className="fp-step-emoji">{s.icon}</div>
                <h3 className="fp-step-title">{s.title}</h3>
                <p className="fp-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────── */}
      <section className={`fp-benefits${benVis ? ' fp-reveal' : ''}`} id="benefits" ref={benRef}>
        <div className="fp-benefits-inner">
          <div className="fp-section-header">
            <span className="fp-pill">Miért válaszd a Szaldont?</span>
            <h2 className="fp-section-title">Felhasználóink kedvenc előnyei</h2>
            <p className="fp-section-sub">Ezért szeretik tízezrek a Szaldont a mindennapi bevásárláshoz.</p>
          </div>
          <div className="fp-benefits-grid">
            {benefits.map((b, i) => (
              <div key={i} className="fp-benefit-card" style={{animationDelay: `${i * 0.08}s`}}>
                <div className="fp-benefit-icon">{b.icon}</div>
                <h3 className="fp-benefit-title">{b.title}</h3>
                <p className="fp-benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────── */}
      <section className={`fp-testimonials${testVis ? ' fp-reveal' : ''}`} id="testimonials" ref={testRef}>
        <div className="fp-testimonials-inner">
          <div className="fp-section-header">
            <span className="fp-pill">Vélemények</span>
            <h2 className="fp-section-title">Amit felhasználóink mondanak</h2>
            <p className="fp-section-sub">Valós visszajelzések valós felhasználóktól.</p>
          </div>
          <div className="fp-testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="fp-testimonial-card" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="fp-testimonial-stars">
                  {Array.from({ length: t.rating }, (_, j) => (
                    <svg key={j} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="fp-testimonial-text">"{t.text}"</p>
                <div className="fp-testimonial-author">
                  <div className="fp-testimonial-avatar">{t.avatar}</div>
                  <div>
                    <div className="fp-testimonial-name">{t.name}</div>
                    <div className="fp-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────── */}
      <section className="fp-cta">
        <div className="fp-cta-bg" aria-hidden="true">
          <div className="fp-cta-orb fp-cta-orb--1"/>
          <div className="fp-cta-orb fp-cta-orb--2"/>
        </div>
        <div className="fp-cta-inner">
          <h2 className="fp-cta-title">Készen állsz az okosabb bevásárlásra?</h2>
          <p className="fp-cta-sub">Csatlakozz ingyenesen — nincs szükség bankkártyára.</p>
          <div className="fp-cta-actions">
            <button className="btn btn-primary btn-xl fp-cta-btn" onClick={() => navigate('/register')}>
              Regisztráció — ingyenes
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')} style={{background:'rgba(255,255,255,0.15)', color:'white', borderColor:'rgba(255,255,255,0.25)'}}>
              Már van fiókom
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────── */}
      <footer className="fp-footer">
        <div className="fp-footer-inner">
          <div className="fp-footer-top">
            <div className="fp-footer-brand">
              <div className="fp-logo">
                <div className="fp-logo-icon">
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                    <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2"/>
                    <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="fp-logo-text">Szaldon</span>
              </div>
              <p className="fp-footer-tagline">Okosabb bevásárlás, közösen.</p>
            </div>
            <div className="fp-footer-links">
              <div className="fp-footer-col">
                <h4 className="fp-footer-col-title">Alkalmazás</h4>
                <a href="#features">Funkciók</a>
                <a href="#how">Hogyan működik?</a>
                <a href="#benefits">Előnyök</a>
                <a href="#testimonials">Vélemények</a>
              </div>
              <div className="fp-footer-col">
                <h4 className="fp-footer-col-title">Jogi</h4>
                <Link to="/adatkezeles">Adatkezelés</Link>
                <Link to="/cookie-szabalyzat">Cookie szabályzat</Link>
                <button className="fp-footer-link-btn" onClick={openCookieSettings}>Cookie beállítások</button>
              </div>
              <div className="fp-footer-col">
                <h4 className="fp-footer-col-title">Fiók</h4>
                <Link to="/login">Bejelentkezés</Link>
                <Link to="/register">Regisztráció</Link>
              </div>
              <div className="fp-footer-col">
                <h4 className="fp-footer-col-title">Kapcsolat</h4>
                <a href="#contact">Írj nekünk</a>
              </div>
            </div>
          </div>
          <div className="fp-footer-bottom">
            <p className="fp-footer-copy">© {new Date().getFullYear()} Szaldon — Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
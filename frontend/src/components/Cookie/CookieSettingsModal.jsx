import React, { useState, useEffect, useRef } from 'react';
import useCookieConsent from '../../context/useCookieConsent.js';
import './CookieConsent.css';

const categories = [
  {
    key: 'necessary',
    title: 'Szükséges sütik',
    description:
      'Ezek a sütik elengedhetetlenek az oldal alapvető működéséhez. Ide tartozik a bejelentkezési munkamenet, a biztonsági tokenek és az alapvető felhasználói beállítások. Ezek nélkül az oldal nem tud megfelelően működni.',
    locked: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    key: 'functional',
    title: 'Funkcionális sütik',
    description:
      'A funkcionális sütik megjegyzik a beállításaidat, például a sötét/világos mód választást, nyelvi preferenciákat és egyéb személyre szabott felületi beállításokat, hogy újralátogatáskor kényelmesebb legyen az oldal használata.',
    locked: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    key: 'analytics',
    title: 'Analitikai sütik',
    description:
      'Az analitikai sütik segítenek megérteni, hogyan használják a látogatók az oldalt. Ezek az adatok anonim statisztikákat biztosítanak, amelyek segítenek az oldal fejlesztésében és a felhasználói élmény javításában.',
    locked: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    key: 'optional',
    title: 'Marketing sütik',
    description:
      'A marketing (opcionális) sütik személyre szabott tartalmak és ajánlatok megjelenítésére szolgálnak. Harmadik féltől származó szolgáltatások is használhatják ezeket a sütiket a felhasználói viselkedés nyomon követésére.',
    locked: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
];

export default function CookieSettingsModal() {
  const { showSettings, closeSettings, preferences, savePreferences } = useCookieConsent();
  const [local, setLocal] = useState({ ...preferences });
  const modalRef = useRef(null);

  useEffect(() => {
    if (showSettings) {
      setLocal({ ...preferences });
      modalRef.current?.focus();
    }
  }, [showSettings, preferences]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && showSettings) closeSettings();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showSettings, closeSettings]);

  if (!showSettings) return null;

  const toggle = (key) => {
    setLocal((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    savePreferences(local);
  };

  const handleAcceptAll = () => {
    savePreferences({
      necessary: true,
      functional: true,
      analytics: true,
      optional: true,
    });
  };

  return (
    <div className="cookie-settings-overlay" onClick={closeSettings}>
      <div
        className="cookie-settings-modal"
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Cookie beállítások"
      >
        {/* Header */}
        <div className="cookie-settings__header">
          <div className="cookie-settings__header-content">
            <div className="cookie-settings__header-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8" cy="10" r="1.5" fill="currentColor" />
                <circle cx="14" cy="8" r="1" fill="currentColor" />
                <circle cx="16" cy="13" r="1.5" fill="currentColor" />
                <circle cx="10" cy="15" r="1" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h2 className="cookie-settings__title">Cookie beállítások</h2>
              <p className="cookie-settings__subtitle">
                Válaszd ki, milyen sütiket szeretnél engedélyezni. A szükséges sütik mindig aktívak.
              </p>
            </div>
          </div>
          <button className="cookie-settings__close" onClick={closeSettings} aria-label="Bezárás">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Category list */}
        <div className="cookie-settings__body">
          {categories.map((cat) => (
            <div key={cat.key} className={`cookie-category ${cat.locked ? 'cookie-category--locked' : ''}`}>
              <div className="cookie-category__header">
                <div className="cookie-category__info">
                  <div className="cookie-category__icon" aria-hidden="true">
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="cookie-category__title">{cat.title}</h4>
                    {cat.locked && <span className="cookie-category__badge">Mindig aktív</span>}
                  </div>
                </div>
                <button
                  type="button"
                  className={`cookie-toggle ${local[cat.key] ? 'cookie-toggle--on' : ''} ${cat.locked ? 'cookie-toggle--locked' : ''}`}
                  onClick={() => !cat.locked && toggle(cat.key)}
                  disabled={cat.locked}
                  aria-label={`${cat.title} ${local[cat.key] ? 'kikapcsolása' : 'bekapcsolása'}`}
                  aria-pressed={local[cat.key]}
                >
                  <span className="cookie-toggle__track">
                    <span className="cookie-toggle__thumb" />
                  </span>
                </button>
              </div>
              <p className="cookie-category__desc">{cat.description}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="cookie-settings__footer">
          <button className="btn btn-ghost" onClick={closeSettings}>
            Mégse
          </button>
          <div className="cookie-settings__footer-right">
            <button className="btn btn-secondary" onClick={handleSave}>
              Kiválasztottak mentése
            </button>
            <button className="btn btn-primary" onClick={handleAcceptAll}>
              Összes elfogadása
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

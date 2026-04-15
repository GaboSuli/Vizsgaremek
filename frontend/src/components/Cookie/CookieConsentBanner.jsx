import React from 'react';
import { Link } from 'react-router-dom';
import useCookieConsent from '../../context/useCookieConsent.js';
import './CookieConsent.css';

export default function CookieConsentBanner() {
  const { showBanner, acceptAll, acceptNecessaryOnly, openSettings } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="cookie-banner-overlay">
      <div className="cookie-banner" role="dialog" aria-label="Cookie hozzájárulás" aria-modal="false">
        <div className="cookie-banner__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="10" r="1.5" fill="currentColor" />
            <circle cx="14" cy="8" r="1" fill="currentColor" />
            <circle cx="16" cy="13" r="1.5" fill="currentColor" />
            <circle cx="10" cy="15" r="1" fill="currentColor" />
            <circle cx="13" cy="17" r="0.8" fill="currentColor" />
          </svg>
        </div>

        <div className="cookie-banner__content">
          <h3 className="cookie-banner__title">Sütiket használunk</h3>
          <p className="cookie-banner__text">
            Az oldal sütiket (cookie-kat) használ a bejelentkezés, az alapvető működés, a beállítások mentése
            és a felhasználói élmény javítása érdekében. Válaszd ki, milyen sütiket engedélyezel.{' '}
            <Link to="/cookie-szabalyzat" className="cookie-banner__link">
              Cookie szabályzat
            </Link>
          </p>
        </div>

        <div className="cookie-banner__actions">
          <button className="btn btn-primary cookie-banner__btn" onClick={acceptAll}>
            Összes elfogadása
          </button>
          <button className="btn btn-secondary cookie-banner__btn" onClick={acceptNecessaryOnly}>
            Csak szükséges
          </button>
          <button className="btn btn-ghost cookie-banner__btn" onClick={openSettings}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Beállítások
          </button>
        </div>
      </div>
    </div>
  );
}

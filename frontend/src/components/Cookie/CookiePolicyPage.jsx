import React from 'react';
import { Link } from 'react-router-dom';
import useCookieConsent from '../../context/useCookieConsent.js';
import './PolicyPage.css';

export default function CookiePolicyPage() {
  const { openSettings } = useCookieConsent();

  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <div className="policy-header__icon">
            <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="10" r="1.5" fill="currentColor" />
              <circle cx="14" cy="8" r="1" fill="currentColor" />
              <circle cx="16" cy="13" r="1.5" fill="currentColor" />
              <circle cx="10" cy="15" r="1" fill="currentColor" />
            </svg>
          </div>
          <h1 className="policy-title">Cookie szabályzat</h1>
          <p className="policy-subtitle">Utoljára frissítve: 2025. január 1.</p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Mik azok a sütik (cookie-k)?</h2>
            <p>
              A sütik (cookie-k) kis méretű szöveges fájlok, amelyeket a böngésző tárol az eszközödön,
              amikor meglátogatod a weboldalunkat. A sütik segítenek az oldal működésében, a felhasználói
              élmény javításában és a beállításaid megjegyzésében.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Milyen sütiket használunk?</h2>

            <div className="policy-cookie-table">
              <div className="policy-cookie-row policy-cookie-row--header">
                <span>Kategória</span>
                <span>Leírás</span>
                <span>Lejárat</span>
              </div>
              <div className="policy-cookie-row">
                <span className="policy-cookie-badge policy-cookie-badge--necessary">Szükséges</span>
                <span>Bejelentkezési munkamenet, biztonsági tokenek, CSRF védelem. Ezek nélkül az oldal nem tud megfelelően működni.</span>
                <span>Munkamenet / 30 nap</span>
              </div>
              <div className="policy-cookie-row">
                <span className="policy-cookie-badge policy-cookie-badge--functional">Funkcionális</span>
                <span>Téma beállítás (sötét/világos mód), nyelvi preferenciák, felhasználói felületi beállítások, cookie hozzájárulás mentése.</span>
                <span>1 év</span>
              </div>
              <div className="policy-cookie-row">
                <span className="policy-cookie-badge policy-cookie-badge--analytics">Analitikai</span>
                <span>Anonim látogatottsági statisztikák, oldalhasználati minták és hibák felderítése a szolgáltatás fejlesztése érdekében.</span>
                <span>1 év</span>
              </div>
              <div className="policy-cookie-row">
                <span className="policy-cookie-badge policy-cookie-badge--optional">Marketing</span>
                <span>Személyre szabott tartalmak, ajánlatok megjelenítése. Harmadik féltől származó szolgáltatások által használt sütik.</span>
                <span>Változó</span>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. Hogyan kezelheted a sütiket?</h2>
            <p>
              Az oldal első látogatásakor megjelenő bannerben választhatsz, milyen sütiket engedélyezel.
              A beállításaidat bármikor módosíthatod a{' '}
              <button className="policy-inline-btn" onClick={openSettings}>
                Cookie beállítások
              </button>{' '}
              menüpontban, amely elérhető az oldal láblécéből is.
            </p>
            <p>
              Emellett a legtöbb böngészőben is beállíthatod a sütik kezelését. A böngésző beállításaiban
              törölheted a meglévő sütiket, és letilthatod az újak elfogadását. Fontos: ha letiltod a
              szükséges sütiket, az oldal egyes funkciói nem fognak megfelelően működni.
            </p>
          </section>

          <section className="policy-section">
            <h2>4. Harmadik féltől származó sütik</h2>
            <p>
              Az oldalunk bizonyos szolgáltatásai harmadik féltől származó sütiket is használhatnak.
              Ezeket a szolgáltatókat saját adatvédelmi szabályzatuk szabályozza. Az ilyen sütik
              használatát az „Opcionális" és „Analitikai" kategóriákban vezérelheted.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. A sütik és az adatvédelem</h2>
            <p>
              A sütik által gyűjtött adatokat az{' '}
              <Link to="/adatkezeles" className="policy-link">
                Adatkezelési tájékoztatóban
              </Link>{' '}
              leírt feltételek szerint kezeljük. Az anonim adatokat harmadik félnek nem adjuk ki
              azonosítható formában.
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Kapcsolat</h2>
            <p>
              Ha kérdésed van a sütik használatával kapcsolatban, kérjük vedd fel velünk a kapcsolatot
              az <Link to="/contact" className="policy-link">Kapcsolat</Link> oldalon.
            </p>
          </section>
        </div>

        <div className="policy-actions">
          <button className="btn btn-primary" onClick={openSettings}>
            Cookie beállítások módosítása
          </button>
          <Link to="/" className="btn btn-secondary">
            Vissza a főoldalra
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import './PolicyPage.css';

export default function PrivacyPolicyPage() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <div className="policy-header__icon policy-header__icon--privacy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="policy-title">Adatkezelési tájékoztató</h1>
          <p className="policy-subtitle">Utoljára frissítve: 2025. január 1.</p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Az adatkezelő</h2>
            <p>
              Az adatkezelő a Szaldon alkalmazás üzemeltetője. Az adatkezeléssel kapcsolatos kérdésekkel
              a <Link to="/contact" className="policy-link">Kapcsolat</Link> oldalon érheted el az adatkezelőt.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. A kezelt adatok köre</h2>
            <p>
              Az alkalmazás használata során az alábbi személyes adatokat kezeljük:
            </p>
            <ul className="policy-list">
              <li><strong>Regisztrációs adatok:</strong> név, e-mail cím, jelszó (titkosítva tárolva)</li>
              <li><strong>Felhasználói tevékenység:</strong> létrehozott bevásárlólisták, csoporttagságok, kuponok, vásárlási statisztikák</li>
              <li><strong>Beállítások:</strong> téma mód (sötét/világos), nyelvi preferenciák, cookie beállítások</li>
              <li><strong>Technikai adatok:</strong> IP-cím, böngésző típusa, munkamenet-azonosítók</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Az adatkezelés célja és jogalapja</h2>
            <div className="policy-table">
              <div className="policy-table__row policy-table__row--header">
                <span>Cél</span>
                <span>Jogalap</span>
              </div>
              <div className="policy-table__row">
                <span>Felhasználói fiók kezelése, bejelentkezés</span>
                <span>Szerződés teljesítése (GDPR 6. cikk (1) b)</span>
              </div>
              <div className="policy-table__row">
                <span>Bevásárlólisták, csoportok és kuponok kezelése</span>
                <span>Szerződés teljesítése (GDPR 6. cikk (1) b)</span>
              </div>
              <div className="policy-table__row">
                <span>Felhasználói beállítások mentése (téma, nyelv)</span>
                <span>Hozzájárulás (GDPR 6. cikk (1) a)</span>
              </div>
              <div className="policy-table__row">
                <span>Statisztikák és analitika</span>
                <span>Hozzájárulás (GDPR 6. cikk (1) a)</span>
              </div>
              <div className="policy-table__row">
                <span>Az oldal biztonságos működése</span>
                <span>Jogos érdek (GDPR 6. cikk (1) f)</span>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>4. Az adatok tárolása és biztonsága</h2>
            <p>
              A személyes adatokat biztonságos szervereken tároljuk. A jelszavakat kriptográfiai hash
              algoritmussal (bcrypt) titkosítjuk. Az API kommunikáció token alapú hitelesítéssel történik.
              A munkamenet tokeneket a böngésző localStorage-ban tároljuk, amelyekhez kizárólag az alkalmazás
              domainje férhet hozzá.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Adattovábbítás</h2>
            <p>
              Személyes adataidat harmadik fél számára nem adjuk ki, kivéve ha jogszabályi kötelezettség
              áll fenn, vagy ha ahhoz kifejezetten hozzájárultál. Az anonim analitikai adatokat kizárólag
              összesített formában használjuk.
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Adatmegőrzési idő</h2>
            <ul className="policy-list">
              <li><strong>Felhasználói fiók adatok:</strong> a fiók törléséig</li>
              <li><strong>Bevásárlólisták, csoportok:</strong> a felhasználó által történő törlésig vagy a fiók megszüntetéséig</li>
              <li><strong>Cookie beállítások:</strong> 1 évig, vagy a beállítás módosításáig</li>
              <li><strong>Technikai naplók:</strong> maximum 90 napig</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>7. Az érintett jogai</h2>
            <p>A GDPR alapján az alábbi jogok illetik meg:</p>
            <ul className="policy-list">
              <li><strong>Hozzáférés joga:</strong> tájékoztatást kérhetsz a kezelt adataidról</li>
              <li><strong>Helyesbítés joga:</strong> kérheted pontatlan adataid javítását</li>
              <li><strong>Törlés joga:</strong> kérheted személyes adataid törlését</li>
              <li><strong>Adathordozhatóság joga:</strong> kérheted adataid géppel olvasható formátumban</li>
              <li><strong>Tiltakozás joga:</strong> tiltakozhatsz az adatkezelés ellen</li>
              <li><strong>Hozzájárulás visszavonása:</strong> bármikor visszavonhatod a hozzájárulásodat</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>8. Sütik (cookie-k)</h2>
            <p>
              A sütik használatáról részletes tájékoztatást a{' '}
              <Link to="/cookie-szabalyzat" className="policy-link">
                Cookie szabályzatban
              </Link>{' '}
              találsz. A cookie beállításokat bármikor módosíthatod az oldal láblécében található
              „Cookie beállítások" hivatkozáson keresztül.
            </p>
          </section>

          <section className="policy-section">
            <h2>9. Kapcsolat és panaszkezelés</h2>
            <p>
              Adatkezeléssel kapcsolatos kérdéseidben, kéréseidben a{' '}
              <Link to="/contact" className="policy-link">Kapcsolat</Link> oldalon érheted el az
              adatkezelőt. Ha úgy érzed, hogy adataid kezelése sérti a jogaidat, panaszt tehetsz a
              Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH).
            </p>
          </section>
        </div>

        <div className="policy-actions">
          <Link to="/cookie-szabalyzat" className="btn btn-primary">
            Cookie szabályzat
          </Link>
          <Link to="/" className="btn btn-secondary">
            Vissza a főoldalra
          </Link>
        </div>
      </div>
    </div>
  );
}

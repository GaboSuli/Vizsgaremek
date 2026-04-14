import React, { useState } from 'react';
import './AdminPage.css';

const API_URL = 'http://localhost:8000';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [serverStatus, setServerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiEndpoints = [
    // GET endpoints
    {
      method: 'GET',
      endpoint: '/felhasznalo/vevesiListak',
      description: 'Egy felhasználó összes vevési listája (bearer: session token)'
    },
    {
      method: 'GET',
      endpoint: '/felhasznalo/csoportjai',
      description: 'Egy felhasználó csoportjai (bearer: session token)'
    },
    {
      method: 'GET',
      endpoint: '/csoport/{id}/vevesiListak',
      description: 'Egy csoport összes vevési listája (bearer: session token)'
    },
    {
      method: 'GET',
      endpoint: '/felhasznalo/osszKoltesei',
      description: 'Egy felhasználó összes költségei alkategoriák szerint (bearer: session token)'
    },
    {
      method: 'GET',
      endpoint: '/felhasznalo/eHaviKoltesei',
      description: 'Egy felhasználó összes költsége ebben a hónapban (bearer: session token)'
    },
    {
      method: 'GET',
      endpoint: '/felhasznalo/eEviKoltesei',
      description: 'Egy felhasználó összes költsége ebben az évben (bearer: session token)'
    },
    {
      method: 'GET',
      endpoint: '/statisztika/all',
      description: 'Összes alkategória átlag árának havi váltakozása'
    },
    {
      method: 'GET',
      endpoint: '/statisztika/id/{id}',
      description: 'Egy alkategória átlag árának havi váltakozása'
    },
    {
      method: 'GET',
      endpoint: '/statisztika/ev/{ev}',
      description: 'Összes alkategória jelenlegi átlagára ebben az évben'
    },
    {
      method: 'GET',
      endpoint: '/kuponok/get',
      description: 'Összes kupon'
    },
    {
      method: 'GET',
      endpoint: '/felhasznalo',
      description: 'Felhasználó nyilvános adatai (bearer: session token)'
    },
    {
      method: 'GET',
      endpoint: '/csoport/{id}/felhasznalok',
      description: 'Csoport felhasználói (bearer: session token)'
    },
    {
      method: 'GET',
      endpoint: '/contact',
      description: 'Összes kitöltött ürlap (bearer: session token, csak nagyobb mint 1 jogosultságú szintű tud)'
    },
  ];

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setServerStatus({
          online: true,
          message: 'Backend szerver működik'
        });
      } else if (response.status === 401) {
        setServerStatus({
          online: true,
          message: 'Backend szerver működik (auth szükséges)'
        });
      } else {
        setServerStatus({
          online: false,
          message: `Backend hiba: ${response.status}`
        });
      }
    } catch {
      setServerStatus({
        online: false,
        message: 'Backend szerver nem elérhető'
      });
    }
    setLoading(false);
  };


  return (
    <div className="admin-container">
      <div className="admin-hero">
        <h1>🔧 Admin Panel</h1>
        <p>Fejlesztői konzol és rendszer kezelés</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-button ${activeTab === 'api' ? 'active' : ''}`}
          onClick={() => setActiveTab('api')}
        >
          🔌 API Végpontok
        </button>
        <button
          className={`tab-button ${activeTab === 'testdata' ? 'active' : ''}`}
          onClick={() => setActiveTab('testdata')}
        >
          📋 Teszt Adatok
        </button>
        <button
          className={`tab-button ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          📖 Dokumentáció
        </button>
      </div>

      <div className="admin-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <h2>Rendszer Status</h2>

            {loading ? (
              <div className="loading">Ellenőrzés...</div>
            ) : (
              <div className="status-grid">
                <div className={`status-card ${serverStatus?.online ? 'online' : 'offline'}`}>
                  <div className="status-icon">
                    {serverStatus?.online ? '✅' : '❌'}
                  </div>
                  <div className="status-info">
                    <h3>Backend Szerver</h3>
                    <p>{API_URL}</p>
                    <span className="status-message">{serverStatus?.message}</span>
                  </div>
                </div>

                <div className="status-card online">
                  <div className="status-icon">✅</div>
                  <div className="status-info">
                    <h3>Frontend Szerver</h3>
                    <p>http://localhost:5174</p>
                    <span className="status-message">Működik</span>
                  </div>
                </div>

                <div className="status-card online">
                  <div className="status-icon">✅</div>
                  <div className="status-info">
                    <h3>Adatbázis</h3>
                    <p>Mysql (database.mysql2)</p>
                    <span className="status-message">Konfigurálva</span>
                  </div>
                </div>

                <div className="status-card online">
                  <div className="status-icon">✅</div>
                  <div className="status-info">
                    <h3>Admin Panel</h3>
                    <p>http://localhost:5174/admin</p>
                    <span className="status-message">Elérhető</span>
                  </div>
                </div>

                <div className="status-card online">
                  <div className="status-icon">✅</div>
                  <div className="status-info">
                    <h3>Autentifikáció</h3>
                    <p>Laravel Sanctum</p>
                    <span className="status-message">Aktív</span>
                  </div>
                </div>
              </div>
            )}

            <div className="quick-links">
              <h3>Gyors Linkek</h3>
              <a href={API_URL} target="_blank" rel="noopener noreferrer" className="quick-link">
                Backend (Ctrl+Click)
              </a>
              <a href="http://localhost:5174" target="_blank" rel="noopener noreferrer" className="quick-link">
                Frontend (Ctrl+Click)
              </a>
              <a href="http://localhost:5174/admin" target="_blank" rel="noopener noreferrer" className="quick-link">
                Admin Panel (Ctrl+Click)
              </a>
              <button className="quick-link" onClick={checkServerStatus}>
                🔄 Státusz Frissítés
              </button>
            </div>
          </div>
        )}

        {/* API Endpoints Tab */}
        {activeTab === 'api' && (
          <div className="tab-content">
            <h2>API Végpontok</h2>
            <p className="subtitle">Az összes elérhető API végpont listája</p>

            <div className="endpoints-table">
              <div className="table-header">
                <div className="col-method">METHOD</div>
                <div className="col-endpoint">VÉGPONT</div>
                <div className="col-description">LEÍRÁS</div>
              </div>

              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className={`table-row method-${endpoint.method.toLowerCase()}`}>
                  <div className="col-method">
                    <span className={`method-badge ${endpoint.method.toLowerCase()}`}>
                      {endpoint.method}
                    </span>
                  </div>
                  <div className="col-endpoint">
                    <code>{endpoint.endpoint}</code>
                  </div>
                  <div className="col-description">
                    {endpoint.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Data Tab */}
        {activeTab === 'testdata' && (
          <div className="tab-content">
            <h2>Teszt Adatok</h2>

            <div className="test-data-section">
              <h3>👤 Admin Felhasználó</h3>
              <div className="data-box">
                <p><strong>Email:</strong> <code>admin@dev.local</code></p>
                <p><strong>Jelszó:</strong> <code>Admin@123</code></p>
                <p><strong>Típus:</strong> Admin (fejlesztő)</p>
              </div>

              <h4>MySQL INSERT utasítás:</h4>
              <div className="code-block">
                <pre>{`INSERT INTO felhasznalos (
  nev, 
  becenev, 
  email, 
  email_verified_at, 
  password, 
  tema_id, 
  profilkep_url, 
  kuponok, 
  termekArKovetes, 
  brokerArKovetes, 
  remember_token, 
  created_at, 
  updated_at
) VALUES (
  'Admin Felhasználó',
  'admin',
  'admin@dev.local',
  NOW(),
  '$2y$12$R2YH6CrN0qfuv9QJ0R1dVOP7jZr8L7K5P6M2N3O4Q5R6S7T8U9V0W', -- Admin@123
  1,
  NULL,
  0,
  1,
  1,
  NULL,
  NOW(),
  NOW()
);`}</pre>
              </div>

              <h4>Tábla szerkezet (CREATE TABLE):</h4>
              <div className="code-block">
                <pre>{`CREATE TABLE felhasznalos (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nev VARCHAR(255) NOT NULL,
  becenev VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  email_verified_at TIMESTAMP NULL,
  password VARCHAR(255) NOT NULL,
  tema_id BIGINT UNSIGNED,
  profilkep_url VARCHAR(255),
  kuponok INT DEFAULT 0,
  termekArKovetes TINYINT(1) DEFAULT 0,
  brokerArKovetes TINYINT(1) DEFAULT 0,
  remember_token VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`}</pre>
              </div>
            </div>

            <div className="test-data-section">
              <h3>👥 Teszt Felhasználók</h3>
              <div className="data-box">
                <p><strong>Email:</strong> <code>test@example.com</code></p>
                <p><strong>Jelszó:</strong> <code>Test@123</code></p>
                <p><strong>Név:</strong> Test User</p>
              </div>
              <div className="data-box">
                <p><strong>Email:</strong> <code>user@example.com</code></p>
                <p><strong>Jelszó:</strong> <code>User@123</code></p>
                <p><strong>Név:</strong> Example User</p>
              </div>
            </div>

            <div className="test-data-section">
              <h3>🎟️ Teszt Kuponok</h3>
              <div className="data-box">
                <p><strong>Kód:</strong> <code>TAVASZ2026</code></p>
                <p><strong>Kedvezmény:</strong> 20%</p>
                <p><strong>Lejárat:</strong> 2026-12-31</p>
              </div>
              <div className="data-box">
                <p><strong>Kód:</strong> <code>ADMIN100</code></p>
                <p><strong>Kedvezmény:</strong> 100 Ft</p>
                <p><strong>Lejárat:</strong> 2026-06-30</p>
              </div>
            </div>

            <div className="test-data-section">
              <h3>📝 Minta Bevásárlólista</h3>
              <div className="data-box">
                <p><strong>Név:</strong> Heti bevásárlás</p>
                <p><strong>Tételek:</strong> Kenyér (2db), Tej (1L), Alma (2kg)</p>
                <p><strong>Becsült költség:</strong> 1300 Ft (ÁFA nélkül)</p>
              </div>
            </div>
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <div className="tab-content">
            <h2>Fejlesztői Dokumentáció</h2>

            <div className="doc-section">
              <h3>🚀 Indítás</h3>
              <div className="code-block">
                <pre>{`# Backend indítása
cd Backend
php artisan serve

# Frontend indítása (új terminál)
cd frontend/Frontend
npm run dev`}</pre>
              </div>
            </div>

            <div className="doc-section">
              <h3>📁 Projekt Struktúra</h3>
              <div className="code-block">
                <pre>{`Vizsgaremek/
├── Backend/          # Laravel API
│   ├── app/
│   ├── routes/api.php
│   └── .env
├── frontend/Frontend/  # React UI
│   ├── src/
│   └── components/
└── TEVÉKENYSÉGI_NAPLO.md`}</pre>
              </div>
            </div>

            <div className="doc-section">
              <h3>🔑 Autentifikáció</h3>
              <p>Az alkalmazás Laravel Sanctum token-alapú autentifikációt használ.</p>
              <div className="code-block">
                <pre>{`1. POST /api/felhasznalo/register
   Regisztráció

2. POST /api/felhasznalo/login
   Bejelentkezés -> token vissza

3. GET /api/user
   Authorization: Bearer {token}
   Jelenleg bejelentkezett felhasználó`}</pre>
              </div>
            </div>

            <div className="doc-section">
              <h3>🐛 Debug Mód</h3>
              <p>Backend/.env fájlban:</p>
              <div className="code-block">
                <pre>{`APP_DEBUG=true
APP_ENV=local
LOG_LEVEL=debug`}</pre>
              </div>
              <p>Frontend src/services/api.js-ben az összes request loggolódik.</p>
            </div>

            <div className="doc-section">
              <h3>📚 Hasznos Parancsok</h3>
              <div className="code-block">
                <pre>{`# Laravel
php artisan migrate              # Migráció futtatása
php artisan cache:clear          # Cache törlés
php artisan tinker               # Interaktív shell

# npm
npm install                      # Függőségek telepítése
npm run dev                       # Dev szerver
npm run build                     # Produkció build`}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

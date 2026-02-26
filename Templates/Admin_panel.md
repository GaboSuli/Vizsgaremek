# 🔧 Admin Panel - Fejlesztői Konzol

## Admin Felület

Az alkalmazásban elérhető fejlesztői admin panel a `/admin` útvonalon található (vagy az **Admin Panel** gomb a szidebarban).

## 🔑 Bejelentkezési Adatok

### Admin Felhasználó

```
Email:    admin@dev.local
Jelszó:   Admin@123
```

**Típus:** Fejlesztői admin  
**Jogosultságok:** Teljes hozzáférés az admin panelhez

---

## 📊 Admin Panel Funkciók

### 1. Dashboard
- **Szerver Status** - Backend szerver állapota
- **Frontend Status** - Frontend alkalmazás állapota
- **Adatbázis Status** - Mysql adatbázis információ
- **Autentifikáció Status** - Sanctum token rendszer
- **Gyors Linkek** - Közvetlen navigáció a szerverekhez

### 2. API Végpontok
Az összes elérhető API végpont teljes listája:
- GET, POST, PUT, DELETE operációk
- Végpontnév és leírás
- Color-coded HTTP metodusok

### 3. Teszt Adatok
Előre definiált teszt felhasználók és adatok:

#### Admin Felhasználó
```
Email: admin@dev.local
Jelszó: Admin@123
```

#### Teszt Felhasználók
```
Email: test@example.com
Jelszó: Test@123
Név: Test User

Email: user@example.com
Jelszó: User@123
Név: Example User
```

#### Teszt Kuponok
```
Kód: TAVASZ2026 (20% kedvezmény, lejár: 2026-12-31)
Kód: ADMIN100 (100 Ft kedvezmény, lejár: 2026-06-30)
```

#### Minta Bevásárlólista
```
Név: Heti bevásárlás
Tételek: Kenyér (2db), Tej (1L), Alma (2kg)
Becsült költség: 1300 Ft (ÁFA nélkül)
```

### 4. Fejlesztői Dokumentáció
- Indítási instrukcióit
- Projekt szerkezet
- Autentifikáció flow
- Debug módok
- Hasznos parancsok

---

## 🚀 Admin Panel Elérése

### Bejelentkezés az adminként:
1. Nyisd meg az alkalmazást: http://localhost:5174
2. Bejelentkezés az admin adatokkal:
   - Email: `admin@dev.local`
   - Jelszó: `Admin@123`
3. A szidebarban kattints az **Admin Panel** gombra
4. Vagy navigálj az `/admin` útvonalra

### Szerver Status Ellenőrzése:
1. Nyisd meg az Admin Panelt
2. A **Dashboard** fülön láthatod az összes rendszer komponens állapotát
3. Kattints az **🔄 Státusz Frissítés** gombra az aktuális információért

### API Végpontok Megjelenítése:
1. Nyisd meg az **API Végpontok** fület
2. Láthatod az összes elérhető API útvonalat
3. A metodusok szín-kódolva vannak (GET-kék, POST-zöld, PUT-narancs, DELETE-piros)

---

## 🧪 Tesztelés az Admin Panelről

### Backend Szerver Tesztelése:
```bash
# Terminal 1 - Backend indítása
cd Backend
php artisan serve
# Backend fut a http://127.0.0.1:8000 címen
```

### Frontend Szerver Tesztelése:
```bash
# Terminal 2 - Frontend indítása
cd frontend/Frontend
npm run dev
# Frontend fut a http://localhost:5174 címen
```

### Admin Panel Megnyitása:
1. Bejelentkezés az admin adatokkal
2. Dashboard: láthatod, hogy mindkét szerver fut
3. Kattints a **Gyors Linkekre**:
   - Backend: http://127.0.0.1:8000
   - Frontend: http://localhost:5174

---

## 📱 Admin Panel Felépítése

### Fülek (Tabs)

1. **📊 Dashboard**
   - Rendszer komponensek állapota
   - Szín-kódolt status (zöld=online, piros=offline)
   - Gyors linkek a szerverekhez
   - Status frissítés gomb

2. **🔌 API Végpontok**
   - Összes elérhető API végpont
   - HTTP método (GET, POST, PUT, DELETE)
   - Végpont cím (path)
   - Leírás

3. **📋 Teszt Adatok**
   - Admin bejelentkezési adatok
   - Teszt felhasználók
   - Teszt kuponok
   - Minta bevásárlólista

4. **📖 Dokumentáció**
   - Indítási instrukcióit
   - Projekt szerkezet
   - Autentifikáció flow
   - Debug parancsok
   - Hasznos parancsok

---

## 🛠️ Debug & Fejlesztés

### Backend Logok:
```bash
# Laravel log file
tail -f Backend/storage/logs/laravel.log
```

### Frontend Konzolon:
- Nyisd meg a böngésző Developer Tools (F12)
- Console tab - Összes JavaScript error és log
- Network tab - API hívások

### Cache Törlés:
```bash
php artisan cache:clear
php artisan config:clear
```

### Adatbázis Reset:
```bash
php artisan migrate:reset
php artisan migrate
```

---

## 🔐 Biztonsági Megjegyzések

### Fejlesztéshez:
- Az admin jelszó hardkódolt (fejlesztéshez)
- Produkcióban: env fájlban tárolni
- CSRF token szükséges POST/PUT/DELETE-hez

### Autentifikáció:
- Bearer token alapú (Sanctum)
- Token localStorage-ben tárolva
- Automatikus logout 401 hibánál

### CORS:
- Frontend: localhost:5174
- Backend: 127.0.0.1:8000
- Beállítva: `config/cors.php`

---

## 📝 Naplók és Hibákeresés

### 500 Internal Server Error:
```bash
# Nézd meg a Laravel logot
tail -f Backend/storage/logs/laravel.log

# Key generálás (ha szükséges)
php artisan key:generate

# Cache törlés
php artisan cache:clear
```

### Frontend Betöltési Hiba:
```bash
# npm cache törlés
npm cache clean --force

# Új npm install
npm install

# Dev szerver újraindítása
npm run dev
```

### Adatbázis Hiba:
```bash
# Migráció reset
php artisan migrate:reset

# Friss migráció
php artisan migrate
```

---

## 📚 Fájl Helyek

| Komponens | Fájl | Hely |
|-----------|------|------|
| Admin oldal | AdminPage.jsx | `frontend/Frontend/src/components/` |
| Admin stílus | AdminPage.css | `frontend/Frontend/src/components/` |
| App routing | App.jsx | `frontend/Frontend/src/` |
| Sidebar nav | Sidebar.jsx | `frontend/Frontend/src/components/` |
| Backend .env | .env | `Backend/` |
| CORS config | config/cors.php | `Backend/config/` |

---

## ✅ Hibaelhárítás Lépések

### Ha az admin panel nem jelenik meg:
1. ✅ Bejelentkeztél az admin adatokkal?
2. ✅ A szidebarban látható az "Admin Panel" gomb?
3. ✅ A böngésző Developer Tools-ban van error?
4. ✅ Frontend szerver fut (npm run dev)?

### Ha a szerver status "offline":
1. ✅ Backend szerver fut (php artisan serve)?
2. ✅ A port 8000-en fut?
3. ✅ Nincs firewall blokk?
4. ✅ .env fájl APP_KEY-vel rendelkezik?

### Ha az API végpontok nem töltődnek be:
1. ✅ Frontend kapcsolódik a backendhez?
2. ✅ CORS beállítások megfelelőek?
3. ✅ Token érvényes?
4. ✅ Backend szerver működik?

---

## 🎯 Következő Lépések

- [ ] Admin felület tesztelése
- [ ] Bejelentkezés az admin adatokkal
- [ ] Szerver status ellenőrzése
- [ ] API végpontok megjelenítése
- [ ] Teszt adatok használata
- [ ] Dokumentáció olvasása

**Admin Panel Elkészült:** ✅ 2026. január 21.
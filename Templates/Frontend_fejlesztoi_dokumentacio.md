
# Frontend Fejlesztői Dokumentáció (Részletes, modulonkénti)

## Fejlesztés során alkalmazott technikák és módszerek

- **Komponens-alapú fejlesztés**: Minden UI-elem önálló, újrahasznosítható React komponensként készült.
- **Állapotkezelés context-tel és hook-okkal**: Authentikáció, felhasználói adatok, betöltési állapotok context és custom hook-ok segítségével lettek kezelve.
- **Mock adat fallback**: Minden szolgáltatás (service) képes mock adatokkal működni, ha nincs elérhető backend, így a frontend önállóan is fejleszthető és tesztelhető.
- **REST API integráció**: Axios-szal, központi API wrapperrel, request/response interceptorokkal.
- **Reszponzív dizájn**: Bootstrap és React-Bootstrap komponensek, mobilbarát elrendezések.
- **SPA routing**: React Router DOM, védett (ProtectedRoute) és publikus útvonalak.
- **Form validáció és hibakezelés**: Minden űrlapnál (pl. login, contact) részletes validáció, hibák megjelenítése.
- **Kódminőség**: ESLint, egységes kódstílus, modern JS/React szintaxis.
- **Szerver oldali emailküldés**: Nodemailer-rel, Express szerverrel proxyzott /contact végpont.
- **Grafikonok, statisztikák**: Chart.js, react-chartjs-2, mock és API adatokkal.
- **Valós idejű dev szerver**: Vite, hot-reload, gyors build/futtatás.
- **Proxy beállítás**: Frontend fejlesztés közben a /api végpont automatikusan a backendre irányít.
- **Moduláris mappastruktúra**: Komponensek, szolgáltatások, context-ek elkülönítve.
- **Bővíthetőség**: Új funkciók, oldalak, API-k könnyen hozzáadhatók a meglévő struktúrához.


## 1. Projekt Áttekintés
Ez a frontend egy React-alapú SPA, amely a Vite buildrendszert, modern state managementet, REST API integrációt és reszponzív UI-t használ. A cél egy átlátható, bővíthető, karbantartható alkalmazás.

## 2. Mappastruktúra és főbb modulok
```
frontend/Frontend/
├── public/                # Statikus fájlok
├── src/
│   ├── components/        # Minden UI komponens (oldalak, szekciók, layoutok)
│   ├── context/           # Kontextusok (pl. Auth)
│   ├── services/          # API hívások, üzleti logika, mock adatok
│   ├── App.jsx            # Fő alkalmazás komponens
│   ├── main.jsx           # Belépési pont
│   └── ...
├── package.json           # Függőségek, npm parancsok
├── vite.config.js         # Vite konfiguráció, proxy
└── README.md              # Alap információk
```

## 3. Főbb technológiák
- **React** (19+): Komponens-alapú UI
- **Vite**: Build, dev szerver, proxy
- **React Router DOM**: SPA routing
- **Bootstrap, React-Bootstrap**: Reszponzív dizájn
- **Axios**: HTTP kliens
- **Chart.js, react-chartjs-2**: Grafikonok
- **ESLint**: Kódminőség

## 4. Komponensek (src/components)

### 4.1. AppLayout.jsx
- Fő layout komponens, tartalmazza a Sidebar-t és a fő tartalmi részt (`<Outlet />`).
- Állapot: sidebar nyitva/zárva (React useState hook).
- Minden oldal ezt használja keretként.
- **Technikák:** Kompozíció, state kezelés, outlet routing.

### 4.2. Sidebar.jsx
- Navigációs menü, NavLink-ekkel (React Router DOM).
- Felhasználó jogosultságától függően jeleníti meg az admin menüpontot (auth context).
- Ikonokat SVG-vel oldja meg.
- **Technikák:** Dinamikus menü, feltételes renderelés, SVG ikonok, context alapú jogosultság.

### 4.3. ProtectedRoute.jsx
- Olyan útvonalakhoz, amelyekhez bejelentkezés szükséges.
- Ha nincs user, átirányít `/login`-ra.
- Auth contextből olvassa a user-t és a loading állapotot.
- **Technikák:** Route guard, context alapú auth, redirect, loading állapot.

### 4.4. LoginPage.jsx
- Bejelentkezés és regisztráció egy oldalon.
- Állapot: login/regisztráció mód, űrlapadatok, hibakezelés, loading (useState, useEffect).
- Sikeres auth után átirányít a kívánt oldalra.
- **Technikák:** Form kezelés, validáció, async/await, context alapú auth, redirect.

### 4.5. LandingPage.jsx
- Nyitóoldal, több szekcióval: Hero, AboutSection, FeaturesSection, HowItWorks, PriceChangeSection, StatsSection.
- Scrollozás szekciókra (DOM API, event handler).
- **Technikák:** Többszintű komponensstruktúra, smooth scroll, props-alapú kommunikáció.

### 4.6. StatisticsPage.jsx
- Statisztikák, elemzések, grafikonok.
- Komponensek: UserStatistics, AlkategoriaMonthlyStats, AllAlkategoriasStats.
- **Technikák:** Kompozíció, adatvizualizáció (Chart.js), props-alapú adatátadás, mock és API adatforrások.

### 4.7. VevesiListePage.jsx
- Bevásárlólisták kezelése, listázás, részletek, hibakezelés.
- Auth alapján szűr, API-ból vagy mockból tölti az adatokat.
- Kiválasztott lista részleteit Card-ban jeleníti meg.
- **Technikák:** useEffect adatbetöltés, async/await, context alapú szűrés, feltételes renderelés, mock fallback, hibakezelés (Alert), loading (Spinner).

### 4.8. További komponensek
- NavBar, ContactPage, AdminPage, UserProfile, UserManagementPage, RegisterPage, PublicRoute, stb.
- Mindegyik önálló fájlban, jól elkülönítve.
- **Technikák:** Komponens alapú fejlesztés, props, context, route guard, form kezelés.

## 5. Kontextusok (src/context)

### 5.1. AuthContext.js
- React context, a user és auth állapot globális tárolására.
- Alapértelmezett érték: null.
- **Technikák:** Context API, globális state, provider pattern.

### 5.2. useAuth.js
- Hook, ami az AuthContext-et olvassa ki.
- Minden auth-függő komponens ezt használja.
- **Technikák:** Custom hook, context fogyasztás.

## 6. Szolgáltatások (src/services)

### 6.1. api.js
- Axios példány, `/api` baseURL-lel, 15s timeout.
- Auth token kezelése (localStorage, header beállítás).
- Központi request/response interceptorok.
- **Technikák:** Axios instance, interceptor, localStorage, token management, automatikus header beállítás.

### 6.2. authService.js
- Auth token és user adatok kezelése (localStorage, header).
- isAuthenticated, getStoredUserInfo, setToken, setUser, stb.
- Request interceptor: minden kéréshez hozzáadja a Bearer tokent.
- **Technikák:** Token alapú authentikáció, localStorage, request interceptor, error handling.

### 6.3. kuponService.js
- Kuponok lekérdezése, mock fallback adatokkal.
- getAllKupons, getKuponById, API hívás vagy mock visszaadás.
- **Technikák:** API hívás, async/await, mock fallback, dinamikus endpoint.

### 6.4. vevesiListaService.js
- Bevásárlólisták kezelése, mock fallback.
- getAllVevesiListak, getVevesiListaById, getVevesiListakByUser.
- Részletes lista- és tételkezelés, hibakezelés.
- **Technikák:** API/memória fallback, async/await, context alapú szűrés, error handling.

### 6.5. statisticsService.js
- Statisztikai adatok (pl. alkategória havi átlagárak, összesített adatok).
- getAlkategoriaMonthlyStats, getOsszesAlkategoriasStats, mock fallback.
- **Technikák:** Adatfeldolgozás, mock fallback, async/await, objektum alapú aggregáció.

### 6.6. shoppingListService.js
- Shopping list mock adatok, getAllShoppingLists, API fallback.
- **Technikák:** Mock adatkezelés, async/await, fallback logika.

### 6.7. currencyService.js
- Valutaárfolyamok lekérdezése, átlagolása hónapokra.
- fetchMonthlyAvg: Frankfurter API, date-fns időkezelés.
- **Technikák:** Külső API integráció, időkezelés (date-fns), átlagolás, async/await, hibakezelés.

### 6.8. server.js
- Express szerver, CORS, JSON body parser.
- /contact végpont: email küldés nodemailer-rel (Gmail SMTP), validáció.
- **Technikák:** Express middleware, CORS, JSON parsing, nodemailer SMTP, szerver oldali validáció.

## 7. Build, futtatás, fejlesztés

### 7.1. Telepítés
```sh
cd frontend/Frontend
npm install
```

### 7.2. Fejlesztői szerver
```sh
npm run dev
```

### 7.3. Build
```sh
npm run build
```

### 7.4. Proxy beállítás
vite.config.js-ban a `/api` végpont a backendre mutat:
```js
server: {
   proxy: {
      '/api': {
         target: 'http://127.0.0.1:8000',
         changeOrigin: true,
         secure: false,
      },
   },
}
```

## 8. Fejlesztési irányelvek
- Komponensek elnevezése: PascalCase
- Egy komponens = egy fájl
- Üzleti logika: külön `services` mappában
- Állapotkezelés: context/hook
- Kódminőség: ESLint
- Bővíthetőség: minden modul önálló, mock fallback minden API-ra

## 9. Bővíthetőség, testreszabás
- Új oldal/komponens: `src/components` alá, importálás a routerbe
- Új API: `src/services` alá, mock fallback ajánlott
- Kontextus bővítése: új context/hook

## 10. Hibakezelés, mock adatok
- Minden szolgáltatás fallback-ol mock adatokra, ha nincs backend
- Hibák: Alert komponensek, loading: Spinner

## 11. További információk
- Hot-reload támogatott
- Buildelt állományok: `dist` mappa
- Támogatott: TypeScript, további lint szabályok

---


## 12. Útmutató a fejlesztés folytatásához

### 12.1. Új oldal vagy funkció hozzáadása
- Hozz létre új React komponenst a `src/components` mappában.
- Ha szükséges, készíts hozzá új service-t a `src/services` mappában (API vagy mock adatkezelés).
- Az új oldalt regisztráld a routerben (általában App.jsx vagy külön routes fájl).

### 12.2. API bővítése
- Új API végpontot a megfelelő service-ben kezelj (pl. `kuponService.js`).
- Mindig biztosíts mock fallback-et, hogy backend nélkül is működjön a fejlesztés.

### 12.3. Állapotkezelés, context
- Ha globális állapot kell, hozz létre új context-et a `src/context` mappában.
- Használj custom hook-ot a context fogyasztásához.

### 12.4. Stílusok, reszponzivitás
- Új stílusokat komponenshez tartozó CSS/SCSS fájlban helyezz el.
- Bootstrap osztályokat bátran használhatsz.

### 12.5. Hibakezelés, UX
- Minden aszinkron műveletnél legyen loading és error állapot.
- Használj Alert-et hibákhoz, Spinner-t töltéshez.

### 12.6. Kódminőség
- Tartsd be az egységes kódstílust (ESLint, modern JS/React szintaxis).
- Egy komponens = egy fájl, egy service = egy API logika.

### 12.7. Build, futtatás
- Fejlesztéshez: `npm run dev`
- Build: `npm run build`
- Függőségek: `npm install`

### 12.8. Dokumentáció bővítése
- Minden új modulhoz, funkcióhoz írj rövid leírást ebbe a dokumentumba.

### 12.9. További tippek
- Nézd át a meglévő komponenseket, szolgáltatásokat mintaként.
- Használd a mock adatokat fejlesztéshez, ha nincs backend.

---

Ez a dokumentáció részletesen bemutatja a frontend minden főbb modulját, komponensét és szolgáltatását, valamint útmutatást ad a fejlesztés folytatásához, hogy bárki könnyen tovább tudja vinni a projektet.
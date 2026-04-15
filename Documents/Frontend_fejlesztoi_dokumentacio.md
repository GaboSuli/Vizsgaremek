
# Szaldon — Frontend Fejlesztői Dokumentáció

> **Verzió:** 1.0  
> **Utolsó frissítés:** 2026. április 15.  
> **Technológia:** React 19 + Vite 7 + React Router 7 + Axios  
> **Célközönség:** Frontend fejlesztők, akik a projektet karbantartják, bővítik vagy továbbfejlesztik.

---

## Tartalomjegyzék

1. [Bevezetés és az alkalmazás célja](#1-bevezetés-és-az-alkalmazás-célja)
2. [Technológiai stack](#2-technológiai-stack)
3. [Mappastruktúra](#3-mappastruktúra)
4. [Telepítés és futtatás](#4-telepítés-és-futtatás)
5. [Architektúra áttekintés](#5-architektúra-áttekintés)
6. [Routing rendszer](#6-routing-rendszer)
7. [Hitelesítési rendszer (Authentication)](#7-hitelesítési-rendszer-authentication)
8. [Téma rendszer (Dark / Light Mode)](#8-téma-rendszer-dark--light-mode)
9. [Cookie Consent rendszer](#9-cookie-consent-rendszer)
10. [API réteg és szolgáltatások](#10-api-réteg-és-szolgáltatások)
11. [Oldalak részletes leírása](#11-oldalak-részletes-leírása)
12. [Újrafelhasználható UI komponensek](#12-újrafelhasználható-ui-komponensek)
13. [Profil modul](#13-profil-modul)
14. [Admin modul](#14-admin-modul)
15. [Kupon modul](#15-kupon-modul)
16. [Csoport modul](#16-csoport-modul)
17. [Statisztika modul](#17-statisztika-modul)
18. [Kontakt modul](#18-kontakt-modul)
19. [Formkezelés és validáció](#19-formkezelés-és-validáció)
20. [Reszponzivitás és mobil nézet](#20-reszponzivitás-és-mobil-nézet)
21. [Szerepkör alapú UI (Role-based UI)](#21-szerepkör-alapú-ui-role-based-ui)
22. [Fejlesztői irányelvek](#22-fejlesztői-irányelvek)
23. [Hibakeresés és troubleshooting](#23-hibakeresés-és-troubleshooting)
24. [API endpoint referencia](#24-api-endpoint-referencia)

---

## 1. Bevezetés és az alkalmazás célja

A **Szaldon** egy modern, többfelhasználós háztartási menedzsment alkalmazás, amely bevásárlólisták kezelésére, csoportos vásárlások koordinálására, kuponok megosztására és árstatisztikák elemzésére szolgál.

### Főbb funkciók

| Funkció | Leírás |
|---------|--------|
| **Bevásárlólisták** | Egyéni és csoportos listák létrehozása, termékek hozzáadása/törlése, vásárolt állapot jelölése |
| **Csoportkezelés** | Család, egyesület vagy vállalati csoportok létrehozása, tagok meghívása, jogosultsági szintek beállítása |
| **Kuponok** | Kuponok böngészése, moderátor szintű kezelés (CRUD), státusz szerinti szűrés |
| **Statisztikák** | Havi trendek, kategória-szintű árelemzés, költés kimutatások, Chart.js diagramok |
| **Profil** | Felhasználói adatok szerkesztése, avatar feltöltés, téma és nyelvi beállítások |
| **Admin vezérlőpult** | Felhasználó-kezelés, csoport- és kupon-moderálás, rendszerstatisztikák, kapcsolati üzenetek |
| **Kontakt** | Kapcsolatfelvételi űrlap anti-spam védelemmel és cooldown mechanizmussal |
| **Cookie kezelés** | GDPR-kompatibilis cookie consent banner és beállítások |

---

## 2. Technológiai stack

### Fő függőségek

| Csomag | Verzió | Szerep |
|--------|--------|--------|
| `react` | ^19.2.0 | UI könyvtár — komponens-alapú felépítés |
| `react-dom` | ^19.2.0 | React DOM renderer |
| `react-router-dom` | ^7.13.1 | Client-side routing, nested routes, route guards |
| `axios` | ^1.13.2 | HTTP kliens, interceptors, automatikus token kezelés |
| `chart.js` | ^4.5.1 | Diagramok: Line, Bar, Doughnut |
| `react-chartjs-2` | ^5.3.1 | Chart.js React wrapper |
| `bootstrap` | ^5.3.8 | CSS grid, utility osztályok |
| `react-bootstrap` | ^2.10.10 | Bootstrap React komponensek (minimálisan használt) |
| `date-fns` | ^4.1.0 | Dátum formázás és manipuláció |

### Fejlesztői eszközök

| Csomag | Szerep |
|--------|--------|
| `vite` ^7.2.4 | Build tool, dev server, HMR |
| `@vitejs/plugin-react` ^5.1.1 | React Fast Refresh + JSX transform |
| `babel-plugin-react-compiler` ^1.0.0 | React Compiler optimalizáció |
| `eslint` ^9.39.1 | Kódminőség ellenőrzés |
| `eslint-plugin-react-hooks` | React Hooks szabályok |
| `eslint-plugin-react-refresh` | HMR kompatibilitás ellenőrzés |

### Állapotkezelés (State Management)

Az alkalmazás **nem használ külső state management library-t** (Redux, Zustand stb.). Helyette:

- **React Context API** — globális állapotok kezelésére (auth, téma, cookie consent)
- **useState / useEffect** — lokális komponens-szintű állapot
- **localStorage** — perzisztens adattárolás (token, user, theme preference, cookie consent)
- **Custom Hooks** (`useAuth`, `useTheme`, `useCookieConsent`) — Context absztrakciók

---

## 3. Mappastruktúra

```
frontend/
├── index.html                    # SPA belépési pont (Vite managed)
├── package.json                  # Függőségek és npm scriptek
├── vite.config.js                # Vite konfiguráció (proxy, alias, React Compiler)
├── eslint.config.js              # ESLint szabályok
├── public/                       # Statikus fájlok (favicon, képek)
│   └── szaldon.png
├── src/
│   ├── main.jsx                  # React mountolás, provider hierarchia
│   ├── App.jsx                   # Routing konfiguráció, AppRoutes
│   ├── App.css                   # App shell layout stílusok
│   ├── index.css                 # Globális CSS változók, light/dark téma, reset
│   ├── mobile.css                # Reszponzív felülírások (768px, 480px, 360px)
│   ├── assets/
│   │   └── react.svg
│   ├── context/                  # Globális állapotkezelés
│   │   ├── AuthContext.js        # Auth context objektum (createContext)
│   │   ├── AuthProvider.jsx      # Auth provider: login, logout, register, refreshUser
│   │   ├── useAuth.js            # Custom hook: useContext(AuthContext)
│   │   ├── ThemeContext.jsx      # Dark/light téma provider + context
│   │   ├── useTheme.js           # Custom hook: useContext(ThemeContext)
│   │   ├── CookieContext.jsx     # Cookie consent provider + context
│   │   └── useCookieConsent.js   # Custom hook: useContext(CookieContext)
│   ├── services/                 # API kommunikációs réteg
│   │   ├── api.js                # Axios instance, interceptors, CRUD helperek
│   │   ├── authService.js        # Auth-specifikus API hívások
│   │   ├── adminService.js       # Admin endpoint hívások
│   │   ├── kuponService.js       # Kupon CRUD szolgáltatás
│   │   ├── shoppingListService.js # Bevásárlólista CRUD + mock fallback
│   │   └── statisticsService.js  # Statisztika lekérdezések + chart adat transformáció
│   └── components/               # Összes UI komponens
│       ├── AppLayout.jsx         # Sidebar + main content shell
│       ├── Sidebar.jsx           # Navigációs oldalsáv (role-aware)
│       ├── Sidebar.css
│       ├── ProtectedRoute.jsx    # Auth guard (bejelentkezett felhasználó)
│       ├── PublicRoute.jsx       # Vendég guard (nem bejelentkezett)
│       ├── AdminRoute.jsx        # Admin guard (jogosultsag_szint === 255)
│       ├── ModeratorRoute.jsx    # Moderátor guard (jogosultsag_szint > 0)
│       ├── FirstPage.jsx         # Nyilvános kezdőlap (landing marketing page)
│       ├── LandingPage.jsx       # Bejelentkezett felhasználó dashboard
│       ├── LoginPage.jsx         # Bejelentkezés
│       ├── RegisterPage.jsx      # Regisztráció
│       ├── StatisticsPage.jsx    # Statisztika főoldal
│       ├── KuponPage.jsx         # Kupon böngésző
│       ├── ShoppingListPage.jsx  # Bevásárlólista főoldal
│       ├── GroupsPage.jsx        # Csoportok lista
│       ├── GroupDetailPage.jsx   # Csoport részletes nézet
│       ├── ContactPage.jsx       # Kapcsolat oldal
│       ├── AdminPage.jsx         # Admin oldal (API endpoint referencia)
│       ├── UserManagementPage.jsx # Felhasználó kezelés
│       ├── UserStatistics.jsx    # Felhasználói statisztikák
│       ├── AlkategoriaMonthlyStats.jsx # Alkategória havi statisztika
│       ├── AllAlkategoriasStats.jsx    # Összes alkategória statisztika
│       ├── styles.css            # Megosztott komponens stílusok
│       ├── Admin/                # Admin alkomponensek
│       │   ├── Admin.css
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminStats.jsx
│       │   ├── GroupManagement.jsx
│       │   ├── UserManagement.jsx
│       │   ├── QuickActions.jsx
│       │   └── CouponModerator.jsx
│       ├── Contact/              # Kapcsolat alkomponensek
│       │   ├── ContactForm.jsx
│       │   ├── ContactInfoCard.jsx
│       │   └── SuccessMessage.jsx
│       ├── Cookie/               # Cookie consent rendszer
│       │   ├── CookieConsentBanner.jsx
│       │   ├── CookieSettingsModal.jsx
│       │   ├── CookieConsent.css
│       │   ├── CookiePolicyPage.jsx
│       │   ├── PrivacyPolicyPage.jsx
│       │   └── PolicyPage.css
│       ├── Group/                # Csoport alkomponensek
│       │   ├── groups.css
│       │   ├── CreateGroupModal.jsx
│       │   ├── EditGroupModal.jsx
│       │   ├── GroupDetail.jsx
│       │   ├── GroupList.jsx
│       │   ├── MemberManager.jsx
│       │   └── ShoppingListPanel.jsx
│       ├── Kupon/                # Kupon alkomponensek
│       │   ├── Coupon.css
│       │   ├── CouponCard.jsx
│       │   ├── CouponList.jsx
│       │   ├── CouponModeratorPage.jsx
│       │   ├── CouponModeratorPage.css
│       │   ├── CreateCouponModal.jsx
│       │   ├── DeleteCouponDialog.jsx
│       │   └── EditCouponModal.jsx
│       ├── Profile/              # Profil alkomponensek
│       │   ├── index.js
│       │   ├── Avatar.jsx
│       │   ├── Avatar.css
│       │   ├── AvatarUploader.jsx
│       │   ├── AvatarUploader.css
│       │   ├── ProfilePage.jsx
│       │   ├── ProfilePage.css
│       │   ├── ProfileHeader.jsx
│       │   ├── ProfileHeader.css
│       │   ├── UserInfoCard.jsx
│       │   ├── UserInfoCard.css
│       │   ├── PreferencesPanel.jsx
│       │   └── PreferencesPanel.css
│       ├── Statistics/           # Statisztika alkomponensek
│       │   ├── Statistics.css
│       │   ├── CategorySelector.jsx
│       │   ├── ExpenseChart.jsx
│       │   ├── MonthlyTrendChart.jsx
│       │   ├── PriceTable.jsx
│       │   ├── SummaryCards.jsx
│       │   └── YearFilter.jsx
│       └── ui/                   # Általános UI primitívek
│           ├── Button.jsx
│           ├── Button.css
│           ├── ConfirmDialog.jsx
│           ├── ConfirmDialog.css
│           ├── Toast.jsx
│           ├── Toast.css
│           ├── ToggleSwitch.jsx
│           └── ToggleSwitch.css
```

---

## 4. Telepítés és futtatás

### Előfeltételek

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- Futó **Laravel backend** a `http://127.0.0.1:8000` címen

### Telepítés

```bash
cd frontend
npm install
```

### Fejlesztői mód

```bash
npm run dev
```

A Vite dev szerver a `http://localhost:5173` címen indul. Az `/api` útvonalra érkező kéréseket a Vite proxy a `http://127.0.0.1:8000`-re továbbítja.

### Production build

```bash
npm run build
```

A build kimenet a `frontend/dist/` mappába kerül.

### Production előnézet

```bash
npm run preview
```

### Környezeti változók

A frontend nem használ `.env` fájlt. Az API base URL a `src/services/api.js`-ben van hardkódolva:

```javascript
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});
```

> **Megjegyzés:** A Vite dev szerveren az `/api` proxy is be van konfigurálva a `vite.config.js`-ben, így fejlesztés közben mindkét módszer működik.

### Vite konfiguráció (`vite.config.js`)

```javascript
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']], // React Compiler optimalizáció
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src', // import '@/services/api.js'
    },
  },
  server: {
    watch: { usePolling: true }, // WSL/Docker kompatibilitás
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

---

## 5. Architektúra áttekintés

### Provider hierarchia

A provider-ek beágyazási sorrendje kritikus — a legalul definiált provider ér el a legszűkebb scope-ba:

```
<StrictMode>
  <BrowserRouter>                    ← React Router
    <AuthProvider>                   ← Hitelesítés (login, user, token)
      <ThemeProvider>                ← Dark/light téma
        <CookieProvider>            ← Cookie consent
          <AppRoutes />             ← Routing + oldalak
          <CookieConsentBanner />   ← Globális cookie banner
          <CookieSettingsModal />   ← Cookie beállítások modal
        </CookieProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
</StrictMode>
```

### Adatfolyam

```
User Interaction
  → Component (useState: form state, loading, error)
    → Service Layer (api.js / authService.js / adminService.js / ...)
      → Axios Instance (interceptors: auth header, 401 redirect)
        → Laravel Backend (/api/...)
          → JSON Response
    → Component (setState: update UI)
      → Re-render
```

### Kulcs tervezési döntések

1. **Nincs külső state manager** — A Context API elegendő az alkalmazás méretéhez
2. **Optimista betöltés** — Az `AuthProvider` a `localStorage`-ból szinkron olvas, így az első renderkor már elérhető a user
3. **Service layer minta** — Minden API hívás a `services/` mappán keresztül történik, normalizált `{ success, data, status, message }` válaszokkal
4. **Komponens-szintű CSS** — Minden nagyobb komponensnek saját `.css` fájlja van
5. **CSS Custom Properties** — A teljes téma CSS változókon alapul (`--clr-*`)

---

## 6. Routing rendszer

### Útvonal térkép

| Útvonal | Komponens | Guard | Leírás |
|---------|-----------|-------|--------|
| `/` | `FirstPage` | `PublicRoute` | Marketing landing oldal |
| `/login` | `LoginPage` | `PublicRoute` | Bejelentkezés |
| `/register` | `RegisterPage` | `PublicRoute` | Regisztráció |
| `/cookie-szabalyzat` | `CookiePolicyPage` | — | Cookie szabályzat (mindenki számára elérhető) |
| `/adatkezeles` | `PrivacyPolicyPage` | — | Adatvédelmi tájékoztató (mindenki számára elérhető) |
| `/dashboard` | `LandingPage` | `ProtectedRoute` | Felhasználói főoldal (dashboard) |
| `/groups` | `GroupsPage` | `ProtectedRoute` | Csoportok listája |
| `/csoport/:id` | `GroupDetailPage` | `ProtectedRoute` | Csoport részletes nézet |
| `/shopping` | `ShoppingListPage` | `ProtectedRoute` | Bevásárlólisták |
| `/kupon` | `KuponPage` | `ProtectedRoute` | Kupon böngésző |
| `/stats` | `StatisticsPage` | `ProtectedRoute` | Statisztikák |
| `/user` | `ProfilePage` | `ProtectedRoute` | Profil szerkesztés |
| `/contact` | `ContactPage` | `ProtectedRoute` | Kapcsolat |
| `/admin` | `AdminDashboard` | `AdminRoute` | Admin vezérlőpult |
| `/kupon-moderator` | `CouponModeratorPage` | `ModeratorRoute` | Kupon moderálás |
| `*` | — | — | Fallback: redirect `/dashboard`-ra vagy `/`-ra |

### Route Guard-ok

#### `PublicRoute`
Csak bejelentkezés nélküli felhasználóknak engedélyez hozzáférést. Ha a user már be van jelentkezve, automatikusan a `/dashboard`-ra irányít.

```jsx
export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return children;      // loading közben megjelenít (no blank flash)
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
```

#### `ProtectedRoute`
Bejelentkezett felhasználókat igényel. Loading állapotban:
- Ha van cached user → optimisztikusan megjeleníti a tartalmat (no blank flash)
- Ha nincs cached user → spinner-t mutat
- Ha a token érvénytelen → `/login`-ra irányít a korábbi location state-tel

```jsx
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    if (user) return children; // optimista render cached user-rel
    return <div className="loading-screen"><div className="spinner" /></div>;
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
```

#### `AdminRoute`
Csak `jogosultsag_szint === 255` felhasználóknak. Különben `/dashboard`-ra irányít.

```jsx
export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
```

#### `ModeratorRoute`
`jogosultsag_szint > 0` felhasználóknak (moderátorok ÉS adminok). Különben `/dashboard`-ra irányít.

```jsx
export default function ModeratorRoute({ children }) {
  const { isModerator, loading } = useAuth();
  if (loading) return null;
  if (!isModerator) return <Navigate to="/dashboard" replace />;
  return children;
}
```

### Layout rendszer

A védett oldalak egy közös `AppLayout` komponensben futnak, ami `<Outlet />` segítségével rendereli a child route-okat:

```jsx
<Route element={
  <ProtectedRoute>
    <AppLayout />     ← Sidebar + main content area
  </ProtectedRoute>
}>
  <Route path="/dashboard" element={<LandingPage />} />
  <Route path="/groups" element={<GroupsPage />} />
  ...
</Route>
```

Az `AppLayout` a sidebar collapse állapotát kezeli:

```jsx
export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`app-shell ${collapsed ? 'sidebar-is-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
```

### Fallback route

```jsx
<Route path="*" element={
  loading ? null : <Navigate to={user ? "/dashboard" : "/"} replace />
} />
```

---

## 7. Hitelesítési rendszer (Authentication)

### Architektúra

```
AuthProvider
  ├── AuthContext (createContext)
  ├── useAuth() hook
  └── Állapot:
       ├── user (object | null)
       ├── loading (boolean)
       ├── login(email, password) → Promise
       ├── register(payload) → Promise
       ├── logout()
       ├── refreshUser() → Promise
       ├── isAdmin (computed)
       └── isModerator (computed)
```

### Token kezelés

- **Tárolás:** `localStorage` (`auth_token` kulcs)
- **Formátum:** Bearer token (Laravel Sanctum)
- **Csatolás:** Axios request interceptor automatikusan hozzáadja az `Authorization: Bearer <token>` header-t
- **Lejárat kezelés:** A response interceptor 401-es válasz esetén:
  1. Törli a `auth_token`-t és `current_user`-t a localStorage-ból
  2. Átirányít a `/login` oldalra
- **Cross-tab szinkronizáció:** `storage` event listener figyeli, ha másik tab törli a tokent

### Bejelentkezés folyamat

```
1. User kitölti a login form-ot
2. login({email, password}) meghívás
3. POST /api/felhasznalo/login → { token, user }
4. setAuthToken(token) → localStorage + Axios header
5. setCurrentUser(user) → localStorage
6. setUser(user) → React state → UI frissítés
7. PublicRoute detektálja a user-t → Navigate /dashboard
```

### Regisztráció folyamat

```
1. User kitölti a regisztrációs form-ot
2. register({nev, email, password, password_confirmation}) meghívás
3. POST /api/felhasznalo/register → { token, user }
4. Azonos token/user mentés mint login-nál
5. Automatikus bejelentkezés → redirect /dashboard
```

### Kijelentkezés

```javascript
const logout = () => {
  setAuthToken(null);   // töröl localStorage + Axios header
  localStorage.removeItem('current_user');
  setUser(null);        // React state → UI frissítés
};
```

### Optimista betöltés (No Blank Flash)

Az `AuthProvider` az első rendernél **szinkron** módon olvassa a `localStorage`-t:

```javascript
function readStoredState() {
  const token = localStorage.getItem('auth_token');
  const raw   = localStorage.getItem('current_user');
  const user  = (token && raw) ? JSON.parse(raw) : null;
  return { user, loading: !!token }; // loading=true ha van token (háttérben verify)
}
```

Ez biztosítja, hogy:
- Ha van cached user → az oldal azonnal megjelenik a cached adatokkal
- Háttérben fut a `GET /api/felhasznalo` verify hívás
- Ha a token érvénytelen → a verify sikertelen, user=null, redirect login-ra

### User objektum

```typescript
{
  id: number,
  Nev: string,          // Felhasználó neve
  Email: string,        // Email cím
  nev?: string,         // Alternatív kulcs
  email?: string,       // Alternatív kulcs
  jogosultsag_szint: number,  // 0=normál, 1+=moderátor, 255=admin
  Jogosultsag_szint?: number, // Alternatív kulcs (backend változatok)
  profilkep_url?: string,     // Avatar URL
}
```

### Jogosultsági szintek

| Szint | Név | Hozzáférés |
|-------|-----|------------|
| `0` | Normál felhasználó | Védett oldalak (dashboard, groups, shopping, stats, kupon, contact, profil) |
| `1+` | Moderátor | Fentiek + `/kupon-moderator` (kupon CRUD) |
| `255` | Adminisztrátor | Minden + `/admin` (AdminDashboard, felhasználó-kezelés, rendszer statisztikák) |

```javascript
isAdmin: !!(user && (user.jogosultsag_szint === 255 || user.Jogosultsag_szint === 255)),
isModerator: !!(user && ((user.jogosultsag_szint ?? user.Jogosultsag_szint ?? 0) > 0)),
```

---

## 8. Téma rendszer (Dark / Light Mode)

### Architektúra

```
ThemeProvider
  ├── ThemeContext (createContext)
  ├── useTheme() hook
  └── Állapot:
       ├── isDarkMode (boolean)
       └── toggleTheme()
```

### Működés

1. **Inicializálás:** Elsőként a `localStorage` `theme_mode` kulcsát ellenőrzi. Ha nincs mentett érték, az OS preferenciát használja (`prefers-color-scheme: dark`).
2. **DOM alkalmazás:** Dark mód esetén a `<html>` elemre `data-theme="dark"` attribútumot tesz.
3. **Mentés:** Minden változtatásnál a `localStorage`-ba ment.
4. **Toggle:** A `ToggleSwitch` komponens (nap/hold emoji) hívja a `toggleTheme()`-et.

### CSS változók

A teljes design system CSS Custom Properties-re épül, amelyeket a `:root` és `[data-theme='dark']` szelektorok definiálnak:

#### Light Mode (alapértelmezett)

```css
:root {
  --clr-bg: #f1f5f9;
  --clr-surface: #ffffff;
  --clr-surface-2: #f8fafc;
  --clr-text: #1e293b;
  --clr-text-2: #475569;
  --clr-text-3: #94a3b8;
  --clr-primary: #6366f1;
  --clr-border: #e2e8f0;
  --clr-success: #10b981;
  --clr-warning: #f59e0b;
  --clr-danger: #ef4444;
  --clr-info: #06b6d4;
  --sidebar-bg: #ffffff;
  --sidebar-text: #6b7280;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.07);
  /* ... */
}
```

#### Dark Mode

```css
[data-theme='dark'] {
  --clr-bg: #0f172a;
  --clr-surface: #1e293b;
  --clr-surface-2: #334155;
  --clr-text: #e2e8f0;
  --clr-text-2: #cbd5e1;
  --clr-primary: #818cf8;
  --clr-border: #334155;
  --sidebar-bg: #0f172a;
  --sidebar-text: #94a3b8;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
  /* ... */
}
```

### Kulcs szín kategóriák

| Kategória | Light | Dark | Használat |
|-----------|-------|------|-----------|
| Primary | `#6366f1` | `#818cf8` | Gombok, linkek, aktív elemek |
| Background | `#f1f5f9` | `#0f172a` | Oldal háttér |
| Surface | `#ffffff` | `#1e293b` | Kártyák, modal-ok |
| Text | `#1e293b` | `#e2e8f0` | Fő szöveg |
| Border | `#e2e8f0` | `#334155` | Elválasztó vonalak |
| Success | `#10b981` | `#10b981` | Sikeres műveletek |
| Danger | `#ef4444` | `#f87171` | Hibák, törlés |
| Warning | `#f59e0b` | `#fbbf24` | Figyelmeztetések |

### Téma használata komponensekben

A komponensek **kizárólag CSS változókat** használnak, így a témaváltás automatikus:

```css
.card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  color: var(--clr-text);
}
```

---

## 9. Cookie Consent rendszer

### Architektúra

```
CookieProvider
  ├── CookieContext (createContext)
  ├── useCookieConsent() hook
  └── Állapot:
       ├── consent ('saved' | null)
       ├── preferences { necessary, functional, analytics, optional }
       ├── showBanner (boolean)
       ├── showSettings (boolean)
       ├── acceptAll()
       ├── acceptNecessaryOnly()
       ├── savePreferences(prefs)
       ├── openSettings()
       ├── closeSettings()
       └── hasConsent(category) → boolean
```

### Cookie kategóriák

| Kategória | Alapértelmezett | Letiltható | Leírás |
|-----------|----------------|------------|--------|
| `necessary` | `true` | **Nem** | Session, auth token |
| `functional` | `false` | Igen | Téma, nyelv preferenciák |
| `analytics` | `false` | Igen | Használati statisztikák |
| `optional` | `false` | Igen | Marketing, egyéb |

### Működés

1. **Oldal betöltés:** Ellenőrzi a `localStorage` `cookie_consent` kulcsát
2. **Nincs mentett consent:** Banner megjelenik
3. **"Összes elfogadása":** Mind a 4 kategória bekapcsol
4. **"Csak szükségesek":** Csak `necessary: true`
5. **"Beállítások":** Modal nyílik egyedi kategória-választással
6. **Mentés:** `localStorage`-ba JSON formátumban

### Kapcsolódó oldalak

- `/cookie-szabalyzat` — `CookiePolicyPage` (magyar nyelvű cookie szabályzat)
- `/adatkezeles` — `PrivacyPolicyPage` (GDPR-kompatibilis adatvédelmi tájékoztató)

---

## 10. API réteg és szolgáltatások

### Axios konfiguráció (`services/api.js`)

```javascript
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});
```

### Request Interceptor

Minden kimenő kéréshez automatikusan csatolja a Bearer tokent:

```javascript
api.interceptors.request.use((cfg) => {
  if (!cfg.headers['Authorization']) {
    const token = localStorage.getItem('auth_token');
    if (token) cfg.headers['Authorization'] = `Bearer ${token}`;
  }
  return cfg;
});
```

### Response Interceptor

401-es (Unauthorized) válasz esetén automatikus kijelentkeztetés:

```javascript
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      delete api.defaults.headers.common['Authorization'];
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### Normalizált válasz formátum

Az `apiCall()` utility minden API hívást egységes formátumban ad vissza:

```typescript
// Sikeres válasz
{
  success: true,
  status: 200,
  data: { ... },   // Backend válasz
  raw: { ... }     // Nyers válasz
}

// Hibás válasz
{
  success: false,
  status: 422 | 401 | 409 | 500 | null,
  message: "Hiba szöveg",
  errors: { field: ["hibaüzenet"] } | null
}
```

### `apiCall()` — Univerzális API hívás

```javascript
export async function apiCall(path, options = {}) {
  const { method = 'GET', body = null, includeAuth = true, headers = {} } = options;
  // ...
}
```

**Paraméterek:**
- `path` — Relatív útvonal (`/csoport/create`)
- `method` — HTTP metódus (alapértelmezett: `GET`)
- `body` — Request body (POST/PUT/PATCH/DELETE)
- `includeAuth` — Auth header csatolása (alapértelmezett: `true`)
- `headers` — Extra header-ek

### Service fájlok

#### `authService.js`
| Függvény | Leírás |
|----------|--------|
| `registerUser(userData)` | Regisztráció (nev, email, jelszo, jelszo_confirmation) |
| `loginUser(credentials)` | Bejelentkezés (email, jelszo) |
| `logoutUser()` | Kijelentkezés + token törlés |
| `getCurrentUser()` | GET /api/felhasznalo — aktuális user lekérdezés |
| `updateUser(fields)` | PUT /api/felhasznalo/modositas |
| `deleteUser(userId)` | DELETE /api/felhasznalo/torles/{id} |
| `getUserById(id)` | GET /api/felhasznalo/{id} |

#### `adminService.js`
| Függvény | Leírás |
|----------|--------|
| `getAllUsers()` | Összes felhasználó |
| `deleteUser(userId)` | Felhasználó törlése |
| `updateUserRole(userId, szint)` | Jogosultsági szint módosítása |
| `getAllGroups()` | Összes csoport |
| `deleteGroup(groupId)` | Csoport törlése |
| `getAllCoupons()` | Összes kupon |
| `deleteCoupon(couponId)` | Kupon törlése |
| `getAllContacts()` | Kapcsolati üzenetek |
| `deleteContact(contactId)` | Üzenet törlése |
| `getAdminSpending()` | Felhasználó össz költései |
| `getMonthlySpending()` | Havi költés |
| `getYearlySpending()` | Éves költés |
| `getAllStatistics()` | Összes statisztika |
| `getYearStatistics(year)` | Éves statisztika |
| `getSystemStats()` | Aggregált rendszer statisztikák (`Promise.allSettled`) |
| `getDashboardData()` | Teljes admin dashboard adat (`Promise.allSettled`) |

#### `kuponService.js`
| Függvény | Leírás |
|----------|--------|
| `getAllKupons()` | GET /api/kuponok/get |
| `createKupon(data)` | POST /api/kuponok/create |
| `updateKupon(id, data)` | PUT /api/kuponok/modositas/{id} |
| `deleteKupon(id)` | DELETE /api/kuponok/torles/{id} |

#### `shoppingListService.js`
| Függvény | Leírás |
|----------|--------|
| `getAllShoppingLists()` | Összes bevásárlólista (mock fallback) |
| `getShoppingListsByUser(id)` | Felhasználó listái |
| `getShoppingListsByGroup(id)` | Csoport listái |
| `getShoppingListById(id)` | Lista azonosító alapján |
| `createShoppingList(data)` | Lista létrehozása |
| `updateShoppingList(id, data)` | Lista módosítása |
| `deleteShoppingList(id)` | Lista törlése |
| `createVevesiObjektum(data)` | Listaelem létrehozása |
| `addItemToList(listId, data)` | Elem hozzáadása |
| `removeItemFromList(listId, itemId)` | Elem eltávolítása |

> **Mock fallback:** Ha a backend nem elérhető, a `shoppingListService` előre definiált mock adatokat ad vissza, így az UI tesztelhető backend nélkül is.

#### `statisticsService.js`
| Függvény | Leírás |
|----------|--------|
| `getAlkategoriaMonthlyStats(id, userId?)` | Alkategória havi statisztika + chart adat |
| `getAllAlkategoriasStats(userId?)` | Összes alkategória összesítés + chart |

Ezek a service-ek a backend nyers adatait **Chart.js-kompatibilis formátumra** transzformálják (labels, datasets, colors).

### `api.js` — Direkt CRUD helperek

A `api.js` fájl export-álja a gyakran használt CRUD műveleteket is:

```javascript
// Csoportok
getFelhasznaloCsoportjai(), createCsoport(data), updateCsoport(id, data), deleteCsoport(id)
getCsoportFelhasznalok(csoportId), getCsoportVevesiListak(csoportId)

// Csoport tagság
addCsoportTag(csoport_id, felhasznalo_id), editCsoportTag(id, data), deleteCsoportTag(id)

// Bevásárlólisták
getFelhasznaloVevesiListak(), createVevesiLista(data), deleteVevesiLista(id)

// Lista elemek
addVevesiObjektum(data), updateVevesiObjektum(id, data), deleteVevesiObjektum(id)
```

---

## 11. Oldalak részletes leírása

### 11.1 FirstPage (Nyilvános kezdőlap) — `/`

**Cél:** Marketing landing page, amely az alkalmazás funkcióit mutatja be nem bejelentkezett felhasználóknak.

**Fő szekciók:**
- **Hero szekció** — Főcím, alcím, CTA gombok (Regisztráció / Bejelentkezés)
- **Feature kártyák** — Bevásárlólisták, csoportok, kuponok, statisztikák bemutatása
- **Hogyan működik** — 3 lépéses áttekintés (Regisztráció → Csatlakozás → Spórolás)
- **Statisztika szekció** — Összesítő számok (felhasználók, csoportok stb.)
- **CTA szekció** — Regisztrációra ösztönző panel
- **Footer** — Logo, linkek, jogi hivatkozások (Adatkezelés, Cookie szabályzat)

**Guard:** `PublicRoute` — bejelentkezett felhasználó automatikusan `/dashboard`-ra kerül.

---

### 11.2 LoginPage — `/login`

**Cél:** Felhasználói bejelentkezés.

**Funkciók:**
- Email + jelszó form
- Kliens-oldali validáció (email formátum, jelszó minimum hossz)
- Loading state a bejelentkezés közben
- Hibaüzenetek megjelenítése (API hibák)
- "Nincs még fiókod?" link a `/register`-re
- Sikeres login → redirect `/dashboard`

---

### 11.3 RegisterPage — `/register`

**Cél:** Új felhasználó regisztrálása.

**Funkciók:**
- Név, email, jelszó, jelszó megerősítés
- Kliens-oldali validáció (kötelező mezők, jelszó egyezés, email formátum)
- Backend validációs hibák megjelenítése (422 - pl. foglalt email)
- Sikeres regisztráció → automatikus bejelentkezés → redirect `/dashboard`
- "Már van fiókod?" link a `/login`-ra

---

### 11.4 LandingPage (Dashboard) — `/dashboard`

**Cél:** A bejelentkezett felhasználó főoldala — áttekintés és gyors hozzáférés.

**Funkciók:**
- Üdvözlő fejléc a user nevével
- Összesítő kártyák (csoportok száma, bevásárlólisták, aktív kuponok stb.)
- Gyors navigációs linkek
- Legutóbbi tevékenységek

**Guard:** `ProtectedRoute`

---

### 11.5 GroupsPage — `/groups`

**Cél:** A felhasználó csoportjainak listázása és kezelése.

**Funkciók:**
- Csoportok kártyás megjelenítése
- Keresés csoportnév alapján
- Új csoport létrehozása (`CreateGroupModal`)
- Csoport törlése (`ConfirmDialog`)
- Kattintásra navigáció a `/csoport/:id` részletes nézetbe
- Személyes bevásárlólisták szekció

**Adatforrás:** `getFelhasznaloCsoportjai()`, `getFelhasznaloVevesiListak()`

---

### 11.6 GroupDetailPage — `/csoport/:id`

**Cél:** Egy adott csoport részletes nézete tagokkal és bevásárlólistákkal.

**Funkciók:**
- Csoport fejléc (név, típus, tagok száma)
- Tag kezelés (`MemberManager`) — tag hozzáadása/törlése, jogosultsági szint beállítás
- Bevásárlólista panel (`ShoppingListPanel`) — listák és elemeik CRUD operációi
- Csoport szerkesztése (`EditGroupModal`)
- Csoport törlése (redirect `/groups`-ra)

**Adatforrás:** `getCsoportFelhasznalok(id)`, `getCsoportVevesiListak(id)`

---

### 11.7 ShoppingListPage — `/shopping`

**Cél:** A felhasználó összes bevásárlólistájának kezelése.

**Funkciók:**
- Bevásárlólisták megjelenítése
- Termékek hozzáadása/szerkesztése/törlése
- Vásárolt állapot jelölése
- Új lista létrehozása

**Adatforrás:** `shoppingListService`

---

### 11.8 KuponPage — `/kupon`

**Cél:** Kuponok böngészése minden bejelentkezett felhasználó számára.

**Funkciók:**
- Kupon kártyák megjelenítése (`CouponCard`)
- Keresés és szűrés (aktív/lejárt/közelgő)
- Rendezés (kedvezmény, lejárat stb.)
- Kupon részletek (kód, kedvezmény, helyszín, dátumok, megjegyzés)

**Adatforrás:** `getAllKupons()`

---

### 11.9 StatisticsPage — `/stats`

**Cél:** Költési statisztikák és ár-trendek elemzése.

**Alkomponensek:**
- `SummaryCards` — Összesítő kártyák (összes/havi/éves költés, top kategória)
- `ExpenseChart` — Költés megoszlás (Doughnut/Bar chart)
- `MonthlyTrendChart` — Havi trend vonaldiagram
- `CategorySelector` — Alkategória havi ár-trend kiválasztó
- `PriceTable` — Rendezett ártáblázat
- `YearFilter` — Év szűrő dropdown

**Adatforrás:** `statisticsService`, `adminService`

---

### 11.10 ProfilePage — `/user`

**Cél:** Felhasználói profil megtekintése és szerkesztése.

**Alkomponensek:**
- `ProfileHeader` — Név, email, avatar, regisztráció dátuma
- `UserInfoCard` — Személyes adatok szerkesztése
- `AvatarUploader` — Profilkép feltöltése
- `PreferencesPanel` — Beállítások (téma switch, stb.)

**Adatforrás:** `useAuth()`, `updateUser()`

---

### 11.11 ContactPage — `/contact`

**Cél:** Kapcsolatfelvételi űrlap a fejlesztőkkel.

**Alkomponensek:**
- `ContactForm` — Űrlap anti-spam védelemmel
- `ContactInfoCard` — Fejlesztői elérhetőségek
- `SuccessMessage` — Sikeres küldés visszajelzés

**Adatforrás:** `apiCall('/contact/create', { method: 'POST', body: data })`

---

### 11.12 AdminDashboard — `/admin`

**Cél:** Adminisztrátor vezérlőpult a teljes rendszer áttekintéséhez.

**Fő szekciók:**
- `AdminStats` — Rendszer összesítők (felhasználók, csoportok, kuponok, üzenetek száma)
- `UserManagement` — Felhasználók táblázata, szerepkör módosítás, törlés
- `GroupManagement` — Csoportok kezelése
- `CouponModerator` — Kuponok kezelése
- `QuickActions` — Gyors műveletek (navigáció, link-ek)
- Regisztrációs trend diagram (Bar chart)
- Rendszer állapot grid (Backend/Frontend/DB/Auth)
- Kapcsolati üzenetek lista
- Költés összesítés

**Guard:** `AdminRoute` (jogosultsag_szint === 255)

**Adatforrás:** `getDashboardData()` (`Promise.allSettled` — 8 párhuzamos API hívás)

---

## 12. Újrafelhasználható UI komponensek

### 12.1 `Button` (`ui/Button.jsx`)

Általános gomb komponens variánsokkal.

**Props:**

| Prop | Típus | Alapértelmezett | Leírás |
|------|-------|-----------------|--------|
| `variant` | `'primary'` \| `'secondary'` \| `'danger'` \| `'ghost'` | `'primary'` | Vizuális stílus |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Méret |
| `loading` | `boolean` | `false` | Loading spinner megjelenítése |
| `disabled` | `boolean` | `false` | Letiltott állapot |
| `icon` | `ReactNode` | — | Ikon az elején |
| `children` | `ReactNode` | — | Gomb felirat |
| `onClick` | `function` | — | Kattintás handler |
| `...rest` | — | — | További HTML attribútumok |

**Használat:**
```jsx
<Button variant="primary" loading={saving} onClick={handleSave}>
  Mentés
</Button>
<Button variant="danger" size="sm" icon={<TrashIcon />} onClick={handleDelete}>
  Törlés
</Button>
```

---

### 12.2 `ConfirmDialog` (`ui/ConfirmDialog.jsx`)

Megerősítő párbeszédablak destruktív műveleteknél (törlés, eltávolítás).

**Props:**

| Prop | Típus | Leírás |
|------|-------|--------|
| `open` | `boolean` | Megjelenítés |
| `title` | `string` | Dialógus címe |
| `message` | `string` | Megerősítő szöveg |
| `confirmLabel` | `string` | Megerősítő gomb felirat |
| `cancelLabel` | `string` | Mégsem gomb felirat |
| `variant` | `'danger'` \| `'warning'` | Stílus |
| `onConfirm` | `function` | Megerősítés handler |
| `onCancel` | `function` | Mégsem handler |
| `loading` | `boolean` | Loading state |

**Használat:**
```jsx
<ConfirmDialog
  open={showDeleteConfirm}
  title="Csoport törlése"
  message="Biztosan törölni szeretnéd ezt a csoportot?"
  confirmLabel="Törlés"
  variant="danger"
  onConfirm={handleDelete}
  onCancel={() => setShowDeleteConfirm(false)}
/>
```

---

### 12.3 `Toast` (`ui/Toast.jsx`)

Értesítési felugró üzenet automatikus eltűnéssel.

**Props:**

| Prop | Típus | Leírás |
|------|-------|--------|
| `message` | `string` | Üzenet szöveg |
| `type` | `'success'` \| `'error'` \| `'warning'` \| `'info'` | Típus (szín + ikon) |
| `visible` | `boolean` | Megjelenítés |
| `onClose` | `function` | Bezárás handler |
| `duration` | `number` | Automatikus eltűnés ms-ban |

**SVG ikonok típusonként:**
- `success` — Zöld pipa
- `error` — Piros X
- `warning` — Sárga felkiáltójel
- `info` — Kék i-betű

---

### 12.4 `ToggleSwitch` (`ui/ToggleSwitch.jsx`)

Dark/Light téma váltó kapcsoló.

**Működés:**
- A `useTheme()` hook-ot használja
- Hold emoji (🌙) / Nap emoji (☀️) megjelenítés
- `aria-label="Téma váltás"` akadálymentesítés

**Használat:**
```jsx
<ToggleSwitch />  // Automatikusan kezeli a témát
```

---

### 12.5 `Avatar` (`Profile/Avatar.jsx`)

Felhasználói profilkép vagy monogram megjelenítése.

**Props:**

| Prop | Típus | Leírás |
|------|-------|--------|
| `src` | `string \| null` | Kép URL (ha van) |
| `name` | `string` | Felhasználó neve (monogramhoz) |
| `size` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` \| `'xl'` | Méret |
| `className` | `string` | Extra CSS osztály |

**Viselkedés:**
- Ha van `src` → képet jelenít meg
- Ha nincs `src` → a `name`-ből generált monogramot mutat (max 2 karakter)

---

### 12.6 `Sidebar` (`Sidebar.jsx`)

A fő navigációs oldalsáv — dinamikusan épül a felhasználó szerepköre alapján.

**Props:**

| Prop | Típus | Leírás |
|------|-------|--------|
| `collapsed` | `boolean` | Összecsukott állapot |
| `onToggle` | `function` | Collapse toggle handler |

**Szekciók (normál felhasználó):**

```
Navigáció
  ├── Főoldal (/dashboard)
  ├── Csoportok (/groups)
  ├── Bevásárlólisták (/shopping)
  ├── Kuponok (/kupon)
  ├── Statisztikák (/stats)
  └── Kapcsolat (/contact)
Fiók
  └── Profil (/user)
```

**Szekciók (admin):**

```
Áttekintés
  └── Főoldal (/dashboard)
Adminisztráció
  ├── Vezérlőközpont (/admin) [ADMIN badge]
  └── Kupon Moderátor (/kupon-moderator)
Rendszer
  ├── Statisztikák (/stats)
  └── Kapcsolat (/contact)
Fiók
  └── Admin Profil (/user)
```

**Mobil viselkedés:**
- Hamburger menü gombbal nyitható
- Overlay backdrop az oldalsáv mögött
- Automatikus bezárás link kattintáskor

---

## 13. Profil modul

### Komponens struktúra

```
ProfilePage
├── ProfileHeader    — Fejléc avatar-ral, névvel, regisztráció dátumával
├── UserInfoCard     — Személyes adatok szerkesztése (név, email, jelszó)
├── AvatarUploader   — Profilkép feltöltő
└── PreferencesPanel — Beállítások (téma switch)
```

### `ProfilePage` fő működése

1. `useAuth()` hook-kal lekéri a `user` objektumot és a `refreshUser` függvényt
2. A `UserInfoCard` form-jában szerkeszthetők az adatok
3. Mentésnél a `updateUser(fields)` hívódik (PUT /api/felhasznalo/modositas)
4. Sikeres mentés → `refreshUser()` frissíti a globális user state-et
5. A `PreferencesPanel` a `ToggleSwitch` komponenst tartalmazza a témaváltáshoz

### Avatar rendszer

- `Avatar` — Megjelenítő komponens (`src` vagy monogram)
- `AvatarUploader` — File input + előnézet + feltöltés
- A profilkép URL a `user.profilkep_url` mezőben tárolódik

---

## 14. Admin modul

### Komponens struktúra

```
AdminDashboard
├── AdminStats          — Rendszer összesítő kártyák
├── UserManagement      — Felhasználók táblázata (teljeskörű CRUD)
├── GroupManagement     — Csoportok kártyás kezelése
├── CouponModerator     — Kuponok kezelése
├── QuickActions        — Gyors navigációs gombok
├── Regisztrációs trend diagram (Chart.js Bar)
├── Rendszer állapot grid
└── Kapcsolati üzenetek lista
```

### Admin Dashboard adat betöltés

Az `AdminDashboard` a `getDashboardData()` függvényt hívja, amely **8 párhuzamos API hívást** indít `Promise.allSettled`-tel:

```javascript
const [users, groups, coupons, contacts, spending, monthlySpend, yearlySpend, stats] =
  await Promise.allSettled([
    getAllUsers(), getAllGroups(), getAllCoupons(), getAllContacts(),
    getAdminSpending(), getMonthlySpending(), getYearlySpending(), getAllStatistics()
  ]);
```

### UserManagement tábla

- Felhasználók listája (név, email, jogosultsági szint, regisztráció dátuma)
- Szerepkör módosítás inline dropdown-nal
- Jogosultsági szint role badge-ek (Admin, Moderátor, Tag, Vendég)
- Felhasználó törlés megerősítő dialógussal
- Keresés/szűrés

### Rendszer állapot grid

```
Backend Server  — Online/Offline
Frontend App    — Online/Offline
Database        — Aktív/Inaktív
Authentication  — Aktív/Inaktív
```

---

## 15. Kupon modul

### Komponens struktúra

```
KuponPage (normál felhasználó — böngészés)
├── CouponList
│   └── CouponCard[]
└── Szűrés, keresés, rendezés

CouponModeratorPage (moderátor/admin — kezelés)
├── CouponList (szerkesztés/törlés elérhetőséggel)
├── CreateCouponModal
├── EditCouponModal
└── DeleteCouponDialog
```

### Kupon státuszok

| Státusz | Logika | Színkód |
|---------|--------|---------|
| **Aktív** | `start ≤ now ≤ end` | Zöld |
| **Lejárt** | `now > end` | Szürke/piros |
| **Közelgő** | `now < start` | Kék |

### Kupon adat struktúra

```typescript
{
  id: number,
  Kod: string,           // Kupon kód
  Kedvezmeny: number,    // Kedvezmény összeg
  Leiras: string,        // Leírás
  Helyszin: string,      // Érvényességi hely
  Megjegyzes: string,    // Megjegyzés
  ErvenyessegKezdete: string,  // ISO dátum
  ErvenyessegVege: string,     // ISO dátum
}
```

### Szűrés és rendezés

**Státusz szűrő fülek:** Összes | Aktív | Közelgő | Lejárt

**Rendezési opciók (6):** Kedvezmény csökkenő/növekvő, lejárat közeli/távoli, kód A-Z/Z-A

---

## 16. Csoport modul

### Komponens struktúra

```
GroupsPage
├── GroupList
│   ├── CreateGroupModal
│   └── ConfirmDialog (törlés)
└── Személyes bevásárlólisták szekció

GroupDetailPage
├── GroupDetail
│   ├── MemberManager
│   │   └── Avatar
│   ├── ShoppingListPanel
│   ├── EditGroupModal
│   └── ConfirmDialog (törlés)
```

### Csoport típusok

| Típus ID | Név |
|----------|-----|
| 1 | Család |
| 2 | Egyesület |
| 3 | Vállalat |

### MemberManager jogosultsági szintek

| Szint | Név | Badge szín |
|-------|-----|------------|
| 3 | Admin | Piros |
| 2 | Moderátor | Sárga |
| 1 | Tag | Kék |
| 0 | Vendég | Szürke |

### ShoppingListPanel

- Accordion stílusú lista kártyák
- Listaelem hozzáadás form (név, ár, mennyiség)
- Vásárolt állapot toggle (checkbox)
- Lista létrehozás/törlés
- Elem szerkesztés/törlés
- Becsült összeg megjelenítése

---

## 17. Statisztika modul

### Komponens struktúra

```
StatisticsPage
├── SummaryCards        — 5 összesítő kártya
├── ExpenseChart        — Költés Doughnut/Bar diagram
├── MonthlyTrendChart   — Havi trend multi-line diagram
├── CategorySelector    — Alkategória részletes elemzés
├── PriceTable          — Rendezett ártáblázat
└── YearFilter          — Év szűrő
```

### SummaryCards

5 statisztikai kártya:
1. **Összes Költés** — Teljes kiadás (Ft)
2. **Havi Költés** — Aktuális havi kiadás
3. **Éves Költés** — Aktuális évi kiadás
4. **Top Kategória** — Leggyakrabban vásárolt
5. **Legdrágább Piaci Termék** — Legmagasabb átlagárú termék

**Loading state:** Skeleton loading animáció betöltés közben.

### ExpenseChart

- Két nézet mód: **Doughnut** (kör diagram) és **Bar** (oszlop diagram) — toggle gombbal
- 15 színű paletta
- Összesítő panel az összes költéssel
- Adatforrás: `GET /api/felhasznalo/osszKoltesei`

### MonthlyTrendChart

- Multi-line vonaldiagram Chart.js-sel
- Kategória tag-ek toggle-olhatók (be/ki kapcsolás)
- Keresés kategóriák között
- "Összes kijelölése" / "Törlés" gombok
- Adatforrás: `GET /api/statisztika/all`

### CategorySelector

- Dropdown alkategória választó
- Line chart a havi ár trend-del
- Statisztika sáv: Min, Max, Átlag, Aktuális, Ingadozás
- Adatforrás: `GET /api/statisztika/id/{id}`

### PriceTable

- Rendezett adattáblázat alkategóriák szerint
- Keresés alkategória néven
- Oszlopok: Megnevezés, Min ár, Max ár, Átlag ár, Mértékegység, Ingadozás
- Év szűrő (`YearFilter` dropdown)
- Adatforrás: `GET /api/statisztika/ev/{year}`

---

## 18. Kontakt modul

### Komponens struktúra

```
ContactPage
├── ContactForm
│   ├── Honeypot anti-spam
│   ├── 30s cooldown
│   ├── Üzenet típus választó
│   └── Karakter számláló
├── ContactInfoCard
│   ├── Fejlesztői csapat
│   └── Ügyfélszolgálat
└── SuccessMessage
```

### ContactForm részletek

**Mezők:**
- Név (auto-fill `user.Nev`-ből)
- Email (auto-fill `user.Email`-ből)
- Üzenet típus (Kérdés / Hiba bejelentés / Javaslat / Együttműködés)
- Tárgy
- Üzenet (karakter számláló)
- Honeypot mező (rejtett, bot-szűrő)

**Anti-spam védelem:**
1. **Honeypot mező** — Ha kitöltik, a küldés csendben sikertelen (látszólag sikeres)
2. **30 másodperces cooldown** — Azonos session-ben egymást követő küldések között minimum 30 mp

**API hívás:** `POST /api/contact/create`

---

## 19. Formkezelés és validáció

### Minta: Login Form

```jsx
const [formData, setFormData] = useState({ email: '', password: '' });
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);

const validate = () => {
  const newErrors = {};
  if (!formData.email) newErrors.email = 'Email megadása kötelező';
  if (!formData.password) newErrors.password = 'Jelszó megadása kötelező';
  return newErrors;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  setLoading(true);
  setErrors({});
  const result = await login(formData);
  if (!result.success) {
    setErrors({ submit: result.message });
  }
  setLoading(false);
};
```

### Validációs minták

| Minta | Megvalósítás |
|-------|-------------|
| Kötelező mező | `if (!value) errors.field = 'Mező kötelező'` |
| Email formátum | Regex vagy egyszerű tartalom ellenőrzés |
| Jelszó egyezés | `if (pw !== pwConfirm) errors.pw = 'Jelszavak nem egyeznek'` |
| Min/Max hossz | `if (value.length < 3) errors.field = 'Min. 3 karakter'` |
| Backend validáció | 422-es válasz `errors` mezőjéből kiolvasva, mező szinten megjelenítve |

### Loading és Error state kezelés

```jsx
// Loading state
const [loading, setLoading] = useState(false);
// ... API hívás előtt: setLoading(true), után: setLoading(false)

// Error megjelenítés
{errors.submit && <div className="error-message">{errors.submit}</div>}
{errors.email && <span className="field-error">{errors.email}</span>}
```

### Toast feedback rendszer

A `Toast` komponens globálisan elérhető és a következő mintával használatos:

```jsx
const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

// Megjelenítés
setToast({ visible: true, message: 'Sikeresen mentve!', type: 'success' });

// JSX
<Toast
  visible={toast.visible}
  message={toast.message}
  type={toast.type}
  onClose={() => setToast(t => ({ ...t, visible: false }))}
/>
```

---

## 20. Reszponzivitás és mobil nézet

### Breakpoint-ok

| Breakpoint | Céleszköz | Fő változások |
|------------|-----------|---------------|
| `> 768px` | Desktop | Sidebar fix, tartalom mellett |
| `≤ 768px` | Tablet | Sidebar overlay, hamburger menü, 44px érintési terület |
| `≤ 480px` | Telefon | Kisebb tipográfia, egyoszlopos layout |
| `≤ 360px` | Kis telefon | Extra tömörítés |

### Sidebar mobil viselkedés

- **Desktop:** Fix oldalsáv, collapse gombbal összecsukható (260px → 72px)
- **Mobil:** Hamburger ikon (bal felső), overlay, swipe close, link kattintás bezárja

### Mobil optimalizációk (`mobile.css`)

1. **Érintési terület:** Minden interaktív elem min. 44px magasságú
2. **iOS zoom prevention:** Input `font-size: 16px !important` (megakadályozza az auto-zoom-ot)
3. **Safe area:** iOS notch támogatás `env(safe-area-inset-*)`
4. **Modal-ok:** Alulról felcsúsznak (sheet-szerű), sticky fejléc/lábléc
5. **Táblázatok:** Horizontális scroll + overlay árnyék, vagy kártya nézetbe konvertálás (640px alatt)
6. **Scroll hint:** Táblázatok jobb szélén halványuló árnyék jelzi a további tartalmat

### Grid és layout

A fő oldalak CSS Grid-et használnak, amely responsive-an adaptálódik:

```css
/* Desktop: 3 oszlop */
.cards-grid { grid-template-columns: repeat(3, 1fr); }

/* Tablet: 2 oszlop */
@media (max-width: 768px) {
  .cards-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Mobil: 1 oszlop */
@media (max-width: 480px) {
  .cards-grid { grid-template-columns: 1fr; }
}
```

### Mobil modal animáció

```css
@keyframes mobileSlideUp {
  from { transform: translateY(100%); opacity: 0.5; }
  to   { transform: translateY(0); opacity: 1; }
}
```

---

## 21. Szerepkör alapú UI (Role-based UI)

### Sidebar változások

| Elem | Normál User | Moderátor | Admin |
|------|-------------|-----------|-------|
| Navigáció szekció | ✅ | ✅ | ❌ (helyette Áttekintés) |
| Csoportok, Bevásárlólisták | ✅ | ✅ | ❌ |
| Moderátor szekció | ❌ | ✅ | ❌ |
| Adminisztráció szekció | ❌ | ❌ | ✅ |
| Kupon Moderátor link | ❌ | ✅ | ✅ |
| Vezérlőközpont link | ❌ | ❌ | ✅ (ADMIN badge) |
| Admin badge a header-ben | ❌ | ❌ | ✅ |
| Profil label | "Profil" | "Profil" | "Admin Profil" |
| Admin CSS stílus | ❌ | ❌ | ✅ (`sidebar--admin` class) |

### Admin-specifikus stílusok

Az admin sidebar és footer speciális CSS osztályokat kap:
- `sidebar--admin` — Különleges háttérszín/keret
- `sidebar-footer--admin` — Admin footer stílus
- `sidebar-user-avatar--admin` — Admin avatar kiemelés
- `sidebar-hamburger--admin` — Admin hamburger szín

### Profil oldal

- **Normál user:** Személyes adatok, avatar, téma váltó
- **Admin:** Ugyanaz + admin jogosultsági szint megjelenítése

### Routing szintű védelem

A role-based UI nem csak vizuális — a route guard-ok biztosítják, hogy:
- Admin oldalak csak admin jogosultsággal elérhetők
- Moderátor oldalak csak moderátor+ jogosultsággal elérhetők
- Unauthorized hozzáférési kísérlet → redirect `/dashboard`

---

## 22. Fejlesztői irányelvek

### Kódolási konvenciók

| Konvenció | Szabály |
|-----------|--------|
| **Komponens fájlok** | PascalCase: `GroupsPage.jsx`, `CouponCard.jsx` |
| **Hook fájlok** | camelCase: `useAuth.js`, `useTheme.js` |
| **Service fájlok** | camelCase: `adminService.js`, `kuponService.js` |
| **CSS fájlok** | komponens névvel egyezik: `Sidebar.css`, `Coupon.css` |
| **Context fájlok** | PascalCase az entity: `AuthContext.js`, `ThemeContext.jsx` |
| **Exportok** | Default export a fő komponensre; named export utility/context |
| **Nyelv** | UI szövegek magyar nyelven; változónevek, kommentek angolul/magyarul |

### Komponens struktúra sablon

```jsx
import React, { useState, useEffect } from 'react';
import useAuth from '../context/useAuth.js';
import { apiCall } from '../services/api.js';
import './ComponentName.css';

export default function ComponentName({ prop1, prop2 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await apiCall('/endpoint');
      if (result.success) setData(result.data);
      else setError(result.message);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="loading">Betöltés...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="component-name">
      {/* ... */}
    </div>
  );
}
```

### Fájl elnevezési szabályok

- Oldal komponensek: `*Page.jsx` (pl. `GroupsPage.jsx`, `StatisticsPage.jsx`)
- Module al-komponensek: saját almappában (pl. `Profile/`, `Admin/`, `Kupon/`)
- Modal komponensek: `*Modal.jsx` (pl. `CreateGroupModal.jsx`)
- Dialog komponensek: `*Dialog.jsx` (pl. `DeleteCouponDialog.jsx`)

### Clean Code szabályok

1. **Egy komponens = egy felelősség.** Az oldalak (Page) orchestrálnak, az alkomponensek specifikus feladatokat látnak el.
2. **API hívások centralizálva** a `services/` mappában. Komponensek NEM hívnak közvetlenül Axios-t.
3. **State colocation:** Az állapot ott éljen, ahol használva van. Csak globális állapot kerül Context-be.
4. **Nem kell prop drilling:** Ha 2+ szint mélyre kellene vinni → Context használat.
5. **Normalizált API válaszok:** Minden service `{ success, data, message }` formátumban térít.

### Refaktorálási elvek

1. **Ismétlődő logika → Custom Hook:** Ha 2+ komponens ugyanazt az API logikát használja → `useXyz()` hook
2. **Ismétlődő UI → Közös komponens:** Ha 2+ helyen hasonló UI → `ui/` mappába extraháld
3. **Nagy komponens → alkomponensekre bontás:** Ha egy fájl >300 sor → saját almappába bontás (mint `Admin/`, `Statistics/`)

### Performance tippek

1. **`useMemo` és `useCallback`** — A Sidebar a `buildSections`-t `useMemo`-val cache-eli
2. **React Compiler** — A `babel-plugin-react-compiler` automatikus memo-izálást végez
3. **`Promise.allSettled`** — Párhuzamos API hívások (admin dashboard)
4. **Lazy loading** — Még nem implementált, de ajánlott nagy oldalakhoz (Statistics, Admin)
5. **Kép optimalizáció** — Avatar-ok méretezése CSS-sel

---

## 23. Hibakeresés és troubleshooting

### Gyakori problémák és megoldások

#### 1. "Blank white page" betöltésnél

**Ok:** A `loading` state `true` marad, mert a backend nem elérhető.

**Megoldás:**
- Ellenőrizd, hogy a Laravel backend fut: `php artisan serve`
- Ellenőrizd a Vite proxy beállítást a `vite.config.js`-ben
- Nézd meg a böngésző Console/Network fület 401/500 hibák után

#### 2. "401 Unauthorized" ciklikus redirect

**Ok:** Lejárt vagy érvénytelen token, az interceptor `/login`-ra irányít.

**Megoldás:**
- Töröld a localStorage-t: `localStorage.clear()` a Console-ban
- Jelentkezz be újra

#### 3. API hívás CORS hiba

**Ok:** A frontend közvetlenül a `http://127.0.0.1:8000/api`-t hívja a Vite proxy helyett.

**Megoldás:**
- Fejlesztésben használd a relatív útvonalat (a Vite proxy kezeli)
- Vagy konfiguráld a Laravel CORS middleware-t (`config/cors.php`)

#### 4. Téma nem váltódik

**Ok:** A `ThemeProvider` a provider hierarchiában rosszul van pozicionálva.

**Megoldás:**
- Ellenőrizd, hogy a `ThemeProvider` az `App.jsx`-ben a routing fölött van
- Az `index.css`-ben legyen definiálva a `[data-theme='dark']` selector

#### 5. "Cannot read properties of null" user adatoknál

**Ok:** A komponens render-el, mielőtt a user objektum betöltődne.

**Megoldás:**
- Használj optional chaining-et: `user?.Nev || user?.nev`
- Ellenőrizd a `loading` state-et render előtt

#### 6. Vite dev server nem indul

**Megoldás:**
```bash
rm -rf node_modules
npm install
npm run dev
```

#### 7. Chart.js nem renderel

**Ok:** `react-chartjs-2` regisztrálás hiányzik.

**Megoldás:**
A `StatisticsPage.jsx` (vagy ahol Chart.js-t használsz) regisztráld:
```javascript
import { Chart as ChartJS, CategoryScale, LinearScale, ... } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, ...);
```

#### 8. Mobil nézetben a sidebar nem záródik be

**Ok:** A `closeMobile` nem hívódik link kattintáskor.

**Megoldás:**
Minden `<NavLink>` kap `onClick={closeMobile}` prop-ot.

### Hasznos fejlesztői parancsok

```bash
# Dev szerver indítása
npm run dev

# Production build
npm run build

# Build preview
npm run preview

# ESLint futtatás
npm run lint

# localStorage törlése (böngésző Console)
localStorage.clear()

# Jelenlegi user megtekintése (böngésző Console)
JSON.parse(localStorage.getItem('current_user'))

# Token ellenőrzés (böngésző Console)
localStorage.getItem('auth_token')
```

---

## 24. API endpoint referencia

### Publikus endpointok (auth nem szükséges)

| Metódus | Útvonal | Leírás |
|---------|---------|--------|
| `GET` | `/api/alkategoriak` | Alkategóriák listája |
| `GET` | `/api/statisztika/all` | Összes statisztika |
| `GET` | `/api/statisztika/id/{id}` | Alkategória statisztikája |
| `GET` | `/api/statisztika/ev/{ev}` | Éves statisztika |
| `GET` | `/api/kuponok/get` | Kuponok listája |
| `POST` | `/api/felhasznalo/register` | Regisztráció |
| `POST` | `/api/felhasznalo/login` | Bejelentkezés |

### Védett endpointok (auth:sanctum)

#### Felhasználó

| Metódus | Útvonal | Leírás |
|---------|---------|--------|
| `GET` | `/api/felhasznalo` | Aktuális user lekérdezése |
| `GET` | `/api/felhasznalo/csoportjai` | User csoportjai |
| `GET` | `/api/felhasznalo/vevesiListak` | User bevásárlólistái |
| `GET` | `/api/felhasznalo/osszKoltesei` | User összköltései |
| `GET` | `/api/felhasznalo/eHaviKoltesei` | User havi költései |
| `GET` | `/api/felhasznalo/eEviKoltesei` | User évi költései |
| `PUT` | `/api/felhasznalo/modositas` | User adatok módosítása |
| `DELETE` | `/api/felhasznalo/torles/{id}` | Felhasználó törlése |
| `POST` | `/api/felhasznalo/logout` | Kijelentkezés |

#### Csoportok

| Metódus | Útvonal | Leírás |
|---------|---------|--------|
| `POST` | `/api/csoport/create` | Csoport létrehozása |
| `PUT` | `/api/csoport/modositas/{id}` | Csoport módosítása |
| `DELETE` | `/api/csoport/torles/{id}` | Csoport törlése |
| `GET` | `/api/csoport/{id}/felhasznalok` | Csoport tagjai |
| `GET` | `/api/csoport/{id}/vevesiListak` | Csoport bevásárlólistái |

#### Csoport tagság

| Metódus | Útvonal | Leírás |
|---------|---------|--------|
| `POST` | `/api/csoportTagsag/create` | Tag hozzáadása |
| `PUT` | `/api/csoportTagsag/modositas/{id}` | Tagság módosítása |
| `DELETE` | `/api/csoportTagsag/torles/{id}` | Tag eltávolítása |

#### Bevásárlólisták

| Metódus | Útvonal | Leírás |
|---------|---------|--------|
| `POST` | `/api/vevesiLista/create` | Lista létrehozása |
| `DELETE` | `/api/vevesiLista/torles/{id}` | Lista törlése |

#### Bevásárlólista elemek

| Metódus | Útvonal | Leírás |
|---------|---------|--------|
| `POST` | `/api/vevesiObjektum/create` | Elem létrehozása |
| `PUT` | `/api/vevesiObjektum/modositas/{id}` | Elem módosítása |
| `DELETE` | `/api/vevesiObjektum/torles/{id}` | Elem törlése |

#### Kuponok

| Metódus | Útvonal | Leírás |
|---------|---------|--------|
| `POST` | `/api/kuponok/create` | Kupon létrehozása (moderátor+) |
| `PUT` | `/api/kuponok/modositas/{id}` | Kupon módosítása (moderátor+) |
| `DELETE` | `/api/kuponok/torles/{id}` | Kupon törlése |

#### Kapcsolat

| Metódus | Útvonal | Leírás |
|---------|---------|--------|
| `GET` | `/api/contact` | Üzenetek listája |
| `POST` | `/api/contact/create` | Üzenet küldése |
| `DELETE` | `/api/contact/torles/{id}` | Üzenet törlése |

---

## Melléklet: Tipográfiai rendszer

| Változó | Méret | Használat |
|---------|-------|-----------|
| `--text-xs` | 0.75rem (12px) | Apró címkék, badge-ek |
| `--text-sm` | 0.875rem (14px) | Alcímek, meta szöveg |
| `--text-base` | 1rem (16px) | Alapértelmezett szöveg |
| `--text-lg` | 1.125rem (18px) | Szekció címek |
| `--text-xl` | 1.25rem (20px) | Oldal alcímek |
| `--text-2xl` | 1.5rem (24px) | Oldal címek |
| `--text-3xl` | 1.875rem (30px) | Hero címek |
| `--text-4xl` | 2.25rem (36px) | Landing hero |
| `--text-5xl` | 3rem (48px) | Kiemelt szám |

| Változó | Súly |
|---------|------|
| `--fw-light` | 300 |
| `--fw-normal` | 400 |
| `--fw-medium` | 500 |
| `--fw-semibold` | 600 |
| `--fw-bold` | 700 |
| `--fw-extrabold` | 800 |

**Font család:** `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

---

## Melléklet: Shadow rendszer

| Változó | Használat |
|---------|-----------|
| `--shadow-xs` | Apró elemek (badge, chip) |
| `--shadow-sm` | Kártyák, input-ok |
| `--shadow-md` | Kiemelkedő kártyák, dropdown-ok |
| `--shadow-lg` | Modal-ok, sidebar |
| `--shadow-xl` | Overlay, popup |
| `--shadow-primary` | Primary szintű emphasis (CTA gombok hover) |

---

## Melléklet: Spacing rendszer

| Változó | Méret |
|---------|-------|
| `--sp-1` | 4px |
| `--sp-2` | 8px |
| `--sp-3` | 12px |
| `--sp-4` | 16px |
| `--sp-5` | 20px |
| `--sp-6` | 24px |
| `--sp-8` | 32px |
| `--sp-10` | 40px |
| `--sp-12` | 48px |
| `--sp-16` | 64px |

---

## Melléklet: Border Radius rendszer

| Változó | Méret | Használat |
|---------|-------|-----------|
| `--r-sm` | 6px | Input-ok, badge-ek |
| `--r-md` | 10px | Kártyák, dropdown-ok |
| `--r-lg` | 14px | Modal-ok, nagy kártyák |
| `--r-xl` | 20px | Hero szekciók |
| `--r-2xl` | 28px | Kiemelt elemek |
| `--r-full` | 9999px | Tabletták, pill-ek, avatar-ok |

---

*A dokumentációt a Szaldon projekt forráskódja alapján készítettük. Minden fejezet a tényleges implementációt tükrözi.*
# Frontend Tesztelési Dokumentáció

## Tartalomjegyzék

1. [Tesztelési infrastruktúra](#1-tesztelési-infrastruktúra)
2. [Telepítés és konfiguráció](#2-telepítés-és-konfiguráció)
3. [Tesztek futtatása](#3-tesztek-futtatása)
4. [Tesztfájlok áttekintése](#4-tesztfájlok-áttekintése)
5. [Tesztesetek részletes leírása](#5-tesztesetek-részletes-leírása)
6. [Mock stratégia](#6-mock-stratégia)
7. [Ismert problémák és megoldások](#7-ismert-problémák-és-megoldások)

---

## 1. Tesztelési infrastruktúra

A frontend tesztelési rendszer az alábbi csomagokra épül:

| Csomag | Verzió | Szerepe |
|---|---|---|
| `vitest` | ^4.1.4 | Tesztek futtatója (Vite-natív) |
| `@testing-library/react` | ^16.3.2 | React komponensek renderelése tesztben |
| `@testing-library/jest-dom` | ^6.9.1 | DOM assertion-ök (`toBeInTheDocument`, stb.) |
| `@testing-library/user-event` | ^14.6.1 | Felhasználói interakciók szimulálása |
| `jsdom` | ^29.0.2 | Böngészős DOM környezet Node.js-ben |

### Miért Vitest?

A projekt Vite-alapú build rendszert használ (`vite ^7.2.4`). A Vitest a Vite konfigurációját közvetlenül újrahasznosítja, ezért:
- Nincs szükség külön Babel/Jest konfiguráció karbantartására
- A tesztek ugyanazokat az aliasokat és plugin-eket látják, mint a build
- A transzformálás sebessége azonos a fejlesztői szerver sebességével

---

## 2. Telepítés és konfiguráció

### Függőségek telepítése

```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### `vite.config.js` — test blokk

```js
test: {
  environment: 'jsdom',      // böngészős DOM emulálása
  globals: true,             // describe/it/expect globálisan elérhető (nincs import)
  setupFiles: './src/test/setup.js',
  css: false,                // CSS fájlok importját figyelmen kívül hagyja
  include: ['src/**/*.test.{js,jsx}'],
  pool: 'forks',
  forks: {
    execArgv: ['--max-old-space-size=8192'],  // 8 GB heap a worker forknak
  },
},
```

> **Fontos:** A `babel-plugin-react-compiler` a tesztelési transzform fázisban korlátlan memóriát fogyaszt el Node 22-n. Ezért teszteléskor ki van kapcsolva:
>
> ```js
> plugins: process.env.VITEST ? [] : [['babel-plugin-react-compiler']],
> ```
>
> A `VITEST` környezeti változót automatikusan beállítja a Vitest futtatórendszere.

### `src/test/setup.js`

```js
import '@testing-library/jest-dom';
```

Ez a fájl minden tesztfájl előtt lefut (`setupFiles`). Regisztrálja a jest-dom custom matcher-eket (pl. `toBeInTheDocument`, `toHaveClass`).

### `package.json` — test scriptjei

```json
"test":          "vitest run",
"test:watch":    "vitest",
"test:coverage": "vitest run --coverage"
```

---

## 3. Tesztek futtatása

### Egyszeri futtatás (CI / manuális ellenőrzés)

```bash
cd frontend
npx vitest run --reporter=verbose
```

### Watch mód (fejlesztés közben)

```bash
npx vitest
```

Csak a megváltozott fájlokhoz tartozó teszteket futtatja újra automatikusan.

### Egyetlen tesztfájl futtatása

```bash
npx vitest run src/test/BottomNav.test.jsx --reporter=verbose
```

### Lefedettségi riport

```bash
npx vitest run --coverage
```

### Várható eredmény (teljes tesztkészlet)

```
Test Files  5 passed (5)
     Tests  31 passed (31)
  Duration  ~15–30s
```

---

## 4. Tesztfájlok áttekintése

Az összes tesztfájl helye: `frontend/src/test/`

| Fájl | Tesztelt egység | Tesztek száma | Állapot |
|---|---|---|---|
| `authService.test.js` | `src/services/authService.js` | 5 | ✅ Zöld |
| `AppLayout.test.jsx` | `src/components/AppLayout.jsx` | 4 | ✅ Zöld |
| `RouteGuards.test.jsx` | `AdminRoute`, `ModeratorRoute`, `PublicRoute` | 8 | ✅ Zöld |
| `BottomNav.test.jsx` | `src/components/BottomNav.jsx` | 10 | ✅ Zöld |
| `ProtectedRoute.test.jsx` | `src/components/ProtectedRoute.jsx` | 4 | ✅ Zöld |

**Összesen: 31 teszt, 5 fájl**

---

## 5. Tesztesetek részletes leírása

### 5.1 `authService.test.js`

Az `authService.js` utility függvényeit teszteli. Nem igényel React renderelést — tisztán JavaScript logika.

#### `getStoredUserInfo`

| Teszteset | Leírás |
|---|---|
| null ha nincs tárolt user | `localStorage` üres → `null` visszatérési értéket ad |
| visszaadja a tárolt usert | Érvényes JSON-t olvas vissza `localStorage`-ból |
| null sérült JSON esetén | Érvénytelen JSON → `null` (nem dob hibát) |

#### `isAuthenticated`

| Teszteset | Leírás |
|---|---|
| false ha nincs token | Nincs `auth_token` a `localStorage`-ban |
| true ha van token | Van `auth_token` → `true` |

---

### 5.2 `AppLayout.test.jsx`

Az alkalmazás shell komponensét teszteli. A `Sidebar`, `BottomNav` és `Outlet` komponensek mockolva vannak, hogy az `AppLayout` önállóan tesztelhető legyen.

| Teszteset | Elvárt viselkedés |
|---|---|
| Rendereli a Sidebar-t | A `<Sidebar>` mock megjelenik a DOM-ban |
| Rendereli a BottomNav-ot | A `<BottomNav>` mock megjelenik a DOM-ban |
| Rendereli az Outlet-et | Az `<Outlet>` (oldaltartalom) megjelenik |
| app-shell CSS osztály | A gyökér div tartalmazza az `app-shell` CSS osztályt |

---

### 5.3 `RouteGuards.test.jsx`

Az útvonalvédő komponenseket teszteli. Minden teszt a `useAuth` hook-ot mockból tölti be.

#### `AdminRoute`

| Teszteset | Elvárt viselkedés |
|---|---|
| Admin látja a tartalmat | `isAdmin: true` → gyermek komponens renderelve |
| Sima user átirányul | `isAdmin: false` → `/dashboard`-ra irányít |
| Betöltés közben null | `loading: true` → semmi sem renderelve |

#### `ModeratorRoute`

| Teszteset | Elvárt viselkedés |
|---|---|
| Moderátor látja a tartalmat | `isModerator: true` → gyermek renderelve |
| Sima user átirányul | `isModerator: false` → átirányítás |

#### `PublicRoute`

| Teszteset | Elvárt viselkedés |
|---|---|
| Kijelentkezve látja a tartalmat | `user: null` → login form látható |
| Bejelentkezett átirányul | `user: {...}` → `/dashboard`-ra irányít |
| Betöltés közben optimisztikus | `loading: true, user: null` → tartalom látható (nem irányít el) |

---

### 5.4 `BottomNav.test.jsx`

A mobilos navigációs sáv viselkedését teszteli. Szerepköralapú renderelést ellenőriz.

#### Sima felhasználó

| Teszteset | Elvárt viselkedés |
|---|---|
| 5 link jelenik meg | `getAllByRole('link')` hossza 5 |
| Helyes elemek | Főoldal / Csoportok / Listák / Kuponok / Profil felirat megjelenik |
| Helyes útvonalak | `/dashboard`, `/groups`, `/shopping`, `/kupon`, `/user` href-ek |
| Nincs admin stílus | `nav.className` nem tartalmaz `bottom-nav--admin`-t |

#### Admin felhasználó (`isAdmin: true`)

| Teszteset | Elvárt viselkedés |
|---|---|
| Admin elemek megjelennek | „Admin" és „Statisztika" felirat látható |
| Admin CSS osztály | `nav` tartalmazza a `bottom-nav--admin` osztályt |
| Admin link útvonal | `/admin` href megtalálható |
| Profil link adminnak is | Profil mindig az utolsó elem |

#### Moderátor felhasználó (`isModerator: true`)

| Teszteset | Elvárt viselkedés |
|---|---|
| Moderátor kupon link | Kupon-moderátor elem megjelenik |
| Pontosan 5 elem | Maximum 5 link látható (cap at 5) |

---

### 5.5 `ProtectedRoute.test.jsx`

A bejelentkezés-védett útvonal logikáját teszteli. A `useAuth` hook mockolva van.

| Teszteset | Elvárt viselkedés |
|---|---|
| Bejelentkezett user látja a tartalmat | `user: {...}, loading: false` → gyermek renderelve |
| Nem bejelentkezett átirányul | `user: null, loading: false` → tartalom nem látható (→ `/login`) |
| Spinner betöltés közben (nincs cached user) | `user: null, loading: true` → tartalom nem látható |
| Cached user betöltés közben | `user: {...}, loading: true` → tartalom azonnal látható (optimisztikus) |

---

## 6. Mock stratégia

### `useAuth` hook mockolása

Minden tesztfájlban, amely React komponenst renderel:

```js
vi.mock('../context/useAuth.js', () => ({
  default: vi.fn(),
}));

import useAuth from '../context/useAuth.js';

beforeEach(() => {
  vi.clearAllMocks();
});

// Majd a teszten belül:
useAuth.mockReturnValue({ user: { id: 1 }, loading: false, isAdmin: false });
```

**Miért ez a megközelítés?**  
Az `AuthContext` az alkalmazás gyökerén van, és az `api.js`-re, Axios-ra és localStorage-ra támaszkodik. Tesztben ezeket nem akarjuk valósan meghívni. A `vi.mock` modul szinten helyettesíti az egész importot, így a tesztelt komponens valódi hálózati kérés nélkül fut.

### CSS fájlok mockolása

A Vitest konfigurációban `css: false` van beállítva, ami elutasítja a CSS importokat. Ahol ez nem elegendő (pl. explicit named import), külön mock szükséges:

```js
vi.mock('../components/BottomNav.css', () => ({}));
```

### `MemoryRouter` wrapper

Minden route-érzékeny komponens `MemoryRouter`-ben fut, hogy a `useNavigate`, `useLocation`, `NavLink` hookok ne dobjanak hibát:

```js
const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);
```

---

## 7. Ismert problémák és megoldások

### OOM crash — Node 22 + Vitest 4 + jsdom

**Tünet:** A Vitest worker process `JavaScript heap out of memory` hibával crashel, jellemzően 250–370 másodperc elteltével. A többi tesztfájl sikeres, csak a `ProtectedRoute.test.jsx` érintett.

**Gyökérok:**  
Node.js 22 alapértelmezett heap limitje ~4 GB. A jsdom + react-router-dom v7 + teljes modul graph betöltése során a `babel-plugin-react-compiler` Babel-transzformáció korlátlan memóriát fogyaszt el a Vitest transform worker forkban.

**Megoldás (vite.config.js):**

```js
plugins: [
  react({
    babel: {
      // Tesztelés közben ki van kapcsolva — OOM prevenciója
      plugins: process.env.VITEST ? [] : [['babel-plugin-react-compiler']],
    },
  }),
],

test: {
  pool: 'forks',
  forks: {
    execArgv: ['--max-old-space-size=8192'],  // 8 GB heap limit
  },
},
```

**Hatás a production build-re:** Nulla — a `babel-plugin-react-compiler` a `vite build` parancs során teljes mértékben aktív marad, a `VITEST` változó ilyenkor nincs beállítva.

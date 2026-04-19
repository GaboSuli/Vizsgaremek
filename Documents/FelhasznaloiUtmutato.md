# Szaldon – Felhasználói Útmutató

> **Verzió:** 1.0  
> **Utolsó frissítés:** 2026. április  
> **Célközönség:** Végfelhasználók – az alkalmazás mindennapi használatához  
> **Elérhetőség:** `http://localhost:5173` (helyi futtatás esetén)

---

## Tartalomjegyzék

1. [Az alkalmazásról](#1-az-alkalmazásról)
2. [Rendszerkövetelmények](#2-rendszerkövetelmények)
3. [Regisztráció és bejelentkezés](#3-regisztráció-és-bejelentkezés)
4. [Az alkalmazás felülete](#4-az-alkalmazás-felülete)
5. [Irányítópult](#5-irányítópult)
6. [Csoportok kezelése](#6-csoportok-kezelése)
7. [Bevásárló listák](#7-bevásárló-listák)
8. [Statisztikák](#8-statisztikák)
9. [Kuponok](#9-kuponok)
10. [Profil és beállítások](#10-profil-és-beállítások)
11. [Adminisztrátori felület](#11-adminisztrátori-felület)
12. [Moderátori funkciók](#12-moderátori-funkciók)
13. [Sötét és világos mód](#13-sötét-és-világos-mód)
14. [Hibaelhárítás](#14-hibaelhárítás)
15. [Gyakori kérdések (GYIK)](#15-gyakori-kérdések-gyik)
16. [Változásnapló](#16-változásnapló)

---

## 1. Az alkalmazásról

A **Szaldon** egy modern, webalapú pénzügyi nyomkövető és kiadáskezelő alkalmazás. Célja, hogy segítsen felismerni és tudatosan kezelni a mindennapi pénzköltési szokásokat – legyen szó egyéni vagy csoportos kiadások követéséről.

### Mit tud az alkalmazás?

| Funkció | Leírás |
|---|---|
| **Irányítópult** | Valós idejű áttekintés a havi és éves kiadásokról |
| **Csoportok** | Közös kiadások kezelése több felhasználóval |
| **Bevásárló listák** | Egyéni és csoportos bevásárló listák kezelése |
| **Statisztikák** | Interaktív grafikonok és kategória szerinti kimutatások |
| **Kuponok** | Elérhető kedvezményes kuponok böngészése |
| **Profil** | Személyes adatok és megjelenési beállítások kezelése |

### Az alkalmazás célja

Sok ember nem tud bánni a pénzével, és nem ismeri fel, mennyit és mire költ valójában. A Szaldon segít:

- **Átlátni** a kiadásokat kategóriák és időszakok szerint
- **Azonosítani** a felesleges vagy csökkenthető kiadásokat
- **Tudatosabbá** válni a pénzügyekben egyéni és csoportos szinten egyaránt

---

## 2. Rendszerkövetelmények

A Szaldon egy webalapú alkalmazás – **nem igényel telepítést**. Egyetlen feltétel egy modern böngésző és egy aktív internetkapcsolat (vagy helyi szerver futtatása).

### Böngésző kompatibilitás

| Böngésző | Minimum verzió | Ajánlott |
|---|---|---|
| Google Chrome | 90+ | 120+ |
| Mozilla Firefox | 88+ | 120+ |
| Microsoft Edge | 90+ | 120+ |
| Safari | 14+ | 17+ |
| Opera | 76+ | 105+ |

### Egyéb követelmények

- **JavaScript:** engedélyezve kell legyen a böngészőben
- **Sütik (cookies):** engedélyezve kell legyen a munkamenet fenntartásához
- **Internetkapcsolat:** minimum 1 Mbps (ajánlott: 5+ Mbps)
- **Képernyőfelbontás:** minimum 360×640 px (mobilon), ajánlott 1280×800 px (asztali gépen)

> **Tipp:** Az alkalmazás teljes mértékben reszponzív – telefonon és tableten is kényelmesen használható.

---

## 3. Regisztráció és bejelentkezés

### 3.1 Regisztráció

Ha még nincs fiókod, az alábbi lépéseket kövesd:

1. Nyisd meg az alkalmazást a böngészőben (`http://localhost:5173`)
2. Kattints a főoldalon a **„Regisztráció"** gombra
3. Töltsd ki az alábbi mezőket:
   - **Teljes név** – a profilodon megjelenő neved
   - **E-mail cím** – bejelentkezéshez szükséges, egyedi cím
   - **Jelszó** – legalább 8 karakter, kis- és nagybetűk, számok ajánlottak
   - **Jelszó megerősítése** – ugyanaz a jelszó ismét
4. Kattints a **„Fiók létrehozása"** gombra
5. Sikeres regisztráció után automatikusan bejelentkezel, és az irányítópulton landolsz

#### Jelszóra vonatkozó szabályok

- Legalább **8 karakter** hosszú legyen
- A két jelszónak **pontosan egyeznie** kell
- Ajánlott: kis- és nagybetű, szám és speciális karakter kombinálása

> ⚠️ **Figyelem:** Az e-mail cím és a jelszó kombinációját jegyezd meg! Ha elfelejtesz belépni, lépj kapcsolatba az adminisztrátorral.

---

### 3.2 Bejelentkezés

Ha már van regisztrált fiókod:

1. Kattints a **„Bejelentkezés"** gombra a főoldalon
2. Add meg az **e-mail címedet** és a **jelszavadat**
3. Opcionálisan: kattints a jelszómező melletti szem ikonra a beírt jelszó megjelenítéséhez
4. Kattints a **„Bejelentkezés"** gombra

Az alkalmazás **30 napig** fenntartja a munkamenetet, így nem szükséges minden alkalommal újra belépni.

---

### 3.3 Kijelentkezés

A kijelentkezéshez kattints a jobb felső sarokban lévő felhasználói ikonra vagy avatárra, majd válaszd a **„Kijelentkezés"** opciót. A munkamenet azonnal megszűnik.

---

## 4. Az alkalmazás felülete

### 4.1 Oldalsó navigáció (Sidebar)

Bejelentkezés után az alkalmazás bal oldalán egy **oldalsó navigációs sáv** jelenik meg, amelyen az összes főbb funkció elérhető. A navigáció az alábbi elemeket tartalmazza:

| Ikon | Menüpont | Leírás |
|---|---|---|
| 🏠 | **Irányítópult** | Főoldal – kiadások áttekintése |
| 👥 | **Csoportok** | Csoportok létrehozása és kezelése |
| 📊 | **Statisztikák** | Grafikonok és kimutatások |
| 🛒 | **Bevásárló listák** | Listák kezelése |
| 🎟️ | **Kuponok** | Elérhető kuponok |
| 👤 | **Profil** | Személyes adatok |
| ✉️ | **Kapcsolat** | Üzenet küldése |
| 🔧 | **Admin** | *(csak adminisztrátoroknak)* |
| 🎫 | **Kupon kezelés** | *(csak moderátoroknak)* |

A sidebar összecsukható: a tetején lévő nyíl ikonra kattintva minimalizálható, így több hely jut a tartalomnak.

---

### 4.2 Felső navigációs sáv

Az oldal tetején egy vékony sáv tartalmazza:

- **Szaldon logó** – kattintásra visszavisz az irányítópultra
- **Témaváltó ikon** (hold/nap) – sötét és világos mód közötti váltás
- **Értesítési ikon** – rendszerüzenetek
- **Felhasználói avatar** – profil és kijelentkezés

---

### 4.3 Mobilnézet

Mobilon (768px képernyőszélesség alatt) az oldalsó navigáció eltűnik, és helyette egy **hamburger menü** jelenik meg a bal felső sarokban. Erre kattintva a navigáció kinyílik egy fedett panel formájában. A panel bezárható a jobb felső sarokban lévő X gombbal, vagy a panelen kívülre kattintással.

---

## 5. Irányítópult

Az irányítópult az alkalmazás **központi oldala**, amelyre bejelentkezés után automatikusan kerülsz. Innen gyors áttekintést kaphatsz a pénzügyi helyzetedről.

### 5.1 Statisztika kártyák

Az oldal tetején **4 összesítő kártya** jelenik meg:

| Kártya | Tartalom |
|---|---|
| **Havi kiadások** | Az aktuális hónap összes rögzített kiadása |
| **Éves kiadások** | Az aktuális év összes kiadása |
| **Csoportjaim** | Hány csoportban vagy tag |
| **Bevásárló listáim** | Az aktív bevásárló listák száma |

---

### 5.2 Üdvözlő üzenet

Az irányítópult tetején megjelenik egy **személyre szabott üdvözlő üzenet** (Jó reggelt / Jó napot / Jó estét), amelyet a bejelentkezett felhasználó neve követ.

---

### 5.3 Kategória összesítő

A statisztika kártyák alatt megjelenik a kiadások **kategóriák szerinti bontása** – egy gyors vizuális áttekintés arról, mire megy el a legtöbb pénz.

> **Megjegyzés:** Ha még nincs rögzített kiadásod, az irányítópult üresnek látszik. Ez teljesen normális – add hozzá az első tételeket egy bevásárló listához!

---

## 6. Csoportok kezelése

A csoportok funkcióval **több felhasználóval közösen** követheted a kiadásokat. Ideális megosztott háztartáshoz, baráti társasághoz vagy munkatársakhoz.

### 6.1 Csoportok listája

A **Csoportok** menüpontra kattintva megjelenik az összes csoport, amelynek tagja vagy. Minden csoport kártyán látható:

- A csoport neve és típusa
- A tagok száma
- Az utolsó aktivitás ideje

---

### 6.2 Új csoport létrehozása

1. Kattints a **Csoportok** menüpontra
2. Kattints az **„Új csoport"** gombra (jobb felső sarokban)
3. Töltsd ki a szükséges adatokat:
   - **Csoport neve** – egyedi, felismerhető elnevezés
   - **Csoport típusa** – pl. Háztartás, Barátok, Munkahely, Egyesület
4. Kattints a **„Létrehozás"** gombra
5. A csoport azonnal megjelenik a listában

---

### 6.3 Tagok meghívása

1. Nyisd meg a kívánt csoportot a listából kattintással
2. A csoport részlet oldalán kattints a **„Tag meghívása"** gombra
3. Add meg a meghívandó felhasználó **e-mail címét** (regisztrált felhasználónak kell lennie)
4. Kattints a **„Meghívás küldése"** gombra

> **Fontos:** Csak olyan felhasználókat hívhatsz meg, akiknek már van regisztrált Szaldon fiókjuk.

---

### 6.4 Csoport részletek

A csoportra kattintva megnyílik a **csoport részlet oldala**, ahol az alábbiakat láthatod és kezelheted:

- **Tagok listája** – ki a tagja a csoportnak és milyen szerepkörrel
- **Bevásárló listák** – a csoporthoz tartozó listák
- **Kiadások összesítője** – a csoport közös kiadásai
- **Beállítások** – csoport nevének szerkesztése, csoport törlése

---

### 6.5 Csoport törlése

> ⚠️ **Figyelmeztetés:** A csoport törlése **végleges és visszavonhatatlan**! Törlés esetén a csoport összes adata, bevásárló listája és tagkapcsolata megszűnik.

A törléshez kattints a csoport beállításaiban a **„Csoport törlése"** gombra, majd erősítsd meg a törlési szándékot a megjelenő megerősítő ablakban.

---

## 7. Bevásárló listák

A bevásárló listák segítségével nyomon követheted, mire van szükséged és mennyit költöttél. Létrehozhatsz **személyes** és **csoportos** listákat egyaránt.

### 7.1 Listák megtekintése

A **„Bevásárló listák"** menüpontra kattintva megjelennek az összes saját és csoportos listáid. A listákat szűrheted:

- **Saját listák** – csak a te személyes listáid
- **Csoportos listák** – csoportokhoz rendelt, megosztott listák

---

### 7.2 Új lista létrehozása

1. Kattints a **„Bevásárló listák"** menüpontra
2. Kattints az **„Új lista"** gombra
3. Add meg a lista nevét
4. Opcionálisan rendeld egy csoporthoz (ha csoportos lista szeretnél)
5. Kattints a **„Létrehozás"** gombra

---

### 7.3 Tételek kezelése

A lista megnyitása után az alábbi műveleteket végezheted:

| Művelet | Hogyan? |
|---|---|
| **Tétel hozzáadása** | Írd be a tétel nevét és összegét a lista alján lévő mezőkbe, majd kattints a + gombra |
| **Tétel megjelölése vásároltként** | Kattints a tétel melletti jelölőnégyzetre (checkbox) |
| **Tétel szerkesztése** | Kattints a ceruza (✏️) ikonra |
| **Tétel törlése** | Kattints a kuka (🗑️) ikonra, majd erősítsd meg |
| **Lista archiválása** | A lista beállításainál elérhető archivált állapot |

---

### 7.4 Csoportos listák

Ha egy listát egy csoporthoz rendelsz, a csoport **összes tagja** látja és szerkesztheti azt. A módosítások valós időben szinkronizálódnak.

> 💡 **Tipp:** Csoportos bevásárlás esetén jelöljétek a megvett tételeket – így mindenki látja, mi van már megvéve!

---

## 8. Statisztikák

A statisztikák oldalon részletes elemzést kaphatsz a kiadásaidról. Az adatok **interaktív grafikonok** formájában jelennek meg.

### 8.1 Az oldal elérése

Kattints a bal oldali navigációban a **„Statisztikák"** menüpontra.

---

### 8.2 Elérhető nézetek

#### Havi összesítő

Kördiagram (doughnut chart) formájában mutatja az aktuális hónap kiadásait **kategóriák szerint lebontva**. Egyetlen pillantással látható, melyik kategória viszi el a legtöbb pénzt.

#### Éves áttekintés

Oszlopdiagram formájában mutatja az **egyes hónapok kiadásait** az elmúlt 12 hónapra visszamenőleg. Segít azonosítani a kiadások szezonális mintázatait.

#### Alkategória bontás

Részletes lebontás **alkategóriák szerint** – megmutatja, melyik al-kategória a legköltségesebb.

---

### 8.3 Szűrési lehetőségek

- **Időszak választás** – hónap, negyedév, teljes évi nézet
- **Kategória szűrő** – csak egy adott kategória adatainak megjelenítése
- **Csoport szűrő** – csak egy adott csoport kiadásainak megtekintése

---

### 8.4 Adatok forrása

A statisztikák a bevásárló listákhoz rögzített összegekből számolódnak. Minél több adatot rögzítesz, annál pontosabb képet kapsz.

> **Megjegyzés:** Ha még nincsenek rögzített kiadásaid, a statisztika oldal üres diagramokat mutat. Kezdj el tételeket hozzáadni a bevásárló listáidhoz!

---

## 9. Kuponok

A kuponok szekcióban böngészheted az elérhető **kedvezményes kuponokat**.

### 9.1 Kuponok megtekintése

1. Kattints a navigációban a **„Kuponok"** menüpontra
2. Megjelenik az összes aktív kupon listája
3. Minden kuponon látható:
   - A kupon neve és leírása
   - A kedvezmény mértéke
   - Az érvényesség dátuma
   - A feltételek

---

### 9.2 Kuponok szűrése

A kuponok listája szűrhető:

- **Kategória szerint** – csak egy adott termékkategória kuponjait mutatja
- **Érvényesség szerint** – csak az aktív (még le nem járt) kuponokat mutatja

---

### 9.3 Kupon lejárata

> ⚠️ **Fontos:** A kuponoknak lejárati ideje van! Lejárt kuponokat nem lehet felhasználni. Érdemes időben igénybe venni az aktív kuponokat.

---

## 10. Profil és beállítások

A profil oldalon módosíthatod a személyes adataidat és az alkalmazás megjelenési beállításait.

### 10.1 A profil oldal megnyitása

Kattints a bal oldali navigáció alján lévő **felhasználói névedre** vagy avatárodra, vagy válaszd a **„Profil"** menüpontot.

---

### 10.2 Szerkeszthető adatok

| Mező | Leírás |
|---|---|
| **Teljes név** | A profilodon és az üdvözlő üzenetben megjelenő neved |
| **E-mail cím** | Bejelentkezéshez és értesítésekhez használt cím |
| **Jelszó módosítása** | Új jelszó beállítása (a jelenlegi jelszó megadása szükséges) |
| **Profilkép** | Avatar kép feltöltése vagy módosítása |

---

### 10.3 Adatok mentése

Az adatok módosítása után kattints a **„Mentés"** gombra. A változtatások azonnal érvénybe lépnek.

---

## 11. Adminisztrátori felület

> ⚠️ **Ez a szekció csak adminisztrátor jogosultságú felhasználóknak vonatkozik.** Ha nem rendelkezel admin joggal, az admin menüpont nem jelenik meg a navigációban.

### 11.1 Az admin felület elérése

Kattints a bal oldali navigációban az **„Admin"** menüpontra. Ez csak admin szerepkörű felhasználóknak látható.

---

### 11.2 Felhasználók kezelése

Az admin felületen megtekintheted az összes regisztrált felhasználót:

- **Felhasználói lista** – az összes fiók neve, e-mailje, szerepköre és regisztrációs dátuma
- **Szerepkör módosítása** – felhasználói jogosultság megváltoztatása (felhasználó / moderátor / admin)
- **Fiók törlése** – felhasználói fiók végleges törlése

---

### 11.3 Csoportok felügyelete

- Az összes csoport megtekintése a rendszerben
- Problémás csoportok kezelése
- Tagok eltávolítása csoportokból

---

### 11.4 Rendszer statisztikák

- Aktív felhasználók száma
- Összes rögzített kiadás összesítése
- Legaktívabb csoportok

---

### 11.5 Kapcsolati üzenetek

A **Kapcsolat** oldalon beküldött üzenetek az admin felületen tekinthetők meg és kezelhetők.

> 🚨 **Figyelmeztetés:** Az admin felületen végzett műveletek visszavonhatatlan változásokat okozhatnak. Törlés előtt mindig ellenőrizd kétszer, hogy a megfelelő elemet jelölted ki!

---

## 12. Moderátori funkciók

> ℹ️ **Ez a szekció csak moderátor vagy admin szerepkörű felhasználóknak vonatkozik.**

A moderátorok fő feladata a **kuponok kezelése**.

### 12.1 Kupon moderátor oldal megnyitása

Kattints a navigációban a **„Kupon kezelés"** menüpontra (csak moderátoroknak és adminoknak látható).

---

### 12.2 Új kupon hozzáadása

1. Kattints az **„Új kupon hozzáadása"** gombra
2. Töltsd ki az adatokat:
   - **Kupon neve** – egyedi, felismerhető elnevezés
   - **Leírás** – a kupon feltételei és részletei
   - **Kedvezmény mértéke** – pl. 20%, 500 Ft kedvezmény
   - **Érvényesség dátuma** – meddig felhasználható a kupon
   - **Kategória** – melyik termékkategóriára vonatkozik
3. Kattints a **„Mentés"** gombra

---

### 12.3 Meglévő kupon szerkesztése

1. A kuponok listájában kattints a szerkeszteni kívánt kuponnál a ceruza (✏️) ikonra
2. Módosítsd a szükséges adatokat
3. Kattints a **„Mentés"** gombra

---

### 12.4 Kupon törlése

1. Kattints a törölni kívánt kuponnál a kuka (🗑️) ikonra
2. Erősítsd meg a törlési szándékot a megerősítő ablakban

> ⚠️ A kupon törlése végleges – a törölt kupont a felhasználók többé nem látják.

---

## 13. Sötét és világos mód

Az alkalmazás támogatja a **sötét (dark)** és **világos (light)** módot egyaránt.

### Váltás módok között

Kattints a felső navigációs sávban lévő **Hold (🌙) / Nap (☀️) ikonra**. A téma azonnal vált, és a beállítás automatikusan mentődik a böngésződbe.

| Mód | Mikor érdemes? |
|---|---|
| **Világos mód** | Napközben, erős megvilágítás mellett |
| **Sötét mód** | Éjjel vagy gyenge megvilágítás esetén – csökkenti a szemterhelést és OLED kijelzőkön akkumulátort kímél |

---

## 14. Hibaelhárítás

### 14.1 Bejelentkezési problémák

| Probléma | Lehetséges ok | Megoldás |
|---|---|---|
| „Hibás e-mail vagy jelszó" | Helytelen bejelentkezési adatok | Ellenőrizd az e-mail és jelszó kombinációt. A jelszó kis/nagybetű-érzékeny! |
| „A fiók nem található" | Nem létező e-mail cím | Ellenőrizd, hogy jó e-mail-t adtál meg, vagy regisztrálj új fiókot |
| „Lejárt munkamenet" | Token lejárt | Jelentkezz be újra |
| „Hozzáférés megtagadva" | Nincs megfelelő jogosultság | Ellenőrizd a szerepkörödet |

> 💡 **Tipp:** Ha nem tudsz bejelentkezni, próbáld inkognito/privát böngészőablakban. Ez kizárja, hogy egy régi, lejárt süti okozza a problémát.

---

### 14.2 Az alkalmazás nem töltődik be (ERR_CONNECTION_REFUSED)

Ez a hiba azt jelenti, hogy a **backend szerver nem fut**. Az alkalmazás használatához mindkét szervert el kell indítani.

#### Backend indítása

```powershell
# Navigálj a Backend mappába:
cd C:\...\Vizsgaremek\Backend

# Indítsd el a Laravel szervert:
php artisan serve

# Sikeres indítás esetén ezt látod:
# INFO  Server running on [http://localhost:8000].
```

#### Frontend indítása (új terminálban)

```powershell
# Navigálj a Frontend mappába:
cd C:\...\Vizsgaremek\frontend

# Indítsd el a Vite fejlesztői szervert:
npm run dev

# Sikeres indítás esetén ezt látod:
# VITE ready in 450 ms
# ➜  Local:   http://localhost:5173/
```

> ⚠️ **Mindkét szerver futása szükséges!** Ne zárd be egyik terminálablakot sem.

---

### 14.3 Egyéb gyakori problémák

| Tünet | Megoldás |
|---|---|
| Az oldal nem töltődik be | Nyomj `F5`-öt (oldalfrissítés) |
| Adatok nem jelennek meg | Ellenőrizd az internetkapcsolatot, majd frissíts |
| Fehér képernyő | Nyisd meg a fejlesztői konzolt (`F12`) és keresd a hibaüzenetet |
| Lassú betöltés | Ellenőrizd az internetkapcsolatot |
| Nem mentődnek el az adatok | Ellenőrizd, hogy be vagy-e jelentkezve |
| CORS hiba | A backend `.env` fájlban ellenőrizd az `APP_URL` beállítást |

---

### 14.4 Süti-kezelés problémák

Az alkalmazás sütiket (cookies) használ a munkamenet fenntartásához. Ha a sütikezelő rendszer zavarokat okoz:

1. Töröld a böngésző sütiit az adott oldalra: **Beállítások → Adatvédelem → Sütik törlése**
2. Töltsd újra az oldalt
3. Fogadd el a szükséges sütiket az újra megjelenő bannerben

---

## 15. Gyakori kérdések (GYIK)

**Ingyenes az alkalmazás?**  
Igen, a Szaldon jelenleg teljesen ingyenes. Nincs prémium csomag vagy rejtett díj.

---

**Hány csoportot hozhatok létre?**  
Jelenleg nincs korlát a csoportok számára – annyit hozhatsz létre, amennyire szükséged van.

---

**Biztonságban vannak az adataim?**  
Az összes adat titkosítva van tárolva. A jelszavak bcrypt hash-sel védve vannak – soha nem tároljuk azokat szövegesen. Az alkalmazás Laravel Sanctum alapú tokenautentikációt használ.

---

**Exportálhatom az adataimat?**  
Az adatexportálás funkció jelenleg fejlesztés alatt áll, és egy jövőbeli frissítésben lesz elérhető.

---

**Törölhetem a fiókomat?**  
Fiók törléséhez lépj kapcsolatba az adminisztrátorral a Kapcsolat oldalon. A törlés végleges – minden adat elvész.

---

**Milyen kategóriák érhetők el?**  
Az alkalmazás előre definiált főkategóriákat és alkategóriákat tartalmaz (pl. Élelmiszer, Közlekedés, Szórakozás, Egészség stb.). Az adminisztrátorok új kategóriákat adhatnak hozzá.

---

**Miért nem jelenik meg a statisztika?**  
A statisztikák csak akkor jelennek meg, ha legalább egy rögzített kiadás van. Ha még nincs tételed, az irányítópult és a statisztika oldal üresnek látszik.

---

**Hány tag lehet egy csoportban?**  
Jelenleg nincs korlát a csoporttagok számára.

---

**Működik mobilon az alkalmazás?**  
Igen, az alkalmazás teljes mértékben reszponzív – telefonon és tableten is kényelmesen használható. Mobilon a navigáció hamburger menüvé alakul.

---

**Mit tegyek, ha elfelejtettük a jelszavamat?**  
Lépj kapcsolatba az alkalmazás adminisztrátorával a Kapcsolat oldalon a jelszó visszaállításához.

---

## 16. Változásnapló

### v1.0.0 – Első kiadás (2025)

**Új funkciók:**

- ✅ Felhasználói regisztráció és bejelentkezés (Laravel Sanctum tokenautentikáció)
- ✅ Irányítópult statisztika kártyákkal és kategória bontással
- ✅ Csoportok létrehozása, szerkesztése, törlése
- ✅ Tagok meghívása csoportokba
- ✅ Bevásárló listák kezelése (egyéni és csoportos)
- ✅ Kiadások rögzítése kategóriák és alkategóriák szerint
- ✅ Statisztikai grafikonok (Chart.js – kördiagram, oszlopdiagram, vonaldiagram)
- ✅ Kuponok böngészése és kezelése
- ✅ Adminisztrátori felület (felhasználó-, csoport- és kuponkezelés)
- ✅ Moderátori kuponkezelő oldal
- ✅ Sötét/Világos mód támogatás
- ✅ Reszponzív mobilnézet (hamburger menü, bottom navigation)
- ✅ GDPR-kompatibilis süti-kezelés és adatvédelmi nyilatkozat
- ✅ Kapcsolati űrlap e-mail küldési funkcióval
- ✅ Profilkezelés és avatárfeltöltés
- ✅ Interaktív dokumentációs oldal (`/docs`)

---

### Tervezett funkciók (jövőbeli verziók)

- 🔜 Adatexportálás CSV / PDF formátumban
- 🔜 E-mail értesítések kupon lejárathoz
- 🔜 Ismétlődő kiadások automatikus rögzítése
- 🔜 Havi büdzsé célok beállítása és nyomon követése
- 🔜 Mobilalkalmazás (React Native) – béta verzió folyamatban
- 🔜 Push értesítések mobilon
- 🔜 Megosztható statisztika riportok

---

*Szaldon – Pénzügyi Nyomkövető Alkalmazás · v1.0.0 · 2025*  
*Visszajelzés és hibák bejelentése: Kapcsolat oldal az alkalmazáson belül*

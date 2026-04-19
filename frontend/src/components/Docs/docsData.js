/**
 * Szaldon – Használati útmutató (dokumentáció adatforrás)
 * Minden tartalom ebből a fájlból épül fel dinamikusan.
 *
 * Blokk típusok:
 *   heading   – { level: 1|2|3, text, id? }
 *   paragraph – { text }  (* **bold** * *italic* * `inline-code` * [link](url) )
 *   callout   – { variant: 'info'|'warning'|'success'|'tip'|'danger', title, text }
 *   code      – { language, code }
 *   list      – { ordered?: bool, items: string[] }
 *   steps     – { steps: [{ icon, title, text }] }
 *   cards     – { cards: [{ icon, title, text, color? }] }
 *   image     – { src?, alt, caption, mock?: bool, mockIcon?, mockColor? }
 *   table     – { headers: string[], rows: string[][] }
 *   divider   – {}
 *   badges    – { items: string[] }
 */

// ─────────────────────────────────────────────────────────────────────────────
export const DOC_STRUCTURE = [

  // ══════════════════════════════════════════════════════════════════════════
  // 1. BEVEZETÉS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'bevezetes',
    title: 'Bevezetés',
    icon: '📖',
    sections: [
      {
        id: 'mi-az-alkalmazas',
        title: 'Mi az alkalmazás?',
        content: [
          { type: 'heading', level: 1, text: 'Szaldon – Pénzügyi Nyomkövető' },
          {
            type: 'paragraph',
            text: 'A **Szaldon** egy modern, webalapú pénzügyi nyomkövető és kiadáskezelő alkalmazás. Segít átlátni és tudatosan kezelni mindennapi kiadásaidat – legyen szó egyéni vagy csoportos költségekről.',
          },
          {
            type: 'image',
            alt: 'Szaldon irányítópult áttekintése',
            caption: 'A Szaldon irányítópultja – egy helyen minden fontos adat',
            mock: true,
            mockIcon: '📊',
            mockColor: '#5b5ef4',
            mockLabel: 'Irányítópult előnézet',
          },
          {
            type: 'cards',
            cards: [
              { icon: '📊', title: 'Átlátható pénzügyek', text: 'Valós idejű statisztikák és grafikonok a kiadásaidról, kategóriák szerint bontva.', color: '#5b5ef4' },
              { icon: '👥', title: 'Csoportos kezelés', text: 'Hozz létre csoportokat, hívj meg tagokat, és kövesd a közös kiadásokat.', color: '#059669' },
              { icon: '🛒', title: 'Bevásárló listák', text: 'Kezeld egyéni és csoportos bevásárló listáidat, jelöld meg a teljesített tételeket.', color: '#d97706' },
              { icon: '🎟️', title: 'Kuponok', text: 'Böngéssz elérhető kuponok között, és alkalmazd őket a vásárlásaidhoz.', color: '#7c3aed' },
            ],
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Az alkalmazás célja',
            text: 'A Szaldon segít felismerni a pénzköltési szokásaidat, azonosítani a felesleges kiadásokat, és tudatosabban gazdálkodni a jövedelemddel.',
          },
        ],
      },
      {
        id: 'rendszerkovelmeny',
        title: 'Rendszerkövetelmények',
        content: [
          { type: 'heading', level: 2, text: 'Rendszerkövetelmények' },
          {
            type: 'paragraph',
            text: 'A Szaldon egy webalapú alkalmazás – nem igényel telepítést. Egyetlen feltétel egy modern böngésző és internetkapcsolat.',
          },
          {
            type: 'table',
            headers: ['Követelmény', 'Minimum', 'Ajánlott'],
            rows: [
              ['Böngésző', 'Chrome 90+, Firefox 88+, Edge 90+', 'Chrome 120+, Firefox 120+'],
              ['Internetkapcsolat', '1 Mbps', '5+ Mbps'],
              ['Képernyőfelbontás', '360×640 (mobilon)', '1280×800 (asztali)'],
              ['JavaScript', 'Engedélyezve', 'Engedélyezve'],
              ['Sütik (cookies)', 'Engedélyezve', 'Engedélyezve'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Mobilbarát',
            text: 'Az alkalmazás teljes mértékben reszponzív – telefonon és tableten is kényelmesen használható.',
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 2. ELSŐ LÉPÉSEK
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'elso-lepesek',
    title: 'Első lépések',
    icon: '🚀',
    sections: [
      {
        id: 'regisztracio',
        title: 'Regisztráció',
        content: [
          { type: 'heading', level: 2, text: 'Regisztráció' },
          {
            type: 'paragraph',
            text: 'A Szaldon használatához először létre kell hoznod egy fiókot. A regisztráció ingyenes és néhány másodpercet vesz igénybe.',
          },
          {
            type: 'steps',
            steps: [
              { icon: '🌐', title: 'Nyisd meg az alkalmazást', text: 'Látogass el a Szaldon oldalára, és kattints a **Regisztráció** gombra a főoldalon.' },
              { icon: '✏️', title: 'Töltsd ki az adataidat', text: 'Add meg a **nevedet**, **e-mail címedet**, és hozz létre egy **jelszót** (minimum 8 karakter).' },
              { icon: '🔒', title: 'Erősítsd meg a jelszót', text: 'Írd be a jelszavad ismét a megerősítés mezőbe. A két jelszónak egyeznie kell.' },
              { icon: '✅', title: 'Regisztrálj', text: 'Kattints a **Fiók létrehozása** gombra. Sikereset regisztráció után automatikusan bejelentkezel.' },
            ],
          },
          {
            type: 'image',
            alt: 'Regisztrációs űrlap',
            caption: 'A regisztrációs oldal',
            mock: true,
            mockIcon: '📝',
            mockColor: '#059669',
            mockLabel: 'Regisztrációs oldal',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Jelszó követelmények',
            text: 'A jelszónak legalább **8 karakternek** kell lennie. Ajánlott kis- és nagybetűk, számok és speciális karakterek kombinálása a biztonság érdekében.',
          },
        ],
      },
      {
        id: 'bejelentkezes',
        title: 'Bejelentkezés',
        content: [
          { type: 'heading', level: 2, text: 'Bejelentkezés' },
          {
            type: 'paragraph',
            text: 'Ha már van fiókod, a bejelentkezés egyszerű. Az alkalmazás **30 napig** emlékszik az aktív munkamenetre, így nem kell minden alkalommal újra belépned.',
          },
          {
            type: 'steps',
            steps: [
              { icon: '📧', title: 'E-mail cím', text: 'Add meg a regisztrációkor megadott e-mail címedet.' },
              { icon: '🔑', title: 'Jelszó', text: 'Írd be a jelszavadat. A **Jelszó megjelenítése** ikon segítségével ellenőrizheted a beírt jelszót.' },
              { icon: '➡️', title: 'Bejelentkezés', text: 'Kattints a **Bejelentkezés** gombra, és máris az irányítópulton leszel.' },
            ],
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Elfelejtett jelszó',
            text: 'Ha elfelejtetted a jelszavadat, lépj kapcsolatba az alkalmazás adminisztrátorával a jelszó visszaállításához.',
          },
        ],
      },
      {
        id: 'elso-inditas',
        title: 'Első indítás',
        content: [
          { type: 'heading', level: 2, text: 'Az alkalmazás első megnyitásakor' },
          {
            type: 'paragraph',
            text: 'Bejelentkezés után az **irányítópulton** találod magad. Első indításkor az irányítópult üresnek tűnhet – ez teljesen normális, mivel még nincs rögzített kiadásod.',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Hol kezdjem?',
            text: 'Ajánlott sorrend: **1.** Hozz létre egy csoportot (vagy csatlakozz eghez). **2.** Adj hozzá bevásárló listát. **3.** Rögzítsd az első kiadásaidat. **4.** Nézd meg a statisztikákat!',
          },
          {
            type: 'image',
            alt: 'Üres irányítópult',
            caption: 'Az irányítópult első megnyitáskor',
            mock: true,
            mockIcon: '🏠',
            mockColor: '#5b5ef4',
            mockLabel: 'Irányítópult (üres állapot)',
          },
          {
            type: 'callout',
            variant: 'success',
            title: 'Süti-kezelés',
            text: 'Az alkalmazás sütiket használ a munkamenet fenntartásához. Az első látogatáskor egy sütijogi tájékoztató jelenik meg – el kell fogadnod a szükséges sütiket a teljes funkcionalitás eléréséhez.',
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 3. FŐ FUNKCIÓK
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fo-funkciok',
    title: 'Fő funkciók',
    icon: '⚙️',
    sections: [
      {
        id: 'iranytopult',
        title: 'Irányítópult',
        content: [
          { type: 'heading', level: 2, text: 'Irányítópult (Dashboard)' },
          {
            type: 'paragraph',
            text: 'Az irányítópult az alkalmazás központja. Innen gyorsan áttekintheted a legfontosabb pénzügyi adataidat: havi kiadásaidat, éves összesítődet, és a legutóbbi tevékenységeidet.',
          },
          {
            type: 'image',
            alt: 'Irányítópult részletei',
            caption: 'Az irányítópult főbb elemei',
            mock: true,
            mockIcon: '📊',
            mockColor: '#5b5ef4',
            mockLabel: 'Dashboard nézet',
          },
          { type: 'heading', level: 3, text: 'Statisztika kártyák' },
          {
            type: 'paragraph',
            text: 'Az irányítópult tetején **statisztika kártyák** jelennek meg, amelyek az alábbi adatokat mutatják:',
          },
          {
            type: 'list',
            items: [
              '**Havi kiadások** – az aktuális hónap összes kiadása',
              '**Éves kiadások** – az aktuális év összes kiadása',
              '**Csoportok száma** – hány csoportban vagy tag',
              '**Bevásárló listák** – aktív bevásárló listák száma',
            ],
          },
          { type: 'heading', level: 3, text: 'Kategória bontás' },
          {
            type: 'paragraph',
            text: 'A kártyák alatt megjelenik a kiadások **kategóriák szerinti bontása**, amelyen jól látható, mire költesz a legtöbbet. A diagramot kattintással lehet kategória szerint szűrni.',
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Valós idejű frissítés',
            text: 'Az irányítópult minden oldalbetöltéskor frissíti az adatokat az aktuális adatbázisból.',
          },
        ],
      },
      {
        id: 'csoportok',
        title: 'Csoportok kezelése',
        content: [
          { type: 'heading', level: 2, text: 'Csoportok kezelése' },
          {
            type: 'paragraph',
            text: 'A csoportok funkció lehetővé teszi, hogy több felhasználóval közösen kövessétek a kiadásokat. Ideális megosztott háztartáshoz, baráti társasághoz, vagy munkatársak közös kasszájához.',
          },
          {
            type: 'image',
            alt: 'Csoportok oldal',
            caption: 'A csoportok listanézete',
            mock: true,
            mockIcon: '👥',
            mockColor: '#059669',
            mockLabel: 'Csoportok oldal',
          },
          { type: 'heading', level: 3, text: 'Csoport létrehozása' },
          {
            type: 'steps',
            steps: [
              { icon: '➕', title: 'Új csoport', text: 'Kattints a **Csoportok** menüpontra, majd az **Új csoport** gombra.' },
              { icon: '✏️', title: 'Csoport adatai', text: 'Add meg a csoport **nevét** és válaszd ki a **csoport típusát** (pl. háztartás, barátok, munkahely).' },
              { icon: '✅', title: 'Létrehozás', text: 'Kattints a **Létrehozás** gombra. A csoport azonnal megjelenik a listában.' },
            ],
          },
          { type: 'heading', level: 3, text: 'Tagok meghívása' },
          {
            type: 'paragraph',
            text: 'A csoport létrehozása után **meghívhatod a tagjait**. Ehhez nyisd meg a csoportot, és kattints a **Tag meghívása** gombra. A meghívott felhasználónak szintén regisztrált fiókkal kell rendelkeznie.',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Csoport típusok',
            text: 'A csoport típusa csak megjelölési célt szolgál – bármelyik típust bármilyen célra használhatod. A típushoz különböző ikon tartozik a könnyebb azonosítás érdekében.',
          },
          { type: 'heading', level: 3, text: 'Csoport részletek' },
          {
            type: 'paragraph',
            text: 'A csoportra kattintva megnyílik a **csoport részlet oldala**, ahol láthatod:',
          },
          {
            type: 'list',
            items: [
              'A csoport tagjait és szerepköreiket',
              'A csoport bevásárló listáit',
              'Közös kiadások összesítőjét',
              'A csoport beállításait (szerkesztés, törlés)',
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Csoport törlése',
            text: 'A csoport törlése **végleges** és nem visszavonható. Törlés esetén a csoport összes adata, bevásárló listája és tagkapcsolata megszűnik.',
          },
        ],
      },
      {
        id: 'bevásárló-listák',
        title: 'Bevásárló listák',
        content: [
          { type: 'heading', level: 2, text: 'Bevásárló listák' },
          {
            type: 'paragraph',
            text: 'A bevásárló listák segítségével nyomon követheted, mire van szükséged és mennyit költöttél. Létrehozhatsz **személyes** és **csoportos** listákat egyaránt.',
          },
          {
            type: 'image',
            alt: 'Bevásárló lista nézet',
            caption: 'Bevásárló lista tételekkel',
            mock: true,
            mockIcon: '🛒',
            mockColor: '#d97706',
            mockLabel: 'Bevásárló lista',
          },
          { type: 'heading', level: 3, text: 'Új lista létrehozása' },
          {
            type: 'steps',
            steps: [
              { icon: '🛒', title: 'Bevásárló listák menü', text: 'Kattints a navigációban a **Bevásárló listák** menüpontra.' },
              { icon: '➕', title: 'Új lista', text: 'Kattints az **Új lista** gombra a jobb felső sarokban.' },
              { icon: '📝', title: 'Lista neve és típusa', text: 'Add meg a lista **nevét**, és opcionálisan rendeld egy **csoporthoz** (ha csoportos lista).' },
              { icon: '🏷️', title: 'Tételek hozzáadása', text: 'A lista megnyitása után add hozzá a **tételeket** névvel és becsült árral.' },
            ],
          },
          { type: 'heading', level: 3, text: 'Lista tételek kezelése' },
          {
            type: 'table',
            headers: ['Funkció', 'Leírás'],
            rows: [
              ['Tétel hozzáadása', 'A lista alján lévő mezőbe írd be a tétel nevét és összegét'],
              ['Tétel jelölése', 'Kattints a checkbox-ra a tétel megvásároltként jelöléséhez'],
              ['Tétel szerkesztése', 'Kattints a ceruza ikonra a tétel adatainak módosításához'],
              ['Tétel törlése', 'Kattints a szemét ikonra a tétel eltávolításához'],
              ['Lista archíválása', 'A lista teljesítése után archiválhatod a listát'],
            ],
          },
          {
            type: 'callout',
            variant: 'success',
            title: 'Csoportos listák',
            text: 'Ha a listát egy csoporthoz rendeled, a csoport minden tagja látja és szerkesztheti azt. Kiváló közös bevásárláshoz!',
          },
        ],
      },
      {
        id: 'statisztikak',
        title: 'Statisztikák',
        content: [
          { type: 'heading', level: 2, text: 'Statisztikák és kimutatások' },
          {
            type: 'paragraph',
            text: 'A statisztikák oldalon részletes elemzést kaphatsz a kiadásaidról. Az adatok interaktív grafikonok formájában jelennek meg, amelyek segítenek megérteni a pénzköltési szokásaidat.',
          },
          {
            type: 'image',
            alt: 'Statisztikák oldal grafikonokkal',
            caption: 'Kiadások grafikon – havi bontásban',
            mock: true,
            mockIcon: '📈',
            mockColor: '#7c3aed',
            mockLabel: 'Statisztikák oldal',
          },
          { type: 'heading', level: 3, text: 'Elérhető nézetek' },
          {
            type: 'cards',
            cards: [
              { icon: '📅', title: 'Havi összesítő', text: 'Vizualizálja az aktuális hónap kiadásait kategóriák szerint lebontva, kördiagram formájában.', color: '#5b5ef4' },
              { icon: '📆', title: 'Éves áttekintés', text: 'Oszlopdiagram formájában mutatja az egyes hónapok kiadásait az elmúlt 12 hónapra visszamenőleg.', color: '#059669' },
              { icon: '🏷️', title: 'Alkategória bontás', text: 'Részletes lebontás alkategóriák szerint – láthatod, melyik al-kategória viszi el a legtöbb pénzt.', color: '#d97706' },
            ],
          },
          { type: 'heading', level: 3, text: 'Szűrési lehetőségek' },
          {
            type: 'list',
            items: [
              '**Időszak választás** – hónap, negyedév, év szűrő',
              '**Kategória szűrő** – csak egy adott kategória adatainak megjelenítése',
              '**Csoport szűrő** – csak egy adott csoport kiadásainak megtekintése',
            ],
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Adatok forrása',
            text: 'A statisztikák a bevásárló listákhoz rögzített összegekből számolódnak. Minél több adatot rögzítesz, annál pontosabb képet kapsz a kiadásaidról.',
          },
        ],
      },
      {
        id: 'kuponok',
        title: 'Kuponok',
        content: [
          { type: 'heading', level: 2, text: 'Kuponok' },
          {
            type: 'paragraph',
            text: 'A kuponok szekció lehetővé teszi, hogy megtekinthesd az elérhető kedvezményes kuponokat, és igénybe vegyék azokat vásárlásaidhoz.',
          },
          {
            type: 'image',
            alt: 'Kupon oldal',
            caption: 'Elérhető kuponok listája',
            mock: true,
            mockIcon: '🎟️',
            mockColor: '#dc2626',
            mockLabel: 'Kuponok oldal',
          },
          { type: 'heading', level: 3, text: 'Kupon böngészés' },
          {
            type: 'list',
            items: [
              'A **Kuponok** menüpontra kattintva megnyílik a kuponok listája',
              'A kuponok tartalmazzák a **kedvezmény mértékét**, az **érvényességi időt** és a **feltételeket**',
              'A kuponok szűrhetők **kategória** és **érvényesség** szerint',
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Kupon lejárat',
            text: 'A kuponoknak lejárati ideje van. Lejárt kuponokat nem lehet alkalmazni. Érdemes időben felhasználni az aktív kuponokat!',
          },
          { type: 'heading', level: 3, text: 'Kupon feltöltése (Moderátor)' },
          {
            type: 'paragraph',
            text: 'Moderátor jogosultsággal rendelkező felhasználók **új kuponokat tölthetnek fel**. Erről részletesebben a [Moderátori funkciók](#moderator-funkciok) szekcióban olvashatsz.',
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 4. HALADÓ FUNKCIÓK
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'halado-funkciok',
    title: 'Haladó funkciók',
    icon: '🛠️',
    sections: [
      {
        id: 'profil-beallitasok',
        title: 'Profil és beállítások',
        content: [
          { type: 'heading', level: 2, text: 'Profil és beállítások' },
          {
            type: 'paragraph',
            text: 'A profil oldalon módosíthatod a személyes adataidat és az alkalmazás megjelenési beállításait.',
          },
          {
            type: 'image',
            alt: 'Profil oldal',
            caption: 'Profil beállítások oldala',
            mock: true,
            mockIcon: '👤',
            mockColor: '#5b5ef4',
            mockLabel: 'Profil oldal',
          },
          { type: 'heading', level: 3, text: 'Szerkeszthető adatok' },
          {
            type: 'list',
            items: [
              '**Teljes név** – a profilodban megjelenő neved',
              '**E-mail cím** – bejelentkezéshez és értesítésekhez',
              '**Jelszó módosítása** – a jelenlegi jelszó megadása szükséges',
              '**Profilkép** – avatar feltöltése vagy módosítása',
            ],
          },
          { type: 'heading', level: 3, text: 'Témaváltás (sötét / világos mód)' },
          {
            type: 'paragraph',
            text: 'Az alkalmazás tetején lévő **Hold / Nap ikon** segítségével bármikor válthatsz a **sötét** és **világos** mód között. A beállítás automatikusan mentődik a böngésződbe.',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Sötét mód',
            text: 'A sötét mód csökkenti a szemterhelést gyenge fényviszonyok között, és akkumulátort is kímél OLED kijelzők esetén.',
          },
        ],
      },
      {
        id: 'admin-felulet',
        title: 'Adminisztrátori felület',
        content: [
          { type: 'heading', level: 2, text: 'Adminisztrátori felület' },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Csak adminisztrátoroknak',
            text: 'Az alábbi funkciók kizárólag **admin jogosultsággal** rendelkező felhasználók számára elérhetők. Ha nem rendelkezel admin joggal, ez a menüpont nem jelenik meg számodra.',
          },
          {
            type: 'paragraph',
            text: 'Az admin felületen a rendszer adminisztrátorai az alábbi feladatokat végezhetik el:',
          },
          {
            type: 'cards',
            cards: [
              { icon: '👥', title: 'Felhasználók kezelése', text: 'Felhasználói fiókok megtekintése, szerkesztése, jogosultságok beállítása, fiókok törlése.', color: '#5b5ef4' },
              { icon: '📋', title: 'Csoportok felügyelete', text: 'Az összes csoport megtekintése, problémás csoportok kezelése, tagok eltávolítása.', color: '#059669' },
              { icon: '📊', title: 'Rendszer statisztikák', text: 'A teljes rendszer aggregált statisztikáinak megtekintése – aktív felhasználók, kiadások összesítője.', color: '#7c3aed' },
              { icon: '🔧', title: 'Rendszerbeállítások', text: 'Globális beállítások, kategóriák és alkategóriák kezelése.', color: '#d97706' },
            ],
          },
          {
            type: 'callout',
            variant: 'danger',
            title: 'Figyelmeztetés',
            text: 'Az admin felületen végzett műveletek **vissza nem vonható** változásokat okozhatnak. Törlés előtt mindig ellenőrizd, hogy a megfelelő elemet jelölted-e ki!',
          },
        ],
      },
      {
        id: 'moderator-funkciok',
        title: 'Moderátori funkciók',
        content: [
          { type: 'heading', level: 2, text: 'Moderátori funkciók' },
          {
            type: 'callout',
            variant: 'info',
            title: 'Moderátor szerepkör',
            text: 'A moderátorok a felhasználók és adminisztrátorok között helyezkednek el a jogosultsági hierarchiában. Korlátozottabb jogkörük van, mint az adminoknak.',
          },
          {
            type: 'paragraph',
            text: 'Moderátor jogosultsággal a következő funkciók érhetők el:',
          },
          {
            type: 'list',
            items: [
              '**Kupon moderátor oldal** – új kuponok feltöltése, meglévők szerkesztése és törlése',
              '**Tartalom jóváhagyás** – felhasználók által feltöltött tartalmak ellenőrzése',
              '**Kupon kategória kezelés** – kuponok kategóriáinak szervezése',
            ],
          },
          { type: 'heading', level: 3, text: 'Kupon feltöltése moderátorként' },
          {
            type: 'steps',
            steps: [
              { icon: '🎟️', title: 'Kupon moderátor oldal', text: 'Kattints a **Kupon moderátor** menüpontra a navigációban (csak moderátoroknak látható).' },
              { icon: '➕', title: 'Új kupon', text: 'Kattints az **Új kupon hozzáadása** gombra.' },
              { icon: '📝', title: 'Kupon adatai', text: 'Töltsd ki a kupon nevét, kedvezmény mértékét, érvényességi dátumát és feltételeit.' },
              { icon: '✅', title: 'Mentés', text: 'Kattints a **Mentés** gombra. A kupon azonnal megjelenik a kuponok listájában.' },
            ],
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 5. HIBAELHÁRÍTÁS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'hibakkezeles',
    title: 'Hibaelhárítás',
    icon: '🔧',
    sections: [
      {
        id: 'bejelentkezesi-problemak',
        title: 'Bejelentkezési problémák',
        content: [
          { type: 'heading', level: 2, text: 'Bejelentkezési problémák' },
          {
            type: 'table',
            headers: ['Hibaüzenet', 'Ok', 'Megoldás'],
            rows: [
              ['Hibás e-mail vagy jelszó', 'Rossz bejelentkezési adatok', 'Ellenőrizd az e-mail és jelszó kombinációt. A jelszó kis/nagybetű érzékeny!'],
              ['A fiók nem található', 'Nem létező e-mail cím', 'Ellenőrizd, hogy jó e-mail-t adtál meg, vagy regisztrálj új fiókot'],
              ['Lejárt munkamenet', 'A munkamenet tokenje lejárt', 'Jelentkezz be újra – ez 30 nap elteltével automatikusan bekövetkezhet'],
              ['Hozzáférés megtagadva', 'Nincs jogosultság az oldalhoz', 'Ellenőrizd, hogy van-e megfelelő szerepköröd (admin/moderátor)'],
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Inkognito mód',
            text: 'Ha nem tudsz bejelentkezni, próbáld ki inkognito/privát böngészőablakban. Ez kizárja, hogy egy régi, lejárt süti okozza a problémát.',
          },
        ],
      },
      {
        id: 'halozati-hibak',
        title: 'Hálózati hibák',
        content: [
          { type: 'heading', level: 2, text: 'Hálózati és csatlakozási hibák' },
          {
            type: 'callout',
            variant: 'danger',
            title: 'ERR_CONNECTION_REFUSED',
            text: 'Ez a hiba azt jelenti, hogy a **backend szerver nem fut**. Az alkalmazás használatához a backend szervernek el kell indítva lennie.',
          },
          { type: 'heading', level: 3, text: 'Backend szerver indítása' },
          {
            type: 'code',
            language: 'bash',
            code: `# Nyisd meg a terminált és navigálj a Backend mappába:
cd c:\\...\\Vizsgaremek\\Backend

# Indítsd el a Laravel szervert:
php artisan serve

# Helyes kimenet:
# INFO  Server running on [http://localhost:8000].`,
          },
          { type: 'heading', level: 3, text: 'Frontend szerver indítása' },
          {
            type: 'code',
            language: 'bash',
            code: `# Nyisd meg egy ÚJ terminált, és navigálj a Frontend mappába:
cd c:\\...\\Vizsgaremek\\frontend

# Indítsd el a Vite dev szervert:
npm run dev

# Helyes kimenet:
# VITE v7.x  ready in 450 ms
# ➜  Local:   http://localhost:5173/`,
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Mindkét szerver szükséges',
            text: 'A Frontend (**port 5173**) és a Backend (**port 8000**) szervereknek **egyszerre kell futniuk**. Ne zárd be egyik terminálablakot sem!',
          },
          {
            type: 'table',
            headers: ['Hibaüzenet', 'Ok', 'Megoldás'],
            rows: [
              ['Network Error / ERR_CONNECTION_REFUSED', 'Backend nem fut', 'Futtasd: `php artisan serve` a Backend mappában'],
              ['CORS Error', 'Backend CORS beállítás hiányzik', 'Ellenőrizd a `.env` fájlt és a `config/cors.php` fájlt'],
              ['404 Not Found', 'Rossz API URL', 'Ellenőrizd, hogy az `VITE_API_URL` a `.env` fájlban helyes'],
              ['500 Internal Server Error', 'Backend hiba', 'Nézd meg a `storage/logs/laravel.log` fájlt a részletekért'],
            ],
          },
        ],
      },
      {
        id: 'altalanos-hibak',
        title: 'Általános hibaüzenetek',
        content: [
          { type: 'heading', level: 2, text: 'Általános hibaüzenetek' },
          {
            type: 'list',
            items: [
              '**Oldal nem töltődik be** → Frissítsd az oldalt (`F5` vagy `Ctrl+R`)',
              '**Adatok nem jelennek meg** → Ellenőrizd az internetkapcsolatot, majd frissíts',
              '**Fehér képernyő** → Nyisd meg a fejlesztői konzolt (`F12`) és nézd meg a hibákat',
              '**Lassú betöltés** → Ellenőrizd az internetkapcsolatot, sok adat esetén várj türelmesen',
              '**Nem mentődnek el az adatok** → Ellenőrizd, hogy be vagy-e jelentkezve',
            ],
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Hibajelentés',
            text: 'Ha ismétlődő vagy súlyos hibát tapasztalsz, a **Kapcsolat** oldalon keresztül jelezd a fejlesztőknek. Írd le pontosan a hibát, és ha tudod, add meg a konzol hibaüzenetét is.',
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 6. GYIK
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'gyik',
    title: 'Gyakori kérdések',
    icon: '❓',
    sections: [
      {
        id: 'gyik-altalanos',
        title: 'GYIK – Általános',
        content: [
          { type: 'heading', level: 2, text: 'Gyakran Ismételt Kérdések' },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Nem találod a választ?',
            text: 'Ha az alábbi kérdések között nem találod a keresett választ, vedd fel a kapcsolatot a fejlesztőkkel a **Kapcsolat** oldalon.',
          },
          { type: 'heading', level: 3, text: 'Az alkalmazás ingyenes?' },
          {
            type: 'paragraph',
            text: 'Igen, a Szaldon jelenleg **teljesen ingyenes**. Nincs prémium csomag vagy rejtett díj.',
          },
          { type: 'heading', level: 3, text: 'Hány csoportot hozhatok létre?' },
          {
            type: 'paragraph',
            text: 'Jelenleg nincs korlát a csoportok számára. Annyi csoportot hozhatsz létre, amennyire szükséged van.',
          },
          { type: 'heading', level: 3, text: 'Biztonságban vannak az adataim?' },
          {
            type: 'paragraph',
            text: 'Az adatokat **titkosítva** tároljuk. A jelszavak bcrypt hash-sel védve vannak – soha nem tároljuk azokat szövegesen. Az alkalmazás Laravel Sanctum alapú tokenautentikációt használ.',
          },
          { type: 'heading', level: 3, text: 'Exportálhatom az adataimat?' },
          {
            type: 'paragraph',
            text: 'Az adatexportálás funkció jelenleg fejlesztés alatt áll, és egy jövőbeli frissítésben érhető el.',
          },
          { type: 'heading', level: 3, text: 'Törölhetem a fiókomat?' },
          {
            type: 'paragraph',
            text: 'Fiók törléshez lépj kapcsolatba az adminisztrátorral a **Kapcsolat** oldalon. A fiók törlése végleges és minden adat elveszti.',
          },
          { type: 'heading', level: 3, text: 'Milyen kategóriák érhetők el?' },
          {
            type: 'paragraph',
            text: 'Az alkalmazás előre definiált **főkategóriákat** és **alkategóriákat** tartalmaz (pl. Élelmiszer, Közlekedés, Szórakozás). Az adminisztrátorok új kategóriákat adhatnak hozzá.',
          },
          { type: 'heading', level: 3, text: 'Miért nem jelenik meg a statisztika?' },
          {
            type: 'paragraph',
            text: 'A statisztikák csak akkor jelennek meg, ha **legalább egy rögzített kiadás** van. Ha még nincs tételed, az irányítópult és a statisztika oldal üresnek látszik.',
          },
          { type: 'heading', level: 3, text: 'Hány tag lehet egy csoportban?' },
          {
            type: 'paragraph',
            text: 'Jelenleg nincs korlát a csoporttagok számára. Annyi tagot hívhatsz meg, amennyire szükséged van.',
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 7. VERZIÓK ÉS VÁLTOZÁSOK
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'changelog',
    title: 'Verziók és változások',
    icon: '📋',
    sections: [
      {
        id: 'changelog-lista',
        title: 'Változásnaplő',
        content: [
          { type: 'heading', level: 2, text: 'Verziók és változások' },
          {
            type: 'paragraph',
            text: 'Az alkalmazás fejlesztési mérföldkövei és a legfontosabb változtatások.',
          },
          { type: 'heading', level: 3, text: '🎉 v1.0.0 – Első kiadás (2025)' },
          {
            type: 'badges',
            items: ['Stabil', 'Aktuális verzió'],
          },
          {
            type: 'list',
            items: [
              'Felhasználói regisztráció és bejelentkezés (Laravel Sanctum)',
              'Irányítópult statisztika kártyákkal',
              'Csoportok létrehozása, szerkesztése, törlése',
              'Tagok meghívása csoportokba',
              'Bevásárló listák kezelése (egyéni és csoportos)',
              'Kiadások rögzítése kategóriák szerint',
              'Statisztikai grafikonok (Chart.js)',
              'Kuponok böngészése és kezelése',
              'Adminisztrátori felület',
              'Moderátori kupon kezelés',
              'Sötét/Világos mód támogatás',
              'Reszponzív mobilnézet',
              'Süti-kezelés és adatvédelmi nyilatkozat',
              'Kapcsolati űrlap e-mail küldéssel',
            ],
          },
          { type: 'heading', level: 3, text: '🔜 Tervezett funkciók' },
          {
            type: 'callout',
            variant: 'info',
            title: 'Fejlesztés alatt',
            text: 'Az alábbi funkciók a jövőbeli verziókban kerülnek bevezetésre a felhasználói visszajelzések alapján.',
          },
          {
            type: 'list',
            items: [
              'Adatexportálás CSV / PDF formátumban',
              'E-mail értesítések kupon lejárathoz',
              'Ismétlődő kiadások automatikus rögzítése',
              'Havi büdzsé célok beállítása és nyomon követése',
              'Mobilalkalmazás (React Native) – béta verzió folyamatban',
              'Push értesítések mobilon',
              'Megosztható statisztika riportok',
            ],
          },
          {
            type: 'callout',
            variant: 'success',
            title: 'Visszajelzés',
            text: 'Van ötleted vagy fejlesztési javaslataod? Örömmel fogadjuk! Írj nekünk a **Kapcsolat** oldalon.',
          },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper: flatten all sections into a single list
// ─────────────────────────────────────────────────────────────────────────────
export function flattenSections() {
  const result = [];
  DOC_STRUCTURE.forEach((chapter) => {
    chapter.sections.forEach((section) => {
      result.push({ ...section, chapterId: chapter.id, chapterTitle: chapter.title });
    });
  });
  return result;
}

// Helper: search through all sections
export function searchDocs(query) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase();
  const results = [];

  DOC_STRUCTURE.forEach((chapter) => {
    chapter.sections.forEach((section) => {
      let matchScore = 0;
      let matchType = 'content';

      if (section.title.toLowerCase().includes(q)) {
        matchScore = 10;
        matchType = 'title';
      }

      const textContent = section.content
        .map((b) => {
          if (b.type === 'paragraph') return b.text || '';
          if (b.type === 'heading') return b.text || '';
          if (b.type === 'callout') return `${b.title || ''} ${b.text || ''}`;
          if (b.type === 'list') return (b.items || []).join(' ');
          if (b.type === 'steps') return (b.steps || []).map((s) => `${s.title} ${s.text}`).join(' ');
          if (b.type === 'cards') return (b.cards || []).map((c) => `${c.title} ${c.text}`).join(' ');
          return '';
        })
        .join(' ')
        .toLowerCase();

      if (matchScore === 0 && textContent.includes(q)) {
        matchScore = 1;
        matchType = 'content';
      }

      if (matchScore > 0) {
        results.push({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          chapterIcon: chapter.icon,
          sectionId: section.id,
          sectionTitle: section.title,
          matchType,
          score: matchScore,
        });
      }
    });
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

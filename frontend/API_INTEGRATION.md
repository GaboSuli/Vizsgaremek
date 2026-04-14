# Backend API Integration

A frontend alkalmazás sikeresen integrálva lett a Laravel backend API-val. Az alkalmazás mostantól valódi adatokat kér a szervertől.

## Szerver Konfigurációja

**Backend URL:** `http://127.0.0.1:8000/api`

Az összes API hívás automatikusan megpróbál csatlakozni a backend szerverhez. Ha a szerver nem érhető el, az alkalmazás az elérhető mock adatokat használja.

## Implementált Routes

### Autentikáció

- **POST** `/felhasznalo/register` - Felhasználó regisztráció
- **POST** `/felhasznalo/login` - Bejelentkezés és token megadás
- **GET** `/user` (middleware: auth:sanctum) - Jelenleg bejelentkezett felhasználó

### Felhasználók

- **GET** `/felhasznalo/{id}` - Felhasználó adatai ID alapján
- **GET** `/felhasznalo/{id}/csoportjai` - Felhasználó csoportjai
- **GET** `/felhasznalo/{id}/vevesiListak` - Felhasználó bevásárlólistái

### Vevési Listák

- **GET** `/vevesiListak` - Összes bevásárlólista
- **GET** `/vevesiLista/{id}` - Specifikus bevásárlólista
- **POST** `/vevesiListak` - Új bevásárlólista létrehozása
- **PUT** `/vevesiLista/{id}` - Bevásárlólista frissítése
- **DELETE** `/vevesiLista/{id}` - Bevásárlólista törlése
- **POST** `/vevesiLista/{id}/tetel` - Tétel hozzáadása
- **DELETE** `/vevesiLista/{id}/tetel/{itemId}` - Tétel eltávolítása
- **GET** `/csoport/{id}/vevesiListak` - Csoport bevásárlólistái

### Kuponok

- **GET** `/kuponok/get` - Összes kupon
- **GET** `/kuponok/{id}` - Specifikus kupon
- **POST** `/kuponok` - Új kupon létrehozása
- **PUT** `/kuponok/{id}` - Kupon frissítése
- **DELETE** `/kuponok/{id}` - Kupon törlése

## Megvalósított Szolgáltatások

### 1. **api.js** - API Kliens
- Alap URL konfigurációja
- Auth token kezelése (localStorage)
- Általános API hívás függvény
- Automatikus 401 hiba kezelése

### 2. **authService.js** - Autentikáció
- `registerUser()` - Regisztráció
- `loginUser()` - Bejelentkezés (token tárolása)
- `getCurrentUser()` - Jelenleg bejelentkezett felhasználó
- `getUserById()` - Felhasználó adatok lekérése
- `getUserGroups()` - Felhasználó csoportjai
- `logoutUser()` - Kijelentkezés
- `isAuthenticated()` - Bejelentkezés státusz
- `getStoredUserInfo()` / `setStoredUserInfo()` - Lokális adatok

### 3. **shoppingListService.js** - Bevásárlólista API
- `getAllShoppingLists()` - Összes lista
- `getShoppingListsByUser(userId)` - Felhasználó listái
- `getShoppingListsByGroup(groupId)` - Csoport listái
- `getShoppingListById(id)` - Specifikus lista
- `createShoppingList()` - Új lista
- `updateShoppingList()` - Lista frissítése
- `deleteShoppingList()` - Lista törlése
- `addItemToList()` - Tétel hozzáadása
- `removeItemFromList()` - Tétel eltávolítása
- `estimateTotalCost()` - Költségbecslés (27% ÁFA)
- `getShoppingListStats()` - Statisztikák

### 4. **kuponService.js** - Kupon API
- `getAllKupons()` - Összes kupon
- `getKuponById()` - Specifikus kupon
- `createKupon()` - Új kupon
- `updateKupon()` - Kupon frissítése
- `deleteKupon()` - Kupon törlése
- `searchKupon()` - Kupon keresése
- `getExpiredKupons()` - Lejárt kuponok
- `getActiveKupons()` - Aktív kuponok

## Bejelentkezés és Autentikáció

1. Az alkalmazás beim indításakor ellenőrzi az autentikáció státuszát
2. Ha nincs token, a LoginPage komponens jelenik meg
3. A bejelentkezés után az token localStorage-ben tárolódik
4. Minden API hívás automatikusan tartalmazza az `Authorization: Bearer {token}` headert
5. 401 Unauthorized esetén automatikus logout és LoginPage redirect

## Fallback Mód

Ha a backend szerver nem érhető el:
- Az alkalmazás mock adatokat használ
- Az UI normálisan működik
- Mock adatok: 3 minta bevásárlólista, 3 minta kupon

## Szerver Indítása

```bash
# Backend Laravel szerver indítása
cd Backend
php artisan serve
# URL: http://127.0.0.1:8000

# Frontend Vite szerver indítása
cd frontend/Frontend
npm run dev
# URL: http://localhost:5174
```

## Fejlesztési Megjegyzések

### CORS Beállítások
Ha CORS hibákat látsz, ügyelj arra, hogy a Laravel backend a `config/cors.php` fájlban a frontend URL-t engedélyezze:

```php
'allowed_origins' => ['http://localhost:5174', 'http://127.0.0.1:5174'],
```

### Sanctum Konfigurációja
A Laravel Sanctum middleware kell a `routes/api.php` fájlban:

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
```

### Token Kezelése
Az auth token automatikusan kerül tárolásra a login után:
- Tárolási hely: `localStorage.auth_token`
- Logout közben eltávolítódik

## Tesztadatok

### Regisztráció Teszt
```
Email: test@example.com
Jelszó: password123
Név: Test User
```

### Login Teszt
```
Email: test@example.com
Jelszó: password123
```

## Hibakezelés

Az összes API hívás standardizált válasz objektumot ad vissza:

```javascript
{
  success: boolean,
  data: any,
  message: string,
  status?: number
}
```

A komponensek automatikusan kezelik az error és loading state-eket.

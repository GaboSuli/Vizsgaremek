
# Elinditásra javasolt programok:
- Visual Studio Code
- XAMPP Control Panel

# Muszály dependencies:
- Composer
- Node.js

# Adatbázis (MySQL):
- Futtassa a MySQL-t például a XAMPP control panel alkalmazásba.
- Importálja a "backend.sql" adatbázist amit a templates mappában talál (nem kell kiválasztani létrehozott adatbázist, benne van a "Create Database" parancs)

# Backend (Laravel):
- "composer install" parancs a /backend mappában (ez csak egyszer kell hogy a backendhez meg legyenek a fájlok, kell hogy telepitve legyen a composer hogy ezt le lehessen futtatni)
- "php artisan serve" parancs a /backend mappában (ez fogja futtatni a backend szervert)

# Frontend (React)
- "npm install" a /frontend mappában (ez csak egyszer kell hogy a frontendnek meg legyen a fájljai, kell hogy a node.js telepitve legyen hogy ezt le lehessen futtatni)
- "npm run dev" a /frontend mappában (ez fogja futtatni a frontend szervert)

# Utána:
- Frontend (ezt irja be a böngészöbe hogy elérje a weboldalt): localhost:5173
- Admin bejelentkezési adatok: 
- - Email: 
- - - Admin@example.com
- - Jelszó: 
- - - $€zEgyhAsMcOdE$;18:
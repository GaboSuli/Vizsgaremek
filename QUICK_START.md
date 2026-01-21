# 🚀 Quick Start - Backend & Frontend Indítása

## ⚠️ Ha ERR_CONNECTION_REFUSED hibát kapod

Ez azt jelenti, hogy a **Backend szerver nem fut**! Kövesd az alábbi lépéseket:

---

## 1️⃣ Backend Indítása (ELSŐ - kötelező!)

### PowerShell megnyitása:
```powershell
# Jó: Nyisd meg a PowerShell-t és futtasd az alábbi parancsokat:
cd c:\Users\pappa\Documents\GitHub\Vizsgaremek\Backend
php artisan serve
```

**Helyes kimenet:**
```
INFO  Server running on [http://localhost:8000].

Press Ctrl+C to stop the server
```

✅ **Backend fut!** Most csak az ablakot nyitva kell tartani.

---

## 2️⃣ Frontend Indítása (MÁSODIK - új terminálban!)

### Új PowerShell ablak megnyitása:
```powershell
cd c:\Users\pappa\Documents\GitHub\Vizsgaremek\frontend\Frontend
npm run dev
```

**Helyes kimenet:**
```
VITE v7.3.1  ready in 450 ms

➜  Local:   http://localhost:5174/
➜  press h to show help
```

✅ **Frontend fut!**

---

## 3️⃣ Browser megnyitása

Nyisd meg: **http://localhost:5174**

---

## 📋 Szerver Ellenőrzés Checklist

- [ ] Backend szerver fut? (`http://localhost:8000` - legyen futva)
- [ ] Frontend szerver fut? (`http://localhost:5174` - legyen futva)
- [ ] Mindkét terminál nyitva van? (ne zártad be őket)
- [ ] Nincs firewall blokk? (próbálj Ctrl+Shift+Del → Settings)
- [ ] Másik alkalmazás nem foglal-e 8000-es portot?

---

## 🆘 Hibaelhárítás

### "Port már használatban van"
```powershell
# Más porton futtatni
php artisan serve --port=8001

# Majd az AdminPage-ben módosítani az URL-t
# API_URL = 'http://localhost:8001'
```

### "Laravel key not set"
```powershell
cd Backend
php artisan key:generate
php artisan serve
```

### "CORS error"
✅ Már beállítva van a `Backend/config/cors.php`-ben

---

## ✅ Teljesen Működő Setup

1. **Terminal 1 - Backend:**
   ```powershell
   cd Backend
   php artisan serve
   ```

2. **Terminal 2 - Frontend:**
   ```powershell
   cd frontend\Frontend
   npm run dev
   ```

3. **Browser:** http://localhost:5174

4. **Bejelentkezés:**
   ```
   Email: admin@dev.local
   Jelszó: Admin@123
   ```

---

## 📌 Parancsok Másolásához

### Windows PowerShell parancsok:

**Backend indítása:**
```powershell
cd c:\Users\pappa\Documents\GitHub\Vizsgaremek\Backend; php artisan serve
```

**Frontend indítása:**
```powershell
cd c:\Users\pappa\Documents\GitHub\Vizsgaremek\frontend\Frontend; npm run dev
```

---

## 🎯 Milyen sorrendben indíts?

1. **ELŐSZÖR:** Backend (Terminal 1)
2. **MÁSODSZOR:** Frontend (Terminal 2)
3. **VÉGÜL:** Browser

❌ Ha fordítva csinálod, a Frontend nem talál a Backend-et!

---

## 📱 Ha sikerült

- ✅ Frontend betölt (http://localhost:5174)
- ✅ Admin Panel látható (Admin Panel gomb a szidebarban)
- ✅ Bejelentkezés működik (admin@dev.local / Admin@123)
- ✅ API végpontok működnek

---

## 📞 Rendszer Status Ellenőrzése

1. Bejelentkezz az admin adatokkal
2. Kattints az **Admin Panel** gombra
3. A **Dashboard** fülön láthatod a szerver státuszokat

---

**Egyszerűen:**
1. **Backend szerver indítása** (Terminal 1)
2. **Frontend szerver indítása** (Terminal 2)
3. **Browser megnyitása:** http://localhost:5174
4. **Kész!** 🎉


// Mock kupon adat az OsszesKupon.json alapján
const kuponData = {
  Kuponok: [
    {
      id: 1,
      KezdesiDatum: "2025-05-05",
      LejarasiDatum: "2026-06-06",
      Kod: "100000%SASALELE",
      HasznalatiHely: "Itt és most",
      Megjegyzes: "nem igazi"
    },
    {
      id: 2,
      KezdesiDatum: "2021-05-05",
      LejarasiDatum: "2022-06-06",
      Kod: "+-+----%///",
      HasznalatiHely: "Ott és késöbb",
      Megjegyzes: "igazi"
    },
    {
      id: 3,
      KezdesiDatum: "2025-01-10",
      LejarasiDatum: "2026-12-31",
      Kod: "TAVASZ2025",
      HasznalatiHely: "Online és offline",
      Megjegyzes: "20% kedvezmény"
    }
  ]
};

let kupons = [...kuponData.Kuponok];
let nextId = Math.max(...kupons.map(k => k.id)) + 1;

// Összes kupon lekérése
export const getAllKupons = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: kupons,
        count: kupons.length
      });
    }, 300);
  });
};

// Egyedi kupon lekérése ID alapján
export const getKuponById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const kupon = kupons.find(k => k.id === id);
      if (kupon) {
        resolve({
          success: true,
          data: kupon
        });
      } else {
        reject({
          success: false,
          error: "Kupon nem található"
        });
      }
    }, 200);
  });
};

// Kupon létrehozása
export const createKupon = async (kuponData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newKupon = {
        id: nextId++,
        ...kuponData,
        KezdesiDatum: kuponData.KezdesiDatum || new Date().toISOString().split('T')[0],
        LejarasiDatum: kuponData.LejarasiDatum || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      };
      kupons.push(newKupon);
      resolve({
        success: true,
        data: newKupon,
        message: "Kupon sikeresen létrehozva"
      });
    }, 300);
  });
};

// Kupon módosítása
export const updateKupon = async (id, updateData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = kupons.findIndex(k => k.id === id);
      if (index !== -1) {
        kupons[index] = { ...kupons[index], ...updateData };
        resolve({
          success: true,
          data: kupons[index],
          message: "Kupon sikeresen módosítva"
        });
      } else {
        reject({
          success: false,
          error: "Kupon nem található"
        });
      }
    }, 300);
  });
};

// Kupon törlése
export const deleteKupon = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = kupons.findIndex(k => k.id === id);
      if (index !== -1) {
        const deleted = kupons.splice(index, 1);
        resolve({
          success: true,
          data: deleted[0],
          message: "Kupon sikeresen törölve"
        });
      } else {
        reject({
          success: false,
          error: "Kupon nem található"
        });
      }
    }, 300);
  });
};

// Kupon keresése kód alapján
export const searchKupon = async (kod) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = kupons.filter(k => 
        k.Kod.toLowerCase().includes(kod.toLowerCase())
      );
      resolve({
        success: true,
        data: results,
        count: results.length
      });
    }, 300);
  });
};

// Lejárt kuponok ellenőrzése
export const getExpiredKupons = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      const expired = kupons.filter(k => k.LejarasiDatum < today);
      resolve({
        success: true,
        data: expired,
        count: expired.length
      });
    }, 300);
  });
};

// Aktív kuponok lekérése
export const getActiveKupons = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      const active = kupons.filter(k => 
        k.KezdesiDatum <= today && k.LejarasiDatum >= today
      );
      resolve({
        success: true,
        data: active,
        count: active.length
      });
    }, 300);
  });
};

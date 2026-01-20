/**
 * VevesiLista Service - Bevásárlólista adatok feldolgozása
 */

// Minta adatok a VevesiLista.json-ből
const vevesiListaData = {
  "Lista1": {
    "Nev": "Heti bevásárlás",
    "Letrehozas": "2024-01-15",
    "Felhasznalo": "Kovács János",
    "Tetelek": [
      { "Nev": "Víz", "Mennyiseg": 5, "Egyseg": "Liter", "Ar": 250 },
      { "Nev": "Olaj", "Mennyiseg": 1, "Egyseg": "Liter", "Ar": 850 },
      { "Nev": "Liszt", "Mennyiseg": 2, "Egyseg": "kg", "Ar": 400 }
    ]
  },
  "Lista2": {
    "Nev": "Háztartási dolgok",
    "Letrehozas": "2024-01-18",
    "Felhasznalo": "Kovács János",
    "Tetelek": [
      { "Nev": "Szappan", "Mennyiseg": 3, "Egyseg": "db", "Ar": 150 },
      { "Nev": "Tisztítószer", "Mennyiseg": 1, "Egyseg": "db", "Ar": 500 }
    ]
  },
  "Lista3": {
    "Nev": "Fürdőszobai kellékek",
    "Letrehozas": "2024-01-20",
    "Felhasznalo": "Kovács János",
    "Tetelek": [
      { "Nev": "Fogkrém", "Mennyiseg": 2, "Egyseg": "db", "Ar": 400 },
      { "Nev": "Sampon", "Mennyiseg": 1, "Egyseg": "db", "Ar": 1200 }
    ]
  }
};

/**
 * Összes bevásárlólista lekérése
 */
export const getAllVevesiListak = async () => {
  try {
    const listaky = [];

    for (const id in vevesiListaData) {
      const lista = vevesiListaData[id];
      const osszesen = lista.Tetelek.reduce((sum, item) => sum + (item.Ar * item.Mennyiseg), 0);
      
      listaky.push({
        id,
        nev: lista.Nev,
        letrehozas: lista.Letrehozas,
        felhasznalo: lista.Felhasznalo,
        tetelek: lista.Tetelek,
        osszesen,
        darab: lista.Tetelek.length
      });
    }

    return {
      success: true,
      data: listaky,
      total: listaky.length
    };
  } catch (error) {
    console.error('Hiba a bevásárlólisták lekérdezésekor:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Egy bevásárlólista lekérése
 */
export const getVevesiListaById = async (id) => {
  try {
    const lista = vevesiListaData[id];
    
    if (!lista) {
      return {
        success: false,
        error: 'Lista nem található'
      };
    }

    const osszesen = lista.Tetelek.reduce((sum, item) => sum + (item.Ar * item.Mennyiseg), 0);

    return {
      success: true,
      data: {
        id,
        nev: lista.Nev,
        letrehozas: lista.Letrehozas,
        felhasznalo: lista.Felhasznalo,
        tetelek: lista.Tetelek,
        osszesen
      }
    };
  } catch (error) {
    console.error('Hiba a bevásárlólista lekérdezésekor:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Új bevásárlólista létrehozása
 */
export const createVevesiLista = async (nev, felhasznalo) => {
  try {
    const id = `Lista${Object.keys(vevesiListaData).length + 1}`;
    vevesiListaData[id] = {
      Nev: nev,
      Letrehozas: new Date().toISOString().split('T')[0],
      Felhasznalo: felhasznalo,
      Tetelek: []
    };

    return {
      success: true,
      message: 'Lista sikeresen létrehozva',
      id
    };
  } catch (error) {
    console.error('Hiba a lista létrehozásakor:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

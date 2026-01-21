// Bevásárlólista service - VevesiLista.json és OsszVevesiLista.json struktúra alapján

let shoppingLists = [
  {
    id: 1,
    Nev: "Heti bevásárlás",
    Letrehozas: "2026-01-15",
    FelhasznaloId: 1,
    CsoportId: 1,
    Statusz: "aktiv",
    VevesiLista: [
      {
        id: 1,
        Megnevezes: "Kenyér",
        Alkategoria: "Pékáru",
        Ar: 450,
        MennyisegTipusMertekegyseg: "Darab",
        Mennyiseg: 2
      },
      {
        id: 2,
        Megnevezes: "Tej",
        Alkategoria: "Tejtermékek",
        Ar: 280,
        MennyisegTipusMertekegyseg: "Liter",
        Mennyiseg: 1
      },
      {
        id: 3,
        Megnevezes: "Alma",
        Alkategoria: "Gyümölcs",
        Ar: 200,
        MennyisegTipusMertekegyseg: "Kg",
        Mennyiseg: 2
      }
    ]
  },
  {
    id: 2,
    Nev: "Háztartási dolgok",
    Letrehozas: "2026-01-10",
    FelhasznaloId: 1,
    CsoportId: 1,
    Statusz: "aktiv",
    VevesiLista: [
      {
        id: 4,
        Megnevezes: "Szappan",
        Alkategoria: "Tisztítószerek",
        Ar: 380,
        MennyisegTipusMertekegyseg: "Darab",
        Mennyiseg: 3
      },
      {
        id: 5,
        Megnevezes: "Papír törlőkendő",
        Alkategoria: "Papírtermékek",
        Ar: 450,
        MennyisegTipusMertekegyseg: "Csomag",
        Mennyiseg: 2
      }
    ]
  },
  {
    id: 3,
    Nev: "Fürdőszobai kellékek",
    Letrehozas: "2026-01-08",
    FelhasznaloId: 2,
    CsoportId: 2,
    Statusz: "aktiv",
    VevesiLista: [
      {
        id: 6,
        Megnevezes: "Sampon",
        Alkategoria: "Fürdőszoba",
        Ar: 1200,
        MennyisegTipusMertekegyseg: "Ml",
        Mennyiseg: 250
      }
    ]
  }
];

let nextId = Math.max(...shoppingLists.map(l => l.id)) + 1;
let nextItemId = 7;

// Összérték számítása
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.Ar * item.Mennyiseg), 0);
};

// Összes bevásárlólista lekérése
export const getAllShoppingLists = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const listsWithTotals = shoppingLists.map(list => ({
        ...list,
        Osszesen: calculateTotal(list.VevesiLista),
        TeteiekSzama: list.VevesiLista.length
      }));
      
      resolve({
        success: true,
        data: listsWithTotals,
        count: listsWithTotals.length,
        struktura: "OsszVevesiLista"
      });
    }, 300);
  });
};

// Bevásárlólista lekérése felhasználó alapján
export const getShoppingListsByUser = async (felhasznaloId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userLists = shoppingLists.filter(l => l.FelhasznaloId === felhasznaloId);
      const listsWithTotals = userLists.map(list => ({
        ...list,
        Osszesen: calculateTotal(list.VevesiLista),
        TeteiekSzama: list.VevesiLista.length
      }));

      resolve({
        success: true,
        data: listsWithTotals,
        count: listsWithTotals.length,
        struktura: "OsszVevesiLista",
        felhasznaloId: felhasznaloId
      });
    }, 300);
  });
};

// Bevásárlólista lekérése csoport alapján
export const getShoppingListsByGroup = async (csoportId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const groupLists = shoppingLists.filter(l => l.CsoportId === csoportId);
      const listsWithTotals = groupLists.map(list => ({
        ...list,
        Osszesen: calculateTotal(list.VevesiLista),
        TeteiekSzama: list.VevesiLista.length
      }));

      resolve({
        success: true,
        data: listsWithTotals,
        count: listsWithTotals.length,
        struktura: "OsszVevesiLista",
        csoportId: csoportId
      });
    }, 300);
  });
};

// Egyedi bevásárlólista lekérése
export const getShoppingListById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const list = shoppingLists.find(l => l.id === id);
      if (list) {
        resolve({
          success: true,
          data: {
            ...list,
            Osszesen: calculateTotal(list.VevesiLista)
          },
          struktura: "VevesiLista"
        });
      } else {
        reject({
          success: false,
          error: "Bevásárlólista nem található"
        });
      }
    }, 300);
  });
};

// Bevásárlólista létrehozása
export const createShoppingList = async (listData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newList = {
        id: nextId++,
        Nev: listData.Nev || "Új bevásárlólista",
        Letrehozas: new Date().toISOString().split('T')[0],
        FelhasznaloId: listData.FelhasznaloId || 1,
        CsoportId: listData.CsoportId || 1,
        Statusz: "aktiv",
        VevesiLista: listData.VevesiLista || []
      };

      shoppingLists.push(newList);

      resolve({
        success: true,
        data: {
          ...newList,
          Osszesen: calculateTotal(newList.VevesiLista)
        },
        message: "Bevásárlólista sikeresen létrehozva",
        struktura: "VevesiLista"
      });
    }, 300);
  });
};

// Bevásárlólista frissítése
export const updateShoppingList = async (id, updateData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = shoppingLists.findIndex(l => l.id === id);
      if (index !== -1) {
        shoppingLists[index] = {
          ...shoppingLists[index],
          ...updateData,
          id: shoppingLists[index].id,
          Letrehozas: shoppingLists[index].Letrehozas
        };

        resolve({
          success: true,
          data: {
            ...shoppingLists[index],
            Osszesen: calculateTotal(shoppingLists[index].VevesiLista)
          },
          message: "Bevásárlólista sikeresen frissítve",
          struktura: "VevesiLista"
        });
      } else {
        reject({
          success: false,
          error: "Bevásárlólista nem található"
        });
      }
    }, 300);
  });
};

// Tétel hozzáadása a listához
export const addItemToList = async (listId, itemData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const list = shoppingLists.find(l => l.id === listId);
      if (list) {
        const newItem = {
          id: nextItemId++,
          Megnevezes: itemData.Megnevezes,
          Alkategoria: itemData.Alkategoria || "",
          Ar: itemData.Ar || 0,
          MennyisegTipusMertekegyseg: itemData.MennyisegTipusMertekegyseg || "Darab",
          Mennyiseg: itemData.Mennyiseg || 1
        };

        list.VevesiLista.push(newItem);

        resolve({
          success: true,
          data: {
            ...list,
            Osszesen: calculateTotal(list.VevesiLista)
          },
          message: "Tétel sikeresen hozzáadva",
          struktura: "VevesiLista"
        });
      } else {
        reject({
          success: false,
          error: "Bevásárlólista nem található"
        });
      }
    }, 300);
  });
};

// Tétel eltávolítása a listából
export const removeItemFromList = async (listId, itemId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const list = shoppingLists.find(l => l.id === listId);
      if (list) {
        const itemIndex = list.VevesiLista.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
          list.VevesiLista.splice(itemIndex, 1);
          
          resolve({
            success: true,
            data: {
              ...list,
              Osszesen: calculateTotal(list.VevesiLista)
            },
            message: "Tétel sikeresen eltávolítva",
            struktura: "VevesiLista"
          });
        } else {
          reject({
            success: false,
            error: "Tétel nem található"
          });
        }
      } else {
        reject({
          success: false,
          error: "Bevásárlólista nem található"
        });
      }
    }, 300);
  });
};

// Bevásárlólista törlése
export const deleteShoppingList = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = shoppingLists.findIndex(l => l.id === id);
      if (index !== -1) {
        const deleted = shoppingLists.splice(index, 1);
        resolve({
          success: true,
          data: deleted[0],
          message: "Bevásárlólista sikeresen törölve",
          struktura: "VevesiLista"
        });
      } else {
        reject({
          success: false,
          error: "Bevásárlólista nem található"
        });
      }
    }, 300);
  });
};

// Becslés az összköltségre
export const estimateTotalCost = async (listId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const list = shoppingLists.find(l => l.id === listId);
      if (list) {
        const total = calculateTotal(list.VevesiLista);
        const estimatedCost = {
          totalItems: list.VevesiLista.length,
          baseCost: total,
          estimatedWithTax: Math.round(total * 1.27), // 27% ÁFA
          currency: "HUF",
          description: `Nagyjából ${Math.round(total / 1000)}k - ${Math.round((total * 1.27) / 1000)}k Ft (ÁFA nélkül és azzal)`
        };

        resolve({
          success: true,
          data: estimatedCost,
          message: "Költségbecslés sikeresen kiszámítva"
        });
      } else {
        reject({
          success: false,
          error: "Bevásárlólista nem található"
        });
      }
    }, 300);
  });
};

// Statisztika lekérése
export const getShoppingListStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalItems = shoppingLists.reduce((sum, list) => sum + list.VevesiLista.length, 0);
      const totalCost = shoppingLists.reduce((sum, list) => sum + calculateTotal(list.VevesiLista), 0);
      
      resolve({
        success: true,
        data: {
          totalLists: shoppingLists.length,
          totalItems: totalItems,
          totalCost: totalCost,
          averageCostPerList: Math.round(totalCost / shoppingLists.length),
          averageItemsPerList: (totalItems / shoppingLists.length).toFixed(2)
        }
      });
    }, 300);
  });
};

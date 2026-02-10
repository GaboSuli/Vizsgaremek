import { apiCall } from './api.js';

// Mock data fallback for UI testing when API is not available
const mockShoppingLists = [
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

// Get all shopping lists
export const getAllShoppingLists = async () => {
  const response = await apiCall('/vevesiListak');
  
  if (!response.success) {
    return {
      success: true,
      data: mockShoppingLists,
      count: mockShoppingLists.length,
      struktura: "OsszVevesiLista"
    };
  }

  return response;
};

// Get shopping lists by user ID
export const getShoppingListsByUser = async (felhasznaloId) => {
  const response = await apiCall(`/felhasznalo/${felhasznaloId}/vevesiListak`);
  
  if (!response.success) {
    const userLists = mockShoppingLists.filter(l => l.FelhasznaloId === felhasznaloId);
    return {
      success: true,
      data: userLists,
      count: userLists.length,
      struktura: "OsszVevesiLista"
    };
  }

  return response;
};

// Get shopping lists by group ID
export const getShoppingListsByGroup = async (csoportId) => {
  const response = await apiCall(`/csoport/${csoportId}/vevesiListak`);
  
  if (!response.success) {
    const groupLists = mockShoppingLists.filter(l => l.CsoportId === csoportId);
    return {
      success: true,
      data: groupLists,
      count: groupLists.length,
      struktura: "OsszVevesiLista"
    };
  }

  return response;
};

// Get specific shopping list by ID
export const getShoppingListById = async (id) => {
  const response = await apiCall(`/vevesiLista/${id}`);
  
  if (!response.success) {
    const list = mockShoppingLists.find(l => l.id === id);
    if (list) {
      return {
        success: true,
        data: list,
        struktura: "VevesiLista"
      };
    }
    return response;
  }

  return response;
};

// Create shopping list
export const createShoppingList = async (listData) => {
  return apiCall('/vevesiListak', {
    method: 'POST',
    body: listData
  });
};

// Update shopping list
export const updateShoppingList = async (id, listData) => {
  return apiCall(`/vevesiLista/${id}`, {
    method: 'PUT',
    body: listData
  });
};

// Delete shopping list
export const deleteShoppingList = async (id) => {
  return apiCall(`/vevesiLista/${id}`, {
    method: 'DELETE'
  });
};

// Add item to shopping list
export const addItemToList = async (listId, itemData) => {
  return apiCall(`/vevesiLista/${listId}/tetel`, {
    method: 'POST',
    body: itemData
  });
};

// Remove item from shopping list
export const removeItemFromList = async (listId, itemId) => {
  return apiCall(`/vevesiLista/${listId}/tetel/${itemId}`, {
    method: 'DELETE'
  });
};

// Estimate total cost
export const estimateTotalCost = async (listId) => {
  const response = await getShoppingListById(listId);
  
  if (!response.success || !response.data) {
    return {
      success: false,
      data: null,
      message: 'Nem sikerült az ár becslése'
    };
  }

  const list = response.data;
  const items = list.VevesiLista || list.items || [];
  
  const total = items.reduce((sum, item) => {
    return sum + ((item.Ar || item.ar || 0) * (item.Mennyiseg || item.mennyiseg || 0));
  }, 0);

  const estimatedCost = {
    totalItems: items.length,
    baseCost: total,
    estimatedWithTax: Math.round(total * 1.27),
    currency: "HUF",
    description: `Nagyjából ${Math.round(total / 1000)}k - ${Math.round((total * 1.27) / 1000)}k Ft (ÁFA nélkül és azzal)`
  };

  return {
    success: true,
    data: estimatedCost,
    message: 'Ár sikeresen megbecsülve'
  };
};

// Create shopping list item (vevesi objektum)
export const createVevesiObjektum = async (itemData) => {
  return apiCall('/vevesiObjektum/create', {
    method: 'POST',
    body: itemData
  });
};

// Get shopping list statistics
export const getShoppingListStats = async () => {
  const response = await getAllShoppingLists();

  if (!response.success) {
    return {
      success: false,
      data: null
    };
  }

  const lists = Array.isArray(response.data) ? response.data : [response.data];
  let totalItems = 0;
  let totalCost = 0;

  lists.forEach(list => {
    const items = list.VevesiLista || list.items || [];
    totalItems += items.length;
    items.forEach(item => {
      totalCost += (item.Ar || item.ar || 0) * (item.Mennyiseg || item.mennyiseg || 0);
    });
  });

  return {
    success: true,
    data: {
      totalLists: lists.length,
      totalItems: totalItems,
      totalCost: totalCost,
      averageCostPerList: lists.length > 0 ? Math.round(totalCost / lists.length) : 0,
      averageItemsPerList: lists.length > 0 ? (totalItems / lists.length).toFixed(2) : 0
    }
  };
};

// Get all coupons
export const getAllCoupons = async () => {
  return apiCall('/kuponok/get');
};

// Create a new coupon
export const createCoupon = async (couponData) => {
  return apiCall('/kuponok/create', {
    method: 'POST',
    body: couponData
  });
};

// Update coupon
export const updateCoupon = async (id, couponData) => {
  return apiCall(`/kuponok/${id}`, {
    method: 'PUT',
    body: couponData
  });
};

// Delete coupon
export const deleteCoupon = async (id) => {
  return apiCall(`/kuponok/${id}`, {
    method: 'DELETE'
  });
};

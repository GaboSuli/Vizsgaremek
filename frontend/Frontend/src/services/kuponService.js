import { apiCall } from './api.js';

// Mock kupon adat for fallback
const mockKuponData = [
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
];

// Get all coupons from backend
export const getAllKupons = async () => {
  const response = await apiCall('/kuponok/get');
  
  if (!response.success) {
    return {
      success: true,
      data: mockKuponData,
      count: mockKuponData.length
    };
  }

  return response;
};

// Get kupon by ID
export const getKuponById = async (id) => {
  const response = await apiCall(`/kuponok/${id}`);
  
  if (!response.success) {
    const kupon = mockKuponData.find(k => k.id === id);
    if (kupon) {
      return {
        success: true,
        data: kupon
      };
    }
    return response;
  }

  return response;
};

// Create kupon
export const createKupon = async (kuponData) => {
  return apiCall('/kuponok', {
    method: 'POST',
    body: kuponData
  });
};

// Update kupon
export const updateKupon = async (id, updateData) => {
  return apiCall(`/kuponok/${id}`, {
    method: 'PUT',
    body: updateData
  });
};

// Delete kupon
export const deleteKupon = async (id) => {
  return apiCall(`/kuponok/${id}`, {
    method: 'DELETE'
  });
};

// Search kupon by code
export const searchKupon = async (kod) => {
  const response = await getAllKupons();
  
  if (!response.success) {
    return response;
  }

  const results = (Array.isArray(response.data) ? response.data : [response.data]).filter(k => 
    k.Kod.toLowerCase().includes(kod.toLowerCase())
  );

  return {
    success: true,
    data: results,
    count: results.length
  };
};

// Get expired kupons
export const getExpiredKupons = async () => {
  const response = await getAllKupons();
  
  if (!response.success) {
    return response;
  }

  const today = new Date().toISOString().split('T')[0];
  const expired = (Array.isArray(response.data) ? response.data : [response.data]).filter(k => k.LejarasiDatum < today);

  return {
    success: true,
    data: expired,
    count: expired.length
  };
};

// Get active kupons
export const getActiveKupons = async () => {
  const response = await getAllKupons();
  
  if (!response.success) {
    return response;
  }

  const today = new Date().toISOString().split('T')[0];
  const active = (Array.isArray(response.data) ? response.data : [response.data]).filter(k => 
    k.KezdesiDatum <= today && k.LejarasiDatum >= today
  );

  return {
    success: true,
    data: active,
    count: active.length
  };
};

import { apiCall } from './api.js';

// GET /kuponok/get — public, no auth required
export const getAllKupons = async () => {
  return apiCall('/kuponok/get');
};

// POST /kuponok/create — requires auth:sanctum + jogosultsag_szint >= 1
export const createKupon = async (data) => {
  return apiCall('/kuponok/create', { method: 'POST', body: data });
};

// PUT /kuponok/modositas/{id} — requires auth:sanctum + jogosultsag_szint >= 1
export const updateKupon = async (id, data) => {
  return apiCall(`/kuponok/modositas/${id}`, { method: 'PUT', body: data });
};

// DELETE /kuponok/torles/{id} — requires auth:sanctum
export const deleteKupon = async (id) => {
  return apiCall(`/kuponok/torles/${id}`, { method: 'DELETE' });
};

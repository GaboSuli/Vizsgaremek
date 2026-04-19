import { apiCall } from './api.js';

/**
 * GET /felhasznalo/osszKoltesei — user's total expenses by subcategory (all time)
 * Returns: [{ megnevezes: string, Osszegzett: number }]
 */
export const getUserTotalExpenses = async () => {
  const res = await apiCall('/felhasznalo/osszKoltesei', { includeAuth: true });
  return { success: res.success, data: Array.isArray(res.data) ? res.data : [] };
};

/**
 * GET /felhasznalo/eHaviKoltesei — user's expenses in the current month
 * Returns: [{ megnevezes: string, Osszegzett: number }]
 */
export const getUserMonthlyExpenses = async () => {
  const res = await apiCall('/felhasznalo/eHaviKoltesei', { includeAuth: true });
  return { success: res.success, data: Array.isArray(res.data) ? res.data : [] };
};

/**
 * GET /felhasznalo/eEviKoltesei — user's expenses in the current year
 * Returns: [{ megnevezes: string, Osszegzett: number }]
 */
export const getUserYearlyExpenses = async () => {
  const res = await apiCall('/felhasznalo/eEviKoltesei', { includeAuth: true });
  return { success: res.success, data: Array.isArray(res.data) ? res.data : [] };
};

/**
 * GET /statisztika/ev/{year} — all subcategories' avg price for a given year
 * Returns: [{ Alkategoria, Datum, KiszamoltAtlag, Mertekegyseg, LegolcsobbEgyMennyiseg, LegdragabbEgyMennyiseg, Ingadozas }]
 */
export const getYearMarketStats = async (year) => {
  const res = await apiCall(`/statisztika/ev/${year}`);
  return { success: res.success, data: Array.isArray(res.data) ? res.data : [] };
};
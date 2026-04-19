import { apiCall } from './api.js';

// ── Users ────────────────────────────────────────────
export async function getAllUsers() {
  return await apiCall('/felhasznalo/admin');
}

export async function deleteUser(userId) {
  return await apiCall(`/felhasznalo/torles/${userId}`, { method: 'DELETE' });
}


export async function getAdminShoppingActivity() {
  return await apiCall('/vevesilistak/admin');
}

// ── Groups ───────────────────────────────────────────
export async function getAllGroups() {
  return await apiCall('/csoportok/admin');
}

export async function deleteGroup(groupId) {
  return await apiCall(`/csoport/torles/${groupId}`, { method: 'DELETE' });
}

// ── Coupons ──────────────────────────────────────────
export async function getAllCoupons() {
  return await apiCall('/kuponok/get', { includeAuth: false });
}

export async function deleteCoupon(couponId) {
  return await apiCall(`/kuponok/torles/${couponId}`, { method: 'DELETE' });
}

export async function createCoupon(data) {
  return await apiCall('/kuponok/create', { method: 'POST', body: data });
}

export async function updateCoupon(id, data) {
  return await apiCall(`/kuponok/modositas/${id}`, { method: 'PUT', body: data });
}

// ── Contacts ─────────────────────────────────────────
export async function getAllContacts() {
  return await apiCall('/contact');
}

export async function deleteContact(contactId) {
  return await apiCall(`/contact/torles/${contactId}`, { method: 'DELETE' });
}

// ── Spending & Statistics ────────────────────────────
export async function getAdminSpending() {
  return await apiCall('/felhasznalo/osszKoltesei');
}

export async function getMonthlySpending() {
  return await apiCall('/felhasznalo/eHaviKoltesei');
}

export async function getYearlySpending() {
  return await apiCall('/felhasznalo/eEviKoltesei');
}

export async function getAllStatistics() {
  return await apiCall('/statisztika/all', { includeAuth: false });
}

export async function getYearStatistics(year) {
  return await apiCall(`/statisztika/ev/${year}`, { includeAuth: false });
}

export async function getAlkategoriak() {
  return await apiCall('/alkategoriak', { includeAuth: false });
}

export async function getFelhasznaloMennyiseg() {
  return await apiCall('/felhasznaloMennyiseg', { includeAuth: false });
}

export async function getLegtobbetVett() {
  return await apiCall('/legtobbetVett');
}

// ── Extended dashboard data ──────────────────────────
export async function getDashboardData() {
  const [users, groups, coupons, contacts, spending, monthlySpend, yearlySpend, stats] = await Promise.allSettled([
    getAllUsers(),
    getAllGroups(),
    getAllCoupons(),
    getAllContacts(),
    getAdminSpending(),
    getMonthlySpending(),
    getYearlySpending(),
    getAllStatistics(),
  ]);

  const extract = (r) => {
    if (r.status === 'fulfilled' && r.value.success) {
      const d = r.value.data;
      return Array.isArray(d) ? d : (d && Array.isArray(d.data) ? d.data : d || []);
    }
    return [];
  };

  const extractSingle = (r) => {
    if (r.status === 'fulfilled' && r.value.success) {
      return r.value.data;
    }
    return null;
  };

  return {
    users: extract(users),
    groups: extract(groups),
    coupons: extract(coupons),
    contacts: extract(contacts),
    spending: extractSingle(spending),
    monthlySpending: extractSingle(monthlySpend),
    yearlySpending: extractSingle(yearlySpend),
    statistics: extractSingle(stats),
  };
}

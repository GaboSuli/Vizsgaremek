import { apiCall } from './api.js';

// ── Users ────────────────────────────────────────────
export async function getAllUsers() {
  return await apiCall('/felhasznalo/all');
}

export async function deleteUser(userId) {
  return await apiCall(`/felhasznalo/torles/${userId}`, { method: 'DELETE' });
}

export async function updateUserRole(userId, jogosultsagSzint) {
  return await apiCall(`/felhasznalo/modositas/${userId}`, {
    method: 'PUT',
    body: { jogosultsag_szint: jogosultsagSzint },
  });
}

// ── Groups ───────────────────────────────────────────
export async function getAllGroups() {
  return await apiCall('/csoport/all');
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

// ── Contacts ─────────────────────────────────────────
export async function getAllContacts() {
  return await apiCall('/contact');
}

export async function deleteContact(contactId) {
  return await apiCall(`/contact/torles/${contactId}`, { method: 'DELETE' });
}

// ── Stats (aggregate from existing endpoints) ────────
export async function getSystemStats() {
  const [users, groups, coupons, contacts] = await Promise.allSettled([
    getAllUsers(),
    getAllGroups(),
    getAllCoupons(),
    getAllContacts(),
  ]);

  const extract = (r) => {
    if (r.status === 'fulfilled' && r.value.success) {
      const d = r.value.data;
      return Array.isArray(d) ? d : (d && Array.isArray(d.data) ? d.data : []);
    }
    return [];
  };

  return {
    users: extract(users),
    groups: extract(groups),
    coupons: extract(coupons),
    contacts: extract(contacts),
  };
}

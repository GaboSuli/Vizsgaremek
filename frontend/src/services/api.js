import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try { localStorage.setItem('auth_token', token); } catch (e) { void e; }
  } else {
    delete api.defaults.headers.common['Authorization'];
    try { localStorage.removeItem('auth_token'); } catch (e) { void e; }
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('current_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { void e; return null; }
}

function setCurrentUser(user) {
  try {
    if (user) localStorage.setItem('current_user', JSON.stringify(user));
    else localStorage.removeItem('current_user');
  } catch (e) { void e; }
}

(function initAuthFromStorage() {
  try {
    const t = localStorage.getItem('auth_token');
    if (t) api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
  } catch (e) { void e; }
})();

api.interceptors.request.use((cfg) => {
  try {
    if (!cfg.headers['Authorization']) {
      const t = localStorage.getItem('auth_token');
      if (t) cfg.headers['Authorization'] = `Bearer ${t}`;
    }
  } catch (e) { void e; }
  return cfg;
}, (error) => Promise.reject(error));

api.interceptors.response.use((res) => res, (error) => {
  const resp = error.response;

  if (resp && resp.status === 401) {
    try { localStorage.removeItem('auth_token'); } catch (e) { void e; }
    try { localStorage.removeItem('current_user'); } catch (e) { void e; }
    try { delete api.defaults.headers.common['Authorization']; } catch (e) { void e; }

    const current = window.location.pathname.toLowerCase();
    if (!current.includes('/login')) {
      window.location.href = '/login';
    }
  }

  return Promise.reject(error);
});

async function handleError(err) {
  const result = { success: false, status: null, message: 'Hiba történt', errors: null };
  if (!err) return result;

  if (err.response) {
    result.status = err.response.status;
    result.message = (err.response.data && (err.response.data.message || err.response.data.msg)) || err.message || 'Hiba a szerverről';
    if (err.response.status === 422 && err.response.data && err.response.data.errors) {
      result.errors = err.response.data.errors;
    } else if (err.response.data && typeof err.response.data === 'object') {
      result.errors = err.response.data;
    }

    if (err.response.status === 409) {
      result.message = err.response.data && (err.response.data.message || 'Konfliktus: erőforrás már létezik');
    }
  } else {
    result.message = err.message || 'Hálózati hiba';
  }

  return result;
}

export async function loginUser(payload) {
  try {
    const resp = await api.post('/felhasznalo/login', payload);
    const data = resp.data || {};
    const token = data.token || data.access_token || (data.data && (data.data.token || data.data.access_token));
    const user = data.user || data.data || data.current_user || null;

    if (token) setAuthToken(token);
    if (user) setCurrentUser(user);

    return { success: true, status: resp.status, data: { token, user }, raw: data };
  } catch (err) {
    return await handleError(err);
  }
}

export async function registerUser(payload) {
  try {
    const resp = await api.post('/felhasznalo/register', payload);
    const data = resp.data || {};
    const token = data.token || data.access_token || (data.data && (data.data.token || data.data.access_token));
    const user = data.user || data.data || data.current_user || null;

    if (token) setAuthToken(token);
    if (user) setCurrentUser(user);

    return { success: true, status: resp.status, data: { token, user }, raw: data };
  } catch (err) {
    return await handleError(err);
  }
}

export async function apiCall(path, options = {}) {
  const { method = 'GET', body = null, includeAuth = true, headers = {} } = options;

  const cfg = {
    url: path,
    method: method.toLowerCase(),
    headers: { ...headers }
  };

  if (body && (cfg.method === 'post' || cfg.method === 'put' || cfg.method === 'patch' || cfg.method === 'delete')) {
    cfg.data = body;
  }

  let prevAuth = null;
  if (!includeAuth) {
    prevAuth = api.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['Authorization'];
  }

  try {
    const resp = await api.request(cfg);
    return { success: true, status: resp.status, data: resp.data, raw: resp.data };
  } catch (err) {
    return await handleError(err);
  } finally {
    if (!includeAuth) {
      if (prevAuth) api.defaults.headers.common['Authorization'] = prevAuth;
    }
  }
}

// Helpers used across the app (use apiCall to get normalized responses)
export async function getCsoportVevesiListak(csoportId) {
  return await apiCall(`/csoport/${csoportId}/vevesiListak`);
}

export async function addVevesiObjektum(data) {
  return await apiCall('/vevesiObjektum/create', { method: 'POST', body: data });
}

export async function updateVevesiObjektum(objektumId, data) {
  return await apiCall(`/vevesiObjektum/modositas/${objektumId}`, { method: 'PUT', body: data });
}

export async function deleteVevesiObjektum(objektumId) {
  return await apiCall(`/vevesiObjektum/torles/${objektumId}`, { method: 'DELETE' });
}

export async function addCsoportTag(csoport_id, felhasznalo_id) {
  return await apiCall('/csoportTagsag/create', { method: 'POST', body: { csoport_id, felhasznalo_id } });
}

export async function editCsoportTag(csoportId, data) {
  return await apiCall(`/csoportTagsag/modositas/${csoportId}`, { method: 'PUT', body: data });
}

export async function deleteCsoportTag(tagsagId) {
  return await apiCall(`/csoportTagsag/torles/${tagsagId}`, { method: 'DELETE' });
}

export async function getFelhasznaloCsoportjai() {
  return await apiCall('/felhasznalo/csoportjai');
}

export async function getFelhasznaloVevesiListak() {
  return await apiCall('/felhasznalo/vevesiListak');
}

export async function getCsoportFelhasznalok(csoportId) {
  return await apiCall(`/csoport/${csoportId}/felhasznalok`);
}

export async function createCsoport(data) {
  return await apiCall('/csoport/create', { method: 'POST', body: data });
}

export async function updateCsoport(csoportId, data) {
  return await apiCall(`/csoport/modositas/${csoportId}`, { method: 'PUT', body: data });
}

export async function deleteCsoport(csoportId) {
  return await apiCall(`/csoport/torles/${csoportId}`, { method: 'DELETE' });
}

export async function createVevesiLista(data) {
  return await apiCall('/vevesiLista/create', { method: 'POST', body: data });
}

export async function deleteVevesiLista(listaId) {
  return await apiCall(`/vevesiLista/torles/${listaId}`, { method: 'DELETE' });
}

export default api;

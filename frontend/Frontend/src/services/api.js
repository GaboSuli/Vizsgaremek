// Csoporthoz tartozó vevési lista lekérése
export async function getCsoportVevesiListak(csoportId) {
  try {
    const resp = await api.get(`/csoport/${csoportId}/vevesiListak`);
    return resp.data;
  } catch (err) {
    throw err;
  }
}

// Új vevési lista elem hozzáadása
export async function addVevesiObjektum(data) {
  try {
    const resp = await api.post('/vevesiObjektum/create', data);
    return resp.data;
  } catch (err) {
    throw err;
  }
}

// Vevési objektum módosítása
export async function updateVevesiObjektum(objektumId, data) {
  try {
    const resp = await api.put(`/vevesiObjektum/modositas/${objektumId}`, data);
    return resp.data;
  } catch (err) {
    throw err;
  }
}

// Vevési objektum törlése
export async function deleteVevesiObjektum(objektumId) {
  try {
    const resp = await api.delete(`/vevesiObjektum/torles/${objektumId}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
}
// Új tag hozzáadása csoporthoz
export async function addCsoportTag(csoport_id, felhasznalo_id) {
  try {
    const resp = await api.post('/csoportTagsag/create', { csoport_id, felhasznalo_id });
    return resp.data;
  } catch (err) {
    throw err;
  }
}

// Csoport tagság módosítása (becenév, jogosultság)
export async function editCsoportTag(csoportId, data) {
  try {
    const resp = await api.put(`/csoportTagsag/modositas/${csoportId}`, data);
    return resp.data;
  } catch (err) {
    throw err;
  }
}

// Csoport tagság törlése
export async function deleteCsoportTag(tagsagId) {
  try {
    const resp = await api.delete(`/csoportTagsag/torles/${tagsagId}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
}
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
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
  console.error('API error', {
    url: error.config && error.config.url,
    status: resp && resp.status,
    data: resp && resp.data,
    message: error.message
  });

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

  console.error('handleError result', result);
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

// Lekéri a bejelentkezett felhasználó csoportjait
export async function getFelhasznaloCsoportjai() {
  try {
    const resp = await api.get('/felhasznalo/csoportjai');
    return resp.data;
  } catch (err) {
    throw err;
  }
}

export default api;

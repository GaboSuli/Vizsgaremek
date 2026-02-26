import axios from 'axios';

// Base axios instance for API calls
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Set or remove Authorization header and persist token to localStorage
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try { localStorage.setItem('auth_token', token); } catch (e) { void e; }
  } else {
    delete api.defaults.headers.common['Authorization'];
    try { localStorage.removeItem('auth_token'); } catch (e) { void e; }
  }
}

// Read current_user from localStorage
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('current_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { void e; return null; }
}

// Save current_user to localStorage
function setCurrentUser(user) {
  try {
    if (user) localStorage.setItem('current_user', JSON.stringify(user));
    else localStorage.removeItem('current_user');
  } catch (e) { void e; }
}

// Ensure Authorization header exists from stored token on cold-start
(function initAuthFromStorage() {
  try {
    const t = localStorage.getItem('auth_token');
    if (t) api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
  } catch (e) { void e; }
})();

// Request interceptor: ensure header present if token in localStorage
api.interceptors.request.use((cfg) => {
  try {
    if (!cfg.headers['Authorization']) {
      const t = localStorage.getItem('auth_token');
      if (t) cfg.headers['Authorization'] = `Bearer ${t}`;
    }
  } catch (e) { void e; }
  return cfg;
}, (error) => Promise.reject(error));

// Response interceptor: handle 401 centrally
api.interceptors.response.use((res) => res, (error) => {
  const resp = error.response;
  console.error('API error', {
    url: error.config && error.config.url,
    status: resp && resp.status,
    data: resp && resp.data,
    message: error.message
  });

  if (resp && resp.status === 401) {
    // Clear stored auth and redirect to login
    try { localStorage.removeItem('auth_token'); } catch (e) { void e; }
    try { localStorage.removeItem('current_user'); } catch (e) { void e; }
    try { delete api.defaults.headers.common['Authorization']; } catch (e) { void e; }

    // Avoid infinite redirect loops: only redirect if not already on login page
    // if we're not already on the login route, send user there
    const current = window.location.pathname.toLowerCase();
    if (!current.includes('/login')) {
      window.location.href = '/login';
    }
  }

  return Promise.reject(error);
});

// Centralized error formatter
async function handleError(err) {
  // Default structure
  const result = { success: false, status: null, message: 'Hiba történt', errors: null };
  if (!err) return result;
  if (err.response) {
    result.status = err.response.status;
    result.message = (err.response.data && (err.response.data.message || err.response.data.msg)) || err.message || 'Hiba a szerverről';
    // Normalize validation errors (Laravel style: errors object)
    if (err.response.status === 422 && err.response.data && err.response.data.errors) {
      result.errors = err.response.data.errors;
    } else if (err.response.data && typeof err.response.data === 'object') {
      result.errors = err.response.data;
    }

    // Specific status mapping
    if (err.response.status === 409) {
      result.message = err.response.data && (err.response.data.message || 'Konfliktus: erőforrás már létezik');
    }

  } else {
    result.message = err.message || 'Hálózati hiba';
  }

  // Log details for debugging
  console.error('handleError result', result);
  return result;
}

// API: login user
export async function loginUser(payload) {
  try {
    const resp = await api.post('/felhasznalo/login', payload);
    // Expect 200 and body with token and user data
    const data = resp.data || {};
    // Common token locations
    const token = data.token || data.access_token || (data.data && (data.data.token || data.data.access_token));
    const user = data.user || data.data || data.current_user || null;

    if (token) setAuthToken(token);
    if (user) setCurrentUser(user);

    return { success: true, status: resp.status, data: { token, user }, raw: data };
  } catch (err) {
    return await handleError(err);
  }
}

// API: register user
export async function registerUser(payload) {
  try {
    const resp = await api.post('/felhasznalo/register', payload);
    const data = resp.data || {};
    // On successful registration backend may return created user and optionally token
    const token = data.token || data.access_token || (data.data && (data.data.token || data.data.access_token));
    const user = data.user || data.data || data.current_user || null;

    if (token) setAuthToken(token);
    if (user) setCurrentUser(user);

    // Some APIs return 201 for created
    return { success: true, status: resp.status, data: { token, user }, raw: data };
  } catch (err) {
    return await handleError(err);
  }
}

// Backwards-compatible apiCall wrapper used by older services
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

  // If includeAuth is false, temporarily remove Authorization header
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

export default api;

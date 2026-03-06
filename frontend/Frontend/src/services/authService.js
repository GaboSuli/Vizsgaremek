import axios from "axios";

// Backend API URL
const API_URL = "http://127.0.0.1:8000/api";

// --- Axios instance ---
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// --- LocalStorage kulcsok ---
const TOKEN_KEY = "auth_token";
const USER_KEY = "current_user";

// --- Token és user helper függvények ---
const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};

const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (err) { console.warn("localStorage error:", err); }
};

const setUser = (user) => {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {console.log() }
};

export const getStoredUserInfo = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const isAuthenticated = () => !!getToken();

// --- Axios interceptors ---
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      setToken(null);
      setUser(null);
    }
    return Promise.reject(error);
  }
);

// --- Hibakezelő ---
const handleError = (error) => {
  if (!error) return { success: false, message: "Ismeretlen hiba" };

  if (error.response) {
    return {
      success: false,
      status: error.response.status,
      message: error.response.data?.message || error.response.data?.msg || "Szerver hiba",
      errors: error.response.data?.errors || null,
      url: error.config?.url || null,
    };
  }

  return { success: false, message: error.message || "Hálózati hiba" };
};

// --- Siker handler ---
const handleSuccess = (resp) => {
  const data = resp?.data || {};
  const token = data.token || data.access_token || data?.data?.token || data?.data?.access_token;
  const user = data.user || data.data || null;

  if (token) setToken(token);
  if (user) setUser(user);

  return { success: true, status: resp.status, data, token, user };
};

// --- Auth funkciók ---
export const registerUser = async (userData) => {
  try {
    // Laravel backend mezőnevek szerint
    const resp = await api.post("/felhasznalo/register", {
      name: userData.name,                      // backend "nev"
      email: userData.email,
      jelszo: userData.password,               // backend "jelszo"
      jelszo_confirmation: userData.password_confirmation || userData.passwordConfirm,
    });
    return handleSuccess(resp);
  } catch (error) {
    return handleError(error);
  }
};

export const loginUser = async (credentials) => {
  try {
    const resp = await api.post("/felhasznalo/login", {
      email: credentials.email,
      jelszo: credentials.password,            // backend "jelszo"
    });
    return handleSuccess(resp);
  } catch (error) {
    return handleError(error);
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/felhasznalo/logout");
  } catch { /* ignore */ }

  setToken(null);
  setUser(null);
  return { success: true, message: "Sikeres kijelentkezés" };
};

// --- Get current user ---
export const getCurrentUser = async () => {
  try {
    const resp = await api.get("/felhasznalo");
    return { success: true, data: resp.data };
  } catch {
    try {
      const resp = await api.get("/user");
      return { success: true, data: resp.data };
    } catch (error) {
      return handleError(error);
    }
  }
};

// --- Export default Axios instance ---
export default api;
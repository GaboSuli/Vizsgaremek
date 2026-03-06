// src/services/authService.js
import axios from "axios";

/* ================================
   Axios instance (Vite proxy)
   ================================ */
const api = axios.create({
  baseURL: "/api", // Vite proxy átirányítja a Laravel backendre
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/* ================================
   Local storage keys
   ================================ */
const TOKEN_KEY = "auth_token";
const USER_KEY = "current_user";

/* ================================
   Token / User helpers
   ================================ */
export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (e) { console.warn("localStorage error:", e); }
};

export const setUser = (user) => {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch (e) { console.warn("localStorage error:", e); }
};

export const getStoredUserInfo = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const isAuthenticated = () => !!getToken();

/* ================================
   Axios interceptors
   ================================ */
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

/* ================================
   Error / Success handlers
   ================================ */
const handleError = (error) => {
  if (!error) return { success: false, message: "Ismeretlen hiba" };
  if (error.response) {
    return {
      success: false,
      status: error.response.status,
      message: error.response.data?.message || error.response.data?.msg || "Szerver hiba",
      errors: error.response.data?.errors || null,
    };
  }
  return { success: false, message: error.message || "Hálózati hiba" };
};

const handleSuccess = (resp) => {
  const data = resp?.data || {};
  const token = data.token || data.access_token || data?.data?.token || data?.data?.access_token;
  const user = data.user || data.data || null;

  if (token) setToken(token);
  if (user) setUser(user);

  return { success: true, status: resp.status, data, token, user };
};

/* ================================
   Auth functions
   ================================ */
export const registerUser = async (userData) => {
  try {
    const resp = await api.post("/felhasznalo/register", {
      nev: userData.name,  // ← itt változott
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.password_confirmation || userData.passwordConfirm
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
      password: credentials.password,
    });
    return handleSuccess(resp);
  } catch (error) {
    return handleError(error);
  }
};

export const logoutUser = async () => {
  setToken(null);
  setUser(null);
  try {
    await api.post("/felhasznalo/logout"); // opcionális, ha backend logout endpoint is van
  } catch { /* ignore */ }
  return { success: true, message: "Sikeres kijelentkezés" };
};

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

/* ================================
   User CRUD
   ================================ */
export const getUserById = async (id) => {
  try {
    const resp = await api.get(`/felhasznalo/${id}`);
    return handleSuccess(resp);
  } catch (error) {
    return handleError(error);
  }
};

export const updateUser = async (id, data) => {
  try {
    const path = id ? `/felhasznalo/modositas/${id}` : "/felhasznalo/modositas";
    const resp = await api.put(path, data);
    return handleSuccess(resp);
  } catch (error) {
    return handleError(error);
  }
};

export const deleteUser = async (id) => {
  try {
    const resp = await api.delete(`/felhasznalo/torles/${id}`);
    return handleSuccess(resp);
  } catch (error) {
    return handleError(error);
  }
};

/* ================================
   Export default
   ================================ */
export default api;
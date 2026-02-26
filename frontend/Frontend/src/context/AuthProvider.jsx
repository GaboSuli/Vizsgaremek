import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext.js';
import {
  loginUser as apiLoginUser,
  registerUser as apiRegisterUser,
  setAuthToken,
  getCurrentUser as readStoredUser
} from '../services/api.js';
import { getCurrentUser as fetchCurrentUser } from '../services/authService.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      // if we have a token stored, attempt to verify it by fetching /user
      try {
        const storedUser = readStoredUser();
        if (storedUser) {
          // try to refresh from server in case token expired/changed
          const resp = await fetchCurrentUser();
          if (resp.success && resp.data) {
            setUser(resp.data);
            // ensure storage is up to date
            try { localStorage.setItem('current_user', JSON.stringify(resp.data)); } catch (e) { }
          } else {
            // token invalid
            setUser(null);
            setAuthToken(null);
          }
        }
      } catch (e) {
        console.error('auth init error', e);
        setUser(null);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    }

    init();

    // Global 401 listener: if another tab clears auth_token, react here
    const onStorage = (e) => {
      if (e.key === 'auth_token' && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await apiLoginUser({ email, password });
      if (res && res.success) {
        const current = readStoredUser();
        setUser(current);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await apiRegisterUser(payload);
      if (res && res.success) {
        const current = readStoredUser();
        setUser(current);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    try { localStorage.removeItem('current_user'); } catch (e) { }
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const resp = await fetchCurrentUser();
      if (resp.success && resp.data) {
        setUser(resp.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

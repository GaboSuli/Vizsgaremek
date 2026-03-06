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
      try {
        const storedUser = readStoredUser();
        if (storedUser) {
          const resp = await fetchCurrentUser();
          if (resp.success && resp.data) {
            setUser(resp.data);
            try {
              localStorage.setItem('current_user', JSON.stringify(resp.data));
            } catch {
              // szándékosan elnyeljük a hibát EZT NE töröld ki
            }
          } else {
            setUser(null);
            setAuthToken(null);
          }
        }
      } catch {
        setUser(null);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    }

    init();

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
    try {
      localStorage.removeItem('current_user');
    } catch {
              // szándékosan elnyeljük a hibát EZT NE töröld ki
    }
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const resp = await fetchCurrentUser();
      if (resp.success && resp.data) {
        setUser(resp.data);
      }
    } catch {
              // szándékosan elnyeljük a hibát EZT NE töröld ki
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
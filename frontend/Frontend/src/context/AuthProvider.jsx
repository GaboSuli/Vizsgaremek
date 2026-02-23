import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext.js';
import { loginUser as apiLoginUser, registerUser as apiRegisterUser, setAuthToken, getCurrentUser } from '../services/api.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user from localStorage if available
    const u = getCurrentUser();
    if (u) setUser(u);
    setLoading(false);

    // Global 401 listener: if a different tab clears auth_token, react here
    const onStorage = (e) => {
      if (e.key === 'auth_token' && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = async ({ email, password }, target) => {
    setLoading(true);
    try {
      const res = await apiLoginUser({ email, password });
      if (res && res.success) {
        const current = getCurrentUser();
        setUser(current);
        // Redirect to requested target or root
        if (target) {
          window.location.href = `/?page=${encodeURIComponent(target)}`;
        } else {
          window.location.href = '/';
        }
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload, target) => {
    setLoading(true);
    try {
      const res = await apiRegisterUser(payload);
      if (res && res.success) {
        const current = getCurrentUser();
        setUser(current);
        if (target) {
          window.location.href = `/?page=${encodeURIComponent(target)}`;
        } else {
          window.location.href = '/';
        }
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear token and user
    setAuthToken(null);
    try { localStorage.removeItem('current_user'); } catch (e) { void e; }
    setUser(null);
    window.location.href = '/';
  };

  const refreshUser = () => {
    const u = getCurrentUser();
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}


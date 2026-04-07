import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext.js';
import {
  loginUser as apiLoginUser,
  registerUser as apiRegisterUser,
  setAuthToken,
  getCurrentUser as readStoredUser
} from '../services/api.js';
import { getCurrentUser as fetchCurrentUser } from '../services/authService.js';

// Read user + token from localStorage synchronously so the first render
// already knows about a previous session — eliminates the blank-flash.
function readStoredState() {
  try {
    const token = localStorage.getItem('auth_token');
    const raw   = localStorage.getItem('current_user');
    const user  = (token && raw) ? JSON.parse(raw) : null;
    // loading=true only when there's a token to verify
    return { user, loading: !!token };
  } catch {
    return { user: null, loading: false };
  }
}

export function AuthProvider({ children }) {
  const init = readStoredState();
  const [user, setUser]       = useState(init.user);
  const [loading, setLoading] = useState(init.loading);

  useEffect(() => {
    // Only verify the token when one exists; otherwise we're already done.
    const token = (() => { try { return localStorage.getItem('auth_token'); } catch { return null; } })();
    if (!token) { setLoading(false); return; }

    async function verify() {
      try {
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
      } catch {
        setUser(null);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    }

    verify();

    const onStorage = (e) => {
      if (e.key === 'auth_token' && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // login/register do NOT touch global `loading` — the form has its own
  // local loading state, and we must not blank the page during submission.
  const login = async ({ email, password }) => {
    try {
      const res = await apiLoginUser({ email, password });
      if (res && res.success) {
        const current = readStoredUser();
        setUser(current);
      }
      return res;
    } catch {
      return { success: false, message: 'Hálózati hiba' };
    }
  };

  const register = async (payload) => {
    try {
      const res = await apiRegisterUser(payload);
      if (res && res.success) {
        const current = readStoredUser();
        setUser(current);
      }
      return res;
    } catch {
      return { success: false, message: 'Hálózati hiba' };
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
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isAdmin: !!(user && (user.jogosultsag_szint === 255 || user.Jogosultsag_szint === 255)) }}>
      {children}
    </AuthContext.Provider>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { apiCall } from '../services/api.js';
import { loginUser, registerUser, setStoredUserInfo } from '../services/authService.js';
import './SiteUsersPage.css';

export default function SiteUsersPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    registeredToday: 0,
    newThisWeek: 0
  });
  const [visibleCounts, setVisibleCounts] = useState({
    totalUsers: 0,
    activeToday: 0,
    registeredToday: 0,
    newThisWeek: 0
  });
  const visibleRef = useRef(visibleCounts);

  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', passwordConfirm: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setMessage('');
      try {
        // Try fetching site-wide user stats from backend
        const res = await apiCall('/felhasznalo/stats', { includeAuth: false });
        if (res.success && res.data) {
          const data = res.data;
          setStats({
            totalUsers: data.totalUsers || data.total || 1234,
            activeToday: data.activeToday || data.active || 123,
            registeredToday: data.registeredToday || data.today || 5,
            newThisWeek: data.newThisWeek || data.week || 20
          });
        } else {
          // Fallback mock data
          setStats({ totalUsers: 1234, activeToday: 123, registeredToday: 5, newThisWeek: 20 });
        }
      } catch (error) {
        console.error(error);
        setStats({ totalUsers: 1234, activeToday: 123, registeredToday: 5, newThisWeek: 20 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Animate counters when stats change
  useEffect(() => {
    const duration = 900; // ms
    const steps = 45;
    const interval = Math.max(10, Math.floor(duration / steps));

    // read start values from ref to avoid effect dependency on visibleCounts
    const start = { ...visibleRef.current };
    const end = { ...stats };
    const diff = {
      totalUsers: end.totalUsers - start.totalUsers,
      activeToday: end.activeToday - start.activeToday,
      registeredToday: end.registeredToday - start.registeredToday,
      newThisWeek: end.newThisWeek - start.newThisWeek
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const next = {
        totalUsers: Math.round(start.totalUsers + diff.totalUsers * progress),
        activeToday: Math.round(start.activeToday + diff.activeToday * progress),
        registeredToday: Math.round(start.registeredToday + diff.registeredToday * progress),
        newThisWeek: Math.round(start.newThisWeek + diff.newThisWeek * progress)
      };
      setVisibleCounts(next);
      visibleRef.current = next;

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isLogin) {
        const res = await loginUser({ email: authForm.email, password: authForm.password });
        if (res.success) {
          setStoredUserInfo(res.data || {});
          setMessage('Sikeres bejelentkezés');
          setTimeout(() => window.location.reload(), 800);
        } else {
          setMessage(res.message || 'Sikertelen bejelentkezés');
        }
      } else {
        if (authForm.password !== authForm.passwordConfirm) {
          setMessage('A jelszavak nem egyeznek');
          return;
        }
        const res = await registerUser({ name: authForm.name, email: authForm.email, password: authForm.password, password_confirmation: authForm.passwordConfirm });
        if (res.success) {
          setMessage('Sikeres regisztráció! Bejelentkezés...');
          setTimeout(() => window.location.reload(), 900);
        } else {
          setMessage(res.message || 'Sikertelen regisztráció');
        }
      }
    } catch (error) {
      console.error(error);
      setMessage('Hiba történt');
    }
  };

  return (
    <div className="site-users-page">
      <div className="hero">
        <h1>Felhasználók & Statisztika</h1>
        <p>Itt láthatod, hányan regisztráltak az oldalra, kik aktívak ma, és könnyen csatlakozhatsz vagy bejelentkezhetsz.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => { setShowAuth(true); setIsLogin(false); }}>Csatlakozz</button>
          <button className="btn-outline" onClick={() => { setShowAuth(true); setIsLogin(true); }}>Bejelentkezés</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-body">
            <div className="stat-title">Összes regisztrált</div>
            <div className="stat-value">{loading ? '...' : visibleCounts.totalUsers.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-body">
            <div className="stat-title">Aktív ma</div>
            <div className="stat-value">{loading ? '...' : visibleCounts.activeToday.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🆕</div>
          <div className="stat-body">
            <div className="stat-title">Ma regisztrált</div>
            <div className="stat-value">{loading ? '...' : visibleCounts.registeredToday.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-body">
            <div className="stat-title">Új ezen a héten</div>
            <div className="stat-value">{loading ? '...' : visibleCounts.newThisWeek.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {showAuth && (
        <div className={`auth-panel ${showAuth ? 'enter' : 'exit'}`}> 
          <div className="auth-card">
            <div className="auth-header">
              <h3>{isLogin ? 'Bejelentkezés' : 'Regisztráció'}</h3>
              <button className="close-btn" onClick={() => setShowAuth(false)}>✕</button>
            </div>
            <form onSubmit={handleAuthSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label>Név</label>
                  <input name="name" value={authForm.name} onChange={handleAuthChange} required />
                </div>
              )}

              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={authForm.email} onChange={handleAuthChange} required />
              </div>

              <div className="form-group">
                <label>Jelszó</label>
                <input name="password" type="password" value={authForm.password} onChange={handleAuthChange} required minLength={8} />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label>Jelszó megerősítése</label>
                  <input name="passwordConfirm" type="password" value={authForm.passwordConfirm} onChange={handleAuthChange} required minLength={8} />
                </div>
              )}

              <div className="auth-actions">
                <button type="submit" className="btn-primary">{isLogin ? 'Bejelentkezés' : 'Regisztráció'}</button>
                <button type="button" className="btn-link" onClick={() => setIsLogin(prev => !prev)}>{isLogin ? 'Regisztrálok' : 'Van már fiókom'}</button>
              </div>

              {message && <div className="auth-message">{message}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

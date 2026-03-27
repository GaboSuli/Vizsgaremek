import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../context/useAuth.js';
import './LoginPage.css';

export default function LoginPage({ initialMode } = {}) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(initialMode !== 'register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', passwordConfirm: '' });

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if ((params.get('page') || '').toLowerCase() === 'register') setIsLogin(false);
  }, [location.search]);

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.setAttribute('data-auth-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-auth-theme');
    }
  }, [isDarkMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const res = await login({ email: formData.email, password: formData.password });
        if (res.success) {
          const loggedInUser = res.data?.user;
          const szint = Number(loggedInUser?.jogosultsag_szint ?? loggedInUser?.Jogosultsag_szint ?? 0);
          const destination = szint === 255 ? '/admin' : from;
          navigate(destination, { replace: true });
          return;
        }
        setError(res.errors ? Object.values(res.errors).flat().join(' ') : res.message || 'Sikertelen bejelentkezés');
      } else {
        if (!formData.name.trim()) { setError('A név megadása kötelező'); return; }
        if (formData.password !== formData.passwordConfirm) { setError('A jelszavak nem egyeznek'); return; }
        const res = await register({
          nev: formData.name, email: formData.email,
          password: formData.password, password_confirmation: formData.passwordConfirm
        });
        if (res.success) { navigate(from, { replace: true }); return; }
        setError(res.errors ? Object.values(res.errors).flat().join(' ') : res.message || 'Sikertelen regisztráció');
      }
    } catch { setError('Hálózati hiba történt'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-root">
      {/* Left panel — Branding */}
      <div className="auth-brand">
        {/* Theme toggle button */}
        <button
          className="auth-theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? 'Világos mód' : 'Sötét mód'}
          type="button"
        >
          {isDarkMode ? (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        <div className="auth-brand-content">
          <div className="auth-brand-logo">
            <div className="fp-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.25"/>
                <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="auth-brand-name">Szaldon</span>
          </div>
          <h2 className="auth-brand-headline">Bevásárlás örömmel,<br/>tervezés könnyedén</h2>
          <p className="auth-brand-sub">Csatlakozz a közösséghez és tedd hatékonyabbá a mindennapi bevásárlást.</p>
          <div className="auth-brand-features">
            {['Közös bevásárlólisták csoportokkal', 'Kuponok és kedvezmények egy helyen', 'Kiadási statisztikák és trendek', 'Ingyenes és könnyen kezelhető'].map((f, i) => (
              <div key={i} className="auth-brand-feature">
                <div className="auth-brand-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h1 className="auth-form-title">
              {isLogin ? 'Üdv vissza ' : 'Fiók létrehozása'}
            </h1>
            <p className="auth-form-sub">
              {isLogin ? 'Jelentkezz be a fiókodba' : 'Regisztrálj ingyen, pár másodperc alatt'}
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" style={{marginBottom: '20px', borderRadius: 'var(--r-md)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{flexShrink:0}}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Teljes név</label>
                <input type="text" className="form-control" name="name" value={formData.name}
                  onChange={handleChange} required disabled={loading} autoComplete="name" placeholder="Pl. Kiss Béla" />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email cím</label>
              <input type="email" className="form-control" name="email" value={formData.email}
                onChange={handleChange} required disabled={loading} autoComplete="email" placeholder="pelda@email.hu" />
            </div>
            <div className="form-group">
              <label className="form-label">Jelszó</label>
              <input type="password" className="form-control" name="password" value={formData.password}
                onChange={handleChange} required minLength="8" disabled={loading}
                autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder="Minimum 8 karakter" />
            </div>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Jelszó megerősítése</label>
                <input type="password" className="form-control" name="passwordConfirm" value={formData.passwordConfirm}
                  onChange={handleChange} required minLength="8" disabled={loading}
                  autoComplete="new-password" placeholder="Jelszó ismétlése" />
              </div>
            )}
            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner spinner-sm"/>
                  {isLogin ? 'Bejelentkezés...' : 'Regisztráció...'}
                </>
              ) : (isLogin ? 'Bejelentkezés' : 'Regisztráció')}
            </button>
          </form>

          <div className="auth-toggle">
            <span>{isLogin ? 'Még nincs fiókod?' : 'Már van fiókod?'}</span>
            <button className="auth-toggle-btn" onClick={() => { setIsLogin(!isLogin); setError(''); }} disabled={loading}>
              {isLogin ? 'Regisztrálj ingyen' : 'Bejelentkezés'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

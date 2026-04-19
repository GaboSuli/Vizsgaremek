import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../context/useAuth.js';
import useTheme from '../context/useTheme.js';
import './LoginPage.css';

function getPasswordStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export default function LoginPage({ initialMode } = {}) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const [isLogin, setIsLogin] = useState(initialMode !== 'register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [touched, setTouched] = useState({});

  const from = location.state?.from?.pathname || '/dashboard';
  const pwStrength = getPasswordStrength(formData.password);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if ((params.get('page') || '').toLowerCase() === 'register') setIsLogin(false);
  }, [location.search]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  }, [fieldErrors]);

  const handleBlur = useCallback((e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  }, []);

  const validate = useCallback(() => {
    const errs = {};
    if (!isLogin && !formData.name.trim()) errs.name = 'A név megadása kötelező';
    if (!formData.email.trim()) errs.email = 'Az email cím megadása kötelező';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Érvénytelen email cím';
    if (!formData.password) errs.password = 'A jelszó megadása kötelező';
    else if (formData.password.length < 8) errs.password = 'A jelszó minimum 8 karakter legyen';
    if (!isLogin && formData.password !== formData.passwordConfirm)
      errs.passwordConfirm = 'A jelszavak nem egyeznek';
    return errs;
  }, [isLogin, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      setTouched({ name: true, email: true, password: true, passwordConfirm: true });
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const res = await login({ email: formData.email, password: formData.password });
        if (res.success) { navigate(from, { replace: true }); return; }
        setError(res.errors ? Object.values(res.errors).flat().join(' ') : res.message || 'Sikertelen bejelentkezés');
      } else {
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

  const switchMode = () => {
    setIsLogin(v => !v);
    setError('');
    setFieldErrors({});
    setTouched({});
    setFormData({ name: '', email: '', password: '', passwordConfirm: '' });
  };

  const strengthLabel = ['', 'Gyenge', 'Gyenge', 'Közepes', 'Erős', 'Nagyon erős'];
  const strengthClass = ['', 'auth-pw-s1', 'auth-pw-s1', 'auth-pw-s2', 'auth-pw-s3', 'auth-pw-s4'];

  return (
    <div className="auth-page">
      {/* Animated background */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>

      {/* Theme toggle */}
      <button className="auth-theme-btn" onClick={toggleTheme} title={isDarkMode ? 'Világos mód' : 'Sötét mód'} type="button">
        {isDarkMode ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* Card */}
      <div className={`auth-card ${isLogin ? 'auth-card--login' : 'auth-card--register'}`}>

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
              <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.25"/>
              <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="auth-logo-name">Szaldon</span>
          <Link to="/" className="auth-back-home" aria-label="Vissza a főoldalra">
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
              <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Főoldal
          </Link>
        </div>

        {/* Header */}
        <div className="auth-card-header">
          <h1 className="auth-title">{isLogin ? 'Üdv vissza!' : 'Fiók létrehozása'}</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Jelentkezz be a fiókodba a folytatáshoz' : 'Regisztrálj ingyen, pár másodperc alatt'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-alert auth-alert--error">
            <ErrorIcon />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          {/* Name — register only */}
          <div className={`auth-field-wrap ${!isLogin ? 'auth-field-wrap--visible' : 'auth-field-wrap--hidden'}`}>
            {!isLogin && (
              <div className="auth-field">
                <label className="auth-label">Teljes név</label>
                <div className={`auth-input-wrap ${touched.name && fieldErrors.name ? 'auth-input--error' : touched.name && formData.name ? 'auth-input--ok' : ''}`}>
                  <UserIcon />
                  <input
                    type="text" name="name" value={formData.name}
                    onChange={handleChange} onBlur={handleBlur}
                    disabled={loading} autoComplete="name" placeholder="Pl. Kiss Béla"
                  />
                  {touched.name && formData.name && !fieldErrors.name && <CheckIcon />}
                </div>
                {touched.name && fieldErrors.name && <p className="auth-field-err">{fieldErrors.name}</p>}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">Email cím</label>
            <div className={`auth-input-wrap ${touched.email && fieldErrors.email ? 'auth-input--error' : touched.email && formData.email && !fieldErrors.email ? 'auth-input--ok' : ''}`}>
              <MailIcon />
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} onBlur={handleBlur}
                disabled={loading} autoComplete="email" placeholder="pelda@email.hu"
              />
              {touched.email && formData.email && !fieldErrors.email && <CheckIcon />}
            </div>
            {touched.email && fieldErrors.email && <p className="auth-field-err">{fieldErrors.email}</p>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label">Jelszó</label>
            <div className={`auth-input-wrap ${touched.password && fieldErrors.password ? 'auth-input--error' : touched.password && formData.password && !fieldErrors.password ? 'auth-input--ok' : ''}`}>
              <LockIcon />
              <input
                type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                onChange={handleChange} onBlur={handleBlur}
                disabled={loading} autoComplete={isLogin ? 'current-password' : 'new-password'}
                placeholder="Minimum 8 karakter"
              />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {touched.password && fieldErrors.password && <p className="auth-field-err">{fieldErrors.password}</p>}
            {/* Password strength — register only */}
            {!isLogin && formData.password && (
              <div className="auth-pw-strength">
                <div className="auth-pw-bars">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`auth-pw-bar ${pwStrength >= i ? strengthClass[pwStrength] : ''}`} />
                  ))}
                </div>
                <span className={`auth-pw-label ${strengthClass[pwStrength]}`}>{strengthLabel[pwStrength]}</span>
              </div>
            )}
          </div>

          {/* Confirm password — register only */}
          <div className={`auth-field-wrap ${!isLogin ? 'auth-field-wrap--visible' : 'auth-field-wrap--hidden'}`}>
            {!isLogin && (
              <div className="auth-field">
                <label className="auth-label">Jelszó megerősítése</label>
                <div className={`auth-input-wrap ${touched.passwordConfirm && fieldErrors.passwordConfirm ? 'auth-input--error' : touched.passwordConfirm && formData.passwordConfirm && !fieldErrors.passwordConfirm ? 'auth-input--ok' : ''}`}>
                  <LockIcon />
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'} name="passwordConfirm" value={formData.passwordConfirm}
                    onChange={handleChange} onBlur={handleBlur}
                    disabled={loading} autoComplete="new-password" placeholder="Jelszó ismétlése"
                  />
                  <button type="button" className="auth-pw-toggle" onClick={() => setShowPasswordConfirm(p => !p)} tabIndex={-1}>
                    {showPasswordConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {touched.passwordConfirm && fieldErrors.passwordConfirm && <p className="auth-field-err">{fieldErrors.passwordConfirm}</p>}
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <><span className="auth-spinner" />{isLogin ? 'Bejelentkezés...' : 'Regisztráció...'}</>
            ) : (
              <>{isLogin ? 'Bejelentkezés' : 'Fiók létrehozása'}<ArrowIcon /></>
            )}
          </button>
        </form>

        {/* Switch mode */}
        <p className="auth-switch">
          {isLogin ? 'Nincs még fiókod?' : 'Már van fiókod?'}
          <button className="auth-switch-btn" onClick={switchMode} disabled={loading}>
            {isLogin ? 'Regisztrálj ingyen' : 'Bejelentkezés'}
          </button>
        </p>
      </div>
    </div>
  );
}

/* ── Icons ─────────────────────────────── */
const SunIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const LockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const EyeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>;
const ErrorIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const ArrowIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

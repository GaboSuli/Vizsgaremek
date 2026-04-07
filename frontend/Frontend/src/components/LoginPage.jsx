import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../context/useAuth.js';
import useTheme from '../context/useTheme.js';
import './LoginPage.css';

export default function LoginPage({ initialMode } = {}) {
  const { login, register } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(initialMode !== 'register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if ((params.get('page') || '').toLowerCase() === 'register') setIsLogin(false);
  }, [location.search]);

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
        if (res.success) { navigate(from, { replace: true }); return; }
        setError(res.errors ? Object.values(res.errors).flat().join(' ') : res.message || 'Sikertelen bejelentkez�s');
      } else {
        if (!formData.name.trim()) { setError('A n�v megad�sa k�telez�'); return; }
        if (formData.password !== formData.passwordConfirm) { setError('A jelszavak nem egyeznek'); return; }
        const res = await register({
          nev: formData.name, email: formData.email,
          password: formData.password, password_confirmation: formData.passwordConfirm
        });
        if (res.success) { navigate(from, { replace: true }); return; }
        setError(res.errors ? Object.values(res.errors).flat().join(' ') : res.message || 'Sikertelen regisztr�ci�');
      }
    } catch { setError('H�l�zati hiba t�rt�nt'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-root">
      {/* Left panel — Branding */}
      <div className="auth-brand">
        {/* Theme toggle button */}
        <button
          className="auth-theme-toggle"
          onClick={toggleTheme}
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
            <span className=\auth-brand-name\>Szaldon</span>
          </div>
          <h2 className=\auth-brand-headline\>Bev�s�rl�s �r�mmel,<br/>tervez�s k�nnyed�n</h2>
          <p className=\auth-brand-sub\>Csatlakozz a k�z�ss�ghez �s tedd hat�konyabb� a mindennapi bev�s�rl�st.</p>
          <div className=\auth-brand-features\>
            {['K�z�s bev�s�rl�list�k csoportokkal', 'Kuponok �s kedvezm�nyek egy helyen', 'Kiad�si statisztik�k �s trendek', 'Ingyenes �s k�nnyen kezelhet�'].map((f, i) => (
              <div key={i} className=\auth-brand-feature\>
                <div className=\auth-brand-check\>
                  <svg viewBox=\0 0 24 24\ fill=\none\ stroke=\currentColor\ strokeWidth=\2.5\ width=\12\ height=\12\>
                    <path d=\M20 6L9 17l-5-5\/>
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
              {isLogin ? 'Üdv vissza 👋' : 'Fiók létrehozása'}
            </h1>
            <p className=\auth-form-sub\>
              {isLogin ? 'Jelentkezz be a fi�kodba' : 'Regisztr�lj ingyen, p�r m�sodperc alatt'}
            </p>
          </div>

          {error ; (
            <div className=\alert alert-danger\ style={{marginBottom: '20px', borderRadius: 'var(--r-md)'}}>
              <svg viewBox=\0 0 24 24\ fill=\none\ stroke=\currentColor\ strokeWidth=\2\ width=\16\ height=\16\ style={{flexShrink:0}}>
                <circle cx=\12\ cy=\12\ r=\10\/><line x1=\12\ y1=\8\ x2=\12\ y2=\12\/><line x1=\12\ y1=\16\ x2=\12.01\ y2=\16\/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className=\auth-form\>
            {!isLogin && (
              <div className=\form-group\>
                <label className=\form-label\>Teljes n�v</label>
                <input type=\text\ className=\form-control\ name=\name\ value={formData.name}
                  onChange={handleChange} required disabled={loading} autoComplete=\name\ placeholder=\Pl. Kiss B�la\ />
              </div>
            )}
            <div className=\form-group\>
              <label className=\form-label\>Email c�m</label>
              <input type=\email\ className=\form-control\ name=\email\ value={formData.email}
                onChange={handleChange} required disabled={loading} autoComplete=\email\ placeholder=\pelda@email.hu\ />
            </div>
            <div className=\form-group\>
              <label className=\form-label\>Jelsz�</label>
              <div className=\pw-input-wrap\>
                <input type={showPassword ? 'text' : 'password'} className=\form-control\ name=\password\ value={formData.password}
                  onChange={handleChange} required minLength=\8\ disabled={loading}
                  autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder=\Minimum 8 karakter\ />
                <button type=\button\ className=\pw-toggle\ onClick={() => setShowPassword(p => !p)} tabIndex={-1} aria-label={showPassword ? 'Jelsz� elrejt�se' : 'Jelsz� megjelen�t�se'}>
                  {showPassword ? (
                    <svg viewBox=\0 0 24 24\ fill=\none\ stroke=\currentColor\ strokeWidth=\2\ width=\18\ height=\18\>
                      <path d=\M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94\/>
                      <path d=\M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19\/>
                      <line x1=\1\ y1=\1\ x2=\23\ y2=\23\/>
                    </svg>
                  ) : (
                    <svg viewBox=\0 0 24 24\ fill=\none\ stroke=\currentColor\ strokeWidth=\2\ width=\18\ height=\18\>
                      <path d=\M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\/>
                      <circle cx=\12\ cy=\12\ r=\3\/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {!isLogin && (
              <div className=\form-group\>
                <label className=\form-label\>Jelsz� meger�s�t�se</label>
                <div className=\pw-input-wrap\>
                  <input type={showPasswordConfirm ? 'text' : 'password'} className=\form-control\ name=\passwordConfirm\ value={formData.passwordConfirm}
                    onChange={handleChange} required minLength=\8\ disabled={loading}
                    autoComplete=\new-password\ placeholder=\Jelsz� ism�tl�se\ />
                  <button type=\button\ className=\pw-toggle\ onClick={() => setShowPasswordConfirm(p => !p)} tabIndex={-1} aria-label={showPasswordConfirm ? 'Jelsz� elrejt�se' : 'Jelsz� megjelen�t�se'}>
                    {showPasswordConfirm ? (
                      <svg viewBox=\0 0 24 24\ fill=\none\ stroke=\currentColor\ strokeWidth=\2\ width=\18\ height=\18\>
                        <path d=\M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94\/>
                        <path d=\M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19\/>
                        <line x1=\1\ y1=\1\ x2=\23\ y2=\23\/>
                      </svg>
                    ) : (
                      <svg viewBox=\0 0 24 24\ fill=\none\ stroke=\currentColor\ strokeWidth=\2\ width=\18\ height=\18\>
                        <path d=\M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\/>
                        <circle cx=\12\ cy=\12\ r=\3\/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center', padding:'13px', marginTop:'8px'}} disabled={loading}>
              {loading ? (
                <>
                  <span className=\spinner spinner-sm\/>
                  {isLogin ? 'Bejelentkez�s...' : 'Regisztr�ci�...'}
                </>
              ) : (isLogin ? 'Bejelentkez�s' : 'Regisztr�ci�')}
            </button>
          </form>

          <div className=\auth-toggle\>
            <span>{isLogin ? 'M�g nincs fi�kod?' : 'M�r van fi�kod?'}</span>
            <button className=\auth-toggle-btn\ onClick={() => { setIsLogin(!isLogin); setError(''); }} disabled={loading}>
              {isLogin ? 'Regisztr�lj ingyen' : 'Bejelentkez�s'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

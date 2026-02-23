import React, { useState, useEffect } from 'react';
import { loginUser as apiLoginUser, registerUser as apiRegisterUser } from '../services/api.js';
import './LoginPage.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: ''
  });

  // read target from query param for redirect after login
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get('target') || null;
    const pageParam = (params.get('page') || '').toLowerCase();
    if (target) {
      // store desired target in localStorage for retrieval after login
      localStorage.setItem('login_target', target);
    }
    if (pageParam === 'register') {
      setIsLogin(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const target = localStorage.getItem('login_target');

      if (isLogin) {
        // Call axios-based login helper
        console.debug('Submitting login', { email: formData.email });
        const res = await apiLoginUser({ email: formData.email, password: formData.password });
        console.debug('apiLoginUser response', res);
        if (res && res.success) {
          setSuccess('Sikeres bejelentkezés — átirányítás...');
          // Redirect to requested target or root
          setTimeout(() => {
            if (target) window.location.href = `/?page=${encodeURIComponent(target)}`;
            else window.location.href = '/';
          }, 600);
        } else {
          // Show validation or message
          if (res && res.errors) {
            const joined = Object.values(res.errors).map(arr => Array.isArray(arr) ? arr.join(' ') : String(arr)).join(' ');
            setError(joined || res.message || 'Sikertelen bejelentkezés');
          } else {
            setError((res && res.message) || 'Sikertelen bejelentkezés');
          }
        }
      } else {
        // register
        if (!formData.name || !formData.name.trim()) {
          setError('A név megadása kötelező');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.passwordConfirm) {
          setError('A jelszavak nem egyeznek');
          setLoading(false);
          return;
        }

        const payload = { name: formData.name, email: formData.email, password: formData.password, password_confirmation: formData.passwordConfirm };
        console.debug('Submitting register', payload);
        const res = await apiRegisterUser(payload);
        console.debug('apiRegisterUser response', res);

        if (res && res.success) {
          // If backend returned token and user, apiRegisterUser already stored them -> consider the user logged in
          const hasToken = res.data && res.data.token;
          if (hasToken) {
            setSuccess('Sikeres regisztráció! Átirányítás...');
            setTimeout(() => {
              if (target) window.location.href = `/?page=${encodeURIComponent(target)}`;
              else window.location.href = '/';
            }, 600);
          } else {
            // No token returned: inform user to login
            setSuccess('Sikeres regisztráció! Most bejelentkezhetsz.');
            setIsLogin(true);
            setFormData({ email: '', password: '', passwordConfirm: '', name: '' });
          }
        } else {
          if (res && res.errors) {
            const joined = Object.values(res.errors).map(arr => Array.isArray(arr) ? arr.join(' ') : String(arr)).join(' ');
            setError(joined || res.message || 'Sikertelen regisztráció');
          } else {
            setError((res && res.message) || 'Sikertelen regisztráció');
          }
        }
      }
    } catch (err) {
      setError('Hálózati hiba történt');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{isLogin ? 'Bejelentkezés' : 'Regisztráció'}</h1>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Név</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="name"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Jelszó</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Jelszó megerősítése</label>
              <input
                type="password"
                className="form-control"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                minLength="8"
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Betöltés...' : (isLogin ? 'Bejelentkezés' : 'Regisztráció')}
          </button>
        </form>

        <div className="text-center">
          <p>
            {isLogin ? 'Még nincs fiókod? ' : 'Van már fiókod? '}
            <button
              className="btn-link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              disabled={loading}
            >
              {isLogin ? 'Regisztrálj' : 'Bejelentkezés'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

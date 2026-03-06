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
  const [formData, setFormData] = useState({
    
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    
  });

  // determine where we should go after auth
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // if user toggles into register based on query params
    const params = new URLSearchParams(location.search);
    const pageParam = (params.get('page') || '').toLowerCase();
    if (pageParam === 'register') {
      setIsLogin(false);
    }
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
        if (res.success) {
          navigate(from, { replace: true });
          return;
        }
        // otherwise show error
        if (res.errors) {
          const joined = Object.values(res.errors).flat().join(' ');
          setError(joined || res.message);

        } else {
          setError(res.message || 'Sikertelen bejelentkezés');
        }
      } else {
        if (!formData.name.trim()) {
          setError('A név megadása kötelező');
          return;
        }
        if (formData.password !== formData.passwordConfirm) {
          setError('A jelszavak nem egyeznek');
          return;
        }

        const res = await register({
          nev: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.passwordConfirm
        });

        if (res.success) {
          // after successful signup we consider user logged in
          navigate(from, { replace: true });
          return;
        }
        if (res.errors) {
          const joined = Object.values(res.errors).flat().join(' ');
          setError(joined || res.message);
        } else {
          setError(res.message || 'Sikertelen regisztráció');
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

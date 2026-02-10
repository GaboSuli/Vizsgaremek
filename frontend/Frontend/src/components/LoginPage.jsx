import React, { useState } from 'react';
import { loginUser, registerUser, setStoredUserInfo } from '../services/authService.js';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const response = await loginUser({
          email: formData.email,
          password: formData.password
        });

        if (response.success) {
          // Store user info from response
          if (response.data) {
            setStoredUserInfo(response.data);
          }
          setSuccess('Sikeresen bejelentkeztél!');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          // Jobb error üzenet
          const errorMsg = response.message || 'Sikertelen bejelentkezés';
          
          // Backend nem elérhető
          if (errorMsg.includes('Backend szerver nem elérhető') || response.status === 503) {
            setError(
              '❌ BACKEND SZERVER NEM FUTNAK!\n\n' +
              'Lépések:\n' +
              '1. Nyisd meg a PowerShell-t\n' +
              '2. Futtasd: cd Backend && php artisan serve\n' +
              '3. Várj, amíg a szerver indul (localhost:8000)\n' +
              '4. Újra próbáld a bejelentkezést\n\n' +
              'QUICK_START.md fájl lásd a projekt gyökerében'
            );
          } else {
            setError(errorMsg);
          }
        }
      } else {
        if (formData.password !== formData.passwordConfirm) {
          setError('A jelszavak nem egyeznek');
          return;
        }

        const response = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.passwordConfirm
        });

        if (response.success) {
          setSuccess('Sikeres regisztráció! Most bejelentkezhetsz.');
          setIsLogin(true);
          setFormData({
            email: '',
            password: '',
            passwordConfirm: '',
            name: ''
          });
        } else {
          setError(response.message || 'Sikertelen regisztráció');
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

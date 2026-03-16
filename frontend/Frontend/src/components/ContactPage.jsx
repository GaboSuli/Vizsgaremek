import React, { useState } from 'react';
import useAuth from '../context/useAuth.js';
import './ContactPage.css';

export default function ContactPage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || user?.Nev || '',
    email: user?.email || user?.Email || '',
    messageType: '',
    message: '',
    company: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const messageTypes = [
    { value: 'kerdes', label: 'Kérdés' },
    { value: 'hiba', label: 'Hiba bejelentés' },
    { value: 'javaslat', label: 'Javaslat' },
    { value: 'egyuttmukodes', label: 'Együttműködés' }
  ];

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (formData.company) {
      setError("Spam gyanús üzenet.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        messageType: formData.messageType,
        message: formData.message
      };

      const res = await fetch('http://127.0.0.1:8000/api/contact/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let data;
      const contentType = res.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error('A szerver hibás választ adott (nem JSON). Ellenőrizd az API-t.');
      }

      if (!res.ok) throw new Error(data.message || "Hiba történt");

      setSuccess(true);

      setFormData({
        name: user?.name || user?.Nev || '',
        email: user?.email || user?.Email || '',
        messageType: '',
        message: '',
        company: ''
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>📧 Kapcsolat</h1>
      <p>Kérjük, használja az űrlapot kérdéseihez vagy visszajelzéseihez.</p>

      <div className="contact-content">
        <div className="contact-card">

          <h2>Kapcsolati Űrlap</h2>

          {success && (
            <div className="success-message">
              ✅ Üzenet elküldve! Hamarosan válaszolunk.
            </div>
          )}

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">

            <div className="form-group">
              <label>Név *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Üzenet típusa *</label>
              <select
                name="messageType"
                value={formData.messageType}
                onChange={handleChange}
                required
              >
                <option value="">Válasszon...</option>
                {messageTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Üzenet *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
              />
            </div>

            {/* rejtett spam trap */}
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              style={{ display: 'none' }}
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Küldés...' : 'Üzenet küldése'}
            </button>

          </form>

          <div className="contact-info">
            <h3>Egyéb elérhetőségek</h3>
            <ul>
              <li><strong>Támogatás:</strong> cashentis@gmail.com</li>
              <li><strong>Fejlesztők:</strong> dev@vevesbazar.hu</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
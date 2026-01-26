import React, { useState } from 'react';
import { apiCall } from '../services/api.js';
import './ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    messageType: '',
    message: ''
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

  const handleInputChange = (e) => {
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
    setSuccess(false);

    // Simulate API call delay
    setTimeout(() => {
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        messageType: '',
        message: ''
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="contact-container">
      <div className="contact-hero">
        <h1>📧 Kapcsolat</h1>
        <p>Kérjük, használja ezt az űrlapot, ha kérdése, javaslata vagy visszajelzése van számunkra.</p>
      </div>

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
              <label htmlFor="name">Név *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Adja meg a nevét"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email cím *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="pelda@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="messageType">Üzenet típusa *</label>
              <select
                id="messageType"
                name="messageType"
                value={formData.messageType}
                onChange={handleInputChange}
                required
              >
                <option value="">Válasszon típust...</option>
                {messageTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Üzenet *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Írja le részletesen az üzenetét..."
                rows="6"
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Küldés...' : 'Üzenet küldése'}
            </button>
          </form>

          <div className="contact-info">
            <h3>Egyéb kapcsolattartási lehetőségek</h3>
            <p>
              Ha sürgős ügyben keres minket, használhatja az alábbi email címeket:
            </p>
            <ul>
              <li><strong>Támogatás:</strong> support@vevesbazar.hu</li>
              <li><strong>Fejlesztők:</strong> dev@vevesbazar.hu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

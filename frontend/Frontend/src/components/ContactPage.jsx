import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import useAuth from '../context/useAuth.js';
import { apiCall } from '../services/api.js';
import './ContactPage.css';

/* ── EmailJS konfiguráció ── */
const EMAILJS_SERVICE_ID  = 'service_p0g9uwd';
const EMAILJS_TEMPLATE_ID = 'template_7rxotqn';
const EMAILJS_PUBLIC_KEY   = 'MgaNkbTc5VfUIWEBl';   // ← cseréld ki az EmailJS Public Key-re

export default function ContactPage() {
  const { user } = useAuth();

  /* A felhasználó neve és email címe automatikusan az auth-ból jön */
  const userName  = user?.Nev || user?.nev || user?.name || '';
  const userEmail = user?.email || user?.Email || '';

  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const messageTypes = [
    { value: '1', label: '❓ Kérdés',          desc: 'Általános kérdés a rendszerrel kapcsolatban' },
    { value: '2', label: '🐛 Hiba bejelentés', desc: 'Hibát találtál? Jelezd nekünk!' },
    { value: '3', label: '💡 Javaslat',        desc: 'Ötleted van? Szívesen halljuk!' },
    { value: '4', label: '🤝 Együttműködés',   desc: 'Üzleti vagy fejlesztési együttműködés' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    /* Honeypot spam csapda */
    if (honeypot) {
      setError('Spam gyanús üzenet.');
      setLoading(false);
      return;
    }

    if (!messageType) {
      setError('Kérlek válassz üzenet típust!');
      setLoading(false);
      return;
    }

    try {
      /* 1) Mentés a backend adatbázisba */
      const res = await apiCall('/contact/create', {
        method: 'POST',
        body: {
          nev: userName,
          email: userEmail,
          contactTipusId: messageType,
          text: message
        }
      });

      if (!res.success) {
        const errMsg = res.errors?.validacios_hibak
          ? Object.values(res.errors.validacios_hibak).flat().join(', ')
          : res.message || 'Hiba történt a küldés során.';
        throw new Error(errMsg);
      }

      /* 2) Email küldés EmailJS-en keresztül (frontend-only) */
      const typeLabel = messageTypes.find(t => t.value === messageType)?.label?.replace(/^[^\s]+\s/, '') || messageType;

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name:    userName,
          from_email:   userEmail,
          message_type: typeLabel,
          message:      message
        }, EMAILJS_PUBLIC_KEY);
      } catch {
        /* Ha az EmailJS nem elérhető, az nem blokkolja az üzenetet */
        console.warn('Email küldés sikertelen, de az üzenet mentve lett az adatbázisba.');
      }

      setSuccess(true);
      setMessageType('');
      setMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="page-container" style={{ maxWidth: 760 }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">📬 Kapcsolat</h1>
            <p className="page-subtitle">Kérdése van? Értesítse a fejlesztői csapatot</p>
          </div>
        </div>

        {/* Feladó információk */}
        <div className="card contact-sender-card">
          <div className="contact-sender-row">
            <div className="contact-sender-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="contact-sender-info">
              <span className="contact-sender-name">{userName}</span>
              <span className="contact-sender-email">{userEmail}</span>
            </div>
            <span className="badge badge-success" style={{ marginLeft: 'auto' }}>✓ Bejelentkezve</span>
          </div>
        </div>

        {/* Fő űrlap */}
        <div className="card" style={{ padding: '2rem', marginTop: '1rem' }}>
          {success && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              ✅ Üzenet sikeresen elküldve! Hamarosan válaszolunk.
            </div>
          )}
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            {/* Üzenet típus választó kártyák */}
            <div className="form-group">
              <label className="form-label">Üzenet típusa *</label>
              <div className="contact-type-grid">
                {messageTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    className={`contact-type-card${messageType === type.value ? ' active' : ''}`}
                    onClick={() => setMessageType(type.value)}
                  >
                    <span className="contact-type-label">{type.label}</span>
                    <span className="contact-type-desc">{type.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Üzenet *</label>
              <textarea
                className="form-control"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={6}
                placeholder="Írd le részletesen az üzeneted..."
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* honeypot spam csapda */}
            <input
              type="text"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              autoComplete="off"
              tabIndex={-1}
            />

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading || !messageType || !message.trim()}>
              {loading ? (
                <>
                  <span className="spinner spinner-sm" /> Küldés...
                </>
              ) : (
                '📨 Üzenet küldése'
              )}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '1rem' }}>Egyéb elérhetőségek</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--clr-text-2)' }}>
            <span><strong style={{ color: 'var(--clr-text)' }}>📧 Támogatás:</strong> cashentis@gmail.com</span>
            <span><strong style={{ color: 'var(--clr-text)' }}>👨‍💻 Fejlesztők:</strong> dev@vevesbazar.hu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
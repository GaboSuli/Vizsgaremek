import React, { useState, useRef, useCallback } from 'react';
import { apiCall } from '../../services/api.js';

const COOLDOWN_SECONDS = 30;
const NAME_MIN = 2;
const NAME_MAX = 100;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;
const EMAIL_MAX = 254;

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="contact-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" width="18" height="18">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const messageTypes = [
  { value: '1', label: 'Kérdés', icon: '❓' },
  { value: '2', label: 'Hiba bejelentés', icon: '🐛' },
  { value: '3', label: 'Javaslat', icon: '💡' },
  { value: '4', label: 'Együttműködés', icon: '🤝' },
];

function validateField(name, value, formData) {
  switch (name) {
    case 'name': {
      const trimmed = value.trim();
      if (!trimmed) return 'A név megadása kötelező.';
      if (trimmed.length < NAME_MIN) return `A név legalább ${NAME_MIN} karakter legyen.`;
      if (trimmed.length > NAME_MAX) return `A név legfeljebb ${NAME_MAX} karakter lehet.`;
      return '';
    }
    case 'email': {
      const trimmed = value.trim();
      if (!trimmed) return 'Az email cím megadása kötelező.';
      if (trimmed.length > EMAIL_MAX) return `Az email legfeljebb ${EMAIL_MAX} karakter lehet.`;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Érvénytelen email cím formátum.';
      return '';
    }
    case 'messageType':
      if (!value) return 'Válassz egy üzenet típust.';
      return '';
    case 'message': {
      const trimmed = value.trim();
      if (!trimmed) return 'Az üzenet megadása kötelező.';
      if (trimmed.length < MESSAGE_MIN) return `Az üzenet legalább ${MESSAGE_MIN} karakter legyen.`;
      if (trimmed.length > MESSAGE_MAX) return `Az üzenet legfeljebb ${MESSAGE_MAX} karakter lehet.`;
      return '';
    }
    default:
      return '';
  }
}

export default function ContactForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    name: user?.name || user?.Nev || '',
    email: user?.email || user?.Email || '',
    messageType: '',
    message: '',
    company: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef(null);

  const startCooldown = useCallback(() => {
    setCooldown(COOLDOWN_SECONDS);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const validate = () => {
    const newErrors = {};
    for (const field of ['name', 'email', 'messageType', 'message']) {
      const err = validateField(field, formData[field], formData);
      if (err) newErrors[field] = err;
    }
    return newErrors;
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const err = validateField(name, value, formData);
      setErrors(prev => ({ ...prev, [name]: err || undefined }));
    }
  };

  const handleBlur = ({ target: { name, value } }) => {
    if (name === 'company') return;
    const err = validateField(name, value, formData);
    if (err) {
      setErrors(prev => ({ ...prev, [name]: err }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (cooldown > 0) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Honeypot check
    if (formData.company) {
      // Silently pretend success for bots
      onSuccess();
      return;
    }

    setLoading(true);

    try {
      const res = await apiCall('/contact/create', {
        method: 'POST',
        body: {
          nev: formData.name.trim(),
          email: formData.email.trim(),
          contactTipusId: formData.messageType,
          text: formData.message.trim(),
        },
      });

      if (!res.success) {
        const serverMsg = res.errors?.validacios_hibak
          ? Object.values(res.errors.validacios_hibak).flat().join(' ')
          : res.message;
        throw new Error(serverMsg || 'Hiba történt a küldés során.');
      }

      startCooldown();
      onSuccess();
    } catch (err) {
      setApiError(
        err.message && err.message !== 'Hálózati hiba'
          ? err.message
          : 'Nem sikerült elküldeni az üzenetet. Kérjük, próbáld újra később.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading || cooldown > 0;

  return (
    <div className="contact-form-section">
      <div className="contact-form-header">
        <h2 className="contact-form-title">Küldj üzenetet</h2>
        <p className="contact-form-subtitle">Töltsd ki az alábbi űrlapot és felvesszük veled a kapcsolatot</p>
      </div>

      {apiError && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--sp-5)' }}>
          <span>{apiError}</span>
          <button className="alert-close" onClick={() => setApiError('')}>&times;</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="contact-form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="cf-name">Név *</label>
            <input
              id="cf-name"
              className={`form-control${errors.name ? ' is-invalid' : ''}`}
              type="text"
              name="name"
              placeholder="Teljes neved"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={NAME_MAX}
            />
            {errors.name && <span className="invalid-feedback">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cf-email">Email cím *</label>
            <input
              id="cf-email"
              className={`form-control${errors.email ? ' is-invalid' : ''}`}
              type="email"
              name="email"
              placeholder="pelda@email.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={EMAIL_MAX}
            />
            {errors.email && <span className="invalid-feedback">{errors.email}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tárgy / Üzenet típusa *</label>
          <div className="contact-type-grid">
            {messageTypes.map(type => (
              <label
                key={type.value}
                className={`contact-type-option${formData.messageType === type.value ? ' active' : ''}${errors.messageType ? ' has-error' : ''}`}
              >
                <input
                  type="radio"
                  name="messageType"
                  value={type.value}
                  checked={formData.messageType === type.value}
                  onChange={handleChange}
                />
                <span className="contact-type-icon">{type.icon}</span>
                <span className="contact-type-label">{type.label}</span>
              </label>
            ))}
          </div>
          {errors.messageType && <span className="invalid-feedback">{errors.messageType}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cf-message">Üzenet *</label>
          <textarea
            id="cf-message"
            className={`form-control${errors.message ? ' is-invalid' : ''}`}
            name="message"
            placeholder="Írd le részletesen, miben segíthetünk..."
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={5}
            maxLength={MESSAGE_MAX}
          />
          <div className="contact-char-count">
            <span>{formData.message.length} / {MESSAGE_MAX} karakter</span>
          </div>
          {errors.message && <span className="invalid-feedback">{errors.message}</span>}
        </div>

        {/* honeypot */}
        <input type="text" name="company" value={formData.company} onChange={handleChange}
          style={{ position: 'absolute', left: '-9999px', opacity: 0 }} autoComplete="off" tabIndex={-1} aria-hidden="true" />

        <button type="submit" className="btn btn-primary btn-lg contact-submit-btn" disabled={isSubmitDisabled}>
          {loading ? <SpinnerIcon /> : <SendIcon />}
          {loading
            ? 'Küldés folyamatban...'
            : cooldown > 0
              ? `Várakozás (${cooldown}s)`
              : 'Üzenet küldése'}
        </button>
      </form>
    </div>
  );
}

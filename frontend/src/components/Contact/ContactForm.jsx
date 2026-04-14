import React, { useState } from 'react';

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

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'A név megadása kötelező.';
    if (!formData.email.trim()) {
      newErrors.email = 'Az email cím megadása kötelező.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Érvénytelen email cím formátum.';
    }
    if (!formData.messageType) newErrors.messageType = 'Válassz egy üzenet típust.';
    if (!formData.message.trim()) {
      newErrors.message = 'Az üzenet megadása kötelező.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Az üzenet legalább 10 karakter legyen.';
    }
    return newErrors;
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (formData.company) {
      setApiError('Spam gyanús üzenet.');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');

      const backendPayload = {
        nev: formData.name,
        email: formData.email,
        contactTipusId: formData.messageType,
        text: formData.message,
      };

      const res = await fetch('http://127.0.0.1:8000/api/contact/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(backendPayload),
      });

      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error('A szerver hibás választ adott (nem JSON). Ellenőrizd az API-t.');
      }

      if (!res.ok) throw new Error(data.message || JSON.stringify(data.validacios_hibak) || 'Hiba történt');

      // Send email via Express server
      const typeLabel = messageTypes.find(t => t.value === formData.messageType)?.label || formData.messageType;
      await fetch('http://127.0.0.1:8000/api/contact/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          messageType: typeLabel,
          message: formData.message,
        }),
      }).catch(() => { /* email küldés nem blokkol */ });

      onSuccess();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            rows={5}
          />
          <div className="contact-char-count">
            <span>{formData.message.length} karakter</span>
          </div>
          {errors.message && <span className="invalid-feedback">{errors.message}</span>}
        </div>

        {/* honeypot */}
        <input type="text" name="company" value={formData.company} onChange={handleChange}
          style={{ position: 'absolute', left: '-9999px', opacity: 0 }} autoComplete="off" tabIndex={-1} />

        <button type="submit" className="btn btn-primary btn-lg contact-submit-btn" disabled={loading}>
          {loading ? <SpinnerIcon /> : <SendIcon />}
          {loading ? 'Küldés folyamatban...' : 'Üzenet küldése'}
        </button>
      </form>
    </div>
  );
}

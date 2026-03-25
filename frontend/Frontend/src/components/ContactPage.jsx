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
    { value: '1', label: 'Kérdés' },
    { value: '2', label: 'Hiba bejelentés' },
    { value: '3', label: 'Javaslat' },
    { value: '4', label: 'Együttműködés' }
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
      const token = localStorage.getItem('auth_token');

      // 1) Save to backend database
      const backendPayload = {
        nev: formData.name,
        email: formData.email,
        contactTipusId: formData.messageType,
        text: formData.message
      };

      const res = await fetch('http://127.0.0.1:8000/api/contact/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(backendPayload)
      });

      let data;
      const contentType = res.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error('A szerver hibás választ adott (nem JSON). Ellenőrizd az API-t.');
      }

      if (!res.ok) throw new Error(data.message || JSON.stringify(data.validacios_hibak) || "Hiba történt");

      // 2) Send email via Express email server
      const typeLabel = messageTypes.find(t => t.value === formData.messageType)?.label || formData.messageType;

      const emailPayload = {
        name: formData.name,
        email: formData.email,
        messageType: typeLabel,
        message: formData.message
      };

      await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload)
      });

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
    <div className="contact-page">
      <div className="page-container" style={{maxWidth: 760}}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Kapcsolat</h1>
            <p className="page-subtitle">Kérdése van? Értesítse a fejlesztői csapatot</p>
          </div>
        </div>

        <div className="card" style={{padding: '2rem'}}>
          {success && (
            <div className="alert alert-success" style={{marginBottom:'1.5rem'}}>
              Üzenet sikeresen elküldve! Hamarosan válaszolunk.
            </div>
          )}
          {error && (
            <div className="alert alert-danger" style={{marginBottom:'1.5rem'}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'1.2rem'}}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
              <div className="form-group">
                <label className="form-label">Név *</label>
                <input className="form-control" type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Üzenet típusa *</label>
              <select className="form-control" name="messageType" value={formData.messageType} onChange={handleChange} required>
                <option value="">Válasszon...</option>
                {messageTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Üzenet *</label>
              <textarea className="form-control" name="message" value={formData.message} onChange={handleChange} required rows={5} style={{resize:'vertical'}} />
            </div>

            {/* honeypot spam trap */}
            <input type="text" name="company" value={formData.company} onChange={handleChange} style={{display:'none'}} autoComplete="off" />

            <button type="submit" className="btn btn-primary" disabled={loading} style={{alignSelf:'flex-start'}}>
              {loading ? 'Küldés...' : 'Üzenet küldése'}
            </button>
          </form>
        </div>

        <div className="card" style={{padding:'1.5rem', marginTop:'1.5rem'}}>
          <h3 style={{fontSize:'1rem', fontWeight:600, color:'var(--clr-text)', marginBottom:'1rem'}}>Egyéb elérhetőségek</h3>
          <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', fontSize:'0.9rem', color:'var(--clr-text-muted)'}}>
            <span><strong style={{color:'var(--clr-text)'}}>Támogatás:</strong> cashentis@gmail.com</span>
            <span><strong style={{color:'var(--clr-text)'}}>Fejlesztők:</strong> dev@vevesbazar.hu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
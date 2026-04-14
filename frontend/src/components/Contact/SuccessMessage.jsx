import React from 'react';

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function SuccessMessage({ onReset }) {
  return (
    <div className="contact-success">
      <div className="contact-success-icon">
        <CheckCircleIcon />
      </div>
      <h3 className="contact-success-title">Üzenet sikeresen elküldve!</h3>
      <p className="contact-success-text">
        Köszönjük, hogy írtál nekünk! Csapatunk hamarosan feldolgozza az üzeneted, és válaszolunk az megadott e-mail címre.
      </p>
      <button className="btn btn-primary" onClick={onReset}>
        Új üzenet küldése
      </button>
    </div>
  );
}

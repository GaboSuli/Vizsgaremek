import React, { useState } from 'react';
import useAuth from '../context/useAuth.js';
import ContactForm from './Contact/ContactForm.jsx';
import ContactInfoCard from './Contact/ContactInfoCard.jsx';
import SuccessMessage from './Contact/SuccessMessage.jsx';
import './ContactPage.css';

const HeroMailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export default function ContactPage() {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);

  return (
    <div className="contact-page">
      <div className="page-container">
        {/* Hero Header */}
        <div className="contact-hero">
          <div className="contact-hero-content">
            <div className="contact-hero-icon">
              <HeroMailIcon />
            </div>
            <h1 className="contact-hero-title">Kapcsolatfelvétel</h1>
            <p className="contact-hero-subtitle">
              Kérdésed van, hibát találtál, vagy együttműködnél velünk? Írj nekünk, és csapatunk
              hamarosan válaszol!
            </p>
          </div>
        </div>

        {/* Main content */}
        {success ? (
          <SuccessMessage onReset={() => setSuccess(false)} />
        ) : (
          <div className="contact-layout">
            <ContactForm user={user} onSuccess={() => setSuccess(true)} />
            <ContactInfoCard />
          </div>
        )}
      </div>
    </div>
  );
}
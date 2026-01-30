import React from 'react';
import Hero from './Hero';
import AboutSection from './AboutSection';
import FeaturesSection from './FeaturesSection';
import HowItWorks from './HowItWorks';
import PriceChangeSection from './PriceChangeSection';
import StatsSection from './StatsSection';
import './Foldal.css';

export default function LandingPage() {
  const handleNavigate = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ width: '100%' }}>
      <Hero onPrimary={() => handleNavigate('features')} onSecondary={() => handleNavigate('contact')} />
      <PriceChangeSection />
      <AboutSection />
      <FeaturesSection />
      <HowItWorks />
      <StatsSection />

      <section id="contact" className="contact-section">
        <h2>Kapcsolat</h2>
        <p>Ha kérdésed van, írj nekünk: <a href="mailto:hello@vevesbazar.local">hello@vevesbazar.local</a></p>
      </section>

      <footer className="site-footer">
        <small>© {new Date().getFullYear()} VevesBazar — Minden jog fenntartva</small>
      </footer>
    </div>
  );
}


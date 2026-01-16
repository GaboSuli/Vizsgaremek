import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Hero from './Hero';
import AboutSection from './AboutSection';
import FeaturesSection from './FeaturesSection';
import HowItWorks from './HowItWorks';
import StatsSection from './StatsSection';
import './Foldal.css';

export default function LandingPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('hero');

  const handleNavigate = (id) => {
    setActive(id);
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(s => !s)} active={active} onNavigate={handleNavigate} />
      <main className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Hero onPrimary={() => handleNavigate('features')} onSecondary={() => handleNavigate('contact')} />
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
      </main>
    </div>
  );
}

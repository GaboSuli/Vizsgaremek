import React from 'react';
import './Foldal.css';

const features = [
  { id: 'users', title: 'Felhasználók', desc: 'Profilok, beállítások és felhasználói jogosultságok.' },
  { id: 'groups', title: 'Csoportok', desc: 'Csoportok létrehozása, meghívók és közös listák.' },
  { id: 'lists', title: 'Bevásárlólisták', desc: 'Listák készítése, elemek kezelése és megosztás.' },
  { id: 'coupons', title: 'Kuponok', desc: 'Kuponok gyűjtése és gyors alkalmazása a listákon.' },
  { id: 'stats', title: 'Statisztikák', desc: 'Árátlagok és listastatisztikák, vizuális elemzésekkel.' },
];

function FeatureCard({ f }) {
  return (
    <div className="feature-card card">
      <div className="feature-icon"> 
        <div className="icon-mark">{f.title.charAt(0)}</div>
      </div>
      <div className="feature-body">
        <h4>{f.title}</h4>
        <p>{f.desc}</p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="features-section">
      <h2>Funkciók</h2>
      <div className="features-grid">
        {features.map(f => <FeatureCard key={f.id} f={f} />)}
      </div>
    </section>
  );
}

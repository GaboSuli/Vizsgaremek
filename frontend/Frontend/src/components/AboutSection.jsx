import React from 'react';
import './Foldal.css';

function AboutCard({ title, children }) {
  return (
    <div className="about-card card">
      <h3 className="card-title">{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      <h2>Rólunk</h2>
      <div className="about-grid">
        <AboutCard title="Miért hoztuk létre?">Célunk, hogy egyszerű és közösségi módot adjunk a bevásárlólisták és kuponok megosztására, árstatisztikák nyomon követésével.</AboutCard>
        <AboutCard title="Egyszerű használat">Gyors regisztráció, átlátható listakezelés és könnyű megosztási lehetőségek csoportok számára.</AboutCard>
        <AboutCard title="Közösségi jelleg">Ossz meg listákat a barátaiddal, használd közösen, és találd meg a legjobb ajánlatokat.</AboutCard>
      </div>
    </section>
  );
}

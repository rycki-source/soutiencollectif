import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          🎄 Un Noël Magique pour Chaque Enfant d'Afrique 🎁
        </h1>
        <p className="hero-subtitle">
          Aidez-nous à offrir de la joie et du bonheur aux enfants orphelins d'Afrique durant cette saison des fêtes
        </p>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">500+</span>
            <span className="stat-label">Enfants aidés</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Donateurs</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">100%</span>
            <span className="stat-label">Transparent</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

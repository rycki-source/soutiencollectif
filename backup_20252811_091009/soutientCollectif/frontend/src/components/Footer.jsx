import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🎄 Soutien Collectif</h3>
          <p>Ensemble, offrons un Noël magique à chaque enfant d'Afrique</p>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>📧 contact@soutien-collectif.org</p>
          <p>📱 +237 6 XX XX XX XX (Cameroun)</p>
          <p>📱 +225 XX XX XX XX XX (Côte d'Ivoire)</p>
        </div>
        
        <div className="footer-section">
          <h4>Suivez-nous</h4>
          <div className="social-links">
            <a href="#" className="social-link">Facebook</a>
            <a href="#" className="social-link">Twitter</a>
            <a href="#" className="social-link">Instagram</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Soutien Collectif. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;

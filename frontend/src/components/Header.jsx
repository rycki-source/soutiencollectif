import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
          <img src="/src/components/A wide-angle landsca.png" alt="Soutien Collectif Logo" className="logo-img" />
          <h1 className="logo-text">Soutien Collectif</h1>
        </Link>

        <nav className="header-nav">
          {/* Navigation publique uniquement */}
        </nav>
      </div>
    </header>
  );
};

export default Header;

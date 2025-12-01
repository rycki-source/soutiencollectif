import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CampaignProvider, useCampaigns } from './context/CampaignContext';
import Header from './components/Header';
import Hero from './components/Hero';
import CampaignCard from './components/CampaignCard';
import DonationForm from './components/DonationForm';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

const AppContent = () => {
  const { campaigns, addDonation, getTotalRaised, getTotalGoal } = useCampaigns();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDonate = (campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleCloseDonationForm = () => {
    setSelectedCampaign(null);
  };

  const handleSubmitDonation = (donation) => {
    addDonation(donation);
    setSelectedCampaign(null);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  return (
    <>
      <Header />
      <Hero />
      
      <div className="app-container">
        {showSuccess && (
          <div className="success-message">
            🎉 Merci infiniment pour votre générosité ! Votre don va illuminer le Noël d'un enfant 🎄
          </div>
        )}

        <h2 className="section-title">Nos Campagnes Actives</h2>
        <p className="section-subtitle">
          Choisissez la cause qui vous touche le plus et contribuez à faire la différence
        </p>

        <div className="campaigns-grid">
          {campaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onDonate={handleDonate}
            />
          ))}
        </div>

        <div className="section-title" style={{ marginTop: '60px' }}>
          Ensemble, nous avons collecté {getTotalRaised().toLocaleString()} € sur {getTotalGoal().toLocaleString()} € 🎁
        </div>
      </div>

      {selectedCampaign && (
        <DonationForm
          campaign={selectedCampaign}
          onClose={handleCloseDonationForm}
          onSubmit={handleSubmitDonation}
        />
      )}

      <Footer />
    </>
  );
};

// Route protégée pour admin
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CampaignProvider>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </CampaignProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

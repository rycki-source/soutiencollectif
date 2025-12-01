import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { campaignsAPI, donationsAPI, usersAPI } from '../services/api';
import '../pages/pages.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalDonations: 0,
    totalAmount: 0,
    totalUsers: 0
  });
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Cadeaux',
    image: '',
    goal: '',
    daysLeft: 30
  });

  const fetchData = useCallback(async () => {
    try {
      const [campaignsRes, donationsRes, usersRes] = await Promise.all([
        campaignsAPI.getAll({ status: 'all' }),
        donationsAPI.getStats(),
        usersAPI.getAll()
      ]);

      setCampaigns(campaignsRes.data.data.campaigns);
      setDonations(donationsRes.data.data.recentDonations);
      
      setStats({
        totalCampaigns: campaignsRes.data.data.campaigns.length,
        totalDonations: donationsRes.data.data.totalDonations,
        totalAmount: donationsRes.data.data.totalAmount,
        totalUsers: usersRes.data.data.length
      });

      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      await campaignsAPI.create({
        ...formData,
        goal: parseFloat(formData.goal)
      });
      alert('Campagne créée avec succès !');
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'Cadeaux',
        image: '',
        goal: '',
        daysLeft: 30
      });
      fetchData();
    } catch (error) {
      alert('Erreur lors de la création de la campagne');
      console.error(error);
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) return;
    
    try {
      await campaignsAPI.delete(id);
      alert('Campagne supprimée !');
      fetchData();
    } catch (error) {
      alert('Erreur lors de la suppression');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="admin-container">Chargement...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Tableau de bord Admin</h1>
        <div>
          <span style={{ marginRight: '20px' }}>Bonjour, {user?.name}</span>
          <button onClick={logout} className="btn-secondary">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-box">
          <h3>Campagnes Totales</h3>
          <div className="stat-value">{stats.totalCampaigns}</div>
        </div>
        <div className="stat-box">
          <h3>Dons Totaux</h3>
          <div className="stat-value">{stats.totalDonations}</div>
        </div>
        <div className="stat-box">
          <h3>Montant Collecté</h3>
          <div className="stat-value">{stats.totalAmount.toLocaleString()} €</div>
        </div>
        <div className="stat-box">
          <h3>Utilisateurs</h3>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>
      </div>

      {/* Gestion des campagnes */}
      <div className="admin-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Gestion des Campagnes</h2>
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
            {showCreateForm ? 'Annuler' : 'Nouvelle Campagne'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateCampaign} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="4"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #dee2e6' }}
              />
            </div>
            <div className="form-group">
              <label>Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #dee2e6' }}
              >
                <option value="Cadeaux">Cadeaux</option>
                <option value="Repas">Repas</option>
                <option value="Divertissement">Divertissement</option>
                <option value="Éducation">Éducation</option>
                <option value="Santé">Santé</option>
              </select>
            </div>
            <div className="form-group">
              <label>URL de l'image</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Objectif (€)</label>
              <input
                type="number"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Durée (jours)</label>
              <input
                type="number"
                value={formData.daysLeft}
                onChange={(e) => setFormData({ ...formData, daysLeft: parseInt(e.target.value) })}
                required
                min="1"
              />
            </div>
            <button type="submit" className="btn-primary">
              Créer la campagne
            </button>
          </form>
        )}

        <div className="table-container" style={{ marginTop: '30px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Objectif</th>
                <th>Collecté</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign._id}>
                  <td>{campaign.title}</td>
                  <td>{campaign.category}</td>
                  <td>{campaign.goal.toLocaleString()} €</td>
                  <td>{campaign.raised.toLocaleString()} €</td>
                  <td>
                    <span className={`badge badge-${campaign.status === 'active' ? 'success' : 'warning'}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteCampaign(campaign._id)} className="btn-danger">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dons récents */}
      <div className="admin-section">
        <h2>Dons Récents</h2>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Donateur</th>
                <th>Campagne</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id}>
                  <td>{donation.donorName}</td>
                  <td>{donation.campaign?.title}</td>
                  <td>{donation.amount.toLocaleString()} €</td>
                  <td>{new Date(donation.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <span className={`badge badge-${donation.paymentStatus === 'completed' ? 'success' : 'warning'}`}>
                      {donation.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

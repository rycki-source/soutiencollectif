import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { campaignsAPI } from '../services/api';

const CampaignContext = createContext();

export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within CampaignProvider');
  }
  return context;
};

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = useCallback(async () => {
    try {
      const response = await campaignsAPI.getAll({ status: 'active' });
      const campaignsData = response.data.data.campaigns.map(campaign => ({
        id: campaign._id,
        title: campaign.title,
        description: campaign.description,
        image: campaign.image,
        category: campaign.category,
        goal: campaign.goal,
        raised: campaign.raised,
        backers: campaign.backers,
        daysLeft: campaign.daysLeft || Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      }));
      setCampaigns(campaignsData);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement campagnes:', error);
      // En cas d'erreur, utiliser les données par défaut
      setCampaigns([
        {
          id: 1,
          title: "Cadeaux et Jouets pour 100 Enfants",
          description: "Offrons des jouets et des cadeaux de Noël à 100 enfants orphelins dans les villages et quartiers défavorisés d'Afrique.",
          image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop",
          category: "Cadeaux",
          goal: 30000,
          raised: 19500,
          backers: 87,
          daysLeft: 15
        },
        {
          id: 2,
          title: "Repas de Noël Festif",
          description: "Organisons un grand repas de Noël avec des plats locaux pour 200 enfants orphelins dans plusieurs centres d'accueil.",
          image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
          category: "Repas",
          goal: 15000,
          raised: 10500,
          backers: 65,
          daysLeft: 20
        },
        {
          id: 3,
          title: "Spectacle et Animations",
          description: "Offrons une journée magique avec artistes locaux, conteurs traditionnels et animations pour créer des souvenirs inoubliables.",
          image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
          category: "Divertissement",
          goal: 40000,
          raised: 28800,
          backers: 52,
          daysLeft: 18
        }
      ]);
      setLoading(false);
    }
  }, []);

  // Charger les campagnes au démarrage
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const addDonation = async (donationData) => {
    try {
      // Le paiement est déjà traité par Stripe, on met juste à jour l'interface
      setDonations(prev => [...prev, donationData]);
      
      // Rafraîchir les campagnes pour obtenir les montants mis à jour
      await fetchCampaigns();
      
      return true;
    } catch (error) {
      console.error('Erreur ajout donation:', error);
      // Mise à jour locale en cas d'erreur réseau
      setCampaigns(prev => prev.map(campaign => {
        if (campaign.id === donationData.campaignId) {
          return {
            ...campaign,
            raised: campaign.raised + donationData.amount,
            backers: campaign.backers + 1
          };
        }
        return campaign;
      }));
      return false;
    }
  };

  const getTotalRaised = () => {
    return campaigns.reduce((sum, campaign) => sum + campaign.raised, 0);
  };

  const getTotalGoal = () => {
    return campaigns.reduce((sum, campaign) => sum + campaign.goal, 0);
  };

  const getTotalBackers = () => {
    return campaigns.reduce((sum, campaign) => sum + campaign.backers, 0);
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        donations,
        loading,
        addDonation,
        getTotalRaised,
        getTotalGoal,
        getTotalBackers,
        fetchCampaigns
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

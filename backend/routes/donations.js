import express from 'express';
import { User, Campaign, Donation } from '../models/index.js';
import { protect, admin } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = express.Router();

// @route   GET /api/donations
// @desc    Obtenir toutes les donations (admin) ou donations d'un utilisateur
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let where = {};
    
    // Si non admin, montrer seulement les dons de l'utilisateur
    if (req.user.role !== 'admin') {
      where.donorId = req.user.id;
    }

    const donations = await Donation.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: donations
    });
  } catch (error) {
    console.error('Erreur récupération donations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des donations'
    });
  }
});

// @route   GET /api/donations/campaign/:campaignId
// @desc    Obtenir les donations d'une campagne spécifique
// @access  Public
router.get('/campaign/:campaignId', async (req, res) => {
  try {
    const donations = await Donation.findAll({
      where: {
        campaignId: req.params.campaignId,
        paymentStatus: 'completed'
      },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    // Masquer les emails si anonyme
    const sanitizedDonations = donations.map(donation => {
      const obj = donation.toJSON();
      if (obj.isAnonymous) {
        delete obj.donorEmail;
        obj.donorName = 'Anonyme';
      }
      return obj;
    });

    res.json({
      success: true,
      data: sanitizedDonations
    });
  } catch (error) {
    console.error('Erreur récupération donations campagne:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des donations'
    });
  }
});

// @route   GET /api/donations/stats
// @desc    Obtenir les statistiques des donations
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalDonations = await Donation.count({ where: { paymentStatus: 'completed' } });
    const totalAmount = await Donation.sum('amount', { where: { paymentStatus: 'completed' } });

    const recentDonations = await Donation.findAll({
      where: { paymentStatus: 'completed' },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: {
        totalDonations,
        totalAmount: totalAmount || 0,
        recentDonations
      }
    });
  } catch (error) {
    console.error('Erreur statistiques donations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

export default router;

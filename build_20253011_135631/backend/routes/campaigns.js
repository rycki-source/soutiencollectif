import express from 'express';
import { User, Campaign, Donation } from '../models/index.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/campaigns
// @desc    Obtenir toutes les campagnes actives
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status = 'active', limit = 20, page = 1 } = req.query;
    
    const where = status === 'all' ? {} : { status };
    
    const { count, rows: campaigns } = await Campaign.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      data: {
        campaigns,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Erreur récupération campagnes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des campagnes'
    });
  }
});

// @route   GET /api/campaigns/:id
// @desc    Obtenir une campagne spécifique
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campagne non trouvée'
      });
    }

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error('Erreur récupération campagne:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la campagne'
    });
  }
});

// @route   POST /api/campaigns
// @desc    Créer une nouvelle campagne
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, category, image, goal, daysLeft } = req.body;

    // Calculer la date de fin
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (daysLeft || 30));

    const campaign = await Campaign.create({
      title,
      description,
      category,
      image,
      goal,
      daysLeft: daysLeft || 30,
      endDate,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Campagne créée avec succès',
      data: campaign
    });
  } catch (error) {
    console.error('Erreur création campagne:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la campagne',
      error: error.message
    });
  }
});

// @route   PUT /api/campaigns/:id
// @desc    Mettre à jour une campagne
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campagne non trouvée'
      });
    }

    await campaign.update(req.body);

    res.json({
      success: true,
      message: 'Campagne mise à jour avec succès',
      data: campaign
    });
  } catch (error) {
    console.error('Erreur mise à jour campagne:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la campagne'
    });
  }
});

// @route   DELETE /api/campaigns/:id
// @desc    Supprimer une campagne
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campagne non trouvée'
      });
    }

    await campaign.destroy();

    res.json({
      success: true,
      message: 'Campagne supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression campagne:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la campagne'
    });
  }
});

export default router;

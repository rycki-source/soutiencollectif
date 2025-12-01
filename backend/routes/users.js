import express from 'express';
import { User, Campaign, Donation } from '../models/index.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/me
// @desc    Obtenir le profil de l'utilisateur connecté
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
});

// @route   PUT /api/users/me
// @desc    Mettre à jour le profil de l'utilisateur
// @access  Private
router.put('/me', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findByPk(req.user.id);
    await user.update({ name, email });

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: user
    });
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
});

// @route   GET /api/users
// @desc    Obtenir tous les utilisateurs
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
});

export default router;

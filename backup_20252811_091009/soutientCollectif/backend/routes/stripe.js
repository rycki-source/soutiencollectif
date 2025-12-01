import express from 'express';
import Stripe from 'stripe';
import { User, Campaign, Donation } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @route   POST /api/stripe/create-payment-intent
// @desc    Créer une intention de paiement Stripe
// @access  Public
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, campaignId, donorEmail, donorName } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Montant invalide'
      });
    }

    // Vérifier que la campagne existe
    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campagne non trouvée'
      });
    }

    // Créer une intention de paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir en centimes
      currency: 'eur',
      metadata: {
        campaignId,
        campaignTitle: campaign.title,
        donorEmail: donorEmail || 'anonyme',
        donorName: donorName || 'Anonyme'
      },
      receipt_email: donorEmail || undefined,
      description: `Don pour: ${campaign.title}`
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du paiement',
      error: error.message
    });
  }
});

// @route   POST /api/stripe/webhook
// @desc    Webhook Stripe pour confirmer les paiements
// @access  Public (mais vérifié par Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer l'événement
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    try {
      // Créer le don dans la base de données
      const donation = await Donation.create({
        amount: paymentIntent.amount / 100, // Convertir de centimes en euros
        campaignId: paymentIntent.metadata.campaignId,
        donorEmail: paymentIntent.metadata.donorEmail,
        donorName: paymentIntent.metadata.donorName,
        isAnonymous: paymentIntent.metadata.donorEmail === 'anonyme',
        paymentMethod: 'stripe',
        paymentStatus: 'completed',
        stripePaymentIntentId: paymentIntent.id,
        receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
      });

      // Mettre à jour la campagne
      const campaign = await Campaign.findByPk(paymentIntent.metadata.campaignId);
      if (campaign) {
        await campaign.increment({
          raised: paymentIntent.amount / 100,
          backers: 1
        });
      }

      console.log('✅ Don enregistré avec succès:', donation.id);
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement du don:', error);
    }
  }

  res.json({ received: true });
});

// @route   GET /api/stripe/config
// @desc    Obtenir la clé publique Stripe
// @access  Public
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    }
  });
});

export default router;

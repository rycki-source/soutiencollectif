import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend Soutien Collectif en ligne (mode test sans MongoDB)',
    timestamp: new Date().toISOString(),
    mongodb: 'Déconnecté - Configurez MongoDB Atlas'
  });
});

// Stripe config route (pour que le frontend puisse charger)
app.get('/api/stripe/config', (req, res) => {
  res.json({
    success: true,
    data: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_en_attente'
    }
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur TEST démarré sur le port ${PORT}`);
  console.log(`📍 API disponible sur http://localhost:${PORT}/api`);
  console.log(`⚠️  Mode TEST - MongoDB non connecté`);
  console.log(`📖 Configurez MongoDB Atlas pour activer toutes les fonctionnalités`);
});

// Empêcher le serveur de se fermer
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt du serveur...');
  server.close(() => {
    console.log('Serveur arrêté');
  });
});

export default app;

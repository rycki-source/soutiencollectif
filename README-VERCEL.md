# Guide de Déploiement Vercel - Soutien Collectif

## 📋 Prérequis

1. Compte Vercel
2. Repository GitHub connecté
3. Base de données PostgreSQL (recommandé : Vercel Postgres, Neon, ou Supabase)

## 🚀 Étapes de Déploiement

### 1. Importer le projet sur Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "Add New Project"
3. Importer votre repository `soutiencollectif`
4. Vercel détectera automatiquement la configuration

### 2. Configurer les Variables d'Environnement

Dans les paramètres du projet Vercel, ajouter ces variables :

#### Backend (OBLIGATOIRES)
```
NODE_ENV=production
PORT=5000

# PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=votre_secret_jwt_tres_long_et_securise

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-app

# URLs
FRONTEND_URL=https://votre-domaine.vercel.app
ADMIN_URL=https://votre-admin.vercel.app
BACKEND_URL=https://votre-domaine.vercel.app/api
```

#### Frontend (OBLIGATOIRES)
```
VITE_API_URL=https://votre-domaine.vercel.app/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### 3. Déployer

Cliquez sur "Deploy" - Vercel va :
1. Installer les dépendances du frontend et backend
2. Builder le frontend avec Vite
3. Configurer le backend comme serverless functions
4. Déployer l'application complète

### 4. Configuration Base de Données

#### Option A : Vercel Postgres (Recommandé)
1. Dans votre projet Vercel, aller dans "Storage"
2. Créer une base Postgres
3. Copier `DATABASE_URL` dans les variables d'environnement

#### Option B : Neon / Supabase
1. Créer une base PostgreSQL sur [neon.tech](https://neon.tech) ou [supabase.com](https://supabase.com)
2. Copier la connection string
3. L'ajouter comme `DATABASE_URL`

### 5. Webhook Stripe

1. Aller dans Stripe Dashboard > Developers > Webhooks
2. Ajouter un endpoint : `https://votre-domaine.vercel.app/api/stripe/webhook`
3. Sélectionner les événements : `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copier le `STRIPE_WEBHOOK_SECRET`
5. L'ajouter dans les variables Vercel

## 🔧 Configuration Post-Déploiement

### Domaine Personnalisé (Optionnel)
1. Aller dans "Settings" > "Domains"
2. Ajouter votre domaine
3. Suivre les instructions DNS

### Logs et Monitoring
- Voir les logs en temps réel dans l'onglet "Deployments"
- Utiliser l'onglet "Analytics" pour les métriques

## ⚠️ Notes Importantes

1. **Serverless Functions** : Le backend tournera comme serverless functions avec limite de 10s d'exécution (plan gratuit)
2. **Cold Starts** : Première requête peut être lente après inactivité
3. **PostgreSQL** : Utilisez connection pooling (ex: Prisma Data Proxy ou Supabase)
4. **Static Files** : Le frontend est servi en tant que site statique ultra-rapide

## 🐛 Troubleshooting

### Erreur "Cannot find module"
- Vérifier que toutes les dépendances sont dans `package.json`
- Redéployer

### Erreur 500 Backend
- Vérifier les logs Vercel
- Vérifier `DATABASE_URL` et variables d'environnement
- Vérifier les imports ES modules (`import` au lieu de `require`)

### Frontend ne charge pas
- Vérifier `VITE_API_URL` dans les variables d'environnement
- Vérifier le build : `cd frontend && npm run build`

## 📞 Support

En cas de problème :
1. Vérifier les logs Vercel
2. Tester localement avec `npm run dev`
3. Vérifier la documentation : [vercel.com/docs](https://vercel.com/docs)

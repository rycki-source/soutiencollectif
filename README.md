# 🎄 Soutien Collectif - Plateforme de Collecte de Fonds

Une plateforme complète de crowdfunding dédiée aux enfants orphelins d'Afrique pour les fêtes de Noël.

## 🚀 Fonctionnalités

- ✅ **Interface publique** - Consultation et donation aux campagnes
- ✅ **Interface administrateur** - Gestion complète des campagnes
- ✅ **Paiements sécurisés** - Intégration Stripe
- ✅ **Base de données** - PostgreSQL avec Sequelize ORM
- ✅ **Authentification** - JWT avec rôles utilisateur
- ✅ **Responsive** - Compatible mobile et desktop

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL 12+
- Compte Stripe (pour les paiements)

## ⚡ Installation Rapide

```bash
# Cloner le projet
git clone https://github.com/votre-username/soutien-collectif.git
cd soutien-collectif

# Installer toutes les dépendances
npm install

# Configurer les variables d'environnement
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Configurer PostgreSQL et mettre à jour backend/.env

# Démarrer en mode développement
npm run dev
```

## 🗂️ Structure du Projet

```
soutien-collectif/
├── backend/          # API Node.js + Express + PostgreSQL
├── frontend/         # Interface React + Vite
├── admin/           # Interface admin HTML/JS
├── docs/            # Documentation
└── package.json     # Scripts globaux
```

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_NAME=soutien_collectif
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:3001
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Déploiement

### 1. Préparer la Production

```bash
# Build du frontend
npm run build

# Variables d'environnement production
cp backend/.env.example backend/.env.production
# Modifier les valeurs pour la production
```

### 2. Déploiement Backend

**Heroku :**
```bash
# Dans le dossier backend
heroku create your-app-api
heroku addons:create heroku-postgresql
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set STRIPE_SECRET_KEY=sk_live_...
git subtree push --prefix backend heroku main
```

**Render/Railway :**
- Connecter le dossier `backend`
- Configurer les variables d'environnement
- Ajouter PostgreSQL add-on

### 3. Déploiement Frontend

**Vercel :**
```bash
cd frontend
vercel --prod
```

**Netlify :**
```bash
cd frontend
npm run build
# Glisser-déposer le dossier dist
```

### 4. Déploiement Admin

```bash
cd admin
# Déployer sur le même domaine ou sous-domaine
```

## 📡 URLs de Production

- **Site public** : https://soutiencollectif.com
- **Interface admin** : https://admin.soutiencollectif.com  
- **API** : https://api.soutiencollectif.com

## 🔐 Sécurité

- ✅ JWT avec expiration
- ✅ CORS configuré
- ✅ Variables d'environnement sécurisées
- ✅ Validation des données
- ✅ Protection contre XSS/CSRF

## 📊 Monitoring

- Health check : `/health` et `/api/health`
- Logs structurés
- Gestion d'erreurs centralisée

## 🛠️ Scripts Disponibles

```bash
npm run dev              # Mode développement complet
npm run start           # Production backend
npm run build           # Build frontend
npm run install:all     # Installer toutes dépendances
```

## 🔍 Comptes par Défaut

**Administrateur :**
- Email: `admin@soutiencollectif.org`
- Mot de passe: `AdminSecure123!`

## 📞 Support

- Documentation : [docs/](./docs/)
- Issues : [GitHub Issues](https://github.com/votre-username/soutien-collectif/issues)
- Email : support@soutiencollectif.org

---

Développé avec ❤️ pour aider les enfants orphelins d'Afrique 🌍
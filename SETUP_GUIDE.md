# Guide de Configuration - Soutien Collectif

## 🚀 Installation Complète

### Prérequis
- Node.js (v18 ou supérieur)
- MongoDB installé localement OU compte MongoDB Atlas
- Compte Stripe (mode test)

---

## 📝 Étapes de Configuration

### 1. Configuration Backend

#### A. Installation des dépendances
```powershell
cd backend
npm install
```

#### B. Configuration MongoDB

**Option 1 : MongoDB Local**
- Installer MongoDB Community Server : https://www.mongodb.com/try/download/community
- Démarrer MongoDB :
```powershell
# Windows - démarre automatiquement comme service après installation
# Vérifier que MongoDB tourne :
mongosh
```

**Option 2 : MongoDB Atlas (recommandé)**
1. Créer un compte gratuit sur https://www.mongodb.com/cloud/atlas
2. Créer un cluster gratuit
3. Créer un utilisateur de base de données (Database Access)
4. Whitelist votre IP (Network Access) : ajouter `0.0.0.0/0` pour tout autoriser
5. Obtenir la chaîne de connexion : Clusters → Connect → Connect your application
6. Remplacer dans `.env` :
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/soutien-collectif?retryWrites=true&w=majority
```

#### C. Configuration Stripe
1. Créer un compte sur https://stripe.com
2. Aller sur https://dashboard.stripe.com/test/apikeys
3. Copier :
   - **Publishable key** (commence par `pk_test_`)
   - **Secret key** (commence par `sk_test_`)
4. Mettre à jour dans `.env` :
```
STRIPE_SECRET_KEY=sk_test_votre_cle
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle
```

#### D. Configuration Webhook Stripe (pour production)
1. Installer Stripe CLI : https://stripe.com/docs/stripe-cli
2. Lancer le webhook local :
```powershell
stripe listen --forward-to localhost:5000/api/stripe/webhook
```
3. Copier le webhook secret (commence par `whsec_`) dans `.env`

**Pour développement local** : le webhook peut être testé avec Stripe CLI

#### E. Générer JWT Secret
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copier le résultat dans `.env` comme `JWT_SECRET`

#### F. Configuration Email (optionnel)
Pour l'envoi de reçus par email :
1. Utiliser Gmail avec "App Password"
2. Activer l'authentification à deux facteurs
3. Générer un mot de passe d'application : https://myaccount.google.com/apppasswords
4. Mettre à jour dans `.env` :
```
EMAIL_USER=votre_email@gmail.com
EMAIL_PASSWORD=mot_de_passe_application_16_caracteres
```

#### G. Démarrer le backend
```powershell
cd backend
npm run dev
```
Le serveur démarre sur http://localhost:5000

---

### 2. Configuration Frontend

#### A. Installation des dépendances
```powershell
cd frontend
npm install
```

#### B. Vérifier le fichier .env
Le fichier `.env` doit contenir :
```
VITE_API_URL=http://localhost:5000/api
```

#### C. Démarrer le frontend
```powershell
cd frontend
npm run dev
```
L'application démarre sur http://localhost:5173

---

## 🎯 Initialisation des Données

### Créer les campagnes de base

Une fois le backend démarré, vous devez :

1. **Créer un compte admin** :
   - Aller sur http://localhost:5173/register
   - S'inscrire avec l'email configuré dans `ADMIN_EMAIL`
   - Vous pouvez aussi créer l'admin directement en base

2. **Se connecter** :
   - Aller sur http://localhost:5173/login
   - Se connecter avec les identifiants admin

3. **Créer les campagnes** :
   - Aller sur http://localhost:5173/admin
   - Cliquer sur "Nouvelle Campagne"
   - Créer les 3 campagnes :

**Campagne 1 : Cadeaux et Jouets**
- Titre : `Cadeaux et Jouets pour 100 Enfants`
- Description : `Offrons des jouets et des cadeaux de Noël à 100 enfants orphelins dans les villages et quartiers défavorisés d'Afrique.`
- Catégorie : `Cadeaux`
- Image : `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop`
- Objectif : `30000`
- Durée : `15` jours

**Campagne 2 : Repas de Noël**
- Titre : `Repas de Noël Festif`
- Description : `Organisons un grand repas de Noël avec des plats locaux pour 200 enfants orphelins dans plusieurs centres d'accueil.`
- Catégorie : `Repas`
- Image : `https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop`
- Objectif : `15000`
- Durée : `20` jours

**Campagne 3 : Spectacle et Animations**
- Titre : `Spectacle et Animations`
- Description : `Offrons une journée magique avec artistes locaux, conteurs traditionnels et animations pour créer des souvenirs inoubliables.`
- Catégorie : `Divertissement`
- Image : `https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop`
- Objectif : `40000`
- Durée : `18` jours

---

## 🧪 Tester les Paiements

### Cartes de test Stripe
- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0027 6000 3184`
- Date d'expiration : n'importe quelle date future
- CVC : n'importe quel 3 chiffres
- Code postal : n'importe quel code

### Processus de test
1. Aller sur http://localhost:5173
2. Cliquer sur "Faire un don" sur une campagne
3. Remplir le formulaire de don
4. Entrer les informations de la carte de test
5. Valider le paiement
6. Vérifier que :
   - Le message de succès s'affiche
   - Le montant de la campagne est mis à jour
   - Le don apparaît dans l'admin

---

## 📂 Structure des Dossiers

```
soutientCollectif/
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── context/         # Context API (Auth, Campaigns)
│   │   ├── pages/           # Pages (Login, Register, Admin)
│   │   └── services/        # Services API
│   ├── .env                 # Variables d'environnement
│   └── package.json
│
└── backend/
    ├── models/              # Modèles Mongoose
    ├── routes/              # Routes API
    ├── middleware/          # Middleware (auth)
    ├── .env                 # Variables d'environnement
    ├── server.js            # Point d'entrée
    └── package.json
```

---

## 🔧 Commandes Utiles

### Backend
```powershell
npm run dev          # Démarrer en mode développement
npm start            # Démarrer en production
```

### Frontend
```powershell
npm run dev          # Démarrer en mode développement
npm run build        # Build pour production
npm run preview      # Preview du build
```

### MongoDB
```powershell
mongosh                                      # Ouvrir le shell MongoDB
use soutien-collectif                        # Sélectionner la base
db.campaigns.find().pretty()                 # Voir les campagnes
db.donations.find().pretty()                 # Voir les dons
db.users.find().pretty()                     # Voir les utilisateurs
```

---

## ❗ Résolution de Problèmes

### Backend ne démarre pas
- Vérifier que MongoDB tourne : `mongosh`
- Vérifier les variables d'environnement dans `.env`
- Vérifier que le port 5000 est libre

### Frontend ne se connecte pas au backend
- Vérifier que `VITE_API_URL` dans `.env` est correct
- Vérifier que le backend tourne sur le port 5000
- Ouvrir la console du navigateur pour voir les erreurs

### Erreur de paiement Stripe
- Vérifier les clés Stripe dans `.env` backend
- Utiliser les cartes de test Stripe
- Vérifier la console backend pour les logs

### Erreur CORS
- Vérifier que `FRONTEND_URL` dans `.env` backend est `http://localhost:5173`
- Redémarrer le backend après modification

---

## 🎉 C'est Prêt !

Votre application de crowdfunding est maintenant opérationnelle !

- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:5000
- **Admin** : http://localhost:5173/admin

Bon développement ! 🚀

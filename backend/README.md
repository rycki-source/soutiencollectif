# Backend Soutien Collectif - Documentation

## 🚀 Installation

### Prérequis
- Node.js (v18+)
- MongoDB (local ou Atlas)
- Compte Stripe (pour les paiements)

### Configuration

1. **Installer les dépendances** :
```bash
cd backend
npm install
```

2. **Configurer les variables d'environnement** :
```bash
cp .env.example .env
```

Puis modifiez `.env` avec vos valeurs :
- `MONGODB_URI` : URL de connexion MongoDB
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `STRIPE_SECRET_KEY` : Clé secrète Stripe
- `STRIPE_PUBLISHABLE_KEY` : Clé publique Stripe
- `STRIPE_WEBHOOK_SECRET` : Secret du webhook Stripe

3. **Démarrer le serveur** :
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

## 📡 API Endpoints

### Authentification (`/api/auth`)

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Campagnes (`/api/campaigns`)

#### Obtenir toutes les campagnes
```http
GET /api/campaigns?status=active&limit=20&page=1
```

#### Obtenir une campagne
```http
GET /api/campaigns/:id
```

#### Créer une campagne (Admin)
```http
POST /api/campaigns
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Nouvelle campagne",
  "description": "Description...",
  "category": "Cadeaux",
  "image": "https://...",
  "goal": 10000,
  "daysLeft": 30
}
```

#### Mettre à jour une campagne (Admin)
```http
PUT /api/campaigns/:id
Authorization: Bearer {token}
```

#### Supprimer une campagne (Admin)
```http
DELETE /api/campaigns/:id
Authorization: Bearer {token}
```

### Donations (`/api/donations`)

#### Obtenir les donations d'un utilisateur
```http
GET /api/donations
Authorization: Bearer {token}
```

#### Obtenir les donations d'une campagne
```http
GET /api/donations/campaign/:campaignId
```

#### Statistiques des donations (Admin)
```http
GET /api/donations/stats
Authorization: Bearer {token}
```

### Stripe (`/api/stripe`)

#### Créer une intention de paiement
```http
POST /api/stripe/create-payment-intent
Content-Type: application/json

{
  "amount": 50,
  "campaignId": "campaign_id",
  "donorEmail": "donor@example.com",
  "donorName": "John Doe"
}
```

#### Obtenir la clé publique Stripe
```http
GET /api/stripe/config
```

#### Webhook Stripe
```http
POST /api/stripe/webhook
```

### Utilisateurs (`/api/users`)

#### Obtenir le profil
```http
GET /api/users/me
Authorization: Bearer {token}
```

#### Mettre à jour le profil
```http
PUT /api/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Name",
  "email": "new@example.com"
}
```

#### Obtenir tous les utilisateurs (Admin)
```http
GET /api/users
Authorization: Bearer {token}
```

## 🔐 Authentification

Toutes les routes protégées nécessitent un token JWT dans le header :
```
Authorization: Bearer {votre_token_jwt}
```

## 💳 Configuration Stripe

1. Créez un compte sur [Stripe](https://stripe.com)
2. Obtenez vos clés API (test et production)
3. Configurez un webhook pointant vers `/api/stripe/webhook`
4. Copiez le secret du webhook dans `.env`

## 🗄️ Modèles de données

### User
- name, email, password
- role (user/admin)
- donations (référence)

### Campaign
- title, description, category
- goal, raised, backers
- image, status, endDate
- createdBy (référence User)

### Donation
- amount, campaign (référence)
- donor (référence), donorName, donorEmail
- paymentStatus, stripePaymentIntentId
- isAnonymous, message

## 🛡️ Sécurité

- Mots de passe hashés avec bcrypt
- Tokens JWT pour l'authentification
- Validation des données avec express-validator
- Protection CORS configurée
- Webhooks Stripe vérifiés

## 📊 Rôles

- **user** : Utilisateur normal (peut faire des dons)
- **admin** : Administrateur (gestion complète)

## 🧪 Tests

Pour tester l'API, utilisez Postman ou Insomnia avec la collection fournie.

## 🐛 Débogage

Logs détaillés dans la console pour chaque opération.

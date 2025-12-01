# 🚀 GUIDE DE DÉPLOIEMENT RAPIDE

## 📦 Contenu du Build de Production

Votre projet a été compilé avec succès ! Voici ce qui a été créé :

### 📁 Structure du Build
```
soutien-collectif-production/
├── backend/           # Serveur Node.js + PostgreSQL
├── frontend/          # Application React compilée 
├── admin/            # Interface administrateur
├── docs/             # Documentation
├── ecosystem.config.js # Configuration PM2
├── .env.production   # Variables d'environnement (À CONFIGURER)
├── start-production.sh # Script de démarrage Linux
├── start-production.bat # Script de démarrage Windows
└── DEPLOIEMENT.md    # Instructions détaillées
```

## ⚡ Déploiement Express (3 méthodes)

### Option 1: Heroku (Gratuit/Facile)
```bash
# 1. Extraire l'archive
unzip soutien-collectif-production.zip

# 2. Backend sur Heroku
cd backend
git init && git add . && git commit -m "Production build"
heroku create votre-app-api
heroku addons:create heroku-postgresql:mini
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_here
heroku config:set STRIPE_SECRET_KEY=sk_live_your_key
git push heroku main

# 3. Frontend sur Vercel
cd ../frontend
npx vercel --prod
```

### Option 2: VPS/Serveur Dédié
```bash
# 1. Sur votre serveur
sudo apt update && sudo apt install nodejs npm postgresql nginx

# 2. Télécharger et extraire
wget your-domain.com/soutien-collectif-production.zip
unzip soutien-collectif-production.zip

# 3. Configuration PostgreSQL
sudo -u postgres psql
CREATE DATABASE soutien_collectif;
CREATE USER soutien_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE soutien_collectif TO soutien_user;

# 4. Configurer les variables d'environnement
nano backend/.env.production
# Modifier les valeurs DB_, JWT_SECRET, STRIPE_, etc.

# 5. Installer PM2 et démarrer
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save && pm2 startup
```

### Option 3: Hébergement Partagé (cPanel)
1. Uploadez le contenu via FTP
2. Activez Node.js dans cPanel  
3. Créez la base PostgreSQL
4. Configurez les variables d'environnement
5. Démarrez l'application Node.js

## 🔧 Configuration Requise

### Variables d'environnement essentielles (backend/.env.production)
```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_NAME=soutien_collectif
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secure_jwt_secret
STRIPE_SECRET_KEY=sk_live_your_production_key
FRONTEND_URL=https://your-domain.com
ADMIN_URL=https://admin.your-domain.com
```

### Configuration Nginx
```nginx
# Site principal
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000;
    }
}

# Interface admin
server {
    listen 80;
    server_name admin.your-domain.com;
    root /path/to/admin;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🎯 URLs de Production

Une fois déployé, votre application sera accessible sur :

- **Site public** : https://your-domain.com
- **Interface admin** : https://admin.your-domain.com  
- **API** : https://your-domain.com/api

## 🔐 Comptes par Défaut

**Administrateur :**
- Email: admin@soutiencollectif.org
- Mot de passe: AdminSecure123!

## ✅ Vérification du Déploiement

```bash
# Test de l'API
curl https://your-domain.com/api/health

# Test de connexion admin
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@soutiencollectif.org","password":"AdminSecure123!"}'
```

## 🆘 Support

- **Logs** : `pm2 logs` ou vérifiez les logs de votre hébergeur
- **Base de données** : Vérifiez la connexion PostgreSQL
- **Stripe** : Configurez les clés de production
- **SSL** : Activez HTTPS avec Let's Encrypt ou votre hébergeur

---

**🎉 Félicitations ! Votre plateforme de collecte de fonds est prête à aider les enfants orphelins d'Afrique !**
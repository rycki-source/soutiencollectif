# 🚀 Guide de Déploiement - Soutien Collectif

Guide complet pour déployer l'application sans Docker.

## 📋 Prérequis

- **Node.js 18+**
- **PostgreSQL 12+**  
- **Compte Stripe** (pour les paiements)
- **Serveur web** (Apache/Nginx) ou hébergeur (Heroku, Render, etc.)

## 🎯 Options de Déploiement

### Option 1: Hébergement Cloud (Recommandé)

#### Backend sur Heroku
```bash
# 1. Préparer le backend
cd backend
git init
git add .
git commit -m "Initial commit"

# 2. Créer l'app Heroku
heroku create soutien-collectif-api
heroku addons:create heroku-postgresql:mini

# 3. Configurer les variables d'environnement
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secure_jwt_secret
heroku config:set STRIPE_SECRET_KEY=sk_live_your_key
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_your_key
heroku config:set FRONTEND_URL=https://soutien-collectif.vercel.app
heroku config:set ADMIN_URL=https://admin-soutien-collectif.vercel.app

# 4. Déployer
git push heroku main
```

#### Frontend sur Vercel
```bash
# 1. Build et déploiement
cd frontend
npm run build

# 2. Sur Vercel.com
# - Connecter le repo GitHub
# - Définir VITE_API_URL=https://soutien-collectif-api.herokuapp.com/api
# - Déployer automatiquement
```

#### Admin sur Netlify
```bash
# 1. Modifier l'API_URL dans index.html
# 2. Créer un dossier de build
mkdir admin-build
cp admin/* admin-build/

# 3. Sur Netlify.com
# - Glisser-déposer le dossier admin-build
# - Configurer le domaine custom si nécessaire
```

### Option 2: Serveur Dédié (VPS)

#### Installation sur Ubuntu/Debian
```bash
# 1. Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Installer PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# 3. Configurer PostgreSQL
sudo -u postgres psql
CREATE DATABASE soutien_collectif;
CREATE USER soutien_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE soutien_collectif TO soutien_user;

# 4. Installer PM2 (gestionnaire de processus)
sudo npm install -g pm2

# 5. Cloner et installer l'application
git clone https://github.com/votre-repo/soutien-collectif.git
cd soutien-collectif
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install

# 6. Configurer les variables d'environnement
cp backend/.env.example backend/.env
# Modifier backend/.env avec vos valeurs

# 7. Build du frontend
cd frontend
npm run build

# 8. Démarrer avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 3: Hébergement Partagé

#### Configuration pour cPanel
```bash
# 1. Upload des fichiers via FTP
# 2. Installer Node.js dans cPanel
# 3. Créer la base de données PostgreSQL
# 4. Configurer les variables d'environnement
# 5. Démarrer l'application via Node.js App
```

## ⚙️ Configuration PM2 (ecosystem.config.js)

```javascript
module.exports = {
  apps: [
    {
      name: 'soutien-backend',
      cwd: './backend',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'soutien-admin',
      cwd: './admin',
      script: 'server.js',
      env: {
        PORT: 3001
      }
    }
  ]
};
```

## 🌐 Configuration Nginx

```nginx
# /etc/nginx/sites-available/soutien-collectif
server {
    listen 80;
    server_name soutiencollectif.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name soutiencollectif.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend (fichiers statiques)
    location / {
        root /var/www/soutien-collectif/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API Backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Admin interface
server {
    listen 443 ssl;
    server_name admin.soutiencollectif.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔐 Sécurité

### SSL/TLS avec Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d soutiencollectif.com -d admin.soutiencollectif.com
```

### Firewall
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

## 📊 Monitoring

### Logs avec PM2
```bash
pm2 logs
pm2 logs soutien-backend
pm2 monit
```

### Backup Base de Données
```bash
# Script de backup automatique
#!/bin/bash
pg_dump -h localhost -U soutien_user soutien_collectif > backup_$(date +%Y%m%d).sql
```

## 🧪 Test de Déploiement

```bash
# Lancer le script de test
node test-deployment.js
```

## 📞 Support

- **Logs Backend**: `pm2 logs soutien-backend`
- **Logs Admin**: `pm2 logs soutien-admin`
- **Base de données**: Vérifier la connexion PostgreSQL
- **APIs**: Tester avec `curl` ou Postman

## 🔄 Mise à jour

```bash
# 1. Backup
pg_dump soutien_collectif > backup.sql

# 2. Pull des changements
git pull origin main

# 3. Installer dépendances
npm install
cd backend && npm install
cd ../frontend && npm install

# 4. Build frontend
cd frontend && npm run build

# 5. Redémarrer les services
pm2 restart all
```

---

🎯 **Votre application sera accessible sur :**
- Site public: https://soutiencollectif.com
- Admin: https://admin.soutiencollectif.com
- API: https://soutiencollectif.com/api
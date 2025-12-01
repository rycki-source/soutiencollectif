# 🌐 GUIDE DE DÉPLOIEMENT FTP

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :
- ✅ Un hébergeur web (OVH, Hostinger, o2switch, LWS, etc.)
- ✅ Accès FTP (hôte, utilisateur, mot de passe)
- ✅ Base de données PostgreSQL ou MySQL disponible
- ✅ Node.js activé sur votre hébergement (vérifiez avec votre hébergeur)

## 🎯 Étape 1 : Préparer les Fichiers

### A. Build du Frontend

```bash
cd frontend
npm install
npm run build
```

Cela crée un dossier `dist/` avec les fichiers HTML/CSS/JS optimisés.

### B. Préparer le Backend

Le backend ne nécessite pas de build, mais vous devez :
1. Avoir un fichier `.env` configuré
2. Installer les dépendances en production

## 📁 Étape 2 : Structure sur l'Hébergeur

Voici comment organiser vos fichiers sur le serveur FTP :

```
/public_html/  (ou /www/ selon hébergeur)
├── index.html                 # Du frontend/dist/
├── assets/                    # Du frontend/dist/assets/
│   ├── index-xxx.js
│   └── index-xxx.css
├── api/                       # Tout le dossier backend/
│   ├── server.js
│   ├── package.json
│   ├── .env                   # IMPORTANT : à créer
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── middleware/
└── admin/                     # Interface admin
    ├── index.html
    ├── styles.css
    └── script.js
```

## 🚀 Étape 3 : Transfert FTP

### Option 1 : Utiliser FileZilla (Recommandé)

1. **Télécharger FileZilla** : https://filezilla-project.org/

2. **Connectez-vous** :
   - Hôte : `ftp.votre-domaine.com` (fourni par votre hébergeur)
   - Utilisateur : Votre nom d'utilisateur FTP
   - Mot de passe : Votre mot de passe FTP
   - Port : 21 (ou 22 pour SFTP)

3. **Transférer les fichiers** :
   
   **Frontend :**
   ```
   Local: frontend/dist/*
   Distant: /public_html/
   
   - Copiez TOUT le contenu de frontend/dist/ directement dans public_html/
   - Ne créez PAS de sous-dossier "dist"
   ```

   **Backend (API) :**
   ```
   Local: backend/*
   Distant: /public_html/api/
   
   - Créez le dossier "api" sur le serveur
   - Copiez tout le contenu du dossier backend/ dedans
   ```

   **Admin :**
   ```
   Local: admin/*
   Distant: /public_html/admin/
   
   - Créez le dossier "admin" sur le serveur
   - Copiez tous les fichiers admin dedans
   ```

### Option 2 : Via WinSCP (Windows)

1. Téléchargez WinSCP : https://winscp.net/
2. Même procédure que FileZilla
3. Glissez-déposez les dossiers

### Option 3 : Via cPanel File Manager

1. Connectez-vous à votre cPanel
2. Ouvrez "Gestionnaire de fichiers"
3. Uploadez les fichiers via l'interface web
4. Utilisez l'extracteur pour les archives ZIP

## ⚙️ Étape 4 : Configuration

### A. Créer le fichier .env sur le serveur

Via FileZilla ou cPanel, créez `/public_html/api/.env` avec :

```env
NODE_ENV=production
PORT=5000

# Base de données (à adapter selon votre hébergeur)
DB_HOST=localhost
DB_NAME=votre_base_de_donnees
DB_USER=votre_utilisateur_db
DB_PASSWORD=votre_mot_de_passe_db
DB_PORT=5432

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise_ici

# URLs
FRONTEND_URL=https://votre-domaine.com
ADMIN_URL=https://votre-domaine.com/admin
```

### B. Configurer la Base de Données

#### Via phpMyAdmin (si MySQL) :
1. Créez une nouvelle base de données
2. Notez les identifiants
3. Les tables seront créées automatiquement au premier démarrage

#### Via PostgreSQL :
```sql
CREATE DATABASE soutien_collectif;
CREATE USER soutien_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE soutien_collectif TO soutien_user;
```

### C. Installer les dépendances Node.js

**Méthode 1 : Via SSH (si disponible)**
```bash
ssh votre_utilisateur@votre-domaine.com
cd public_html/api
npm install --production
```

**Méthode 2 : Via cPanel Terminal**
1. Ouvrez "Terminal" dans cPanel
2. Exécutez :
```bash
cd public_html/api
npm install --production
```

**Méthode 3 : Via Node.js Selector (cPanel)**
1. Ouvrez "Setup Node.js App" dans cPanel
2. Créez une nouvelle application :
   - Version Node.js : 18.x ou supérieure
   - Application root : `api`
   - Application startup file : `server.js`
3. Cliquez sur "Run NPM Install"

## 🔧 Étape 5 : Configuration du Serveur Web

### A. Créer un fichier .htaccess (Apache)

Dans `/public_html/.htaccess` :

```apache
# Redirection HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# API Proxy
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]

# SPA Routing pour React
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/admin/
RewriteRule ^ index.html [L]
```

### B. Pour Nginx

Si vous avez accès à la configuration Nginx :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /var/www/html;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Admin
    location /admin/ {
        try_files $uri $uri/ /admin/index.html;
    }
}
```

## 🚀 Étape 6 : Démarrer l'Application

### Via cPanel Node.js App Manager :
1. Ouvrez "Setup Node.js App"
2. Cliquez sur "Start" pour votre application
3. L'API sera accessible sur le port configuré

### Via SSH/Terminal :
```bash
cd public_html/api
node server.js &
```

Ou avec PM2 (si disponible) :
```bash
npm install -g pm2
pm2 start server.js --name soutien-collectif-api
pm2 save
pm2 startup
```

## ✅ Étape 7 : Vérification

### Tests à effectuer :

1. **Frontend** : Visitez `https://votre-domaine.com`
   - La page d'accueil doit s'afficher
   - Les campagnes doivent apparaître

2. **API** : Testez `https://votre-domaine.com/api/health`
   - Doit retourner : `{"status":"OK",...}`

3. **Admin** : Visitez `https://votre-domaine.com/admin`
   - Interface admin doit s'afficher
   - Connexion doit fonctionner

4. **Base de données** :
   ```bash
   # Via SSH
   cd api
   node -e "require('./config/database.js').then(() => console.log('DB OK'))"
   ```

## 🔍 Dépannage

### Problème : "Cannot GET /api/..."
- ✅ Vérifiez que Node.js est démarré
- ✅ Vérifiez le fichier .htaccess
- ✅ Regardez les logs : `pm2 logs` ou logs cPanel

### Problème : Page blanche sur le frontend
- ✅ Vérifiez que tous les fichiers de dist/ sont copiés
- ✅ Ouvrez la console navigateur (F12) pour voir les erreurs
- ✅ Vérifiez que le fichier index.html est à la racine

### Problème : Erreur de base de données
- ✅ Vérifiez les identifiants dans .env
- ✅ Assurez-vous que la base existe
- ✅ Vérifiez que l'utilisateur a les permissions

### Problème : 500 Internal Server Error
- ✅ Regardez les logs Node.js
- ✅ Vérifiez les permissions des fichiers (644 pour fichiers, 755 pour dossiers)
- ✅ Assurez-vous que toutes les dépendances sont installées

## 📊 Hébergeurs Recommandés

### 🥇 Avec Node.js natif :
- **o2switch** (France) - Support Node.js excellent
- **Hostinger** - Plans Premium avec Node.js
- **A2 Hosting** - Serveurs optimisés Node.js

### 🥈 Alternatives :
- **OVH** (VPS) - Installation manuelle requise
- **LWS** (France) - Support Node.js disponible
- **PlanetHoster** - Support technique français

## 💡 Conseils de Performance

1. **Activer la compression** :
   - Gzip dans .htaccess ou nginx
   - Réduit la taille des fichiers transférés

2. **Cache navigateur** :
   ```apache
   <IfModule mod_expires.c>
     ExpiresActive On
     ExpiresByType text/css "access plus 1 year"
     ExpiresByType application/javascript "access plus 1 year"
     ExpiresByType image/png "access plus 1 year"
   </IfModule>
   ```

3. **CDN** (optionnel) :
   - Utilisez Cloudflare (gratuit)
   - Améliore vitesse et sécurité

## 🔐 Sécurité

1. **Permissions correctes** :
   ```bash
   find . -type f -exec chmod 644 {} \;
   find . -type d -exec chmod 755 {} \;
   ```

2. **Protéger .env** :
   ```apache
   # Dans .htaccess
   <Files .env>
     Order allow,deny
     Deny from all
   </Files>
   ```

3. **SSL/HTTPS** :
   - Activez Let's Encrypt via cPanel (gratuit)
   - Ou utilisez le SSL de votre hébergeur

---

## 📞 Support

En cas de problème :
1. Vérifiez les logs de votre hébergeur
2. Contactez le support technique
3. Consultez la documentation de votre hébergeur spécifique

**🎉 Votre site sera en ligne sous : `https://votre-domaine.com` !**

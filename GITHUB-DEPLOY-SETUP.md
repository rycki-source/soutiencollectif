# 🚀 Configuration du Déploiement Automatique depuis GitHub

Ce guide vous explique comment configurer le déploiement automatique de votre projet **Soutien Collectif** depuis GitHub.

## 📋 Prérequis

- Compte GitHub (✅ déjà fait - repo: rycki-source/soutiencollectif)
- Compte Heroku (gratuit)
- Compte Vercel (gratuit)

## 🔧 Configuration étape par étape

### 1. Configuration Heroku (Backend)

#### A. Créer l'application Heroku
```bash
# Installer Heroku CLI
# Windows: https://devcenter.heroku.com/articles/heroku-cli
# Mac: brew tap heroku/brew && brew install heroku

# Se connecter
heroku login

# Créer l'app backend
heroku create soutien-collectif-api

# Ajouter PostgreSQL
heroku addons:create heroku-postgresql:mini -a soutien-collectif-api
```

#### B. Configurer les variables d'environnement
```bash
heroku config:set NODE_ENV=production -a soutien-collectif-api
heroku config:set JWT_SECRET=$(openssl rand -hex 32) -a soutien-collectif-api
heroku config:set STRIPE_SECRET_KEY=sk_live_votre_cle -a soutien-collectif-api
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle -a soutien-collectif-api
heroku config:set FRONTEND_URL=https://soutien-collectif.vercel.app -a soutien-collectif-api
heroku config:set ADMIN_URL=https://admin-soutien-collectif.vercel.app -a soutien-collectif-api
```

#### C. Obtenir la clé API Heroku
```bash
# Afficher votre clé API
heroku auth:token
```

#### D. Ajouter les secrets GitHub
1. Allez sur https://github.com/rycki-source/soutiencollectif/settings/secrets/actions
2. Cliquez sur "New repository secret"
3. Ajoutez ces secrets :
   - `HEROKU_API_KEY` : Votre clé API Heroku
   - `HEROKU_APP_NAME` : `soutien-collectif-api`
   - `HEROKU_EMAIL` : Votre email Heroku

### 2. Configuration Vercel (Frontend)

#### A. Connecter GitHub à Vercel
1. Allez sur https://vercel.com/signup
2. Connectez-vous avec GitHub
3. Importez le repo : `rycki-source/soutiencollectif`

#### B. Configuration du projet Vercel
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### C. Variables d'environnement Vercel
Dans les settings Vercel, ajoutez :
- `VITE_API_URL` : `https://soutien-collectif-api.herokuapp.com/api`

#### D. Obtenir le token Vercel
1. Allez sur https://vercel.com/account/tokens
2. Créez un nouveau token
3. Copiez le token

#### E. Ajouter le secret GitHub
1. Sur https://github.com/rycki-source/soutiencollectif/settings/secrets/actions
2. Ajoutez :
   - `VERCEL_TOKEN` : Votre token Vercel
   - `VITE_API_URL` : `https://soutien-collectif-api.herokuapp.com/api`

### 3. Interface Admin (Vercel ou Netlify)

#### Option A: Vercel
```bash
# Dans le dossier admin
cd admin
vercel --prod
```

#### Option B: Netlify
1. Allez sur https://app.netlify.com
2. Glissez-déposez le dossier `admin`
3. Configurez le domaine personnalisé

## 🎯 Déploiement Automatique Activé !

Maintenant, chaque fois que vous pushez sur GitHub :

### Backend (Heroku)
```bash
git add backend/
git commit -m "Update backend"
git push origin master
# ➜ Déploiement automatique sur Heroku !
```

### Frontend (Vercel)
```bash
git add frontend/
git commit -m "Update frontend"
git push origin master
# ➜ Déploiement automatique sur Vercel !
```

## 📊 Vérification du Déploiement

### Vérifier l'état sur Heroku
```bash
heroku logs --tail -a soutien-collectif-api
heroku ps -a soutien-collectif-api
heroku open -a soutien-collectif-api
```

### Vérifier l'état sur Vercel
```bash
vercel --prod
vercel logs
```

### Tester les URLs de production
```bash
# Test API
curl https://soutien-collectif-api.herokuapp.com/api/health

# Test Frontend
curl -I https://soutien-collectif.vercel.app

# Test connexion admin
curl -X POST https://soutien-collectif-api.herokuapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@soutiencollectif.org","password":"AdminSecure123!"}'
```

## 🔄 Workflow GitHub Actions

Les workflows sont déjà configurés dans `.github/workflows/` :

- **ci.yml** : Tests automatiques sur chaque push
- **deploy-backend.yml** : Déploiement Heroku automatique
- **deploy-frontend.yml** : Déploiement Vercel automatique

Vous pouvez voir l'état des déploiements sur :
https://github.com/rycki-source/soutiencollectif/actions

## 🌐 URLs de Production

Une fois déployé, vos URLs seront :

- **API Backend** : https://soutien-collectif-api.herokuapp.com/api
- **Site Public** : https://soutien-collectif.vercel.app
- **Interface Admin** : https://admin-soutien-collectif.vercel.app (ou Netlify)

## 🔐 Domaines Personnalisés (Optionnel)

### Heroku
```bash
heroku domains:add api.soutiencollectif.com -a soutien-collectif-api
```

### Vercel
1. Settings → Domains → Add Domain
2. Ajoutez `soutiencollectif.com`
3. Configurez les DNS selon les instructions Vercel

## 🆘 Dépannage

### Backend ne démarre pas
```bash
# Vérifier les logs
heroku logs --tail -a soutien-collectif-api

# Vérifier les variables d'environnement
heroku config -a soutien-collectif-api

# Redémarrer
heroku restart -a soutien-collectif-api
```

### Frontend ne build pas
```bash
# Vérifier les logs Vercel
vercel logs

# Build local pour tester
cd frontend
npm run build
```

### Base de données
```bash
# Accéder à PostgreSQL
heroku pg:psql -a soutien-collectif-api

# Voir les infos DB
heroku pg:info -a soutien-collectif-api
```

## 📝 Commandes Utiles

```bash
# Pousser uniquement le backend
git subtree push --prefix backend heroku master

# Pousser uniquement le frontend
cd frontend && vercel --prod

# Voir les déploiements
heroku releases -a soutien-collectif-api
vercel ls

# Rollback si problème
heroku rollback -a soutien-collectif-api
```

---

**🎉 Votre application est maintenant déployée automatiquement depuis GitHub !**

Chaque push déclenche automatiquement les tests et le déploiement sur Heroku et Vercel.
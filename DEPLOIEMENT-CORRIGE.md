# 🚀 GUIDE DE DÉPLOIEMENT CORRIGÉ

## ⚠️ Problèmes Résolus

### 1. Configuration Heroku
- ✅ Ajout du script `migrate` dans package.json
- ✅ Création de app.json pour configuration automatique
- ✅ Ajout de heroku.yml pour build configuration
- ✅ Spécification de Node.js 18 avec .nvmrc

### 2. Configuration Vercel
- ✅ Simplification de vercel.json pour Vite
- ✅ Configuration du framework Vite automatique
- ✅ Correction des rewrites pour SPA

### 3. GitHub Actions
- ✅ Workflow Heroku simplifié avec healthcheck
- ✅ Workflow Vercel corrigé avec vercel-action
- ✅ Support des branches main et master

## 📋 ÉTAPES DE DÉPLOIEMENT

### Étape 1: Commit et Push des Corrections

```bash
git add .
git commit -m "Fix: Configuration déploiement Heroku et Vercel"
git push origin master
```

### Étape 2: Configuration Heroku

#### A. Créer l'application Heroku
```bash
# Installer Heroku CLI si nécessaire
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Créer l'app depuis le dossier backend
cd backend
heroku create soutien-collectif-api

# Ajouter PostgreSQL
heroku addons:create heroku-postgresql:essential-0

# Obtenir la clé API
heroku auth:token
```

#### B. Configurer les variables d'environnement sur Heroku
```bash
heroku config:set NODE_ENV=production --app soutien-collectif-api
heroku config:set JWT_SECRET=$(openssl rand -base64 32) --app soutien-collectif-api
heroku config:set STRIPE_SECRET_KEY=sk_live_votre_cle --app soutien-collectif-api
heroku config:set FRONTEND_URL=https://votre-frontend.vercel.app --app soutien-collectif-api
heroku config:set ADMIN_URL=https://votre-admin.vercel.app --app soutien-collectif-api

# Vérifier les variables
heroku config --app soutien-collectif-api
```

#### C. Ajouter les secrets GitHub pour Heroku
1. Allez sur: https://github.com/rycki-source/soutiencollectif/settings/secrets/actions
2. Cliquez sur "New repository secret"
3. Ajoutez ces secrets:
   - `HEROKU_API_KEY`: Votre token Heroku (obtenu avec `heroku auth:token`)
   - `HEROKU_APP_NAME`: `soutien-collectif-api`
   - `HEROKU_EMAIL`: Votre email Heroku

### Étape 3: Configuration Vercel

#### A. Installer Vercel CLI
```bash
npm install -g vercel
```

#### B. Login et Setup
```bash
cd frontend
vercel login

# Setup du projet (suivez les prompts)
vercel

# Cela va créer le projet et vous donner:
# - Project ID
# - Organization ID
```

#### C. Configurer les variables d'environnement sur Vercel
```bash
# Via CLI
vercel env add VITE_API_URL production
# Entrez: https://soutien-collectif-api.herokuapp.com

# Ou via le dashboard Vercel:
# https://vercel.com/votre-org/votre-projet/settings/environment-variables
```

#### D. Ajouter les secrets GitHub pour Vercel
1. Allez sur: https://github.com/rycki-source/soutiencollectif/settings/secrets/actions
2. Ajoutez ces secrets:
   - `VERCEL_TOKEN`: Token depuis https://vercel.com/account/tokens
   - `VERCEL_ORG_ID`: Trouvé dans `.vercel/project.json` ou dashboard
   - `VERCEL_PROJECT_ID`: Trouvé dans `.vercel/project.json` ou dashboard
   - `VITE_API_URL`: `https://soutien-collectif-api.herokuapp.com`

### Étape 4: Déploiement Manuel (Test)

#### Backend sur Heroku
```bash
cd backend
git init
git add .
git commit -m "Deploy to Heroku"
heroku git:remote -a soutien-collectif-api
git push heroku master

# Vérifier les logs
heroku logs --tail --app soutien-collectif-api

# Tester l'API
curl https://soutien-collectif-api.herokuapp.com/api/health
```

#### Frontend sur Vercel
```bash
cd frontend
vercel --prod

# Cela déploie et vous donne l'URL
```

### Étape 5: Déploiement Automatique

Une fois les secrets configurés sur GitHub:
1. Modifiez un fichier dans `backend/` → Push → Déploiement Heroku automatique
2. Modifiez un fichier dans `frontend/` → Push → Déploiement Vercel automatique

## 🔍 Vérification

### Backend (Heroku)
```bash
# Health check
curl https://soutien-collectif-api.herokuapp.com/api/health

# Test login
curl -X POST https://soutien-collectif-api.herokuapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@soutiencollectif.org","password":"AdminSecure123!"}'
```

### Frontend (Vercel)
Visitez l'URL Vercel et testez:
- Page d'accueil
- Liste des campagnes
- Connexion admin

## 🆘 Dépannage

### Erreur "Application Error" sur Heroku
```bash
# Vérifier les logs
heroku logs --tail --app soutien-collectif-api

# Vérifier les variables d'environnement
heroku config --app soutien-collectif-api

# Redémarrer
heroku restart --app soutien-collectif-api
```

### Build échoue sur Vercel
1. Vérifiez que `VITE_API_URL` est défini
2. Vérifiez les logs de build sur le dashboard Vercel
3. Testez localement: `npm run build` dans `frontend/`

### GitHub Actions échoue
1. Vérifiez que tous les secrets sont configurés
2. Consultez l'onglet "Actions" sur GitHub
3. Cliquez sur le workflow échoué pour voir les détails

## 📝 URLs Finales

- **Backend API**: https://soutien-collectif-api.herokuapp.com
- **Frontend**: https://votre-projet.vercel.app
- **Admin**: Déployez séparément avec `cd admin && vercel --prod`

## ✅ Checklist Complète

- [ ] Heroku CLI installé
- [ ] Heroku app créée
- [ ] PostgreSQL addon ajouté
- [ ] Variables Heroku configurées
- [ ] Secrets GitHub Heroku ajoutés
- [ ] Vercel CLI installé
- [ ] Vercel project créé
- [ ] Variables Vercel configurées
- [ ] Secrets GitHub Vercel ajoutés
- [ ] Test déploiement manuel backend
- [ ] Test déploiement manuel frontend
- [ ] Push vers GitHub
- [ ] Vérification déploiement automatique

---

**🎯 Une fois tout configuré, chaque `git push` déclenchera le déploiement automatique !**

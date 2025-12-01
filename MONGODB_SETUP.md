# 🚀 Configuration MongoDB Atlas - Instructions

MongoDB n'est pas installé localement. Voici comment configurer MongoDB Atlas (gratuit) :

## Option 1 : MongoDB Atlas (Recommandé - Gratuit)

### Étapes :
1. **Créer un compte** : https://www.mongodb.com/cloud/atlas/register
2. **Créer un cluster gratuit** :
   - Choisir le plan "Free" (M0)
   - Sélectionner une région proche (Europe de l'Ouest)
3. **Créer un utilisateur** :
   - Aller dans "Database Access"
   - Cliquer "Add New Database User"
   - Nom d'utilisateur : `soutiencollectif`
   - Mot de passe : générer un mot de passe fort (le copier !)
   - Role : "Atlas admin"
4. **Autoriser les connexions** :
   - Aller dans "Network Access"
   - Cliquer "Add IP Address"
   - Cliquer "Allow Access from Anywhere" (0.0.0.0/0)
5. **Obtenir la chaîne de connexion** :
   - Aller dans "Database" → Clusters
   - Cliquer "Connect"
   - Choisir "Connect your application"
   - Copier la chaîne de connexion
   - Format : `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. **Mettre à jour backend/.env** :
   - Remplacer `<username>` par votre nom d'utilisateur
   - Remplacer `<password>` par votre mot de passe
   - Ajouter `/soutien-collectif` avant le `?`
   - Exemple : `mongodb+srv://soutiencollectif:VotreMotDePasse@cluster0.xxxxx.mongodb.net/soutien-collectif?retryWrites=true&w=majority`

## Option 2 : MongoDB Local (Plus complexe)

### Installer MongoDB :
1. Télécharger : https://www.mongodb.com/try/download/community
2. Installer en tant que service Windows
3. Garder la configuration par défaut dans .env : `mongodb://localhost:27017/soutien-collectif`

---

## ⚠️ IMPORTANT

Pour l'instant, l'application va essayer de se connecter à MongoDB local.
**Vous devez configurer MongoDB Atlas OU installer MongoDB localement avant de démarrer le backend.**

Si vous choisissez MongoDB Atlas, mettez à jour la ligne `MONGODB_URI` dans `backend/.env`

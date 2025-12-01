# Configuration MongoDB Atlas (Gratuit)

## Étapes Rapides

### 1. Créer un compte MongoDB Atlas
1. Aller sur : https://www.mongodb.com/cloud/atlas/register
2. S'inscrire gratuitement avec votre email

### 2. Créer un cluster GRATUIT
1. Choisir "Create a cluster" (FREE tier - M0)
2. Sélectionner AWS ou Google Cloud
3. Choisir la région la plus proche (ex: Europe/Paris)
4. Cliquer "Create Cluster" (prend 2-3 minutes)

### 3. Configurer l'accès
1. **Database Access** (menu gauche) :
   - Cliquer "Add New Database User"
   - Choisir "Password" comme méthode d'authentification
   - Username: `admin_soutien`
   - Password: Générer un mot de passe sécurisé (noter le !)
   - Database User Privileges: "Atlas admin"
   - Cliquer "Add User"

2. **Network Access** (menu gauche) :
   - Cliquer "Add IP Address"
   - Cliquer "Allow Access from Anywhere" (0.0.0.0/0)
   - Cliquer "Confirm"

### 4. Obtenir la chaîne de connexion
1. Aller sur "Database" dans le menu
2. Cliquer "Connect" sur votre cluster
3. Choisir "Connect your application"
4. Copier la connection string (commence par `mongodb+srv://`)
5. Remplacer `<password>` par votre mot de passe

Exemple:
```
mongodb+srv://admin_soutien:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 5. Mettre à jour le .env
Ouvrir `backend\.env` et remplacer la ligne MONGODB_URI :
```
MONGODB_URI=mongodb+srv://admin_soutien:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/soutien-collectif?retryWrites=true&w=majority
```

### 6. Redémarrer le serveur
Le serveur se reconnectera automatiquement !

---

## ⚡ Alternative : Utiliser le mode LOCAL (si MongoDB installé)

Si vous préférez MongoDB local :
1. Installer MongoDB Community : https://www.mongodb.com/try/download/community
2. Démarrer le service MongoDB
3. Garder `MONGODB_URI=mongodb://localhost:27017/soutien-collectif` dans .env

---

## 🎯 Résultat attendu
Une fois configuré, vous verrez :
```
✅ MongoDB connecté avec succès
🚀 Serveur démarré sur le port 5000
```

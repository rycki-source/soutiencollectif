# 🚀 Démarrage Rapide - PostgreSQL Cloud GRATUIT (Neon.tech)

## Pourquoi Neon.tech ?
- ✅ **100% Gratuit** pour toujours
- ✅ **Pas d'installation locale** nécessaire
- ✅ **Configuration en 2 minutes**
- ✅ **Base de données PostgreSQL moderne**

---

## 📋 Étapes (2 minutes)

### 1. Créer un compte Neon
👉 Aller sur : **https://neon.tech**
- Cliquer sur "Sign Up"
- S'inscrire avec votre email (ou GitHub)

### 2. Créer un projet
- Cliquer sur "Create a project"
- Nom du projet : `soutien-collectif`
- Région : Choisir la plus proche (Europe Frankfurt recommandé)
- PostgreSQL version : Garder la dernière
- Cliquer sur "Create Project"

### 3. Copier les informations de connexion

Une fois le projet créé, vous verrez un écran avec les informations :

```
Host: ep-xxx-xxx.eu-central-1.aws.neon.tech
Database: neondb
User: neondb_owner
Password: xxxxxxxxxxxxx
Port: 5432
```

### 4. Mettre à jour le fichier .env

Ouvrir `backend\.env` et remplacer les lignes PostgreSQL :

```env
DB_HOST=ep-xxx-xxx.eu-central-1.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=votre_mot_de_passe_copié
```

### 5. Redémarrer le serveur

Le serveur va automatiquement se connecter et créer les tables !

Dans le terminal backend, arrêter avec `Ctrl+C` puis :
```powershell
node server.js
```

Vous devriez voir :
```
✅ PostgreSQL connecté avec succès
📊 Tables synchronisées
🚀 Serveur démarré sur le port 5000
```

---

## ✨ C'est fait !

Votre base de données PostgreSQL est prête dans le cloud !

### Avantages :
- Pas besoin d'installer PostgreSQL localement
- Accessible de partout
- Sauvegardes automatiques
- Interface web pour voir vos données : https://console.neon.tech

### Voir vos données :
1. Aller sur https://console.neon.tech
2. Cliquer sur votre projet
3. Onglet "Tables" pour voir les données

---

## 🆘 Problèmes ?

### Erreur de connexion ?
- Vérifier que le mot de passe est correct (pas d'espaces)
- Vérifier que le host commence par `ep-`
- Vérifier que le port est `5432`

### Mot de passe perdu ?
- Aller sur Neon console
- Project Settings → Reset password

---

## Alternative : PostgreSQL Local

Si vous préférez installer PostgreSQL localement :
👉 Voir `POSTGRESQL_SETUP.md`

Mais Neon.tech est **beaucoup plus rapide** ! 🚀

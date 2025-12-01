# Configuration PostgreSQL pour Soutien Collectif

## Installation PostgreSQL

### Windows
1. Télécharger PostgreSQL : https://www.postgresql.org/download/windows/
2. Exécuter l'installateur
3. Choisir un mot de passe pour l'utilisateur `postgres` (noter le !)
4. Port par défaut : 5432
5. Terminer l'installation

### Vérification
```powershell
psql --version
```

## Configuration

### 1. Créer la base de données

Ouvrir pgAdmin ou le terminal psql :
```powershell
psql -U postgres
```

Créer la base :
```sql
CREATE DATABASE soutien_collectif;
```

Quitter :
```
\q
```

### 2. Mettre à jour .env

Vérifier que le fichier `backend\.env` contient :
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=soutien_collectif
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
```

### 3. Installer les dépendances

```powershell
cd backend
npm install
```

### 4. Démarrer le serveur

```powershell
npm run dev
```

Le serveur va automatiquement créer les tables nécessaires !

## Alternative : PostgreSQL Cloud (Gratuit)

### Neon.tech (Recommandé)
1. Créer un compte sur https://neon.tech
2. Créer un nouveau projet
3. Copier la connection string
4. Mettre à jour .env :
```
DB_HOST=ep-xxx.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=votre_user
DB_PASSWORD=votre_password
```

### Supabase
1. Créer un compte sur https://supabase.com
2. Créer un nouveau projet
3. Aller dans Database → Connection string
4. Copier les informations dans .env

## Vérification

Une fois le serveur démarré, vous devriez voir :
```
✅ PostgreSQL connecté avec succès
📊 Tables synchronisées
🚀 Serveur démarré sur le port 5000
```

## Tables créées automatiquement

- Users
- Campaigns
- Donations

Les relations sont automatiquement gérées par Sequelize !

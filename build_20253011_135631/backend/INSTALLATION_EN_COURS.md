# 🔧 Installation PostgreSQL Locale - Étape par Étape

## 📥 Téléchargement (EN COURS)

Le navigateur vient de s'ouvrir sur la page de téléchargement PostgreSQL.

### Instructions de téléchargement :

1. **Sur la page qui s'est ouverte** :
   - Chercher "Windows x86-64"
   - Choisir la dernière version (16.x ou 15.x)
   - Cliquer sur "Download"

2. **Une fois le fichier téléchargé** :
   - Double-cliquer sur le fichier `.exe`
   - Suivre l'assistant d'installation

---

## 🛠️ Installation (Suivre ces étapes)

### Étape 1 : Lancer l'installateur
- Exécuter le fichier téléchargé (postgresql-xx-windows-x64.exe)
- Cliquer "Next"

### Étape 2 : Répertoire d'installation
- Garder le répertoire par défaut
- Cliquer "Next"

### Étape 3 : Composants
- ✅ PostgreSQL Server (obligatoire)
- ✅ pgAdmin 4 (interface graphique - recommandé)
- ✅ Command Line Tools (obligatoire)
- Cliquer "Next"

### Étape 4 : Répertoire des données
- Garder par défaut : `C:\Program Files\PostgreSQL\xx\data`
- Cliquer "Next"

### Étape 5 : MOT DE PASSE (IMPORTANT!)
- **Entrer un mot de passe pour l'utilisateur `postgres`**
- **⚠️ NOTER CE MOT DE PASSE** (vous en aurez besoin!)
- Exemple : `postgres123` (pour développement local)
- Re-taper le même mot de passe
- Cliquer "Next"

### Étape 6 : Port
- Garder le port par défaut : `5432`
- Cliquer "Next"

### Étape 7 : Locale
- Garder "Default locale"
- Cliquer "Next"

### Étape 8 : Résumé
- Vérifier les paramètres
- Cliquer "Next"

### Étape 9 : Installation
- Attendre la fin de l'installation (2-3 minutes)
- Décocher "Launch Stack Builder at exit" (pas nécessaire)
- Cliquer "Finish"

---

## ✅ Vérification de l'installation

Une fois l'installation terminée, revenez ici et je vais :
1. Vérifier que PostgreSQL est installé
2. Créer la base de données
3. Configurer le fichier .env
4. Démarrer le serveur

---

## 🆘 Pendant l'installation

**Si vous avez un problème** :
- Port 5432 déjà utilisé → Changer pour 5433
- Erreur d'autorisation → Exécuter en tant qu'administrateur
- Installation bloquée → Désactiver temporairement l'antivirus

---

## 📝 À NOTER

**Mot de passe choisi** : _______________

(Gardez-le précieusement, il sera mis dans le .env)

---

## 🔄 Après l'installation

**NE LANCEZ AUCUNE COMMANDE VOUS-MÊME**

Une fois l'installation terminée, revenez dans VS Code et dites simplement :
**"Installation terminée"**

Je m'occuperai de tout le reste automatiquement ! 🚀

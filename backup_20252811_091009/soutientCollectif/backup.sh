#!/bin/bash

# Script de sauvegarde complète - Soutien Collectif
# Date: $(date)

echo "🗄️ Sauvegarde complète du projet Soutien Collectif..."

# Variables
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
PROJECT_DIR="soutientCollectif"

# Créer le répertoire de sauvegarde
mkdir -p "$BACKUP_DIR"

echo "📁 Sauvegarde des fichiers de code..."

# Copier tout le projet
cp -r "$PROJECT_DIR" "$BACKUP_DIR/"

echo "💾 Sauvegarde de la base de données PostgreSQL..."

# Sauvegarde de la base de données
pg_dump -h localhost -U postgres -d soutien_collectif > "$BACKUP_DIR/database_backup.sql"

echo "📋 Création du rapport de sauvegarde..."

# Créer un fichier de rapport
cat > "$BACKUP_DIR/BACKUP_INFO.txt" << EOF
=================================================
SAUVEGARDE SOUTIEN COLLECTIF
=================================================

Date de sauvegarde: $(date)
Système: $(uname -a)

CONTENU DE LA SAUVEGARDE:
- Code source complet (backend, frontend, admin)
- Base de données PostgreSQL (soutien_collectif)
- Fichiers de configuration (.env, package.json)
- Documentation et guides de déploiement
- Scripts de démarrage/arrêt

STRUCTURE DU PROJET:
$(tree $PROJECT_DIR 2>/dev/null || find $PROJECT_DIR -type f | head -20)

INFORMATIONS BASE DE DONNÉES:
- Base: soutien_collectif
- Utilisateur: postgres
- Tables: Users, Campaigns, Donations

PORTS UTILISÉS:
- Backend API: 5000
- Interface Admin: 3001
- Frontend React: 5173

IDENTIFIANTS ADMIN:
- Email: admin@soutiencollectif.org
- Password: AdminSecure123!

=================================================
EOF

echo "✅ Sauvegarde terminée dans le répertoire: $BACKUP_DIR"
echo "📊 Taille de la sauvegarde: $(du -sh $BACKUP_DIR 2>/dev/null || echo 'Calcul impossible')"
@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   SAUVEGARDE SOUTIEN COLLECTIF
echo ========================================
echo.

REM Variables
set BACKUP_DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_DATE=!BACKUP_DATE: =0!
set BACKUP_DIR=backup_!BACKUP_DATE!
set PROJECT_DIR=.

echo Date de sauvegarde: %date% %time%
echo Repertoire de sauvegarde: %BACKUP_DIR%
echo.

echo [1/4] Creation du repertoire de sauvegarde...
mkdir "%BACKUP_DIR%" 2>nul

echo [2/4] Sauvegarde des fichiers de code...
robocopy "%PROJECT_DIR%" "%BACKUP_DIR%\soutientCollectif" /E /XD node_modules .git logs backup_* /XF *.log *.tmp /NFL /NDL /NJH /NJS

echo [3/4] Sauvegarde de la base de donnees PostgreSQL...
pg_dump -h localhost -U postgres -d soutien_collectif > "%BACKUP_DIR%\database_backup.sql" 2>nul

echo [4/4] Creation du rapport de sauvegarde...
(
echo =================================================
echo SAUVEGARDE SOUTIEN COLLECTIF
echo =================================================
echo.
echo Date de sauvegarde: %date% %time%
echo Systeme: %COMPUTERNAME% - %OS%
echo.
echo CONTENU DE LA SAUVEGARDE:
echo - Code source complet ^(backend, frontend, admin^)
echo - Base de donnees PostgreSQL ^(soutien_collectif^)
echo - Fichiers de configuration ^(.env, package.json^)
echo - Documentation et guides de deploiement
echo - Scripts de demarrage/arret
echo.
echo STRUCTURE DU PROJET:
echo - backend/          ^(API Node.js + Express + PostgreSQL^)
echo - frontend/         ^(Interface React + Vite^)
echo - admin/           ^(Interface admin HTML/JS^)
echo - docs/            ^(Documentation^)
echo - package.json     ^(Scripts globaux^)
echo.
echo INFORMATIONS BASE DE DONNEES:
echo - Base: soutien_collectif
echo - Utilisateur: postgres
echo - Tables: Users, Campaigns, Donations
echo.
echo PORTS UTILISES:
echo - Backend API: 5000
echo - Interface Admin: 3001
echo - Frontend React: 5173
echo.
echo IDENTIFIANTS ADMIN:
echo - Email: admin@soutiencollectif.org
echo - Password: AdminSecure123!
echo.
echo COMMANDES DE RESTAURATION:
echo 1. Copier le dossier soutientCollectif
echo 2. Installer les dependances: npm run install:all
echo 3. Restaurer la DB: psql -U postgres -d soutien_collectif ^< database_backup.sql
echo 4. Demarrer: npm run dev ou start-servers.bat
echo.
echo =================================================
) > "%BACKUP_DIR%\BACKUP_INFO.txt"

echo.
echo ========================================
echo   SAUVEGARDE TERMINEE !
echo ========================================
echo.
echo Repertoire de sauvegarde: %BACKUP_DIR%
echo Contenu sauvegarde:
dir "%BACKUP_DIR%" /B
echo.
echo Pour restaurer:
echo 1. Copier le dossier soutientCollectif du backup
echo 2. Executer: npm run install:all
echo 3. Restaurer la base de donnees si necessaire
echo 4. Demarrer avec: start-servers.bat
echo.
pause
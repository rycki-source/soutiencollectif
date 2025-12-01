@echo off
REM Script de préparation pour déploiement FTP
REM Crée un package prêt à être uploadé via FTP

echo ========================================
echo PREPARATION DEPLOIEMENT FTP
echo ========================================
echo.

REM Définir le nom du dossier de sortie
set OUTPUT_DIR=deploy-ftp-%date:~-4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set OUTPUT_DIR=%OUTPUT_DIR: =0%

echo Creation du dossier de deploiement: %OUTPUT_DIR%
mkdir "%OUTPUT_DIR%" 2>nul

REM ========================================
REM 1. BUILD FRONTEND
REM ========================================
echo.
echo [1/5] Build du frontend React...
cd frontend

if not exist "node_modules" (
    echo Installation des dependances frontend...
    call npm install
)

echo Build de production...
call npm run build

if errorlevel 1 (
    echo ERREUR: Le build frontend a echoue
    cd ..
    pause
    exit /b 1
)

cd ..
echo Frontend build avec succes!

REM ========================================
REM 2. COPIER FRONTEND (dist -> public_html)
REM ========================================
echo.
echo [2/5] Copie des fichiers frontend...
mkdir "%OUTPUT_DIR%\public_html" 2>nul
xcopy /E /I /Y "frontend\dist\*" "%OUTPUT_DIR%\public_html\"

REM ========================================
REM 3. COPIER BACKEND (-> api)
REM ========================================
echo.
echo [3/5] Copie du backend...
mkdir "%OUTPUT_DIR%\public_html\api" 2>nul

REM Copier les fichiers essentiels du backend
xcopy /E /I /Y "backend\config" "%OUTPUT_DIR%\public_html\api\config\"
xcopy /E /I /Y "backend\models" "%OUTPUT_DIR%\public_html\api\models\"
xcopy /E /I /Y "backend\routes" "%OUTPUT_DIR%\public_html\api\routes\"
xcopy /E /I /Y "backend\middleware" "%OUTPUT_DIR%\public_html\api\middleware\"

copy /Y "backend\server.js" "%OUTPUT_DIR%\public_html\api\"
copy /Y "backend\package.json" "%OUTPUT_DIR%\public_html\api\"

REM Créer un fichier .env.example
echo NODE_ENV=production > "%OUTPUT_DIR%\public_html\api\.env.example"
echo PORT=5000 >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo. >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo # Base de donnees >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo DB_HOST=localhost >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo DB_NAME=votre_base >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo DB_USER=votre_user >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo DB_PASSWORD=votre_password >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo DB_PORT=5432 >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo. >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo # JWT Secret >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo JWT_SECRET=changez_ce_secret_jwt >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo. >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo # URLs >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo FRONTEND_URL=https://votre-domaine.com >> "%OUTPUT_DIR%\public_html\api\.env.example"
echo ADMIN_URL=https://votre-domaine.com/admin >> "%OUTPUT_DIR%\public_html\api\.env.example"

REM ========================================
REM 4. COPIER ADMIN
REM ========================================
echo.
echo [4/5] Copie de l'interface admin...
mkdir "%OUTPUT_DIR%\public_html\admin" 2>nul
xcopy /E /I /Y "admin\*" "%OUTPUT_DIR%\public_html\admin\"

REM ========================================
REM 5. CREER FICHIERS DE CONFIGURATION
REM ========================================
echo.
echo [5/5] Creation des fichiers de configuration...

REM Créer .htaccess
echo # Redirection HTTPS > "%OUTPUT_DIR%\public_html\.htaccess"
echo RewriteEngine On >> "%OUTPUT_DIR%\public_html\.htaccess"
echo RewriteCond %%{HTTPS} off >> "%OUTPUT_DIR%\public_html\.htaccess"
echo RewriteRule ^^(.*)$ https://%%{HTTP_HOST}%%{REQUEST_URI} [L,R=301] >> "%OUTPUT_DIR%\public_html\.htaccess"
echo. >> "%OUTPUT_DIR%\public_html\.htaccess"
echo # API Proxy >> "%OUTPUT_DIR%\public_html\.htaccess"
echo RewriteCond %%{REQUEST_URI} ^^/api/(.*)$ >> "%OUTPUT_DIR%\public_html\.htaccess"
echo RewriteRule ^^api/(.*)$ http://localhost:5000/api/$1 [P,L] >> "%OUTPUT_DIR%\public_html\.htaccess"
echo. >> "%OUTPUT_DIR%\public_html\.htaccess"
echo # SPA Routing pour React >> "%OUTPUT_DIR%\public_html\.htaccess"
echo RewriteCond %%{REQUEST_FILENAME} !-f >> "%OUTPUT_DIR%\public_html\.htaccess"
echo RewriteCond %%{REQUEST_FILENAME} !-d >> "%OUTPUT_DIR%\public_html\.htaccess"
echo RewriteCond %%{REQUEST_URI} !^^/api/ >> "%OUTPUT_DIR%\public_html\.htaccess"
echo RewriteCond %%{REQUEST_URI} !^^/admin/ >> "%OUTPUT_DIR%\public_html\.htaccess"
echo RewriteRule ^^ index.html [L] >> "%OUTPUT_DIR%\public_html\.htaccess"

REM Créer README pour le déploiement
echo # INSTRUCTIONS DE DEPLOIEMENT FTP > "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo. >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo Ce dossier contient tous les fichiers prets pour le deploiement FTP. >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo. >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo ETAPES A SUIVRE : >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo. >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo 1. Connectez-vous a votre serveur FTP avec FileZilla ou WinSCP >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo. >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo 2. Uploadez TOUT le contenu du dossier public_html/ vers votre >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo    repertoire web (generalement /public_html/ ou /www/) >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo. >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo 3. Renommez le fichier api/.env.example en api/.env >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo. >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo 4. Editez api/.env avec vos vraies informations : >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo    - Identifiants base de donnees >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo    - JWT_SECRET (generer un secret securise) >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo    - URLs de votre domaine >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo. >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo 5. Via cPanel ou SSH, allez dans le dossier api/ et executez : >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo    npm install --production >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo. >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo 6. Demarrez l'application Node.js via : >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo    - cPanel "Setup Node.js App" >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo    - Ou : node server.js >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo    - Ou : pm2 start server.js >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo. >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo 7. Testez votre site : >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo    - Frontend : https://votre-domaine.com >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo    - API : https://votre-domaine.com/api/health >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo    - Admin : https://votre-domaine.com/admin >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo. >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"
echo Pour plus de details, consultez DEPLOIEMENT-FTP.md >> "%OUTPUT_DIR%\README_DEPLOIEMENT.txt"

REM Copier le guide complet
copy /Y "DEPLOIEMENT-FTP.md" "%OUTPUT_DIR%\"

REM ========================================
REM 6. CREER ARCHIVE ZIP
REM ========================================
echo.
echo Creation de l'archive ZIP...

REM Utiliser PowerShell pour créer le ZIP
powershell -command "Compress-Archive -Path '%OUTPUT_DIR%\*' -DestinationPath '%OUTPUT_DIR%.zip' -Force"

echo.
echo ========================================
echo DEPLOIEMENT FTP PRET !
echo ========================================
echo.
echo Dossier cree : %OUTPUT_DIR%
echo Archive ZIP   : %OUTPUT_DIR%.zip
echo.
echo PROCHAINES ETAPES :
echo 1. Extrayez %OUTPUT_DIR%.zip
echo 2. Uploadez le contenu de public_html/ via FTP
echo 3. Configurez api/.env avec vos parametres
echo 4. Installez les dependances : npm install --production
echo 5. Demarrez l'application Node.js
echo.
echo Consultez %OUTPUT_DIR%\README_DEPLOIEMENT.txt pour les details
echo.
pause

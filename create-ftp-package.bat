@echo off
REM Script simple de preparation FTP (sans build automatique)

echo ========================================
echo PREPARATION PACKAGE FTP
echo ========================================
echo.

set OUTPUT=package-ftp

echo Creation du dossier %OUTPUT%...
if exist "%OUTPUT%" rmdir /S /Q "%OUTPUT%"
mkdir "%OUTPUT%\public_html\api"
mkdir "%OUTPUT%\public_html\admin"

echo.
echo [1/3] Copie du backend...
xcopy /E /I /Y "backend\config" "%OUTPUT%\public_html\api\config\"
xcopy /E /I /Y "backend\models" "%OUTPUT%\public_html\api\models\"
xcopy /E /I /Y "backend\routes" "%OUTPUT%\public_html\api\routes\"
xcopy /E /I /Y "backend\middleware" "%OUTPUT%\public_html\api\middleware\"
copy /Y "backend\server.js" "%OUTPUT%\public_html\api\"
copy /Y "backend\package.json" "%OUTPUT%\public_html\api\"
copy /Y "backend\.nvmrc" "%OUTPUT%\public_html\api\" 2>nul

echo.
echo [2/3] Copie de l'admin...
xcopy /E /I /Y "admin\*" "%OUTPUT%\public_html\admin\"

echo.
echo [3/3] Creation fichier .env.example...
(
echo NODE_ENV=production
echo PORT=5000
echo.
echo # Base de donnees
echo DB_HOST=localhost
echo DB_NAME=votre_base
echo DB_USER=votre_user
echo DB_PASSWORD=votre_password
echo DB_PORT=5432
echo.
echo # JWT Secret
echo JWT_SECRET=changez_ce_secret_jwt
echo.
echo # URLs
echo FRONTEND_URL=https://votre-domaine.com
echo ADMIN_URL=https://votre-domaine.com/admin
) > "%OUTPUT%\public_html\api\.env.example"

echo.
echo Creation .htaccess...
(
echo # Redirection HTTPS
echo RewriteEngine On
echo RewriteCond %%{HTTPS} off
echo RewriteRule ^^(.*)$ https://%%{HTTP_HOST}%%{REQUEST_URI} [L,R=301]
echo.
echo # API Proxy
echo RewriteCond %%{REQUEST_URI} ^^/api/(.*)$
echo RewriteRule ^^api/(.*)$ http://localhost:5000/api/$1 [P,L]
echo.
echo # SPA Routing
echo RewriteCond %%{REQUEST_FILENAME} !-f
echo RewriteCond %%{REQUEST_FILENAME} !-d
echo RewriteCond %%{REQUEST_URI} !^^/api/
echo RewriteCond %%{REQUEST_URI} !^^/admin/
echo RewriteRule ^^ index.html [L]
) > "%OUTPUT%\public_html\.htaccess"

copy /Y "DEPLOIEMENT-FTP.md" "%OUTPUT%\"

echo.
echo ========================================
echo PACKAGE FTP CREE !
echo ========================================
echo.
echo IMPORTANT : Build manuel requis
echo.
echo 1. Ouvrez un terminal dans le dossier frontend
echo 2. Executez : npm install
echo 3. Executez : npm run build
echo 4. Copiez TOUT le contenu de frontend/dist/ dans %OUTPUT%/public_html/
echo.
echo Ensuite uploadez public_html/ via FTP
echo.
pause

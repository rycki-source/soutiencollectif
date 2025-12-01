@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   BUILD SOUTIEN COLLECTIF PRODUCTION
echo ========================================
echo.

REM Variables
set BUILD_DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set BUILD_DATE=!BUILD_DATE: =0!
set BUILD_DIR=build_%BUILD_DATE%

echo Date de build: %date% %time%
echo Repertoire de build: %BUILD_DIR%
echo.

echo [1/6] Verification des prerequis...
where node >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe
    pause
    exit /b 1
)

echo [2/6] Installation des dependances...
echo - Backend...
cd backend
call npm install --production
cd ..

echo - Frontend...
cd frontend
call npm install
cd ..

echo [3/6] Build du frontend React...
cd frontend
call npm run build
cd ..

echo [4/6] Creation de la structure de production...
mkdir "%BUILD_DIR%" 2>nul
mkdir "%BUILD_DIR%\backend" 2>nul
mkdir "%BUILD_DIR%\admin" 2>nul
mkdir "%BUILD_DIR%\frontend" 2>nul
mkdir "%BUILD_DIR%\docs" 2>nul

echo [5/6] Copie des fichiers de production...
echo - Backend...
robocopy "backend" "%BUILD_DIR%\backend" /E /XD node_modules .git logs /XF *.log *.tmp .env /NFL /NDL /NJH /NJS

echo - Frontend build...
robocopy "frontend\dist" "%BUILD_DIR%\frontend" /E /NFL /NDL /NJH /NJS

echo - Interface admin...
robocopy "admin" "%BUILD_DIR%\admin" /E /XD node_modules /NFL /NDL /NJH /NJS

echo - Documentation...
copy "README.md" "%BUILD_DIR%\docs\"
copy "DEPLOYMENT_GUIDE.md" "%BUILD_DIR%\docs\"
copy "package.json" "%BUILD_DIR%\"
copy "ecosystem.config.js" "%BUILD_DIR%\"

echo [6/6] Creation des fichiers de production...
(
echo NODE_ENV=production
echo PORT=5000
echo DB_HOST=localhost
echo DB_NAME=soutien_collectif
echo DB_USER=postgres
echo DB_PASSWORD=your_production_password
echo JWT_SECRET=your_production_jwt_secret_here
echo STRIPE_SECRET_KEY=sk_live_your_production_key
echo STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
echo STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook
echo FRONTEND_URL=https://your-domain.com
echo ADMIN_URL=https://admin.your-domain.com
echo EMAIL_HOST=smtp.gmail.com
echo EMAIL_USER=your_email@gmail.com
echo EMAIL_PASSWORD=your_app_password
echo ADMIN_EMAIL=admin@soutiencollectif.org
echo ADMIN_PASSWORD=AdminSecure123!
) > "%BUILD_DIR%\backend\.env.production"

(
echo @echo off
echo echo Demarrage du serveur de production...
echo cd backend
echo set NODE_ENV=production
echo node server.js
) > "%BUILD_DIR%\start-production.bat"

(
echo #!/bin/bash
echo export NODE_ENV=production
echo cd backend
echo node server.js
) > "%BUILD_DIR%\start-production.sh"

(
echo # BUILD DE PRODUCTION - SOUTIEN COLLECTIF
echo.
echo Date: %date% %time%
echo Version: 1.0.0
echo.
echo ## DEPLOIEMENT
echo.
echo 1. Configurez les variables dans backend/.env.production
echo 2. Installez PostgreSQL sur votre serveur
echo 3. Installez PM2: npm install -g pm2
echo 4. Demarrez: pm2 start ecosystem.config.js --env production
echo.
echo ## SERVEUR WEB ^(Nginx^)
echo.
echo ```nginx
echo server {
echo     listen 80;
echo     server_name your-domain.com;
echo.
echo     location / {
echo         root /path/to/build/frontend;
echo         try_files $uri $uri/ /index.html;
echo     }
echo.
echo     location /api/ {
echo         proxy_pass http://localhost:5000;
echo     }
echo }
echo.
echo server {
echo     listen 80;
echo     server_name admin.your-domain.com;
echo.
echo     location / {
echo         root /path/to/build/admin;
echo         try_files $uri $uri/ /index.html;
echo     }
echo }
echo ```
echo.
echo URLs de production:
echo - Site: https://your-domain.com
echo - Admin: https://admin.your-domain.com
echo - API: https://your-domain.com/api
) > "%BUILD_DIR%\DEPLOIEMENT.md"

echo.
echo ========================================
echo   BUILD TERMINE !
echo ========================================
echo.
echo Repertoire: %BUILD_DIR%
echo.
echo CONTENU:
echo - backend/ ^(serveur Node.js^)
echo - frontend/ ^(application React buildee^)
echo - admin/ ^(interface administrateur^)
echo - docs/ ^(documentation^)
echo - .env.production ^(a configurer^)
echo - start-production.bat/.sh
echo - ecosystem.config.js ^(PM2^)
echo.
echo PROCHAINES ETAPES:
echo 1. Editez %BUILD_DIR%\backend\.env.production
echo 2. Uploadez sur votre serveur
echo 3. Installez PM2 et PostgreSQL
echo 4. Lancez avec ./start-production.sh
echo.
pause
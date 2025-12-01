@echo off
echo.
echo ========================================
echo   SOUTIEN COLLECTIF - DEMARRAGE
echo ========================================
echo.

echo [1/3] Demarrage du Backend...
start "Backend" cmd /k "cd backend && node server.js"
timeout /t 3

echo [2/3] Demarrage de l'Admin...
start "Admin" cmd /k "cd admin && node server.js"
timeout /t 2

echo [3/3] Demarrage du Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3

echo.
echo ========================================
echo   SERVEURS DEMARRE !
echo ========================================
echo.
echo URLs d'acces :
echo   Admin    : http://localhost:3001
echo   Public   : http://localhost:5173  
echo   API      : http://localhost:5000/api
echo.
echo Identifiants admin :
echo   Email    : admin@soutiencollectif.org
echo   Password : AdminSecure123!
echo.
echo Appuyez sur une touche pour continuer...
pause > nul

start http://localhost:3001
start http://localhost:5173
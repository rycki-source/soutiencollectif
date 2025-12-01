@echo off
echo.
echo ========================================
echo   ARRET DES SERVEURS SOUTIEN COLLECTIF
echo ========================================
echo.

echo Arret de tous les processus Node.js...
taskkill /F /IM node.exe 2>nul

echo Arret des terminaux...
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq Backend*" 2>nul
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq Admin*" 2>nul  
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq Frontend*" 2>nul

timeout /t 2

echo.
echo ========================================
echo   SERVEURS ARRETES
echo ========================================
echo.
pause
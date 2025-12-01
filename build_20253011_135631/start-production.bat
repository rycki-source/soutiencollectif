@echo off
echo Demarrage du serveur de production...
cd backend
set NODE_ENV=production
node server.js

# Script de démarrage complet de l'application Soutien Collectif

Write-Host "🎄 Démarrage de Soutien Collectif..." -ForegroundColor Cyan
Write-Host ""

# Arrêter les anciens processus Node.js
Write-Host "🔄 Arrêt des anciens processus..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Démarrer le backend (API)
Write-Host "🔌 Démarrage du Backend (API)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList '-NoExit', '-Command', @"
Write-Host '=== BACKEND API ===' -ForegroundColor Green;
cd 'c:\Users\DELL\OneDrive\Bureau\soutientCollectif\backend';
node server.js
"@

Start-Sleep -Seconds 4

# Démarrer le frontend (Site public)
Write-Host "🌐 Démarrage du Frontend (Site public)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList '-NoExit', '-Command', @"
Write-Host '=== FRONTEND PUBLIC ===' -ForegroundColor Green;
cd 'c:\Users\DELL\OneDrive\Bureau\soutientCollectif\frontend';
npm run dev
"@

Start-Sleep -Seconds 3

# Démarrer l'interface admin
Write-Host "🎯 Démarrage de l'Interface Admin..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList '-NoExit', '-Command', @"
Write-Host '=== INTERFACE ADMIN ===' -ForegroundColor Green;
cd 'c:\Users\DELL\OneDrive\Bureau\soutientCollectif\admin';
npm start
"@

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "✅ Tous les serveurs sont démarrés !" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Accès:" -ForegroundColor Cyan
Write-Host "   🌐 Site public:     http://localhost:5173" -ForegroundColor White
Write-Host "   🎯 Interface Admin: http://localhost:3001" -ForegroundColor White
Write-Host "   🔌 API Backend:     http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Connexion Admin:" -ForegroundColor Cyan
Write-Host "   Email:    admin@soutiencollectif.org" -ForegroundColor White
Write-Host "   Password: AdminSecure123!" -ForegroundColor White
Write-Host ""

# Ouvrir les navigateurs
Start-Sleep -Seconds 2
Write-Host "🚀 Ouverture des navigateurs..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"
Start-Process "http://localhost:3001"

Write-Host ""
Write-Host "✨ Configuration terminée ! Appuyez sur une touche pour fermer..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

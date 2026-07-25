@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 ou plus recent est requis.
  echo https://nodejs.org/
  pause
  exit /b 1
)

where npx >nul 2>nul
if errorlevel 1 (
  echo npx est introuvable. Verifiez votre installation Node.js.
  pause
  exit /b 1
)

echo.
echo Lancement du serveur Tomate ! ...
start "Tomate - Serveur" cmd /k "cd /d "%~dp0" && node server/server.mjs"

echo Attente du demarrage du serveur...
timeout /t 2 /nobreak >nul

echo.
echo Lancement du tunnel Cloudflare...
echo L'URL publique s'affichera ci-dessous (ligne https://...trycloudflare.com)
echo Partagez cette URL a vos joueurs.
echo.
npx cloudflared tunnel --url http://localhost:4173
pause

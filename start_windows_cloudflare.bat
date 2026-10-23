@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 ou plus recent est requis.
  echo https://nodejs.org/
  pause
  exit /b 1
)

REM Lance le serveur + le tunnel Cloudflare, affiche et copie le lien a envoyer aux amis.
node scripts/remote.mjs
pause

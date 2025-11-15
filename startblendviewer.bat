@echo off
title Blend Viewer - Local Dev

REM Ga naar jouw projectmap
cd /d "C:\Users\Floris\Desktop\spleetift v2\blend-viewer"

REM Start de development server in een nieuw venster
start "Vite Dev Server" cmd /k "npm run dev"

REM Geef de server even tijd om op te starten
timeout /t 2 >nul

REM Open de website in je standaardbrowser
start "" "http://localhost:5173/"

echo -----------------------------
echo De Blend Viewer is gestart!
echo Browser geopend.
echo -----------------------------

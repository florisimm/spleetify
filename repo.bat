@echo off
REM ==== Auto commit & push voor jouw GitHub Pages project ====

REM Ga naar jouw projectmap
cd /d "C:\Users\Floris\Desktop\spleetift v2\blend-viewer"

REM Toon status
git status
echo.
echo Druk CTRL+C om te annuleren, of een toets om door te gaan met commit en push.
pause >nul

REM Commit message
set /p MSG="Commit message (enter = Auto update analyse): "
if "%MSG%"=="" set MSG=Auto update analyse

echo.
echo ---- Git add ----
git add .

echo.
echo ---- Git commit ----
git commit -m "%MSG%"

echo.
echo ---- Git push ----
git push

echo.
echo ✅ Klaar. Druk op een toets om dit venster te sluiten.
pause >nul

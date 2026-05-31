@echo off
echo =========================================
echo  NXD Enterprise — Push to GitHub
echo =========================================
echo.

set /p TOKEN="Paste your GitHub Personal Access Token and press Enter: "

echo.
echo Pushing to https://github.com/sayn3786/nxdenterprise ...
echo.

cd /d "%~dp0"

git init -b main
git config user.email "ysantosh3786@gmail.com"
git config user.name "Santosh Yadav"
git add -A
git commit -m "Launch: NXD Enterprise AI-powered presales website" 2>nul || echo (already committed)

git remote remove origin 2>nul
git remote add origin https://sayn3786:%TOKEN%@github.com/sayn3786/nxdenterprise.git
git push -u origin main --force

echo.
echo =========================================
echo  Done! Visit your site at:
echo  https://sayn3786.github.io/nxdenterprise/
echo.
echo  Enable GitHub Pages in:
echo  Repo Settings ^> Pages ^> Source: GitHub Actions
echo =========================================
pause

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " NXD Enterprise — Push to GitHub" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$TOKEN = Read-Host "Paste your GitHub Personal Access Token"

Write-Host ""
Write-Host "Pushing to github.com/sayn3786/nxdenterprise ..." -ForegroundColor Yellow

Set-Location $PSScriptRoot

git init -b main 2>$null
git config user.email "ysantosh3786@gmail.com"
git config user.name "Santosh Yadav"
git add -A
git commit -m "Launch: NXD Enterprise AI-powered presales website" 2>$null

git remote remove origin 2>$null
git remote add origin "https://sayn3786:$TOKEN@github.com/sayn3786/nxdenterprise.git"
git push -u origin main --force

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host " SUCCESS! Your site will be live at:" -ForegroundColor Green
Write-Host " https://sayn3786.github.io/nxdenterprise/" -ForegroundColor White
Write-Host ""
Write-Host " NEXT: Enable GitHub Pages" -ForegroundColor Yellow
Write-Host "  Repo Settings > Pages > Source: GitHub Actions" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Green

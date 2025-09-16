# PowerShell script to start development server with API key
Write-Host "Setting environment variable..." -ForegroundColor Green
$env:VITE_DASHSCOPE_API_KEY = "sk-0bce80a7fc184aea9aa906b2b5a75e47"
Write-Host "API Key set: $($env:VITE_DASHSCOPE_API_KEY.Substring(0,10))..." -ForegroundColor Yellow
Write-Host "Starting development server..." -ForegroundColor Green
npm run dev


# Quick Start Docker Deployment Script
# Run this script with: .\start-docker.ps1

Write-Host "🐳 Omini Library - Docker Deployment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created. Please review and update it with your settings." -ForegroundColor Green
    Write-Host "  Especially change JWT_SECRET for production!" -ForegroundColor Yellow
}

# Stop existing containers
Write-Host ""
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Build and start services
Write-Host ""
Write-Host "Building and starting services..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first run..." -ForegroundColor Gray
docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Services started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Service Status:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host ""
    Write-Host "🌐 Access your application:" -ForegroundColor Cyan
    Write-Host "  Frontend:  http://localhost:8080" -ForegroundColor White
    Write-Host "  Backend:   http://localhost:3000/api" -ForegroundColor White
    Write-Host "  Database:  localhost:5432" -ForegroundColor White
    
    Write-Host ""
    Write-Host "📝 Useful commands:" -ForegroundColor Cyan
    Write-Host "  View logs:        docker-compose logs -f" -ForegroundColor White
    Write-Host "  Stop services:    docker-compose down" -ForegroundColor White
    Write-Host "  Restart:          docker-compose restart" -ForegroundColor White
    Write-Host "  Seed database:    docker-compose exec backend npm run prisma:seed" -ForegroundColor White
    
    Write-Host ""
    Write-Host "Waiting for services to be healthy..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check health
    Write-Host ""
    Write-Host "🏥 Health Check:" -ForegroundColor Cyan
    docker-compose ps
    
} else {
    Write-Host ""
    Write-Host "✗ Failed to start services. Check the logs:" -ForegroundColor Red
    Write-Host "  docker-compose logs" -ForegroundColor White
    exit 1
}

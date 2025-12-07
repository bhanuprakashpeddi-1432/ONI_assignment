# Stop Docker Deployment Script
# Run this script with: .\stop-docker.ps1

Write-Host "🛑 Stopping Omini Library Docker Services" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "✗ Docker is not running." -ForegroundColor Red
    exit 1
}

# Ask user what they want to do
Write-Host "Choose an option:" -ForegroundColor Yellow
Write-Host "  1. Stop services (keep data)" -ForegroundColor White
Write-Host "  2. Stop services and remove volumes (delete data)" -ForegroundColor White
Write-Host "  3. Stop services and remove images" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Stopping services..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "✓ Services stopped. Data preserved." -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        Write-Host "⚠️  WARNING: This will delete all database data!" -ForegroundColor Red
        $confirm = Read-Host "Type 'yes' to confirm"
        if ($confirm -eq "yes") {
            Write-Host "Stopping services and removing volumes..." -ForegroundColor Yellow
            docker-compose down -v
            Write-Host "✓ Services stopped and data deleted." -ForegroundColor Green
        } else {
            Write-Host "Cancelled." -ForegroundColor Yellow
        }
    }
    "3" {
        Write-Host ""
        Write-Host "Stopping services and removing images..." -ForegroundColor Yellow
        docker-compose down --rmi all
        Write-Host "✓ Services stopped and images removed." -ForegroundColor Green
    }
    default {
        Write-Host "Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📊 Container Status:" -ForegroundColor Cyan
docker-compose ps -a

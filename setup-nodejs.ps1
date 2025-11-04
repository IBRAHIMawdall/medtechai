# MedTechAI Platform - Node.js Setup Script
# PowerShell version for better Windows compatibility

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MedTechAI Platform - Node.js Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check if Node.js is installed
Write-Host "Checking if Node.js is already installed..." -ForegroundColor Yellow

if (Test-Command "node") {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✓ Node.js is already installed:" -ForegroundColor Green
    Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "  npm: $npmVersion" -ForegroundColor Green
    Write-Host ""
    
    # Check version compatibility
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    
    if ($majorVersion -ge 22) {
        Write-Host "✓ Node.js version is compatible (v$majorVersion)" -ForegroundColor Green
        Write-Host "✓ Proceeding with project setup..." -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "✗ Node.js version $majorVersion is too old" -ForegroundColor Red
        Write-Host "✗ This project requires Node.js v22 or higher" -ForegroundColor Red
        Write-Host "Please update Node.js and run this script again" -ForegroundColor Yellow
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "✗ Node.js is not installed" -ForegroundColor Red
    Write-Host ""
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Installing Node.js v22 (LTS)" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check if Chocolatey is available
    if (Test-Command "choco") {
        Write-Host "Found Chocolatey package manager. Installing Node.js..." -ForegroundColor Yellow
        try {
            choco install nodejs --version=22.0.0 -y
            Write-Host "✓ Node.js installed via Chocolatey" -ForegroundColor Green
        } catch {
            Write-Host "✗ Failed to install via Chocolatey" -ForegroundColor Red
        }
    }
    # Check if Winget is available
    elseif (Test-Command "winget") {
        Write-Host "Found Winget package manager. Installing Node.js..." -ForegroundColor Yellow
        try {
            winget install OpenJS.NodeJS
            Write-Host "✓ Node.js installed via Winget" -ForegroundColor Green
        } catch {
            Write-Host "✗ Failed to install via Winget" -ForegroundColor Red
        }
    }
    else {
        Write-Host "No package manager found. Please install Node.js manually:" -ForegroundColor Yellow
        Write-Host "1. Visit: https://nodejs.org/en/download/" -ForegroundColor White
        Write-Host "2. Download Node.js v22 LTS for Windows" -ForegroundColor White
        Write-Host "3. Run the installer" -ForegroundColor White
        Write-Host "4. Restart your terminal" -ForegroundColor White
        Write-Host "5. Run this script again" -ForegroundColor White
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host ""
    Write-Host "Please restart your terminal and run this script again to continue setup." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 0
}

# Setup project dependencies
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting up MedTechAI Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = "src\backend"

if (Test-Path "$backendPath\package.json") {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    
    Push-Location $backendPath
    try {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Backend dependencies installed successfully" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
            Write-Host "Please check your internet connection and try again" -ForegroundColor Yellow
            Pop-Location
            Read-Host "Press Enter to exit"
            exit 1
        }
    } catch {
        Write-Host "✗ Error during npm install: $_" -ForegroundColor Red
        Pop-Location
        Read-Host "Press Enter to exit"
        exit 1
    }
    Pop-Location
} else {
    Write-Host "✗ package.json not found in $backendPath" -ForegroundColor Red
    Write-Host "Please ensure you're running this script from the project root" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Environment Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure your database connection in src\backend\.env" -ForegroundColor White
Write-Host "2. Run 'npm run start' to start the development server" -ForegroundColor White
Write-Host "3. Visit http://localhost:3000 to access the application" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
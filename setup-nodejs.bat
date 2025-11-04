@echo off
echo ========================================
echo MedTechAI Platform - Node.js Setup
echo ========================================
echo.

echo Checking if Node.js is already installed...
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Node.js is already installed:
    node --version
    npm --version
    echo.
    goto :check_version
) else (
    echo Node.js is not installed. Starting installation...
    echo.
)

echo ========================================
echo Installing Node.js v22 (LTS)
echo ========================================
echo.

echo Downloading Node.js installer...
echo Please download Node.js v22 from: https://nodejs.org/en/download/
echo.
echo Alternative installation methods:
echo 1. Using Chocolatey: choco install nodejs --version=22.0.0
echo 2. Using Winget: winget install OpenJS.NodeJS
echo 3. Manual download from nodejs.org
echo.

echo After installation, please:
echo 1. Close this terminal
echo 2. Open a new terminal
echo 3. Run this script again to verify installation
echo.

pause
goto :end

:check_version
echo Checking Node.js version compatibility...
for /f "tokens=1 delims=." %%a in ('node --version') do set major_version=%%a
set major_version=%major_version:v=%

if %major_version% geq 22 (
    echo ✓ Node.js version is compatible (v%major_version%)
    echo ✓ Proceeding with project setup...
    echo.
    goto :setup_project
) else (
    echo ✗ Node.js version %major_version% is too old
    echo ✗ This project requires Node.js v22 or higher
    echo Please update Node.js and run this script again
    echo.
    pause
    goto :end
)

:setup_project
echo ========================================
echo Setting up MedTechAI Backend
echo ========================================
echo.

echo Installing backend dependencies...
cd src\backend
if exist package.json (
    echo Installing npm packages...
    npm install
    if %errorlevel% == 0 (
        echo ✓ Backend dependencies installed successfully
    ) else (
        echo ✗ Failed to install backend dependencies
        echo Please check your internet connection and try again
        pause
        goto :end
    )
) else (
    echo ✗ package.json not found in src\backend
    echo Please ensure you're running this script from the project root
    pause
    goto :end
)

cd ..\..

echo.
echo ========================================
echo Environment Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure your database connection in src\backend\.env
echo 2. Run 'npm run start' to start the development server
echo 3. Visit http://localhost:3000 to access the application
echo.

pause

:end
echo Script completed.
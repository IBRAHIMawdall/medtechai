@echo off
REM Script to configure Node.js environment and start the backend server

REM Step 1: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js v22 LTS.
    exit /b 1
)

REM Step 2: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm is not installed. Please ensure Node.js installation includes npm.
    exit /b 1
)

REM Step 3: Add Node.js to PATH if not already added
set "NODE_PATH=C:\Program Files\nodejs"
set "NPM_PATH=%USERPROFILE%\AppData\Roaming\npm"

REM Check if Node.js directory exists
if exist "%NODE_PATH%" (
    echo Adding Node.js to PATH...
    setx PATH "%PATH%;%NODE_PATH%"
) else (
    echo Node.js directory not found at %NODE_PATH%. Please verify installation.
    exit /b 1
)

REM Check if npm directory exists
if exist "%NPM_PATH%" (
    echo Adding npm to PATH...
    setx PATH "%PATH%;%NPM_PATH%"
) else (
    echo npm directory not found at %NPM_PATH%. Please verify installation.
    exit /b 1
)

REM Step 4: Navigate to backend directory
cd /d d:\personal-website\medical-platform\MEDTECHAI-CLEAN\src\backend

REM Step 5: Install dependencies
npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies. Please check npm logs.
    exit /b 1
)

REM Step 6: Start the server
npm start
if %ERRORLEVEL% NEQ 0 (
    echo Failed to start the server. Please check npm logs.
    exit /b 1
)

echo Backend server started successfully.
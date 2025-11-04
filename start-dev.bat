@echo off
echo Starting MedTechAI Development Environment...
echo.

echo Checking Node.js version...
node --version
echo.

echo Installing backend dependencies...
cd src\backend
call npm install

echo.
echo Starting development server...
call npm run dev

pause

@echo off
echo 🧪 LOCAL BACKEND TESTING
echo =====================
echo.
echo 📋 This will run your backend locally for testing
echo.
echo 🔧 SETUP STEPS:
echo 1. Ensure Node.js is installed
echo 2. Navigate to backend folder
echo 3. Install dependencies
echo.
echo 🚀 STARTING BACKEND...
echo.
cd ..
cd ..
cd backend
echo Extracting backend files...
tar -xzf medtechai-backend.tar.gz
echo.
echo Installing dependencies...
npm install
echo.
echo Starting server...
npm start
echo.
echo 🎯 Backend will run at: http://localhost:3000
echo 📋 Test endpoints:
echo   Health check: http://localhost:3000/api/health
echo   AI services: http://localhost:3000/api/ai/*
echo.
echo Press Ctrl+C to stop the server
echo.

@echo off
REM MedTechAI Deployment Package Builder for Windows
REM Creates deployment-ready packages

echo 🏥 MedTechAI Deployment Package Builder
echo ========================================
echo.

REM Create packages directory
if not exist deployment-packages mkdir deployment-packages
echo ✅ Created packages directory

REM Create timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set timestamp=%datetime:~0,8%_%datetime:~8,6%

echo.
echo 📦 Creating Package 1: Complete Backend + Frontend...
cd src\backend

REM Copy backend files
xcopy /E /I /Y * ..\..\deployment-packages\MedTechAI-Complete\backend\ >nul 2>&1

cd ..\..

REM Copy frontend files
xcopy /E /I /Y src\frontend deployment-packages\MedTechAI-Complete\frontend\ >nul 2>&1

REM Copy documentation
copy README.md deployment-packages\MedTechAI-Complete\ >nul 2>&1
copy DEPLOYMENT_GUIDE.md deployment-packages\MedTechAI-Complete\ >nul 2>&1
if exist ..\DEPLOYMENT_GUIDE.md copy ..\DEPLOYMENT_GUIDE.md deployment-packages\MedTechAI-Complete\ >nul 2>&1

echo ✅ Created MedTechAI-Complete package

echo.
echo 📦 Creating Package 2: Frontend Static Files Only...
xcopy /E /I /Y src\frontend deployment-packages\MedTechAI-Frontend\ >nul 2>&1
echo ✅ Created MedTechAI-Frontend package

echo.
echo 📦 Creating Package 3: Backend API Only...
xcopy /E /I /Y src\backend deployment-packages\MedTechAI-Backend\ >nul 2>&1
echo ✅ Created MedTechAI-Backend package

echo.
echo 🎉 All packages created successfully!
echo.
echo Packages location: deployment-packages\
echo.
dir /B deployment-packages
echo.
echo Next steps:
echo 1. Upload package to your server
echo 2. Extract the files
echo 3. Configure .env file
echo 4. Install dependencies (npm install)
echo 5. Run setup (npm run setup-production)
echo 6. Start server (npm start)
echo.

pause


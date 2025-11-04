@echo off
echo 🛠️ PuTTY Setup Helper
echo.

echo Checking if PuTTY is installed...
"C:\Program Files\PuTTY\pscp.exe" --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ PuTTY is already installed and working!
    "C:\Program Files\PuTTY\pscp.exe" --version
    echo.
    echo Ready to deploy! Run: deploy_to_hostinger.bat
) else (
    echo ❌ PuTTY not found in PATH
    echo.
    echo Please follow these steps:
    echo 1. Download PuTTY from: https://www.putty.org/
    echo 2. Install putty-64bit-0.78-installer.msi
    echo 3. Add C:\Program Files\PuTTY to your PATH
    echo 4. Restart Command Prompt and run this script again
)

pause
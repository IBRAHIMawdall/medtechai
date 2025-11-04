@echo off
echo 🚀 MedTechAI Frontend Deployment - PuTTY Method Only
echo =================================================
echo.
echo ✅ Upload package to Hostinger using PuTTY SCP
echo.
echo 🔧 COMMAND TO RUN:
pscp -pw @Hema01926 medtechai-frontend.tar.gz u429756882@145.79.14.24:public_html/
echo.
echo 📋 CONNECTION DETAILS:
echo Host: 145.79.14.24
echo Username: u429756882
echo Password: @Hema01926
echo Target: public_html/
echo.
echo 🔐 AFTER UPLOAD - SSH COMMANDS:
echo ssh u429756882@145.79.14.24
echo cd public_html ^&^& tar -xzf medtechai-frontend.tar.gz
echo chmod -R 755 public_html/
echo.
echo 🎯 SETUP REQUIREMENTS:
echo 1. Install PuTTY: https://www.putty.org/
echo 2. Add PuTTY to Windows PATH
echo 3. Run this script in Command Prompt
echo.
echo Press any key to continue with deployment...
pause >nul
echo.
echo 🚀 EXECUTING DEPLOYMENT...
pscp -pw @Hema01926 medtechai-frontend.tar.gz u429756882@145.79.14.24:public_html/
echo.
echo ✅ Upload completed!
echo.
echo 📋 NEXT STEPS:
echo 1. Open new Command Prompt/PowerShell
echo 2. Run: ssh u429756882@145.79.14.24
echo 3. Execute: cd public_html ^&^& tar -xzf medtechai-frontend.tar.gz
echo 4. Run: chmod -R 755 public_html/
echo.
echo 🎉 Your MedTechAI frontend is now live!
echo �� Access at: https://yourdomain.com
echo.
pause

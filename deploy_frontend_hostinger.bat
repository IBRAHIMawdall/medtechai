@echo off
echo 🚀 MedTechAI Frontend Deployment to Hostinger
echo =========================================
echo.
echo 📋 DEPLOYMENT CHECKLIST:
echo ✅ Frontend package: medtechai-frontend.tar.gz
echo ✅ Hostinger credentials configured
echo ✅ PuTTY tools installed and ready
echo.
echo 🔧 DEPLOYMENT OPTIONS:
echo.
echo 1. AUTOMATED (PuTTY SCP):
echo    pscp -pw @Hema01926 medtechai-frontend.tar.gz u429756882@145.79.14.24:public_html/
echo.
echo 2. FILEZILLA (Graphical - EASIEST):
echo    Host: 145.79.14.24
echo    Username: u429756882
echo    Password: @Hema01926
echo    Port: 21
echo    Upload to: public_html/
echo.
echo 3. MANUAL SCP:
echo    scp medtechai-frontend.tar.gz u429756882@145.79.14.24:public_html/
echo.
echo 📋 AFTER UPLOAD - SSH EXTRACTION:
echo ssh u429756882@145.79.14.24
echo cd public_html ^&^& tar -xzf medtechai-frontend.tar.gz
echo chmod -R 755 public_html/
echo.
echo 🎉 RESULT: Your site will be live at https://yourdomain.com
echo.
echo Press any key to open FileZilla download page...
pause >nul
start https://filezilla-project.org/
echo.
echo FileZilla opened in your browser.
echo Use the credentials above to connect and upload.
echo.
pause

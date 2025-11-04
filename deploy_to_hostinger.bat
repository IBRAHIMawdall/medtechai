@echo off
echo 🚀 Deploying MedTechAI Frontend to Hostinger...
echo.

echo Step 1: Creating frontend package...
cd src\frontend
tar -czf ..\..\medtechai-frontend.tar.gz *
cd ..\..

echo Step 2: Uploading package...
"C:\Program Files\PuTTY\pscp.exe" -pw @Hema01926 medtechai-frontend.tar.gz u429756882@145.79.14.24:public_html/

echo Step 3: SSH commands for extraction...
echo.
echo ✅ Upload complete! Now run these commands:
echo ssh u429756882@145.79.14.24
echo cd public_html ^&^& tar -xzf medtechai-frontend.tar.gz
echo chmod -R 755 *

echo.
echo 🎉 Frontend deployment ready!
echo Your site will be available at your Hostinger domain

pause
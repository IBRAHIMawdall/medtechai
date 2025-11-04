@echo off
echo 🚀 AWS EC2 Backend Deployment
echo ============================
echo.
echo 📋 PREREQUISITES:
echo 1. AWS account with EC2 access
2. medtechai-backend.tar.gz ready
3. SSH key pair created
4. Security group configured
echo.
echo 🔧 STEP-BY-STEP DEPLOYMENT:
echo.
echo 1. LAUNCH EC2 INSTANCE:
   - Go to AWS Console: https://console.aws.amazon.com/ec2
   - Launch Ubuntu 22.04 t3.medium instance
   - Create key pair: medtechai-key.pem
   - Allow ports: 22, 80, 443, 3000
echo.
echo 2. UPLOAD FILES:
   pscp -i medtechai-key.pem medtechai-backend.tar.gz ubuntu@YOUR_EC2_IP:/home/ubuntu/
echo.
echo 3. SSH AND DEPLOY:
   ssh -i medtechai-key.pem ubuntu@YOUR_EC2_IP
   cd /home/ubuntu
   tar -xzf medtechai-backend.tar.gz
   cd medtechai-backend
   npm install --production
   pm2 start server.js --name medtechai-backend
echo.
echo 🎯 RESULT: Backend running at http://YOUR_EC2_IP:3000
echo.

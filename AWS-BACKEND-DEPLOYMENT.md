# 🚀 AWS Backend Deployment Guide

## **📋 Prerequisites**
- AWS account with EC2 access
- Your `medtechai-backend.tar.gz` file ready
- SSH key pair for EC2 access
- Security group allowing ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000 (Node.js)

## **🔧 Step 1: Launch EC2 Instance**

### **Option A: AWS Console (Recommended)**

1. **Go to AWS Console:**
   - Navigate to https://console.aws.amazon.com/ec2
   - Click **"Launch Instance"**

2. **Configure Instance:**
   ```bash
   # Basic Configuration
   Name: medtechai-backend
   Application: Ubuntu Server 22.04 LTS
   Instance type: t3.medium (2 vCPU, 4 GB RAM) - Recommended

   # Key pair (login)
   Create new key pair or use existing
   Key pair name: medtechai-key
   Key pair type: RSA
   Private key file format: .pem

   # Network settings
   Allow SSH (port 22) from your IP
   Allow HTTP (port 80) from anywhere
   Allow HTTPS (port 443) from anywhere
   Allow Custom TCP (port 3000) from anywhere

   # Storage
   20 GB gp3 root volume (default)
   ```

3. **Launch Instance:**
   - Click **"Launch Instance"**
   - Wait for instance to be "Running"

4. **Get Public IP:**
   - Note the **Public IPv4 address** (e.g., 54.123.456.789)

### **Option B: AWS CLI**
```bash
# Launch EC2 instance via CLI
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t3.medium \
  --key-name medtechai-key \
  --security-groups medtechai-sg \
  --user-data file://setup-script.sh
```

## **🔑 Step 2: Connect to Instance**

```bash
# SSH into your instance
ssh -i ~/.ssh/medtechai-key.pem ubuntu@54.123.456.789

# You should see:
# Welcome to Ubuntu 22.04 LTS
# ubuntu@ip-172-31-45-67:~$
```

## **⚙️ Step 3: Install Dependencies**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx (for reverse proxy)
sudo apt install -y nginx

# Verify installations
node --version  # Should show v22.x.x
npm --version   # Should show latest
pm2 --version   # Should show version
nginx -v        # Should show version
```

## **📁 Step 4: Deploy Backend Files**

```bash
# Create application directory
sudo mkdir -p /var/www/medtechai
sudo chown ubuntu:ubuntu /var/www/medtechai

# Navigate to app directory
cd /var/www/medtechai

# Upload your backend package (via SCP or other method)
# For now, we'll assume you uploaded medtechai-backend.tar.gz

# Extract files
tar -xzf medtechai-backend.tar.gz
cd medtechai-backend

# Install dependencies
npm install --production

# Create .env file with your API keys
cp .env.example .env
nano .env  # Edit with your real API keys
```

## **🌐 Step 5: Configure Nginx**

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/medtechai

# Add this configuration:
server {
    listen 80;
    server_name 54.123.456.789;  # Your EC2 public IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/medtechai /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## **🚀 Step 6: Start Application**

```bash
# Navigate to app directory
cd /var/www/medtechai/medtechai-backend

# Start with PM2
pm2 start server.js --name "medtechai-backend"

# Save PM2 configuration
pm2 save

# Enable PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Check status
pm2 status
pm2 logs medtechai-backend
```

## **✅ Step 7: Test Deployment**

```bash
# Test backend API
curl http://localhost:3000/api/health

# Should return:
# {"status":"OK","timestamp":"2025-01-11T06:40:00.000Z","version":"1.0.0"}

# Test from your local machine
curl http://54.123.456.789/api/health

# Test AI endpoints
curl -X POST http://54.123.456.789/api/ai/biomedical-ner \
  -H "Content-Type: application/json" \
  -d '{"text":"Patient has diabetes and takes metformin"}'
```

## **🔒 Step 8: Security Setup**

### **Firewall Configuration**
```bash
# Check current rules
sudo ufw status

# Allow required ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 3000/tcp # Node.js

# Enable firewall
sudo ufw --force enable
```

### **SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal (runs twice daily)
sudo systemctl status certbot.timer
```

## **📊 Step 9: Monitoring & Logs**

```bash
# View application logs
pm2 logs medtechai-backend

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Monitor system resources
htop  # or: top

# Check disk usage
df -h

# Check memory usage
free -h
```

## **🔄 Step 10: Updates & Maintenance**

```bash
# Update application
cd /var/www/medtechai/medtechai-backend
pm2 stop medtechai-backend
git pull  # if using git
npm install --production
pm2 start medtechai-backend

# Update system packages
sudo apt update && sudo apt upgrade -y

# Restart services if needed
pm2 restart medtechai-backend
sudo systemctl restart nginx
```

## **🚨 Troubleshooting**

### **Common Issues:**

**❌ Port 3000 not accessible:**
```bash
# Check if app is running
pm2 status
pm2 logs

# Check if port is listening
sudo netstat -tlnp | grep 3000
```

**❌ API calls failing:**
```bash
# Check CORS configuration
# Update FRONTEND_URL in .env to your domain
# Restart application: pm2 restart medtechai-backend
```

**❌ Out of memory:**
```bash
# Check memory usage
free -h

# Restart application
pm2 restart medtechai-backend

# If persistent, upgrade instance type in AWS
```

**❌ SSL certificate issues:**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew
```

## **📞 AWS Support & Resources**

- **AWS Documentation:** https://docs.aws.amazon.com/ec2/
- **AWS Support:** https://console.aws.amazon.com/support
- **Cost Calculator:** https://calculator.aws/

---

## **🎉 Deployment Complete!**

**Your MedTechAI backend is now running on AWS with:**
- ✅ **Node.js 22** with PM2 process management
- ✅ **Nginx reverse proxy** for production traffic
- ✅ **SSL certificate** for secure connections
- ✅ **Monitoring & logging** for maintenance
- ✅ **Auto-scaling ready** for growth

**Test your deployment:**
1. **Frontend:** `https://yourdomain.com`
2. **Backend API:** `https://your-backend-domain.com/api/health`
3. **AI Services:** `https://your-backend-domain.com/api/ai/biomedical-ner`

**🎊 Your complete MedTechAI platform is now deployed and production-ready!** 🚀✨

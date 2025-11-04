# MedTechAI Platform - Environment Setup Guide

This guide will help you fix the Node.js runtime dependency and database connection issues identified in the testing report.

## 🚨 Critical Issues Identified

1. **Node.js Runtime Dependency**: The testing environment lacks Node.js/npm, preventing actual server startup testing
2. **Database Connection**: Cannot verify live database connectivity without runtime environment

## 📋 Prerequisites

- Windows 10/11 (PowerShell 5.1 or later)
- Internet connection for downloading dependencies
- Administrator privileges (for some installation methods)

## 🔧 Quick Setup (Automated)

### Option 1: PowerShell Script (Recommended)
```powershell
# Run from project root directory
.\setup-nodejs.ps1
```

### Option 2: Batch Script
```cmd
# Run from project root directory
setup-nodejs.bat
```

## 🛠️ Manual Setup

### Step 1: Install Node.js v22

#### Method A: Official Installer (Recommended)
1. Visit [nodejs.org](https://nodejs.org/en/download/)
2. Download Node.js v22 LTS for Windows
3. Run the installer with default settings
4. Restart your terminal

#### Method B: Package Managers

**Using Chocolatey:**
```powershell
choco install nodejs --version=22.0.0
```

**Using Winget:**
```powershell
winget install OpenJS.NodeJS
```

**Using Scoop:**
```powershell
scoop install nodejs
```

### Step 2: Verify Installation
```cmd
node --version
npm --version
```

Expected output:
- Node.js: v22.x.x or higher
- npm: v10.x.x or higher

### Step 3: Install Project Dependencies
```cmd
# From project root
cd src\backend
npm install
```

## 🗄️ Database Setup

### Step 1: Install PostgreSQL

#### Option A: Official Installer
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Install with default settings
3. Remember the password for the `postgres` user

#### Option B: Using Docker
```cmd
docker run --name medtechai-postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:15
```

### Step 2: Create Database
```sql
-- Connect to PostgreSQL as postgres user
CREATE DATABASE medtechai;
CREATE USER medtechai_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE medtechai TO medtechai_user;
```

### Step 3: Configure Environment Variables

Create `src/backend/.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medtechai
DB_USER=medtechai_user
DB_PASSWORD=your_secure_password
DATABASE_URL=postgresql://medtechai_user:your_secure_password@localhost:5432/medtechai

# Server Configuration
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your_jwt_secret_key_here
BCRYPT_ROUNDS=12

# API Keys (Optional - for AI features)
OPENAI_API_KEY=your_openai_api_key
FDA_API_KEY=your_fda_api_key

# CORS Settings
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Initialize Database Schema
```cmd
cd src\backend
node setup-db.js
```

## 🧪 Testing Your Setup

### Test Database Connection
```cmd
# From project root
node test-database.js
```

### Test Server Startup
```cmd
cd src\backend
npm start
```

Expected output:
```
🚀 MedTechAI Server running on port 3000
📊 Database connected successfully
🔒 Security middleware enabled
```

### Test Frontend Access
Open your browser and visit:
- Main application: http://localhost:3000
- Pharmacy system: http://localhost:3000/pharmacy
- API health check: http://localhost:3000/api/health

## 🔍 Troubleshooting

### Node.js Issues

**Problem**: `'node' is not recognized as an internal or external command`
**Solution**: 
1. Restart your terminal after installation
2. Check if Node.js is in your PATH environment variable
3. Reinstall Node.js with "Add to PATH" option checked

**Problem**: Node.js version is too old
**Solution**: 
1. Uninstall old Node.js version
2. Install Node.js v22 or later
3. Clear npm cache: `npm cache clean --force`

### Database Issues

**Problem**: `ECONNREFUSED` error
**Solution**:
1. Ensure PostgreSQL service is running
2. Check if port 5432 is available
3. Verify database server is accessible

**Problem**: Authentication failed (28P01)
**Solution**:
1. Check username and password in .env file
2. Verify user exists and has proper permissions
3. Test connection with psql client

**Problem**: Database does not exist (3D000)
**Solution**:
1. Create the database manually
2. Update DB_NAME in .env file
3. Run database setup script

### Dependency Issues

**Problem**: Module not found errors
**Solution**:
```cmd
cd src\backend
rm -rf node_modules
rm package-lock.json
npm install
```

**Problem**: Permission errors during npm install
**Solution**:
1. Run terminal as administrator
2. Or use: `npm install --no-optional`

## 🚀 Development Workflow

### Starting the Development Server
```cmd
# Terminal 1: Backend
cd src\backend
npm run dev

# Terminal 2: Frontend (if needed)
# Serve frontend files with a local server
```

### Running Tests
```cmd
# Test database connection
node test-database.js

# Test API endpoints
npm test
```

### Building for Production
```cmd
npm run build
```

## 📊 Environment Verification Checklist

- [ ] Node.js v22+ installed and accessible
- [ ] npm v10+ installed and accessible
- [ ] PostgreSQL installed and running
- [ ] Database created and accessible
- [ ] Environment variables configured
- [ ] Backend dependencies installed
- [ ] Database schema initialized
- [ ] Server starts without errors
- [ ] Frontend accessible via browser
- [ ] API endpoints responding

## 🆘 Getting Help

If you encounter issues not covered in this guide:

1. Check the console output for specific error messages
2. Run the database test script for detailed diagnostics
3. Verify all environment variables are set correctly
4. Ensure all required services are running

## 📝 Next Steps

After successful setup:

1. **Configure AI Services**: Add OpenAI API key for AI features
2. **Set up SSL**: Configure HTTPS for production
3. **Configure Monitoring**: Set up logging and monitoring
4. **Deploy**: Follow deployment guides for your target platform

---

**Note**: This setup guide addresses the critical issues identified in the testing report and provides a complete development environment for the MedTechAI platform.
#!/bin/bash
# MedTechAI Production Deployment Script
# Prepares a complete deployment package

set -e

echo "🚀 MedTechAI Production Deployment Preparation"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PACKAGE_DIR="deployment-ready"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKEND_DIR="src/backend"
FRONTEND_DIR="src/frontend"

# Create package directory
mkdir -p $PACKAGE_DIR

echo -e "${BLUE}📦 Step 1: Preparing backend...${NC}"
cd $BACKEND_DIR

# Copy package files
echo "Copying backend files..."
mkdir -p "../../$PACKAGE_DIR/backend"
cp -r routes services middleware models utils config data database \
   *.js package.json package-lock.json ecosystem.config.js \
   Dockerfile jest.config.js ../../$PACKAGE_DIR/backend/ 2>/dev/null || true

cd ../..

echo -e "${GREEN}✅ Backend files prepared${NC}"

echo -e "${BLUE}📦 Step 2: Preparing frontend...${NC}"
echo "Copying frontend files..."
cp -r $FRONTEND_DIR $PACKAGE_DIR/

echo -e "${GREEN}✅ Frontend files prepared${NC}"

echo -e "${BLUE}📦 Step 3: Creating deployment files...${NC}"

# Create deployment README
cat > $PACKAGE_DIR/README.md << 'EOF'
# MedTechAI Production Deployment Package

## What's Included

✅ Complete backend API server  
✅ All frontend static files  
✅ Database schema and migrations  
✅ All services (AI, Pharmacy, OAuth, 2FA, WebSocket)  
✅ Configuration examples  
✅ Deployment instructions  

## Quick Start

### 1. Extract Package
```bash
tar -xzf MedTechAI-Production.tar.gz
cd MedTechAI-Production
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment
```bash
cp env.example .env
# Edit .env with your configuration
nano .env
```

### 4. Setup Database
```bash
# Create database
psql -U postgres
CREATE DATABASE medtechai;

# Run migrations
psql -U postgres -d medtechai -f database/schema.sql
psql -U postgres -d medtechai -f database/seed.sql
```

### 5. Start Application
```bash
npm start
# or with PM2
pm2 start server.js --name medtechai
```

## Access Points

- Frontend: http://your-server:3000
- API Health: http://your-server:3000/api/health
- API Docs: http://your-server:3000/api-docs
- Metrics: http://your-server:3000/metrics

## Features

- OAuth 2.0 (Google)
- Two-Factor Authentication
- Redis Caching
- WebSocket Real-time
- Structured Logging
- Prometheus Metrics
- Swagger API Docs

See DEPLOYMENT_GUIDE.md for full details.

EOF

# Create quick start script
cat > $PACKAGE_DIR/start.sh << 'EOF'
#!/bin/bash
# Quick start script

echo "🏥 Starting MedTechAI..."
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Copying env.example to .env..."
    cp env.example .env
    echo "✅ Please edit .env with your configuration"
    echo "   nano .env"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start server
echo "🚀 Starting server..."
npm start
EOF

chmod +x $PACKAGE_DIR/start.sh

# Create Docker deployment script
cat > $PACKAGE_DIR/deploy-docker.sh << 'EOF'
#!/bin/bash
# Docker deployment script

echo "🐳 Building Docker image..."
cd backend
docker build -t medtechai:latest .

echo "🚀 Starting container..."
docker run -d \
  --name medtechai \
  -p 3000:3000 \
  --env-file .env \
  medtechai:latest

echo "✅ Container started!"
echo "Access at: http://localhost:3000"
EOF

chmod +x $PACKAGE_DIR/deploy-docker.sh

echo -e "${GREEN}✅ Deployment files created${NC}"

# Create production package
echo -e "${BLUE}📦 Step 4: Creating final package...${NC}"
tar -czf "MedTechAI-Production-$TIMESTAMP.tar.gz" \
    -C $PACKAGE_DIR .

echo -e "${GREEN}✅ Package created: MedTechAI-Production-$TIMESTAMP.tar.gz${NC}"

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Deployment package ready!${NC}"
echo "=========================================="
echo ""
echo "Package: MedTechAI-Production-$TIMESTAMP.tar.gz"
echo "Size: $(du -h MedTechAI-Production-$TIMESTAMP.tar.gz | cut -f1)"
echo ""
echo "Next steps:"
echo "1. Upload to your server"
echo "2. Extract: tar -xzf MedTechAI-Production-$TIMESTAMP.tar.gz"
echo "3. Configure: cd MedTechAI-Production && cp backend/env.example backend/.env && nano backend/.env"
echo "4. Install: cd backend && npm install"
echo "5. Start: ../start.sh"
echo ""
echo "For Docker deployment:"
echo "1. cd MedTechAI-Production"
echo "2. ./deploy-docker.sh"
echo ""


#!/bin/bash
# MedTechAI Deployment Package Builder
# Creates deployment-ready packages

set -e

PACKAGE_DIR="deployment-packages"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🏥 MedTechAI Deployment Package Builder"
echo "========================================"
echo ""

# Create deployment packages directory
mkdir -p $PACKAGE_DIR
echo "✅ Created packages directory"

# Package 1: Complete Backend + Frontend (Production Ready)
echo ""
echo "📦 Creating Package 1: Complete Backend + Frontend..."
cd src/backend

# Install production dependencies
echo "Installing dependencies..."
npm ci --production

cd ../..

# Create complete package
tar -czf "$PACKAGE_DIR/MedTechAI-Complete-$TIMESTAMP.tar.gz" \
    --exclude='node_modules' \
    --exclude='__tests__' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='uploads/*' \
    src/backend \
    src/frontend \
    .env.example \
    README.md \
    DEPLOYMENT_GUIDE.md

echo "✅ Created: MedTechAI-Complete-$TIMESTAMP.tar.gz"

# Package 2: Frontend Only (Static Files)
echo ""
echo "📦 Creating Package 2: Frontend Static Files..."
tar -czf "$PACKAGE_DIR/MedTechAI-Frontend-$TIMESTAMP.tar.gz" \
    --exclude='node_modules' \
    src/frontend \
    .htaccess

echo "✅ Created: MedTechAI-Frontend-$TIMESTAMP.tar.gz"

# Package 3: Backend Only (API Server)
echo ""
echo "📦 Creating Package 3: Backend Only..."
cd src/backend
tar -czf "../../$PACKAGE_DIR/MedTechAI-Backend-$TIMESTAMP.tar.gz" \
    --exclude='node_modules' \
    --exclude='__tests__' \
    --exclude='*.log' \
    --exclude='uploads/*' \
    .

cd ../..
echo "✅ Created: MedTechAI-Backend-$TIMESTAMP.tar.gz"

# Create deployment instructions
echo ""
echo "📝 Creating deployment instructions..."
cat > "$PACKAGE_DIR/DEPLOYMENT-INSTRUCTIONS.txt" << 'EOF'
# MedTechAI Deployment Instructions

## Package Contents

### Package 1: MedTechAI-Complete
- Complete backend + frontend
- All features working together
- Deploy to: AWS EC2, DigitalOcean, Railway, Render

### Package 2: MedTechAI-Frontend
- Static frontend files only
- Deploy to: Hostinger, Netlify, Vercel, Cloudflare Pages
- Backend must be deployed separately

### Package 3: MedTechAI-Backend
- API server only
- Deploy to: AWS EC2, Railway, Render
- Frontend must be deployed separately

## Quick Deployment

See DEPLOYMENT_GUIDE.md for detailed instructions.

EOF

echo "✅ Created deployment instructions"
echo ""
echo "🎉 All packages created successfully!"
echo ""
echo "Packages location: $PACKAGE_DIR/"
echo ""
ls -lh $PACKAGE_DIR/
echo ""
echo "Next steps:"
echo "1. Upload package to your server"
echo "2. Extract the files"
echo "3. Configure .env file"
echo "4. Install dependencies (npm install)"
echo "5. Run setup (npm run setup-production)"
echo "6. Start server (npm start)"


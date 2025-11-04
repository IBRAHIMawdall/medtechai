#!/bin/bash
# MedTechAI Backend Deployment Script

echo "🚀 Deploying MedTechAI Backend..."

# Install dependencies
cd backend
npm install --production

# Set environment
export NODE_ENV=production
export PORT=3000

# Start server
npm start

echo "✅ Backend deployed at http://localhost:3000"
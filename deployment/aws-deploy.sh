#!/bin/bash
# AWS Deployment Script for MedTechAI Backend

echo "🚀 Deploying MedTechAI to AWS..."

# Install AWS CLI if not present
if ! command -v aws &> /dev/null; then
    echo "Installing AWS CLI..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
fi

# Create deployment package
echo "📦 Creating deployment package..."
cd backend
zip -r ../medtechai-backend.zip . -x "node_modules/*" "logs/*" ".env"

# Upload to S3
echo "📤 Uploading to S3..."
aws s3 cp ../medtechai-backend.zip s3://medtechai-deployments/

# Deploy to Elastic Beanstalk
echo "🌱 Deploying to Elastic Beanstalk..."
aws elasticbeanstalk create-application-version \
    --application-name medtechai-backend \
    --version-label v$(date +%Y%m%d-%H%M%S) \
    --source-bundle S3Bucket=medtechai-deployments,S3Key=medtechai-backend.zip

echo "✅ Deployment complete!"
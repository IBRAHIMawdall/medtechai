# 🔐 Production API Key Management Guide

## Overview

This guide covers secure API key management for production deployment of your MedTechAI platform.

## 🚨 Security First

**NEVER commit API keys to version control!** API keys should always be:

- Stored in environment variables
- Encrypted at rest when possible
- Rotated regularly
- Monitored for unauthorized usage

## 📋 Required API Keys

### 1. OpenAI API Key (Required)

- **Purpose**: Powers AI lab analysis and virtual assistant features
- **Provider**: [OpenAI Platform](https://platform.openai.com/)
- **Cost**: Pay-per-use based on token consumption

### 2. FDA API Key (Optional)

- **Purpose**: Access to FDA drug database
- **Provider**: [FDA OpenFDA](https://open.fda.gov/)
- **Cost**: Free (with rate limits)

## 🛠️ Setup Instructions

### Step 1: Get Your API Keys

#### OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new secret key
5. **Copy the key immediately** (you won't see it again!)

#### FDA API Key (Optional)

1. Visit [FDA OpenFDA](https://open.fda.gov/)
2. Register for an API key
3. Follow their documentation for key generation

### Step 2: Configure Production Environment

#### Using the .env.example template:

```bash
# Copy the template
cp .env.example .env

# Edit with your actual values
nano .env
```

#### Manual .env setup

```env
# Production Environment
NODE_ENV=production
PORT=3000

# Database (configure based on your hosting)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# API Keys
OPENAI_API_KEY=sk-your-actual-openai-key-here
FDA_API_KEY=your-fda-key-here

# Security
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
CORS_ORIGIN=https://yourdomain.com

# Production logging
LOG_LEVEL=info
```

### Step 3: Deployment Platforms

#### Option A: VPS/Server Deployment

```bash
# Upload your .env file securely
scp .env user@your-server:/path/to/app/

# Set proper permissions (readable only by app user)
chmod 600 .env
chown appuser:appgroup .env
```

#### Option B: Docker Deployment

```dockerfile
# In your Dockerfile
FROM node:18-alpine

# Copy environment file
COPY .env .env

# Set proper permissions
RUN chmod 600 .env

# Your app code...
```

#### Option C: Cloud Platform (AWS, GCP, Azure)

**AWS Secrets Manager:**

```bash
# Store API keys in AWS Secrets Manager
aws secretsmanager create-secret \
  --name "medtechai/api-keys" \
  --secret-string '{"OPENAI_API_KEY":"sk-...","FDA_API_KEY":"..."}'
```

**Google Secret Manager:**

```bash
# Create secrets in GCP
echo -n "sk-your-openai-key" | gcloud secrets create openai-api-key --data-file=-
```

## 🔒 Security Best Practices

### 1. API Key Rotation

```bash
# Rotate OpenAI key every 30-90 days
# 1. Generate new key in OpenAI dashboard
# 2. Update .env file
# 3. Restart application
# 4. Monitor for errors
# 5. Delete old key after confirming everything works
```

### 2. Access Control

```bash
# Restrict .env file access
chmod 600 .env          # Owner read/write only
chown appuser .env      # Proper ownership

# Add to .gitignore (if not already there)
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### 3. Environment Separation

```bash
# Different .env files for different environments
.env.development      # Local development
.env.staging         # Staging environment
.env.production      # Production environment
```

### 4. Monitoring & Alerting

```javascript
const healthCheck = async () => {
  try {
    // Test API key validity
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      throw new Error('Invalid API key');
    }

    return { status: 'healthy', api: 'connected' };
  } catch (error) {
    console.error('API Key health check failed:', error);
    return { status: 'unhealthy', api: 'disconnected' };
  }
};
```

```bash
#!/bin/bash
# deploy-with-keys.sh

echo "🔐 MedTechAI Production Deployment with API Keys"
echo "================================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "💡 Copy .env.example to .env and configure your API keys"
    exit 1
fi

# Validate API keys are configured
if ! grep -q "OPENAI_API_KEY=sk-" .env; then
    echo "❌ Error: OpenAI API key not configured!"
    echo "💡 Add your OpenAI API key to .env file"
    exit 1
fi

echo "✅ API keys validated"
echo "🚀 Deploying to production..."

# Your deployment commands here
# npm run build
# pm2 start ecosystem.config.js
# etc.

echo "🎉 Deployment complete!"
echo "🔍 Monitor your application logs for any API key issues"
```

## 🔧 Troubleshooting

### Common Issues

1. Invalid API Key Error

```bash
# Check if key is properly formatted
grep "OPENAI_API_KEY" .env

# Test key validity
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models
```

2. Rate Limit Exceeded

```bash
# Monitor usage in OpenAI dashboard
# Implement exponential backoff in your code
# Consider upgrading your OpenAI plan
```

3. Cost Management

```bash
# Set usage limits in OpenAI dashboard
# Implement token counting in your application
# Monitor costs regularly
```

## 📊 Cost Estimation

### OpenAI API Costs (as of 2024)

- GPT-4: ~$0.03 per 1K tokens (input) / $0.06 per 1K tokens (output)
- GPT-3.5 Turbo: ~$0.002 per 1K tokens

### Monthly Estimates

- Light usage (100 requests/day): $10-50/month
- Medium usage (1,000 requests/day): $50-200/month
- Heavy usage (10,000 requests/day): $200-1,000/month

## 🎯 Next Steps

1. Set up monitoring for API key usage and costs
2. Implement rate limiting to prevent abuse
3. Create backup API keys for failover
4. Set up alerts for key expiration or quota limits
5. Document your key rotation process

## 📞 Support

- OpenAI Support: [OpenAI Help Center](https://help.openai.com/)
- FDA API Support: [FDA Contact](https://open.fda.gov/contact/)
- Security Issues: Report immediately to your security team

---

Remember: Your API keys are valuable assets. Treat them with the same care as financial credentials or passwords.

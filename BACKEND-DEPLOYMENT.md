# 🚀 MedTechAI Backend Deployment Guide (Render)

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Render Deployment](#render-deployment)
- [Environment Variables](#environment-variables)
- [Health Checks & Monitoring](#health-checks--monitoring)
- [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start

### 1-Click Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**Or follow manual steps below:**

---

## 📦 Prerequisites

### 1. Create Render Account
- Visit: https://render.com/
- Sign up (free tier available)
- Verify email

### 2. Get AI API Keys (Free)

#### Groq API (Recommended - Fast & Free)
```bash
1. Visit: https://console.groq.com/
2. Sign up for free account
3. Go to API Keys section
4. Create new key
5. Copy key (starts with "gsk_...")

Free Tier: 14,400 requests/day
```

#### Together AI (Optional)
```bash
1. Visit: https://api.together.xyz/
2. Sign up for free account
3. Navigate to API Keys
4. Generate new key
5. Copy key

Free Tier: Available
```

#### Hugging Face (Optional)
```bash
1. Visit: https://huggingface.co/settings/tokens
2. Sign up/login
3. Create new token
4. Copy token

Free Tier: Available
```

---

## 🌐 Render Deployment

### Method 1: Deploy via Render Dashboard (Recommended)

#### Step 1: Connect Repository
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub/GitLab repository
4. Select the `medical-platform/MEDTECHAI-CLEAN` directory

#### Step 2: Configure Service
```yaml
Name: medtechai-backend
Region: Oregon (US West)
Branch: main
Root Directory: medical-platform/MEDTECHAI-CLEAN
Runtime: Node
Build Command: npm install --production
Start Command: npm start
Plan: Free
```

#### Step 3: Add Environment Variables
Click "Environment" and add:

```bash
# Required Variables
NODE_ENV=production
PORT=5000

# AI API Keys (at least one required)
GROQ_API_KEY=your_groq_api_key_here
TOGETHER_API_KEY=your_together_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Node.js Memory Configuration
NODE_OPTIONS=--max-old-space-size=512
```

#### Step 4: Advanced Settings
```yaml
Health Check Path: /api/health
Auto-Deploy: Yes
```

#### Step 5: Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for initial deployment
3. Your API will be live at: `https://your-service-name.onrender.com`

---

### Method 2: Deploy via render.yaml

1. **Ensure render.yaml is configured**
   ```yaml
   services:
     - type: web
       name: medtechai-backend
       env: node
       buildCommand: npm install --production
       startCommand: npm start
       healthCheckPath: /api/health
   ```

2. **Deploy via Render Dashboard**
   - Go to Dashboard → "New" → "Blueprint"
   - Connect repository
   - Render will auto-detect `render.yaml`
   - Add environment variables
   - Deploy

---

### Method 3: Deploy via Render CLI

```bash
# Install Render CLI
npm install -g @render/cli

# Login
render login

# Deploy
cd medical-platform/MEDTECHAI-CLEAN
render deploy
```

---

## 🔧 Environment Variables

### Required Variables

```bash
# Server Configuration
NODE_ENV=production                    # Environment mode
PORT=5000                              # Port number (required)

# AI API Keys (at least one required for full functionality)
GROQ_API_KEY=gsk_xxxxxxxxxxxxx        # Groq API key (recommended)
TOGETHER_API_KEY=xxxxxxxxxxxxx         # Together AI key (optional)
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxx   # Hugging Face token (optional)

# CORS Configuration
CORS_ORIGIN=https://your-frontend.vercel.app  # Frontend URL

# Node.js Optimization
NODE_OPTIONS=--max-old-space-size=512  # Memory limit for free tier
```

### Optional Variables

```bash
# Rate Limiting
RATE_LIMIT_WINDOW=15                   # Rate limit window (minutes)
RATE_LIMIT_MAX=100                     # Max requests per window

# Logging
LOG_LEVEL=info                         # Log level (error, warn, info, debug)

# Monitoring
SENTRY_DSN=                           # Sentry error tracking (optional)
```

---

## 🏥 Health Checks & Monitoring

### Health Check Endpoint

```bash
# Check if service is running
curl https://your-backend.onrender.com/api/health

# Expected Response:
{
  "status": "ok",
  "timestamp": "2025-11-05T10:30:00Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Available Endpoints

```bash
# Health Check
GET /api/health

# AI Services
POST /api/ai/analyze-lab-results
POST /api/ai/virtual-assistant
POST /api/ai/biomedical-ner
POST /api/ai/health-insights
POST /api/ai/product-recommendations

# Test Endpoints (development)
GET /api/test
```

### Monitoring Dashboard

1. **Render Dashboard**
   - View logs in real-time
   - Monitor CPU/Memory usage
   - Check response times
   - Track deployment history

2. **Logs**
   ```bash
   # View logs in dashboard or via CLI
   render logs -s your-service-name
   ```

3. **Metrics**
   - Requests per second
   - Response time
   - Error rate
   - Memory usage

---

## 🧪 Testing Deployment

### 1. Test Health Endpoint

```bash
# Basic health check
curl https://your-backend.onrender.com/api/health

# Should return 200 OK with JSON response
```

### 2. Test AI Services

```bash
# Test Lab Analysis
curl -X POST https://your-backend.onrender.com/api/ai/analyze-lab-results \
  -H "Content-Type: application/json" \
  -d '{"data": "Glucose: 95 mg/dL, Cholesterol: 185 mg/dL"}'

# Test Virtual Assistant
curl -X POST https://your-backend.onrender.com/api/ai/virtual-assistant \
  -H "Content-Type: application/json" \
  -d '{"data": "What are the symptoms of diabetes?"}'
```

### 3. Test CORS

```bash
# Check CORS headers
curl -I https://your-backend.onrender.com/api/health \
  -H "Origin: https://your-frontend.vercel.app"

# Should include:
# Access-Control-Allow-Origin: https://your-frontend.vercel.app
```

---

## 🔧 Troubleshooting

### Service Won't Start

**Error**: `Application failed to respond`

```bash
# Check:
1. PORT environment variable is set to 5000
2. Start command is correct: "npm start"
3. package.json has correct start script
4. All dependencies installed

# Solution:
- Check Render logs for specific error
- Verify Node version (should be 20+)
- Check package.json scripts section
```

### Out of Memory Errors

**Error**: `JavaScript heap out of memory`

```bash
# Solution:
1. Add environment variable:
   NODE_OPTIONS=--max-old-space-size=512

2. Optimize code to use less memory
3. Consider upgrading to paid plan for more RAM
```

### AI Services Not Working

**Symptom**: Returns demo data or errors

```bash
# Check:
1. At least one AI API key is configured
2. API keys are valid and not expired
3. Check Render logs for API errors
4. Verify API quotas not exceeded

# Test API keys:
curl https://api.groq.com/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

### CORS Errors

**Error**: `No 'Access-Control-Allow-Origin' header`

```bash
# Solution:
1. Set CORS_ORIGIN environment variable
2. Ensure frontend URL is correct (no trailing slash)
3. Check Render logs for CORS errors
4. Restart service after env var changes
```

### Slow Response Times

**Symptom**: Requests take > 5 seconds

```bash
# Solutions:
1. Warm up service (free tier sleeps after inactivity)
2. Upgrade to paid plan (no sleep)
3. Optimize AI model inference
4. Add caching layer
5. Use CDN for static assets
```

---

## 📊 Performance Optimization

### Free Tier Limitations
- **Sleep after 15 min inactivity**: First request after sleep takes ~30s
- **512 MB RAM**: Limited memory for AI models
- **Shared CPU**: Performance varies
- **100 GB bandwidth/month**: Usually sufficient

### Optimization Tips

1. **Keep Service Warm**
   ```bash
   # Use external monitor (UptimeRobot, etc.)
   # Ping health endpoint every 10 minutes
   ```

2. **Optimize Memory**
   ```javascript
   // Use streaming responses
   // Implement request caching
   // Clean up large objects
   ```

3. **Reduce Cold Start Time**
   ```bash
   # Minimize dependencies
   # Use npm install --production
   # Optimize import statements
   ```

---

## 🔄 CI/CD Pipeline

### Automatic Deployments

Render automatically deploys when:
1. You push to `main` branch
2. Environment variables change
3. You manually trigger deploy

### Manual Deployment

```bash
# Via Dashboard
1. Go to your service
2. Click "Manual Deploy"
3. Select branch
4. Click "Deploy"

# Via CLI
render deploy -s medtechai-backend
```

### Rollback

```bash
# Via Dashboard
1. Go to service → "Events"
2. Find previous successful deployment
3. Click "Rollback to this deploy"
```

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit API keys to Git
   - Use Render's secret management
   - Rotate keys regularly

2. **CORS**
   - Set specific origin, not "*"
   - Update when frontend URL changes

3. **Rate Limiting**
   - Implement rate limiting (already configured)
   - Monitor for abuse

4. **HTTPS**
   - Automatic on Render (free SSL)
   - Enforce HTTPS only

5. **Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Run `npm audit` regularly

---

## 📈 Scaling Considerations

### When to Upgrade

Consider paid plan ($7/month) if:
- High traffic (> 1000 requests/day)
- Need zero downtime (no sleep)
- Require more RAM/CPU
- Need faster response times
- Want custom domains

### Upgrade Path

```bash
Free Plan:
- 512 MB RAM
- Shared CPU
- Sleeps after inactivity

Starter Plan ($7/mo):
- 512 MB RAM
- Always on (no sleep)
- Custom domain
- Better performance

Standard Plan ($25/mo):
- 2 GB RAM
- Dedicated CPU
- Priority support
```

---

## 📞 Support Resources

### Documentation
- **Render Docs**: https://render.com/docs
- **Node.js Docs**: https://nodejs.org/docs
- **Express.js Docs**: https://expressjs.com/

### Community
- **Render Community**: https://community.render.com/
- **Discord**: Join Render Discord server

### Monitoring Services
- **Uptime Robot**: https://uptimerobot.com/ (free monitoring)
- **Sentry**: https://sentry.io/ (error tracking)
- **LogRocket**: https://logrocket.com/ (session replay)

---

## ✅ Deployment Checklist

Before going live:
- [ ] All environment variables configured
- [ ] At least one AI API key working
- [ ] Health check endpoint responding
- [ ] CORS configured correctly
- [ ] All API endpoints tested
- [ ] Logs checked for errors
- [ ] Memory usage within limits
- [ ] Response times acceptable
- [ ] Frontend connected successfully
- [ ] Error handling working
- [ ] Rate limiting configured

---

## 🎉 Success!

Your backend is now deployed and ready to serve AI-powered health services!

**Next Steps:**
1. Update frontend `NEXT_PUBLIC_API_URL` with Render URL
2. Test all features end-to-end
3. Monitor logs and performance
4. Set up uptime monitoring
5. Configure custom domain (optional)

**Your Backend URL**: `https://your-service-name.onrender.com`

---

**⚠️ Important Notes:**
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading for production use
- Monitor API key usage and quotas


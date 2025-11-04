# MedTechAI Production Setup Guide

## 🚀 Real Production Deployment

This guide will help you deploy a **real, functional** medical platform with:
- PostgreSQL database with real medical data
- FDA API integration for drug information
- Secure authentication with JWT and bcrypt
- Real drug interaction checking
- Pharmacy inventory management
- HIPAA-compliant audit logging

## Prerequisites

### Required Software
- **Node.js 22+** (for optimal performance)
- **PostgreSQL 14+** (production database)
- **Git** (for version control)

### Required Accounts/APIs
- PostgreSQL database (local or cloud)
- Optional: FDA API key (for enhanced features)
- Optional: OpenAI API key (for AI features)

## Step 1: Database Setup

### Install PostgreSQL
```bash
# Windows (using Chocolatey)
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/
```

### Create Database
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE medtechai_prod;
CREATE USER medtech_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE medtechai_prod TO medtech_user;
```

## Step 2: Environment Configuration

### Create Production Environment File
```bash
cd src/backend
cp .env.example .env
```

### Edit .env with Real Values
```env
# Database - CHANGE THESE VALUES
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medtechai_prod
DB_USER=medtech_user
DB_PASS=your_secure_password_here

# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Security - GENERATE SECURE VALUES
JWT_SECRET=your_super_secure_jwt_secret_256_bits_minimum

# Database URL (for cloud deployment)
DATABASE_URL=postgresql://medtech_user:password@localhost:5432/medtechai_prod
```

## Step 3: Install Dependencies

```bash
# Install backend dependencies
cd src/backend
npm install

# Install root dependencies
cd ../..
npm run install:all
```

## Step 4: Initialize Production Database

```bash
cd src/backend
npm run setup-production
```

This will:
- ✅ Create all database tables
- ✅ Set up proper indexes and constraints
- ✅ Seed real medication data
- ✅ Create drug interaction database
- ✅ Set up admin user
- ✅ Configure audit logging

## Step 5: Start Production Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## Step 6: Verify Installation

### Test API Endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'

# Test pharmacy endpoints
curl http://localhost:3000/api/pharmacy/medications

# Test FDA integration
curl http://localhost:3000/api/fda/drug/lisinopril
```

### Default Login Credentials
- **Username:** `admin`
- **Password:** `Admin123!`
- **⚠️ CHANGE IMMEDIATELY AFTER FIRST LOGIN**

## Real Features Implemented

### 🏥 Medical Database
- Real medication database with NDC codes
- FDA-sourced drug information
- Clinical drug interactions
- Pharmacy inventory tracking

### 🔒 Security Features
- Bcrypt password hashing
- JWT token authentication
- SQL injection protection
- CORS security
- Rate limiting
- Audit logging for HIPAA compliance

### 💊 Pharmacy Management
- Real drug interaction checking
- Inventory management with alerts
- Prescription tracking
- Low stock notifications
- Expiration date monitoring

### 🩺 Clinical Features
- Patient management
- Consultation scheduling
- Lab result tracking
- Medical history

### 📊 FDA Integration
- Real-time drug information lookup
- Drug recall notifications
- NDC verification
- Interaction warnings

## Production Deployment Options

### Option 1: Local Server
- Run on Windows/Linux server
- Use PostgreSQL locally
- Configure reverse proxy (nginx)
- Set up SSL certificates

### Option 2: Cloud Deployment (AWS)
```bash
# Use existing deployment scripts
npm run deploy:aws
```

### Option 3: Docker Deployment
```bash
# Build and run with Docker
docker build -t medtechai .
docker run -p 3000:3000 medtechai
```

## Security Checklist

- [ ] Change default admin password
- [ ] Generate secure JWT secret (256+ bits)
- [ ] Configure HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Enable audit logging
- [ ] Set up monitoring
- [ ] Review CORS settings
- [ ] Configure rate limiting

## Monitoring & Maintenance

### Database Backups
```bash
# Daily backup script
pg_dump medtechai_prod > backup_$(date +%Y%m%d).sql
```

### Log Monitoring
- Check `logs/combined.log` for application logs
- Monitor `audit_log` table for security events
- Set up alerts for critical errors

### Performance Monitoring
- Monitor database connections
- Check API response times
- Monitor memory usage
- Track error rates

## Troubleshooting

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -h localhost -U medtech_user -d medtechai_prod
```

### Permission Issues
```sql
-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO medtech_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO medtech_user;
```

### API Issues
- Check environment variables
- Verify database connectivity
- Review application logs
- Test individual endpoints

## Support & Documentation

- **API Documentation:** Check `/docs` folder
- **Database Schema:** See `database/schema.sql`
- **Security Guide:** Review security configurations
- **Backup Procedures:** Set up automated backups

---

**🎉 Congratulations!** You now have a real, production-ready medical platform with:
- Real drug database and interactions
- Secure authentication
- FDA API integration
- HIPAA-compliant logging
- Professional pharmacy management

**Next Steps:**
1. Customize for your specific needs
2. Add additional medical features
3. Integrate with existing systems
4. Set up monitoring and alerts
5. Configure automated backups
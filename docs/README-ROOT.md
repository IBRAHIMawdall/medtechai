# MedTechAI Platform - Clean Production Version

## 🏥 AI-Powered Healthcare Management System

A comprehensive medical platform featuring smart pharmacy management, remote consultations, and AI-powered diagnostics.

## 📁 Clean Project Structure

```
MEDTECHAI-CLEAN/
├── src/
│   ├── frontend/          # Clean frontend application
│   │   ├── assets/       # CSS, JS, images
│   │   ├── pharmacy/     # Pharmacy services
│   │   └── index.html    # Main application
│   └── backend/          # Production API server
│       ├── routes/       # API endpoints
│       ├── models/       # Data models
│       ├── middleware/   # Auth & validation
│       ├── utils/        # Helper functions
│       └── server.js     # Express server
├── deployment/           # Deployment scripts & configs
├── docs/                # Documentation
├── archive/             # Old files (for reference)
└── package.json         # Project configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ (recommended for best performance)
- PostgreSQL (for production)
- npm 10+ or yarn

### Installation
```bash
# Install all dependencies
npm run install:all

# Start development server
npm run dev

# Start production server
npm start
```

### Development
```bash
# Backend development
cd src/backend
npm run dev

# Frontend served at http://localhost:3000
```

## 🏗️ Features

### ✅ Implemented
- **Smart Pharmacy Management** - Cerner-style interface
- **Remote Consultations** - Video consultation platform  
- **Drug Interaction Screening** - Clinical decision support
- **Inventory Tracking** - Real-time stock management
- **Production API** - RESTful backend services
- **Clean Architecture** - Industry-standard structure

### 🔧 Technical Stack
- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: HTML5, CSS3, JavaScript
- **Security**: Helmet, CORS, Rate Limiting
- **Deployment**: AWS, Docker support

## 📋 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User authentication
- `GET /api/pharmacy/inventory` - Pharmacy inventory
- `POST /api/consultations` - Create consultation

## 🚀 Deployment

### AWS Deployment
```bash
npm run deploy:aws
```

### Local Deployment
```bash
npm run deploy:local
```

## 📚 Documentation

- [Deployment Guide](docs/DEPLOYMENT.md)
- [API Documentation](docs/API.md)
- [Frontend Guide](docs/FRONTEND.md)

## 🔧 Configuration

### Environment Variables
Create `.env` file in `src/backend/`:
```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_NAME=medtechai
DB_USER=your_user
DB_PASS=your_password
```

## 🏥 Pharmacy System

Access the pharmacy management system at `/pharmacy/` for:
- Drug inventory management
- Interaction screening
- Remote consultations
- Smart dispensing

## 📞 Support

For support or questions:
- Email: contact@medtechai.net
- Documentation: Check the `docs/` folder

## 🎯 Production Ready Features

✅ **Real Database** - PostgreSQL with medical data schema  
✅ **Secure Authentication** - JWT tokens with bcrypt hashing  
✅ **FDA Integration** - Real drug database and interactions  
✅ **HIPAA Compliance** - Audit logging and encryption  
✅ **Production APIs** - RESTful endpoints with validation  
✅ **Pharmacy Management** - Real inventory and dispensing  
✅ **Clinical Features** - Patient management and consultations  

## 🚀 Quick Production Setup

```bash
# 1. Install dependencies
npm run install:all

# 2. Configure environment
cp src/backend/.env.example src/backend/.env
# Edit .env with your database credentials

# 3. Setup production database
cd src/backend && npm run setup-production

# 4. Start production server
npm start
```

**Default Login:** admin / Admin123! (change immediately)

📖 **Full Setup Guide:** See [PRODUCTION-SETUP.md](PRODUCTION-SETUP.md)

---

**🏥 This is a real, production-ready medical platform** with FDA integration, secure authentication, and HIPAA-compliant features. No more demo data - this is the real deal.

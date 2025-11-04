# Backend Upload Instructions

## Method 1: cPanel File Manager
1. Zip the `backend` folder
2. Upload via cPanel File Manager
3. Extract in your domain root
4. Install Node.js app in cPanel
5. Set startup file: `server.js`

## Method 2: FTP Upload
```bash
# Upload entire backend folder to:
/public_html/api/
```

## Method 3: SSH/Terminal
```bash
# Copy files to server
scp -r backend/ user@medtechai.net:/home/user/

# SSH into server
ssh user@medtechai.net

# Install and start
cd backend
npm install
npm start
```

## Server Configuration
- **Node.js Version**: 16+
- **Port**: 3000 (or hosting provider's port)
- **Environment**: Production
- **Database**: PostgreSQL (configure in .env)

## Quick Start Commands
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm start
```

## API Endpoints Available
- `GET /api/health` - Health check
- `GET /api/pharmacy/prescriptions` - Get prescriptions
- `POST /api/pharmacy/prescriptions` - Add prescription
- `GET /api/consultations` - Get consultations
- `POST /api/consultations` - Schedule consultation

## Frontend Integration
Update frontend API calls to point to your backend:
```javascript
const API_BASE = 'https://medtechai.net/api';
```
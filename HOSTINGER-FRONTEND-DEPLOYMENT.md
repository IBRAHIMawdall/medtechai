# 🚀 Hostinger Frontend Deployment Guide

## **📋 Prerequisites**
- Hostinger hosting plan (shared hosting or higher)
- Your `medtechai-frontend.tar.gz` file ready
- Domain name configured in Hostinger

## **🔧 Step 1: Access Hostinger Control Panel**

1. **Login to Hostinger:**
   - Go to https://www.hostinger.com/cpanel
   - Enter your credentials

2. **Navigate to File Manager:**
   - Click on **"Files"** in the left sidebar
   - Select **"File Manager"**

## **📁 Step 2: Upload Frontend Files**

### **Option A: Upload via File Manager**
1. **Create public_html directory** (if not exists)
2. **Navigate to public_html**
3. **Click "Upload"** in the top toolbar
4. **Select and upload:** `medtechai-frontend.tar.gz`
5. **Wait for upload to complete**

### **Option B: Upload via FTP (Recommended)**
```bash
# Connect to your Hostinger FTP
Host: ftp.yourdomain.com
Username: your_hostinger_username
Password: your_hostinger_password
Port: 21

# Upload the frontend package
# Then extract via SSH or File Manager
```

## **⚙️ Step 3: Extract Files**

1. **In Hostinger File Manager:**
   - Navigate to the uploaded `medtechai-frontend.tar.gz`
   - Click the **three dots (⋮)** → **Extract**
   - Extract to: `public_html/`

2. **Verify extraction:**
   - Should see folders: `assets/`, `services/`, `js/`, etc.
   - Main files: `index.html`, `style.css`

## **🌐 Step 4: Configure Domain**

1. **Set up domain:**
   - In Hostinger control panel
   - Go to **"Domains"** → **"Manage"**
   - Point your domain to the hosting

2. **Test access:**
   ```bash
   # Visit your domain
   https://yourdomain.com
   https://yourdomain.com/services/
   ```

## **🔧 Step 5: Configure Environment (Optional)**

If your frontend needs API URLs:

1. **Edit `config.js`** in the uploaded files:
   ```javascript
   // Update API endpoint
   const API_BASE_URL = 'https://your-backend-domain.com/api';
   ```

## **✅ Step 6: Verify Deployment**

**Test these URLs:**
- **Homepage:** `https://yourdomain.com`
- **Services:** `https://yourdomain.com/services/`
- **Biomedical NER:** `https://yourdomain.com/services/` (integrated)

**Expected Results:**
- ✅ Homepage loads with MedTechAI branding
- ✅ Services page shows all AI services
- ✅ No 404 errors or broken links
- ✅ All styling and animations work

## **🔒 Step 7: SSL Certificate (HTTPS)**

1. **Enable SSL in Hostinger:**
   - Go to **"SSL"** in control panel
   - Click **"Enable SSL"** for your domain
   - Wait 5-10 minutes for activation

2. **Test HTTPS:**
   ```bash
   # Should redirect HTTP to HTTPS automatically
   https://yourdomain.com
   ```

## **🚨 Troubleshooting**

### **Common Issues:**

**❌ Files not uploading:**
- Check file size limits (Hostinger: 100MB per file)
- Try FTP upload instead of web interface
- Clear browser cache

**❌ 404 errors:**
- Ensure files extracted to `public_html/`
- Check file permissions (755 for folders, 644 for files)
- Verify domain DNS settings

**❌ Styles not loading:**
- Check `assets/` folder exists
- Verify CSS file paths in HTML
- Clear CDN cache if using

**❌ API calls failing:**
- Update API_BASE_URL in `config.js`
- Check CORS settings if needed
- Verify backend is running on AWS

## **📞 Support**

- **Hostinger Support:** https://www.hostinger.com/help
- **Live Chat:** Available 24/7 in control panel
- **Documentation:** https://www.hostinger.com/tutorials

---

## **🎉 Next: Deploy Backend on AWS**

After frontend is working, deploy your backend on AWS using the guide below.

**Your frontend should now be live and serving your MedTechAI platform!** 🚀✨

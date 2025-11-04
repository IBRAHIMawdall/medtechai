// MedTechAI Frontend Configuration
// This file configures the frontend to connect to the AWS backend

// Backend API Configuration
const API_CONFIG = {
    // Render backend URL
    BASE_URL: 'https://medtechai.onrender.com', // Render backend deployed
    
    // Alternative configurations for different environments
    ENVIRONMENTS: {
        development: 'http://localhost:3001',
        staging: 'https://medtechai.onrender.com',
        production: 'https://medtechai.onrender.com'
    },
    
    // API Endpoints
    ENDPOINTS: {
        // Authentication
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh',
        
        // Medical Services
        MEDICAL_DATA: '/api/medical/data',
        SUBMIT_MEDICAL: '/api/medical/submit',
        MEDICAL_HISTORY: '/api/medical/history',
        
        // AI Services
        AI_ANALYSIS: '/api/ai/analyze',
        AI_CHAT: '/api/ai/chat',
        AI_DIAGNOSIS: '/api/ai/diagnosis',
        
        // Pharmacy Services
        PHARMACY_DATA: '/api/pharmacy/data',
        DRUG_INTERACTION: '/api/pharmacy/drug-interaction',
        PRESCRIPTION: '/api/pharmacy/prescription',
        INVENTORY: '/api/pharmacy/inventory',
        
        // Payment Services
        PROCESS_PAYMENT: '/api/payments/process',
        PAYMENT_HISTORY: '/api/payments/history',
        
        // User Management
        USER_PROFILE: '/api/users/profile',
        UPDATE_PROFILE: '/api/users/update',
        
        // Lab Services
        LAB_RESULTS: '/api/lab/results',
        SUBMIT_LAB: '/api/lab/submit',
        
        // Admin Services
        ADMIN_DASHBOARD: '/api/admin/dashboard',
        ADMIN_USERS: '/api/admin/users'
    },
    
    // Request Configuration
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Request timeout (milliseconds) - Optimized for different instance types
    TIMEOUT: 30000, // 30 seconds (default)
    
    // Instance-specific timeout configurations
    INSTANCE_TIMEOUTS: {
        't2.micro': 45000,    // 45 seconds for t2.micro (slower performance)
        't3.small': 30000,    // 30 seconds for t3.small (standard)
        't3.medium': 20000,   // 20 seconds for t3.medium (faster)
        'default': 30000      // Default timeout
    },
    
    // Retry configuration for different instance types
    RETRY_CONFIG: {
        't2.micro': { attempts: 3, delay: 2000 },    // More retries for t2.micro
        't3.small': { attempts: 2, delay: 1000 },    // Standard retries
        't3.medium': { attempts: 2, delay: 500 },    // Quick retries
        'default': { attempts: 2, delay: 1000 }
    },
    
    // Include credentials in requests
    CREDENTIALS: 'include'
};

// API Client Class
class MedTechAIClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.token = localStorage.getItem('authToken');
        this.detectedInstanceType = 'default';
        this.performanceMetrics = {
            averageResponseTime: 0,
            requestCount: 0
        };
    }
    
    // Set the backend URL (call this after AWS deployment)
    setBackendURL(url) {
        this.baseURL = url;
        API_CONFIG.BASE_URL = url;
        console.log(`🔗 Backend URL updated to: ${url}`);
    }
    
    // Auto-detect instance type based on performance
    detectInstanceType(responseTime) {
        this.performanceMetrics.requestCount++;
        this.performanceMetrics.averageResponseTime = 
            (this.performanceMetrics.averageResponseTime * (this.performanceMetrics.requestCount - 1) + responseTime) 
            / this.performanceMetrics.requestCount;
        
        const avgTime = this.performanceMetrics.averageResponseTime;
        
        if (avgTime > 400) {
            this.detectedInstanceType = 't2.micro';
        } else if (avgTime > 200) {
            this.detectedInstanceType = 't3.small';
        } else {
            this.detectedInstanceType = 't3.medium';
        }
        
        if (this.performanceMetrics.requestCount === 5) {
            console.log(`🎯 Detected backend instance type: ${this.detectedInstanceType} (avg response: ${avgTime.toFixed(0)}ms)`);
        }
    }
    
    // Get optimized timeout for detected instance type
    getOptimizedTimeout() {
        return API_CONFIG.INSTANCE_TIMEOUTS[this.detectedInstanceType] || API_CONFIG.TIMEOUT;
    }
    
    // Get headers with authentication
    getHeaders(additionalHeaders = {}) {
        const headers = { ...API_CONFIG.DEFAULT_HEADERS, ...additionalHeaders };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }
    
    // Generic API request method with performance optimization
    async request(endpoint, options = {}) {
        const startTime = Date.now();
        
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                ...options,
                headers: this.getHeaders(options.headers),
                credentials: API_CONFIG.CREDENTIALS,
                timeout: this.getOptimizedTimeout()
            };
            
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.getOptimizedTimeout());
            config.signal = controller.signal;
            
            const response = await fetch(url, config);
            clearTimeout(timeoutId);
            
            // Track performance for auto-detection
            const responseTime = Date.now() - startTime;
            this.detectInstanceType(responseTime);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            const responseTime = Date.now() - startTime;
            
            // Still track performance even on errors (for timeout detection)
            if (responseTime > 100) {
                this.detectInstanceType(responseTime);
            }
            
            console.error('API request failed:', error);
            
            // Implement retry logic for certain instance types
            const retryConfig = API_CONFIG.RETRY_CONFIG[this.detectedInstanceType] || API_CONFIG.RETRY_CONFIG.default;
            
            if (options._retryCount < retryConfig.attempts && (error.name === 'AbortError' || error.message.includes('timeout'))) {
                console.log(`🔄 Retrying request (attempt ${(options._retryCount || 0) + 1}/${retryConfig.attempts})`);
                await new Promise(resolve => setTimeout(resolve, retryConfig.delay));
                return this.request(endpoint, { ...options, _retryCount: (options._retryCount || 0) + 1 });
            }
            
            throw error;
        }
    }
    
    // Authentication methods
    async login(credentials) {
        const response = await this.request(API_CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.token) {
            this.token = response.token;
            localStorage.setItem('authToken', response.token);
        }
        
        return response;
    }
    
    async register(userData) {
        return this.request(API_CONFIG.ENDPOINTS.REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
    
    async logout() {
        try {
            await this.request(API_CONFIG.ENDPOINTS.LOGOUT, { method: 'POST' });
        } finally {
            this.token = null;
            localStorage.removeItem('authToken');
        }
    }
    
    // Medical services
    async getMedicalData() {
        return this.request(API_CONFIG.ENDPOINTS.MEDICAL_DATA);
    }
    
    async submitMedicalForm(formData) {
        return this.request(API_CONFIG.ENDPOINTS.SUBMIT_MEDICAL, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
    }
    
    // AI services
    async getAIAnalysis(data) {
        return this.request(API_CONFIG.ENDPOINTS.AI_ANALYSIS, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async chatWithAI(message) {
        return this.request(API_CONFIG.ENDPOINTS.AI_CHAT, {
            method: 'POST',
            body: JSON.stringify({ message })
        });
    }
    
    // Pharmacy services
    async getPharmacyData() {
        return this.request(API_CONFIG.ENDPOINTS.PHARMACY_DATA);
    }
    
    async checkDrugInteraction(drugs) {
        return this.request(API_CONFIG.ENDPOINTS.DRUG_INTERACTION, {
            method: 'POST',
            body: JSON.stringify({ drugs })
        });
    }
    
    // Payment services
    async processPayment(paymentData) {
        return this.request(API_CONFIG.ENDPOINTS.PROCESS_PAYMENT, {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }
    
    // Lab services
    async getLabResults() {
        return this.request(API_CONFIG.ENDPOINTS.LAB_RESULTS);
    }
    
    async submitLabData(labData) {
        return this.request(API_CONFIG.ENDPOINTS.SUBMIT_LAB, {
            method: 'POST',
            body: JSON.stringify(labData)
        });
    }
}

// Create global instance
const medTechAPI = new MedTechAIClient();

// Configuration instructions
console.log(`
🔧 MedTechAI Frontend Configuration Loaded

📋 Setup Instructions:
1. Deploy your backend to AWS EC2
2. Get your EC2 public IP or domain
3. Update the backend URL:
   medTechAPI.setBackendURL('https://your-ec2-ip:3001');

📡 Current Backend URL: ${API_CONFIG.BASE_URL}

🔗 Available API Methods:
- medTechAPI.login(credentials)
- medTechAPI.register(userData)
- medTechAPI.getMedicalData()
- medTechAPI.getAIAnalysis(data)
- medTechAPI.getPharmacyData()
- medTechAPI.processPayment(paymentData)
- And many more...

💡 Example Usage:
medTechAPI.login({ email: 'user@example.com', password: 'password' })
  .then(response => console.log('Login successful:', response))
  .catch(error => console.error('Login failed:', error));
`);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, MedTechAIClient, medTechAPI };
}
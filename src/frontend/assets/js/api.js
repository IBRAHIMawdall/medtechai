// MedTechAI API Client
const API_BASE_URL = 'https://medtechai.onrender.com/api';

class MedTechAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('authToken');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication
    async login(credentials) {
        const response = await this.request('/auth/login', {
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
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // AI Services
    async analyzeLabResults(data) {
        return this.request('/ai/analyze-lab-results', {
            method: 'POST',
            body: JSON.stringify({ data })
        });
    }

    async virtualAssistant(message) {
        return this.request('/ai/virtual-assistant', {
            method: 'POST',
            body: JSON.stringify({ message })
        });
    }

    async biomedicalNER(text) {
        return this.request('/ai/biomedical-ner', {
            method: 'POST',
            body: JSON.stringify({ text })
        });
    }

    async personalizedMedicine(data) {
        return this.request('/ai/personalized-medicine', {
            method: 'POST',
            body: JSON.stringify({ data })
        });
    }

    // Pharmacy
    async getPharmacyData() {
        return this.request('/pharmacy/prescriptions');
    }

    async checkDrugInteractions(drugs) {
        return this.request('/pharmacy/check-interactions', {
            method: 'POST',
            body: JSON.stringify({ drugs })
        });
    }

    // Shop
    async getProducts() {
        return this.request('/shop/products');
    }

    async addToCart(productId, quantity = 1) {
        return this.request('/shop/cart', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
    }
}

// Global API instance
window.medTechAPI = new MedTechAPI();

// Health check
window.medTechAPI.request('/health')
    .then(response => console.log('✅ Backend connected:', response))
    .catch(error => console.error('❌ Backend connection failed:', error));
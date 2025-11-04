// API Configuration
const API_BASE_URL = 'https://medtechai.onrender.com/api';

class APIClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

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

    // AI Services
    async checkDrugInteractions(medications) {
        return this.request('/ai/check-drug-interactions', {
            method: 'POST',
            body: JSON.stringify({ medications })
        });
    }

    async analyzeLabResults(labResults) {
        return this.request('/ai/analyze-lab-results', {
            method: 'POST',
            body: JSON.stringify({ labResults })
        });
    }

    async generateRecommendations(patientData, labResults = null) {
        return this.request('/ai/generate-recommendations', {
            method: 'POST',
            body: JSON.stringify({ patientData, labResults })
        });
    }

    async predictHealthTrends(historicalData) {
        return this.request('/ai/predict-trends', {
            method: 'POST',
            body: JSON.stringify({ historicalData })
        });
    }

    async virtualAssistant(message, context = null) {
        return this.request('/ai/virtual-assistant', {
            method: 'POST',
            body: JSON.stringify({ message, context })
        });
    }

    // Pharmacy Services
    async getPrescriptions() {
        return this.request('/pharmacy/prescriptions');
    }

    async createPrescription(prescriptionData) {
        return this.request('/pharmacy/prescriptions', {
            method: 'POST',
            body: JSON.stringify(prescriptionData)
        });
    }

    async checkMedicationInteractions(medication) {
        return this.request(`/pharmacy/interactions/${medication}`);
    }

    // Health Check
    async healthCheck() {
        return this.request('/health');
    }
}

// Create global API instance
window.api = new APIClient();
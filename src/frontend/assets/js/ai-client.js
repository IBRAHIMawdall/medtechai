/**
 * AI Service Client - Connects frontend demos to real AI backend
 */
class AIClient {
    constructor() {
        this.baseURL = '/api/ai';
    }

    async analyzeLabResults(labResults) {
        try {
            const response = await fetch(`${this.baseURL}/analyze-lab-results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ labResults })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error analyzing lab results:', error);
            throw error;
        }
    }

    async checkDrugInteractions(medications) {
        try {
            const response = await fetch(`${this.baseURL}/check-drug-interactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ medications })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error checking drug interactions:', error);
            throw error;
        }
    }

    async generateRecommendations(patientData, labResults = null) {
        try {
            const response = await fetch(`${this.baseURL}/generate-recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ patientData, labResults })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error generating recommendations:', error);
            throw error;
        }
    }

    async predictTrends(historicalData) {
        try {
            const response = await fetch(`${this.baseURL}/predict-trends`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ historicalData })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error predicting trends:', error);
            throw error;
        }
    }

    async askVirtualAssistant(message, context = {}) {
        try {
            const response = await fetch(`${this.baseURL}/virtual-assistant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, context })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error asking virtual assistant:', error);
            throw error;
        }
    }

    // Helper method to convert frontend lab data to backend format
    convertLabDataToBackend(frontendData) {
        return {
            testType: frontendData.testType || 'comprehensive',
            sampleCollectionDate: new Date().toISOString(),
            results: frontendData.results || []
        };
    }

    // Helper method to format AI analysis for frontend display
    formatAnalysisForFrontend(analysis) {
        return {
            overallRisk: analysis.overallRisk,
            abnormalValues: analysis.abnormalValues || [],
            criticalValues: analysis.criticalValues || [],
            insights: analysis.insights || [],
            recommendations: analysis.recommendations || [],
            riskScores: analysis.riskScores || {}
        };
    }
}

// Create global instance
window.aiClient = new AIClient();

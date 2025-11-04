const axios = require('axios');

class FDAService {
    constructor() {
        this.baseURL = 'https://api.fda.gov';
        this.drugAPI = `${this.baseURL}/drug`;
    }

    // Search FDA drug database
    async searchDrug(drugName) {
        try {
            const response = await axios.get(`${this.drugAPI}/label.json`, {
                params: {
                    search: `openfda.brand_name:"${drugName}" OR openfda.generic_name:"${drugName}"`,
                    limit: 10
                },
                timeout: 5000
            });

            return response.data.results?.map(drug => ({
                brandName: drug.openfda?.brand_name?.[0],
                genericName: drug.openfda?.generic_name?.[0],
                manufacturer: drug.openfda?.manufacturer_name?.[0],
                dosageForm: drug.dosage_form?.[0],
                route: drug.route?.[0],
                warnings: drug.warnings?.[0],
                contraindications: drug.contraindications?.[0],
                drugInteractions: drug.drug_interactions?.[0]
            })) || [];
        } catch (error) {
            console.error('FDA API error:', error.message);
            return [];
        }
    }

    // Get drug interactions from FDA data
    async getDrugInteractions(drugName) {
        try {
            const response = await axios.get(`${this.drugAPI}/label.json`, {
                params: {
                    search: `openfda.brand_name:"${drugName}" OR openfda.generic_name:"${drugName}"`,
                    limit: 1
                },
                timeout: 5000
            });

            const drug = response.data.results?.[0];
            if (!drug) return null;

            return {
                drugName,
                interactions: drug.drug_interactions || [],
                warnings: drug.warnings || [],
                contraindications: drug.contraindications || []
            };
        } catch (error) {
            console.error('FDA interaction lookup error:', error.message);
            return null;
        }
    }

    // Verify NDC (National Drug Code)
    async verifyNDC(ndc) {
        try {
            const response = await axios.get(`${this.drugAPI}/ndc.json`, {
                params: {
                    search: `product_ndc:"${ndc}"`,
                    limit: 1
                },
                timeout: 5000
            });

            return response.data.results?.[0] || null;
        } catch (error) {
            console.error('NDC verification error:', error.message);
            return null;
        }
    }

    // Get drug recalls
    async getDrugRecalls(drugName) {
        try {
            const response = await axios.get(`${this.drugAPI}/enforcement.json`, {
                params: {
                    search: `product_description:"${drugName}"`,
                    limit: 10
                },
                timeout: 5000
            });

            return response.data.results?.map(recall => ({
                recallNumber: recall.recall_number,
                productDescription: recall.product_description,
                reasonForRecall: recall.reason_for_recall,
                recallInitiationDate: recall.recall_initiation_date,
                status: recall.status,
                classification: recall.classification
            })) || [];
        } catch (error) {
            console.error('Drug recall lookup error:', error.message);
            return [];
        }
    }
}

module.exports = new FDAService();
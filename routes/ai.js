const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const personalizedMedicineService = require('../services/personalizedMedicineService');
// const logger = require('../utils/logger');

// POST /api/ai/analyze-lab-results
router.post('/analyze-lab-results', async (req, res) => {
    try {
        const { labResults } = req.body;
        
        if (!labResults || !labResults.results) {
            return res.status(400).json({ error: 'Lab results data required' });
        }

        const analysis = await aiService.analyzeLabResults(labResults);
        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing lab results:', error);
        res.status(500).json({ error: 'Failed to analyze lab results' });
    }
});

// POST /api/ai/check-drug-interactions
router.post('/check-drug-interactions', async (req, res) => {
    try {
        const { medications } = req.body;
        
        if (!medications || !Array.isArray(medications)) {
            return res.status(400).json({ error: 'Medications array required' });
        }

        const interactions = await aiService.checkDrugInteractions(medications);
        res.json({ interactions });
    } catch (error) {
        console.error('Error checking drug interactions:', error);
        res.status(500).json({ error: 'Failed to check drug interactions' });
    }
});

// POST /api/ai/generate-recommendations
router.post('/generate-recommendations', async (req, res) => {
    try {
        const { patientData, labResults } = req.body;
        
        if (!patientData) {
            return res.status(400).json({ error: 'Patient data required' });
        }

        const recommendations = await aiService.generatePersonalizedRecommendations(patientData, labResults);
        res.json({ recommendations });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

// POST /api/ai/predict-trends
router.post('/predict-trends', async (req, res) => {
    try {
        const { historicalData } = req.body;
        
        if (!historicalData || !Array.isArray(historicalData)) {
            return res.status(400).json({ error: 'Historical data array required' });
        }

        const trends = await aiService.predictHealthTrends(historicalData);
        res.json({ trends });
    } catch (error) {
        console.error('Error predicting trends:', error);
        res.status(500).json({ error: 'Failed to predict health trends' });
    }
});

// POST /api/ai/virtual-assistant
router.post('/virtual-assistant', async (req, res) => {
    try {
        const { message, context } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message required' });
        }

        // Now using real AI responses powered by free AI providers!
        const response = await aiService.generateVirtualAssistantResponse(message, context);
        res.json({ response });
    } catch (error) {
        console.error('Error processing virtual assistant request:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

// POST /api/ai/biomedical-ner
router.post('/biomedical-ner', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text required for biomedical NER analysis' });
        }

        // Perform biomedical NER using AI service
        const result = await aiService.performBiomedicalNER(text);
        res.json(result);
    } catch (error) {
        console.error('Error processing biomedical NER request:', error);
        res.status(500).json({ error: 'Failed to process biomedical NER request' });
    }
});

// POST /api/ai/personalized-medicine
router.post('/personalized-medicine', async (req, res) => {
    try {
        const { geneticData, patientDemographics } = req.body;

        if (!geneticData) {
            return res.status(400).json({ error: 'Genetic data required for personalized medicine analysis' });
        }

        const analysis = await personalizedMedicineService.analyzeGeneticProfile(geneticData, patientDemographics);
        const report = personalizedMedicineService.generateReport(analysis);
        
        res.json({
            analysis,
            report
        });
    } catch (error) {
        console.error('Error processing personalized medicine request:', error);
        res.status(500).json({ error: 'Failed to process personalized medicine request' });
    }
});

module.exports = router;

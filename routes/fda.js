const express = require('express');
const router = express.Router();
const fdaService = require('../services/fdaService');

// GET /api/fda/drug/:name
router.get('/drug/:name', async (req, res) => {
    try {
        const { name } = req.params;
        
        if (!name || name.length < 2) {
            return res.status(400).json({ error: 'Drug name must be at least 2 characters' });
        }
        
        const drugs = await fdaService.searchDrug(name);
        
        res.json({
            query: name,
            results: drugs,
            count: drugs.length,
            source: 'FDA OpenFDA API'
        });
    } catch (error) {
        console.error('FDA drug search error:', error);
        res.status(500).json({ error: 'Failed to search FDA database' });
    }
});

// GET /api/fda/interactions/:name
router.get('/interactions/:name', async (req, res) => {
    try {
        const { name } = req.params;
        
        const interactions = await fdaService.getDrugInteractions(name);
        
        if (!interactions) {
            return res.status(404).json({ error: 'Drug not found in FDA database' });
        }
        
        res.json(interactions);
    } catch (error) {
        console.error('FDA interaction lookup error:', error);
        res.status(500).json({ error: 'Failed to lookup drug interactions' });
    }
});

// GET /api/fda/verify-ndc/:ndc
router.get('/verify-ndc/:ndc', async (req, res) => {
    try {
        const { ndc } = req.params;
        
        // Validate NDC format (basic validation)
        if (!/^\d{4,5}-\d{3,4}-\d{1,2}$/.test(ndc)) {
            return res.status(400).json({ error: 'Invalid NDC format' });
        }
        
        const ndcData = await fdaService.verifyNDC(ndc);
        
        if (!ndcData) {
            return res.status(404).json({ error: 'NDC not found' });
        }
        
        res.json({
            ndc,
            verified: true,
            data: ndcData
        });
    } catch (error) {
        console.error('NDC verification error:', error);
        res.status(500).json({ error: 'Failed to verify NDC' });
    }
});

// GET /api/fda/recalls/:name
router.get('/recalls/:name', async (req, res) => {
    try {
        const { name } = req.params;
        
        const recalls = await fdaService.getDrugRecalls(name);
        
        res.json({
            drug: name,
            recalls,
            count: recalls.length,
            hasActiveRecalls: recalls.some(r => r.status === 'Ongoing')
        });
    } catch (error) {
        console.error('FDA recall lookup error:', error);
        res.status(500).json({ error: 'Failed to lookup drug recalls' });
    }
});

module.exports = router;
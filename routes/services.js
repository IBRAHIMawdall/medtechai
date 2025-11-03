const express = require('express');
const router = express.Router();
const db = require('../utils/database');

router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT id, name, description, category, price, image_url, details FROM services ORDER BY id');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// GET /api/services/:id - Get a single service by ID
router.get('/:id', async (req, res) => {
    const serviceId = parseInt(req.params.id, 10);

    if (isNaN(serviceId)) {
        return res.status(400).json({ success: false, error: 'Invalid service ID' });
    }

    try {
        const { rows } = await db.query(
            'SELECT id, name, description, category, price, image_url, details FROM services WHERE id = $1',
            [serviceId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Service not found' });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(`Error fetching service with ID ${serviceId}:`, error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
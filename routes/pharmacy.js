const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const { validatePrescription } = require('../middleware/validation');

// GET /api/pharmacy/prescriptions
router.get('/prescriptions', async (req, res) => {
    try {
        const { patientId } = req.query;
        const prescriptions = await db.getPrescriptions(patientId);
        res.json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
});

// POST /api/pharmacy/prescriptions
router.post('/prescriptions', validatePrescription, async (req, res) => {
    try {
        const saved = await db.addPrescription(req.body);
        console.log(`New prescription created: ${saved.id}`);
        res.status(201).json(saved);
    } catch (error) {
        console.error('Error creating prescription:', error);
        res.status(500).json({ error: 'Failed to create prescription' });
    }
});

// GET /api/pharmacy/medications
router.get('/medications', async (req, res) => {
    try {
        const { search } = req.query;
        const medications = await db.getMedications(search);
        res.json(medications);
    } catch (error) {
        console.error('Error fetching medications:', error);
        res.status(500).json({ error: 'Failed to fetch medications' });
    }
});

// POST /api/pharmacy/check-interactions
router.post('/check-interactions', async (req, res) => {
    try {
        const { medicationIds } = req.body;
        
        if (!Array.isArray(medicationIds) || medicationIds.length < 2) {
            return res.json({ interactions: [], message: 'Need at least 2 medications to check interactions' });
        }
        
        const interactions = await db.checkDrugInteractions(medicationIds);
        
        // Categorize by severity
        const categorized = {
            contraindicated: interactions.filter(i => i.severity === 'contraindicated'),
            major: interactions.filter(i => i.severity === 'major'),
            moderate: interactions.filter(i => i.severity === 'moderate'),
            minor: interactions.filter(i => i.severity === 'minor')
        };
        
        res.json({
            interactions: categorized,
            total: interactions.length,
            hasHighRisk: categorized.contraindicated.length > 0 || categorized.major.length > 0
        });
    } catch (error) {
        console.error('Error checking interactions:', error);
        res.status(500).json({ error: 'Failed to check interactions' });
    }
});

// GET /api/pharmacy/inventory
router.get('/inventory', async (req, res) => {
    try {
        const inventory = await db.getInventory();
        
        // Add low stock alerts
        const withAlerts = inventory.map(item => ({
            ...item,
            isLowStock: item.quantity_on_hand <= item.minimum_stock_level,
            isExpiringSoon: new Date(item.expiration_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }));
        
        res.json(withAlerts);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});

// POST /api/pharmacy/inventory/update
router.post('/inventory/update', async (req, res) => {
    try {
        const { medicationId, quantityChange, notes } = req.body;
        
        if (!medicationId || quantityChange === undefined) {
            return res.status(400).json({ error: 'medicationId and quantityChange are required' });
        }
        
        const updated = await db.updateInventory(medicationId, quantityChange, notes);
        
        if (!updated) {
            return res.status(404).json({ error: 'Medication not found in inventory' });
        }
        
        res.json(updated);
    } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(500).json({ error: 'Failed to update inventory' });
    }
});

// POST /api/pharmacy/dispense
router.post('/dispense', async (req, res) => {
    try {
        const { prescriptionId, pharmacistId, quantityDispensed } = req.body;
        
        // Update prescription status
        await db.query(
            'UPDATE prescriptions SET status = $1, date_filled = CURRENT_TIMESTAMP, pharmacist_id = $2 WHERE id = $3',
            ['filled', pharmacistId, prescriptionId]
        );
        
        // Update inventory
        const prescription = await db.query('SELECT * FROM prescriptions WHERE id = $1', [prescriptionId]);
        if (prescription.rows[0]) {
            await db.updateInventory(prescription.rows[0].medication_id, -quantityDispensed, `Dispensed for prescription ${prescriptionId}`);
        }
        
        res.json({ success: true, message: 'Prescription dispensed successfully' });
    } catch (error) {
        console.error('Error dispensing prescription:', error);
        res.status(500).json({ error: 'Failed to dispense prescription' });
    }
});

module.exports = router;
// POST /api/pharmacy/inventory - Add new medication to inventory
router.post('/inventory', async (req, res) => {
    try {
        const { medication_name, ndc_number, quantity_on_hand, unit_price, minimum_stock_level } = req.body;
        
        const result = await db.query(
            `INSERT INTO inventory (medication_name, ndc_number, quantity_on_hand, unit_price, minimum_stock_level, created_at) 
             VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *`,
            [medication_name, ndc_number, quantity_on_hand, unit_price, minimum_stock_level || 10]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding medication to inventory:', error);
        res.status(500).json({ error: 'Failed to add medication to inventory' });
    }
});

// GET /api/pharmacy/pos/search - Search medications for POS
router.get('/pos/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.length < 2) {
            return res.json([]);
        }
        
        const result = await db.query(
            `SELECT * FROM inventory 
             WHERE LOWER(medication_name) LIKE LOWER($1) 
             OR ndc_number LIKE $1 
             AND quantity_on_hand > 0
             ORDER BY medication_name LIMIT 20`,
            [`%${q}%`]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error searching medications:', error);
        res.status(500).json({ error: 'Failed to search medications' });
    }
});

// POST /api/pharmacy/pos/sale - Process POS sale
router.post('/pos/sale', async (req, res) => {
    try {
        const { items, total, payment_method } = req.body;
        
        // Start transaction
        await db.query('BEGIN');
        
        try {
            // Create sale record
            const saleResult = await db.query(
                `INSERT INTO sales (total_amount, payment_method, sale_date) 
                 VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id`,
                [total, payment_method || 'cash']
            );
            
            const saleId = saleResult.rows[0].id;
            
            // Process each item
            for (const item of items) {
                // Add sale item
                await db.query(
                    `INSERT INTO sale_items (sale_id, medication_id, quantity, unit_price, total_price) 
                     VALUES ($1, $2, $3, $4, $5)`,
                    [saleId, item.medication_id, item.quantity, item.unit_price, item.quantity * item.unit_price]
                );
                
                // Update inventory
                await db.query(
                    `UPDATE inventory SET quantity_on_hand = quantity_on_hand - $1 
                     WHERE id = $2`,
                    [item.quantity, item.medication_id]
                );
            }
            
            await db.query('COMMIT');
            res.json({ success: true, saleId });
            
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
        
    } catch (error) {
        console.error('Error processing sale:', error);
        res.status(500).json({ error: 'Failed to process sale' });
    }
});

// GET /api/pharmacy/reports/daily - Daily sales report
router.get('/reports/daily', async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];
        
        const salesResult = await db.query(
            `SELECT COUNT(*) as transaction_count, SUM(total_amount) as total_sales
             FROM sales 
             WHERE DATE(sale_date) = $1`,
            [targetDate]
        );
        
        const prescriptionsResult = await db.query(
            `SELECT COUNT(*) as prescriptions_filled
             FROM prescriptions 
             WHERE DATE(date_filled) = $1 AND status = 'filled'`,
            [targetDate]
        );
        
        res.json({
            date: targetDate,
            sales: salesResult.rows[0],
            prescriptions: prescriptionsResult.rows[0]
        });
        
    } catch (error) {
        console.error('Error generating daily report:', error);
        res.status(500).json({ error: 'Failed to generate daily report' });
    }
});
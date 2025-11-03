const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const { validateConsultation } = require('../middleware/validation');

// GET /api/consultations
router.get('/', async (req, res) => {
    try {
        const { doctorId, patientId, status } = req.query;
        let consultations = await db.getConsultations(doctorId, patientId);
        
        // Filter by status if provided
        if (status) {
            consultations = consultations.filter(c => c.status === status);
        }
        
        res.json(consultations);
    } catch (error) {
        console.error('Error fetching consultations:', error);
        res.status(500).json({ error: 'Failed to fetch consultations' });
    }
});

// POST /api/consultations
router.post('/', validateConsultation, async (req, res) => {
    try {
        const saved = await db.addConsultation(req.body);
        console.log(`New consultation scheduled: ${saved.id}`);
        res.status(201).json(saved);
    } catch (error) {
        console.error('Error creating consultation:', error);
        res.status(500).json({ error: 'Failed to schedule consultation' });
    }
});

// PUT /api/consultations/:id/status
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes, diagnosis, treatmentPlan } = req.body;
        
        const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        
        let updateQuery = 'UPDATE consultations SET status = $1, updated_at = CURRENT_TIMESTAMP';
        let params = [status];
        let paramCount = 1;
        
        if (notes) {
            paramCount++;
            updateQuery += `, notes = $${paramCount}`;
            params.push(notes);
        }
        
        if (diagnosis) {
            paramCount++;
            updateQuery += `, diagnosis = $${paramCount}`;
            params.push(diagnosis);
        }
        
        if (treatmentPlan) {
            paramCount++;
            updateQuery += `, treatment_plan = $${paramCount}`;
            params.push(treatmentPlan);
        }
        
        updateQuery += ` WHERE id = $${paramCount + 1} RETURNING *`;
        params.push(id);
        
        const result = await db.query(updateQuery, params);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Consultation not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating consultation:', error);
        res.status(500).json({ error: 'Failed to update consultation' });
    }
});

// GET /api/consultations/upcoming
router.get('/upcoming', async (req, res) => {
    try {
        const { doctorId } = req.query;
        
        let query = `
            SELECT c.*, 
                   pat.first_name || ' ' || pat.last_name as patient_name,
                   doc.first_name || ' ' || doc.last_name as doctor_name
            FROM consultations c
            JOIN patients pt ON c.patient_id = pt.id
            JOIN users pat ON pt.user_id = pat.id
            JOIN users doc ON c.doctor_id = doc.id
            WHERE c.scheduled_at > CURRENT_TIMESTAMP 
              AND c.status = 'scheduled'
        `;
        
        const params = [];
        if (doctorId) {
            query += ' AND c.doctor_id = $1';
            params.push(doctorId);
        }
        
        query += ' ORDER BY c.scheduled_at ASC LIMIT 10';
        
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching upcoming consultations:', error);
        res.status(500).json({ error: 'Failed to fetch upcoming consultations' });
    }
});

module.exports = router;
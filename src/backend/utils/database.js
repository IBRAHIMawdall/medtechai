const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

class Database {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
    }

    async query(text, params) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return result;
        } finally {
            client.release();
        }
    }

    // User management
    async findUser(username) {
        const result = await this.query('SELECT * FROM users WHERE username = $1 AND is_active = true', [username]);
        return result.rows[0];
    }

    async findUserById(id) {
        const result = await this.query('SELECT * FROM users WHERE id = $1 AND is_active = true', [id]);
        return result.rows[0];
    }

    async createUser(userData) {
        const { username, email, password, role, firstName, lastName, licenseNumber, phone } = userData;
        const passwordHash = await bcrypt.hash(password, 10);
        
        const result = await this.query(
            `INSERT INTO users (username, email, password_hash, role, first_name, last_name, license_number, phone) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [username, email, passwordHash, role, firstName, lastName, licenseNumber, phone]
        );
        return result.rows[0];
    }

    // Prescription management
    async getPrescriptions(patientId = null) {
        let query = `
            SELECT p.*, m.name as medication_name, m.strength, m.dosage_form,
                   pat.first_name || ' ' || pat.last_name as patient_name,
                   doc.first_name || ' ' || doc.last_name as prescriber_name
            FROM prescriptions p
            JOIN medications m ON p.medication_id = m.id
            JOIN patients pt ON p.patient_id = pt.id
            JOIN users pat ON pt.user_id = pat.id
            JOIN users doc ON p.prescriber_id = doc.id
        `;
        
        const params = [];
        if (patientId) {
            query += ' WHERE p.patient_id = $1';
            params.push(patientId);
        }
        
        query += ' ORDER BY p.created_at DESC';
        
        const result = await this.query(query, params);
        return result.rows;
    }

    async addPrescription(prescriptionData) {
        const { patientId, prescriberId, medicationId, quantity, daysSupply, directions, refills, notes } = prescriptionData;
        
        const result = await this.query(
            `INSERT INTO prescriptions (patient_id, prescriber_id, medication_id, quantity, days_supply, directions, refills_remaining, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [patientId, prescriberId, medicationId, quantity, daysSupply, directions, refills, notes]
        );
        return result.rows[0];
    }

    // Consultation management
    async getConsultations(doctorId = null, patientId = null) {
        let query = `
            SELECT c.*, 
                   pat.first_name || ' ' || pat.last_name as patient_name,
                   doc.first_name || ' ' || doc.last_name as doctor_name
            FROM consultations c
            JOIN patients pt ON c.patient_id = pt.id
            JOIN users pat ON pt.user_id = pat.id
            JOIN users doc ON c.doctor_id = doc.id
            WHERE 1=1
        `;
        
        const params = [];
        let paramCount = 0;
        
        if (doctorId) {
            paramCount++;
            query += ` AND c.doctor_id = $${paramCount}`;
            params.push(doctorId);
        }
        
        if (patientId) {
            paramCount++;
            query += ` AND c.patient_id = $${paramCount}`;
            params.push(patientId);
        }
        
        query += ' ORDER BY c.scheduled_at DESC';
        
        const result = await this.query(query, params);
        return result.rows;
    }

    async addConsultation(consultationData) {
        const { patientId, doctorId, consultationType, scheduledAt, durationMinutes, chiefComplaint } = consultationData;
        
        const result = await this.query(
            `INSERT INTO consultations (patient_id, doctor_id, consultation_type, scheduled_at, duration_minutes, chief_complaint)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [patientId, doctorId, consultationType, scheduledAt, durationMinutes, chiefComplaint]
        );
        return result.rows[0];
    }

    // Medication and interaction management
    async getMedications(searchTerm = null) {
        let query = 'SELECT * FROM medications WHERE is_active = true';
        const params = [];
        
        if (searchTerm) {
            query += ' AND (name ILIKE $1 OR generic_name ILIKE $1)';
            params.push(`%${searchTerm}%`);
        }
        
        query += ' ORDER BY name';
        
        const result = await this.query(query, params);
        return result.rows;
    }

    async checkDrugInteractions(medicationIds) {
        if (medicationIds.length < 2) return [];
        
        const result = await this.query(
            `SELECT di.*, 
                    m1.name as drug_a_name, m2.name as drug_b_name
             FROM drug_interactions di
             JOIN medications m1 ON di.drug_a_id = m1.id
             JOIN medications m2 ON di.drug_b_id = m2.id
             WHERE (di.drug_a_id = ANY($1) AND di.drug_b_id = ANY($1))
                OR (di.drug_b_id = ANY($1) AND di.drug_a_id = ANY($1))`,
            [medicationIds]
        );
        return result.rows;
    }

    // Inventory management
    async getInventory() {
        const result = await this.query(
            `SELECT i.*, m.name as medication_name, m.strength, m.dosage_form
             FROM inventory i
             JOIN medications m ON i.medication_id = m.id
             ORDER BY m.name`
        );
        return result.rows;
    }

    async updateInventory(medicationId, quantityChange, notes = null) {
        const result = await this.query(
            `UPDATE inventory 
             SET quantity_on_hand = quantity_on_hand + $2, updated_at = CURRENT_TIMESTAMP
             WHERE medication_id = $1 
             RETURNING *`,
            [medicationId, quantityChange]
        );
        
        // Log the inventory change
        if (result.rows[0]) {
            await this.query(
                `INSERT INTO audit_log (action, table_name, record_id, new_values)
                 VALUES ('inventory_update', 'inventory', $1, $2)`,
                [result.rows[0].id, JSON.stringify({ quantity_change: quantityChange, notes })]
            );
        }
        
        return result.rows[0];
    }

    async close() {
        await this.pool.end();
    }
}

const db = new Database();

module.exports = db;
// Cerner-Style Pharmacy Management System
class CernerPharmacyService {
    constructor() {
        this.orders = new Map();
        this.patients = new Map();
        this.inventory = new Map();
        this.workQueues = {
            verification: [],
            dispensing: [],
            clinical: [],
            billing: []
        };
    }

    // Order Entry & Verification (PowerChart Integration)
    async processOrder(orderData) {
        const order = {
            orderId: this.generateOrderId(),
            patientMRN: orderData.patientMRN,
            medications: orderData.medications,
            prescriber: orderData.prescriber,
            orderTime: new Date(),
            status: 'pending_verification',
            priority: this.calculatePriority(orderData)
        };

        // Clinical Decision Support
        const cdsResults = await this.runClinicalDecisionSupport(order);
        
        if (cdsResults.alerts.length > 0) {
            order.status = 'clinical_review';
            this.workQueues.clinical.push(order);
        } else {
            order.status = 'ready_to_dispense';
            this.workQueues.dispensing.push(order);
        }

        this.orders.set(order.orderId, order);
        return { orderId: order.orderId, status: order.status, alerts: cdsResults.alerts };
    }

    // Clinical Decision Support Engine
    async runClinicalDecisionSupport(order) {
        const alerts = [];
        const patient = await this.getPatientData(order.patientMRN);

        // Drug-Drug Interactions
        const interactions = await this.checkDrugInteractions(order.medications, patient.currentMeds);
        alerts.push(...interactions);

        // Allergy Checking
        const allergies = this.checkAllergies(order.medications, patient.allergies);
        alerts.push(...allergies);

        // Dosing Guidelines
        const dosing = this.validateDosing(order.medications, patient);
        alerts.push(...dosing);

        // Duplicate Therapy
        const duplicates = this.checkDuplicateTherapy(order.medications, patient.currentMeds);
        alerts.push(...duplicates);

        return { alerts, recommendations: this.generateRecommendations(alerts) };
    }

    // Inventory Management (Supply Chain)
    updateInventory(medication, quantity, action = 'dispense') {
        const item = this.inventory.get(medication.ndc);
        if (!item) return { success: false, error: 'Item not found' };

        if (action === 'dispense') {
            if (item.quantity < quantity) {
                return { success: false, error: 'Insufficient inventory' };
            }
            item.quantity -= quantity;
            item.lastDispensed = new Date();
        }

        // Auto-reorder logic
        if (item.quantity <= item.reorderPoint) {
            this.triggerReorder(item);
        }

        return { success: true, remainingQuantity: item.quantity };
    }

    // Workflow Management
    getWorkQueue(queueType, pharmacistId) {
        const queue = this.workQueues[queueType] || [];
        return queue.filter(order => 
            !order.assignedTo || order.assignedTo === pharmacistId
        ).sort((a, b) => {
            // Priority sorting: STAT > Urgent > Routine
            const priorityOrder = { 'STAT': 3, 'Urgent': 2, 'Routine': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    // Dispensing Workflow
    async dispenseOrder(orderId, pharmacistId) {
        const order = this.orders.get(orderId);
        if (!order) return { success: false, error: 'Order not found' };

        // Final verification
        const verification = await this.finalVerification(order);
        if (!verification.passed) {
            return { success: false, errors: verification.errors };
        }

        // Update inventory
        for (const med of order.medications) {
            const inventoryUpdate = this.updateInventory(med, med.quantity);
            if (!inventoryUpdate.success) {
                return { success: false, error: inventoryUpdate.error };
            }
        }

        // Generate labels
        const labels = this.generateLabels(order);

        // Update order status
        order.status = 'dispensed';
        order.dispensedBy = pharmacistId;
        order.dispensedTime = new Date();

        // Move to billing queue
        this.workQueues.billing.push(order);

        return { 
            success: true, 
            labels, 
            dispensingRecord: this.createDispensingRecord(order) 
        };
    }

    // Patient Profile Integration
    async getPatientData(mrn) {
        // Simulate EMR integration
        return {
            mrn,
            demographics: { age: 65, weight: 70, height: 170 },
            allergies: ['penicillin', 'sulfa'],
            currentMeds: ['metformin 500mg BID', 'lisinopril 10mg daily'],
            labValues: { creatinine: 1.2, eGFR: 60 },
            conditions: ['diabetes', 'hypertension'],
            insurance: { plan: 'Medicare Part D', copay: 10 }
        };
    }

    // Regulatory Compliance
    checkControlledSubstance(medication) {
        const controlled = {
            'oxycodone': { schedule: 'II', dea: true },
            'tramadol': { schedule: 'IV', dea: true },
            'alprazolam': { schedule: 'IV', dea: true }
        };

        const drug = controlled[medication.name.toLowerCase()];
        if (drug) {
            return {
                isControlled: true,
                schedule: drug.schedule,
                requiresDEA: drug.dea,
                additionalChecks: ['prescriber_dea', 'patient_id', 'quantity_limits']
            };
        }

        return { isControlled: false };
    }

    // Insurance & Billing Integration
    async processBilling(order) {
        const patient = await this.getPatientData(order.patientMRN);
        const billingData = {
            orderId: order.orderId,
            patientMRN: order.patientMRN,
            insurance: patient.insurance,
            medications: order.medications.map(med => ({
                ndc: med.ndc,
                quantity: med.quantity,
                daysSupply: med.daysSupply,
                awp: med.awp,
                copay: this.calculateCopay(med, patient.insurance)
            })),
            totalCost: this.calculateTotalCost(order.medications),
            submissionTime: new Date()
        };

        // Submit to insurance
        const claim = await this.submitInsuranceClaim(billingData);
        return claim;
    }

    // Reporting & Analytics
    generatePharmacyReport(dateRange) {
        return {
            dispensingVolume: this.getDispensingVolume(dateRange),
            interventions: this.getClinicalInterventions(dateRange),
            inventoryTurnover: this.getInventoryMetrics(dateRange),
            compliance: this.getComplianceMetrics(dateRange),
            financials: this.getFinancialMetrics(dateRange)
        };
    }

    // Helper Methods
    generateOrderId() {
        return 'RX' + Date.now() + Math.random().toString(36).substr(2, 5);
    }

    calculatePriority(orderData) {
        if (orderData.stat) return 'STAT';
        if (orderData.urgent || this.isHighRiskMedication(orderData.medications)) return 'Urgent';
        return 'Routine';
    }

    isHighRiskMedication(medications) {
        const highRisk = ['warfarin', 'insulin', 'digoxin', 'lithium'];
        return medications.some(med => 
            highRisk.includes(med.name.toLowerCase())
        );
    }
}

module.exports = new CernerPharmacyService();
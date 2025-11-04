const medicalData = require('../data/medical-data');

class PharmacyService {
    constructor() {
        this.inventory = new Map();
        this.dispensingQueue = [];
        this.aiMetrics = {
            accuracy: 99.7,
            errorRate: 0.02,
            responseTime: 847,
            monthlySavings: 12400
        };
        this.initializeInventory();
    }

    initializeInventory() {
        const medications = [
            { name: 'metformin', stock: 450, reorderLevel: 100, expiryDays: 180, cost: 12.50 },
            { name: 'lisinopril', stock: 320, reorderLevel: 80, expiryDays: 365, cost: 8.75 },
            { name: 'warfarin', stock: 47, reorderLevel: 50, expiryDays: 2, cost: 25.00 },
            { name: 'insulin', stock: 180, reorderLevel: 40, expiryDays: 90, cost: 45.00 },
            { name: 'simvastatin', stock: 280, reorderLevel: 75, expiryDays: 240, cost: 15.25 }
        ];

        medications.forEach(med => {
            this.inventory.set(med.name, med);
        });
    }

    // AI Predictive Analytics
    async runPredictiveAnalysis() {
        const predictions = [];
        
        for (const [name, med] of this.inventory) {
            const prediction = this.predictDemand(med);
            predictions.push({
                medication: name,
                currentStock: med.stock,
                predictedDemand: prediction.demand,
                reorderRecommendation: prediction.reorder,
                priority: prediction.priority,
                daysUntilStockout: prediction.daysUntilStockout
            });
        }

        return {
            predictions,
            totalItems: Array.from(this.inventory.values()).reduce((sum, med) => sum + med.stock, 0),
            criticalItems: predictions.filter(p => p.priority === 'high').length,
            optimizationSavings: this.calculateOptimizationSavings(predictions)
        };
    }

    predictDemand(medication) {
        const baseConsumption = this.getHistoricalConsumption(medication.name);
        const seasonalFactor = this.getSeasonalFactor(medication.name);
        const trendFactor = this.getTrendFactor(medication.name);
        
        const predictedDemand = Math.round(baseConsumption * seasonalFactor * trendFactor);
        const daysUntilStockout = Math.floor(medication.stock / (predictedDemand / 30));
        
        let priority = 'low';
        let reorder = false;
        
        if (daysUntilStockout <= 3 || medication.stock <= medication.reorderLevel) {
            priority = 'high';
            reorder = true;
        } else if (daysUntilStockout <= 7) {
            priority = 'medium';
            reorder = true;
        }

        return {
            demand: predictedDemand,
            reorder,
            priority,
            daysUntilStockout
        };
    }

    getHistoricalConsumption(medication) {
        const baseRates = {
            'metformin': 45,
            'lisinopril': 32,
            'warfarin': 8,
            'insulin': 25,
            'simvastatin': 38
        };
        return baseRates[medication] || 20;
    }

    getSeasonalFactor(medication) {
        const currentMonth = new Date().getMonth();
        const seasonalFactors = {
            'metformin': [1.1, 1.0, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.0, 0.95, 1.2, 1.3],
            'lisinopril': [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
            'warfarin': [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
            'insulin': [1.2, 1.1, 1.0, 0.95, 1.0, 1.05, 1.1, 1.0, 0.95, 1.0, 1.15, 1.25],
            'simvastatin': [1.1, 1.0, 0.95, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.05, 1.1, 1.2]
        };
        return seasonalFactors[medication]?.[currentMonth] || 1.0;
    }

    getTrendFactor(medication) {
        // Simulate AI trend analysis
        const trends = {
            'metformin': 1.05, // Increasing diabetes prevalence
            'lisinopril': 1.02, // Stable hypertension treatment
            'warfarin': 0.95, // Declining due to newer anticoagulants
            'insulin': 1.08, // Growing diabetes population
            'simvastatin': 1.03 // Increasing cardiovascular awareness
        };
        return trends[medication] || 1.0;
    }

    calculateOptimizationSavings(predictions) {
        return predictions.reduce((savings, pred) => {
            if (pred.reorderRecommendation && pred.priority === 'high') {
                return savings + (pred.predictedDemand * 0.15); // 15% savings from optimal timing
            }
            return savings;
        }, 0);
    }

    // Smart Dispensing Logic
    async processDispensing(prescription) {
        const { patientId, medications, prescriberId } = prescription;
        
        // AI-powered verification steps
        const verificationResults = {
            drugInteractions: await this.checkInteractions(medications),
            dosageVerification: this.verifyDosages(medications),
            allergyCheck: await this.checkAllergies(patientId, medications),
            inventoryCheck: this.checkInventoryAvailability(medications),
            complianceCheck: this.checkRegulatory(medications)
        };

        const dispensingDecision = this.makeDispensingDecision(verificationResults);
        
        if (dispensingDecision.approved) {
            this.updateInventory(medications);
            this.logDispensing(prescription, verificationResults);
        }

        return {
            approved: dispensingDecision.approved,
            alerts: dispensingDecision.alerts,
            recommendations: dispensingDecision.recommendations,
            verificationResults
        };
    }

    async checkInteractions(medications) {
        const medicationNames = medications.map(m => m.name);
        const interactions = [];
        
        for (let i = 0; i < medicationNames.length; i++) {
            for (let j = i + 1; j < medicationNames.length; j++) {
                const drug1 = medicationNames[i].toLowerCase();
                const drug2 = medicationNames[j].toLowerCase();
                
                if (medicalData.drugInteractions[drug1]?.[drug2]) {
                    interactions.push({
                        drugs: [drug1, drug2],
                        ...medicalData.drugInteractions[drug1][drug2]
                    });
                }
            }
        }
        
        return interactions;
    }

    verifyDosages(medications) {
        return medications.map(med => {
            const dosageCheck = this.validateDosage(med.name, med.dosage, med.frequency);
            return {
                medication: med.name,
                prescribed: `${med.dosage} ${med.frequency}`,
                status: dosageCheck.valid ? 'valid' : 'warning',
                recommendation: dosageCheck.recommendation
            };
        });
    }

    validateDosage(medication, dosage, frequency) {
        const dosageRanges = {
            'metformin': { min: 500, max: 2000, unit: 'mg', maxDaily: 2000 },
            'lisinopril': { min: 2.5, max: 40, unit: 'mg', maxDaily: 40 },
            'warfarin': { min: 1, max: 10, unit: 'mg', maxDaily: 10 },
            'insulin': { min: 10, max: 100, unit: 'units', maxDaily: 200 },
            'simvastatin': { min: 10, max: 80, unit: 'mg', maxDaily: 80 }
        };

        const range = dosageRanges[medication.toLowerCase()];
        if (!range) return { valid: true, recommendation: 'Standard dosing' };

        const dose = parseFloat(dosage);
        const dailyDose = this.calculateDailyDose(dose, frequency);

        if (dailyDose > range.maxDaily) {
            return {
                valid: false,
                recommendation: `Exceeds maximum daily dose of ${range.maxDaily}${range.unit}`
            };
        }

        if (dose < range.min || dose > range.max) {
            return {
                valid: false,
                recommendation: `Recommended range: ${range.min}-${range.max}${range.unit}`
            };
        }

        return { valid: true, recommendation: 'Within therapeutic range' };
    }

    calculateDailyDose(dose, frequency) {
        const frequencyMultipliers = {
            'once daily': 1,
            'twice daily': 2,
            'three times daily': 3,
            'four times daily': 4,
            'every 6 hours': 4,
            'every 8 hours': 3,
            'every 12 hours': 2
        };
        
        return dose * (frequencyMultipliers[frequency.toLowerCase()] || 1);
    }

    async checkAllergies(patientId, medications) {
        // Simulate patient allergy database lookup
        const patientAllergies = ['penicillin', 'sulfa']; // Mock data
        
        const allergyAlerts = medications.filter(med => 
            patientAllergies.some(allergy => 
                med.name.toLowerCase().includes(allergy.toLowerCase())
            )
        );

        return {
            hasAllergies: allergyAlerts.length > 0,
            alerts: allergyAlerts.map(med => ({
                medication: med.name,
                allergen: 'Known patient allergy',
                severity: 'high'
            }))
        };
    }

    checkInventoryAvailability(medications) {
        return medications.map(med => {
            const stock = this.inventory.get(med.name.toLowerCase());
            const available = stock ? stock.stock >= med.quantity : false;
            
            return {
                medication: med.name,
                requested: med.quantity,
                available: stock?.stock || 0,
                sufficient: available,
                status: available ? 'available' : 'insufficient'
            };
        });
    }

    checkRegulatory(medications) {
        const controlledSubstances = ['oxycodone', 'morphine', 'fentanyl', 'adderall'];
        
        return medications.map(med => {
            const isControlled = controlledSubstances.includes(med.name.toLowerCase());
            return {
                medication: med.name,
                controlled: isControlled,
                requiresVerification: isControlled,
                status: 'compliant'
            };
        });
    }

    makeDispensingDecision(verificationResults) {
        const alerts = [];
        const recommendations = [];
        let approved = true;

        // Check for critical interactions
        const highSeverityInteractions = verificationResults.drugInteractions.filter(
            interaction => interaction.severity === 'high'
        );
        
        if (highSeverityInteractions.length > 0) {
            approved = false;
            alerts.push({
                type: 'critical',
                message: 'High severity drug interactions detected',
                action: 'Pharmacist consultation required'
            });
        }

        // Check allergies
        if (verificationResults.allergyCheck.hasAllergies) {
            approved = false;
            alerts.push({
                type: 'critical',
                message: 'Patient allergy detected',
                action: 'Alternative medication required'
            });
        }

        // Check inventory
        const insufficientStock = verificationResults.inventoryCheck.filter(
            item => !item.sufficient
        );
        
        if (insufficientStock.length > 0) {
            approved = false;
            alerts.push({
                type: 'warning',
                message: 'Insufficient inventory',
                action: 'Partial fill or alternative suggested'
            });
        }

        return { approved, alerts, recommendations };
    }

    updateInventory(medications) {
        medications.forEach(med => {
            const stock = this.inventory.get(med.name.toLowerCase());
            if (stock) {
                stock.stock -= med.quantity;
                this.inventory.set(med.name.toLowerCase(), stock);
            }
        });
    }

    logDispensing(prescription, verificationResults) {
        // Log dispensing event for audit trail
        console.log('Dispensing logged:', {
            timestamp: new Date().toISOString(),
            prescription: prescription.id,
            patient: prescription.patientId,
            verification: verificationResults
        });
    }

    // Real-time monitoring
    getSystemHealth() {
        return {
            status: 'operational',
            aiAccuracy: this.aiMetrics.accuracy,
            errorRate: this.aiMetrics.errorRate,
            responseTime: this.aiMetrics.responseTime,
            uptime: '99.9%',
            lastUpdate: new Date().toISOString()
        };
    }

    generateAlerts() {
        const alerts = [];
        
        // Check for expiring medications
        for (const [name, med] of this.inventory) {
            if (med.expiryDays <= 7) {
                alerts.push({
                    type: med.expiryDays <= 2 ? 'high' : 'medium',
                    message: `${name} expires in ${med.expiryDays} days - ${med.stock} units affected`,
                    action: 'Review inventory and consider disposal'
                });
            }
        }

        return alerts;
    }
}

module.exports = new PharmacyService();
// Comprehensive Medical Demo Data
const drugInteractions = {
    // Cardiovascular
    'warfarin': {
        'aspirin': { severity: 'high', description: 'Increased bleeding risk - monitor INR closely' },
        'ibuprofen': { severity: 'high', description: 'Increased bleeding and reduced warfarin effectiveness' },
        'amiodarone': { severity: 'high', description: 'Significantly increases warfarin effect' },
        'simvastatin': { severity: 'medium', description: 'May increase bleeding risk' }
    },
    'lisinopril': {
        'ibuprofen': { severity: 'medium', description: 'NSAIDs reduce ACE inhibitor effectiveness' },
        'potassium': { severity: 'medium', description: 'Risk of hyperkalemia' },
        'lithium': { severity: 'high', description: 'Increased lithium toxicity risk' }
    },
    'metoprolol': {
        'verapamil': { severity: 'high', description: 'Risk of severe bradycardia and heart block' },
        'insulin': { severity: 'medium', description: 'May mask hypoglycemia symptoms' }
    },
    
    // Diabetes
    'metformin': {
        'alcohol': { severity: 'medium', description: 'Increased lactic acidosis risk' },
        'contrast': { severity: 'high', description: 'Hold before contrast procedures' }
    },
    'insulin': {
        'metoprolol': { severity: 'medium', description: 'Beta-blockers may mask hypoglycemia' },
        'prednisone': { severity: 'medium', description: 'Steroids increase blood glucose' }
    },
    
    // Antibiotics
    'ciprofloxacin': {
        'warfarin': { severity: 'high', description: 'Significantly increases warfarin effect' },
        'theophylline': { severity: 'high', description: 'Increases theophylline toxicity' }
    },
    
    // Pain Management
    'tramadol': {
        'sertraline': { severity: 'high', description: 'Increased serotonin syndrome risk' },
        'warfarin': { severity: 'medium', description: 'May increase bleeding risk' }
    }
};

const labReferenceRanges = {
    'glucose': { min: 70, max: 100, unit: 'mg/dL', critical_low: 50, critical_high: 400 },
    'hemoglobin': { min: 12, max: 16, unit: 'g/dL', critical_low: 7, critical_high: 20 },
    'creatinine': { min: 0.6, max: 1.2, unit: 'mg/dL', critical_low: 0.3, critical_high: 5.0 },
    'cholesterol': { min: 0, max: 200, unit: 'mg/dL', critical_high: 300 },
    'triglycerides': { min: 0, max: 150, unit: 'mg/dL', critical_high: 500 },
    'bun': { min: 7, max: 20, unit: 'mg/dL', critical_high: 100 },
    'sodium': { min: 136, max: 145, unit: 'mEq/L', critical_low: 120, critical_high: 160 },
    'potassium': { min: 3.5, max: 5.0, unit: 'mEq/L', critical_low: 2.5, critical_high: 6.5 },
    'wbc': { min: 4.5, max: 11.0, unit: '10³/μL', critical_low: 1.0, critical_high: 50.0 },
    'platelets': { min: 150, max: 450, unit: '10³/μL', critical_low: 50, critical_high: 1000 }
};

module.exports = {
    drugInteractions,
    labReferenceRanges
};
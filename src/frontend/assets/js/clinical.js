// Cerner Clinical Decision Support
const ClinicalSupport = {
    drugDatabase: {
        'Metformin 500mg': { class: 'Antidiabetic', contraindications: ['Kidney disease'], interactions: ['Alcohol'] },
        'Lisinopril 10mg': { class: 'ACE Inhibitor', contraindications: ['Pregnancy'], interactions: ['NSAIDs'] },
        'Atorvastatin 20mg': { class: 'Statin', contraindications: ['Liver disease'], interactions: ['Grapefruit'] },
        'Oxycodone 5mg': { class: 'Opioid', contraindications: ['Respiratory depression'], interactions: ['Benzodiazepines'] }
    },
    
    checkDrugInteractions(medications) {
        const interactions = [];
        for (let i = 0; i < medications.length; i++) {
            for (let j = i + 1; j < medications.length; j++) {
                const interaction = this.findInteraction(medications[i], medications[j]);
                if (interaction) {
                    interactions.push(interaction);
                }
            }
        }
        return interactions;
    },
    
    findInteraction(drug1, drug2) {
        // Simplified interaction checking
        const knownInteractions = {
            'Oxycodone 5mg_Alprazolam 1mg': 'Severe: Respiratory depression risk',
            'Metformin 500mg_Lisinopril 10mg': 'Moderate: Monitor blood glucose'
        };
        
        const key1 = `${drug1}_${drug2}`;
        const key2 = `${drug2}_${drug1}`;
        
        return knownInteractions[key1] || knownInteractions[key2];
    },
    
    validatePrescription(prescription) {
        const warnings = [];
        const drug = this.drugDatabase[prescription.medication];
        
        if (drug) {
            // Check for contraindications
            if (drug.contraindications.length > 0) {
                warnings.push(`Check for contraindications: ${drug.contraindications.join(', ')}`);
            }
            
            // Check controlled substance
            if (drug.class === 'Opioid') {
                warnings.push('Controlled substance - verify DEA number');
            }
        }
        
        return warnings;
    }
};
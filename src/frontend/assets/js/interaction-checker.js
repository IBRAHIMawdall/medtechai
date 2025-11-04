// Cerner Drug Interaction Checker
const InteractionChecker = {
    interactions: {
        'severe': [
            { drugs: ['Oxycodone', 'Alprazolam'], warning: 'Severe respiratory depression risk', action: 'Contraindicated' },
            { drugs: ['Warfarin', 'Aspirin'], warning: 'Increased bleeding risk', action: 'Monitor INR closely' }
        ],
        'moderate': [
            { drugs: ['Metformin', 'Lisinopril'], warning: 'Enhanced hypoglycemic effect', action: 'Monitor blood glucose' },
            { drugs: ['Atorvastatin', 'Diltiazem'], warning: 'Increased statin levels', action: 'Consider dose reduction' }
        ],
        'minor': [
            { drugs: ['Lisinopril', 'Ibuprofen'], warning: 'Reduced antihypertensive effect', action: 'Monitor blood pressure' }
        ]
    },
    
    checkInteractions(medications) {
        const results = [];
        
        for (const severity in this.interactions) {
            this.interactions[severity].forEach(interaction => {
                const matchingDrugs = medications.filter(med => 
                    interaction.drugs.some(drug => med.toLowerCase().includes(drug.toLowerCase()))
                );
                
                if (matchingDrugs.length >= 2) {
                    results.push({
                        severity: severity,
                        drugs: matchingDrugs,
                        warning: interaction.warning,
                        action: interaction.action
                    });
                }
            });
        }
        
        return results;
    },
    
    getSeverityColor(severity) {
        const colors = {
            'severe': '#e53e3e',
            'moderate': '#d69e2e',
            'minor': '#38a169'
        };
        return colors[severity] || '#718096';
    },
    
    formatInteractionAlert(interaction) {
        return `
            <div style="border-left: 4px solid ${this.getSeverityColor(interaction.severity)}; padding: 10px; margin: 10px 0; background: #f7fafc;">
                <strong style="color: ${this.getSeverityColor(interaction.severity)}; text-transform: uppercase;">${interaction.severity} Interaction</strong>
                <p><strong>Drugs:</strong> ${interaction.drugs.join(', ')}</p>
                <p><strong>Warning:</strong> ${interaction.warning}</p>
                <p><strong>Action:</strong> ${interaction.action}</p>
            </div>
        `;
    }
};
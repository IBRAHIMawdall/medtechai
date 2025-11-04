// Cerner Configuration
const CernerConfig = {
    system: {
        name: 'Cerner PowerChart Pharmacy',
        version: '2024.1',
        environment: 'Production'
    },
    
    pharmacy: {
        name: 'MedTechAI Pharmacy',
        location: 'Main Campus',
        timezone: 'America/New_York'
    },
    
    features: {
        drugInteractionChecking: true,
        inventoryTracking: true,
        queueManagement: true,
        reportGeneration: true,
        auditLogging: true
    },
    
    alerts: {
        criticalInteractions: true,
        lowInventory: true,
        expiredMedications: true,
        controlledSubstances: true
    }
};
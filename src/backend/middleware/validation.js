const validatePrescription = (req, res, next) => {
    const { patientName, medication, quantity, prescriber } = req.body;
    
    if (!patientName || !medication || !quantity || !prescriber) {
        return res.status(400).json({ 
            error: 'Missing required fields: patientName, medication, quantity, prescriber' 
        });
    }
    
    if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }
    
    next();
};

const validateConsultation = (req, res, next) => {
    const { patientName, phone, consultationType, appointmentTime } = req.body;
    
    if (!patientName || !phone || !consultationType || !appointmentTime) {
        return res.status(400).json({ 
            error: 'Missing required fields: patientName, phone, consultationType, appointmentTime' 
        });
    }
    
    const validTypes = ['medication-review', 'therapy-management', 'drug-counseling', 'follow-up'];
    if (!validTypes.includes(consultationType)) {
        return res.status(400).json({ error: 'Invalid consultation type' });
    }
    
    next();
};

module.exports = { validatePrescription, validateConsultation };
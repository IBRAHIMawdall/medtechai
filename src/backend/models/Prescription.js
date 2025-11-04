class Prescription {
    constructor(data) {
        this.id = data.id || 'RX' + Date.now();
        this.patientName = data.patientName;
        this.patientDOB = data.patientDOB;
        this.medication = data.medication;
        this.quantity = data.quantity;
        this.daysSupply = data.daysSupply;
        this.prescriber = data.prescriber;
        this.status = data.status || 'pending';
        this.priority = data.priority || 'normal';
        this.timestamp = data.timestamp || new Date().toISOString();
        this.interactions = data.interactions || [];
    }

    static validate(data) {
        const required = ['patientName', 'medication', 'quantity', 'prescriber'];
        for (const field of required) {
            if (!data[field]) {
                throw new Error(`${field} is required`);
            }
        }
        return true;
    }
}

module.exports = Prescription;
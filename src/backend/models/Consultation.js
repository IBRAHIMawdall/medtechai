class Consultation {
    constructor(data) {
        this.id = data.id || 'CONS' + Date.now();
        this.patientName = data.patientName;
        this.phone = data.phone;
        this.consultationType = data.consultationType;
        this.appointmentTime = data.appointmentTime;
        this.status = data.status || 'scheduled';
        this.notes = data.notes || '';
        this.medications = data.medications || [];
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    static validate(data) {
        const required = ['patientName', 'phone', 'consultationType', 'appointmentTime'];
        for (const field of required) {
            if (!data[field]) {
                throw new Error(`${field} is required`);
            }
        }
        return true;
    }
}

module.exports = Consultation;
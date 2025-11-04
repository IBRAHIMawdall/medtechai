// Cerner Authentication Module
const CernerAuth = {
    currentUser: null,
    
    init() {
        this.currentUser = JSON.parse(localStorage.getItem('cerner_user')) || {
            id: 'PHARM001',
            name: 'Dr. Bu Ibrahim',
            role: 'PharmD',
            department: 'Pharmacy',
            permissions: ['prescriptions', 'interactions', 'queue', 'reports']
        };
        localStorage.setItem('cerner_user', JSON.stringify(this.currentUser));
    },
    
    hasPermission(permission) {
        return this.currentUser && this.currentUser.permissions.includes(permission);
    },
    
    getCurrentUser() {
        return this.currentUser;
    }
};

// Initialize on load
CernerAuth.init();
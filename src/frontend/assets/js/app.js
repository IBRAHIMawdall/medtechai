// MedTechAI Frontend Application
class MedTechAI {
    constructor() {
        this.apiBaseUrl = 'https://medtechai.onrender.com/api';
        this.currentUser = null;
        this.authToken = localStorage.getItem('authToken');
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.initializeComponents();
        await this.loadUserData();
    }

    // Authentication Methods
    async checkAuthStatus() {
        if (this.authToken) {
            try {
                const response = await this.apiCall('/users/profile', 'GET');
                if (response.success) {
                    this.currentUser = response.data;
                    this.updateUIForAuthenticatedUser();
                } else {
                    this.logout();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                this.logout();
            }
        }
    }

    async login(email, password) {
        try {
            const response = await this.apiCall('/auth/login', 'POST', {
                email,
                password
            });

            if (response.success) {
                this.authToken = response.data.token;
                this.currentUser = response.data.user;
                localStorage.setItem('authToken', this.authToken);
                this.updateUIForAuthenticatedUser();
                this.showNotification('Login successful!', 'success');
                return true;
            } else {
                this.showNotification(response.message || 'Login failed', 'error');
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Login failed. Please try again.', 'error');
            return false;
        }
    }

    async register(userData) {
        try {
            const response = await this.apiCall('/auth/register', 'POST', userData);

            if (response.success) {
                this.showNotification('Registration successful! Please check your email for verification.', 'success');
                return true;
            } else {
                this.showNotification(response.message || 'Registration failed', 'error');
                return false;
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification('Registration failed. Please try again.', 'error');
            return false;
        }
    }

    logout() {
        this.authToken = null;
        this.currentUser = null;
        localStorage.removeItem('authToken');
        this.updateUIForUnauthenticatedUser();
        this.showNotification('Logged out successfully', 'info');
    }

    // API Communication
    async apiCall(endpoint, method = 'GET', data = null) {
        const url = `${this.apiBaseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (this.authToken) {
            options.headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        return await response.json();
    }

    // Lab Results Management
    async uploadLabResult(file, metadata) {
        try {
            const formData = new FormData();
            formData.append('labResult', file);
            formData.append('testType', metadata.testType);
            formData.append('testDate', metadata.testDate);
            formData.append('notes', metadata.notes || '');

            const response = await fetch(`${this.apiBaseUrl}/lab/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                this.showNotification('Lab result uploaded successfully!', 'success');
                this.refreshLabResults();
                return true;
            } else {
                this.showNotification(result.message || 'Upload failed', 'error');
                return false;
            }
        } catch (error) {
            console.error('Lab upload error:', error);
            this.showNotification('Upload failed. Please try again.', 'error');
            return false;
        }
    }

    async getLabResults() {
        try {
            const response = await this.apiCall('/lab/results');
            if (response.success) {
                return response.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching lab results:', error);
            return [];
        }
    }

    async getAIInsights() {
        try {
            const response = await this.apiCall('/ai/insights');
            if (response.success) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching AI insights:', error);
            return null;
        }
    }

    // Prescription Management
    async getPrescriptions() {
        try {
            const response = await this.apiCall('/pharmacy');
            if (response.success) {
                return response.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            return [];
        }
    }

    async checkDrugInteractions(medications) {
        try {
            const response = await this.apiCall('/pharmacy/check-interactions', 'POST', {
                medications
            });
            if (response.success) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Error checking drug interactions:', error);
            return null;
        }
    }

    // AI Services
    async getSymptomAnalysis(symptoms, patientInfo) {
        try {
            const response = await this.apiCall('/ai/symptom-checker', 'POST', {
                symptoms,
                age: patientInfo.age,
                gender: patientInfo.gender
            });
            if (response.success) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Error analyzing symptoms:', error);
            return null;
        }
    }

    async getRiskAssessment() {
        try {
            const response = await this.apiCall('/ai/risk-assessment');
            if (response.success) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Error getting risk assessment:', error);
            return null;
        }
    }

    // UI Management
    updateUIForAuthenticatedUser() {
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.querySelector('.user-menu');
        
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            const userName = userMenu.querySelector('.user-name');
            if (userName && this.currentUser) {
                userName.textContent = this.currentUser.firstName || this.currentUser.email;
            }
        }

        // Show dashboard link
        this.showDashboardAccess();
    }

    updateUIForUnauthenticatedUser() {
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.querySelector('.user-menu');
        
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';

        // Hide dashboard access
        this.hideDashboardAccess();
    }

    showDashboardAccess() {
        const nav = document.querySelector('.nav-list');
        if (nav && !nav.querySelector('.dashboard-link')) {
            const dashboardItem = document.createElement('li');
            dashboardItem.innerHTML = '<a class="nav-link dashboard-link" href="#dashboard" data-analytics="nav-dashboard">Dashboard</a>';
            nav.appendChild(dashboardItem);
        }
    }

    hideDashboardAccess() {
        const dashboardLink = document.querySelector('.dashboard-link');
        if (dashboardLink) {
            dashboardLink.parentElement.remove();
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Event Listeners
    setupEventListeners() {
        // Login form
        document.addEventListener('submit', async (e) => {
            if (e.target.id === 'loginForm') {
                e.preventDefault();
                const formData = new FormData(e.target);
                const email = formData.get('email');
                const password = formData.get('password');
                
                if (await this.login(email, password)) {
                    this.closeModal('loginModal');
                }
            }
        });

        // Registration form
        document.addEventListener('submit', async (e) => {
            if (e.target.id === 'registerForm') {
                e.preventDefault();
                const formData = new FormData(e.target);
                const userData = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    dateOfBirth: formData.get('dateOfBirth'),
                    gender: formData.get('gender'),
                    phone: formData.get('phone')
                };
                
                if (await this.register(userData)) {
                    this.closeModal('registerModal');
                }
            }
        });

        // Lab upload form
        document.addEventListener('submit', async (e) => {
            if (e.target.id === 'labUploadForm') {
                e.preventDefault();
                const formData = new FormData(e.target);
                const file = formData.get('labFile');
                const metadata = {
                    testType: formData.get('testType'),
                    testDate: formData.get('testDate'),
                    notes: formData.get('notes')
                };
                
                if (file && await this.uploadLabResult(file, metadata)) {
                    this.closeModal('labUploadModal');
                    e.target.reset();
                }
            }
        });

        // Logout button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('logout-btn')) {
                this.logout();
            }
        });

        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-overlay')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            }
        });

        // Dashboard navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dashboard-link')) {
                e.preventDefault();
                this.showDashboard();
            }
        });
    }

    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Dashboard
    async showDashboard() {
        if (!this.currentUser) {
            this.showNotification('Please log in to access the dashboard', 'warning');
            return;
        }

        // Create dashboard content
        const dashboardHTML = await this.generateDashboardHTML();
        
        // Show dashboard in modal or navigate to dashboard page
        this.showDashboardModal(dashboardHTML);
    }

    async generateDashboardHTML() {
        const labResults = await this.getLabResults();
        const prescriptions = await this.getPrescriptions();
        const aiInsights = await this.getAIInsights();

        return `
            <div class="dashboard-content">
                <h2>Health Dashboard</h2>
                
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Recent Lab Results</h3>
                        <div class="lab-results-list">
                            ${labResults.slice(0, 3).map(result => `
                                <div class="lab-result-item">
                                    <span class="test-type">${result.testType}</span>
                                    <span class="test-date">${new Date(result.testDate).toLocaleDateString()}</span>
                                    <span class="test-status status-${result.status}">${result.status}</span>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-outline" onclick="medTechAI.openModal('labUploadModal')">Upload New Result</button>
                    </div>

                    <div class="dashboard-card">
                        <h3>Current Prescriptions</h3>
                        <div class="prescriptions-list">
                            ${prescriptions.slice(0, 3).map(prescription => `
                                <div class="prescription-item">
                                    <span class="medication-name">${prescription.medications[0]?.name || 'N/A'}</span>
                                    <span class="prescription-status status-${prescription.status}">${prescription.status}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="dashboard-card">
                        <h3>AI Health Insights</h3>
                        <div class="ai-insights">
                            ${aiInsights ? `
                                <p class="insight-summary">${aiInsights.summary || 'No insights available'}</p>
                                <div class="health-score">
                                    <span class="score-label">Health Score:</span>
                                    <span class="score-value">${aiInsights.healthScore || 'N/A'}/100</span>
                                </div>
                            ` : '<p>AI insights will appear here after uploading lab results.</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showDashboardModal(content) {
        // Create dashboard modal if it doesn't exist
        let dashboardModal = document.getElementById('dashboardModal');
        if (!dashboardModal) {
            dashboardModal = document.createElement('div');
            dashboardModal.id = 'dashboardModal';
            dashboardModal.className = 'modal';
            dashboardModal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content dashboard-modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="dashboard-container"></div>
                </div>
            `;
            document.body.appendChild(dashboardModal);
        }

        // Update content and show
        dashboardModal.querySelector('.dashboard-container').innerHTML = content;
        this.openModal('dashboardModal');
    }

    // Component Initialization
    initializeComponents() {
        this.createAuthButtons();
        this.createModals();
        this.addNotificationStyles();
    }

    createAuthButtons() {
        const header = document.querySelector('.header-content');
        if (header && !header.querySelector('.auth-buttons')) {
            const authButtonsHTML = `
                <div class="auth-buttons" style="display: flex; gap: 10px;">
                    <button class="btn btn-outline" onclick="medTechAI.openModal('loginModal')">Login</button>
                    <button class="btn btn-primary" onclick="medTechAI.openModal('registerModal')">Sign Up</button>
                </div>
                <div class="user-menu" style="display: none; align-items: center; gap: 10px;">
                    <span class="user-name"></span>
                    <button class="btn btn-outline logout-btn">Logout</button>
                </div>
            `;
            
            const themeToggle = header.querySelector('#theme-toggle');
            if (themeToggle) {
                themeToggle.insertAdjacentHTML('afterend', authButtonsHTML);
            } else {
                header.insertAdjacentHTML('beforeend', authButtonsHTML);
            }
        }
    }

    createModals() {
        if (!document.getElementById('loginModal')) {
            document.body.insertAdjacentHTML('beforeend', this.getLoginModalHTML());
        }
        if (!document.getElementById('registerModal')) {
            document.body.insertAdjacentHTML('beforeend', this.getRegisterModalHTML());
        }
        if (!document.getElementById('labUploadModal')) {
            document.body.insertAdjacentHTML('beforeend', this.getLabUploadModalHTML());
        }
    }

    getLoginModalHTML() {
        return `
            <div id="loginModal" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <h2>Login to MedTechAI</h2>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" name="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Login</button>
                    </form>
                </div>
            </div>
        `;
    }

    getRegisterModalHTML() {
        return `
            <div id="registerModal" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <h2>Join MedTechAI</h2>
                    <form id="registerForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <input type="text" id="firstName" name="firstName" required>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <input type="text" id="lastName" name="lastName" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registerEmail">Email</label>
                            <input type="email" id="registerEmail" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">Password</label>
                            <input type="password" id="registerPassword" name="password" required minlength="8">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="dateOfBirth">Date of Birth</label>
                                <input type="date" id="dateOfBirth" name="dateOfBirth" required>
                            </div>
                            <div class="form-group">
                                <label for="gender">Gender</label>
                                <select id="gender" name="gender" required>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone">
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Create Account</button>
                    </form>
                </div>
            </div>
        `;
    }

    getLabUploadModalHTML() {
        return `
            <div id="labUploadModal" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <h2>Upload Lab Results</h2>
                    <form id="labUploadForm">
                        <div class="form-group">
                            <label for="labFile">Lab Result File</label>
                            <input type="file" id="labFile" name="labFile" accept=".pdf,.jpg,.jpeg,.png" required>
                        </div>
                        <div class="form-group">
                            <label for="testType">Test Type</label>
                            <select id="testType" name="testType" required>
                                <option value="">Select Test Type</option>
                                <option value="blood_work">Blood Work</option>
                                <option value="urine_test">Urine Test</option>
                                <option value="imaging">Medical Imaging</option>
                                <option value="biopsy">Biopsy</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="testDate">Test Date</label>
                            <input type="date" id="testDate" name="testDate" required>
                        </div>
                        <div class="form-group">
                            <label for="notes">Notes (Optional)</label>
                            <textarea id="notes" name="notes" rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Upload Result</button>
                    </form>
                </div>
            </div>
        `;
    }

    addNotificationStyles() {
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 10000;
                    animation: slideInRight 0.3s ease-out;
                    max-width: 400px;
                }
                
                .notification-success { background: #10b981; }
                .notification-error { background: #ef4444; }
                .notification-warning { background: #f59e0b; }
                .notification-info { background: #3b82f6; }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    margin-left: auto;
                }
                
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                    align-items: center;
                    justify-content: center;
                }
                
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                }
                
                .modal-content {
                    position: relative;
                    background: white;
                    border-radius: 12px;
                    padding: 30px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                .dashboard-modal-content {
                    max-width: 1000px;
                    width: 95%;
                }
                
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-row {
                    display: flex;
                    gap: 15px;
                }
                
                .form-row .form-group {
                    flex: 1;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 600;
                    color: #374151;
                }
                
                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: border-color 0.2s;
                }
                
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                }
                
                .btn-full {
                    width: 100%;
                }
                
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }
                
                .dashboard-card {
                    background: #f9fafb;
                    border-radius: 12px;
                    padding: 20px;
                    border: 1px solid #e5e7eb;
                }
                
                .dashboard-card h3 {
                    margin: 0 0 15px 0;
                    color: #1f2937;
                }
                
                .lab-result-item,
                .prescription-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .status-completed { color: #10b981; }
                .status-pending { color: #f59e0b; }
                .status-processing { color: #3b82f6; }
                
                .health-score {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 10px;
                }
                
                .score-value {
                    font-weight: bold;
                    font-size: 18px;
                    color: #10b981;
                }
            `;
            document.head.appendChild(style);
        }
    }

    async loadUserData() {
        if (this.currentUser) {
            // Pre-load user data for better UX
            await Promise.all([
                this.getLabResults(),
                this.getPrescriptions(),
                this.getAIInsights()
            ]);
        }
    }

    async refreshLabResults() {
        // Refresh lab results after upload
        await this.getLabResults();
        if (document.getElementById('dashboardModal').style.display === 'flex') {
            // Refresh dashboard if it's open
            this.showDashboard();
        }
    }
}

// Initialize the application
const medTechAI = new MedTechAI();

// Make it globally available
window.medTechAI = medTechAI;
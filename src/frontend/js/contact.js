/**
 * MedTechAI Contact Form Handler
 * Handles contact form submission, validation, and user feedback
 */

class ContactFormHandler {
    constructor() {
        this.form = null;
        this.statusElement = null;
        this.submitButton = null;
        this.isSubmitting = false;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.form = document.getElementById('contact-form');
        this.statusElement = document.getElementById('form-status');
        
        if (!this.form) {
            console.warn('Contact form not found on this page');
            return;
        }

        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.setupEventListeners();
        this.setupValidation();
        
        console.log('✅ Contact form handler initialized');
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Analytics tracking
        this.form.addEventListener('submit', () => {
            this.trackEvent('contact_form_submit');
        });
    }

    setupValidation() {
        // Add validation styles if not present
        if (!document.querySelector('#contact-form-styles')) {
            const styles = document.createElement('style');
            styles.id = 'contact-form-styles';
            styles.textContent = `
                .form-group.error input,
                .form-group.error textarea {
                    border-color: #e74c3c;
                    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
                }
                
                .form-group.success input,
                .form-group.success textarea {
                    border-color: #27ae60;
                    box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.1);
                }
                
                .field-error {
                    color: #e74c3c;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: block;
                }
                
                .form-status {
                    margin-top: 1rem;
                    padding: 1rem;
                    border-radius: 8px;
                    font-weight: 500;
                    display: none;
                }
                
                .form-status.success {
                    background-color: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                    display: block;
                }
                
                .form-status.error {
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                    display: block;
                }
                
                .form-status.loading {
                    background-color: #d1ecf1;
                    color: #0c5460;
                    border: 1px solid #bee5eb;
                    display: block;
                }
                
                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Validate all fields
        if (!this.validateForm()) {
            this.showStatus('Please fix the errors above and try again.', 'error');
            return;
        }

        this.isSubmitting = true;
        this.setSubmitState(true);
        this.showStatus('Sending your message...', 'loading');

        try {
            const formData = this.getFormData();
            const result = await this.submitForm(formData);
            
            if (result.success) {
                this.showStatus('Thank you! Your message has been sent successfully. We\'ll get back to you within 24-48 hours.', 'success');
                this.form.reset();
                this.clearAllErrors();
                this.trackEvent('contact_form_success');
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Contact form submission error:', error);
            this.showStatus('Sorry, there was an error sending your message. Please try again or contact us directly at contact@medtechai.net.', 'error');
            this.trackEvent('contact_form_error', { error: error.message });
        } finally {
            this.isSubmitting = false;
            this.setSubmitState(false);
        }
    }

    async submitForm(formData) {
        // Try multiple submission methods
        
        // Method 1: Try backend API if available
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                return { success: true };
            }
        } catch (error) {
            console.log('Backend API not available, trying alternative methods...');
        }

        // Method 2: Try Formspree (if configured)
        const formspreeId = this.getFormspreeId();
        if (formspreeId) {
            try {
                const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    return { success: true };
                }
            } catch (error) {
                console.log('Formspree submission failed:', error);
            }
        }

        // Method 3: Email fallback
        try {
            const emailBody = this.formatEmailBody(formData);
            const mailtoLink = `mailto:contact@medtechai.net?subject=${encodeURIComponent(formData.subject || 'Contact Form Submission')}&body=${encodeURIComponent(emailBody)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Return success after a short delay
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({ success: true });
                }, 1000);
            });
        } catch (error) {
            throw new Error('All submission methods failed');
        }
    }

    getFormspreeId() {
        // Extract Formspree ID from form action if present
        const action = this.form.getAttribute('action');
        if (action && action.includes('formspree.io/f/')) {
            const match = action.match(/formspree\.io\/f\/([^\/]+)/);
            return match ? match[1] : null;
        }
        return null;
    }

    formatEmailBody(formData) {
        return `
Contact Form Submission from MedTechAI Website

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject || 'No subject provided'}

Message:
${formData.message}

---
Submitted: ${new Date().toLocaleString()}
        `.trim();
    }

    getFormData() {
        const formData = new FormData(this.form);
        return {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            subject: formData.get('subject')?.trim(),
            message: formData.get('message')?.trim()
        };
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const formGroup = field.closest('.form-group');
        
        // Clear previous errors
        this.clearFieldError(field);

        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = `${this.getFieldLabel(field)} is required.`;
            isValid = false;
        }
        // Email validation
        else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address.';
                isValid = false;
            }
        }
        // Name validation
        else if (fieldName === 'name' && value) {
            if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long.';
                isValid = false;
            }
        }
        // Message validation
        else if (fieldName === 'message' && value) {
            if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters long.';
                isValid = false;
            }
        }

        // Update UI
        if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    getFieldLabel(field) {
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup.querySelector('.field-error');
        
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        formGroup.classList.remove('error', 'success');
    }

    clearAllErrors() {
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
            const errorElement = group.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        });
    }

    showStatus(message, type) {
        if (!this.statusElement) return;
        
        this.statusElement.textContent = message;
        this.statusElement.className = `form-status ${type}`;
        this.statusElement.style.display = 'block';
        
        // Auto-hide success messages after 10 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.statusElement.style.display = 'none';
            }, 10000);
        }
    }

    setSubmitState(isSubmitting) {
        if (!this.submitButton) return;
        
        if (isSubmitting) {
            this.submitButton.disabled = true;
            this.submitButton.textContent = 'Sending...';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Send Message';
        }
    }

    trackEvent(eventName, data = {}) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Custom analytics
        if (window.dataLayer) {
            window.dataLayer.push({
                event: eventName,
                ...data
            });
        }
        
        console.log(`📊 Event tracked: ${eventName}`, data);
    }
}

// Initialize contact form handler
const contactForm = new ContactFormHandler();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactFormHandler;
}
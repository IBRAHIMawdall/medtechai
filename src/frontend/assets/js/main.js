// Production MedTechAI Frontend
class MedTechAI {
    constructor() {
        this.apiBaseUrl = '/api';
        this.currentUser = null;
        this.authToken = localStorage.getItem('authToken');
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.initializeAnimations();
        if (this.authToken) {
            await this.checkAuthStatus();
        }
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Mobile navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                const navList = document.getElementById('navList');
                if (navList) navList.classList.remove('active');
            }
        });
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    initializeAnimations() {
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Observe elements
        document.querySelectorAll('.solution-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });

        // Typing effect for hero title
        const heroTitle = document.querySelector('[data-typing]');
        if (heroTitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 80);
                }
            };
            setTimeout(typeWriter, 1000);
        }
    }

    async checkAuthStatus() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/users/profile`, {
                headers: { 'Authorization': `Bearer ${this.authToken}` }
            });
            if (response.ok) {
                this.currentUser = await response.json();
                this.updateUIForAuthenticatedUser();
            } else {
                this.logout();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    }

    updateUIForAuthenticatedUser() {
        // Add dashboard link to navigation
        const navList = document.querySelector('.nav-list');
        if (navList && !navList.querySelector('.shop-link')) {
            const shopItem = document.createElement('li');
            shopItem.innerHTML = '<a class="nav-link shop-link" href="#shop">Shop</a>';
            navList.appendChild(shopItem);
        }
        if (navList && !navList.querySelector('.dashboard-link')) {
            const dashboardItem = document.createElement('li');
            dashboardItem.innerHTML = '<a class="nav-link dashboard-link" href="#dashboard">Dashboard</a>';
            navList.appendChild(dashboardItem);
        }
    }

    logout() {
        this.authToken = null;
        this.currentUser = null;
        localStorage.removeItem('authToken');
        const dashboardLink = document.querySelector('.dashboard-link');
        if (dashboardLink) dashboardLink.parentElement.remove();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
}

// Initialize app
const medTechAI = new MedTechAI();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0.8;
    }
    
    .notification button:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);
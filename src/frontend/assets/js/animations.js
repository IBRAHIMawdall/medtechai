// Advanced animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.about-card, .solution-card, .professional-card, .category-card').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero section
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const parallaxEl = document.querySelector('.hero');
    if (parallaxEl && parallaxEl.classList.contains('enable-parallax') && !prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const speed = scrolled * 0.3;
            parallaxEl.style.transform = `translateY(${speed}px)`;
        });
    }

    // Dynamic counter animation
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = counter.textContent;
            const isPercentage = target.includes('%');
            const isTime = target.includes('/');
            
            if (!isPercentage && !isTime) return;
            
            const finalNumber = parseInt(target);
            let current = 0;
            const increment = finalNumber / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalNumber) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + (isPercentage ? '%' : '');
                }
            }, 30);
        });
    }

    // Trigger counter animation when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.unobserve(entry.target);
            }
        });
    });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Add advanced hover effects to cards
    document.querySelectorAll('.about-card, .solution-card, .professional-card, .category-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glow effect
            this.style.boxShadow = '0 20px 40px rgba(0, 123, 255, 0.3), 0 0 20px rgba(0, 123, 255, 0.1)';
            this.style.transform = 'translateY(-15px) scale(1.03)';
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            this.style.transform = 'translateY(0) scale(1)';
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Enhanced floating animation for hero cards
    function createAdvancedFloatingAnimation() {
        const cards = document.querySelectorAll('.floating-card');
        if (cards.length === 0 || prefersReducedMotion) return;

        cards.forEach((card, index) => {
            const baseDelay = index * 0.5;
            const randomOffset = Math.random() * 0.5;
            card.style.animationDelay = `${baseDelay + randomOffset}s`;
            card.style.animationDuration = `${4 + Math.random() * 2}s`;

            // Add mouse interaction
            card.addEventListener('mouseenter', () => {
                card.style.animationPlayState = 'paused';
                card.style.transform = 'scale(1.1) rotate(5deg)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.animationPlayState = 'running';
                card.style.transform = '';
            });
        });
    }

    // Enhanced particle system
    function createAdvancedParticles() {
        const hero = document.querySelector('.hero');
        if (!hero || !hero.classList.contains('enable-particles') || prefersReducedMotion) return;

        const particleCount = 80; // Increased particle count
        const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 4 + 2;
            const duration = 4 + Math.random() * 6;
            const delay = Math.random() * 3;

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.8 + 0.2};
                animation: advancedFloat ${duration}s ease-in-out infinite;
                animation-delay: ${delay}s;
                box-shadow: 0 0 ${size * 2}px ${color}40;
            `;

            hero.appendChild(particle);
        }
    }

    createAdvancedParticles();

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (prefersReducedMotion) return;

            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Advanced scroll animations
    function createScrollAnimations() {
        const elements = document.querySelectorAll('.about-card, .solution-card, .professional-card, .category-card, .pricing-card');

        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';

            const delay = index * 0.1;
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay * 1000);
        });
    }

    // Trigger scroll animations when page loads
    window.addEventListener('load', createScrollAnimations);

    // Add typing effect to hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Initialize typing effect only when opted in
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.hasAttribute('data-typing') && !prefersReducedMotion) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 1000);
    }

    // Theme toggle initialization
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        root.setAttribute('data-theme', savedTheme);
    } else {
        // Default to light theme for consistent visuals
        root.setAttribute('data-theme', 'light');
    }
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', current);
            localStorage.setItem('theme', current);
        });
    }

    // Language toggle routing (English <-> Arabic)
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        // Remove the language toggle button to restore original layout and disable routing
        langBtn.remove();
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.8s ease-out forwards;
    }

    @keyframes advancedFloat {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.8;
        }
        25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
        }
        50% {
            transform: translateY(-10px) translateX(-5px);
            opacity: 0.9;
        }
        75% {
            transform: translateY(-30px) translateX(15px);
            opacity: 1;
        }
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .btn {
        position: relative;
        overflow: hidden;
    }

    .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
    }

    .stats {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4rem 0;
        text-align: center;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .stat-number {
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: #ffd700;
    }

    .btn-success {
        background: linear-gradient(45deg, #28a745, #20c997);
        border-color: #28a745;
        color: white;
    }

    .btn-success:hover {
        background: linear-gradient(45deg, #218838, #1dd1a1);
        border-color: #1e7e34;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
    }

    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

document.head.appendChild(style);
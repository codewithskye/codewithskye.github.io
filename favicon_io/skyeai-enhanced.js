// Skye AI Enhanced JavaScript
// Advanced functionality with modern ES6+ features

class SkyeAI {
    constructor() {
        this.isInitialized = false;
        this.animations = new Map();
        this.observers = new Map();
        this.particles = [];
        this.config = {
            particleCount: 50,
            animationSpeed: 1,
            scrollThreshold: 0.1,
            debounceDelay: 100
        };
        this.init();
    }

    // Initialize all features
    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.waitForDOM();
            this.setupParticleSystem();
            this.setupScrollAnimations();
            this.setupSmoothScrolling();
            this.setupActiveNavigation();
            this.setupCounterAnimations();
            this.setupHeaderEffects();
            this.setupFormEnhancements();
            this.setupPerformanceOptimizations();
            this.setupAccessibility();
            this.isInitialized = true;
            console.log('🚀 Skye AI Enhanced JavaScript initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Skye AI:', error);
        }
    }

    // Wait for DOM to be ready
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    // Particle System
    setupParticleSystem() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        this.createParticles(particlesContainer);
        this.animateParticles();
    }

    createParticles(container) {
        const colors = [
            'rgba(102, 126, 234, 0.6)',
            'rgba(118, 75, 162, 0.6)',
            'rgba(79, 172, 254, 0.6)',
            'rgba(240, 147, 251, 0.6)'
        ];

        for (let i = 0; i < this.config.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const x = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = Math.random() * 10 + 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 3 + 1;
            
            particle.style.cssText = `
                position: absolute;
                left: ${x}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                animation: float ${duration}s infinite linear;
                animation-delay: ${delay}s;
                pointer-events: none;
            `;
            
            container.appendChild(particle);
            this.particles.push({
                element: particle,
                x: x,
                y: 100,
                speed: Math.random() * 2 + 1,
                size: size
            });
        }
    }

    animateParticles() {
        // Add CSS animation for particles
        if (!document.getElementById('particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes float {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Scroll Animations with Intersection Observer
    setupScrollAnimations() {
        const observerOptions = {
            threshold: this.config.scrollThreshold,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.feature-card, .stat-item, .card, .btn, .hero-content > *'
        );

        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(element);
        });

        this.observers.set('scroll', observer);
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Add special effects for certain elements
        if (element.classList.contains('feature-card')) {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-8px) scale(1.02)';
            });
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0) scale(1)';
            });
        }
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Active Navigation
    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        const updateActiveNav = this.debounce(() => {
            let current = '';
            const scrollPosition = window.scrollY + 200;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, this.config.debounceDelay);

        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav(); // Initial call
    }

    // Counter Animations
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        if (counters.length === 0) return;

        const animateCounter = (counter) => {
            const target = counter.textContent;
            const isPercentage = target.includes('%');
            const isRating = target.includes('★');
            const hasPlus = target.includes('+');
            const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
            
            if (isNaN(numericValue)) return;

            let current = 0;
            const increment = numericValue / 100;
            const duration = 2000; // 2 seconds
            const stepTime = duration / 100;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                
                let displayValue;
                if (isPercentage) {
                    displayValue = current.toFixed(1) + '%';
                } else if (isRating) {
                    displayValue = current.toFixed(1) + '★';
                } else if (numericValue >= 1000) {
                    displayValue = Math.floor(current / 1000) + 'K' + (hasPlus ? '+' : '');
                } else {
                    displayValue = Math.floor(current) + (hasPlus ? '+' : '');
                }
                
                counter.textContent = displayValue;
            }, stepTime);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
        this.observers.set('counter', observer);
    }

    // Header Effects
    setupHeaderEffects() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                header.style.backdropFilter = 'blur(30px)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.9)';
                header.style.boxShadow = 'none';
                header.style.backdropFilter = 'blur(20px)';
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    // Form Enhancements
    setupFormEnhancements() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            this.enhanceForm(form);
        });
    }

    enhanceForm(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add floating label effect
            this.addFloatingLabel(input);
            
            // Add validation styling
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearValidation(input));
        });

        // Enhanced form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    addFloatingLabel(input) {
        const wrapper = document.createElement('div');
        wrapper.className = 'input-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        
        if (input.placeholder) {
            const label = document.createElement('label');
            label.textContent = input.placeholder;
            label.className = 'floating-label';
            wrapper.appendChild(label);
            input.placeholder = '';
        }
        
        // Add styles for floating label
        if (!document.getElementById('floating-label-styles')) {
            const style = document.createElement('style');
            style.id = 'floating-label-styles';
            style.textContent = `
                .input-wrapper {
                    position: relative;
                    margin-bottom: 1.5rem;
                }
                .floating-label {
                    position: absolute;
                    top: 1rem;
                    left: 1rem;
                    color: rgba(255, 255, 255, 0.5);
                    transition: all 0.3s ease;
                    pointer-events: none;
                    background: var(--dark-bg);
                    padding: 0 0.5rem;
                }
                .input-wrapper input:focus + .floating-label,
                .input-wrapper input:not(:placeholder-shown) + .floating-label {
                    top: -0.5rem;
                    left: 0.5rem;
                    font-size: 0.875rem;
                    color: #667eea;
                }
            `;
            document.head.appendChild(style);
        }
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        
        // Basic validation
        if (input.required && !value) {
            isValid = false;
        } else if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }
        
        // Apply validation styles
        if (isValid) {
            input.style.borderColor = 'var(--success-color)';
            input.style.boxShadow = '0 0 0 3px rgba(46, 204, 113, 0.1)';
        } else {
            input.style.borderColor = 'var(--error-color)';
            input.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        }
        
        return isValid;
    }

    clearValidation(input) {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        
        // Validate all fields
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Show loading state
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                this.showNotification('Message sent successfully!', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Preload critical resources
        this.preloadResources();
        
        // Setup service worker if available
        this.setupServiceWorker();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    preloadResources() {
        const criticalResources = [
            'portfolio-chatbot.js',
            'skyeai-enhanced.css'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.js') ? 'script' : 'style';
            document.head.appendChild(link);
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
    }

    // Accessibility Enhancements
    setupAccessibility() {
        // Add skip link
        this.addSkipLink();
        
        // Enhance keyboard navigation
        this.enhanceKeyboardNavigation();
        
        // Add ARIA labels
        this.addAriaLabels();
        
        // Setup focus management
        this.setupFocusManagement();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-gradient);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10001;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    enhanceKeyboardNavigation() {
        // Add keyboard support for interactive elements
        const interactiveElements = document.querySelectorAll('.card, .feature-card');
        
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    addAriaLabels() {
        // Add ARIA labels to buttons without text
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                button.setAttribute('aria-label', 'Button');
            }
        });
        
        // Add ARIA labels to navigation
        const nav = document.querySelector('nav');
        if (nav && !nav.hasAttribute('aria-label')) {
            nav.setAttribute('aria-label', 'Main navigation');
        }
    }

    setupFocusManagement() {
        // Trap focus in modals
        const modals = document.querySelectorAll('.modal, .chatbot-window');
        
        modals.forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.trapFocus(e, modal);
                }
            });
        });
    }

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    // Utility Functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            color: var(--text-primary);
            z-index: 10000;
            backdrop-filter: blur(20px);
            animation: slideInRight 0.3s ease-out;
        `;
        
        if (type === 'success') {
            notification.style.borderColor = 'var(--success-color)';
        } else if (type === 'error') {
            notification.style.borderColor = 'var(--error-color)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.particles.forEach(particle => {
            if (particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
        });
        this.particles = [];
        this.isInitialized = false;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.skyeAI = new SkyeAI();
    });
} else {
    window.skyeAI = new SkyeAI();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkyeAI;
}

// Add notification animations
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
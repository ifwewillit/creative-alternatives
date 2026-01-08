/**
 * Creative Alternatives - Main JavaScript
 * Handles navigation, animations, and form interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
    initContactForm();
});

/**
 * Sticky Navbar with background change on scroll
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 50;

    function updateNavbar() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Initial check
    updateNavbar();

    // Listen to scroll events with throttling
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Mobile Navigation Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    let isOpen = false;

    function toggleMenu() {
        isOpen = !isOpen;

        if (isOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('open');
            // Change to X icon
            menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
        } else {
            mobileMenu.classList.remove('open');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
            // Change back to hamburger icon
            menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        }
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isOpen) {
                toggleMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen) {
            toggleMenu();
        }
    });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Optionally unobserve after animation
                        // observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for browsers without Intersection Observer
        animatedElements.forEach(el => el.classList.add('visible'));
    }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Contact Form Handling
 */
function initContactForm() {
    const form = document.getElementById('quote-form');
    const formSuccess = document.getElementById('form-success');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate required fields
        if (!validateForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Hide form, show success message
            form.classList.add('hidden');
            formSuccess.classList.remove('hidden');

            // Log form data (replace with actual submission)
            console.log('Form submitted:', data);

            // Reset button state
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Reset form
            form.reset();
        }, 1500);
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Remove error state on input
            this.classList.remove('border-red-500');
        });
    });
}

/**
 * Form validation
 */
function validateForm(data) {
    let isValid = true;
    const form = document.getElementById('quote-form');

    // Required fields
    const requiredFields = ['name', 'email', 'message'];

    requiredFields.forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        if (!data[field] || data[field].trim() === '') {
            showFieldError(input, `${capitalizeFirst(field)} is required`);
            isValid = false;
        }
    });

    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        showFieldError(form.querySelector('[name="email"]'), 'Please enter a valid email');
        isValid = false;
    }

    return isValid;
}

/**
 * Validate individual field
 */
function validateField(input) {
    const value = input.value.trim();
    const name = input.name;

    // Remove existing error
    clearFieldError(input);

    // Check required
    if (input.hasAttribute('required') && !value) {
        showFieldError(input, `${capitalizeFirst(name)} is required`);
        return false;
    }

    // Check email
    if (input.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(input, 'Please enter a valid email');
        return false;
    }

    return true;
}

/**
 * Show field error
 */
function showFieldError(input, message) {
    input.classList.add('border-red-500');

    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorEl = document.createElement('p');
    errorEl.className = 'error-message text-red-500 text-sm mt-1';
    errorEl.textContent = message;
    input.parentNode.appendChild(errorEl);
}

/**
 * Clear field error
 */
function clearFieldError(input) {
    input.classList.remove('border-red-500');
    const errorEl = input.parentNode.querySelector('.error-message');
    if (errorEl) {
        errorEl.remove();
    }
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Capitalize first letter helper
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
}

/**
 * Handle scroll to reveal active section in nav (optional enhancement)
 */
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-accent');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('text-accent');
        }
    });
}

// Uncomment to enable active section highlighting
// window.addEventListener('scroll', highlightActiveSection);

/* ============================================
   VASUNDHARA ACADEMY — THEME SHOWCASE SCRIPTS
   ============================================ */

// Theme Switching (Click-based show/hide)
function switchTheme(themeNum) {
    // Hide all themes with fade-out
    const themes = document.querySelectorAll('.theme-1, .theme-2, .theme-3');
    themes.forEach(t => {
        t.style.opacity = '0';
        t.style.transition = 'opacity 0.4s ease';
        setTimeout(() => { t.style.display = 'none'; }, 400);
    });

    // Show selected theme with fade-in
    setTimeout(() => {
        const activeTheme = document.getElementById('theme' + themeNum);
        if (activeTheme) {
            activeTheme.style.display = 'block';
            activeTheme.style.opacity = '0';
            // Force reflow
            activeTheme.offsetHeight;
            activeTheme.style.transition = 'opacity 0.5s ease';
            activeTheme.style.opacity = '1';
        }
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Re-trigger animations for the new theme
        setTimeout(() => {
            initScrollAnimations();
            animateCounters();
            if (themeNum === 1) createParticles();
        }, 100);
    }, 450);

    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.theme-btn[data-theme="${themeNum}"]`).classList.add('active');
}

// Scroll Animations (Intersection Observer)
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.t1-about, .t1-features, .t1-achievements, .t1-testimonials, .t1-cta,' +
        '.t2-programs, .t2-gallery, .t2-testimonials, .t2-cta,' +
        '.t3-welcome, .t3-pillars, .t3-campus, .t3-testimonials, .t3-cta,' +
        '.t1-feature-card, .t1-achievement-card, .t1-testimonial-card,' +
        '.t2-program-card, .t2-testimonial, .t2-gallery-item,' +
        '.t3-pillar-card, .t3-campus-card, .t3-testimonial, .t3-number-card'
    );
    elements.forEach(el => el.classList.add('fade-up'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                const delay = parent ? Array.from(parent.children).indexOf(entry.target) * 150 : 0;
                setTimeout(() => entry.target.classList.add('visible'), delay);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.t1-stat-number, .t2-counter-num, .t3-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                const target = parseInt(entry.target.dataset.count || entry.target.closest('[data-count]')?.dataset.count);
                if (!target) return;
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = Math.floor(current);
                }, 16);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

// Theme 1 Particles
let particlesCreated = false;
function createParticles() {
    if (particlesCreated) return;
    const container = document.getElementById('t1-particles');
    if (!container) return;
    particlesCreated = true;
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position:absolute;
            width:${Math.random() * 4 + 1}px;
            height:${Math.random() * 4 + 1}px;
            background:rgba(212,168,83,${Math.random() * 0.3 + 0.1});
            border-radius:50%;
            left:${Math.random() * 100}%;
            top:${Math.random() * 100}%;
            animation:particleFloat ${Math.random() * 6 + 4}s ease-in-out infinite;
            animation-delay:${Math.random() * 4}s;
        `;
        container.appendChild(particle);
    }
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% { transform:translate(0, 0) scale(1); opacity:0.3; }
            25% { transform:translate(20px, -30px) scale(1.5); opacity:0.7; }
            50% { transform:translate(-15px, -50px) scale(1); opacity:0.5; }
            75% { transform:translate(10px, -20px) scale(1.2); opacity:0.4; }
        }
    `;
    document.head.appendChild(style);
}

// Theme Selector shrink on scroll
function initSelectorShrink() {
    const selector = document.getElementById('theme-selector');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            selector.style.padding = '0.3rem 0';
        } else {
            selector.style.padding = '0.6rem 0';
        }
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    animateCounters();
    createParticles();
    initSelectorShrink();
});

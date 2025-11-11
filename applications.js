// Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Animate metrics on scroll
    const metrics = document.querySelectorAll('.metric-value');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.5 });

    metrics.forEach(metric => {
        metric.style.opacity = '0';
        metric.style.transform = 'translateY(20px)';
        observer.observe(metric);
    });

    // Animate cards on scroll
    const cards = document.querySelectorAll('.info-card, .case-study-card, .lesson-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        cardObserver.observe(card);
    });

    // Progress bar
    const progressBar = document.querySelector('.progress-bar');
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
});

// Add animation classes to cards
document.querySelectorAll('.info-card, .case-study-card, .lesson-card').forEach(card => {
    card.classList.add('fade-in');
});

// Initialize animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAnimations); 
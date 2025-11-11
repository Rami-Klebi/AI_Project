// Main JavaScript file for handling all interactive features

// Constants
const SCROLL_OFFSET = 100;
const ANIMATION_DURATION = 300;
const MOBILE_BREAKPOINT = 768;

// DOM Elements
const body = document.body;
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const hero = document.querySelector('.hero');
const backToTop = document.querySelector('.back-to-top');
const themeSwitcher = document.querySelector('.theme-switcher');
const preloader = document.getElementById('preloader');

// State
let lastScroll = 0;
let isScrolling = false;

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Preloader
window.addEventListener('load', () => {
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
        body.classList.remove('loading');
    }, ANIMATION_DURATION);
});

// Mobile Menu
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.classList.toggle('menu-open');
    });
}

// Sticky Header & Progress Bar
const updateHeader = () => {
    const currentScroll = window.pageYOffset;
    const scrollPercent = (currentScroll / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    // Update progress bar
    document.querySelector('.progress-bar').style.width = `${scrollPercent}%`;
    
    // Handle header visibility
    if (currentScroll > SCROLL_OFFSET) {
        header.classList.add('sticky');
        if (currentScroll > lastScroll) {
            header.classList.add('hide');
        } else {
            header.classList.remove('hide');
        }
    } else {
        header.classList.remove('sticky');
    }
    
    lastScroll = currentScroll;
};

window.addEventListener('scroll', debounce(() => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            updateHeader();
            isScrolling = false;
        });
    }
    isScrolling = true;
}, 10));

// Parallax Effect for Hero Section
if (hero) {
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 20;
        const y = (clientY / window.innerHeight - 0.5) * 20;
        
        hero.querySelector('.hero-content').style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Intersection Observer for Animations
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            if (entry.target.classList.contains('stat-card')) {
                animateStats(entry.target);
            }
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.2,
    rootMargin: '0px'
});

document.querySelectorAll('.animate-text, .info-card, .aspect-card, .stat-card').forEach(el => {
    observer.observe(el);
});

// Statistics Animation
const animateStats = (statCard) => {
    const statNumber = statCard.querySelector('.stat-number');
    const target = parseInt(statNumber.getAttribute('data-target'));
    const progressRing = statCard.querySelector('.progress-ring__circle');
    const radius = progressRing.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = circumference;
    
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const steps = 100;
    const stepDuration = duration / steps;
    
    const updateCount = () => {
        if (current < target) {
            current += increment;
            const progress = (current / target) * 100;
            const offset = circumference - (progress / 100) * circumference;
            
            statNumber.textContent = Math.round(current) + '%';
            progressRing.style.strokeDashoffset = offset;
            
            setTimeout(updateCount, stepDuration);
        } else {
            statNumber.textContent = target + '%';
            statNumber.classList.add('animate');
        }
    };
    
    updateCount();
};

// Back to Top Button
if (backToTop) {
    const updateBackToTop = () => {
        const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const progressRing = backToTop.querySelector('.progress-ring__circle');
        const radius = progressRing.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (scrollPercent / 100) * circumference;
        
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        progressRing.style.strokeDashoffset = offset;
        
        if (window.pageYOffset > SCROLL_OFFSET) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };
    
    window.addEventListener('scroll', debounce(updateBackToTop, 10));
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Theme Switcher
if (themeSwitcher) {
    const toggleTheme = () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        themeSwitcher.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    themeSwitcher.addEventListener('click', toggleTheme);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            // Close mobile menu if open
            if (body.classList.contains('menu-open')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
            }
            
            // Scroll to target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Add highlight effect
            setTimeout(() => {
                target.classList.add('highlight');
                setTimeout(() => {
                    target.classList.remove('highlight');
                }, 1000);
            }, ANIMATION_DURATION);
        }
    });
});

// Particles Background
const createParticles = () => {
    const particles = document.querySelector('.particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.setProperty('--x', `${Math.random() * 100}%`);
        particle.style.setProperty('--y', `${Math.random() * 100}%`);
        particle.style.setProperty('--duration', `${Math.random() * 20 + 10}s`);
        particle.style.setProperty('--delay', `${Math.random() * 10}s`);
        particles.appendChild(particle);
    }
};

if (document.querySelector('.particles')) {
    createParticles();
}

// Handle Window Resize
window.addEventListener('resize', debounce(() => {
    // Update any necessary responsive elements
    if (window.innerWidth > MOBILE_BREAKPOINT && body.classList.contains('menu-open')) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
    }
}, 250));

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set initial header state
    updateHeader();
    
    // Initialize progress rings
    document.querySelectorAll('.progress-ring__circle').forEach(circle => {
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
    });

    // Quick Links Menu
    const quickLinksToggle = document.querySelector('.quick-links-toggle');
    const quickLinksMenu = document.querySelector('.quick-links-menu');
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (quickLinksToggle && quickLinksMenu) {
        quickLinksToggle.addEventListener('click', () => {
            quickLinksMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!quickLinksToggle.contains(e.target) && !quickLinksMenu.contains(e.target)) {
                quickLinksMenu.classList.remove('active');
            }
        });
    }

    // Theme Toggle
    if (themeToggle) {
        const updateThemeIcon = (isDark) => {
            themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i> Thème ${isDark ? 'Clair' : 'Sombre'}`;
        };

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.classList.toggle('dark-theme', savedTheme === 'dark');
            updateThemeIcon(savedTheme === 'dark');
        }

        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }

    // FAQ Items
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            // Smooth scroll to the item if it's being opened
            if (!isActive) {
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
    
    // Glossary Search
    const glossarySearch = document.getElementById('glossarySearch');
    const glossaryItems = document.querySelectorAll('.glossary-item');
    
    if (glossarySearch) {
        glossarySearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            glossaryItems.forEach(item => {
                const term = item.getAttribute('data-term').toLowerCase();
                const title = item.querySelector('h3').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();
                
                const isMatch = term.includes(searchTerm) || 
                              title.includes(searchTerm) || 
                              description.includes(searchTerm);
                
                item.style.display = isMatch ? 'block' : 'none';
            });
        });
    }

    // Share Functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const text = encodeURIComponent('Découvrez ce guide complet sur l\'Intelligence Artificielle !');
            
            let shareUrl = '';
            
            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${text}%20${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // Timeline Animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
    
    // Learning Tracker
    const moduleItems = document.querySelectorAll('.module-item');
    const progressValue = document.querySelector('.progress-value');
    const progressPath = document.querySelector('.progress-path');
    
    // Load saved progress from localStorage
    const loadProgress = () => {
        const savedProgress = JSON.parse(localStorage.getItem('learningProgress')) || {};
        let totalProgress = 0;
        
        moduleItems.forEach(item => {
            const moduleId = item.getAttribute('data-module');
            const progress = savedProgress[moduleId] || 0;
            
            updateModuleProgress(item, progress);
            totalProgress += progress;
        });
        
        const averageProgress = Math.round(totalProgress / moduleItems.length);
        updateTotalProgress(averageProgress);
    };
    
    const updateModuleProgress = (module, progress) => {
        const progressFill = module.querySelector('.progress-fill');
        const progressText = module.querySelector('.progress-text');
        const status = module.querySelector('.module-status');
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
        
        if (progress === 0) {
            status.textContent = 'À commencer';
        } else if (progress === 100) {
            status.textContent = 'Terminé';
        } else {
            status.textContent = 'En cours';
        }
    };
    
    const updateTotalProgress = (progress) => {
        progressValue.textContent = progress;
        progressPath.style.strokeDashoffset = 100 - progress;
    };
    
    const saveProgress = (moduleId, progress) => {
        const savedProgress = JSON.parse(localStorage.getItem('learningProgress')) || {};
        savedProgress[moduleId] = progress;
        localStorage.setItem('learningProgress', JSON.stringify(savedProgress));
    };
    
    moduleItems.forEach(item => {
        const button = item.querySelector('.module-btn');
        const moduleId = item.getAttribute('data-module');
        
        button.addEventListener('click', () => {
            const currentProgress = parseInt(item.querySelector('.progress-text').textContent);
            const newProgress = Math.min(currentProgress + 25, 100);
            
            updateModuleProgress(item, newProgress);
            saveProgress(moduleId, newProgress);
            
            // Recalculate total progress
            let totalProgress = 0;
            moduleItems.forEach(module => {
                totalProgress += parseInt(module.querySelector('.progress-text').textContent);
            });
            
            const averageProgress = Math.round(totalProgress / moduleItems.length);
            updateTotalProgress(averageProgress);
        });
    });
    
    // Initialize progress
    loadProgress();
}); 
// Slider and Interactive Elements System

class SliderSystem {
    constructor(options = {}) {
        this.options = {
            slideClass: options.slideClass || '.slide',
            sliderContainerClass: options.sliderContainerClass || '.slider-container',
            navigationClass: options.navigationClass || '.slider-nav',
            autoplay: options.autoplay !== undefined ? options.autoplay : true,
            autoplayDelay: options.autoplayDelay || 5000,
            transitionDuration: options.transitionDuration || 500,
            touchEnabled: options.touchEnabled !== undefined ? options.touchEnabled : true
        };
        
        this.sliders = new Map();
        this.init();
    }
    
    init() {
        // Initialize all sliders on the page
        document.querySelectorAll(this.options.sliderContainerClass).forEach(container => {
            this.initializeSlider(container);
        });
    }
    
    initializeSlider(container) {
        const slides = container.querySelectorAll(this.options.slideClass);
        if (slides.length === 0) return;
        
        const sliderId = container.id || `slider-${Math.random().toString(36).substr(2, 9)}`;
        container.id = sliderId;
        
        // Create slider state
        const sliderState = {
            currentSlide: 0,
            slides: Array.from(slides),
            autoplayInterval: null,
            isTransitioning: false,
            touchStartX: 0,
            touchEndX: 0
        };
        
        this.sliders.set(sliderId, sliderState);
        
        // Add navigation if more than one slide
        if (slides.length > 1) {
            this.createNavigation(container, sliderId);
        }
        
        // Initialize first slide
        this.showSlide(sliderId, 0);
        
        // Add touch events if enabled
        if (this.options.touchEnabled) {
            this.addTouchEvents(container, sliderId);
        }
        
        // Start autoplay if enabled
        if (this.options.autoplay) {
            this.startAutoplay(sliderId);
            
            // Pause on hover
            container.addEventListener('mouseenter', () => this.pauseAutoplay(sliderId));
            container.addEventListener('mouseleave', () => this.startAutoplay(sliderId));
        }
    }
    
    createNavigation(container, sliderId) {
        const nav = document.createElement('div');
        nav.className = this.options.navigationClass.substring(1);
        
        // Add previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'slider-prev';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.addEventListener('click', () => this.prevSlide(sliderId));
        
        // Add next button
        const nextButton = document.createElement('button');
        nextButton.className = 'slider-next';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.addEventListener('click', () => this.nextSlide(sliderId));
        
        // Add dots navigation
        const dots = document.createElement('div');
        dots.className = 'slider-dots';
        
        const sliderState = this.sliders.get(sliderId);
        sliderState.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.addEventListener('click', () => this.showSlide(sliderId, index));
            dots.appendChild(dot);
        });
        
        nav.appendChild(prevButton);
        nav.appendChild(dots);
        nav.appendChild(nextButton);
        container.appendChild(nav);
    }
    
    showSlide(sliderId, index) {
        const sliderState = this.sliders.get(sliderId);
        if (!sliderState || sliderState.isTransitioning) return;
        
        sliderState.isTransitioning = true;
        
        // Update current slide
        const previousSlide = sliderState.slides[sliderState.currentSlide];
        const currentSlide = sliderState.slides[index];
        
        // Update dots
        const container = document.getElementById(sliderId);
        const dots = container.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Animate transition
        previousSlide.style.opacity = '0';
        previousSlide.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            previousSlide.style.display = 'none';
            currentSlide.style.display = 'block';
            
            // Trigger reflow
            currentSlide.offsetHeight;
            
            currentSlide.style.opacity = '1';
            currentSlide.style.transform = 'scale(1)';
            
            sliderState.currentSlide = index;
            sliderState.isTransitioning = false;
        }, this.options.transitionDuration);
    }
    
    nextSlide(sliderId) {
        const sliderState = this.sliders.get(sliderId);
        if (!sliderState) return;
        
        const nextIndex = (sliderState.currentSlide + 1) % sliderState.slides.length;
        this.showSlide(sliderId, nextIndex);
    }
    
    prevSlide(sliderId) {
        const sliderState = this.sliders.get(sliderId);
        if (!sliderState) return;
        
        const prevIndex = (sliderState.currentSlide - 1 + sliderState.slides.length) % sliderState.slides.length;
        this.showSlide(sliderId, prevIndex);
    }
    
    startAutoplay(sliderId) {
        const sliderState = this.sliders.get(sliderId);
        if (!sliderState || sliderState.autoplayInterval) return;
        
        sliderState.autoplayInterval = setInterval(() => {
            this.nextSlide(sliderId);
        }, this.options.autoplayDelay);
    }
    
    pauseAutoplay(sliderId) {
        const sliderState = this.sliders.get(sliderId);
        if (!sliderState || !sliderState.autoplayInterval) return;
        
        clearInterval(sliderState.autoplayInterval);
        sliderState.autoplayInterval = null;
    }
    
    addTouchEvents(container, sliderId) {
        container.addEventListener('touchstart', (e) => {
            const sliderState = this.sliders.get(sliderId);
            sliderState.touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            const sliderState = this.sliders.get(sliderId);
            sliderState.touchEndX = e.changedTouches[0].clientX;
            
            const diff = sliderState.touchStartX - sliderState.touchEndX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextSlide(sliderId);
                } else {
                    this.prevSlide(sliderId);
                }
            }
        }, { passive: true });
    }
    
    destroy(sliderId) {
        const sliderState = this.sliders.get(sliderId);
        if (!sliderState) return;
        
        // Clear autoplay
        this.pauseAutoplay(sliderId);
        
        // Remove event listeners
        const container = document.getElementById(sliderId);
        if (container) {
            container.removeEventListener('mouseenter', () => this.pauseAutoplay(sliderId));
            container.removeEventListener('mouseleave', () => this.startAutoplay(sliderId));
            
            // Remove navigation
            const nav = container.querySelector(this.options.navigationClass);
            if (nav) {
                nav.remove();
            }
        }
        
        // Remove slider state
        this.sliders.delete(sliderId);
    }
}

// Initialize slider system
document.addEventListener('DOMContentLoaded', () => {
    new SliderSystem({
        autoplay: true,
        autoplayDelay: 5000,
        transitionDuration: 500,
        touchEnabled: true
    });
});

// Export SliderSystem class for use in other files
export { SliderSystem }; 
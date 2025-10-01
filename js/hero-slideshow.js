/**
 * Glassmorphism Hero Background Slideshow
 * Manages the full-screen background image carousel with navigation dots
 */

(function() {
    'use strict';
    
    let currentSlide = 0;
    let bgImages = [];
    let dots = [];
    let slideInterval = null;
    let isAutoPlaying = true;
    
    const slideImages = [
        'assets/images/engagement/hero-01.jpg',
        'assets/images/engagement/hero-02.jpg',
        'assets/images/engagement/hero-03.jpg',
        'assets/images/engagement/hero-04.jpg',
        'assets/images/engagement/hero-05.jpg'
    ];
    
    function initializeSlideshow() {
        // Get slideshow elements
        bgImages = document.querySelectorAll('.hero-background-slideshow .hero-bg-image');
        dots = document.querySelectorAll('.hero-navigation-dots .nav-dot');
        
        if (bgImages.length === 0) {
            console.log('No background images found for glassmorphism hero slideshow');
            return;
        }
        
        console.log(`Glassmorphism hero slideshow initialized with ${bgImages.length} slides`);
        
        // Add click handlers to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                pauseAutoPlay();
                // Resume auto-play after 5 seconds
                setTimeout(startAutoPlay, 5000);
            });
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyNavigation);
        
        // Pause on hover, resume on leave
        const heroSection = document.querySelector('.hero-glassmorphism');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', pauseAutoPlay);
            heroSection.addEventListener('mouseleave', startAutoPlay);
        }
        
        // Add touch/swipe support
        addTouchSupport();
        
        // Start auto-play
        startAutoPlay();
        
        // Preload images for smooth transitions
        preloadImages();
    }
    
    function goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= bgImages.length) return;
        
        // Remove active class from current slide and dot
        if (bgImages[currentSlide]) {
            bgImages[currentSlide].classList.remove('active');
        }
        if (dots[currentSlide]) {
            dots[currentSlide].classList.remove('active');
        }
        
        // Update current slide
        currentSlide = slideIndex;
        
        // Add active class to new slide and dot
        if (bgImages[currentSlide]) {
            bgImages[currentSlide].classList.add('active');
        }
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
        
        console.log(`Switched to slide ${currentSlide + 1}`);
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % bgImages.length;
        goToSlide(nextIndex);
    }
    
    function previousSlide() {
        const prevIndex = currentSlide > 0 ? currentSlide - 1 : bgImages.length - 1;
        goToSlide(prevIndex);
    }
    
    function startAutoPlay() {
        if (!isAutoPlaying) return;
        
        // Clear existing interval
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        
        // Start new interval
        slideInterval = setInterval(() => {
            if (isAutoPlaying) {
                nextSlide();
            }
        }, 5000); // Change slide every 5 seconds
    }
    
    function pauseAutoPlay() {
        isAutoPlaying = false;
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    function resumeAutoPlay() {
        isAutoPlaying = true;
        startAutoPlay();
    }
    
    function handleKeyNavigation(event) {
        if (!document.querySelector('.hero-glassmorphism')) return;
        
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                previousSlide();
                pauseAutoPlay();
                setTimeout(startAutoPlay, 5000);
                break;
            case 'ArrowRight':
                event.preventDefault();
                nextSlide();
                pauseAutoPlay();
                setTimeout(startAutoPlay, 5000);
                break;
        }
    }
    
    function addTouchSupport() {
        const heroSection = document.querySelector('.hero-glassmorphism');
        if (!heroSection) return;
        
        let startX = 0;
        let endX = 0;
        
        heroSection.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        heroSection.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    previousSlide();
                }
                
                pauseAutoPlay();
                setTimeout(startAutoPlay, 5000);
            }
        }
    }
    
    function preloadImages() {
        slideImages.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                console.log(`Preloaded slide ${index + 1}: ${src}`);
            };
            img.onerror = () => {
                console.warn(`Failed to preload slide ${index + 1}: ${src}`);
            };
            img.src = src;
        });
    }
    
    function addParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-bg-image');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    // Global API for external control and debugging
    window.heroSlideshow = {
        goToSlide: goToSlide,
        nextSlide: nextSlide,
        previousSlide: previousSlide,
        startAutoPlay: startAutoPlay,
        pauseAutoPlay: pauseAutoPlay,
        resumeAutoPlay: resumeAutoPlay,
        getCurrentSlide: () => currentSlide,
        getTotalSlides: () => bgImages.length,
        isPlaying: () => isAutoPlaying
    };
    
    // Initialize when DOM is ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initializeSlideshow, 100);
            });
        } else {
            setTimeout(initializeSlideshow, 100);
        }
        
        // Add parallax effect
        addParallaxEffect();
    }
    
    // Start initialization
    init();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    });
    
})();
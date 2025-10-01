// Enhanced Wedding Website JavaScript with Mobile Optimizations

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile viewport fix
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
    }
    
    // Prevent zoom on input focus (mobile)
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (window.innerWidth < 768) {
                document.querySelector('meta[name=viewport]').setAttribute(
                    'content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                );
            }
        });
        
        input.addEventListener('blur', function() {
            if (window.innerWidth < 768) {
                document.querySelector('meta[name=viewport]').setAttribute(
                    'content', 
                    'width=device-width, initial-scale=1.0, user-scalable=no'
                );
            }
        });
    });
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Logo/Home button functionality
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo) {
        navLogo.addEventListener('click', function() {
            // Close mobile menu if open
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');

            // Scroll to top (home section)
            const homeSection = document.getElementById('home');
            if (homeSection) {
                const headerOffset = window.innerWidth < 768 ? 70 : 80;
                const elementPosition = homeSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active navigation state
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => link.classList.remove('active'));
                const homeLink = document.querySelector('.nav-link[href="#home"]');
                if (homeLink) {
                    homeLink.classList.add('active');
                }
            }
        });

        // Add cursor pointer style
        navLogo.style.cursor = 'pointer';
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
    
    // Prevent body scroll when mobile menu is open
    const body = document.body;
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    });
    
    if (navMenu) {
        observer.observe(navMenu, { attributes: true, attributeFilter: ['class'] });
    }
    
    // Enhanced Navbar scroll effect with active section tracking
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        // Add/remove scrolled class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active navigation link based on scroll position
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current link
        const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    });
    
    // Countdown Timer is now handled by countdown.js
    
    // RSVP Form Logic - with safety checks
    const rsvpForm = document.getElementById('rsvp-form');
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const guestsGroup = document.getElementById('guests-group');
    const dietaryGroup = document.getElementById('dietary-group');
    const rsvpFeedback = document.getElementById('rsvp-feedback');
    
    // Show/hide additional fields based on attendance
    if (attendanceRadios.length > 0 && guestsGroup && dietaryGroup) {
        attendanceRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'yes') {
                    guestsGroup.style.display = 'flex';
                    dietaryGroup.style.display = 'flex';
                } else {
                    guestsGroup.style.display = 'none';
                    dietaryGroup.style.display = 'none';
                }
            });
        });
    }
    
    // RSVP Form Submission
    if (rsvpForm && rsvpFeedback) {
        rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading message
        rsvpFeedback.innerHTML = '<p style="color: #666;">Sending your RSVP...</p>';
        rsvpFeedback.style.display = 'block';
        
        // Get form data
        const formData = new FormData(rsvpForm);
        const rsvpData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            attendance: formData.get('attendance'),
            guests: formData.get('guests') || '1',
            dietary: formData.get('dietary') || '',
            message: formData.get('message') || '',
            submittedAt: new Date().toISOString()
        };
        
        // Simulate form submission (replace with actual backend integration)
        setTimeout(() => {
            console.log('RSVP Data:', rsvpData);
            
            rsvpFeedback.innerHTML = `
                <div class="rsvp-feedback success">
                    <p><strong>Thank you, ${rsvpData.firstName}!</strong></p>
                    <p>Your RSVP has been received. We can't wait to celebrate with you!</p>
                </div>
            `;
            
            // Reset form
            rsvpForm.reset();
            guestsGroup.style.display = 'none';
            dietaryGroup.style.display = 'none';
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                rsvpFeedback.style.display = 'none';
            }, 5000);
            
        }, 1500);
        });
    }
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const lazyObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                lazyObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Animate sections on scroll
    const animateElements = document.querySelectorAll('.section-title, .story-text, .detail-card, .schedule-item, .gallery-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        lazyObserver.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-background');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            let ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Add typing effect to hero subtitle
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 2000); // Start after other animations
    }
    
    // Add floating animation to couple photo
    const couplePhoto = document.querySelector('.couple-photo');
    if (couplePhoto) {
        setInterval(() => {
            couplePhoto.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                couplePhoto.style.transform = 'translateY(0)';
            }, 1000);
        }, 3000);
    }
});

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Utility function to format date
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Mobile-specific enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Touch gesture support for gallery
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        let startY = 0;
        let startX = 0;
        
        item.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        });
        
        item.addEventListener('touchmove', function(e) {
            e.preventDefault(); // Prevent scrolling while swiping
        });
        
        item.addEventListener('touchend', function(e) {
            const endY = e.changedTouches[0].clientY;
            const endX = e.changedTouches[0].clientX;
            const diffY = startY - endY;
            const diffX = startX - endX;
            
            // Simple tap detection
            if (Math.abs(diffY) < 10 && Math.abs(diffX) < 10) {
                // Add tap effect
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
    
    // Improve form validation for mobile
    const form = document.getElementById('rsvp-form');
    if (form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('invalid', function(e) {
                e.preventDefault();
                
                // Custom mobile-friendly error display
                const errorMsg = document.createElement('div');
                errorMsg.className = 'mobile-error-msg';
                errorMsg.textContent = 'Please fill out this field';
                errorMsg.style.cssText = `
                    color: #e74c3c;
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                    padding: 0.5rem;
                    background-color: #fdf2f2;
                    border-radius: 4px;
                    border-left: 3px solid #e74c3c;
                `;
                
                // Remove existing error message
                const existingError = input.parentNode.querySelector('.mobile-error-msg');
                if (existingError) {
                    existingError.remove();
                }
                
                input.parentNode.appendChild(errorMsg);
                
                // Remove error message when user starts typing
                input.addEventListener('input', function() {
                    const errorMsg = input.parentNode.querySelector('.mobile-error-msg');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }, { once: true });
            });
        });
    }
    
    // Mobile-optimized smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = window.innerWidth < 768 ? 70 : 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add loading states for better mobile UX
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') {
                const originalText = this.textContent;
                this.textContent = 'Sending...';
                this.disabled = true;
                
                // Re-enable after form processing
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 3000);
            }
        });
    });
    
    // Optimize images for mobile (lazy loading simulation)
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                const tempImg = new Image();
                tempImg.onload = function() {
                    img.style.opacity = '1';
                };
                tempImg.src = img.src;
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Mobile performance optimization
    let ticking = false;
    function updateOnScroll() {
        // Throttle scroll events for better performance
        if (!ticking) {
            requestAnimationFrame(function() {
                // Your scroll-based animations here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateOnScroll, { passive: true });
    
    // Add haptic feedback simulation for touch devices
    function addHapticFeedback(element) {
        if ('vibrate' in navigator && window.innerWidth < 768) {
            element.addEventListener('touchstart', function() {
                navigator.vibrate(10); // Very short vibration
            });
        }
    }
    
    // Apply haptic feedback to interactive elements
    document.querySelectorAll('.btn, .nav-link, .radio-label').forEach(addHapticFeedback);
    
    // Mobile keyboard handling
    let initialViewportHeight = window.innerHeight;
    
    window.addEventListener('resize', function() {
        if (window.innerWidth < 768) {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            
            // Keyboard is likely open if height decreased significantly
            if (heightDifference > 150) {
                document.body.classList.add('keyboard-open');
            } else {
                document.body.classList.remove('keyboard-open');
            }
        }
    });
});

// Interactive Photo Gallery with Lightbox
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const categoryButtons = document.querySelectorAll('.gallery-category-btn');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');
    const lightboxThumbnails = document.getElementById('lightbox-thumbnails');
    const loadMoreBtn = document.getElementById('load-more-photos');
    
    // Safety check - exit if critical elements missing
    if (!lightboxOverlay || !lightboxClose || !lightboxNext || !lightboxPrev) {
        console.log('⚠️ Lightbox elements not found, skipping lightbox initialization');
        return;
    }
    
    let currentImageIndex = 0;
    let filteredImages = Array.from(galleryItems);
    
    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter images
            filterImages(category);
        });
    });
    
    function filterImages(category) {
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.remove('fade-out');
                    item.classList.add('fade-in');
                }, 10);
            } else {
                item.classList.remove('fade-in');
                item.classList.add('fade-out');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Update filtered images array
        setTimeout(() => {
            filteredImages = Array.from(galleryItems).filter(item => 
                item.style.display !== 'none'
            );
            updateLightboxTotal();
        }, 300);
    }
    
    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const category = document.querySelector('.gallery-category-btn.active').getAttribute('data-category');
            currentImageIndex = filteredImages.indexOf(item);
            openLightbox();
        });
    });
    
    function openLightbox() {
        if (filteredImages.length === 0) return;
        
        const currentItem = filteredImages[currentImageIndex];
        const imageSrc = currentItem.getAttribute('data-src');
        const caption = currentItem.getAttribute('data-caption');
        
        lightboxImage.src = imageSrc;
        lightboxCaption.textContent = caption;
        lightboxCurrent.textContent = currentImageIndex + 1;
        lightboxTotal.textContent = filteredImages.length;
        
        // Generate thumbnails
        generateThumbnails();
        
        // Show lightbox
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleKeydown);
    }
    
    function closeLightbox() {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeydown);
    }
    
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
        updateLightboxImage();
    }
    
    function prevImage() {
        currentImageIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
        updateLightboxImage();
    }
    
    function updateLightboxImage() {
        const currentItem = filteredImages[currentImageIndex];
        const imageSrc = currentItem.getAttribute('data-src');
        const caption = currentItem.getAttribute('data-caption');
        
        // Fade out
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = imageSrc;
            lightboxCaption.textContent = caption;
            lightboxCurrent.textContent = currentImageIndex + 1;
            
            // Update active thumbnail
            updateActiveThumbnail();
            
            // Fade in
            lightboxImage.style.opacity = '1';
        }, 150);
    }
    
    function generateThumbnails() {
        lightboxThumbnails.innerHTML = '';
        
        filteredImages.forEach((item, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = item.querySelector('.gallery-image').src;
            thumbnail.className = 'lightbox-thumbnail';
            thumbnail.addEventListener('click', () => {
                currentImageIndex = index;
                updateLightboxImage();
            });
            
            if (index === currentImageIndex) {
                thumbnail.classList.add('active');
            }
            
            lightboxThumbnails.appendChild(thumbnail);
        });
    }
    
    function updateActiveThumbnail() {
        const thumbnails = lightboxThumbnails.querySelectorAll('.lightbox-thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentImageIndex);
        });
    }
    
    function updateLightboxTotal() {
        if (lightboxTotal) {
            lightboxTotal.textContent = filteredImages.length;
        }
    }
    
    function handleKeydown(e) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }
    
    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);
    
    // Close lightbox when clicking on overlay
    lightboxOverlay.addEventListener('click', function(e) {
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightboxOverlay.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightboxOverlay.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage(); // Swipe left - next image
            } else {
                prevImage(); // Swipe right - previous image
            }
        }
    }
    
    // Load more photos functionality (placeholder)
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // This would typically load more photos from a server
            this.textContent = 'No more photos to load';
            this.disabled = true;
            
            // For demo purposes, show a message
            setTimeout(() => {
                this.textContent = 'All photos loaded!';
            }, 1000);
        });
    }
    
    // Initialize gallery
    updateLightboxTotal();
    
    // Add loading animation for images
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity to 0 for loading effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    // FAQ Accordion - Now handled by standalone FAQ handler at end of file

    // Screen reader announcements
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Add screen reader only class if it doesn't exist
    if (!document.querySelector('.sr-only')) {
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }
});

// ============================================================
// STANDALONE FAQ HANDLER - Completely isolated
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 [FAQ STANDALONE] Initializing FAQ system...');
    
    // Wait for DOM to be fully ready
    setTimeout(function() {
        const faqItems = document.querySelectorAll('.faq-item');
        console.log('📊 [FAQ STANDALONE] Found FAQ items:', faqItems.length);
        
        if (faqItems.length === 0) {
            console.error('❌ [FAQ STANDALONE] No FAQ items found in DOM');
            return;
        }
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            
            console.log(`🔍 [FAQ STANDALONE] Item ${index}:`, {
                question: !!question,
                answer: !!answer,
                toggle: !!toggle,
                questionText: question ? question.textContent.substring(0, 30) : 'N/A'
            });
            
            if (!question) {
                console.error(`❌ [FAQ STANDALONE] Item ${index} - Missing question element`);
                return;
            }
            
            // Add click handler directly to the question div
            question.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`🖱️ [FAQ STANDALONE] Clicked item ${index}`);
                
                const isActive = item.classList.contains('active');
                console.log(`📊 [FAQ STANDALONE] State: ${isActive ? 'ACTIVE' : 'INACTIVE'}`);
                
                // Close ALL FAQs
                document.querySelectorAll('.faq-item').forEach(faq => {
                    faq.classList.remove('active');
                    const t = faq.querySelector('.faq-toggle');
                    if (t) {
                        t.textContent = 'expand_more';
                    }
                });
                
                // If it was closed, open it
                if (!isActive) {
                    item.classList.add('active');
                    if (toggle) {
                        toggle.textContent = 'expand_less';
                    }
                    console.log(`✅ [FAQ STANDALONE] Opened item ${index}`);
                } else {
                    console.log(`✅ [FAQ STANDALONE] Closed item ${index}`);
                }
            };
            
            console.log(`✅ [FAQ STANDALONE] Item ${index} handler attached`);
        });
        
        console.log('🎉 [FAQ STANDALONE] FAQ system ready!');
    }, 500); // Wait 500ms to ensure DOM is completely ready
});

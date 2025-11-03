// Website Monitoring and Health Check Script
(function() {
    'use strict';

    // Logging configuration
    const LOG_LEVEL = {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3
    };

    let currentLogLevel = LOG_LEVEL.INFO;
    let lastHealthReport = null;
    let errorCount = 0;

    // Optimized logging function
    function log(level, message, data = null) {
        if (level > currentLogLevel) return;

        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}]`;

        switch(level) {
            case LOG_LEVEL.ERROR:
                console.error(`${prefix} ❌ ${message}`, data || '');
                break;
            case LOG_LEVEL.WARN:
                console.warn(`${prefix} ⚠️ ${message}`, data || '');
                break;
            case LOG_LEVEL.INFO:
                console.info(`${prefix} ℹ️ ${message}`, data || '');
                break;
            case LOG_LEVEL.DEBUG:
                console.debug(`${prefix} 🔍 ${message}`, data || '');
                break;
        }
    }

    console.log('📊 Website Monitor Starting...');

    const monitor = {
        components: {
            maps: { status: 'unknown', lastCheck: null, details: {} },
            gallery: { status: 'unknown', lastCheck: null, details: {} },
            video: { status: 'unknown', lastCheck: null, details: {} },
            rsvp: { status: 'unknown', lastCheck: null, details: {} },
            navigation: { status: 'unknown', lastCheck: null, details: {} },
            slideshow: { status: 'unknown', lastCheck: null, details: {} }
        },

        init: function() {
            log(LOG_LEVEL.INFO, 'Starting component health checks');
            this.runHealthChecks();
            this.startPeriodicMonitoring();
        },

        runHealthChecks: function() {
            log(LOG_LEVEL.DEBUG, 'Running full health check');

            this.checkMaps();
            this.checkGallery();
            this.checkVideo();
            this.checkRSVP();
            this.checkNavigation();
            this.checkSlideshow();

            this.printStatusReport();
        },

        checkMaps: function() {
            const ceremonyMap = document.getElementById('ceremony-map');
            const receptionMap = document.getElementById('reception-map');
            const apiKey = window.googleMapsApiKey;

            const oldStatus = this.components.maps.status;

            this.components.maps.details = {
                ceremonyElement: !!ceremonyMap,
                receptionElement: !!receptionMap,
                apiKey: apiKey,
                apiKeyValid: apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY',
                ceremonyHasContent: ceremonyMap ? ceremonyMap.children.length > 0 : false,
                receptionHasContent: receptionMap ? receptionMap.children.length > 0 : false,
                googleLoaded: typeof google !== 'undefined',
                mapsApiLoaded: typeof google !== 'undefined' && typeof google.maps !== 'undefined'
            };

            if (this.components.maps.details.ceremonyHasContent && this.components.maps.details.receptionHasContent) {
                this.components.maps.status = 'healthy';
            } else if (this.components.maps.details.ceremonyElement && this.components.maps.details.receptionElement) {
                this.components.maps.status = 'loading';
            } else {
                this.components.maps.status = 'error';
            }

            this.components.maps.lastCheck = new Date();

            // Only log if status changed or it's an error
            if (oldStatus !== this.components.maps.status || this.components.maps.status === 'error') {
                log(LOG_LEVEL.INFO, `Maps: ${this.components.maps.status.toUpperCase()}`);
                if (this.components.maps.status === 'error') {
                    log(LOG_LEVEL.ERROR, 'Maps details', this.components.maps.details);
                }
            }
        },

        checkGallery: function() {
            const gallerySection = document.querySelector('#gallery') || document.querySelector('.gallery-section');
            const imageShowcaseLink = document.querySelector('a[href="image-showcase.html"]');

            const oldStatus = this.components.gallery.status;

            this.components.gallery.details = {
                gallerySection: !!gallerySection,
                imageShowcaseLink: !!imageShowcaseLink,
                imagesLoaded: 0,
                totalImages: 0
            };

            if (gallerySection) {
                const images = gallerySection.querySelectorAll('img');
                this.components.gallery.details.totalImages = images.length;
                this.components.gallery.details.imagesLoaded = Array.from(images).filter(img => img.complete && !img.error).length;
            }

            if (this.components.gallery.details.gallerySection || this.components.gallery.details.imageShowcaseLink) {
                this.components.gallery.status = 'present';
            } else {
                this.components.gallery.status = 'missing';
            }

            this.components.gallery.lastCheck = new Date();

            if (oldStatus !== this.components.gallery.status || this.components.gallery.status === 'error') {
                log(LOG_LEVEL.INFO, `Gallery: ${this.components.gallery.status.toUpperCase()}`);
            }
        },

        checkVideo: function() {
            const videoElement = document.getElementById('wedding-video');
            const videoSection = document.querySelector('#video-section') || document.querySelector('.video-section');

            const oldStatus = this.components.video.status;

            this.components.video.details = {
                videoElement: !!videoElement,
                videoSection: !!videoSection,
                elementType: videoElement ? videoElement.tagName : null,
                isIframe: videoElement ? videoElement.tagName === 'IFRAME' : false,
                src: videoElement ? videoElement.src || videoElement.getAttribute('src') : null
            };

            if (this.components.video.details.videoElement && this.components.video.details.videoSection) {
                this.components.video.status = 'present';
            } else {
                this.components.video.status = 'missing';
            }

            this.components.video.lastCheck = new Date();

            if (oldStatus !== this.components.video.status || this.components.video.status === 'error') {
                log(LOG_LEVEL.INFO, `Video: ${this.components.video.status.toUpperCase()}`);
            }
        },

        checkRSVP: function() {
            const rsvpSection = document.querySelector('#rsvp') || document.querySelector('.rsvp-section');
            const googleForm = document.querySelector('iframe[src*="docs.google.com/forms"]');

            const oldStatus = this.components.rsvp.status;

            this.components.rsvp.details = {
                rsvpSection: !!rsvpSection,
                googleForm: !!googleForm,
                formSrc: googleForm ? googleForm.src : null
            };

            if (this.components.rsvp.details.googleForm) {
                this.components.rsvp.status = 'loaded';
            } else if (this.components.rsvp.details.rsvpSection) {
                this.components.rsvp.status = 'present';
            } else {
                this.components.rsvp.status = 'missing';
            }

            this.components.rsvp.lastCheck = new Date();

            if (oldStatus !== this.components.rsvp.status || this.components.rsvp.status === 'error') {
                log(LOG_LEVEL.INFO, `RSVP: ${this.components.rsvp.status.toUpperCase()}`);
            }
        },

        checkNavigation: function() {
            const nav = document.querySelector('nav') || document.querySelector('.navbar');
            const navLinks = document.querySelectorAll('nav a, .navbar a');
            const mobileMenu = document.querySelector('.nav-toggle') || document.querySelector('.mobile-menu-toggle');

            const oldStatus = this.components.navigation.status;

            this.components.navigation.details = {
                navElement: !!nav,
                navLinks: navLinks.length,
                mobileMenu: !!mobileMenu,
                sections: document.querySelectorAll('section[id]').length
            };

            if (this.components.navigation.details.navElement && this.components.navigation.details.navLinks > 0) {
                this.components.navigation.status = 'healthy';
            } else {
                this.components.navigation.status = 'error';
            }

            this.components.navigation.lastCheck = new Date();

            if (oldStatus !== this.components.navigation.status || this.components.navigation.status === 'error') {
                log(LOG_LEVEL.INFO, `Navigation: ${this.components.navigation.status.toUpperCase()}`);
            }
        },

        checkSlideshow: function() {
            const slideshow = document.querySelector('.hero-background-slideshow');
            const slides = document.querySelectorAll('.hero-bg-image');
            const dots = document.querySelectorAll('.nav-dot');

            const oldStatus = this.components.slideshow.status;

            this.components.slideshow.details = {
                slideshow: !!slideshow,
                slides: slides.length,
                dots: dots.length,
                activeSlide: document.querySelector('.hero-bg-image.active') ? 'found' : 'none'
            };

            if (this.components.slideshow.details.slideshow && this.components.slideshow.details.slides > 0) {
                this.components.slideshow.status = 'healthy';
            } else {
                this.components.slideshow.status = 'error';
            }

            this.components.slideshow.lastCheck = new Date();

            if (oldStatus !== this.components.slideshow.status || this.components.slideshow.status === 'error') {
                log(LOG_LEVEL.INFO, `Slideshow: ${this.components.slideshow.status.toUpperCase()}`);
            }
        },

        printStatusReport: function() {
            // Only print report if there are changes or errors
            const currentReport = this.getStatusSummary();
            const hasChanges = !lastHealthReport || JSON.stringify(currentReport) !== JSON.stringify(lastHealthReport);
            const hasErrors = Object.values(this.components).some(comp => comp.status === 'error' || comp.status === 'missing');

            if (hasChanges || hasErrors) {
                log(LOG_LEVEL.INFO, '=== HEALTH REPORT ===');

                Object.entries(this.components).forEach(([component, data]) => {
                    const statusEmoji = {
                        healthy: '✅',
                        present: '✅',
                        loaded: '✅',
                        loading: '⏳',
                        error: '❌',
                        missing: '❌',
                        unknown: '❓'
                    }[data.status] || '❓';

                    const componentName = component.charAt(0).toUpperCase() + component.slice(1);
                    console.log(`${statusEmoji} ${componentName}: ${data.status.toUpperCase()}`);
                });

                if (hasErrors) {
                    log(LOG_LEVEL.WARN, `${errorCount} issues detected - check details above`);
                }

                lastHealthReport = currentReport;
            }
        },

        getStatusSummary: function() {
            const summary = {};
            Object.entries(this.components).forEach(([component, data]) => {
                summary[component] = data.status;
            });
            return summary;
        },

        startPeriodicMonitoring: function() {
            // Check every 60 seconds (reduced frequency)
            setInterval(() => {
                this.runHealthChecks();
            }, 60000);

            log(LOG_LEVEL.DEBUG, 'Periodic monitoring started (60s intervals)');
        }
    };

    // Start monitoring when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => monitor.init());
    } else {
        monitor.init();
    }

    // Make monitor available globally for debugging
    window.websiteMonitor = monitor;

    console.log('✅ Website Monitor Active - Type "websiteMonitor.runHealthChecks()" in console for manual check');

})();

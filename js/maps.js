/**
 * Wedding Venues Maps Integration
 * Handles Google Maps integration for ceremony and reception venues
 */

(function() {
    'use strict';

    // Venue configurations
    const venues = {
        ceremony: {
            name: 'San Roque Parish Church',
            address: 'Buncayo Park Subdivision, San Roque, San Pablo City, Laguna',
            lat: 14.0676,
            lng: 121.3263,
            description: 'Beautiful Catholic parish church for our wedding ceremony'
        },
        reception: {
            name: 'Reception Venue',
            address: 'Km 83 Maharlika Highway, Brgy. San Francisco Calihan, San Pablo City, Laguna',
            lat: 14.0583,
            lng: 121.3167,
            description: 'Elegant reception venue for our wedding celebration'
        }
    };

    let mapsLoaded = false;
    let ceremonyMap = null;
    let receptionMap = null;

    /**
     * Initialize interactive maps with venue info panels
     */
    function initializeMaps() {
        if (mapsLoaded) return;

        // Check if Google Maps API is available
        if (typeof google === 'undefined' || !google.maps) {
            console.log('Google Maps API not loaded, using fallback');
            initializeFallbackMaps();
            return;
        }

        // Check if API key was provided
        if (window.googleMapsApiKey === 'YOUR_GOOGLE_MAPS_API_KEY' || !window.googleMapsApiKey) {
            console.log('Google Maps API key not provided, using fallback');
            initializeFallbackMaps();
            return;
        }

        try {
            // Initialize ceremony map
            initializeVenueMap('ceremony-map', venues.ceremony);

            // Initialize reception map
            initializeVenueMap('reception-map', venues.reception);

            mapsLoaded = true;
            console.log('Interactive Google Maps initialized successfully');
        } catch (error) {
            console.error('Error initializing Google Maps:', error);
            initializeFallbackMaps();
        }
    }


    /**
     * Initialize fallback maps (when static maps fail to load)
     */
    function initializeFallbackMaps() {
        const ceremonyMapElement = document.getElementById('ceremony-map');
        const receptionMapElement = document.getElementById('reception-map');

        if (ceremonyMapElement) {
            ceremonyMapElement.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666; padding: 2rem; text-align: center;">
                    <div style="margin-bottom: 1.5rem; font-size: 1.2rem;">
                        <strong>${venues.ceremony.name}</strong><br>
                        ${venues.ceremony.address}
                    </div>
                    <button class="btn btn-outline" onclick="window.open('https://maps.google.com/maps?q=${encodeURIComponent(venues.ceremony.address)}', '_blank')" style="font-size: 0.9rem; padding: 0.7rem 1.2rem;">
                        View in Google Maps
                    </button>
                </div>
            `;
        }

        if (receptionMapElement) {
            receptionMapElement.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666; padding: 2rem; text-align: center;">
                    <div style="margin-bottom: 1.5rem; font-size: 1.2rem;">
                        <strong>${venues.reception.name}</strong><br>
                        ${venues.reception.address}
                    </div>
                    <button class="btn btn-outline" onclick="window.open('https://maps.google.com/maps?q=${encodeURIComponent(venues.reception.address)}', '_blank')" style="font-size: 0.9rem; padding: 0.7rem 1.2rem;">
                        View in Google Maps
                    </button>
                </div>
            `;
        }

        mapsLoaded = true;
    }

    /**
     * Initialize a specific venue map with interactive features
     */
    function initializeVenueMap(mapElementId, venue) {
        const mapElement = document.getElementById(mapElementId);
        if (!mapElement) return;

        const mapOptions = {
            center: { lat: venue.lat, lng: venue.lng },
            zoom: 16,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "geometry.fill",
                    "stylers": [{"weight": "2.00"}]
                },
                {
                    "featureType": "all",
                    "elementType": "geometry.stroke",
                    "stylers": [{"color": "#9c9c9c"}]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text",
                    "stylers": [{"visibility": "on"}]
                }
            ],
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: false,
            fullscreenControl: true
        };

        const map = new google.maps.Map(mapElement, mapOptions);

        // Add click listener to map for info display
        map.addListener('click', () => {    
            showVenueInfo(mapElementId);
        });

        // Store map reference
        if (mapElementId === 'ceremony-map') {
            ceremonyMap = map;
        } else {
            receptionMap = map;
        }
    }

    /**
     * Show venue info panel
     */
    function showVenueInfo(mapElementId) {
        // Hide all info panels first
        document.querySelectorAll('.map-info-panel').forEach(panel => {
            panel.style.display = 'none';
        });

        // Show the specific panel
        const panel = document.getElementById(mapElementId === 'ceremony-map' ? 'ceremony-info-panel' : 'reception-info-panel');
        if (panel) {
            panel.style.display = 'block';
        }
    }

    /**
     * Close venue info panel
     */
    function closeVenueInfo(venueType) {
        const panel = document.getElementById(venueType + '-info-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    /**
     * Get directions to venue
     */
    function getDirections(address) {
        // Try different map applications
        const encodedAddress = encodeURIComponent(address);

        // Check if mobile device
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            // Try Google Maps app first, fallback to web
            const googleMapsUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
            const appleMapsUrl = `http://maps.apple.com/?q=${encodedAddress}`;

            // Detect iOS for Apple Maps
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                window.open(appleMapsUrl, '_blank');
            } else {
                window.open(googleMapsUrl, '_blank');
            }
        } else {
            // Desktop - open Google Maps in new tab
            window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
        }
    }

    /**
     * Handle directions button clicks
     */
    function handleDirectionsClick(event) {
        const button = event.target.closest('.map-directions-btn');
        if (!button) return;

        const address = button.dataset.address;
        if (!address) return;

        // Try different map applications
        const encodedAddress = encodeURIComponent(address);
        
        // Check if mobile device
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Try Google Maps app first, fallback to web
            const googleMapsUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
            const appleMapsUrl = `http://maps.apple.com/?q=${encodedAddress}`;
            
            // Detect iOS for Apple Maps
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                window.open(appleMapsUrl, '_blank');
            } else {
                window.open(googleMapsUrl, '_blank');
            }
        } else {
            // Desktop - open Google Maps in new tab
            window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
        }

        // Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'directions_click', {
                event_category: 'venue',
                event_label: address
            });
        }
    }

    /**
     * Set up intersection observer for lazy loading maps
     */
    function setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            setTimeout(initializeMaps, 1000);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !mapsLoaded) {
                    initializeMaps();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px',
            threshold: 0.1
        });

        const venuesSection = document.getElementById('venues');
        if (venuesSection) {
            observer.observe(venuesSection);
        }
    }

    /**
     * Add smooth scrolling animation to venue cards
     */
    function addScrollAnimations() {
        const venueCards = document.querySelectorAll('.venue-card');
        
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.2
        });

        venueCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
            observer.observe(card);
        });
    }

    /**
     * Initialize all venue functionality
     */
    function init() {
        // Set up intersection observer for maps
        setupIntersectionObserver();

        // Add scroll animations
        addScrollAnimations();

        // Set up directions button event listeners
        document.addEventListener('click', handleDirectionsClick);

        // Set up error handling for API failures
        setupApiErrorHandling();

        console.log('Venues maps module initialized');
    }

    /**
     * Set up error handling for static map failures
     */
    function setupApiErrorHandling() {
        // Handle static map loading errors
        const staticMaps = document.querySelectorAll('.static-map');
        staticMaps.forEach(img => {
            img.addEventListener('error', (e) => {
                console.log('Static map failed to load, showing fallback');
                const venueMap = e.target.closest('.venue-map');
                if (venueMap) {
                    initializeFallbackMaps();
                }
            });
        });

        // If static maps fail to load after 10 seconds, show fallback
        setTimeout(() => {
            if (!mapsLoaded) {
                const hasStaticMaps = document.querySelectorAll('.static-map').length > 0;
                if (hasStaticMaps) {
                    // Check if any static maps actually loaded
                    const loadedMaps = document.querySelectorAll('.static-map[complete]');
                    if (loadedMaps.length === 0) {
                        console.log('Static maps failed to load, showing fallback maps');
                        initializeFallbackMaps();
                    }
                }
            }
        }, 10000);
    }

    /**
     * Global API for debugging and external control
     */
    window.venueMaps = {
        init: init,
        initializeMaps: initializeMaps,
        venues: venues,
        showVenueInfo: showVenueInfo,
        closeVenueInfo: closeVenueInfo,
        getDirections: getDirections,
        initializeFallbackMaps: initializeFallbackMaps,
        getCeremonyMap: () => ceremonyMap,
        getReceptionMap: () => receptionMap
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

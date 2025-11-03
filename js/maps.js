// Wedding Venue Maps - Revamped Implementation
// This ensures maps load properly whether API is available or not

// Define the callback function FIRST (before the API loads)
window.venueMapsInit = function() {
    console.log('🗺️ Google Maps API callback triggered!');
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        initializeVenueMaps();
    }, 100);
};

// Venue data
const VENUES = {
    ceremony: {
        name: "San Roque Parish Church",
        address: "Buncayo Park Subdivision, San Roque, San Pablo City, Laguna",
        coordinates: { lat: 14.0678, lng: 121.3254 },
        description: "Join us for our wedding ceremony"
    },
    reception: {
        name: "The Coco Palace",
        address: "Km 83 Maharlika Highway, Brgy. San Francisco Calihan, San Pablo City, Laguna",
        coordinates: { lat: 14.0720, lng: 121.3300 },
        description: "Celebrate with us at the reception"
    }
};

// Store map instances
const mapInstances = {};
const markerInstances = {};

// Main initialization function
function initializeVenueMaps() {
    console.log('🚀 Starting venue maps initialization...');
    
    // Check if Google Maps API is available
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.warn('⚠️ Google Maps API not available - showing fallback');
        showFallbackMaps();
        return;
    }
    
    // Check API key - but continue anyway (Google will show watermarked maps)
    const hasRealKey = window.googleMapsApiKey && window.googleMapsApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY';
    if (!hasRealKey) {
        console.warn('⚠️ Using placeholder API key - maps will show with "For development purposes only" watermark');
        console.log('💡 To remove watermark, get a real API key from: https://console.cloud.google.com/google/maps-apis');
    } else {
        console.log('✅ Using real API key');
    }
    
    try {
        // Initialize both venue maps
        createVenueMap('ceremony');
        createVenueMap('reception');
        
        console.log('✅ Interactive maps initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing maps:', error);
        showFallbackMaps();
    }
}

// Create an interactive map for a venue
function createVenueMap(venueType) {
    const venue = VENUES[venueType];
    const mapContainer = document.getElementById(`${venueType}-map`);
    
    if (!mapContainer) {
        console.error(`❌ Map container not found: ${venueType}-map`);
        return;
    }
    
    console.log(`🗺️ Creating ${venueType} map...`);
    
    // Ensure container is visible and has dimensions
    mapContainer.style.display = 'block';
    mapContainer.style.width = '100%';
    mapContainer.style.height = '100%';
    mapContainer.style.minHeight = '400px';
    
    // Map configuration
    const mapOptions = {
        zoom: 15,
        center: venue.coordinates,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    };
    
    // Create the map
    mapInstances[venueType] = new google.maps.Map(mapContainer, mapOptions);
    
    // Create custom marker icon
    const markerIcon = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#d4a574" stroke="#8b7355" stroke-width="2"/>
                <path d="M20 8l6 12-6 8-6-8z" fill="white"/>
                <circle cx="20" cy="18" r="2" fill="#d4a574"/>
            </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 40)
    };
    
    // Create marker
    markerInstances[venueType] = new google.maps.Marker({
        position: venue.coordinates,
        map: mapInstances[venueType],
        title: venue.name,
        animation: google.maps.Animation.DROP,
        icon: markerIcon
    });
    
    // Create info window
    const infoWindowContent = `
        <div style="font-family: 'Inter', sans-serif; max-width: 250px; padding: 10px;">
            <h3 style="margin: 0 0 8px 0; color: #8b7355; font-family: 'Playfair Display', serif; font-size: 18px;">
                ${venue.name}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; line-height: 1.4;">
                ${venue.address}
            </p>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #888;">
                ${venue.description}
            </p>
            <button onclick="getDirections('${venue.address}')"
                    style="background: #d4a574; color: white; border: none; padding: 10px 20px;
                           border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: 500;
                           transition: all 0.2s;">
                🧭 Get Directions
            </button>
        </div>
    `;
    
    const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
    });
    
    // Show info window on marker click
    markerInstances[venueType].addListener('click', () => {
        infoWindow.open(mapInstances[venueType], markerInstances[venueType]);
    });
    
    // Auto-open info window after a delay
    setTimeout(() => {
        infoWindow.open(mapInstances[venueType], markerInstances[venueType]);
    }, 1000 + (venueType === 'reception' ? 500 : 0)); // Stagger the openings
    
    console.log(`✅ ${venueType} map created successfully`);
}

// Show fallback static maps
function showFallbackMaps() {
    console.log('📍 Showing fallback maps');
    
    Object.keys(VENUES).forEach(venueType => {
        const venue = VENUES[venueType];
        const mapContainer = document.getElementById(`${venueType}-map`);
        
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="width: 100%; height: 100%; min-height: 400px;
                            background: linear-gradient(135deg, #f8f5f1 0%, #f0ede8 100%);
                            display: flex; align-items: center; justify-content: center;
                            border-radius: 8px; text-align: center; padding: 30px; box-sizing: border-box;">
                    <div>
                        <div style="font-size: 64px; color: #d4a574; margin-bottom: 20px;">📍</div>
                        <h3 style="color: #8b7355; margin: 0 0 12px 0; font-family: 'Playfair Display', serif; font-size: 22px;">
                            ${venue.name}
                        </h3>
                        <p style="color: #666; margin: 0 0 8px 0; font-size: 15px; line-height: 1.5;">
                            ${venue.address}
                        </p>
                        <p style="color: #888; margin: 0 0 25px 0; font-size: 14px;">
                            ${venue.description}
                        </p>
                        <button onclick="getDirections('${venue.address}')"
                                style="background: #d4a574; color: white; border: none; padding: 14px 28px;
                                       border-radius: 6px; cursor: pointer; font-size: 15px; font-weight: 500;
                                       transition: all 0.2s; box-shadow: 0 2px 8px rgba(212, 165, 116, 0.3);">
                            🧭 Get Directions
                        </button>
                        <p style="color: #aaa; margin: 20px 0 0 0; font-size: 12px;">
                            Interactive map unavailable
                        </p>
                    </div>
                </div>
            `;
        }
    });
}

// Get directions to venue
function getDirections(address) {
    console.log('🧭 Getting directions to:', address);
    
    if (!address) {
        console.error('❌ No address provided');
        return;
    }
    
    // Try to get user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const origin = `${position.coords.latitude},${position.coords.longitude}`;
                const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(address)}`;
                console.log('🚗 Opening directions with user location');
                window.open(url, '_blank');
            },
            (error) => {
                console.log('📍 Geolocation unavailable, using destination only');
                const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
                window.open(url, '_blank');
            }
        );
    } else {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        window.open(url, '_blank');
    }
}

// Close venue info panel (for mobile UI)
function closeVenueInfo(venueType) {
    const panel = document.getElementById(`${venueType}-info-panel`);
    if (panel) {
        panel.style.display = 'none';
    }
}

// Make functions globally available
window.getDirections = getDirections;
window.closeVenueInfo = closeVenueInfo;

// Global error handler for Google Maps authentication failures (just log, don't switch to fallback)
window.gm_authFailure = function() {
    console.warn('🚨 Google Maps authentication failed - maps will show with watermark');
    console.log('💡 This is normal with placeholder API key. Maps are still interactive!');
};

console.log('🗺️ Maps module loaded - callback registered as window.venueMapsInit');

// Fallback initialization if API doesn't load within 3 seconds
setTimeout(() => {
    if (Object.keys(mapInstances).length === 0) {
        console.log('⏰ Fallback: API not loaded after 3 seconds');
        
        if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
            console.log('✅ API is available, initializing now');
            initializeVenueMaps();
        } else {
            console.log('📍 API unavailable, showing fallback');
            showFallbackMaps();
        }
    }
}, 3000);
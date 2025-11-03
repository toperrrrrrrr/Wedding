// Wedding Venue Maps - Now using iframe embeds
// Maps are embedded directly in HTML - no JavaScript initialization needed

// Empty callback to prevent errors if Google Maps API script loads
window.venueMapsInit = function() {
    console.log('✅ Maps using iframe embeds - no JavaScript needed');
};

// Get directions to a venue (used by direction buttons)
function getDirections(address) {
    if (!address) {
        console.error('❌ No address provided for directions');
        return;
    }
    
    // Try to get user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const origin = `${position.coords.latitude},${position.coords.longitude}`;
                const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(address)}`;
                window.open(url, '_blank');
            },
            (error) => {
                // If geolocation fails, open directions without origin
                const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
                window.open(url, '_blank');
            }
        );
    } else {
        // Browser doesn't support geolocation
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        window.open(url, '_blank');
    }
}

// Make getDirections available globally
window.getDirections = getDirections;

console.log('🗺️ Maps module loaded - iframe embeds active');

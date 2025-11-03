// Enhanced Console Debugging Tool for Wedding Website
(function() {
    'use strict';

    console.log('🔧 Debug Console Tool Loaded');

    // Create a floating debug panel
    function createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            max-height: 400px;
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            font-family: monospace;
            font-size: 11px;
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
            overflow-y: auto;
            border: 1px solid #333;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold;">🐛 Debug Monitor</div>
            <div id="debug-status">⏳ Initializing...</div>
            <div id="debug-maps" style="margin-top: 10px;">🗺️ Maps: Waiting...</div>
            <div id="debug-gallery" style="margin-top: 5px;">🖼️ Gallery: Waiting...</div>
            <div id="debug-video" style="margin-top: 5px;">🎥 Video: Waiting...</div>
            <div id="debug-rsvp" style="margin-top: 5px;">📝 RSVP: Waiting...</div>
            <div style="margin-top: 10px; font-size: 11px;">
                <button onclick="websiteMonitor.runHealthChecks()" style="background: #4CAF50; color: white; border: none; padding: 3px 6px; margin-right: 5px; cursor: pointer; font-size: 10px;">Check Health</button>
                <button onclick="if(window.showFallbackMaps){showFallbackMaps();}" style="background: #FF9800; color: white; border: none; padding: 3px 6px; cursor: pointer; font-size: 10px;">Show Fallback</button>
            </div>
            <button onclick="this.parentElement.remove()" style="margin-top: 5px; background: #333; color: #fff; border: none; padding: 5px; cursor: pointer;">Close</button>
        `;

        document.body.appendChild(panel);

        // Update status
        updateDebugStatus();
    }

    function updateDebugStatus() {
        setTimeout(() => {
            const statusDiv = document.getElementById('debug-status');
            if (statusDiv) {
                statusDiv.innerHTML = '✅ Page Loaded<br>📊 Monitoring active';
            }

            // Check maps
            const mapsDiv = document.getElementById('debug-maps');
            if (mapsDiv) {
                const ceremonyMap = document.getElementById('ceremony-map');
                const receptionMap = document.getElementById('reception-map');
                if (ceremonyMap && receptionMap) {
                    mapsDiv.innerHTML = '🗺️ Maps: ✅ Elements found<br>&nbsp;&nbsp;&nbsp;Ceremony: ' + (ceremonyMap.children.length > 0 ? 'Loaded' : 'Empty') + '<br>&nbsp;&nbsp;&nbsp;Reception: ' + (receptionMap.children.length > 0 ? 'Loaded' : 'Empty');
                }
            }

            // Check gallery
            const galleryDiv = document.getElementById('debug-gallery');
            if (galleryDiv) {
                galleryDiv.innerHTML = '🖼️ Gallery: Checking...';
            }

            // Check video
            const videoDiv = document.getElementById('debug-video');
            if (videoDiv) {
                const videoElement = document.getElementById('wedding-video');
                if (videoElement) {
                    videoDiv.innerHTML = '🎥 Video: ✅ Found (' + videoElement.tagName + ')';
                } else {
                    videoDiv.innerHTML = '🎥 Video: ❌ Not found';
                }
            }

            // Check RSVP
            const rsvpDiv = document.getElementById('debug-rsvp');
            if (rsvpDiv) {
                const rsvpForm = document.querySelector('[data-form-type="rsvp"]') || document.getElementById('rsvp-form');
                if (rsvpForm) {
                    rsvpDiv.innerHTML = '📝 RSVP: ✅ Form found';
                } else {
                    rsvpDiv.innerHTML = '📝 RSVP: ❌ Form not found';
                }
            }
        }, 2000);
    }

    // Add keyboard shortcut to toggle debug panel
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            const existingPanel = document.getElementById('debug-panel');
            if (existingPanel) {
                existingPanel.remove();
            } else {
                createDebugPanel();
            }
        }
    });

    // Monitor for errors (optimized to reduce noise)
    let errorCount = 0;
    window.addEventListener('error', function(e) {
        errorCount++;
        if (errorCount <= 3) {
            console.error(`🚨 Error ${errorCount}:`, e.message, {
                file: e.filename,
                line: e.lineno,
                column: e.colno
            });
        } else if (errorCount === 4) {
            console.warn('⚠️ Multiple errors detected - suppressing further error logs');
        }
    });

    // Monitor for unhandled promise rejections (reduced noise)
    window.addEventListener('unhandledrejection', function(e) {
        if (errorCount <= 3) {
            console.error('🚨 Unhandled Promise Rejection:', e.reason);
        }
        errorCount++;
    });

    // Create debug panel on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createDebugPanel);
    } else {
        createDebugPanel();
    }

    console.log('🎯 Debug tools active!');
    console.log('💡 Press Ctrl+Shift+D to toggle debug panel');
    console.log('📊 Check browser console for detailed logs');

})();

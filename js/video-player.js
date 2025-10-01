// Full-Screen Video Player with Scroll Controls
(function() {
    'use strict';
    
    let video;
    let playBtn;
    let progressFill;
    let currentTimeEl;
    let durationEl;
    let progressBar;
    let isScrolling = false;
    let scrollTimeout;
    let wasPlayingBeforeScroll = false;
    let videoSectionTimer = null;
    let timeInVideoSection = 0;
    let baseVolume = 0.01; // Start at 1% volume
    let isInVideoSection = false;
    let hasUserInteracted = false;
    let progressBarVisible = true;
    let progressBarTimeout = null;
    let videoElementCheckInterval = null;
    
    // Helper function to safely get video element
    function getVideoElement() {
        // Check if current video reference is still valid
        if (video && video.tagName === 'VIDEO' && document.contains(video)) {
            return video;
        }

        console.log('🔍 Video element validation check...');

        // Try to find the video element
        const foundVideo = document.getElementById('wedding-video');

        if (foundVideo && foundVideo.tagName === 'VIDEO') {
            console.log('✅ Video element found and valid');
            video = foundVideo;

            // Ensure video element is properly configured when re-acquired
            try {
                // Set default properties if they're missing
                if (video.muted === undefined) video.muted = true;
                if (video.volume === undefined) video.volume = 0.01;
                if (video.preload === undefined) video.preload = 'metadata';
            } catch (error) {
                console.warn('⚠️ Could not configure re-acquired video element:', error.message);
            }

            return video;
        }

        if (foundVideo) {
            console.warn('⚠️ Element with ID "wedding-video" exists but is not a VIDEO element:', foundVideo.tagName);
        } else {
            console.warn('❌ Video element with ID "wedding-video" not found');

            // Try to find any video element as fallback
            const allVideos = document.querySelectorAll('video');
            if (allVideos.length > 0) {
                console.log('🔄 Using fallback video element (found', allVideos.length, 'total)');
                video = allVideos[0];

                // If we found a different video element, log it for debugging
                if (video.id !== 'wedding-video') {
                    console.log('📋 Using video element with ID:', video.id || 'no-id');
                }

                // Ensure fallback video element is properly configured
                try {
                    if (video.muted === undefined) video.muted = true;
                    if (video.volume === undefined) video.volume = 0.01;
                    if (video.preload === undefined) video.preload = 'metadata';
                } catch (error) {
                    console.warn('⚠️ Could not configure fallback video element:', error.message);
                }
            } else {
                console.error('❌ No video elements found in entire DOM');
                return null;
            }
        }

        return video;
    }

    // Helper function to safely access video properties
    function safeVideoAccess(callback) {
        const videoElement = getVideoElement();
        if (videoElement && typeof callback === 'function') {
            try {
                return callback(videoElement);
            } catch (error) {
                console.warn('Video access error:', error.message);
                return null;
            }
        }
        return null;
    }

    function initializeVideoPlayer() {
        // Get elements
        video = document.getElementById('wedding-video');
        playBtn = document.getElementById('video-play-btn');
        progressFill = document.getElementById('video-progress-fill');
        currentTimeEl = document.getElementById('video-current-time');
        durationEl = document.getElementById('video-duration');
        progressBar = document.querySelector('.video-progress-bar');

        if (!video) {
            console.log('Video element not found - video player disabled');
            return;
        }

        // Set up event listeners
        setupVideoEvents();
        setupScrollEvents();
        setupIntersectionObserver();

        // Start periodic video element validation
        startVideoElementCheck();
    }

    function startVideoElementCheck() {
        if (videoElementCheckInterval) {
            clearInterval(videoElementCheckInterval);
        }

        // Check every 2 seconds if video element is still valid
        videoElementCheckInterval = setInterval(() => {
            const videoElement = getVideoElement();
            if (!videoElement) {
                console.warn('🚨 Video element check failed - element lost from DOM');
                // Try to reinitialize if video element is completely lost
                initializeVideoPlayer();
            } else {
                // Also validate that the element is still properly configured
                try {
                    if (typeof videoElement.play !== 'function' || typeof videoElement.pause !== 'function') {
                        console.warn('⚠️ Video element exists but methods are missing');
                        initializeVideoPlayer();
                    }
                } catch (error) {
                    console.warn('⚠️ Video element validation error:', error.message);
                    initializeVideoPlayer();
                }
            }
        }, 2000);
    }

    function stopVideoElementCheck() {
        if (videoElementCheckInterval) {
            clearInterval(videoElementCheckInterval);
            videoElementCheckInterval = null;
        }
    }
    
    function setupVideoEvents() {
        // Safety checks
        if (!playBtn || !progressBar) {
            console.log('⚠️ Video player controls not found, skipping video player setup');
            return;
        }
        
        // Play/Pause button
        playBtn.addEventListener('click', togglePlay);
        
        // Video events
        video.addEventListener('loadedmetadata', updateDuration);
        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('ended', onVideoEnd);
        
        // Progress bar click
        progressBar.addEventListener('click', seekVideo);
        
        // Video click to toggle play/pause
        video.addEventListener('click', togglePlay);
        
        // Handle video loading errors
        video.addEventListener('error', handleVideoError);
        
        // Detect user interaction for autoplay
        setupUserInteractionDetection();
        
        // Setup progress bar auto-hide functionality
        setupProgressBarAutoHide();
    }
    
    function setupUserInteractionDetection() {
        const interactionEvents = ['click', 'touchstart', 'keydown', 'scroll'];
        
        function markUserInteraction() {
            if (!hasUserInteracted) {
                hasUserInteracted = true;
                console.log('User interaction detected - autoplay with audio enabled');
                
                // Remove event listeners after first interaction
                interactionEvents.forEach(event => {
                    document.removeEventListener(event, markUserInteraction, { passive: true });
                });
            }
        }
        
        // Add event listeners for user interaction
        interactionEvents.forEach(event => {
            document.addEventListener(event, markUserInteraction, { passive: true });
        });
    }
    
    function setupScrollEvents() {
        let scrollTimer;
        
        window.addEventListener('scroll', function() {
            // Detect when scrolling starts
            if (!isScrolling) {
                isScrolling = true;
                onScrollStart();
            }
            
            // Clear existing timer
            clearTimeout(scrollTimer);
            
            // Set timer to detect when scrolling stops
            scrollTimer = setTimeout(function() {
                isScrolling = false;
                onScrollEnd();
            }, 150); // 150ms after scrolling stops
        }, { passive: true });
        
        // Enhanced scroll snap behavior for video section
        setupVideoSectionScrollSnap();
    }
    
    function setupVideoSectionScrollSnap() {
        let snapTimeout;
        const videoSection = document.getElementById('video-section');
        
        if (!videoSection) return;
        
        window.addEventListener('scroll', function() {
            clearTimeout(snapTimeout);
            
            snapTimeout = setTimeout(() => {
                const rect = videoSection.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                // Check if video section is partially visible
                const isPartiallyVisible = rect.top < viewportHeight && rect.bottom > 0;
                const visiblePercentage = Math.max(0, Math.min(1, 
                    (viewportHeight - Math.max(0, rect.top)) / viewportHeight
                ));
                
                // If more than 30% is visible but less than 90%, snap to video section
                if (isPartiallyVisible && visiblePercentage > 0.3 && visiblePercentage < 0.9) {
                    console.log('Snapping to video section, visibility:', visiblePercentage);
                    videoSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                    
                    // Trigger video play after snap completes
                    setTimeout(() => {
                        const videoElement = getVideoElement();
                        if (videoElement && videoElement.paused) {
                            console.log('Auto-playing video after snap');
                            isScrolling = false; // Override scrolling state
                            enterVideoSection();
                            playVideo();
                        }
                    }, 600); // Wait for snap animation to complete
                }
            }, 300); // Wait for scroll to settle
        }, { passive: true });
    }
    
    function setupIntersectionObserver() {
        const options = {
            threshold: [0.3, 0.5, 0.7], // Multiple thresholds for better detection
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                const videoElement = getVideoElement();
                console.log('Video section intersection:', {
                    isIntersecting: entry.isIntersecting,
                    intersectionRatio: entry.intersectionRatio,
                    isScrolling: isScrolling,
                    videoPaused: videoElement ? videoElement.paused : 'no video'
                });
                
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    // Video section is sufficiently in view (50% or more)
                    console.log('Video section in view - attempting to play');

                    // Enter video section (this unmutes the video)
                    enterVideoSection();

                    // More aggressive auto-play logic
                    const videoElement = getVideoElement();
                    if (videoElement && videoElement.paused) {
                        if (!isScrolling) {
                            // Immediate play if not scrolling
                            console.log('Immediate play - not scrolling');
                            playVideo();
                        } else {
                            // Shorter delay if scrolling
                            setTimeout(() => {
                                if (videoElement.paused) {
                                    console.log('Playing video after scroll delay');
                                    isScrolling = false; // Force scroll state to false
                                    playVideo();
                                }
                            }, 400); // Shorter delay for more responsive play
                        }
                    }

                    // If section is 90%+ visible, force play regardless of scroll state
                    if (entry.intersectionRatio >= 0.9 && videoElement && videoElement.paused) {
                        console.log('Section fully visible - force playing video');
                        isScrolling = false;
                        playVideo();
                    }
                } else if (!entry.isIntersecting || entry.intersectionRatio < 0.3) {
                    // Video section is mostly out of view
                    console.log('Video section out of view - pausing');
                    
                    // Exit video section
                    exitVideoSection();
                    
                    const videoElement = getVideoElement();
                    if (videoElement && !videoElement.paused) {
                        pauseVideo();
                    }
                }
            });
        }, options);
        
        const videoSection = document.getElementById('video-section');
        if (videoSection) {
            observer.observe(videoSection);
            console.log('Video intersection observer set up');
        } else {
            console.error('Video section not found for intersection observer');
        }
    }
    
    function onScrollStart() {
        const videoElement = getVideoElement();
        if (videoElement && !videoElement.paused) {
            wasPlayingBeforeScroll = true;
            pauseVideo();
        } else {
            wasPlayingBeforeScroll = false;
        }
    }
    
    function onScrollEnd() {
        // Check if video section is still in view
        const videoSection = document.getElementById('video-section');
        const rect = videoSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isInView = rect.top < viewportHeight && rect.bottom > 0;
        
        // Calculate how much of the video section is visible
        const visiblePercentage = Math.max(0, Math.min(1, 
            (viewportHeight - Math.max(0, rect.top)) / viewportHeight
        ));
        
        console.log('Scroll ended - video section visibility:', visiblePercentage);
        
        // If video section is mostly visible (70%+), ensure it's playing
        const videoElement = getVideoElement();
        if (isInView && visiblePercentage >= 0.7 && videoElement && videoElement.paused) {
            console.log('Video section visible after scroll end - auto-playing');
            enterVideoSection();
            setTimeout(() => {
                if (videoElement.paused) {
                    playVideo();
                }
            }, 200); // Small delay to ensure everything is ready
        }
        
        // Legacy behavior for resuming after scroll
        if (isInView && wasPlayingBeforeScroll) {
            setTimeout(() => {
                playVideo();
            }, 300); // Small delay to ensure smooth transition
        }
    }
    
    function togglePlay() {
        const videoElement = getVideoElement();
        if (videoElement) {
            if (videoElement.paused) {
                playVideo();
            } else {
                pauseVideo();
            }
        }
    }
    
    function playVideo() {
        console.log('Attempting to play video...');

        const videoElement = getVideoElement();
        if (!videoElement) {
            console.warn('Video element not available for play operation');
            return;
        }

        // Ensure video is ready
        if (videoElement.readyState < 2) {
            console.log('Video not ready, waiting for metadata...');
            videoElement.addEventListener('loadeddata', function() {
                playVideo();
            }, { once: true });
            return;
        }

        // Always unmute when in video section, otherwise check user interaction
        try {
            if (isInVideoSection) {
                videoElement.muted = false;
                videoElement.volume = 0.01; // Always start at 1% volume in video section
                console.log('Playing with audio at 1% volume (in video section)');
            } else if (hasUserInteracted) {
                videoElement.muted = false;
                videoElement.volume = 0.01; // Always start at 1% volume
                console.log('Playing with audio at 1% volume (user has interacted)');
            } else {
                videoElement.muted = true;
                console.log('Playing muted (no user interaction yet)');
            }
        } catch (error) {
            console.warn('Error setting video properties:', error.message);
        }

        const playPromise = videoElement.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video playing successfully');
                updatePlayButton(false);

                // If we started muted but user has now interacted, unmute
                if (videoElement.muted && hasUserInteracted) {
                    setTimeout(() => {
                        try {
                            videoElement.muted = false;
                            videoElement.volume = 0.01; // Start at 1% when unmuting
                            console.log('Video unmuted at 1% volume after user interaction');
                        } catch (error) {
                            console.warn('Error unmuting video:', error.message);
                        }
                    }, 100);
                }
            }).catch(error => {
                console.warn('Video play failed:', error);
                updatePlayButton(true);
                showAutoplayBlocked();
            });
        } else {
            console.log('Play promise undefined');
            updatePlayButton(false);
        }
    }
    
    function pauseVideo() {
        const videoElement = getVideoElement();
        if (!videoElement) {
            console.warn('Cannot pause: video element not available');
            updatePlayButton(true); // Update UI to show paused state
            return;
        }

        try {
            // Validate that this is actually a video element
            if (videoElement.tagName !== 'VIDEO') {
                console.warn('Cannot pause: element is not a video element');
                updatePlayButton(true);
                return;
            }

            if (typeof videoElement.pause !== 'function') {
                console.warn('Cannot pause: pause method not available on video element');
                updatePlayButton(true);
                return;
            }

            // Check if video is actually playing before trying to pause
            if (!videoElement.paused) {
                videoElement.pause();
                updatePlayButton(true);
                console.log('✅ Video paused successfully');
            } else {
                console.log('ℹ️ Video already paused, no action needed');
                updatePlayButton(true); // Ensure UI shows correct state
            }
        } catch (error) {
            console.warn('❌ Pause video error:', error.message);
            // Try to update button state anyway
            updatePlayButton(true);
        }
    }
    
    function updatePlayButton(showPlay) {
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');
        
        if (showPlay) {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        } else {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        }
    }
    
    function updateDuration() {
        const videoElement = getVideoElement();
        if (videoElement && videoElement.duration && durationEl) {
            durationEl.textContent = formatTime(videoElement.duration);
        }
    }
    
    function updateProgress() {
        const videoElement = getVideoElement();
        if (videoElement && videoElement.duration) {
            const progress = (videoElement.currentTime / videoElement.duration) * 100;
            if (progressFill) {
                progressFill.style.width = progress + '%';
            }
            if (currentTimeEl) {
                currentTimeEl.textContent = formatTime(videoElement.currentTime);
            }
        }
    }
    
    function seekVideo(e) {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const videoElement = getVideoElement();
        if (videoElement && videoElement.duration) {
            try {
                videoElement.currentTime = pos * videoElement.duration;
            } catch (error) {
                console.warn('Error seeking video:', error.message);
            }
        }
    }
    
    function onVideoEnd() {
        updatePlayButton(true);
        if (progressFill) {
            progressFill.style.width = '100%';
        }
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }
    
    function enterVideoSection() {
        if (isInVideoSection) return;
        
        console.log('Entering video section');
        isInVideoSection = true;
        timeInVideoSection = 0; // Reset timer
        
        // Hide navbar
        document.body.classList.add('video-section-active');
        
        // Unmute and set initial volume to exactly 1%
        const videoElement = getVideoElement();
        if (videoElement) {
            try {
                videoElement.muted = false;
                videoElement.volume = 0.01; // Force 1% volume
                console.log('Video unmuted, volume set to: 1%');
            } catch (error) {
                console.warn('Error setting video properties in enterVideoSection:', error.message);
            }
        }
        
        // Start timer for exponential volume increase
        startVideoSectionTimer();
        
        // Start video controls auto-hide after 3 seconds
        clearTimeout(progressBarTimeout);
        progressBarTimeout = setTimeout(() => {
            const videoElement = getVideoElement();
            if (videoElement && !videoElement.paused) {
                hideVideoControls();
            }
        }, 3000);
    }
    
    function exitVideoSection() {
        if (!isInVideoSection) return;
        
        console.log('Exiting video section');
        isInVideoSection = false;
        
        // Show navbar
        document.body.classList.remove('video-section-active');
        
        // Stop timer
        stopVideoSectionTimer();
        
        // Mute and reset volume
        const videoElement = getVideoElement();
        if (videoElement) {
            try {
                videoElement.muted = true;
                videoElement.volume = baseVolume;
                console.log('Video muted and volume reset');
            } catch (error) {
                console.warn('Error setting video properties in exitVideoSection:', error.message);
            }
        }
        
        timeInVideoSection = 0;
        
        // Show video controls when exiting video section
        showVideoControls();
        clearTimeout(progressBarTimeout);
    }
    
    function startVideoSectionTimer() {
        stopVideoSectionTimer(); // Clear any existing timer
        
        // Reset time counter to ensure we start from 0
        timeInVideoSection = 0;
        
        videoSectionTimer = setInterval(() => {
            if (isInVideoSection) {
                timeInVideoSection += 0.1; // Increment by 100ms
                
                // Smoother exponential volume increase: starts at 1%, reaches ~50% at 5s, 80% at 10s, 100% at 15s
                // Formula: volume = 0.01 + (0.99 * (1 - e^(-time/5)))
                const exponentialFactor = 1 - Math.exp(-timeInVideoSection / 5);
                const newVolume = Math.min(1.0, 0.01 + (0.99 * exponentialFactor));
                
                const videoElement = getVideoElement();
                if (videoElement && !videoElement.paused) {
                    try {
                        videoElement.volume = newVolume;
                        console.log(`Time in section: ${timeInVideoSection.toFixed(1)}s, Volume: ${(newVolume * 100).toFixed(1)}%`);
                    } catch (error) {
                        console.warn('Error setting volume in timer:', error.message);
                    }
                }
            }
        }, 100); // Update every 100ms
    }
    
    function stopVideoSectionTimer() {
        if (videoSectionTimer) {
            clearInterval(videoSectionTimer);
            videoSectionTimer = null;
        }
    }
    
    function hideVideoControls() {
        const progressContainer = document.querySelector('.video-progress-container');
        const videoControls = document.querySelector('.video-controls');
        const scrollHint = document.querySelector('.video-scroll-hint');
        
        if (progressContainer && progressBarVisible) {
            progressContainer.classList.add('hidden');
            progressBarVisible = false;
            console.log('Video controls hidden');
        }
        
        if (videoControls) {
            videoControls.classList.add('hidden');
        }
        
        if (scrollHint) {
            scrollHint.classList.add('hidden');
        }
    }
    
    function showVideoControls() {
        const progressContainer = document.querySelector('.video-progress-container');
        const videoControls = document.querySelector('.video-controls');
        const scrollHint = document.querySelector('.video-scroll-hint');
        
        if (progressContainer && !progressBarVisible) {
            progressContainer.classList.remove('hidden');
            progressBarVisible = true;
            console.log('Video controls shown');
        }
        
        if (videoControls) {
            videoControls.classList.remove('hidden');
        }
        
        if (scrollHint) {
            scrollHint.classList.remove('hidden');
        }
        
        // Clear any existing timeout
        clearTimeout(progressBarTimeout);
        
        // Hide again after 3 seconds if video is playing
        const videoElement = getVideoElement();
        if (videoElement && !videoElement.paused) {
            progressBarTimeout = setTimeout(() => {
                hideVideoControls();
            }, 3000);
        }
    }
    
    // Keep old function names for compatibility
    function hideProgressBar() {
        hideVideoControls();
    }
    
    function showProgressBar() {
        showVideoControls();
    }
    
    function setupProgressBarAutoHide() {
        // Show video controls on mouse movement over video
        const videoSection = document.getElementById('video-section');
        if (videoSection) {
            videoSection.addEventListener('mousemove', () => {
                if (isInVideoSection) {
                    showVideoControls();
                }
            });
            
            videoSection.addEventListener('mouseleave', () => {
                const videoElement = getVideoElement();
                if (isInVideoSection && videoElement && !videoElement.paused) {
                    clearTimeout(progressBarTimeout);
                    progressBarTimeout = setTimeout(() => {
                        hideVideoControls();
                    }, 1000); // Hide after 1 second when mouse leaves
                }
            });
        }
        
        // Show video controls on touch/click
        const videoElement = getVideoElement();
        if (videoElement) {
            videoElement.addEventListener('touchstart', showVideoControls);
            videoElement.addEventListener('click', showVideoControls);

            // Show video controls when video is paused
            videoElement.addEventListener('pause', showVideoControls);

            // Hide video controls when video starts playing (after 3 seconds)
            videoElement.addEventListener('play', () => {
                clearTimeout(progressBarTimeout);
                progressBarTimeout = setTimeout(() => {
                    hideVideoControls();
                }, 3000);
            });
        }
    }
    
    
    function showAutoplayBlocked() {
        const videoInfo = document.querySelector('.video-info');
        if (videoInfo) {
            const hint = document.createElement('p');
            hint.className = 'autoplay-hint';
            hint.style.cssText = `
                color: #ffd700;
                font-size: 0.9rem;
                margin-top: 0.5rem;
                animation: pulse 2s infinite;
            `;
            hint.textContent = 'Click to play video';
            
            // Remove existing hint if any
            const existingHint = videoInfo.querySelector('.autoplay-hint');
            if (existingHint) {
                existingHint.remove();
            }
            
            videoInfo.appendChild(hint);
            
            // Remove hint after 5 seconds
            setTimeout(() => {
                if (hint.parentNode) {
                    hint.remove();
                }
            }, 5000);
        }
    }
    
    function handleVideoError() {
        console.error('Video failed to load - vid.mp4 not found');
        // Show helpful message when video is missing
        const videoOverlay = document.querySelector('.video-overlay');
        if (videoOverlay) {
            videoOverlay.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: white; text-align: center; background: rgba(0,0,0,0.8); border-radius: 20px; margin: 2rem; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🎬</div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.5rem;">Wedding Video Coming Soon!</h3>
                    <p style="margin: 0; opacity: 0.8; line-height: 1.6;">
                        To add your wedding video:<br>
                        1. Name your video file <strong>vid.mp4</strong><br>
                        2. Place it in the <strong>assets/videos/</strong> folder<br>
                        3. Refresh the page
                    </p>
                    <div style="margin-top: 1.5rem; padding: 0.5rem 1rem; background: rgba(255,215,0,0.2); border: 1px solid #ffd700; border-radius: 10px; font-size: 0.9rem;">
                        💡 Tip: Use MP4 format for best compatibility
                    </div>
                </div>
            `;
        }
    }
    
    // Cleanup function
    function cleanup() {
        stopVideoSectionTimer();
        exitVideoSection();
        stopVideoElementCheck();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeVideoPlayer);
    } else {
        initializeVideoPlayer();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);
    
    // Add global functions for manual control and debugging
    window.videoPlayer = {
        play: playVideo,
        pause: pauseVideo,
        toggle: togglePlay,
        forcePlay: function() {
            console.log('Force playing video...');
            isScrolling = false;
            playVideo();
        },
        testAudio: function() {
            const videoElement = getVideoElement();
            if (videoElement) {
                console.log('Testing audio...');
                try {
                    videoElement.muted = false;
                    videoElement.volume = 0.8;
                    console.log('Video muted:', videoElement.muted, 'Volume:', videoElement.volume);
                    if (videoElement.paused) {
                        playVideo();
                    }
                } catch (error) {
                    console.warn('Error in testAudio:', error.message);
                }
            }
        },
        forceAutoplay: function() {
            console.log('Force auto-play triggered');
            const videoSection = document.getElementById('video-section');
            const rect = videoSection.getBoundingClientRect();
            const visiblePercentage = Math.max(0, Math.min(1, 
                (window.innerHeight - Math.max(0, rect.top)) / window.innerHeight
            ));
            console.log('Video section visibility:', visiblePercentage);
            if (visiblePercentage > 0.5) {
                isScrolling = false;
                enterVideoSection();
                playVideo();
            }
        },
        enterVideoMode: function() {
            console.log('Manually entering video section...');
            enterVideoSection();
        },
        checkStatus: function() {
            const videoSection = document.getElementById('video-section');
            const rect = videoSection ? videoSection.getBoundingClientRect() : null;
            const videoElement = getVideoElement();
            console.log('Video player status:', {
                videoPaused: videoElement ? videoElement.paused : 'no video',
                videoMuted: videoElement ? videoElement.muted : 'no video',
                videoVolume: videoElement ? `${(videoElement.volume * 100).toFixed(1)}%` : 'no video',
                videoReadyState: videoElement ? videoElement.readyState : 'no video',
                isScrolling: isScrolling,
                isInVideoSection: isInVideoSection,
                timeInVideoSection: `${timeInVideoSection.toFixed(1)}s`,
                sectionInView: rect ? (rect.top < window.innerHeight && rect.bottom > 0) : 'no section',
                sectionRect: rect
            });
        },
        testVolumeFormula: function() {
            console.log('Volume progression test:');
            for (let t = 0; t <= 20; t += 1) {
                const exponentialFactor = 1 - Math.exp(-t / 5);
                const volume = Math.min(1.0, 0.01 + (0.99 * exponentialFactor));
                console.log(`${t}s: ${(volume * 100).toFixed(1)}%`);
            }
        },
        showProgressBar: showProgressBar,
        hideProgressBar: hideProgressBar,
        showVideoControls: showVideoControls,
        hideVideoControls: hideVideoControls,
        toggleVideoControls: function() {
            if (progressBarVisible) {
                hideVideoControls();
            } else {
                showVideoControls();
            }
        },
        toggleProgressBar: function() {
            if (progressBarVisible) {
                hideVideoControls();
            } else {
                showVideoControls();
            }
        }
    };
    
})();

(function() {
    'use strict';

    let isExpanded = false;
    let formLoaded = false;
    let loadingTimeout = null;
    let retryCount = 0;
    let maxRetries = 3;
    let retryDelay = 1000; // Start with 1 second delay

    function initializeRSVPForm() {
        const expandBtn = document.getElementById('expandFormBtn');
        const iframe = document.getElementById('rsvpIframe');
        const formContainer = document.getElementById('iframeContainer');
        const formStatus = document.getElementById('formStatus');

        if (!expandBtn || !iframe || !formContainer || !formStatus) {
            console.error('RSVP form elements not found:', {
                expandBtn: !!expandBtn,
                iframe: !!iframe,
                formContainer: !!formContainer,
                formStatus: !!formStatus
            });
            showFormError('Form elements not loaded properly. Please refresh the page.');
            return;
        }

        console.log('Initializing RSVP form with retry mechanism...');

        // Add event listeners
        expandBtn.addEventListener('click', toggleFormExpansion);

        // Start the initial load attempt
        loadRSVPForm();

        console.log('Enhanced RSVP form controls initialized');
    }

    function loadRSVPForm() {
        const iframe = document.getElementById('rsvpIframe');
        const originalSrc = iframe.src;

        console.log(`🚀 Starting RSVP form load attempt ${retryCount + 1}/${maxRetries + 1}`);

        // Show loading state
        showFormLoading();

        // Update loading progress
        updateLoadingProgress();

        // Reset form loaded state
        formLoaded = false;

        // Remove ALL existing event listeners to prevent conflicts and duplicates
        iframe.removeEventListener('load', handleFormLoad);
        iframe.removeEventListener('error', handleFormError);

        // Add fresh event listeners with proper error handling
        const loadHandler = function() {
            console.log('📋 Load event triggered');
            handleFormLoad();
            // Remove listeners after successful load to prevent multiple triggers
            iframe.removeEventListener('load', loadHandler);
            iframe.removeEventListener('error', errorHandler);
        };

        const errorHandler = function() {
            console.log('❌ Error event triggered');
            handleFormError();
            // Remove listeners after error to prevent multiple triggers
            iframe.removeEventListener('load', loadHandler);
            iframe.removeEventListener('error', errorHandler);
        };

        iframe.addEventListener('load', loadHandler);
        iframe.addEventListener('error', errorHandler);

        // Force reload with cache busting - use a more unique identifier
        const timestamp = Date.now();
        const attemptId = Math.random().toString(36).substr(2, 9);
        const separator = originalSrc.includes('?') ? '&' : '?';
        const newSrc = originalSrc + separator + `load_attempt=${timestamp}_${retryCount}_${attemptId}`;

        console.log('🔄 Setting iframe src:', newSrc.substring(0, 100) + '...');
        iframe.src = newSrc;

        // Set a more responsive timeout (8 seconds for first attempt, 5 seconds for retries)
        const timeoutDuration = retryCount === 0 ? 8000 : 5000;

        // Clear existing timeout
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
        }

        loadingTimeout = setTimeout(() => {
            if (!formLoaded) {
                console.log(`⏰ Form load timeout on attempt ${retryCount + 1} (no load event received)`);
                // Remove listeners before timeout handling
                iframe.removeEventListener('load', loadHandler);
                iframe.removeEventListener('error', errorHandler);

                // Try alternative detection method - use MutationObserver on container
                checkIframeContainerChanges(iframe).then(() => {
                    console.log('✅ Alternative detection: iframe container changes detected');
                    handleFormLoad();
                }).catch((error) => {
                    console.log('❌ Alternative detection failed:', error.message);
                    // If alternative detection fails, still try to handle timeout
                    // This prevents infinite retries when CORS blocks content access
                    handleFormTimeout();
                });
            }
        }, timeoutDuration);
    }

    // Alternative iframe detection method using container observation
    function checkIframeContainerChanges(iframe) {
        return new Promise((resolve, reject) => {
            try {
                const container = iframe.parentElement;
                if (!container) {
                    reject(new Error('Iframe container not found'));
                    return;
                }

                // Check if iframe has loaded by examining its properties
                // Google Forms iframes typically have scrollHeight > 0 when loaded
                if (iframe.scrollHeight > 100) {
                    console.log('✅ Iframe appears loaded (scrollHeight > 100)');
                    resolve();
                    return;
                }

                // Set up a mutation observer on the container to detect changes
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        // Look for changes that might indicate the iframe has loaded
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            // Check if iframe became visible or got content
                            if (iframe.scrollHeight > 100 || iframe.offsetHeight > 100) {
                                console.log('✅ Iframe loaded detected via container mutation');
                                observer.disconnect();
                                resolve();
                            }
                        } else if (mutation.type === 'childList') {
                            // Check if iframe dimensions changed significantly
                            if (iframe.scrollHeight > 100 || iframe.offsetHeight > 100) {
                                console.log('✅ Iframe loaded detected via child list mutation');
                                observer.disconnect();
                                resolve();
                            }
                        }
                    });
                });

                // Observe both attributes and child list changes
                observer.observe(container, {
                    attributes: true,
                    attributeFilter: ['style'],
                    childList: true,
                    subtree: true
                });

                // Also set up a polling mechanism as backup
                let pollCount = 0;
                const pollInterval = setInterval(() => {
                    pollCount++;
                    if (iframe.scrollHeight > 100 || iframe.offsetHeight > 100) {
                        console.log('✅ Iframe loaded detected via polling');
                        observer.disconnect();
                        clearInterval(pollInterval);
                        resolve();
                    } else if (pollCount >= 30) { // 3 seconds at 100ms intervals
                        observer.disconnect();
                        clearInterval(pollInterval);
                        reject(new Error('Iframe container detection timeout'));
                    }
                }, 100);

                // Overall timeout for the entire detection process
                setTimeout(() => {
                    observer.disconnect();
                    clearInterval(pollInterval);
                    reject(new Error('Iframe detection overall timeout'));
                }, 5000);

            } catch (error) {
                console.log('Container detection method failed:', error.message);
                reject(error);
            }
        });
    }

    function handleFormLoad() {
        if (formLoaded) {
            console.log('⚠️ Load event triggered but form already marked as loaded - ignoring');
            return; // Prevent multiple load triggers
        }

        formLoaded = true;
        retryCount = 0; // Reset retry count on successful load

        console.log('✅ RSVP form loaded successfully - stopping all retry attempts');

        // Clear any pending timeouts
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
        }

        hideFormLoading();
        showFormStatus('Form loaded successfully!', 'success');

        // Auto-hide success message after 2 seconds
        setTimeout(() => {
            clearFormStatus();
        }, 2000);

        console.log('✅ RSVP form loading process completed');
    }

    function handleFormError() {
        console.error('❌ RSVP form failed to load (error event)');
        handleFormTimeout();
    }

    function handleFormTimeout() {
        const iframe = document.getElementById('rsvpIframe');

        // Clear any pending timeouts
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
        }

        hideFormLoading();

        if (retryCount < maxRetries) {
            retryCount++;
            console.log(`⏰ Load timeout - retrying in ${retryDelay}ms (attempt ${retryCount}/${maxRetries})`);

            showFormStatus(`Retrying... (${retryCount}/${maxRetries})`, 'loading');

            // Update loading progress
            updateLoadingProgress();

            // Exponential backoff for retry delay
            setTimeout(() => {
                loadRSVPForm();
            }, retryDelay);

            retryDelay *= 1.5; // Increase delay for next retry
        } else {
            console.error('❌ Max retries reached, showing final error state');
            const errorMessage = `Unable to load RSVP form after ${maxRetries} attempts. Please try refreshing the page or use the alternative link below.`;
            showFormError(errorMessage);

            // Add additional debugging info
            console.log('RSVP Form Debug Info:', {
                iframeSrc: iframe?.src,
                iframeReadyState: iframe?.readyState,
                retryCount: retryCount,
                maxRetries: maxRetries,
                userAgent: navigator.userAgent.substring(0, 100) + '...'
            });
        }
    }

    function showFormLoading() {
        const loadingEl = document.getElementById('formLoading');
        const containerEl = document.getElementById('iframeContainer');

        if (loadingEl && containerEl) {
            loadingEl.style.display = 'flex';
            containerEl.style.display = 'none';
            showFormStatus('Loading form...', 'loading');
        }
    }

    function updateLoadingProgress() {
        const progressEl = document.getElementById('loadingProgress');
        const attemptCountEl = progressEl?.querySelector('.attempt-count');

        if (progressEl && attemptCountEl) {
            if (retryCount === 0) {
                attemptCountEl.textContent = 'Loading RSVP form...';
            } else {
                attemptCountEl.textContent = `Retry ${retryCount}/${maxRetries} - Please wait...`;
            }
        }
    }

    function hideFormLoading() {
        const loadingEl = document.getElementById('formLoading');
        const containerEl = document.getElementById('iframeContainer');

        if (loadingEl && containerEl) {
            loadingEl.style.display = 'none';
            containerEl.style.display = 'block';

            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
                loadingTimeout = null;
            }
        }
    }

    function showFormError(message) {
        const errorEl = document.getElementById('formError');
        const containerEl = document.getElementById('iframeContainer');
        const loadingEl = document.getElementById('formLoading');

        if (errorEl && containerEl && loadingEl) {
            errorEl.style.display = 'block';
            containerEl.style.display = 'none';
            loadingEl.style.display = 'none';
            showFormStatus('Error loading form', 'error');
        }

        console.error('RSVP Form Error:', message);
    }

    function showFormStatus(message, type = 'info') {
        const statusEl = document.getElementById('formStatus');

        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `form-status ${type}`;

            // Add appropriate styling based on type
            switch(type) {
                case 'success':
                    statusEl.style.color = '#16a34a';
                    break;
                case 'error':
                    statusEl.style.color = '#dc2626';
                    break;
                case 'loading':
                    statusEl.style.color = '#d4a574';
                    break;
                default:
                    statusEl.style.color = 'var(--text-light)';
            }
        }
    }

    function clearFormStatus() {
        const statusEl = document.getElementById('formStatus');
        if (statusEl) {
            statusEl.textContent = '';
            statusEl.className = 'form-status';
        }
    }

    function toggleFormExpansion() {
        const expandBtn = document.getElementById('expandFormBtn');
        const iframe = document.getElementById('rsvpIframe');
        const btnText = expandBtn.querySelector('.btn-text');
        const btnIcon = expandBtn.querySelector('.btn-icon');

        if (!expandBtn || !iframe || !btnText || !btnIcon) {
            console.error('Form elements not found for expansion');
            return;
        }

        // Don't allow expansion if form is not loaded
        if (!formLoaded && !isExpanded) {
            showFormStatus('Please wait for form to load', 'loading');
            return;
        }

        isExpanded = !isExpanded;

        if (isExpanded) {
            // Expand the form
            iframe.classList.add('expanded');
            expandBtn.classList.add('expanded');
            btnText.textContent = 'Collapse Form';
            btnIcon.textContent = 'expand_less';

            showFormStatus('Form expanded for better viewing', 'success');

            // Smooth scroll to keep the form in view
            setTimeout(() => {
                iframe.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);

        } else {
            // Collapse the form
            iframe.classList.remove('expanded');
            expandBtn.classList.remove('expanded');
            btnText.textContent = 'Expand Form';
            btnIcon.textContent = 'expand_more';

            showFormStatus('Form collapsed', 'info');

            // Smooth scroll to form controls
            setTimeout(() => {
                expandBtn.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 100);
        }

        console.log(`Form ${isExpanded ? 'expanded' : 'collapsed'}`);
    }

    // Simulate form submission success (can be enhanced with actual form monitoring)
    function simulateFormSubmission() {
        const successEl = document.getElementById('formSuccess');
        const containerEl = document.getElementById('iframeContainer');

        if (successEl && containerEl) {
            containerEl.style.display = 'none';
            successEl.style.display = 'block';

            // Smooth scroll to success message
            successEl.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            showFormStatus('RSVP submitted successfully!', 'success');
        }
    }

    // Utility function for scrolling to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Function to reload the RSVP form
    function reloadRSVPForm() {
        console.log('Manual reload requested by user');

        // Reset retry mechanism for manual reload
        retryCount = 0;
        retryDelay = 1000;

        // Hide any error state
        const errorEl = document.getElementById('formError');
        if (errorEl) {
            errorEl.style.display = 'none';
        }

        // Start fresh load attempt
        loadRSVPForm();
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', initializeRSVPForm);

    // Expose functions for debugging and external use
    window.rsvpForm = {
        toggle: toggleFormExpansion,
        isExpanded: () => isExpanded,
        isLoaded: () => formLoaded,
        simulateSubmission: simulateFormSubmission,
        scrollToTop: scrollToTop,
        showLoading: showFormLoading,
        showError: showFormError,
        reload: reloadRSVPForm,
        load: loadRSVPForm,
        showSuccess: () => {
            const successEl = document.getElementById('formSuccess');
            const containerEl = document.getElementById('iframeContainer');
            if (successEl && containerEl) {
                containerEl.style.display = 'none';
                successEl.style.display = 'block';
                successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },
        getRetryCount: () => retryCount,
        resetRetries: () => {
            retryCount = 0;
            retryDelay = 1000;
            console.log('RSVP retry mechanism reset');
        }
    };

    console.log('Enhanced RSVP form system initialized with loading states, error handling, and improved UX');

    // Make reloadRSVPForm function globally available for direct access
    window.reloadRSVPForm = reloadRSVPForm;

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', initializeRSVPForm);

})();

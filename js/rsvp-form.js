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

        console.log(`Loading RSVP form attempt ${retryCount + 1}/${maxRetries + 1}`);

        // Show loading state
        showFormLoading();

        // Update loading progress
        updateLoadingProgress();

        // Reset form loaded state
        formLoaded = false;

        // Remove existing event listeners to prevent conflicts
        iframe.removeEventListener('load', handleFormLoad);
        iframe.removeEventListener('error', handleFormError);

        // Add fresh event listeners
        iframe.addEventListener('load', handleFormLoad);
        iframe.addEventListener('error', handleFormError);

        // Force reload with cache busting
        const separator = originalSrc.includes('?') ? '&' : '?';
        const newSrc = originalSrc + separator + 'load_attempt=' + Date.now() + '_' + retryCount;

        console.log('Setting iframe src:', newSrc);
        iframe.src = newSrc;

        // Set a more responsive timeout (5 seconds for first attempt, 3 seconds for retries)
        const timeoutDuration = retryCount === 0 ? 8000 : 5000;

        // Clear existing timeout
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
        }

        loadingTimeout = setTimeout(() => {
            if (!formLoaded) {
                console.log(`Form load timeout on attempt ${retryCount + 1}`);
                handleFormTimeout();
            }
        }, timeoutDuration);
    }

    function handleFormLoad() {
        formLoaded = true;
        retryCount = 0; // Reset retry count on successful load

        hideFormLoading();
        showFormStatus('Form loaded successfully!', 'success');

        // Auto-hide success message after 2 seconds
        setTimeout(() => {
            clearFormStatus();
        }, 2000);

        console.log('✅ RSVP form loaded successfully');
    }

    function handleFormError() {
        console.error('❌ RSVP form failed to load (error event)');
        handleFormTimeout();
    }

    function handleFormTimeout() {
        const iframe = document.getElementById('rsvpIframe');
        hideFormLoading();

        if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying form load in ${retryDelay}ms (attempt ${retryCount}/${maxRetries})`);

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

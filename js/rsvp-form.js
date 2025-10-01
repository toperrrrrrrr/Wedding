(function() {
    'use strict';

    let isExpanded = false;
    let formLoaded = false;
    let loadingTimeout = null;

    function initializeRSVPForm() {
        const expandBtn = document.getElementById('expandFormBtn');
        const iframe = document.getElementById('rsvpIframe');
        const formContainer = document.getElementById('iframeContainer');
        const formStatus = document.getElementById('formStatus');

        if (!expandBtn || !iframe || !formContainer || !formStatus) {
            console.log('RSVP form elements not found');
            showFormError('Form elements not loaded properly. Please refresh the page.');
            return;
        }

        // Show loading state initially
        showFormLoading();

        // Add event listeners
        expandBtn.addEventListener('click', toggleFormExpansion);

        // Monitor iframe loading
        iframe.addEventListener('load', function() {
            formLoaded = true;
            hideFormLoading();
            showFormStatus('Form loaded successfully!', 'success');

            // Auto-hide success message after 3 seconds
            setTimeout(() => {
                clearFormStatus();
            }, 3000);

            console.log('RSVP form loaded successfully');
        });

        // Handle iframe errors
        iframe.addEventListener('error', function() {
            hideFormLoading();
            showFormError('Unable to load RSVP form. Please try the alternative link below.');
            console.error('RSVP form failed to load');
        });

        // Set loading timeout (10 seconds)
        loadingTimeout = setTimeout(() => {
            if (!formLoaded) {
                hideFormLoading();
                showFormError('Form is taking longer than usual to load. Please try refreshing or use the alternative link.');
            }
        }, 10000);

        console.log('Enhanced RSVP form controls initialized');
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
        const iframe = document.getElementById('rsvpIframe');
        const formContainer = document.getElementById('iframeContainer');
        const errorEl = document.getElementById('formError');

        if (iframe && formContainer && errorEl) {
            // Hide error state
            errorEl.style.display = 'none';

            // Show loading state
            showFormLoading();

            // Reset form loaded state
            formLoaded = false;

            // Reload the iframe by changing its src
            const currentSrc = iframe.src;
            iframe.src = currentSrc;

            console.log('RSVP form reloaded');
        }
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
        showSuccess: () => {
            const successEl = document.getElementById('formSuccess');
            const containerEl = document.getElementById('iframeContainer');
            if (successEl && containerEl) {
                containerEl.style.display = 'none';
                successEl.style.display = 'block';
                successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    console.log('Enhanced RSVP form system initialized with loading states, error handling, and improved UX');

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', initializeRSVPForm);

})();

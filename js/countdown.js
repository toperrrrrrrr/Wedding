// Dedicated Countdown Timer Script
(function() {
    'use strict';
    
    function startCountdown() {
        const targetDate = new Date('December 27, 2025 14:00:00').getTime();
        
        function updateDisplay() {
            const now = new Date().getTime();
            const timeLeft = targetDate - now;
            
            if (timeLeft < 0) {
                const countdownContainer = document.getElementById('countdown');
                if (countdownContainer) {
                    countdownContainer.innerHTML = '<h3 class="section-title">The day is here! 🎉</h3>';
                }
                return;
            }
            
            // Calculate time units
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            // Update DOM elements safely
            const elements = {
                days: document.getElementById('days'),
                hours: document.getElementById('hours'),
                minutes: document.getElementById('minutes'),
                seconds: document.getElementById('seconds')
            };
            
            if (elements.days) elements.days.textContent = String(days).padStart(2, '0');
            if (elements.hours) elements.hours.textContent = String(hours).padStart(2, '0');
            if (elements.minutes) elements.minutes.textContent = String(minutes).padStart(2, '0');
            if (elements.seconds) elements.seconds.textContent = String(seconds).padStart(2, '0');
        }
        
        // Initial update
        updateDisplay();
        
        // Update every second
        setInterval(updateDisplay, 1000);
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startCountdown);
    } else {
        startCountdown();
    }
})();


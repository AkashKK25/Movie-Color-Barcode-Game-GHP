/**
 * Main Application for the Movie Color Barcode Game
 * This file initializes the application and handles global events
 */

// Check if browser supports required features
function checkBrowserSupport() {
    // Check for localStorage
    const localStorageSupported = (() => {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    })();

    if (!localStorageSupported) {
        alert('Your browser does not support localStorage. Some features may not work properly.');
    }

    // Check for modern CSS
    const cssSupported = (() => {
        const test = document.createElement('div');
        test.style.display = 'flex';
        return test.style.display === 'flex';
    })();

    if (!cssSupported) {
        alert('Your browser may not support modern CSS features. The game may not display correctly.');
    }
}

// Preload assets
function preloadAssets() {
    // Preload sounds
    const sounds = ['correct.mp3', 'wrong.mp3', 'game-over.mp3', 'tick.mp3', 'start.mp3'];
    sounds.forEach(sound => {
        const audio = new Audio(`assets/sounds/${sound}`);
        audio.preload = 'auto';
    });

    // Preload background image
    const backgroundImage = new Image();
    backgroundImage.src = 'assets/images/background-barcode.png';
}

// Handle visibility change (when user switches tabs/apps)
function handleVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause game if it's running
            if (gameState && gameState.timer) {
                clearInterval(gameState.timer);
            }
        } else {
            // Resume game if it's in time attack mode
            if (gameState && gameState.gameActive && gameState.mode === GAME_MODES.TIME_ATTACK) {
                startTimer();
            }
        }
    });
}

// Handle window resize
function handleWindowResize() {
    window.addEventListener('resize', () => {
        // Adjust UI based on screen size
        if (window.innerWidth <= 768) {
            // Mobile layout adjustments
            const gameHeader = document.querySelector('.game-header');
            if (gameHeader) {
                gameHeader.classList.add('mobile-layout');
            }
        } else {
            // Desktop layout
            const gameHeader = document.querySelector('.game-header');
            if (gameHeader) {
                gameHeader.classList.remove('mobile-layout');
            }
        }
    });

    // Trigger resize event on load
    window.dispatchEvent(new Event('resize'));
}

// Add keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Only handle keystrokes if game is active
        if (!gameState || !gameState.gameActive) {
            return;
        }

        // Number keys 1-4 for selecting options
        if (event.key >= '1' && event.key <= '4') {
            const index = parseInt(event.key) - 1;
            const optionButtons = document.querySelectorAll('.option-btn');
            
            if (index < optionButtons.length && !optionButtons[index].disabled) {
                optionButtons[index].click();
            }
        }

        // Space or Enter for next question
        if ((event.key === ' ' || event.key === 'Enter') && 
            elements.nextButton && 
            elements.nextButton.style.display !== 'none') {
            elements.nextButton.click();
        }

        // H key for hint
        if (event.key.toLowerCase() === 'h' && 
            elements.hintButton && 
            !elements.hintButton.disabled) {
            elements.hintButton.click();
        }
    });
}

// Display loading screen
function showLoadingScreen() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'var(--background-color)';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.flexDirection = 'column';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.zIndex = '9999';
    document.body.appendChild(loadingOverlay);

    // Create loading title
    const loadingTitle = document.createElement('h1');
    loadingTitle.textContent = 'Cinematic Barcode Challenge';
    loadingTitle.className = 'glow-text';
    loadingTitle.style.marginBottom = '2rem';
    loadingOverlay.appendChild(loadingTitle);

    // Create loading spinner
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingSpinner.style.width = '50px';
    loadingSpinner.style.height = '50px';
    loadingSpinner.style.border = '5px solid rgba(255, 255, 255, 0.1)';
    loadingSpinner.style.borderTopColor = 'var(--primary-color)';
    loadingSpinner.style.borderRadius = '50%';
    loadingSpinner.style.animation = 'spin 1s linear infinite';
    loadingOverlay.appendChild(loadingSpinner);

    // Create loading text
    const loadingText = document.createElement('p');
    loadingText.textContent = 'Loading...';
    loadingText.style.marginTop = '1rem';
    loadingText.style.color = 'var(--text-color)';
    loadingOverlay.appendChild(loadingText);

    // Add keyframes for spinner animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Simulate loading time (remove in production and use actual loading)
    setTimeout(hideLoadingScreen, 1500);
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.removeChild(loadingOverlay);
        }, 500);
    }
}

// Register service worker for offline functionality
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
}

// Initialize application
function initApp() {
    // Show loading screen
    showLoadingScreen();
    
    // Check browser support
    checkBrowserSupport();
    
    // Preload assets
    preloadAssets();
    
    // Handle visibility changes
    handleVisibilityChange();
    
    // Handle window resize
    handleWindowResize();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Register service worker
    registerServiceWorker();
}

// Call init when window loads
window.addEventListener('load', initApp);

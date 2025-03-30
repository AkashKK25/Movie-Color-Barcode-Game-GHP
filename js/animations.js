/**
 * Animation functions for the Movie Color Barcode Game
 */

// Animation for correct answer
function animateCorrectAnswer(element) {
    element.classList.add('animate__animated', 'animate__pulse');
    element.classList.add('correct');
    
    // Play correct sound effect
    playSound('correct');
    
    // Remove animation classes after animation completes
    setTimeout(() => {
        element.classList.remove('animate__animated', 'animate__pulse');
    }, 1000);
}

// Animation for wrong answer
function animateWrongAnswer(element) {
    element.classList.add('animate__animated', 'animate__shakeX');
    element.classList.add('wrong');
    
    // Play wrong sound effect
    playSound('wrong');
    
    // Remove animation classes after animation completes
    setTimeout(() => {
        element.classList.remove('animate__animated', 'animate__shakeX');
    }, 1000);
}

// Animation for game over
function animateGameOver() {
    // Play game over sound effect
    playSound('game-over');
    
    // Get game over screen
    const gameOverScreen = document.getElementById('game-over');
    
    // Show game over screen with animation
    gameOverScreen.style.display = 'flex';
    
    // Add animation to high scores
    const highScoresList = document.getElementById('high-scores-list');
    if (highScoresList) {
        const highScoreItems = highScoresList.querySelectorAll('.high-score-item');
        highScoreItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate__animated', 'animate__fadeInUp');
            }, 100 * index);
        });
    }
}

// Animation for hint elimination
function animateHintElimination(element) {
    element.classList.add('animate__animated', 'animate__fadeOut');
    
    // After animation completes, mark as eliminated
    setTimeout(() => {
        element.classList.remove('animate__animated', 'animate__fadeOut');
        element.classList.add('hint-eliminated');
        element.disabled = true;
    }, 500);
}

// Animation for new movie image loading
function animateNewMovieImage(element) {
    // Hide element first
    element.style.opacity = '0';
    
    // After a short delay, show with animation
    setTimeout(() => {
        element.classList.add('animate__animated', 'animate__fadeIn');
        element.style.opacity = '1';
        
        // Remove animation class after it completes
        setTimeout(() => {
            element.classList.remove('animate__animated', 'animate__fadeIn');
        }, 1000);
    }, 300);
}

// Animation for time running low
function animateTimeRunningLow(timerElement, timeLeft) {
    if (timeLeft <= 10) {
        timerElement.classList.add('danger');
    } else if (timeLeft <= 15) {
        timerElement.classList.add('warning');
        timerElement.classList.remove('danger');
    } else {
        timerElement.classList.remove('warning', 'danger');
    }
}

// Play sound effects
function playSound(soundName) {
    try {
        const sound = new Audio(`assets/sounds/${soundName}.mp3`);
        sound.volume = 0.5; // Set volume to 50%
        sound.play().catch(error => {
            console.log('Error playing sound:', error);
        });
    } catch (error) {
        console.log('Error loading sound:', error);
    }
}

// Add subtle animation to background barcode
function animateBackground() {
    const backgroundElement = document.querySelector('.barcode-background');
    
    // Randomize animation speed slightly on page load
    const randomSpeed = 90 + Math.random() * 60; // Between 90s and 150s
    backgroundElement.style.animationDuration = `${randomSpeed}s`;
    
    // Add subtle parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
        // Only if not on mobile
        if (window.innerWidth > 768) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            // Move background slightly based on mouse position
            backgroundElement.style.transform = `translate(${mouseX * -15}px, ${mouseY * -15}px)`;
        }
    });
}

// Animation for countdown before game starts
function animateCountdown(callback) {
    // Create countdown overlay
    const overlay = document.createElement('div');
    overlay.id = 'countdown-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.fontSize = '8rem';
    overlay.style.color = 'white';
    overlay.style.fontFamily = 'Orbitron, sans-serif';
    document.body.appendChild(overlay);
    
    // Start countdown from 3
    let count = 3;
    overlay.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        
        if (count > 0) {
            // Update countdown number
            overlay.textContent = count;
            overlay.classList.add('animate__animated', 'animate__bounceIn');
            
            // Play tick sound
            try {
                const tickSound = new Audio('assets/sounds/tick.mp3');
                tickSound.volume = 0.3;
                tickSound.play().catch(() => {});
            } catch (error) {
                console.log('Error playing sound:', error);
            }
            
            // Remove animation class after animation completes
            setTimeout(() => {
                overlay.classList.remove('animate__animated', 'animate__bounceIn');
            }, 500);
        } else {
            // Show "GO!" text
            overlay.textContent = "GO!";
            overlay.classList.add('animate__animated', 'animate__bounceIn');
            
            // Play start sound
            try {
                const startSound = new Audio('assets/sounds/start.mp3');
                startSound.volume = 0.4;
                startSound.play().catch(() => {});
            } catch (error) {
                console.log('Error playing sound:', error);
            }
            
            // Remove overlay after a short delay
            setTimeout(() => {
                // Check if the overlay is still in the DOM before removing
                const overlayElement = document.getElementById('countdown-overlay');
                if (overlayElement && overlayElement.parentNode) {
                    overlayElement.parentNode.removeChild(overlayElement);
                }
                
                clearInterval(countdownInterval);
                
                // Execute callback function
                if (typeof callback === 'function') {
                    callback();
                }
            }, 1000);
        }
    }, 1000);
}

// Initialize animations
function initAnimations() {
    // Initialize background animation
    animateBackground();
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button:not(.disabled):not(.hint-eliminated)');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = button.style.transform === 'translateY(-5px)' ? 
                                    'translateY(-5px)' : 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// Call initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initAnimations);

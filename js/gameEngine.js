/**
 * Game Engine for Movie Color Barcode Game
 */

// Game constants
const GAME_MODES = {
    STANDARD: 'standard',
    TIME_ATTACK: 'timeAttack',
    ENDLESS: 'endless'
};

const DIFFICULTY = {
    EASY: 'easy',
    HARD: 'hard'
};

const MAX_LIVES = 5;
const MAX_HINTS = 3;
const TIME_ATTACK_SECONDS = 30;
const NUM_OPTIONS = 4;

// Game state
let gameState = {
    mode: GAME_MODES.STANDARD,
    difficulty: DIFFICULTY.EASY,
    selectedCategories: [],
    score: 0,
    lives: MAX_LIVES,
    hintsLeft: MAX_HINTS,
    timer: null,
    timeLeft: TIME_ATTACK_SECONDS,
    currentMovie: null,
    usedMovies: [],
    availableMovies: [],
    gameActive: false,
    totalQuestions: 0,
    correctAnswers: 0
};

// DOM Elements
const elements = {
    welcomeScreen: null,
    gameScreen: null,
    gameOverScreen: null,
    movieImage: null,
    optionsContainer: null,
    verdictDisplay: null,
    scoreDisplay: null,
    livesDisplay: null,
    livesContainer: null,
    timerDisplay: null,
    timerContainer: null,
    hintButton: null,
    hintsLeftDisplay: null,
    nextButton: null,
    finalScoreDisplay: null,
    correctAnswersDisplay: null,
    accuracyDisplay: null,
    highScoresList: null
};

// Initialize game
function initGame() {
    // Get DOM elements
    elements.welcomeScreen = document.getElementById('welcome-screen');
    elements.gameScreen = document.getElementById('game-screen');
    elements.gameOverScreen = document.getElementById('game-over');
    elements.movieImage = document.getElementById('movie-image');
    elements.optionsContainer = document.getElementById('options-container');
    elements.verdictDisplay = document.getElementById('verdict');
    elements.scoreDisplay = document.getElementById('score');
    elements.livesDisplay = document.getElementById('lives');
    elements.livesContainer = document.getElementById('lives-container');
    elements.timerDisplay = document.getElementById('timer');
    elements.timerContainer = document.getElementById('timer-container');
    elements.hintButton = document.getElementById('hint-btn');
    elements.hintsLeftDisplay = document.getElementById('hints-left');
    elements.nextButton = document.getElementById('next-button');
    elements.finalScoreDisplay = document.getElementById('final-score');
    elements.correctAnswersDisplay = document.getElementById('correct-answers');
    elements.accuracyDisplay = document.getElementById('accuracy');
    elements.highScoresList = document.getElementById('high-scores-list');

    // Initialize game state
    resetGameState();

    // Set up event listeners
    setupEventListeners();

    // Initialize categories
    initializeCategories();
}

// Reset game state
function resetGameState() {
    gameState = {
        mode: GAME_MODES.STANDARD,
        difficulty: DIFFICULTY.EASY,
        selectedCategories: [],
        score: 0,
        lives: MAX_LIVES,
        hintsLeft: MAX_HINTS,
        timer: null,
        timeLeft: TIME_ATTACK_SECONDS,
        currentMovie: null,
        usedMovies: [],
        availableMovies: [],
        gameActive: false,
        totalQuestions: 0,
        correctAnswers: 0
    };
}

// Set up event listeners
function setupEventListeners() {
    // Mode selection
    document.getElementById('standard-mode').addEventListener('click', () => selectGameMode(GAME_MODES.STANDARD));
    document.getElementById('time-attack-mode').addEventListener('click', () => selectGameMode(GAME_MODES.TIME_ATTACK));
    document.getElementById('endless-mode').addEventListener('click', () => selectGameMode(GAME_MODES.ENDLESS));

    // Difficulty selection
    document.getElementById('easy-btn').addEventListener('click', () => selectDifficulty(DIFFICULTY.EASY));
    document.getElementById('hard-btn').addEventListener('click', () => selectDifficulty(DIFFICULTY.HARD));

    // Start game button
    document.getElementById('start-game-btn').addEventListener('click', startGame);

    // Next button
    elements.nextButton.addEventListener('click', nextQuestion);

    // Hint button
    elements.hintButton.addEventListener('click', useHint);

    // Play again button
    document.getElementById('play-again').addEventListener('click', () => {
        elements.gameOverScreen.style.display = 'none';
        elements.welcomeScreen.style.display = 'flex';
        resetGameState();
    });

    // Back to home button
    document.getElementById('back-to-home').addEventListener('click', () => {
        elements.gameOverScreen.style.display = 'none';
        elements.welcomeScreen.style.display = 'flex';
        resetGameState();
    });

    // Share results button
    document.getElementById('share-results').addEventListener('click', shareResults);

    // How to play
    document.getElementById('how-to-play').addEventListener('click', showHowToPlayModal);
    document.querySelector('.close-modal').addEventListener('click', hideHowToPlayModal);
    document.querySelector('.modal-close-btn').addEventListener('click', hideHowToPlayModal);
}

// Initialize categories
function initializeCategories() {
    const categoryContainer = document.getElementById('category-container');
    categoryContainer.innerHTML = '';

    // Get categories from data
    const categories = getCategories();

    // Create checkboxes for each category
    categories.forEach(category => {
        const categoryLabel = document.createElement('label');
        categoryLabel.className = 'category-checkbox';
        categoryLabel.dataset.category = category.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = category.id;
        checkbox.checked = true; // Default to checked

        const categoryName = document.createTextNode(category.name);

        categoryLabel.appendChild(checkbox);
        categoryLabel.appendChild(categoryName);
        categoryContainer.appendChild(categoryLabel);

        // Add to selected categories
        gameState.selectedCategories.push(category.id);

        // Add event listener
        checkbox.addEventListener('change', function() {
            const categoryId = this.value;
            const index = gameState.selectedCategories.indexOf(categoryId);

            if (this.checked && index === -1) {
                gameState.selectedCategories.push(categoryId);
                categoryLabel.classList.add('selected');
            } else if (!this.checked && index !== -1) {
                gameState.selectedCategories.splice(index, 1);
                categoryLabel.classList.remove('selected');
            }
        });

        // Set initial selected state
        if (checkbox.checked) {
            categoryLabel.classList.add('selected');
        }
    });
}

// Select game mode
function selectGameMode(mode) {
    gameState.mode = mode;

    // Update UI
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => btn.classList.remove('selected'));

    let selectedButton;
    switch (mode) {
        case GAME_MODES.STANDARD:
            selectedButton = document.getElementById('standard-mode');
            break;
        case GAME_MODES.TIME_ATTACK:
            selectedButton = document.getElementById('time-attack-mode');
            break;
        case GAME_MODES.ENDLESS:
            selectedButton = document.getElementById('endless-mode');
            break;
    }

    if (selectedButton) {
        selectedButton.classList.add('selected');
    }
}

// Select difficulty
function selectDifficulty(difficulty) {
    gameState.difficulty = difficulty;

    // Update UI
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    difficultyButtons.forEach(btn => btn.classList.remove('selected'));

    let selectedButton;
    switch (difficulty) {
        case DIFFICULTY.EASY:
            selectedButton = document.getElementById('easy-btn');
            break;
        case DIFFICULTY.HARD:
            selectedButton = document.getElementById('hard-btn');
            break;
    }

    if (selectedButton) {
        selectedButton.classList.add('selected');
    }
}

// Start the game
function startGame() {
    // Check if at least one category is selected
    if (gameState.selectedCategories.length === 0) {
        alert('Please select at least one movie category.');
        return;
    }

    // Reset game state but keep selected options
    const selectedMode = gameState.mode;
    const selectedDifficulty = gameState.difficulty;
    const selectedCategories = [...gameState.selectedCategories];
    
    resetGameState();
    
    gameState.mode = selectedMode;
    gameState.difficulty = selectedDifficulty;
    gameState.selectedCategories = selectedCategories;
    gameState.gameActive = true;

    // Hide welcome screen and show game screen
    elements.welcomeScreen.style.display = 'none';
    elements.gameScreen.style.display = 'flex';

    // Update UI based on game mode
    updateUIForGameMode();

    // Get available movies based on difficulty and categories
    loadAvailableMovies();

    // Start countdown animation before showing first question
    animateCountdown(() => {
        // Load first question
        loadQuestion();
    });
}

// Update UI based on game mode
function updateUIForGameMode() {
    // Set game mode display
    const gameModeDisplay = document.getElementById('game-mode-display');
    const gameDifficulty = document.getElementById('game-difficulty');

    switch (gameState.mode) {
        case GAME_MODES.STANDARD:
            gameModeDisplay.textContent = 'Standard Mode';
            elements.livesContainer.style.display = 'flex';
            elements.timerContainer.style.display = 'none';
            break;
        case GAME_MODES.TIME_ATTACK:
            gameModeDisplay.textContent = 'Time Attack Mode';
            elements.livesContainer.style.display = 'none';
            elements.timerContainer.style.display = 'flex';
            break;
        case GAME_MODES.ENDLESS:
            gameModeDisplay.textContent = 'Endless Mode';
            elements.livesContainer.style.display = 'none';
            elements.timerContainer.style.display = 'none';
            break;
    }

    // Set difficulty display
    gameDifficulty.textContent = gameState.difficulty === DIFFICULTY.EASY ? 'Easy' : 'Hard';

    // Reset displays
    elements.scoreDisplay.textContent = '0';
    elements.livesDisplay.textContent = MAX_LIVES;
    elements.timerDisplay.textContent = TIME_ATTACK_SECONDS;
    elements.hintsLeftDisplay.textContent = `${MAX_HINTS} Hints Left`;
    elements.verdictDisplay.textContent = '';
    elements.verdictDisplay.className = 'verdict';
}

// Load available movies based on difficulty and categories
function loadAvailableMovies() {
    const allMovies = gameState.difficulty === DIFFICULTY.EASY ? easyMovies : hardMovies;
    
    // Filter movies by selected categories
    gameState.availableMovies = allMovies.filter(movie => 
        gameState.selectedCategories.includes(movie.category)
    );
    
    // Shuffle movies
    shuffleArray(gameState.availableMovies);
}

// Load a question
function loadQuestion() {
    // Check if we have run out of movies
    if (gameState.availableMovies.length === 0) {
        // If all movies are used up, end the game or reload
        if (gameState.usedMovies.length === 0) {
            // No movies available at all
            alert('No movies available for the selected categories. Please select different categories.');
            elements.gameScreen.style.display = 'none';
            elements.welcomeScreen.style.display = 'flex';
            return;
        }
        
        // Reset available movies but keep used ones separate
        loadAvailableMovies();
    }
    
    // Get a random movie
    const randomIndex = Math.floor(Math.random() * gameState.availableMovies.length);
    gameState.currentMovie = gameState.availableMovies[randomIndex];
    
    // Remove movie from available movies and add to used movies
    gameState.availableMovies.splice(randomIndex, 1);
    gameState.usedMovies.push(gameState.currentMovie);
    
    // Increment total questions counter
    gameState.totalQuestions++;
    
    // Update UI
    loadMovieImage();
    generateOptions();
    
    // Reset verdict
    elements.verdictDisplay.textContent = '';
    elements.verdictDisplay.className = 'verdict';
    
    // Reset option buttons
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.classList.remove('correct', 'wrong', 'hint-eliminated');
        button.disabled = false;
    });
    
    // Enable hint button if hints are available
    elements.hintButton.disabled = gameState.hintsLeft <= 0;
    
    // Start timer if in time attack mode
    if (gameState.mode === GAME_MODES.TIME_ATTACK) {
        startTimer();
    }
    
    // Hide next button until answer is selected
    elements.nextButton.style.display = 'none';
}

// Load movie image
function loadMovieImage() {
    // Set source based on difficulty
    const baseFolder = gameState.difficulty === DIFFICULTY.EASY ? 
                    'Movie Color Barcodes Easy' : 'Movie Color Barcodes Hard';
    
    elements.movieImage.src = `${baseFolder}/${gameState.currentMovie.fileName}`;
    
    // Animate new image
    animateNewMovieImage(elements.movieImage);
}

// Generate options for the current question
function generateOptions() {
    // Create array with correct answer
    const options = [gameState.currentMovie.name];
    
    // Add incorrect options
    while (options.length < NUM_OPTIONS) {
        // Get a random movie that's not the current one
        const allMovies = gameState.difficulty === DIFFICULTY.EASY ? easyMovies : hardMovies;
        const randomIndex = Math.floor(Math.random() * allMovies.length);
        const randomMovie = allMovies[randomIndex];
        
        // Add movie name if not already in options
        if (!options.includes(randomMovie.name) && randomMovie.name !== gameState.currentMovie.name) {
            options.push(randomMovie.name);
        }
    }
    
    // Shuffle options
    shuffleArray(options);
    
    // Create option buttons
    elements.optionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.dataset.option = option;
        
        // Add event listener
        button.addEventListener('click', () => selectOption(option));
        
        elements.optionsContainer.appendChild(button);
    });
}

// Select an option
function selectOption(selectedOption) {
    const isCorrect = selectedOption === gameState.currentMovie.name;
    
    // Update game state
    if (isCorrect) {
        gameState.score++;
        gameState.correctAnswers++;
        elements.scoreDisplay.textContent = gameState.score;
        elements.verdictDisplay.textContent = 'Correct!';
        elements.verdictDisplay.className = 'verdict correct';
    } else {
        if (gameState.mode === GAME_MODES.STANDARD) {
            gameState.lives--;
            elements.livesDisplay.textContent = gameState.lives;
        } else if (gameState.mode === GAME_MODES.ENDLESS) {
            // In endless mode, one wrong answer ends the game
            endGame();
            return;
        }
        
        elements.verdictDisplay.textContent = `Wrong! The correct answer is "${gameState.currentMovie.name}"`;
        elements.verdictDisplay.className = 'verdict wrong';
    }
    
    // Update option buttons
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        const option = button.dataset.option;
        
        if (option === gameState.currentMovie.name) {
            // Highlight correct answer
            button.classList.add('correct');
            if (isCorrect) {
                animateCorrectAnswer(button);
            }
        } else if (option === selectedOption && !isCorrect) {
            // Highlight selected wrong answer
            button.classList.add('wrong');
            animateWrongAnswer(button);
        }
        
        // Disable all buttons
        button.disabled = true;
    });
    
    // Stop timer if in time attack mode
    if (gameState.mode === GAME_MODES.TIME_ATTACK) {
        clearInterval(gameState.timer);
    }
    
    // Check if game should end
    if (gameState.mode === GAME_MODES.STANDARD && gameState.lives <= 0) {
        endGame();
        return;
    }
    
    // Show next button
    elements.nextButton.style.display = 'block';
}

// Use a hint
function useHint() {
    if (gameState.hintsLeft <= 0) {
        return;
    }
    
    // Find incorrect options
    const optionButtons = document.querySelectorAll('.option-btn');
    const incorrectButtons = Array.from(optionButtons).filter(
        button => button.dataset.option !== gameState.currentMovie.name && 
                !button.classList.contains('hint-eliminated')
    );
    
    // If there are incorrect options, eliminate up to 2
    if (incorrectButtons.length > 0) {
        // Determine how many to eliminate (if only 1 incorrect option left, eliminate just that one)
        const eliminateCount = Math.min(2, incorrectButtons.length);
        
        // Shuffle array to randomize which incorrect options get eliminated
        shuffleArray(incorrectButtons);
        
        // Eliminate options
        for (let i = 0; i < eliminateCount; i++) {
            animateHintElimination(incorrectButtons[i]);
        }
        
        // Decrease hints left
        gameState.hintsLeft--;
        elements.hintsLeftDisplay.textContent = `${gameState.hintsLeft} Hints Left`;
        
        // Disable hint button if no hints left
        if (gameState.hintsLeft <= 0) {
            elements.hintButton.disabled = true;
        }
    }
}

// Start timer for time attack mode
function startTimer() {
    // Reset timer
    gameState.timeLeft = TIME_ATTACK_SECONDS;
    elements.timerDisplay.textContent = gameState.timeLeft;
    elements.timerDisplay.classList.remove('warning', 'danger');
    
    // Clear existing timer
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    // Start new timer
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        elements.timerDisplay.textContent = gameState.timeLeft;
        
        // Animate timer when running low
        animateTimeRunningLow(elements.timerDisplay, gameState.timeLeft);
        
        // Check if time is up
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            
            // Select no option (time's up)
            timeUp();
        }
    }, 1000);
}

// Time's up handler
function timeUp() {
    // Show correct answer
    elements.verdictDisplay.textContent = `Time's up! The correct answer is "${gameState.currentMovie.name}"`;
    elements.verdictDisplay.className = 'verdict wrong';
    
    // Update option buttons
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        const option = button.dataset.option;
        
        if (option === gameState.currentMovie.name) {
            // Highlight correct answer
            button.classList.add('correct');
        }
        
        // Disable all buttons
        button.disabled = true;
    });
    
    // Show next button
    elements.nextButton.style.display = 'block';
}

// Move to next question
function nextQuestion() {
    // Hide next button
    elements.nextButton.style.display = 'none';
    
    // Load next question
    loadQuestion();
}

// End the game
function endGame() {
    // Stop timer if active
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    // Update game over screen
    elements.finalScoreDisplay.textContent = gameState.score;
    elements.correctAnswersDisplay.textContent = gameState.correctAnswers;
    
    // Calculate accuracy
    const accuracy = gameState.totalQuestions > 0 
        ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) 
        : 0;
    elements.accuracyDisplay.textContent = `${accuracy}%`;
    
    // Save high score
    saveHighScore();
    
    // Display high scores
    displayHighScores();
    
    // Hide game screen and show game over screen
    elements.gameScreen.style.display = 'none';
    
    // Animate game over screen
    animateGameOver();
}

// Save high score
function saveHighScore() {
    // Get high scores from localStorage
    let highScores = JSON.parse(localStorage.getItem('movieBarcodeHighScores') || '[]');
    
    // Add new score
    const newScore = {
        mode: gameState.mode,
        difficulty: gameState.difficulty,
        score: gameState.score,
        correctAnswers: gameState.correctAnswers,
        totalQuestions: gameState.totalQuestions,
        date: new Date().toISOString()
    };
    
    highScores.push(newScore);
    
    // Sort high scores
    highScores.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 scores
    if (highScores.length > 10) {
        highScores = highScores.slice(0, 10);
    }
    
    // Save back to localStorage
    localStorage.setItem('movieBarcodeHighScores', JSON.stringify(highScores));
}

// Display high scores
function displayHighScores() {
    // Get high scores from localStorage
    let highScores = JSON.parse(localStorage.getItem('movieBarcodeHighScores') || '[]');
    
    // Filter high scores by current mode and difficulty
    highScores = highScores.filter(score => 
        score.mode === gameState.mode && score.difficulty === gameState.difficulty
    );
    
    // Sort high scores
    highScores.sort((a, b) => b.score - a.score);
    
    // Clear high scores list
    elements.highScoresList.innerHTML = '';
    
    // Add high scores to list
    if (highScores.length === 0) {
        const noScoresItem = document.createElement('div');
        noScoresItem.className = 'high-score-item';
        noScoresItem.textContent = 'No high scores yet!';
        elements.highScoresList.appendChild(noScoresItem);
    } else {
        highScores.forEach((score, index) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'high-score-item';
            
            const scoreRank = document.createElement('div');
            scoreRank.className = 'high-score-rank';
            scoreRank.textContent = `${index + 1}.`;
            
            const scoreInfo = document.createElement('div');
            scoreInfo.className = 'high-score-info';
            
            // Format date
            const scoreDate = new Date(score.date);
            const formattedDate = scoreDate.toLocaleDateString();
            
            scoreInfo.innerHTML = `Score: ${score.score} <span class="high-score-date">(${formattedDate})</span>`;
            
            const scoreValue = document.createElement('div');
            scoreValue.className = 'high-score-score';
            scoreValue.textContent = score.score;
            
            scoreItem.appendChild(scoreRank);
            scoreItem.appendChild(scoreInfo);
            scoreItem.appendChild(scoreValue);
            
            elements.highScoresList.appendChild(scoreItem);
        });
    }
}

// Share results
function shareResults() {
    const text = `I scored ${gameState.score} points in Cinematic Barcode Challenge! Can you beat my score?`;
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: 'My Movie Barcode Game Score',
            text: text,
            url: window.location.href
        }).catch(error => {
            console.log('Error sharing:', error);
            fallbackShare(text);
        });
    } else {
        fallbackShare(text);
    }
}

// Fallback sharing method
function fallbackShare(text) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.select();
    document.execCommand('copy');
    
    // Remove the textarea
    document.body.removeChild(textarea);
    
    // Alert the user
    alert('Result copied to clipboard! You can now paste it anywhere to share.');
}

// Show how to play modal
function showHowToPlayModal() {
    const modal = document.getElementById('how-to-play-modal');
    modal.style.display = 'block';
}

// Hide how to play modal
function hideHowToPlayModal() {
    const modal = document.getElementById('how-to-play-modal');
    modal.style.display = 'none';
}

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Get categories
function getCategories() {
    // This function would normally fetch categories from a database
    // For now, we'll use the categories from the data file
    return categories;
}

// Initialize game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);

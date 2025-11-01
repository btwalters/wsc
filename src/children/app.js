// Children's Catechism Flashcard Game
let questions = [];
let currentIndex = 0;
let isFlipped = false;
let soundEnabled = true;

// DOM Elements
const flashcard = document.getElementById('flashcard');
const questionText = document.getElementById('questionText');
const answerText = document.getElementById('answerText');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const flipBtn = document.getElementById('flipBtn');
const randomBtn = document.getElementById('randomBtn');
const restartBtn = document.getElementById('restartBtn');
const soundToggle = document.getElementById('soundToggle');
const confettiContainer = document.getElementById('confetti');

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        questions = data.questions;

        // Load saved progress
        const savedIndex = localStorage.getItem('childrenCatechismIndex');
        if (savedIndex !== null && savedIndex < questions.length) {
            currentIndex = parseInt(savedIndex);
        }

        displayQuestion();
    } catch (error) {
        console.error('Error loading questions:', error);
        questionText.textContent = 'Error loading questions. Please refresh the page.';
    }
}

// Display current question
function displayQuestion() {
    if (questions.length === 0) return;

    const question = questions[currentIndex];
    questionText.textContent = question.question;
    answerText.textContent = question.answer;

    // Update progress
    const percentage = ((currentIndex + 1) / questions.length) * 100;
    progressBar.style.width = percentage + '%';
    progressText.textContent = `Question ${currentIndex + 1} of ${questions.length}`;

    // Reset flip state
    if (isFlipped) {
        flipCard();
    }

    // Save progress
    localStorage.setItem('childrenCatechismIndex', currentIndex);

    // Speak question if sound enabled
    if (soundEnabled) {
        speak(question.question);
    }

    // Check for milestone (every 10 questions)
    if ((currentIndex + 1) % 10 === 0 && currentIndex > 0) {
        showConfetti();
    }
}

// Flip card
function flipCard() {
    isFlipped = !isFlipped;
    flashcard.classList.toggle('flipped');

    // Speak answer when flipped to back
    if (isFlipped && soundEnabled) {
        speak(questions[currentIndex].answer);
    } else if (!isFlipped && soundEnabled) {
        speak(questions[currentIndex].question);
    }
}

// Text-to-speech
function speak(text) {
    if ('speechSynthesis' in window && soundEnabled) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;  // Slightly slower for children
        utterance.pitch = 1.1;  // Slightly higher pitch
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
    }
}

// Stop speech
function stopSpeech() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

// Navigation functions
function nextQuestion() {
    stopSpeech();
    if (currentIndex < questions.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0; // Loop back to start
    }
    displayQuestion();
}

function prevQuestion() {
    stopSpeech();
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = questions.length - 1; // Loop to end
    }
    displayQuestion();
}

function randomQuestion() {
    stopSpeech();
    const newIndex = Math.floor(Math.random() * questions.length);
    currentIndex = newIndex;
    displayQuestion();
}

function restart() {
    stopSpeech();
    currentIndex = 0;
    displayQuestion();
}

// Toggle sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';

    if (!soundEnabled) {
        stopSpeech();
    }
}

// Confetti celebration
function showConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animation = `confetti-fall ${2 + Math.random() * 2}s linear`;
            confetti.style.opacity = '1';

            confettiContainer.appendChild(confetti);

            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 30);
    }
}

// Event Listeners
flashcard.addEventListener('click', flipCard);
flipBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    flipCard();
});
nextBtn.addEventListener('click', nextQuestion);
prevBtn.addEventListener('click', prevQuestion);
randomBtn.addEventListener('click', randomQuestion);
restartBtn.addEventListener('click', restart);
soundToggle.addEventListener('click', toggleSound);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowRight':
        case ' ':
            e.preventDefault();
            if (e.key === ' ') {
                flipCard();
            } else {
                nextQuestion();
            }
            break;
        case 'ArrowLeft':
            e.preventDefault();
            prevQuestion();
            break;
        case 'r':
        case 'R':
            randomQuestion();
            break;
        case 'f':
        case 'F':
            flipCard();
            break;
    }
});

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

flashcard.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

flashcard.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next question
            nextQuestion();
        } else {
            // Swipe right - previous question
            prevQuestion();
        }
    }
}

// Initialize app
loadQuestions();

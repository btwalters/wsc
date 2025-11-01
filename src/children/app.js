// Children's Catechism Flashcard Game
let allQuestions = [];
let questions = []; // Currently active questions (all or range)
let currentIndex = 0;
let isFlipped = false;
let autoSpeak = true; // Auto-speak on flip (default ON for children)

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

// Range selection elements
const allQuestionsBtn = document.getElementById('allQuestionsBtn');
const rangeSelectBtn = document.getElementById('rangeSelectBtn');
const rangeModal = document.getElementById('rangeModal');
const rangeFrom = document.getElementById('rangeFrom');
const rangeTo = document.getElementById('rangeTo');
const applyRangeBtn = document.getElementById('applyRangeBtn');
const cancelRangeBtn = document.getElementById('cancelRangeBtn');

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        allQuestions = data.questions;

        // Load saved range or use all questions
        const savedRange = localStorage.getItem('childrenCatechismRange');
        if (savedRange) {
            const range = JSON.parse(savedRange);
            applyQuestionRange(range.from, range.to, false);
        } else {
            questions = [...allQuestions];
        }

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

// Range selection functions
function showRangeModal() {
    rangeModal.classList.remove('hidden');
}

function hideRangeModal() {
    rangeModal.classList.add('hidden');
}

function selectAllQuestions() {
    questions = [...allQuestions];
    currentIndex = 0;
    localStorage.removeItem('childrenCatechismRange');
    displayQuestion();
}

function applyQuestionRange(from, to, saveToStorage = true) {
    if (from < 1 || to > allQuestions.length || from > to) {
        alert(`Please enter a valid range (1-${allQuestions.length})`);
        return;
    }

    // Filter questions by ID range
    questions = allQuestions.filter(q => q.id >= from && q.id <= to);
    currentIndex = 0;

    if (saveToStorage) {
        localStorage.setItem('childrenCatechismRange', JSON.stringify({ from, to }));
    }

    hideRangeModal();
    displayQuestion();
}

function handleRangeApply() {
    const from = parseInt(rangeFrom.value);
    const to = parseInt(rangeTo.value);
    applyQuestionRange(from, to);
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
    progressText.textContent = `Question ${question.id} (${currentIndex + 1} of ${questions.length})`;

    // Reset flip state (without speaking)
    if (isFlipped) {
        flipCard(true); // Pass true to indicate silent flip
    }

    // Auto-speak question when displayed if enabled
    if (autoSpeak) {
        speak(question.question);
    }

    // Save progress
    localStorage.setItem('childrenCatechismIndex', currentIndex);

    // Check for milestone (every 10 questions)
    if ((currentIndex + 1) % 10 === 0 && currentIndex > 0) {
        showConfetti();
    }
}

// Flip card
function flipCard(silent = false) {
    isFlipped = !isFlipped;
    flashcard.classList.toggle('flipped');

    // Auto-speak when flipped if enabled (unless silent flip for reset)
    if (autoSpeak && !silent) {
        if (isFlipped) {
            speak(questions[currentIndex].answer);
        } else {
            speak(questions[currentIndex].question);
        }
    }
}

// Text-to-speech
function speak(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Small delay to ensure cancel completes
        setTimeout(() => {
            try {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.85;
                utterance.pitch = 1.1;
                utterance.volume = 1.0;

                // Handle errors
                utterance.onerror = (event) => {
                    console.error('Speech synthesis error:', event);
                };

                window.speechSynthesis.speak(utterance);
            } catch (error) {
                console.error('Error speaking text:', error);
            }
        }, 100);
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

// Toggle auto-speak
function toggleSound() {
    autoSpeak = soundToggle.checked;

    // Save preference
    localStorage.setItem('childrenAutoSpeak', autoSpeak);

    if (!autoSpeak) {
        stopSpeech();
    }
}

// Load saved auto-speak preference
function loadAutoSpeakPreference() {
    const saved = localStorage.getItem('childrenAutoSpeak');
    if (saved !== null) {
        autoSpeak = saved === 'true';
        soundToggle.checked = autoSpeak;
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
nextBtn.addEventListener('click', nextQuestion);
prevBtn.addEventListener('click', prevQuestion);
randomBtn.addEventListener('click', randomQuestion);
restartBtn.addEventListener('click', restart);
soundToggle.addEventListener('change', toggleSound);

// Range selection listeners
allQuestionsBtn.addEventListener('click', selectAllQuestions);
rangeSelectBtn.addEventListener('click', showRangeModal);
applyRangeBtn.addEventListener('click', handleRangeApply);
cancelRangeBtn.addEventListener('click', hideRangeModal);

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
loadAutoSpeakPreference();
loadQuestions();

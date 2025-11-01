// Westminster Shorter Catechism Application
let questions = [];
let selectedQuestions = [];
let currentFlashcardIndex = 0;
let currentLearningQuestionId = 1;
let isFlipped = false;
let soundEnabled = false; // Default OFF for adults
let currentMode = 'flashcard';

// DOM Elements
const flashcardModeBtn = document.getElementById('flashcardModeBtn');
const learningModeBtn = document.getElementById('learningModeBtn');
const flashcardMode = document.getElementById('flashcardMode');
const learningMode = document.getElementById('learningMode');

// Flashcard Mode Elements
const selectAllBtn = document.getElementById('selectAllBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const rangeBtn = document.getElementById('rangeBtn');
const selectedInfo = document.getElementById('selectedInfo');
const rangeModal = document.getElementById('rangeModal');
const rangeFrom = document.getElementById('rangeFrom');
const rangeTo = document.getElementById('rangeTo');
const rangeApplyBtn = document.getElementById('rangeApplyBtn');
const rangeCancelBtn = document.getElementById('rangeCancelBtn');

const flashcard = document.getElementById('flashcard');
const cardNumber = document.getElementById('cardNumber');
const cardQuestion = document.getElementById('cardQuestion');
const cardAnswer = document.getElementById('cardAnswer');
const cardReferences = document.getElementById('cardReferences');
const flashcardProgress = document.getElementById('flashcardProgress');

const fcPrevBtn = document.getElementById('fcPrevBtn');
const fcNextBtn = document.getElementById('fcNextBtn');
const fcRandomBtn = document.getElementById('fcRandomBtn');
const fcShuffleBtn = document.getElementById('fcShuffleBtn');
const fcRestartBtn = document.getElementById('fcRestartBtn');
const playFrontBtn = document.getElementById('playFrontBtn');
const playBackBtn = document.getElementById('playBackBtn');

// Learning Mode Elements
const searchInput = document.getElementById('searchInput');
const questionList = document.getElementById('questionList');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

const learningQuestionNumber = document.getElementById('learningQuestionNumber');
const learningQuestion = document.getElementById('learningQuestion');
const learningAnswer = document.getElementById('learningAnswer');
const referencesSection = document.getElementById('referencesSection');
const referenceList = document.getElementById('referenceList');

// General Elements
const soundToggle = document.getElementById('soundToggle');

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        questions = data.questions;

        // Load saved state
        loadSavedState();

        // Initialize modes
        initializeFlashcardMode();
        initializeLearningMode();

        // Set initial mode
        switchMode(currentMode);
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Error loading questions. Please refresh the page.');
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('shorterCatechismMode', currentMode);
    localStorage.setItem('shorterCatechismSelectedQuestions', JSON.stringify(selectedQuestions));
    localStorage.setItem('shorterCatechismFlashcardIndex', currentFlashcardIndex);
    localStorage.setItem('shorterCatechismLearningQuestionId', currentLearningQuestionId);
}

// Load saved state
function loadSavedState() {
    const savedMode = localStorage.getItem('shorterCatechismMode');
    if (savedMode) currentMode = savedMode;

    const savedSelected = localStorage.getItem('shorterCatechismSelectedQuestions');
    if (savedSelected) {
        selectedQuestions = JSON.parse(savedSelected);
    }

    const savedFlashcardIndex = localStorage.getItem('shorterCatechismFlashcardIndex');
    if (savedFlashcardIndex !== null) {
        currentFlashcardIndex = parseInt(savedFlashcardIndex);
    }

    const savedLearningQuestionId = localStorage.getItem('shorterCatechismLearningQuestionId');
    if (savedLearningQuestionId !== null) {
        currentLearningQuestionId = parseInt(savedLearningQuestionId);
    }

    const savedSoundEnabled = localStorage.getItem('shorterCatechismSoundEnabled');
    if (savedSoundEnabled !== null) {
        soundEnabled = savedSoundEnabled === 'true';
    }
    soundToggle.checked = soundEnabled;
}

// ===== MODE SWITCHING =====

function switchMode(mode) {
    currentMode = mode;

    if (mode === 'flashcard') {
        flashcardModeBtn.classList.add('active');
        learningModeBtn.classList.remove('active');
        flashcardMode.classList.add('active');
        learningMode.classList.remove('active');
    } else {
        learningModeBtn.classList.add('active');
        flashcardModeBtn.classList.remove('active');
        learningMode.classList.add('active');
        flashcardMode.classList.remove('active');
    }

    saveState();
}

// ===== FLASHCARD MODE =====

function initializeFlashcardMode() {
    updateSelectedInfo();
    if (selectedQuestions.length > 0) {
        displayFlashcard();
    }
}

function selectAllQuestions() {
    selectedQuestions = questions.map(q => q.id);
    currentFlashcardIndex = 0;
    updateSelectedInfo();
    displayFlashcard();
    saveState();
}

function clearAllQuestions() {
    selectedQuestions = [];
    currentFlashcardIndex = 0;
    updateSelectedInfo();
    resetFlashcard();
    saveState();
}

function showRangeModal() {
    rangeModal.classList.remove('hidden');
}

function hideRangeModal() {
    rangeModal.classList.add('hidden');
}

function applyRange() {
    const from = parseInt(rangeFrom.value);
    const to = parseInt(rangeTo.value);

    if (from < 1 || to > 107 || from > to) {
        alert('Please enter a valid range (1-107)');
        return;
    }

    selectedQuestions = [];
    for (let i = from; i <= to; i++) {
        selectedQuestions.push(i);
    }

    currentFlashcardIndex = 0;
    updateSelectedInfo();
    displayFlashcard();
    hideRangeModal();
    saveState();
}

function updateSelectedInfo() {
    selectedInfo.textContent = `${selectedQuestions.length} question${selectedQuestions.length !== 1 ? 's' : ''} selected`;
}

function resetFlashcard() {
    cardQuestion.textContent = 'Select questions to begin';
    cardAnswer.textContent = 'Answer';
    cardNumber.textContent = 'Q?';
    cardReferences.textContent = '';
    flashcardProgress.textContent = 'Question 0 of 0';
}

function displayFlashcard() {
    if (selectedQuestions.length === 0) {
        resetFlashcard();
        return;
    }

    if (currentFlashcardIndex >= selectedQuestions.length) {
        currentFlashcardIndex = 0;
    }

    const questionId = selectedQuestions[currentFlashcardIndex];
    const question = questions.find(q => q.id === questionId);

    if (question) {
        cardNumber.textContent = `Q${question.id}`;
        cardQuestion.textContent = question.question;
        cardAnswer.textContent = question.answer;

        // Display references
        if (question.references && question.references.length > 0) {
            const refText = question.references.map(r => r.text).join('; ');
            cardReferences.textContent = refText;
        } else {
            cardReferences.textContent = '';
        }

        flashcardProgress.textContent = `Question ${currentFlashcardIndex + 1} of ${selectedQuestions.length}`;

        // Reset flip state
        if (isFlipped) {
            flipFlashcard();
        }
    }

    saveState();
}

function flipFlashcard() {
    isFlipped = !isFlipped;
    flashcard.classList.toggle('flipped');
}

function nextFlashcard() {
    stopSpeech();
    if (currentFlashcardIndex < selectedQuestions.length - 1) {
        currentFlashcardIndex++;
    } else {
        currentFlashcardIndex = 0;
    }
    displayFlashcard();
}

function prevFlashcard() {
    stopSpeech();
    if (currentFlashcardIndex > 0) {
        currentFlashcardIndex--;
    } else {
        currentFlashcardIndex = selectedQuestions.length - 1;
    }
    displayFlashcard();
}

function randomFlashcard() {
    stopSpeech();
    if (selectedQuestions.length === 0) return;
    currentFlashcardIndex = Math.floor(Math.random() * selectedQuestions.length);
    displayFlashcard();
}

function shuffleFlashcards() {
    stopSpeech();
    if (selectedQuestions.length === 0) return;

    // Fisher-Yates shuffle
    for (let i = selectedQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]];
    }

    currentFlashcardIndex = 0;
    displayFlashcard();
    saveState();
}

function restartFlashcards() {
    stopSpeech();
    currentFlashcardIndex = 0;
    displayFlashcard();
}

// ===== LEARNING MODE =====

function initializeLearningMode() {
    renderQuestionList();
    displayLearningQuestion(currentLearningQuestionId);
}

function renderQuestionList(filter = '') {
    questionList.innerHTML = '';

    const filtered = questions.filter(q => {
        if (!filter) return true;
        const searchLower = filter.toLowerCase();
        return q.question.toLowerCase().includes(searchLower) ||
               q.answer.toLowerCase().includes(searchLower);
    });

    filtered.forEach(question => {
        const item = document.createElement('div');
        item.className = 'question-item';
        if (question.id === currentLearningQuestionId) {
            item.classList.add('active');
        }

        item.innerHTML = `
            <span class="question-item-number">Q${question.id}</span>
            <div class="question-item-text">${question.question}</div>
        `;

        item.addEventListener('click', () => {
            displayLearningQuestion(question.id);
        });

        questionList.appendChild(item);
    });
}

async function fetchScriptureText(reference) {
    try {
        // Use Bible API - https://bible-api.com (free, no auth required)
        // This API supports various translations including ESV-like texts
        const cleanRef = reference.trim();

        // Try to fetch from bible-api.com
        const response = await fetch(`https://bible-api.com/${encodeURIComponent(cleanRef)}?translation=web`);

        if (response.ok) {
            const data = await response.json();
            if (data.text) {
                // Clean up the text (remove verse numbers and extra whitespace)
                let scriptureText = data.text
                    .replace(/\[\d+:\d+\]/g, '') // Remove [1:1] style verse numbers
                    .replace(/\d+:\d+/g, '') // Remove 1:1 style verse numbers
                    .trim();

                return scriptureText;
            }
        }

        // Fallback if API fails
        return null;
    } catch (error) {
        console.error('Error fetching scripture:', error);
        return null;
    }
}

function displayLearningQuestion(questionId) {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    currentLearningQuestionId = questionId;

    learningQuestionNumber.textContent = `Q${question.id}`;
    learningQuestion.textContent = question.question;
    learningAnswer.textContent = question.answer;

    // Display references with expandable scripture text
    if (question.references && question.references.length > 0) {
        referenceList.innerHTML = '';
        question.references.forEach((ref, index) => {
            const refItem = document.createElement('div');
            refItem.className = 'reference-item expandable';
            refItem.dataset.reference = ref.text;
            refItem.dataset.expanded = 'false';

            refItem.innerHTML = `
                <div class="reference-header">
                    <span class="reference-marker">${index + 1}</span>
                    <span class="reference-text">${ref.text}</span>
                    <span class="expand-icon">▼</span>
                </div>
                <div class="reference-content hidden">
                    <div class="loading">Loading scripture...</div>
                </div>
            `;

            // Add click handler to expand/collapse
            const header = refItem.querySelector('.reference-header');
            header.addEventListener('click', () => toggleReference(refItem, ref.text));

            referenceList.appendChild(refItem);
        });
        referencesSection.style.display = 'block';
    } else {
        referencesSection.style.display = 'none';
    }

    // Update active item in list
    document.querySelectorAll('.question-item').forEach(item => {
        item.classList.remove('active');
    });

    const activeItem = Array.from(questionList.children).find(item => {
        const num = item.querySelector('.question-item-number').textContent;
        return num === `Q${questionId}`;
    });

    if (activeItem) {
        activeItem.classList.add('active');
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Speak question if sound enabled
    if (soundEnabled && currentMode === 'learning') {
        speak(question.question);
    }

    saveState();
}

async function toggleReference(refItem, reference) {
    const content = refItem.querySelector('.reference-content');
    const icon = refItem.querySelector('.expand-icon');
    const isExpanded = refItem.dataset.expanded === 'true';

    if (isExpanded) {
        // Collapse
        content.classList.add('hidden');
        icon.textContent = '▼';
        refItem.dataset.expanded = 'false';
    } else {
        // Expand
        content.classList.remove('hidden');
        icon.textContent = '▲';
        refItem.dataset.expanded = 'true';

        // Fetch scripture if not already loaded
        if (content.querySelector('.loading')) {
            // Show loading state
            content.innerHTML = '<div class="loading">Loading scripture text...</div>';

            try {
                const scriptureText = await fetchScriptureText(reference);
                const bibleGatewayUrl = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=ESV`;

                if (scriptureText) {
                    // Display the fetched scripture
                    content.innerHTML = `
                        <div class="scripture-text">${scriptureText}</div>
                        <p class="scripture-attribution">
                            <a href="${bibleGatewayUrl}" target="_blank" rel="noopener noreferrer">
                                Read ${reference} (ESV) on Bible Gateway →
                            </a>
                        </p>
                    `;
                } else {
                    // Fallback to link only
                    content.innerHTML = `
                        <p class="scripture-notice">
                            <a href="${bibleGatewayUrl}" target="_blank" rel="noopener noreferrer">
                                📖 Read ${reference} (ESV) on Bible Gateway
                            </a>
                        </p>
                        <p class="scripture-note">Opens in a new tab</p>
                    `;
                }
            } catch (error) {
                const bibleGatewayUrl = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=ESV`;
                content.innerHTML = `
                    <p class="scripture-notice">
                        <a href="${bibleGatewayUrl}" target="_blank" rel="noopener noreferrer">
                            📖 Read ${reference} (ESV) on Bible Gateway
                        </a>
                    </p>
                `;
            }
        }
    }
}

// ===== TEXT-TO-SPEECH =====

// Manual speak function (always works, for play buttons)
function speakAlways(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Small delay to ensure cancel completes
        setTimeout(() => {
            try {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1.1;
                utterance.pitch = 1.0;
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

// Auto-speak function (respects soundEnabled toggle)
function speak(text) {
    if (soundEnabled) {
        speakAlways(text);
    }
}

function stopSpeech() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

function toggleSound() {
    soundEnabled = soundToggle.checked;

    // Save preference
    localStorage.setItem('shorterCatechismSoundEnabled', soundEnabled);

    if (!soundEnabled) {
        stopSpeech();
    }
}

// ===== EVENT LISTENERS =====

// Mode switching
flashcardModeBtn.addEventListener('click', () => switchMode('flashcard'));
learningModeBtn.addEventListener('click', () => switchMode('learning'));

// Flashcard mode controls
selectAllBtn.addEventListener('click', selectAllQuestions);
clearAllBtn.addEventListener('click', clearAllQuestions);
rangeBtn.addEventListener('click', showRangeModal);
rangeCancelBtn.addEventListener('click', hideRangeModal);
rangeApplyBtn.addEventListener('click', applyRange);

flashcard.addEventListener('click', flipFlashcard);
fcNextBtn.addEventListener('click', nextFlashcard);
fcPrevBtn.addEventListener('click', prevFlashcard);
fcRandomBtn.addEventListener('click', randomFlashcard);
fcShuffleBtn.addEventListener('click', shuffleFlashcards);
fcRestartBtn.addEventListener('click', restartFlashcards);

// Play button controls (always work, independent of toggle)
playFrontBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (selectedQuestions.length > 0) {
        const question = questions.find(q => q.id === selectedQuestions[currentFlashcardIndex]);
        if (question) speakAlways(question.question);
    }
});

playBackBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (selectedQuestions.length > 0) {
        const question = questions.find(q => q.id === selectedQuestions[currentFlashcardIndex]);
        if (question) speakAlways(question.answer);
    }
});

// Learning mode controls
searchInput.addEventListener('input', (e) => {
    renderQuestionList(e.target.value);
});

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('hidden-mobile');
});

// General controls
soundToggle.addEventListener('change', toggleSound);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (currentMode === 'flashcard') {
        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault();
                nextFlashcard();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevFlashcard();
                break;
            case ' ':
            case 'f':
            case 'F':
                e.preventDefault();
                flipFlashcard();
                break;
            case 'r':
            case 'R':
                randomFlashcard();
                break;
        }
    } else if (currentMode === 'learning') {
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextId = Math.min(currentLearningQuestionId + 1, 107);
                displayLearningQuestion(nextId);
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevId = Math.max(currentLearningQuestionId - 1, 1);
                displayLearningQuestion(prevId);
                break;
            case '/':
                e.preventDefault();
                searchInput.focus();
                break;
        }
    }
});

// Initialize app
loadQuestions();

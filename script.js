/* ========================= QUESTIONS ========================= */
const questions = [
    // Level 1 – add / subtract
    { level: 1, text: "What is 2 + 2?", choices: ["3", "4", "5", "6"], answer: "4" },
    { level: 1, text: "What is 5 - 3?", choices: ["1", "2", "3", "4"], answer: "2" },
    { level: 1, text: "What is 8 - 4?", choices: ["3", "4", "5", "6"], answer: "4" },
    { level: 1, text: "What is 3 + 5?", choices: ["7", "8", "9", "10"], answer: "8" },
    { level: 1, text: "What is 9 - 6?", choices: ["2", "3", "4", "5"], answer: "3" },
    // Level 2 – multiply / divide
    { level: 2, text: "What is 6 × 7?", choices: ["42", "36", "48", "40"], answer: "42" },
    { level: 2, text: "What is 81 ÷ 9?", choices: ["8", "9", "7", "6"], answer: "9" },
    { level: 2, text: "What is 12 × 5?", choices: ["50", "60", "55", "65"], answer: "60" },
    { level: 2, text: "What is 48 ÷ 6?", choices: ["8", "7", "9", "6"], answer: "8" },
    { level: 2, text: "What is 9 × 4?", choices: ["35", "36", "37", "38"], answer: "36" },
    // Level 3 – mixed / larger
    { level: 3, text: "What is 15 + 27?", choices: ["41", "42", "43", "44"], answer: "42" },
    { level: 3, text: "What is 45 - 18?", choices: ["26", "27", "28", "29"], answer: "27" },
    { level: 3, text: "What is 12 × 11?", choices: ["121", "130", "132", "143"], answer: "132" },
    { level: 3, text: "What is 81 ÷ 9?", choices: ["8", "9", "10", "11"], answer: "9" },
    { level: 3, text: "What is 7 × 13?", choices: ["89", "90", "91", "92"], answer: "91" }
];

/* ========================= BADGES ========================= */
const badgeDefinitions = [
    { id: 'first_answer', name: 'First Steps', description: 'Answer your first question', icon: 'target', requirement: 1 },
    { id: 'ten_answers', name: 'Getting Started', description: 'Answer 10 questions correctly', icon: 'local_fire_department', requirement: 10 },
    { id: 'fifty_answers', name: 'Math Enthusiast', description: 'Answer 50 questions correctly', icon: 'menu_book', requirement: 50 },
    { id: 'hundred_answers', name: 'Math Expert', description: 'Answer 100 questions correctly', icon: 'lightbulb', requirement: 100 },
    { id: 'level_2', name: 'Level 2 Achiever', description: 'Reach Level 2', icon: 'star', requirement: 2 },
    { id: 'level_3', name: 'Level 3 Achiever', description: 'Reach Level 3', icon: 'auto_awesome', requirement: 3 },
    { id: 'streak_5', name: 'On Fire!', description: 'Get 5 answers in a row', icon: 'local_fire_department', requirement: 5 },
    { id: 'streak_10', name: 'Unstoppable!', description: 'Get 10 answers in a row', icon: 'bolt', requirement: 10 }
];

/* ========================= GAME STATE ========================= */
let gameState = {
    currentLevel: 1,
    currentQuestion: 0,
    score: 0,
    streak: 0,
    totalCorrect: 0,
    unlockedBadges: [],
    currentLevelQuestions: []
};

/* ========================= INITIALIZATION ========================= */
function initGame() {
    loadGameState();
    loadCurrentLevelQuestions();
    renderBadges();
    displayQuestion();
}

function loadGameState() {
    const saved = localStorage.getItem('mathQuizState');
    if (saved) {
        gameState = JSON.parse(saved);
    }
}

function saveGameState() {
    localStorage.setItem('mathQuizState', JSON.stringify(gameState));
}

/* ========================= LOAD QUESTIONS FOR CURRENT LEVEL ========================= */
function loadCurrentLevelQuestions() {
    gameState.currentLevelQuestions = questions.filter(q => q.level === gameState.currentLevel);
    
    // Safety check: ensure we have questions for this level
    if (gameState.currentLevelQuestions.length === 0) {
        console.error(`No questions found for level ${gameState.currentLevel}`);
        gameState.currentLevelQuestions = questions.filter(q => q.level === 1);
        gameState.currentLevel = 1;
    }
    
    // Reset question index when loading new level
    gameState.currentQuestion = 0;
}

/* ========================= DISPLAY QUESTION ========================= */
function displayQuestion() {
    // Ensure we have questions loaded
    if (!gameState.currentLevelQuestions || gameState.currentLevelQuestions.length === 0) {
        loadCurrentLevelQuestions();
    }

    // Reset to first question if we've gone past the end
    if (gameState.currentQuestion >= gameState.currentLevelQuestions.length) {
        gameState.currentQuestion = 0;
    }

    const question = gameState.currentLevelQuestions[gameState.currentQuestion];
    
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('levelDisplay').textContent = gameState.currentLevel;
    document.getElementById('scoreDisplay').textContent = gameState.score;
    document.getElementById('streakDisplay').textContent = gameState.streak;

    renderChoices(question.choices);
    resetFeedback();
    resetSubmitBtn();
}

function renderChoices(choices) {
    const container = document.getElementById('choicesContainer');
    container.innerHTML = '';

    choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice;
        btn.onclick = () => selectChoice(btn, choice);
        container.appendChild(btn);
    });
}

/* ========================= CHOICE SELECTION ========================= */
let selectedChoice = null;

function selectChoice(btn, choice) {
    // Remove previous selection
    document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
    
    // Add selection to current choice
    btn.classList.add('selected');
    selectedChoice = choice;

    // Enable submit button
    document.getElementById('submitBtn').disabled = false;
}

/* ========================= SUBMIT ANSWER ========================= */
document.getElementById('submitBtn').addEventListener('click', function() {
    if (selectedChoice === null) return;

    const question = gameState.currentLevelQuestions[gameState.currentQuestion];
    const isCorrect = selectedChoice === question.answer;

    showFeedback(isCorrect);
    disableChoices();
    this.disabled = true;

    setTimeout(() => {
        if (isCorrect) {
            gameState.score++;
            gameState.streak++;
            gameState.totalCorrect++;
            checkBadges();
        } else {
            gameState.streak = 0;
        }

        saveGameState();
        nextQuestion();
    }, 1500);
});

function showFeedback(isCorrect) {
    const feedback = document.getElementById('feedback');
    feedback.classList.add('show');
    feedback.classList.toggle('correct', isCorrect);
    feedback.classList.toggle('incorrect', !isCorrect);

    const question = gameState.currentLevelQuestions[gameState.currentQuestion];
    if (isCorrect) {
        feedback.textContent = '✓ Correct!';
    } else {
        feedback.textContent = `✗ Incorrect. The answer is ${question.answer}`;
    }
}

function resetFeedback() {
    const feedback = document.getElementById('feedback');
    feedback.classList.remove('show', 'correct', 'incorrect');
    feedback.textContent = '';
}

function disableChoices() {
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = true;
    });
}

function resetSubmitBtn() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
}

/* ========================= NEXT QUESTION ========================= */
function nextQuestion() {
    gameState.currentQuestion++;

    if (gameState.currentQuestion >= gameState.currentLevelQuestions.length) {
        advanceLevel();
    } else {
        selectedChoice = null;
        displayQuestion();
    }
}

/* ========================= ADVANCE LEVEL ========================= */
function advanceLevel() {
    gameState.currentLevel++;
    loadCurrentLevelQuestions();
    selectedChoice = null;
    showLevelUpModal();
}

function showLevelUpModal() {
    document.getElementById('newLevelDisplay').textContent = gameState.currentLevel;
    document.getElementById('levelUpModal').classList.add('show');

    document.getElementById('continueBtn').onclick = function() {
        document.getElementById('levelUpModal').classList.remove('show');
        displayQuestion();
        saveGameState();
    };
}

/* ========================= SKIP QUESTION ========================= */
document.getElementById('skipBtn').addEventListener('click', function() {
    gameState.streak = 0;
    saveGameState();
    nextQuestion();
});

/* ========================= BADGES ========================= */
function checkBadges() {
    badgeDefinitions.forEach(badge => {
        if (gameState.unlockedBadges.includes(badge.id)) return;

        let unlocked = false;

        if (badge.id === 'first_answer') {
            unlocked = gameState.totalCorrect >= badge.requirement;
        } else if (badge.id === 'ten_answers') {
            unlocked = gameState.totalCorrect >= badge.requirement;
        } else if (badge.id === 'fifty_answers') {
            unlocked = gameState.totalCorrect >= badge.requirement;
        } else if (badge.id === 'hundred_answers') {
            unlocked = gameState.totalCorrect >= badge.requirement;
        } else if (badge.id === 'level_2') {
            unlocked = gameState.currentLevel >= badge.requirement;
        } else if (badge.id === 'level_3') {
            unlocked = gameState.currentLevel >= badge.requirement;
        } else if (badge.id === 'streak_5') {
            unlocked = gameState.streak >= badge.requirement;
        } else if (badge.id === 'streak_10') {
            unlocked = gameState.streak >= badge.requirement;
        }

        if (unlocked) {
            gameState.unlockedBadges.push(badge.id);
            saveGameState();
            renderBadges();
        }
    });
}

function renderBadges() {
    const container = document.getElementById('badgesContainer');
    container.innerHTML = '';

    badgeDefinitions.forEach(badge => {
        const badgeEl = document.createElement('div');
        badgeEl.className = 'badge';
        
        if (gameState.unlockedBadges.includes(badge.id)) {
            badgeEl.classList.add('unlocked');
        }

        badgeEl.innerHTML = `
            <span class="material-icons">${badge.icon}</span>
            <div class="badge-tooltip">${badge.name}</div>
        `;

        container.appendChild(badgeEl);
    });
}

/* ========================= INIT ========================= */
initGame();

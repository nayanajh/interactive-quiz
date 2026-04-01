// script.js - Timed Quiz Application with Category Selection

const quizBanks = {
    aptitude: [
        { q: "What is 15% of 200?", a: ["30", "20", "25", "35"], correct: 0 },
        { q: "If a train travels 60 km in 1 hour, what is its speed?", a: ["60 km/h", "30 km/h", "90 km/h", "45 km/h"], correct: 0 },
        { q: "Simplify 12/18.", a: ["2/3", "1/2", "3/4", "4/5"], correct: 0 },
        { q: "What comes next: 2, 4, 8, 16, ?", a: ["32", "24", "20", "18"], correct: 0 },
        { q: "Area of a square with side 5 cm.", a: ["25 cm²", "20 cm²", "30 cm²", "15 cm²"], correct: 0 }
    ],
    logical: [
        { q: "Which of the following is the odd one out?", a: ["Apple", "Banana", "Carrot", "Orange"], correct: 2 },
        { q: "If A is taller than B and B is taller than C, who is tallest?", a: ["A", "B", "C", "None"], correct: 0 },
        { q: "Complete the series: 1, 4, 9, 16, ?", a: ["25", "36", "49", "64"], correct: 0 },
        { q: "Statement: All men are mortal. Socrates is a man. Conclusion: Socrates is mortal.", a: ["True", "False"], correct: 0 },
        { q: "If all bloops are razzes and some razzes are fizzles, then...", a: ["All bloops are fizzles", "Some bloops are fizzles", "No bloops are fizzles", "All fizzles are bloops"], correct: 1 }
    ],
    sports: [
        { q: "How many players in a cricket team?", a: ["11", "10", "12", "9"], correct: 0 },
        { q: "In which sport is the term 'home run' used?", a: ["Baseball", "Cricket", "Football", "Basketball"], correct: 0 },
        { q: "Who won the FIFA World Cup 2018?", a: ["France", "Brazil", "Germany", "Argentina"], correct: 0 },
        { q: "What is the maximum score in ten-pin bowling?", a: ["300", "200", "400", "250"], correct: 0 },
        { q: "In which Olympic sport do athletes use a pommel horse?", a: ["Gymnastics", "Swimming", "Athletics", "Boxing"], correct: 0 }
    ],
    programming: [
        { q: "What does HTML stand for?", a: ["HyperText Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correct: 0 },
        { q: "Which language is primarily used for web development?", a: ["JavaScript", "Python", "C++", "Java"], correct: 0 },
        { q: "What is a variable in programming?", a: ["A container for storing data", "A function", "A loop structure", "A class definition"], correct: 0 },
        { q: "Which symbol is used for single-line comments in JavaScript?", a: ["//", "#", "/* */", "--"], correct: 0 },
        { q: "What is an array in programming?", a: ["A collection of items", "A single value", "A function", "An object"], correct: 0 }
    ],
    general: [
        { q: "What is the capital of France?", a: ["Paris", "London", "Berlin", "Rome"], correct: 0 },
        { q: "Who painted the Mona Lisa?", a: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"], correct: 0 },
        { q: "What is the largest planet in our solar system?", a: ["Jupiter", "Saturn", "Earth", "Mars"], correct: 0 },
        { q: "In which year did World War II end?", a: ["1945", "1939", "1950", "1940"], correct: 0 },
        { q: "What is the currency of Japan?", a: ["Yen", "Won", "Dollar", "Euro"], correct: 0 }
    ]
};

let quizBank = [];
let currentIndex = 0;
let score = 0;
let hasAnswered = false;
let timeLeft = 10;
let timerInterval = null;

const el = {
    qNum: document.getElementById('qNum'),
    totalQ: document.getElementById('totalQ'),
    questionText: document.getElementById('questionText'),
    options: document.getElementById('options'),
    feedback: document.getElementById('feedback'),
    feedbackEmoji: document.getElementById('feedbackEmoji'),
    feedbackMsg: document.getElementById('feedbackMsg'),
    nextButton: document.getElementById('nextButton'),
    scoreDisplay: document.getElementById('scoreDisplay'),
    progressBar: document.getElementById('progressBar'),
    timerDisplay: document.getElementById('timer'),
    questionScreen: document.getElementById('questionScreen'),
    resultScreen: document.getElementById('resultScreen'),
    categoryScreen: document.getElementById('categoryScreen'),
    finalScore: document.getElementById('finalScore'),
    resultMsg: document.getElementById('resultMsg')
};

function showCategoryScreen() {
    el.categoryScreen.style.display = 'flex';
    el.questionScreen.style.display = 'none';
    el.resultScreen.style.display = 'none';
    el.scoreDisplay.textContent = '0';
}

function selectCategory(category) {
    quizBank = quizBanks[category];
    currentIndex = 0;
    score = 0;
    el.scoreDisplay.textContent = '0';
    el.categoryScreen.style.display = 'none';
    el.questionScreen.style.display = 'block';
    loadDynamicQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    el.timerDisplay.textContent = timeLeft;
    el.timerDisplay.style.color = '#ff3366';

    timerInterval = setInterval(() => {
        timeLeft--;
        el.timerDisplay.textContent = timeLeft;

        if (timeLeft <= 5) {
            el.timerDisplay.style.color = '#ffff00';
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeUp();
        }
    }, 1000);
}

function timeUp() {
    hasAnswered = true;
    const correctIndex = quizBank[currentIndex].correct;

    document.querySelectorAll('.option').forEach(opt => {
        const idx = parseInt(opt.dataset.index);
        if (idx === correctIndex) opt.classList.add('correct');
    });

    el.feedbackEmoji.textContent = '⏰';
    el.feedbackMsg.textContent = `Time's up! The correct answer was: ${quizBank[currentIndex].a[correctIndex]}`;
    el.feedback.classList.add('show', 'error');
    el.nextButton.disabled = false;
}

function loadDynamicQuestion() {
    const q = quizBank[currentIndex];

    el.qNum.textContent = currentIndex + 1;
    el.totalQ.textContent = quizBank.length;

    const progress = ((currentIndex) / quizBank.length) * 100;
    el.progressBar.style.width = `${progress}%`;

    el.questionText.textContent = q.q;
    el.options.innerHTML = '';
    el.feedback.classList.remove('show');
    el.nextButton.disabled = true;
    hasAnswered = false;

    q.a.forEach((answerText, i) => {
        const opt = document.createElement('div');
        opt.className = 'option';
        opt.dataset.index = i;
        opt.innerHTML = `${String.fromCharCode(65 + i)}. ${answerText}`;
        opt.addEventListener('click', handleAnswer);
        el.options.appendChild(opt);
    });

    startTimer();
}

function handleAnswer(e) {
    if (hasAnswered) return;
    hasAnswered = true;
    clearInterval(timerInterval);

    const selectedIndex = parseInt(e.currentTarget.dataset.index);
    const correctIndex = quizBank[currentIndex].correct;

    document.querySelectorAll('.option').forEach(opt => {
        const idx = parseInt(opt.dataset.index);
        opt.classList.add('selected');
        if (idx === correctIndex) opt.classList.add('correct');
        if (idx === selectedIndex && idx !== correctIndex) opt.classList.add('incorrect');
    });

    if (selectedIndex === correctIndex) {
        score += 20;
        el.scoreDisplay.textContent = score;
        el.feedbackEmoji.textContent = '🎉';
        el.feedbackMsg.textContent = `Correct! +20 points (${timeLeft}s left)`;
        el.feedback.classList.add('show', 'success');
    } else {
        el.feedbackEmoji.textContent = '😅';
        el.feedbackMsg.innerHTML = `Incorrect. Correct answer: <strong>${quizBank[currentIndex].a[correctIndex]}</strong>`;
        el.feedback.classList.add('show', 'error');
    }

    el.nextButton.disabled = false;
}

function nextQuestion() {
    clearInterval(timerInterval);
    currentIndex++;

    if (currentIndex < quizBank.length) {
        loadDynamicQuestion();
    } else {
        showFinalResults();
    }
}

function showFinalResults() {
    el.questionScreen.style.display = 'none';
    el.resultScreen.style.display = 'flex';

    el.finalScore.textContent = score;

    const percentage = Math.round((score / (quizBank.length * 20)) * 100);

    if (percentage === 100) el.resultMsg.textContent = "PERFECT! You mastered the timer 🔥";
    else if (percentage >= 80) el.resultMsg.textContent = "Excellent work under pressure! 🏆";
    else if (percentage >= 60) el.resultMsg.textContent = "Solid performance! Keep practicing 💪";
    else el.resultMsg.textContent = "Good effort! Try to beat the clock next time ⏱";

    createParticleExplosion();
}

function createParticleExplosion() {
    const container = document.getElementById('particles');
    const colors = ['#00d4ff', '#ff00aa', '#00ff88'];

    for (let i = 0; i < 100; i++) {
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.width = '10px';
        p.style.height = '10px';
        p.style.borderRadius = '50%';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = '-20px';
        p.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        container.appendChild(p);
        setTimeout(() => p.remove(), 6000);
    }
}

function restartQuiz() {
    currentIndex = 0;
    score = 0;
    el.scoreDisplay.textContent = '0';
    el.questionScreen.style.display = 'none';
    el.resultScreen.style.display = 'none';
    showCategoryScreen();
}

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !el.nextButton.disabled) {
        nextQuestion();
    }
});

// Category selection
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        selectCategory(e.target.dataset.category);
    });
});

// Initialize the Quiz
window.onload = () => {
    showCategoryScreen();
    el.nextButton.addEventListener('click', nextQuestion);
};
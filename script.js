// ====================== QUIZ DATA ======================
const quizzes = {
    geographie: [
        { question: "Quelle est la capitale de la France ?", answers: ["Lyon", "Marseille", "Paris", "Toulouse"], correct: 2 },
        { question: "Quel est le plus grand océan ?", answers: ["Atlantique", "Pacifique", "Indien", "Arctique"], correct: 1 },
        { question: "Quel pays est connu pour les pyramides ?", answers: ["Égypte", "Grèce", "Italie", "Mexique"], correct: 0 },
        { question: "Quelle est la capitale de l’Australie ?", answers: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correct: 2 },
        { question: "Quel est le plus long fleuve du monde ?", answers: ["Nil", "Amazone", "Yangtsé", "Mississippi"], correct: 1 }
    ],
    animaux: [
        { question: "Quel animal est le plus rapide ?", answers: ["Guépard", "Lion", "Tigre", "Éléphant"], correct: 0 },
        { question: "Quel animal pond des œufs ?", answers: ["Chien", "Chat", "Oiseau", "Dauphin"], correct: 2 },
        { question: "Quel animal a une trompe ?", answers: ["Éléphant", "Rhinocéros", "Girafe", "Hippopotame"], correct: 0 },
        { question: "Quel est le mammifère le plus gros ?", answers: ["Baleine bleue", "Éléphant", "Orque", "Hippopotame"], correct: 0 },
        { question: "Quel animal peut changer de couleur ?", answers: ["Caméléon", "Poisson rouge", "Serpent", "Crabe"], correct: 0 }
    ],
    culture: [
        { question: "Qui a peint la Joconde ?", answers: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"], correct: 1 },
        { question: "Combien de lettres dans l'alphabet français ?", answers: ["24", "25", "26", "27"], correct: 2 },
        { question: "Quel auteur a écrit 'Les Misérables' ?", answers: ["Victor Hugo", "Balzac", "Molière", "Zola"], correct: 0 },
        { question: "Quel est le pays du flamenco ?", answers: ["Italie", "Espagne", "Portugal", "France"], correct: 1 },
        { question: "Quel instrument a 88 touches ?", answers: ["Piano", "Guitare", "Violon", "Saxophone"], correct: 0 }
    ],
    sciences: [
        { question: "Quelle planète est la plus proche du soleil ?", answers: ["Terre", "Mars", "Mercure", "Vénus"], correct: 2 },
        { question: "L'eau gèle à ?", answers: ["0°C", "32°C", "100°C", "-10°C"], correct: 0 },
        { question: "Quel est l'élément chimique symbole 'O' ?", answers: ["Or", "Oxygène", "Osmium", "Oganesson"], correct: 1 },
        { question: "Combien de planètes dans le système solaire ?", answers: ["7", "8", "9", "10"], correct: 1 },
        { question: "Quelle est la vitesse de la lumière ?", answers: ["300 000 km/s", "150 000 km/s", "500 000 km/s", "1 000 km/s"], correct: 0 }
    ]
};

// ====================== VARIABLES ======================
let currentQuiz = [];
let currentQuestion = 0;
let score = 0;
let timerInterval;
const timePerQuestion = 10; 
let timeLeft = timePerQuestion;
let confettiAnimationId = null; // Pour stopper confettis

// ====================== LOAD THEMES ======================
const themesContainer = document.getElementById('themes');
for (let theme in quizzes) {
    const btn = document.createElement('button');
    btn.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
    btn.className = 'theme-btn';
    btn.onclick = () => startQuiz(theme);
    themesContainer.appendChild(btn);
}

// ====================== START QUIZ ======================
function startQuiz(theme) {
    currentQuiz = quizzes[theme];
    currentQuestion = 0;
    score = 0;
    document.getElementById('theme-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'flex';
    document.getElementById('quiz-card').style.display = 'block';
    
    // Supprimer overlay score s’il existe
    const overlay = document.getElementById('score-overlay');
    if (overlay) overlay.remove();
    
    // Stop confettis s’il y en avait
    if(confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
    }
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateProgress();
    showQuestion();
}

// ====================== SHOW QUESTION ======================
function showQuestion() {
    const q = currentQuiz[currentQuestion];
    const questionText = document.getElementById('question-text');

    // Transition animée
    questionText.style.opacity = 0;
    questionText.style.transform = "translateX(100px)";
    setTimeout(() => {
        questionText.textContent = q.question;
        questionText.style.transition = "all 0.5s";
        questionText.style.opacity = 1;
        questionText.style.transform = "translateX(0)";
    }, 300);

    // Affichage réponses
    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById("btn" + i);
        btn.textContent = q.answers[i];
        btn.disabled = false;
        btn.classList.remove("correct", "incorrect");
    }

    document.getElementById('feedback').textContent = '';
    document.getElementById('next-btn').style.display = 'none';

    // Timer
    timeLeft = timePerQuestion;
    document.getElementById('time').textContent = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            autoSkip();
        }
    }, 1000);
}

// ====================== HANDLE ANSWERS ======================
function answer(i) {
    clearInterval(timerInterval);
    const q = currentQuiz[currentQuestion];
    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');

    for (let j = 0; j < 4; j++) {
        document.getElementById("btn" + j).disabled = true;
    }

    const btn = document.getElementById("btn" + i);
    if (i === q.correct) {
        btn.classList.add("correct");
        document.getElementById('feedback').textContent = "✅ Correct !";
        correctSound.play();
        score++;
    } else {
        btn.classList.add("incorrect");
        document.getElementById('feedback').textContent = `❌ Incorrect ! La bonne réponse était : ${q.answers[q.correct]}`;
        document.getElementById("btn" + q.correct).classList.add("correct");
        incorrectSound.play();
    }
    document.getElementById('next-btn').style.display = 'inline-block';
    updateProgress();
}

// ====================== AUTO SKIP WHEN TIMEOUT ======================
function autoSkip() {
    const q = currentQuiz[currentQuestion];
    document.getElementById('feedback').textContent = `⏰ Temps écoulé ! La bonne réponse était : ${q.answers[q.correct]}`;
    document.getElementById("btn" + q.correct).classList.add("correct");
    for (let j = 0; j < 4; j++) {
        document.getElementById("btn" + j).disabled = true;
    }
    document.getElementById('next-btn').style.display = 'inline-block';
    const timeoutSound = document.getElementById('timeout-sound');
    if(timeoutSound) timeoutSound.play();
    updateProgress();
}

// ====================== NEXT QUESTION ======================
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < currentQuiz.length) {
        showQuestion();
    } else {
        showScore();
    }
}

// ====================== UPDATE PROGRESS BAR ======================
function updateProgress() {
    const progress = ((currentQuestion) / currentQuiz.length) * 100;
    document.getElementById('progress').style.width = progress + '%';
}

// ====================== SHOW FINAL SCORE ======================
function showScore() {
    document.getElementById('quiz-card').style.display = 'none';

    const scoreOverlay = document.createElement('div');
    scoreOverlay.id = "score-overlay";
    scoreOverlay.innerHTML = `
        <h2>Quiz terminé !</h2>
        <p>Votre score : ${score}/${currentQuiz.length}</p>
        <button id="replay-btn">Rejouer</button>
    `;
    scoreOverlay.style.textAlign = "center";
    scoreOverlay.style.padding = "20px";
    scoreOverlay.style.backgroundColor = "white";
    scoreOverlay.style.borderRadius = "20px";
    scoreOverlay.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
    scoreOverlay.style.maxWidth = "400px";
    scoreOverlay.style.margin = "50px auto";

    document.getElementById('quiz-container').appendChild(scoreOverlay);
    launchConfetti();

    document.getElementById('replay-btn').onclick = replayQuiz;
}

// ====================== REPLAY QUIZ ======================
function replayQuiz() {
    // Stop confettis
    if(confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
    }

    // Supprimer overlay score
    const overlay = document.getElementById('score-overlay');
    if (overlay) overlay.remove();

    // Effacer le canvas
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Remettre carte quiz visible
    document.getElementById('quiz-card').style.display = 'block';
    document.getElementById('theme-selection').style.display = 'flex';
    document.getElementById('quiz-container').style.display = 'none';
}

// ====================== CONFETTI EFFECT ======================
function launchConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettis = [];
    for (let i = 0; i < 200; i++) {
        confettis.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * 200 + 100,
            color: `hsl(${Math.random()*360}, 100%, 50%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettis.forEach((c) => {
            ctx.beginPath();
            ctx.lineWidth = c.r / 2;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
            ctx.stroke();

            c.tiltAngle += c.tiltAngleIncrement;
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.tilt = Math.sin(c.tiltAngle) * 15;

            if (c.y > canvas.height) {
                c.y = -10;
                c.x = Math.random() * canvas.width;
            }
        });

        confettiAnimationId = requestAnimationFrame(draw);
    }

    draw();
}







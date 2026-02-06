
// ==========================================
// CONFIG & GAME STATUS
// ==========================================

const CONFIG = {
    PLANK_LENGTH: 600,
    MIN_WEIGHT: 1,
    MAX_WEIGHT: 10,
    MAX_ANGLE: 30,
    SCALE_FACTOR: 3
};

const gameState = {
    isPaused: false,
    objects: []
};


// ==========================================
// HTML ELEMENTS (DOM)
// ==========================================

const plankElement = document.getElementById('plank');
const leftWeightDisplay = document.getElementById('total-weight-left');
const rightWeightDisplay = document.getElementById('total-weight-right');

const pauseButton = document.getElementById('btn-pause');
const resetButton = document.getElementById('btn-reset');
const logList = document.querySelector('.log-list');


// ==========================================
// SOUND EFFECTS (+)
// ==========================================

const soundLight = new Audio('assets/sounds/light.mp3');
const soundMedium = new Audio('assets/sounds/medium.mp3');
const soundHeavy = new Audio('assets/sounds/heavy.mp3');
const soundReset = new Audio('assets/sounds/reset.mp3');


// ==========================================
// FUNCTIONS
// ==========================================

function playDropSounds(weight) {
    let selectedSound;

    if (weight < 4) {
        selectedSound = soundLight;
    } else if (weight < 8) {
        selectedSound = soundMedium;
    } else {
        selectedSound = soundHeavy;
    }

    selectedSound.currentTime = 0;
    selectedSound.play().catch(e => { /* mute fix */ });
}

function playResetSound() {
    soundReset.currentTime = 0;
    soundReset.play().catch(e => { /* mute fix */ });
}

function addToLog(weight, side, distance) {
    if (!logList) return;

    const logItem = document.createElement('li');
    logItem.innerHTML = ` ⓘ <strong>Info:</strong> <b>${weight}kg</b> placed the <span class="${side}">${side}</span> side at ${distance}px.`;
    logItem.classList.add('log-item');

    logList.prepend(logItem);
}


// ==========================================
// TORQUE & PYHSICS & LOGIC (CORE: EVERYTHING)
// ==========================================

function createRandomWeights(distance, side) {

    const randomWeight = Math.ceil(Math.random() * CONFIG.MAX_WEIGHT);

    const weightElement = document.createElement('div');
    weightElement.classList.add('weight-box');
    weightElement.textContent = randomWeight + 'kg';

    weightElement.style.left = (side === 'left')
        ? ((CONFIG.PLANK_LENGTH / 2) - distance) + 'px'
        : ((CONFIG.PLANK_LENGTH / 2) + distance) + 'px';

    const size = 30 + (randomWeight * CONFIG.SCALE_FACTOR);
    weightElement.style.width = size + 'px';
    weightElement.style.height = size + 'px';

    // Chic Color Palette (Matching Slate/Indigo theme)
    const colors = [
        '#ef4444', // Red-500
        '#3b82f6', // Blue-500
        '#10b981', // Emerald-500
        '#f59e0b', // Amber-500
        '#8b5cf6', // Violet-500
        '#06b6d4', // Cyan-500
        '#ec4899'  // Pink-500
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    weightElement.style.backgroundColor = randomColor;

    plankElement.appendChild(weightElement);

    const weightData = {
        weight: randomWeight,
        distance: distance,
        side: side,
        color: randomColor
    };

    gameState.objects.push(weightData);

    updateGame();
    saveGame();
    playDropSounds(randomWeight);
    addToLog(randomWeight, side, distance);
}

function updateGame() {
    const torqueResults = calculateTorque();
    updateSeesawBalance(torqueResults.leftTorque, torqueResults.rightTorque);
}

function calculateTorque() {
    let leftTorque = 0;
    let rightTorque = 0;
    let leftTotalWeight = 0;
    let rightTotalWeight = 0;

    for (let i = 0; i < gameState.objects.length; i++) {
        const obj = gameState.objects[i];
        const torqueValue = obj.weight * obj.distance;

        if (obj.side === 'left') {
            leftTorque = leftTorque + torqueValue;
            leftTotalWeight = leftTotalWeight + obj.weight;
        } else {
            rightTorque = rightTorque + torqueValue;
            rightTotalWeight = rightTotalWeight + obj.weight;
        }
    }

    leftWeightDisplay.textContent = leftTotalWeight + ' KG';
    rightWeightDisplay.textContent = rightTotalWeight + ' KG';

    return { leftTorque, rightTorque };
}

function updateSeesawBalance(leftTorque, rightTorque) {
    const diffOfSides = rightTorque - leftTorque;
    let plankAngle = diffOfSides / 10;

    if (plankAngle > CONFIG.MAX_ANGLE) {
        plankAngle = CONFIG.MAX_ANGLE;
    } else if (plankAngle < -CONFIG.MAX_ANGLE) {
        plankAngle = -CONFIG.MAX_ANGLE;
    }

    plankElement.style.transform = `rotate(${plankAngle}deg)`;
}


// ==========================================
// LOCALSTORAGE FNC's
// ==========================================

function saveGame() {
    localStorage.setItem('seesawGameData', JSON.stringify(gameState.objects));
}

function loadGame() {
    const data = localStorage.getItem('seesawGameData');

    if (data) {
        const objects = JSON.parse(data);

        objects.forEach((item) => {
            const weightElement = document.createElement('div');
            weightElement.classList.add('weight-box');
            weightElement.textContent = item.weight + 'kg';

            weightElement.style.left = (item.side === 'left')
                ? ((CONFIG.PLANK_LENGTH / 2) - item.distance) + 'px'
                : ((CONFIG.PLANK_LENGTH / 2) + item.distance) + 'px';

            const size = 30 + (item.weight * 3);
            weightElement.style.width = size + 'px';
            weightElement.style.height = size + 'px';
            weightElement.style.backgroundColor = item.color;

            plankElement.appendChild(weightElement);

            gameState.objects.push(item);
            addToLog(item.weight, item.side, item.distance);
        });

        updateGame();
    }
}


// ==========================================
// PAUSE & RESET - CONTROL BUTTONS
// ==========================================

plankElement.addEventListener('click', function (event) {
    if (gameState.isPaused) return;

    const clickPosition = event.offsetX;
    const centerPoint = CONFIG.PLANK_LENGTH / 2;
    const distance = clickPosition - centerPoint;

    const side = (distance < 0) ? 'left' : 'right';
    const absoluteDistance = Math.abs(distance);

    createRandomWeights(absoluteDistance, side);
});

pauseButton.addEventListener('click', () => {
    gameState.isPaused = !gameState.isPaused;

    if (gameState.isPaused === true) {
        pauseButton.textContent = "Resume";
        pauseButton.style.backgroundColor = 'gray';
        plankElement.style.cursor = 'not-allowed';
    } else {
        pauseButton.textContent = "Pause";
        pauseButton.style.backgroundColor = '';
        plankElement.style.cursor = 'pointer';
    }
});

resetButton.addEventListener('click', () => {
    gameState.objects = [];
    gameState.isPaused = false;

    const selectAllBoxes = document.querySelectorAll('.weight-box');
    for (let i = 0; i < selectAllBoxes.length; i++) {
        selectAllBoxes[i].remove();
    }

    plankElement.style.transform = 'rotate(0deg)';
    leftWeightDisplay.textContent = '0 KG';
    rightWeightDisplay.textContent = '0 KG';

    pauseButton.textContent = "Pause";
    pauseButton.style.backgroundColor = '';
    plankElement.style.cursor = 'pointer';

    localStorage.removeItem('seesawGameData');
    if (logList) logList.innerHTML = '';

    playResetSound();
});


// Start Game
loadGame();
// ==========================================
// HTML ELEMENTS 
// ==========================================

// Game settings variables. I used object its could be clean.

const CONFIG = {
    PLANK_LENGHT: 600,
    MIN_WEIGHT: 1,
    MAX_WEIGHT: 10
};

// oyun durumu

let gameState = {
    isPaused: false,
    objects: []
};

// PLANK ELEMENT
const plankElement = document.getElementById('plank');
// Weights left right
const leftWeightValue = document.getElementById('total-weight-left');
const rightWeightValue = document.getElementById('total-weight-right');

//Our Buttons 

const pauseButton = document.getElementById('btn-pause');
const resetButton = document.getElementById('btn-reset');

/*console.log('Deneme');
console.log(CONFIG.PLANK_LENGHT)
console.log(leftWeightValue.textContent)*/

// ==========================================
// PLANK AND CLICK LOGIC 
// ==========================================

plankElement.addEventListener('click', function (event) {

    if (gameState.isPaused) return;

    let clickPosition = event.offsetX;
    let centerPoint = CONFIG.PLANK_LENGHT / 2;

    //for calculate distance from center point

    let distance = clickPosition - centerPoint;

    let side = ''; // null? 
    if (distance < 0) {
        side = 'left';
    } else {
        side = 'right';
    }

    let absoluteDistance = Math.abs(distance); // distance value should be positive value

    console.log('Tıklanan yer:', clickPosition)
    console.log('Orta noktam', centerPoint)
    console.log('Mutlak uzaklik', absoluteDistance)
    console.log('right or left ? ', side)

    createRandomWeights(absoluteDistance, side);
})

// ==========================================
//  ADDING WEIGHTS (CREATE WEIGHT) 
// ==========================================

function createRandomWeights(distance, side) {

    // Rastgele Sayı üretelim.

    let randomWeight = Math.ceil(Math.random() * CONFIG.MAX_WEIGHT);
    // We can use math.floor too but its easiest way.

    let newBox = document.createElement('div');

    newBox.classList.add('weight-box');

    newBox.textContent = randomWeight + 'kg';
    newBox.style.left = (side === 'left')
        ? (300 - distance) + 'px'
        : (300 + distance) + 'px';

    //! newBox.style.transform = ??

    let boxSize = 30 + (randomWeight * 3);
    newBox.style.width = boxSize + 'px';
    newBox.style.height = boxSize + 'px';

    const colors = ['red', 'yellow', 'cyan', 'purple', 'aqua', 'orange', 'green'];

    let randomColor = colors[Math.floor(Math.random() * colors.length)];

    newBox.style.backgroundColor = randomColor; //now, the box colored.

    plankElement.appendChild(newBox);

    console.log('ağırlık eklendi')

    let totalWeightObj = {
        weight: randomWeight,
        distance: distance, //absoluteDistance already
        side: side,
        color: randomColor
    }

    gameState.objects.push(totalWeightObj);

    updateGame();
    saveGame();
    playDropSounds(randomWeight);

}

// ==========================================
//  PHYSICS & CALCULATION 
// ==========================================

// her clickte güncellemek icin
function updateGame() {
    let torqueResults = calculateTorque();
    updateSeesawBalance(torqueResults.leftTorque, torqueResults.rightTorque);
}

// torque
function calculateTorque() {
    let leftTorque = 0;
    let rightTorque = 0;
    let leftTotalWeight = 0;
    let rightTotalWeight = 0;

    for (let i = 0; i < gameState.objects.length; i++) {
        let obj = gameState.objects[i];

        let torqueValue = obj.weight * obj.distance;

        if (obj.side === 'left') {
            leftTorque = leftTorque + torqueValue;
            leftTotalWeight = leftTotalWeight + obj.weight;
        } else {
            rightTorque = rightTorque + torqueValue;
            rightTotalWeight = rightTotalWeight + obj.weight;

        }

        console.log('sol tork:', leftTorque, 'sağ Tork:', rightTorque);
    }

    leftWeightValue.textContent = leftTotalWeight + ' KG';
    rightWeightValue.textContent = rightTotalWeight + ' KG';

    return { leftTorque, rightTorque }
}

// to move seesaw balance 
function updateSeesawBalance(leftTorque, rightTorque) {
    let diffOfSides = rightTorque - leftTorque;

    let plankAngle = diffOfSides / 10

    if (plankAngle > 30) {
        plankAngle = 30;
    } else if (plankAngle < -30) {
        plankAngle = -30;
    }

    plankElement.style.transform = `rotate(${plankAngle}deg)`;
}

// ==========================================
//  CONTROLS - PAUSE/RESET
// ==========================================

pauseButton.addEventListener('click', () => {
    gameState.isPaused = !gameState.isPaused;

    if (gameState.isPaused === true) {
        pauseButton.textContent = "Resume";
        pauseButton.style.backgroundColor = 'gray';
        plankElement.style.cursor = 'not-allowed';
        console.log('Oyun duraklatıldı.');
    } else {
        pauseButton.textContent = "Pause";
        pauseButton.style.backgroundColor = '';
        plankElement.style.cursor = 'pointer';
        console.log('Oyun devam ediyor.')
    }

})

resetButton.addEventListener('click', () => {
    gameState.objects = [];
    gameState.isPaused = false;

    let selectAllBoxes = document.querySelectorAll('.weight-box');

    for (let i = 0; i < selectAllBoxes.length; i++) {
        selectAllBoxes[i].remove();
    }

    plankElement.style.transform = 'rotate(0deg)';
    leftWeightValue.textContent = '0 KG';
    rightWeightValue.textContent = '0 KG';

    // fixed bug 
    pauseButton.textContent = "Pause";
    pauseButton.style.backgroundColor = '';
    plankElement.style.cursor = 'pointer';
    console.log('Oyun sıfırladım')

    localStorage.removeItem('seesawGameData');

    playResetSound();
})

// ==========================================
//  save to localStorage
// ==========================================

function saveGame() {
    localStorage.setItem('seesawGameData', JSON.stringify(gameState.objects));
}

function loadGame() {
    const data = localStorage.getItem('seesawGameData');

    if (data) {
        const objects = JSON.parse(data);

        objects.forEach((item) => {

            let newBox = document.createElement('div');
            newBox.classList.add('weight-box');

            newBox.textContent = item.weight + 'kg';
            newBox.style.left = (item.side === 'left')
                ? (300 - item.distance) + 'px'
                : (300 + item.distance) + 'px';


            let boxSize = 30 + (item.weight * 3);
            newBox.style.width = boxSize + 'px';
            newBox.style.height = boxSize + 'px';

            const colors = ['red', 'yellow', 'cyan', 'purple', 'aqua', 'orange', 'green'];


            newBox.style.backgroundColor = item.color;

            plankElement.appendChild(newBox);


            gameState.objects.push(item)

        });

        updateGame();


    }
}

loadGame();
console.log(gameState.objects)


// ==========================================
//  SOUND EFFECTS 
// ==========================================

const soundLight = new Audio('assets/sounds/light.mp3');
const soundMedium = new Audio('assets/sounds/medium.mp3');
const soundHeavy = new Audio('assets/sounds/heavy.mp3');
const soundReset = new Audio('assets/sounds/reset.mp3');

function playDropSounds(weight) {

    if (weight < 4) {
        selectedSound = soundLight;
    } else if (weight < 8) {
        selectedSound = soundMedium;
    } else {
        selectedSound = soundHeavy;
    }

    selectedSound.currentTime = 0; // for fixing rewind problem*


    selectedSound.play();

}

function playResetSound() {
    soundReset.currentTime = 0;

    soundReset.play();
}
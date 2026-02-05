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

    let totalWeightsObj = {
        weight: randomWeight,
        distance: distance, //absoluteDistance already
        side: side
    }

    gameState.objects.push(totalWeightsObj);

    updateGame();

}

// ==========================================
//  PHYSICS & CALCULATION 
// ==========================================

// her clickte güncellemek icin
function updateGame() {
    calculateTorque();
    updateSeesawBalance();
}

// torque
function calculateTorque() {
    let leftTorque = 0;
    let rightTorque = 0;

    for (let i = 0; i < gameState.objects.length; i++) {
        let obj = gameState.objects[i];

        let torqueValue = obj.weight * obj.distance;

        if (obj.side === 'left') {
            leftTorque = leftTorque + torqueValue;
        } else {
            rightTorque = rightTorque + torqueValue;
        }

        console.log('sol tork:', leftTorque, 'sağ Tork:', rightTorque);
    }


    return {leftTorque,rightTorque}
}

// to move seesaw balance 
function updateSeesawBalance() {

}
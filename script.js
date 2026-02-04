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
    if (distance<0){
        side = 'left';
    } else {
        side = 'right';
    }

    let absoluteDistance = Math.abs(distance); // distance value should be positive value

    console.log('Tıklanan yer:', clickPosition)
    console.log('Orta noktam', centerPoint)
    console.log('Mutlak uzaklik', absoluteDistance)
    console.log('right or left ? ', side)


})




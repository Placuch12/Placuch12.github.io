let points = 0;
let baseValue = 1;
let cardOperations = {
    1: 'add',
    2: 'add',
    3: 'add'
};

function setCardOperation(cardNumber, operation) {
    cardOperations[cardNumber] = operation;
}

function processThroughCards(value) {
    let result1 = value;
    let result2 = value;
    let result3 = value;

    // Card 1 processing
    switch (cardOperations[1]) {
        case 'add':
            result1 = value + 1;
            break;
        case 'multiply':
            result1 = value * 2;
            break;
        case 'subtract':
            result1 = value - 1;
            break;
    }
    document.getElementById('card1-output').innerText = `Altered by: ${result1 - value}`;

    // Card 2 processing
    switch (cardOperations[2]) {
        case 'add':
            result2 = result1 + 1;
            break;
        case 'multiply':
            result2 = result1 * 2;
            break;
        case 'subtract':
            result2 = result1 - 1;
            break;
    }
    document.getElementById('card2-output').innerText = `Altered by: ${result2 - result1}`;

    // Card 3 processing
    switch (cardOperations[3]) {
        case 'add':
            result3 = result2 + 1;
            break;
        case 'multiply':
            result3 = result2 * 2;
            break;
        case 'subtract':
            result3 = result2 - 1;
            break;
    }
    document.getElementById('card3-output').innerText = `Altered by: ${result3 - result2}`;

    return result3 - value;
}

function updatePoints() {
    const processedValue = processThroughCards(baseValue);
    points += processedValue;
    document.getElementById('point-counter').innerText = `Points: ${points}`;
    document.getElementById('points-per-second').innerText = `Points per second: ${processedValue}`;
}

// Update points every second
setInterval(updatePoints, 1000);

const elementContainer = document.getElementById('elementContainer');
const element1Display = document.getElementById('element1');
const element2Display = document.getElementById('element2');
const combineBtn = document.getElementById('combineBtn');
const clearBtn = document.getElementById('clearBtn');
const progressDisplay = document.getElementById('progressDisplay');

let unlockedElements = ["fire", "water", "earth", "air"];
let selectedElement1 = null;
let selectedElement2 = null;

let elementsData = {};
let combinationsData = [];

async function fetchData() {
    try {
        const elementsResponse = await fetch('data/elements.json');
        const combinationsResponse = await fetch('data/combinations.json');
        elementsData = await elementsResponse.json();
        combinationsData = await combinationsResponse.json();

        updateProgress();
        renderElements();
    } catch (error) {
        console.error("Error loading JSON data: ", error);
    }
}

function renderElements() {
    elementContainer.innerHTML = '';
    unlockedElements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.classList.add('element');
        elementDiv.innerHTML = `<img src="assets/${elementsData[element].texture}" alt="${element}" title="${element}">`;
        elementDiv.onclick = () => selectElement(element);
        elementContainer.appendChild(elementDiv);
    });
}

function updateProgress() {
    const totalElements = Object.keys(elementsData).length;
    const unlockedCount = unlockedElements.length;
    progressDisplay.textContent = `Elements: ${unlockedCount}/${totalElements}`;
}

function selectElement(element) {
    if (!selectedElement1) {
        selectedElement1 = element;
        element1Display.innerHTML = `<img src="assets/${elementsData[element].texture}" alt="${element}" title="${element}" style="width: 120px; height: 120px; object-fit: contain;">`;
    } else if (!selectedElement2) {
        selectedElement2 = element;
        element2Display.innerHTML = `<img src="assets/${elementsData[element].texture}" alt="${element}" title="${element}" style="width: 120px; height: 120px; object-fit: contain; image-rendering: pixelated;">`;
    }
}

combineBtn.onclick = () => {
    if (selectedElement1 && selectedElement2) {
        const combination = combinationsData.find(combo => {
            return (combo.elements[0] === selectedElement1 && combo.elements[1] === selectedElement2) ||
                   (combo.elements[0] === selectedElement2 && combo.elements[1] === selectedElement1);
        });

        if (combination && !unlockedElements.includes(combination.result)) {
            unlockedElements.push(combination.result);
            updateProgress();
        }

        selectedElement1 = null;
        selectedElement2 = null;
        element1Display.innerHTML = ' ';
        element2Display.innerHTML = ' ';

        renderElements();
    }
};

clearBtn.onclick = () => {
    selectedElement1 = null;
    selectedElement2 = null;
    element1Display.innerHTML = ' ';
    element2Display.innerHTML = ' ';
}

fetchData();

const elementContainer = document.getElementById('elementContainer');
const element1Display = document.getElementById('element1');
const element2Display = document.getElementById('element2');
const combineBtn = document.getElementById('combineBtn');

let elements = ["fire", "water", "earth", "air"];
let unlockedElements = [...elements];  // Start with basic elements
let selectedElement1 = null;
let selectedElement2 = null;

// Load elements from elements.json (in practice, you might fetch or import this JSON)
const elementData = {
    "fire": { "texture": "fire.png" },
    "water": { "texture": "water.png" },
    "earth": { "texture": "earth.png" },
    "air": { "texture": "air.png" },
};

// Load combinations from combinations.json
const combinationsData = [
    { "elements": ["fire", "water"], "result": "steam" },
    { "elements": ["earth", "water"], "result": "mud" }
];

// Display unlocked elements
function renderElements() {
    elementContainer.innerHTML = '';
    unlockedElements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.classList.add('element');
        elementDiv.innerHTML = `<img src="assets/${elementData[element].texture}" alt="${element}">`;
        elementDiv.onclick = () => selectElement(element);
        elementContainer.appendChild(elementDiv);
    });
}

// Select element
function selectElement(element) {
    if (!selectedElement1) {
        selectedElement1 = element;
        element1Display.textContent = element;
    } else if (!selectedElement2) {
        selectedElement2 = element;
        element2Display.textContent = element;
    }
}

// Combine elements
combineBtn.onclick = () => {
    if (selectedElement1 && selectedElement2) {
        const combination = combinationsData.find(combo => {
            return combo.elements.includes(selectedElement1) && combo.elements.includes(selectedElement2);
        });

        if (combination && !unlockedElements.includes(combination.result)) {
            unlockedElements.push(combination.result);
        }

        // Clear selections
        selectedElement1 = null;
        selectedElement2 = null;
        element1Display.textContent = 'Element 1';
        element2Display.textContent = 'Element 2';

        renderElements();
    }
};

// Initial rendering
renderElements();

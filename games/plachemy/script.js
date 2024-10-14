const elementContainer = document.getElementById('elementContainer');
const element1Display = document.getElementById('element1');
const element2Display = document.getElementById('element2');
const combineBtn = document.getElementById('combineBtn');
const progressDisplay = document.getElementById('progressDisplay');  // For displaying progress

let unlockedElements = ["fire", "water", "earth", "air"];  // Starting with the basic elements
let selectedElement1 = null;
let selectedElement2 = null;

let elementsData = {};  // Will hold elements from elements.json
let combinationsData = [];  // Will hold combinations from combinations.json

// Fetch elements.json and combinations.json
async function fetchData() {
    try {
        const elementsResponse = await fetch('data/elements.json');
        const combinationsResponse = await fetch('data/combinations.json');
        elementsData = await elementsResponse.json();
        combinationsData = await combinationsResponse.json();

        updateProgress();  // Initial progress update
        renderElements();
    } catch (error) {
        console.error("Error loading JSON data: ", error);
    }
}

// Display unlocked elements
function renderElements() {
    elementContainer.innerHTML = '';
    unlockedElements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.classList.add('element');
        elementDiv.innerHTML = `<img src="assets/${elementsData[element].texture}" alt="${element}" title="${element}">`;  // Title for hover
        elementDiv.onclick = () => selectElement(element);
        elementContainer.appendChild(elementDiv);
    });
}

// Update progress display
function updateProgress() {
    const totalElements = Object.keys(elementsData).length;
    const unlockedCount = unlockedElements.length;
    progressDisplay.textContent = `Elements: ${unlockedCount}/${totalElements}`;
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
        // Find combination
        const combination = combinationsData.find(combo => {
            return (combo.elements[0] === selectedElement1 && combo.elements[1] === selectedElement2) ||
                   (combo.elements[0] === selectedElement2 && combo.elements[1] === selectedElement1);
        });

        if (combination) {
            // Unlock the new element if not already unlocked
            if (!unlockedElements.includes(combination.result)) {
                unlockedElements.push(combination.result);
            }
            updateProgress();  // Update progress when a new element is unlocked
        }

        // Clear selections no matter what
        selectedElement1 = null;
        selectedElement2 = null;
        element1Display.textContent = 'Element 1';
        element2Display.textContent = 'Element 2';

        // Re-render elements
        renderElements();
    }
};

// Initial fetching of data
fetchData();

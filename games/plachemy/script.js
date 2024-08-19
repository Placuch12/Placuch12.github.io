document.addEventListener('DOMContentLoaded', () => {
    const elementsContainer = document.getElementById('elements-container');
    const workspace = document.getElementById('workspace');

    let elements = {};
    let combinations = [];

    // Define starting elements
    const startingElements = ["fire", "water", "earth", "air"];

    // Load elements and combinations from JSON files
    fetch('data/elements.json')
        .then(response => response.json())
        .then(data => {
            elements = data;
            renderStartingElements();
        });

    fetch('data/combinations.json')
        .then(response => response.json())
        .then(data => {
            combinations = data;
        });

    function renderStartingElements() {
        elementsContainer.innerHTML = '';  // Clear the container
        startingElements.forEach(element => {
            if (elements[element]) {  // Check if the element exists in the loaded data
                const elementDiv = document.createElement('div');
                elementDiv.classList.add('element');
                elementDiv.style.backgroundImage = `url('assets/${elements[element].texture}')`;
                elementDiv.dataset.element = element;
                elementDiv.draggable = true;  // Set draggable attribute

                elementsContainer.appendChild(elementDiv);

                // Event listeners for drag
                elementDiv.addEventListener('dragstart', handleDragStart);
            }
        });
    }

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.element);
        e.dataTransfer.effectAllowed = 'move';  // Set the drag effect
    }

    workspace.addEventListener('dragover', e => {
        e.preventDefault();  // Allow drop
        e.dataTransfer.dropEffect = 'move';  // Indicate that this drop is a move
    });

    workspace.addEventListener('drop', e => {
        e.preventDefault();
        const element1 = e.dataTransfer.getData('text/plain');

        if (element1) {
            const newElement = combineElements(element1);
            if (newElement) {
                alert(`You created ${newElement}!`);
                addElement(newElement);
            }
        }
    });

    function combineElements(el1) {
        for (let combination of comb

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
                elementsContainer.appendChild(elementDiv);

                elementDiv.addEventListener('dragstart', handleDragStart);
            }
        });
    }

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.element);
    }

    workspace.addEventListener('dragover', e => {
        e.preventDefault();
    });

    workspace.addEventListener('drop', e => {
        e.preventDefault();
        const element1 = e.dataTransfer.getData('text/plain');
        const element2 = e.target.dataset.element;

        if (element1 && element2) {
            const newElement = combineElements(element1, element2);
            if (newElement) {
                alert(`You created ${newElement}!`);
                addElement(newElement);
            }
        }
    });

    function combineElements(el1, el2) {
        for (let combination of combinations) {
            if ((combination.elements.includes(el1) && combination.elements.includes(el2)) &&
                el1 !== el2) {
                return combination.result;
            }
        }
        return null;
    }

    function addElement(element) {
        if (!elements[element]) {
            elements[element] = { texture: `${element}.png` };
            renderElements();
        }
    }

    function renderElements() {
        elementsContainer.innerHTML = '';
        Object.keys(elements).forEach(element => {
            const elementDiv = document.createElement('div');
            elementDiv.classList.add('element');
            elementDiv.style.backgroundImage = `url('assets/${elements[element].texture}')`;
            elementDiv.dataset.element = element;
            elementsContainer.appendChild(elementDiv);

            elementDiv.addEventListener('dragstart', handleDragStart);
        });
    }
});

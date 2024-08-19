document.addEventListener('DOMContentLoaded', () => {
    const elementsContainer = document.getElementById('elements-container');
    const workspace = document.getElementById('workspace');

    let elements = {};
    let combinations = [];
    const startingElements = ["fire", "water", "earth", "air"];
    let draggedElement = null;
    let offsetX = 0;
    let offsetY = 0;

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
            if (elements[element]) {
                const elementDiv = document.createElement('div');
                elementDiv.classList.add('element');
                elementDiv.style.backgroundImage = `url('assets/${elements[element].texture}')`;
                elementDiv.dataset.element = element;
                elementDiv.draggable = true;

                elementsContainer.appendChild(elementDiv);

                elementDiv.addEventListener('dragstart', handleDragStart);
                elementDiv.addEventListener('dragend', handleDragEnd);
            }
        });
    }

    function handleDragStart(e) {
        // Hide the original element
        e.target.style.opacity = '0.5';

        draggedElement = e.target.cloneNode(true);
        draggedElement.classList.add('dragging');
        draggedElement.style.position = 'absolute';
        draggedElement.style.pointerEvents = 'none';

        // Calculate offset
        const rect = e.target.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        document.body.appendChild(draggedElement);

        // Set drag data
        e.dataTransfer.setData('text/plain', e.target.dataset.element);
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragEnd(e) {
        // Restore the original element
        e.target.style.opacity = '';
        if (draggedElement) {
            draggedElement.remove();
            draggedElement = null;
        }
    }

    workspace.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    workspace.addEventListener('drop', e => {
        e.preventDefault();

        if (draggedElement) {
            // Calculate position relative to workspace
            const rect = workspace.getBoundingClientRect();
            const x = e.clientX - rect.left - offsetX;
            const y = e.clientY - rect.top - offsetY;

            const element1 = e.dataTransfer.getData('text/plain');
            const elementDiv = document.createElement('div');
            elementDiv.classList.add('element');
            elementDiv.style.backgroundImage = `url('assets/${elements[element1].texture}')`;
            elementDiv.dataset.element = element1;
            elementDiv.style.position = 'absolute';
            elementDiv.style.left = `${x}px`;
            elementDiv.style.top = `${y}px`;
            elementDiv.draggable = true;

            workspace.appendChild(elementDiv);
            elementDiv.addEventListener('dragstart', handleDragStartElementOnWorkspace);

            workspace.addEventListener('mousemove', checkOverlap);
        }
    });

    function handleDragStartElementOnWorkspace(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.element);
        e.dataTransfer.effectAllowed = 'move';
    }

    function checkOverlap() {
        const draggedElements = Array.from(workspace.querySelectorAll('.element'));
        if (draggedElements.length > 1) {
            for (let i = 0; i < draggedElements.length - 1; i++) {
                for (let j = i + 1; j < draggedElements.length; j++) {
                    if (isOverlapping(draggedElements[i], draggedElements[j])) {
                        const el1 = draggedElements[i].dataset.element;
                        const el2 = draggedElements[j].dataset.element;
                        const newElement = combineElements(el1, el2);
                        if (newElement) {
                            alert(`You created ${newElement}!`);
                            addElement(newElement);
                            draggedElements.forEach(el => el.remove()); // Remove old elements
                            workspace.removeEventListener('mousemove', checkOverlap); // Stop checking for overlap
                            break;
                        }
                    }
                }
            }
        }
    }

    function isOverlapping(el1, el2) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    function combineElements(el1, el2) {
        for (let combination of combinations) {
            if (combination.elements.includes(el1) && combination.elements.includes(el2)) {
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
            elementDiv.draggable = true;

            elementsContainer.appendChild(elementDiv);

            elementDiv.addEventListener('dragstart', handleDragStart);
            elementDiv.addEventListener('dragend', handleDragEnd);
        });
    }
});

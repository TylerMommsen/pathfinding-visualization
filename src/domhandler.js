// update square display
function displayNode(node, currNodeType, newNodeType, grid, delay) {
  const domSquare = grid.findDomSquare(node.row - 1, node.col - 1);

  if (delay !== 0) {
    domSquare.classList.remove('animated');
    // eslint-disable-next-line no-unused-expressions
    domSquare.offsetWidth;
    if (newNodeType !== 'closed-list') {
      domSquare.classList.add('animated');
    }
  }

  domSquare.classList.toggle(currNodeType, false);
  domSquare.classList.toggle(newNodeType, true);
}

// fill grid completely with barriers
function fillGrid(grid, squareSize) {
  const gridContainer = document.querySelector('.grid-container');
  gridContainer.innerHTML = '';

  // Create a document fragment to batch the updates
  const fragment = document.createDocumentFragment();

  gridContainer.removeAttribute('class');
  gridContainer.classList.add('grid-container');
  gridContainer.classList.add(`${squareSize}-grid`);

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const gridSquare = document.createElement('div');
      gridSquare.classList.add('grid-square');
      gridSquare.classList.add('barrier');
      gridSquare.classList.add(`${squareSize}`);

      fragment.appendChild(gridSquare);
    }
  }

  // Append the entire fragment to the container at once
  gridContainer.appendChild(fragment);
}

// display full grid
function createGrid(grid, squareSize) {
  const gridContainer = document.querySelector('.grid-container');
  gridContainer.innerHTML = '';

  // Create a document fragment to batch the updates
  const fragment = document.createDocumentFragment();

  gridContainer.removeAttribute('class');
  gridContainer.classList.add('grid-container');
  gridContainer.classList.add(`${squareSize}-grid`);

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const gridSquare = document.createElement('div');
      gridSquare.classList.add('grid-square');
      gridSquare.classList.add('empty');
      gridSquare.classList.add(`${squareSize}`);

      fragment.appendChild(gridSquare);
    }
  }

  // Append the entire fragment to the container at once
  gridContainer.appendChild(fragment);
}

const DomHandler = {
  createGrid,
  fillGrid,
  displayNode,
};

export default DomHandler;

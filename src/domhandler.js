function updateSquare(gridSquare, nodeType) {
  gridSquare.classList.add(nodeType);
}

function displayAlgorithm(node, grid) {
  const domSquare = grid.findDomSquare(node.row - 1, node.col - 1);
  domSquare.removeAttribute('class');
  domSquare.classList.add('grid-square');
  domSquare.classList.add(node.nodeType);
}

function displayGrid(grid, squareSize) {
  console.log(grid);
  const gridContainer = document.querySelector('.grid-container');
  if (squareSize === 'small') {
    gridContainer.classList.remove('medium-grid');
    gridContainer.classList.remove('large-grid');
    gridContainer.classList.add('small-grid');
    console.log('making small');
  } else if (squareSize === 'medium') {
    gridContainer.classList.add('medium-grid');
  } else if (squareSize === 'large') {
    gridContainer.classList.add('large-grid');
  }
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const gridSquare = document.createElement('div');
      gridSquare.classList.add('grid-square');
      gridSquare.classList.add('empty');
      console.log(squareSize);
      if (squareSize === 'small') {
        console.log('working');
        gridSquare.classList.remove('medium');
        gridSquare.classList.remove('large');
        gridSquare.classList.add('small');
      } else if (squareSize === 'medium') {
        gridSquare.classList.add('medium');
      } else if (squareSize === 'large') {
        gridSquare.classList.add('large');
      }
      gridContainer.appendChild(gridSquare);
    }
  }
}

function resetGrid() {
  const gridContainer = document.querySelector('.grid-container');
  const gridContainerChildren = gridContainer.querySelectorAll('.grid-square');

  for (let i = 0; i < gridContainerChildren.length; i++) {
    gridContainerChildren[i].classList.remove('barrier');
    gridContainerChildren[i].classList.remove('start');
    gridContainerChildren[i].classList.remove('end');
    gridContainerChildren[i].classList.remove('open-list');
    gridContainerChildren[i].classList.remove('closed-list');
    gridContainerChildren[i].classList.remove('final-path');

    // gridContainerChildren[i].removeAttribute('class');
    // gridContainerChildren[i].classList.add('grid-square');
    // gridContainerChildren[i].classList.add('empty');
  }
}

const DomHandler = {
  displayGrid,
  updateSquare,
  displayAlgorithm,
  resetGrid,
};

export default DomHandler;

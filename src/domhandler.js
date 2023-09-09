function handleClick(square) {}

function displayGrid(rows, cols) {
  const gridContainer = document.querySelector('.grid-container');
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const gridSquare = document.createElement('div');
      gridSquare.classList.add('grid-square');
      gridSquare.classList.add('empty');
      gridSquare.addEventListener('click', handleClick(gridSquare));
      gridContainer.appendChild(gridSquare);
    }
  }
}

const DomHandler = {
  displayGrid,
};

export default DomHandler;

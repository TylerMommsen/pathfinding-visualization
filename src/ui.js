function displayGrid(rows, cols) {
    const gridContainer = document.querySelector('.grid-container');
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const gridSquare = document.createElement('div');
            gridSquare.classList.add('grid-square');
            gridContainer.appendChild(gridSquare);
        }
    }
}

export default displayGrid;
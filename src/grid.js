import Node from './node';
import DomHandler from './domhandler';

export default class Grid {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.start = { node: null };
    this.end = { node: null };
    this.grid = [];
    this.createGrid(this.rows, this.cols);

    this.isDragging = false;
  }

  setSquareStatus(row, col) {
    if (this.start.node === null) {
      this.grid[row][col].start = true;
      this.start.node = this.grid[row][col];
    } else if (this.end.node === null) {
      this.grid[row][col].end = true;
      this.end.node = this.grid[row][col];
    } else {
      this.grid[row][col].barrier = true;
    }
  }

  handleMouseDown(gridSquare, row, col) {
    this.isDragging = true;
    DomHandler.updateSquare(
      this.grid,
      row,
      col,
      this.start,
      this.end,
      gridSquare,
    );
    this.setSquareStatus(row, col);
  }

  handleMouseMove(gridSquare, row, col) {
    if (this.isDragging) {
      DomHandler.updateSquare(
        this.grid,
        row,
        col,
        this.start,
        this.end,
        gridSquare,
      );
      this.setSquareStatus(row, col);
    }
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  addListeners() {
    const gridContainer = document.querySelector('.grid-container');

    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        const gridSquare = gridContainer.childNodes[row + 1 * col + 1];
        gridSquare.addEventListener('mousedown', () => {
          this.handleMouseDown(gridSquare, row, col);
        });
        gridSquare.addEventListener('mousemove', () => {
          this.handleMouseMove(gridSquare, row, col);
        });
        gridContainer.appendChild(gridSquare);
      }
    }
    document.addEventListener('mouseup', () => {
      this.handleMouseUp();
    });
  }

  createGrid(rows, cols) {
    for (let row = 0; row < rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < cols; col++) {
        this.grid[row].push(new Node(row, col));
      }
    }
    DomHandler.displayGrid(this.grid);
    this.addListeners();
  }
}

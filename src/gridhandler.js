import Node from './node';
import domhandler from './domhandler';

function createGrid(rows, cols) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let node = new Node(row, col);
    }
  }
}

export default function load() {
  const rows = 25;
  const cols = 60;
  domhandler.displayGrid(rows, cols);
  createGrid(rows, cols);
}

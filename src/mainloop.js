import Grid from './grid';
import astar from './algorithms/astar';

let grid = null;
let gridObj = null;
const ROWS = 25;
const COLS = 60;

function loadGrid() {
  gridObj = new Grid(ROWS, COLS);
  grid = gridObj.grid;
}

const startButton = document.querySelector('.start-algorithm');

startButton.addEventListener('click', () => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      grid[row][col].setNeighbors(grid);
    }
  }

  const startNode = gridObj.start.node;
  const endNode = gridObj.end.node;
  if (startNode && endNode) {
    astar(startNode, endNode);
  }
});

export default function load() {
  loadGrid();
}

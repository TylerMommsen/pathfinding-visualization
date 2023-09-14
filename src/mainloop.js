import Grid from './grid';
import astar from './algorithms/astar';

let grid = null;
let gridObj = null;
const ROWS = 25;
const COLS = 60;
const selectedAlgorithm = null;
const selectedMaze = null;

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

function addListenersToBtns() {
  const dropdownButtons = document.querySelectorAll('.dropdown-btn');
  const dropdownLists = document.querySelectorAll('.dropdown-list');

  function closeDropdowns() {
    dropdownLists.forEach((list) => {
      list.classList.remove('show');
    });
  }

  dropdownButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentList = dropdownLists[index];
      const isListOpen = currentList.classList.contains('show');

      closeDropdowns();

      if (!isListOpen) {
        currentList.classList.toggle('show');
      }
    });
  });

  document.addEventListener('click', (e) => {
    const isClickInsideDropdown = Array.from(dropdownLists).some((list) =>
      list.contains(e.target),
    );

    if (!isClickInsideDropdown) {
      closeDropdowns();
    }
  });

  dropdownLists.forEach((list, index) => {
    const listItems = list.querySelectorAll('.list-selection');

    listItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        dropdownLists[index].classList.remove('show');
        dropdownButtons[index].textContent = item.textContent;
        e.stopPropagation();
      });
    });
  });
}

export default function load() {
  loadGrid();
  document.addEventListener('DOMContentLoaded', () => {
    addListenersToBtns();
  });
}

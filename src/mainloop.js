import Grid from './grid';
import astar from './algorithms/astar';
import dijkstra from './algorithms/dijkstra';

let gridObj = null;
const ROWS = 25;
const COLS = 60;
let selectedAlgorithm = null;
let selectedMaze = null;
const running = [false]; // check whether an algorithm is currently running

function loadGrid() {
  gridObj = new Grid(ROWS, COLS);
}

async function runAStar() {
  const startNode = gridObj.start.node;
  const endNode = gridObj.end.node;

  try {
    running[0] = true;
    const pathFound = await astar(startNode, endNode);

    if (pathFound) {
      console.log('found path');
      running[0] = false;
    } else {
      console.log('path not found');
    }
  } catch (error) {
    console.log(error);
  } finally {
    running[0] = false;
  }
}

async function runDijkstra() {
  const startNode = gridObj.start.node;
  const endNode = gridObj.end.node;

  try {
    running[0] = true;
    const pathFound = await dijkstra(gridObj.grid, startNode, endNode);

    if (pathFound) {
      console.log('found path');
      running[0] = false;
    } else {
      console.log('path not found');
    }
  } catch (error) {
    console.log(error);
  } finally {
    running[0] = false;
  }
}

const startButton = document.querySelector('.start-algorithm');

startButton.addEventListener('click', async () => {
  if (running[0]) return; // algorithm in progress
  gridObj.setAllNodeNeighbors();

  if (gridObj.start.node && gridObj.end.node) {
    if (selectedAlgorithm === 'A*') runAStar();
    if (selectedAlgorithm === 'Dijkstra') runDijkstra();
  }
});

function addListenersToBtns() {
  const dropdownButtons = document.querySelectorAll('.dropdown-btn');
  const dropdownLists = document.querySelectorAll('.dropdown-list');
  const clearBoardBtn = document.querySelector('.clear-board');

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
    const isClickInsideDropdown = Array.from(dropdownLists).some((list) => list.contains(e.target));

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
        if (index === 0) selectedAlgorithm = item.textContent;
        if (index === 1) selectedMaze = item.textContent;
        e.stopPropagation();
      });
    });
  });

  clearBoardBtn.addEventListener('click', () => {
    gridObj.resetGrid();
  });
}

function addListenersToGrid() {
  gridObj.addListeners(running);
}

export default function load() {
  loadGrid();
  addListenersToGrid();
  document.addEventListener('DOMContentLoaded', () => {
    addListenersToBtns();
  });
}

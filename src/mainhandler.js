import Grid from './grid';
import AlgorithmFactory from './algorithmfactory';
import MazeFactory from './mazefactory';

let gridObj = null;
let selectedAlgorithm = null;
let selectedMaze = null;
const running = [false]; // check if path or maze algorithm is currently running
let currMazeSpeedSetting = 'Normal';
let currPathfindingSpeedSetting = 'Normal';
let mazeSpeed = 10;
let pathfindingSpeed = 10;
let gridSize = 'medium';

// contains info associated with each grid size
const gridSizes = {
  small: { rows: 15, cols: 37 },
  medium: { rows: 25, cols: 61 },
  large: { rows: 37, cols: 91 },
};

// pathfinding speeds for different grid sizes
const pathfindingSpeeds = {
  slow: { small: 150, medium: 30, large: 30 },
  normal: { small: 50, medium: 10, large: 10 },
  fast: { small: 20, medium: 5, large: 1 },
  instant: 0,
};

// maze generation speeds for different grid sizes
const mazeGenSpeeds = {
  slow: { small: 120, medium: 20, large: 10 },
  normal: { small: 30, medium: 10, large: 3 },
  fast: { small: 15, medium: 1, large: 0.1 },
  instant: 0,
};

// initially loaded grid
function loadGrid() {
  gridObj = new Grid(gridSizes.medium.rows, gridSizes.medium.cols, gridSize, running);
  gridObj.setAllNodeNeighbors();
}

// run pathfinding algorithm
async function runAlgorithm(pathFindingAlgorithm) {
  if (running[0] || !pathFindingAlgorithm || !gridObj.start.node || !gridObj.end.node) return;
  running[0] = true;

  gridObj.resetPath();

  if (pathFindingAlgorithm === 'Dijkstra') {
    for (let row = 0; row < gridObj.grid.length; row++) {
      for (let col = 0; col < gridObj.grid[0].length; col++) {
        gridObj.grid[row][col].g = Infinity;
      }
    }
  }

  const startNode = gridObj.start.node;
  const endNode = gridObj.end.node;

  const algorithm = AlgorithmFactory.createAlgorithm(pathFindingAlgorithm);
  await algorithm(startNode, endNode, pathfindingSpeed);

  running[0] = false;
}

// run maze generation algorithm
async function generateMaze(mazeGenerationAlgorithm) {
  if (running[0] || mazeGenerationAlgorithm === null) return;
  running[0] = true;
  gridObj.resetGrid();

  const maze = MazeFactory.createMaze(mazeGenerationAlgorithm);
  await maze(gridObj, mazeSpeed);

  running[0] = false;
}

// update how fast maze generates
function updateMazeDelay(speed) {
  const newSpeed = speed.toLowerCase();
  if (gridSize === 'small') {
    mazeSpeed = mazeGenSpeeds[newSpeed].small;
  }
  if (gridSize === 'medium') {
    mazeSpeed = mazeGenSpeeds[newSpeed].medium;
  }
  if (gridSize === 'large') {
    mazeSpeed = mazeGenSpeeds[newSpeed].large;
  }

  if (speed === 'Instant') mazeSpeed = mazeGenSpeeds.instant;
}

// update how fast path algorithm explores nodes
function updatePathfindingDelay(speed) {
  const newSpeed = speed.toLowerCase();
  if (gridSize === 'small') {
    pathfindingSpeed = pathfindingSpeeds[newSpeed].small;
  }
  if (gridSize === 'medium') {
    pathfindingSpeed = pathfindingSpeeds[newSpeed].medium;
  }
  if (gridSize === 'large') {
    pathfindingSpeed = pathfindingSpeeds[newSpeed].large;
  }

  if (speed === 'Instant') pathfindingSpeed = pathfindingSpeeds.instant;
}

function updateGridSize(size) {
  const newSize = size.toLowerCase();
  gridSize = newSize;

  gridObj.updateGridSize(gridSizes[newSize].rows, gridSizes[newSize].cols, newSize);

  gridObj.resetGrid();

  updatePathfindingDelay(currPathfindingSpeedSetting);
  updateMazeDelay(currMazeSpeedSetting);
}

function addListenersToBtns() {
  const startBtn = document.querySelector('.start-algorithm');
  const generateMazeBtn = document.querySelector('.generate-maze');

  const selectAlgoBtn = document.querySelector('.select-algo-btn');
  const selectMazeBtn = document.querySelector('.select-maze-btn');
  const gridSizeBtn = document.querySelector('.grid-size-btn');
  const selectMazeSpeedBtn = document.querySelector('.select-maze-speed-btn');
  const selectAlgoSpeedBtn = document.querySelector('.select-algo-speed-btn');

  const selectAlgoBtnList = document.querySelector('.algo-list');
  const selectMazeBtnList = document.querySelector('.maze-list');
  const gridSizeBtnList = document.querySelector('.grid-size-list');
  const selectMazeSpeedBtnList = document.querySelector('.maze-speed-list');
  const selectAlgoSpeedBtnList = document.querySelector('.algo-speed-list');
  const selectAlgoListItems = selectAlgoBtnList.querySelectorAll('.list-selection');
  const selectMazeListItems = selectMazeBtnList.querySelectorAll('.list-selection');
  const gridSizeListItems = gridSizeBtnList.querySelectorAll('.list-selection');
  const selectMazeSpeedListItems = selectMazeSpeedBtnList.querySelectorAll('.list-selection');
  const selectAlgoSpeedListItems = selectAlgoSpeedBtnList.querySelectorAll('.list-selection');

  const dropdownButtons = document.querySelectorAll('.dropdown-btn');
  const dropdownLists = document.querySelectorAll('.dropdown-list');
  const clearBoardBtn = document.querySelector('.clear-board');
  const clearPathBtn = document.querySelector('.clear-path');
  const eraseModeBtn = document.querySelector('.erase-mode');

  let currentPage = 0;
  const darkOverlay = document.querySelector('.dark-overlay');
  const helpBoard = document.querySelector('.help-board');
  const pages = helpBoard.querySelectorAll('.page');
  const skipBtns = helpBoard.querySelectorAll('.skip-btn');
  const nextBtns = helpBoard.querySelectorAll('.next-btn');
  const previousBtns = helpBoard.querySelectorAll('.previous-btn');
  const continueBtn = helpBoard.querySelector('.continue-btn');
  const helpBtn = document.querySelector('.help-btn');

  startBtn.addEventListener('click', () => {
    runAlgorithm(selectedAlgorithm);
  });

  generateMazeBtn.addEventListener('click', () => {
    generateMaze(selectedMaze);
  });

  skipBtns.forEach((skipBtn) => {
    skipBtn.addEventListener('click', () => {
      helpBoard.style.display = 'none';
      darkOverlay.style.display = 'none';
    });
  });

  previousBtns.forEach((previousBtn) => {
    previousBtn.addEventListener('click', () => {
      if (currentPage > 0) {
        pages[currentPage].removeAttribute('id');
        currentPage -= 1;
        pages[currentPage].setAttribute('id', 'show-page');
      }
    });
  });

  nextBtns.forEach((nextBtn) => {
    nextBtn.addEventListener('click', () => {
      if (currentPage < pages.length - 1) {
        pages[currentPage].removeAttribute('id');
        currentPage += 1;
        pages[currentPage].setAttribute('id', 'show-page');
      }
    });
  });

  continueBtn.addEventListener('click', () => {
    helpBoard.style.display = 'none';
    darkOverlay.style.display = 'none';
  });

  function closeDropdowns() {
    dropdownLists.forEach((list) => {
      list.classList.remove('show');
    });
  }

  dropdownButtons.forEach((button, index) => {
    if (running[0]) return; // algorithm in progress
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

  helpBtn.addEventListener('click', () => {
    darkOverlay.style.display = 'block';
    helpBoard.style.display = 'flex';

    pages[currentPage].removeAttribute('id');
    currentPage = 0;
    pages[currentPage].setAttribute('id', 'show-page');
  });

  selectAlgoListItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      selectAlgoBtnList.classList.remove('show');
      selectAlgoBtn.textContent = item.textContent;
      selectedAlgorithm = item.textContent;
      e.stopPropagation();
    });
  });

  selectMazeListItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      selectMazeBtnList.classList.remove('show');
      selectMazeBtn.textContent = item.textContent;
      selectedMaze = item.textContent;
      e.stopPropagation();
    });
  });

  selectMazeSpeedListItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      selectMazeSpeedBtnList.classList.remove('show');
      selectMazeSpeedBtn.textContent = `Maze Speed: ${item.textContent}`;
      currMazeSpeedSetting = item.textContent;
      updateMazeDelay(item.textContent);
      e.stopPropagation();
    });
  });

  selectAlgoSpeedListItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      selectAlgoSpeedBtnList.classList.remove('show');
      selectAlgoSpeedBtn.textContent = `Pathfinding Speed: ${item.textContent}`;
      currPathfindingSpeedSetting = item.textContent;
      updatePathfindingDelay(item.textContent);
      e.stopPropagation();
    });
  });

  gridSizeListItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (running[0]) return;
      gridSizeBtnList.classList.remove('show');
      gridSizeBtn.textContent = `Grid Size: ${item.textContent}`;
      updateGridSize(item.textContent);
      e.stopPropagation();
    });
  });

  clearBoardBtn.addEventListener('click', () => {
    if (running[0]) return;
    gridObj.resetGrid();
  });

  clearPathBtn.addEventListener('click', () => {
    if (running[0]) return;
    gridObj.resetPath();
  });

  eraseModeBtn.addEventListener('click', (e) => {
    if (e.target.textContent === 'Erase: Off') {
      e.target.textContent = 'Erase: On';
    } else if (e.target.textContent === 'Erase: On') {
      e.target.textContent = 'Erase: Off';
    }
    gridObj.setEraseMode();
  });
}

function addListenersToGrid() {
  gridObj.addListeners();
}

export default function load() {
  loadGrid();
  addListenersToGrid();
  document.addEventListener('DOMContentLoaded', () => {
    addListenersToBtns();
  });
}

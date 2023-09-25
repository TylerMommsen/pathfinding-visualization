/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scss/main.scss":
/*!****************************!*\
  !*** ./src/scss/main.scss ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/algorithms/astar.js":
/*!*********************************!*\
  !*** ./src/algorithms/astar.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ astar)
/* harmony export */ });
function astar(startNode, endNode, delay) {
  const openList = [];
  const closedList = [];
  const finalPath = [];

  function removeFromArr(node) {
    for (let i = 0; i < openList.length; i++) {
      if (openList[i] === node) {
        openList.splice(i, 1);
      }
    }
  }

  async function displayFinalPath(path) {
    for (let i = path.length - 1; i >= 0; i--) {
      if (path[i].nodeType === 'start' || path[i].nodeType === 'end') continue;
      await new Promise((resolve) => setTimeout(resolve, 30));
      path[i].setNodeType('final-path');
    }
  }

  openList.push(startNode);

  async function algorithm() {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    let currentNode = null;
    let lowestF = Infinity;
    for (let i = 0; i < openList.length; i++) {
      openList[i].calcScores(startNode, endNode);
      if (openList[i].f < lowestF) {
        lowestF = openList[i].f;
        currentNode = openList[i];
      }
    }

    if (currentNode === endNode) {
      let temp = currentNode;
      finalPath.push(temp);
      while (temp.previousNode) {
        finalPath.push(temp.previousNode);
        temp = temp.previousNode;
      }
      displayFinalPath(finalPath);
      return true;
    }

    closedList.push(currentNode);
    if (currentNode.nodeType !== 'start' && currentNode.nodeType !== 'end') {
      currentNode.setNodeType('closed-list');
    }
    removeFromArr(currentNode);

    for (let i = 0; i < currentNode.neighbors.length; i++) {
      const currNeighbor = currentNode.neighbors[i];

      if (currNeighbor.nodeType !== 'barrier' && !closedList.includes(currNeighbor)) {
        const tempG = currentNode.g + 1;
        if (openList.includes(currNeighbor)) {
          if (tempG < currNeighbor.g) {
            currNeighbor.g = tempG;
          }
        } else {
          currNeighbor.g = tempG;
          openList.push(currNeighbor);
          if (currNeighbor.nodeType !== 'start' && currNeighbor.nodeType !== 'end') {
            currNeighbor.setNodeType('open-list');
          }
        }

        currNeighbor.previousNode = currentNode;
      }
    }

    if (openList.length > 0) {
      return algorithm();
    }
  }

  return algorithm();
}


/***/ }),

/***/ "./src/algorithms/dijkstra.js":
/*!************************************!*\
  !*** ./src/algorithms/dijkstra.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dijkstra)
/* harmony export */ });
async function dijkstra(grid, startNode, endNode, delay) {
  const openListQueue = []; // tracks nodes to visit
  const closedList = [];
  const finalPath = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      grid[row][col].g = Infinity;
    }
  }

  async function displayFinalPath(path) {
    for (let i = path.length - 1; i >= 0; i--) {
      if (path[i].nodeType === 'start' || path[i].nodeType === 'end') continue;
      await new Promise((resolve) => setTimeout(resolve, 30));
      path[i].setNodeType('final-path');
    }
  }

  startNode.g = 0;
  openListQueue.push(startNode);

  async function algorithm() {
    await new Promise((resolve) => setTimeout(resolve, delay));
    const currentNode = openListQueue.shift();
    if (currentNode.nodeType !== 'start' && currentNode.nodeType !== 'end') {
      currentNode.setNodeType('closed-list');
    }

    if (currentNode === endNode) {
      let temp = currentNode;
      finalPath.push(temp);
      while (temp.previousNode) {
        finalPath.push(temp.previousNode);
        temp = temp.previousNode;
      }
      displayFinalPath(finalPath);
      return true;
    }

    for (let i = 0; i < currentNode.neighbors.length; i++) {
      const currNeighbor = currentNode.neighbors[i];

      if (currNeighbor.nodeType !== 'barrier' && !closedList.includes(currNeighbor)) {
        if (currNeighbor.g === Infinity) {
          currNeighbor.g = currentNode.g + 1;
          currNeighbor.previousNode = currentNode;
          openListQueue.push(currNeighbor);
          if (currNeighbor.nodeType !== 'start' && currNeighbor.nodeType !== 'end') {
            currNeighbor.setNodeType('open-list');
          }
        }
      }
    }

    if (openListQueue.length > 0) {
      algorithm();
    } else {
      return false;
    }
  }

  const done = algorithm();
  return done;
}


/***/ }),

/***/ "./src/domhandler.js":
/*!***************************!*\
  !*** ./src/domhandler.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function updateSquare(gridSquare, nodeType) {
  gridSquare.classList.add(nodeType);
}

function displayAlgorithm(node, grid, squareSize) {
  const domSquare = grid.findDomSquare(node.row - 1, node.col - 1);
  domSquare.removeAttribute('class');
  domSquare.classList.add('grid-square');
  domSquare.classList.add(node.nodeType);
  if (squareSize === 80) {
    domSquare.classList.add('small');
  } else if (squareSize === 30) {
    domSquare.classList.add('medium');
  } else if (squareSize === 15) {
    domSquare.classList.add('large');
  }
}

function displayGrid(grid, squareSize) {
  const gridContainer = document.querySelector('.grid-container');
  gridContainer.innerHTML = '';
  if (squareSize === 'small') {
    gridContainer.classList.remove('medium-grid');
    gridContainer.classList.remove('large-grid');
    gridContainer.classList.add('small-grid');
  } else if (squareSize === 'medium') {
    gridContainer.classList.remove('small-grid');
    gridContainer.classList.remove('large-grid');
    gridContainer.classList.add('medium-grid');
  } else if (squareSize === 'large') {
    gridContainer.classList.remove('small-grid');
    gridContainer.classList.remove('medium-grid');
    gridContainer.classList.add('large-grid');
  }
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const gridSquare = document.createElement('div');
      gridSquare.classList.add('grid-square');
      gridSquare.classList.add('empty');
      if (squareSize === 'small') {
        gridSquare.classList.remove('medium');
        gridSquare.classList.remove('large');
        gridSquare.classList.add('small');
      } else if (squareSize === 'medium') {
        gridSquare.classList.remove('small');
        gridSquare.classList.remove('large');
        gridSquare.classList.add('medium');
      } else if (squareSize === 'large') {
        gridSquare.classList.remove('small');
        gridSquare.classList.remove('medium');
        gridSquare.classList.add('large');
      }
      gridContainer.appendChild(gridSquare);
    }
  }
}

function resetGrid(nodeWidth) {
  const gridContainer = document.querySelector('.grid-container');
  const gridContainerChildren = gridContainer.querySelectorAll('.grid-square');

  for (let i = 0; i < gridContainerChildren.length; i++) {
    gridContainerChildren[i].removeAttribute('class');
    gridContainerChildren[i].classList.add('grid-square');
    gridContainerChildren[i].classList.add('empty');
    if (nodeWidth === 'small') {
      gridContainerChildren[i].classList.add('small');
    } else if (nodeWidth === 'medium') {
      gridContainerChildren[i].classList.add('medium');
    } else if (nodeWidth === 'large') {
      gridContainerChildren[i].classList.add('large');
    }
  }
}

const DomHandler = {
  displayGrid,
  updateSquare,
  displayAlgorithm,
  resetGrid,
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DomHandler);


/***/ }),

/***/ "./src/grid.js":
/*!*********************!*\
  !*** ./src/grid.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Grid)
/* harmony export */ });
/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node */ "./src/node.js");
/* harmony import */ var _domhandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domhandler */ "./src/domhandler.js");



class Grid {
  constructor(rows, cols, nodeWidth) {
    this.rows = rows;
    this.cols = cols;
    this.nodeWidth = nodeWidth;
    this.start = { node: null };
    this.end = { node: null };
    this.grid = [];
    this.openList = [];
    this.closedList = [];
    this.finalPath = [];
    this.createGrid(this.rows, this.cols);

    this.isDragging = false;
  }

  setSquareStatus(gridSquare, row, col) {
    const currentNode = this.grid[row][col];
    if (currentNode.nodeType !== 'empty') return;
    if (this.start.node === null) {
      currentNode.nodeType = 'start';
      this.start.node = currentNode;
    } else if (this.end.node === null) {
      currentNode.nodeType = 'end';
      this.end.node = currentNode;
    } else {
      currentNode.nodeType = 'barrier';
    }
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].updateSquare(gridSquare, currentNode.nodeType);
  }

  handleMouseDown(gridSquare, row, col) {
    this.isDragging = true;
    this.setSquareStatus(gridSquare, row, col);
  }

  handleMouseMove(gridSquare, row, col) {
    if (this.isDragging) {
      this.setSquareStatus(gridSquare, row, col);
    }
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  findDomSquare(row, col) {
    const gridContainer = document.querySelector('.grid-container');
    const gridContainerChildren = gridContainer.children;
    const index = row * this.cols + col;
    return gridContainerChildren[index];
  }

  addListeners(currentlyRunning) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const gridSquare = this.findDomSquare(row, col);
        gridSquare.addEventListener('mousedown', () => {
          if (currentlyRunning[0]) return;
          this.handleMouseDown(gridSquare, row, col);
        });
        gridSquare.addEventListener('mousemove', () => {
          if (currentlyRunning[0]) return;
          this.handleMouseMove(gridSquare, row, col);
        });
      }
    }

    document.addEventListener('mouseup', () => {
      this.handleMouseUp();
    });
  }

  createGrid(rows, cols) {
    for (let row = 1; row <= rows; row++) {
      const currentRow = [];
      for (let col = 1; col <= cols; col++) {
        currentRow.push(new _node__WEBPACK_IMPORTED_MODULE_0__["default"](row, col, this.rows, this.cols, this, this.nodeWidth));
      }
      this.grid.push(currentRow);
    }
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].displayGrid(this.grid, this.nodeWidth);
  }

  setAllNodeNeighbors() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        this.grid[row][col].setNeighbors(this.grid);
      }
    }
  }

  resetGrid() {
    // creating new grid
    this.grid = [];
    for (let row = 1; row <= this.rows; row++) {
      const currentRow = [];
      for (let col = 1; col <= this.cols; col++) {
        currentRow.push(new _node__WEBPACK_IMPORTED_MODULE_0__["default"](row, col, this.rows, this.cols, this, this.nodeWidth));
      }
      this.grid.push(currentRow);
    }

    // setting neighbours again
    this.setAllNodeNeighbors();

    // resetting start and end node
    this.start.node = null;
    this.end.node = null;

    // reseting dom squares
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].resetGrid(this.nodeWidth);
  }

  resetPath() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const currNode = this.grid[row][col];
        if (
          currNode.nodeType === 'open-list' ||
          currNode.nodeType === 'closed-list' ||
          currNode.nodeType === 'final-path'
        ) {
          currNode.setNodeType('empty');
        }
      }
    }
  }

  updateGridSize(rows, cols, nodeWidth) {
    this.rows = rows;
    this.cols = cols;
    this.nodeWidth = nodeWidth;
    this.resetGrid();
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].displayGrid(this.grid, nodeWidth);
    this.addListeners([false]);
  }
}


/***/ }),

/***/ "./src/mainhandler.js":
/*!****************************!*\
  !*** ./src/mainhandler.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ load)
/* harmony export */ });
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grid */ "./src/grid.js");
/* harmony import */ var _algorithms_astar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./algorithms/astar */ "./src/algorithms/astar.js");
/* harmony import */ var _algorithms_dijkstra__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./algorithms/dijkstra */ "./src/algorithms/dijkstra.js");
/* harmony import */ var _mazes_randommap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mazes/randommap */ "./src/mazes/randommap.js");
/* harmony import */ var _mazes_binarytree__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mazes/binarytree */ "./src/mazes/binarytree.js");
/* harmony import */ var _mazes_sidewinder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mazes/sidewinder */ "./src/mazes/sidewinder.js");
/* harmony import */ var _mazes_recursivedivision__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mazes/recursivedivision */ "./src/mazes/recursivedivision.js");
/* harmony import */ var _mazes_prims__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./mazes/prims */ "./src/mazes/prims.js");
/* harmony import */ var _mazes_huntandkill__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./mazes/huntandkill */ "./src/mazes/huntandkill.js");










let gridObj = null;
let rows = 25;
let cols = 61;
let selectedAlgorithm = null;
let selectedMaze = null;
const running = [false]; // check if algorithm is currently running
let currMazeSpeedSetting = 'Normal';
let currPathfindingSpeedSetting = 'Normal';
let mazeSpeed = 10;
let pathfindingSpeed = 10;
let gridSize = 'medium';

function loadGrid() {
  gridObj = new _grid__WEBPACK_IMPORTED_MODULE_0__["default"](rows, cols, gridSize);
}

async function runAStar() {
  const startNode = gridObj.start.node;
  const endNode = gridObj.end.node;

  try {
    running[0] = true;
    const pathFound = await (0,_algorithms_astar__WEBPACK_IMPORTED_MODULE_1__["default"])(startNode, endNode, pathfindingSpeed);

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
    const pathFound = await (0,_algorithms_dijkstra__WEBPACK_IMPORTED_MODULE_2__["default"])(gridObj.grid, startNode, endNode, pathfindingSpeed);

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

const startBtn = document.querySelector('.start-algorithm');

startBtn.addEventListener('click', async () => {
  if (running[0] || selectedAlgorithm === null) return; // algorithm in progress
  gridObj.setAllNodeNeighbors();
  gridObj.resetPath();

  let done;
  if (gridObj.start.node && gridObj.end.node) {
    if (selectedAlgorithm === 'A*') done = await runAStar();
    if (selectedAlgorithm === 'Dijkstra') done = await runDijkstra();
  }

  if (done) running[0] = false;
});

const generateMazeBtn = document.querySelector('.generate-maze');

generateMazeBtn.addEventListener('click', async () => {
  if (running[0] || selectedMaze === null) return; // algorithm in progress
  running[0] = true;
  gridObj.resetGrid();

  let done;
  if (selectedMaze === 'Random Map') {
    done = await (0,_mazes_randommap__WEBPACK_IMPORTED_MODULE_3__["default"])(gridObj.grid, mazeSpeed);
  }
  if (selectedMaze === 'Binary Tree') {
    done = await (0,_mazes_binarytree__WEBPACK_IMPORTED_MODULE_4__["default"])(gridObj.grid, mazeSpeed);
  }
  if (selectedMaze === 'Sidewinder') {
    done = await (0,_mazes_sidewinder__WEBPACK_IMPORTED_MODULE_5__["default"])(gridObj.grid, mazeSpeed);
  }
  if (selectedMaze === 'Recursive Division') {
    done = await (0,_mazes_recursivedivision__WEBPACK_IMPORTED_MODULE_6__["default"])(gridObj.grid, mazeSpeed);
  }
  if (selectedMaze === "Prim's") {
    done = await (0,_mazes_prims__WEBPACK_IMPORTED_MODULE_7__["default"])(gridObj.grid, mazeSpeed);
  }
  if (selectedMaze === 'Hunt & Kill') {
    done = await (0,_mazes_huntandkill__WEBPACK_IMPORTED_MODULE_8__["default"])(gridObj.grid, mazeSpeed);
  }
  if (done) running[0] = false;
});

function updateMazeDelay(speed) {
  if (gridSize === 'small') {
    if (speed === 'Slow') mazeSpeed = 200;
    if (speed === 'Normal') mazeSpeed = 50;
    if (speed === 'Fast') mazeSpeed = 25;
  }
  if (gridSize === 'medium') {
    if (speed === 'Slow') mazeSpeed = 20;
    if (speed === 'Normal') mazeSpeed = 10;
    if (speed === 'Fast') mazeSpeed = 1;
  }
  if (gridSize === 'large') {
    if (speed === 'Slow') mazeSpeed = 10;
    if (speed === 'Normal') mazeSpeed = 5;
    if (speed === 'Fast') mazeSpeed = 0.1;
  }

  if (speed === 'Instant') mazeSpeed = 0;
}

function updatePathfindingDelay(speed) {
  if (gridSize === 'small') {
    if (speed === 'Slow') pathfindingSpeed = 250;
    if (speed === 'Normal') pathfindingSpeed = 100;
    if (speed === 'Fast') pathfindingSpeed = 30;
  }
  if (gridSize === 'medium') {
    if (speed === 'Slow') pathfindingSpeed = 30;
    if (speed === 'Normal') pathfindingSpeed = 10;
    if (speed === 'Fast') pathfindingSpeed = 5;
  }
  if (gridSize === 'large') {
    if (speed === 'Slow') pathfindingSpeed = 30;
    if (speed === 'Normal') pathfindingSpeed = 10;
    if (speed === 'Fast') pathfindingSpeed = 1;
  }

  if (speed === 'Instant') pathfindingSpeed = 0;
}

function updateGridSize(size) {
  if (size === 'Small') {
    rows = 9;
    cols = 23;
    gridSize = 'small';
    gridObj.updateGridSize(rows, cols, gridSize);
  }
  if (size === 'Medium') {
    rows = 25;
    cols = 61;
    gridSize = 'medium';
    gridObj.updateGridSize(rows, cols, gridSize);
  }
  if (size === 'Large') {
    rows = 49;
    cols = 119;
    gridSize = 'large';
    gridObj.updateGridSize(rows, cols, gridSize);
  }

  updatePathfindingDelay(currPathfindingSpeedSetting);
  updateMazeDelay(currPathfindingSpeedSetting);
}

function addListenersToBtns() {
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
      selectMazeSpeedBtn.textContent = 'Maze Speed ' + `(${item.textContent})`;
      currMazeSpeedSetting = item.textContent;
      updateMazeDelay(item.textContent);
      e.stopPropagation();
    });
  });

  selectAlgoSpeedListItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      selectAlgoSpeedBtnList.classList.remove('show');
      selectAlgoSpeedBtn.textContent = 'Algorithm Speed ' + `(${item.textContent})`;
      currPathfindingSpeedSetting = item.textContent;
      updatePathfindingDelay(item.textContent);
      e.stopPropagation();
    });
  });

  gridSizeListItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      gridSizeBtnList.classList.remove('show');
      gridSizeBtn.textContent = 'Grid Size ' + `(${item.textContent})`;
      updateGridSize(item.textContent);
      e.stopPropagation();
    });
  });

  clearBoardBtn.addEventListener('click', () => {
    if (running[0]) return; // algorithm in progress
    gridObj.resetGrid();
  });

  clearPathBtn.addEventListener('click', () => {
    if (running[0]) return; // algorithm in progress
    gridObj.resetPath();
  });
}

function addListenersToGrid() {
  gridObj.addListeners(running);
}

function load() {
  loadGrid();
  addListenersToGrid();
  document.addEventListener('DOMContentLoaded', () => {
    addListenersToBtns();
  });
}


/***/ }),

/***/ "./src/mazes/binarytree.js":
/*!*********************************!*\
  !*** ./src/mazes/binarytree.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ binaryTree)
/* harmony export */ });
async function binaryTree(grid, delay) {
  function connect(node1, node2, barrierBetween) {
    node1.setNodeType('empty');
    node2.setNodeType('empty');
    barrierBetween.setNodeType('empty');
  }

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      grid[row][col].setNodeType('barrier');
    }
  }

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (row % 2 === 0 || col % 2 === 0) continue;
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const currentSquare = grid[row][col];
      let northNeighbor;
      let westNeighbor;

      if (row > 1) {
        northNeighbor = grid[row - 2][col]; // up
      } else {
        northNeighbor = null;
      }

      if (col > 1) {
        westNeighbor = grid[row][col - 2]; // left
      } else {
        westNeighbor = null;
      }

      if (northNeighbor && westNeighbor) {
        // if both paths are available
        const random = Math.floor(Math.random() * 2);
        if (random === 0) {
          connect(currentSquare, northNeighbor, currentSquare.neighbors[3]);
        } else {
          connect(currentSquare, westNeighbor, currentSquare.neighbors[1]);
        }
      } else {
        // if one of the paths go beyond the grid
        if (row === 1 && col > 1) {
          connect(currentSquare, westNeighbor, currentSquare.neighbors[1]);
        }
        if (col === 1 && row > 1) {
          connect(currentSquare, northNeighbor, currentSquare.neighbors[3]);
        }
      }
    }
  }
  return true; // maze generation finished
}


/***/ }),

/***/ "./src/mazes/huntandkill.js":
/*!**********************************!*\
  !*** ./src/mazes/huntandkill.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generateHuntAndKill)
/* harmony export */ });
async function generateHuntAndKill(grid, delay) {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = [];

  // set the entire grid as barriers
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      grid[row][col].setNodeType('barrier');
    }
  }

  // add neighbors - directly adjacent neighbors are skipped so they can be walls if needed
  function getUnvisitedNeighbors(node) {
    const neighbors = [];
    const row = node.row - 1;
    const col = node.col - 1;

    if (row > 1) {
      if (!visited.includes(grid[row - 2][col])) {
        neighbors.push(grid[row - 2][col]); // up
      }
    }

    if (row < rows - 2) {
      if (!visited.includes(grid[row + 2][col])) {
        neighbors.push(grid[row + 2][col]); // down
      }
    }

    if (col > 1) {
      if (!visited.includes(grid[row][col - 2])) {
        neighbors.push(grid[row][col - 2]); // left
      }
    }

    if (col < cols - 2) {
      if (!visited.includes(grid[row][col + 2])) {
        neighbors.push(grid[row][col + 2]); // right
      }
    }

    return neighbors;
  }

  function getVisitedNeighbors(node) {
    const neighbors = [];
    const row = node.row - 1;
    const col = node.col - 1;

    if (row > 1) {
      if (visited.includes(grid[row - 2][col])) {
        neighbors.push(grid[row - 2][col]); // up
      }
    }

    if (row < rows - 2) {
      if (visited.includes(grid[row + 2][col])) {
        neighbors.push(grid[row + 2][col]); // down
      }
    }

    if (col > 1) {
      if (visited.includes(grid[row][col - 2])) {
        neighbors.push(grid[row][col - 2]); // left
      }
    }

    if (col < cols - 2) {
      if (visited.includes(grid[row][col + 2])) {
        neighbors.push(grid[row][col + 2]); // right
      }
    }

    return neighbors;
  }

  function randomlySelectNeighbor(neighbors) {
    const index = Math.floor(Math.random() * neighbors.length);
    return neighbors[index];
  }

  function generateStartPoint() {
    // choose a random point on the grid to start with
    let randomNodeFound = false;
    let randomFirstNode = null;
    while (!randomNodeFound) {
      const randomRow = Math.floor(Math.random() * (rows - 4)) + 2;
      const randomCol = Math.floor(Math.random() * (cols - 4)) + 2;
      if (randomRow % 2 !== 0 && randomCol % 2 !== 0) {
        randomFirstNode = grid[randomRow][randomCol];
        randomFirstNode.setNodeType('empty');
        randomNodeFound = true;
      }
    }
    return randomFirstNode;
  }

  function removeWallBetween(currNode, nextNode) {
    const row = currNode.row - 1;
    const col = currNode.col - 1;

    if (row > 1) {
      if (grid[row - 2][col] === nextNode) {
        const wallBetween = grid[row - 1][col];
        wallBetween.setNodeType('empty');
      }
    }
    if (row < rows - 2) {
      if (grid[row + 2][col] === nextNode) {
        const wallBetween = grid[row + 1][col];
        wallBetween.setNodeType('empty');
      }
    }
    if (col > 1) {
      if (grid[row][col - 2] === nextNode) {
        const wallBetween = grid[row][col - 1];
        wallBetween.setNodeType('empty');
      }
    }
    if (col < cols - 2) {
      if (grid[row][col + 2] === nextNode) {
        const wallBetween = grid[row][col + 1];
        wallBetween.setNodeType('empty');
      }
    }

    currNode.setNodeType('empty');
    nextNode.setNodeType('empty');
  }

  async function algorithm() {
    let currentNode = generateStartPoint(); // get start node

    while (currentNode) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      visited.push(currentNode);
      const neighbors = getUnvisitedNeighbors(currentNode);

      if (neighbors.length > 0) {
        const nextNode = randomlySelectNeighbor(neighbors);
        removeWallBetween(currentNode, nextNode);
        currentNode = nextNode;
      } else {
        currentNode = null;

        // hunt phase
        // for (let row = 1; row < rows - 1; row += 2) {
        //   for (let col = 1; col < cols - 1; col += 2) {
        //     const node = grid[row][col];
        //     const nodeNeighbors = getUnvisitedNeighbors(node);
        //     if (visited.includes(node) && nodeNeighbors.length > 0) {
        //       currentNode = node;
        //       const randomlySelectedNeighbor = randomlySelectNeighbor(nodeNeighbors);
        //       removeWallBetween(currentNode, randomlySelectedNeighbor);
        //       visited.push(randomlySelectedNeighbor);
        //       break;
        //     }
        //   }
        //   if (currentNode) {
        //     break;
        //   }
        // }
        for (let row = 1; row < rows - 1; row += 2) {
          for (let col = 1; col < cols - 1; col += 2) {
            const node = grid[row][col];
            const visitedNodeNeighbors = getVisitedNeighbors(node);
            if (!visited.includes(node) && visitedNodeNeighbors.length > 0) {
              currentNode = node;
              const randomlySelectedNeighbor = randomlySelectNeighbor(visitedNodeNeighbors);
              removeWallBetween(currentNode, randomlySelectedNeighbor);
              break;
            }
          }
          if (currentNode) {
            break;
          }
        }
      }
    }
    return true;
  }

  return algorithm();
}


/***/ }),

/***/ "./src/mazes/prims.js":
/*!****************************!*\
  !*** ./src/mazes/prims.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generatePrims)
/* harmony export */ });
async function generatePrims(grid, delay) {
  const rows = grid.length;
  const cols = grid[0].length;
  const frontier = [];
  const visited = [];

  // set the entire grid as barriers
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      grid[row][col].setNodeType('barrier');
    }
  }

  // add neighbors - directly adjacent neighbors are skipped so they can be walls if needed
  function getNeighbors(node) {
    const neighbors = [];
    const row = node.row - 1;
    const col = node.col - 1;

    if (row > 1) {
      neighbors.push(grid[row - 2][col]); // up
    }

    if (row < rows - 2) {
      neighbors.push(grid[row + 2][col]); // down
    }

    if (col > 1) {
      neighbors.push(grid[row][col - 2]); // left
    }

    if (col < cols - 2) {
      neighbors.push(grid[row][col + 2]); // right
    }

    return neighbors;
  }

  function getWallBetween(node, neighbor) {
    const row = node.row - 1;
    const col = node.col - 1;

    if (row > 1) {
      if (grid[row - 2][col] === neighbor) return grid[row - 1][col]; // up
    }
    if (row < rows - 2) {
      if (grid[row + 2][col] === neighbor) return grid[row + 1][col]; // down
    }
    if (col > 1) {
      if (grid[row][col - 2] === neighbor) return grid[row][col - 1]; // left
    }
    if (col < cols - 2) {
      if (grid[row][col + 2] === neighbor) return grid[row][col + 1]; // right
    }

    return null;
  }

  function connect(node1, node2, wallBetween) {
    node1.setNodeType('empty');
    node2.setNodeType('empty');
    wallBetween.setNodeType('empty');
  }

  // choose a random point on the grid to start with
  let randomNodeFound = false;
  let randomFirstNode = null;
  while (!randomNodeFound) {
    const randomRow = Math.floor(Math.random() * (rows - 4)) + 2;
    const randomCol = Math.floor(Math.random() * (cols - 4)) + 2;
    if (randomRow % 2 !== 0 && randomCol % 2 !== 0) {
      randomFirstNode = grid[randomRow][randomCol];
      randomFirstNode.setNodeType('empty');
      visited.push(randomFirstNode);
      randomNodeFound = true;
    }
  }

  const startNodeNeighbors = getNeighbors(randomFirstNode);
  startNodeNeighbors.forEach((node) => {
    if (node) {
      frontier.push(node);
    }
  });

  while (frontier.length > 0) {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    const randomIndex = Math.floor(Math.random() * frontier.length);
    const randomFrontierNode = frontier[randomIndex];
    const frontierNeighbors = getNeighbors(randomFrontierNode);

    // find out which 'in' nodes (part of maze) are adjacent
    const adjacentIns = [];
    for (let i = 0; i < frontierNeighbors.length; i++) {
      if (visited.includes(frontierNeighbors[i])) {
        adjacentIns.push(frontierNeighbors[i]);
      }
    }

    // choose a random adjacent node and connect that with the frontier node
    const randomAdjacentIn = adjacentIns[Math.floor(Math.random() * adjacentIns.length)];
    for (let i = 0; i < adjacentIns.length; i++) {
      if (adjacentIns[i] === randomAdjacentIn) {
        const wallBetween = getWallBetween(randomFrontierNode, randomAdjacentIn);
        const indexToSplice = frontier.indexOf(randomFrontierNode);
        connect(randomFrontierNode, randomAdjacentIn, wallBetween);
        visited.push(randomFrontierNode);
        frontier.splice(indexToSplice, 1);
      }
    }

    // get the neighbors of the frontier node and add them to frontier list
    const neighborsToAdd = getNeighbors(randomFrontierNode);
    for (let i = 0; i < neighborsToAdd.length; i++) {
      if (neighborsToAdd[i]) {
        if (!visited.includes(neighborsToAdd[i]) && !frontier.includes(neighborsToAdd[i])) {
          frontier.push(neighborsToAdd[i]);
        }
      }
    }
  }
  return true;
}


/***/ }),

/***/ "./src/mazes/randommap.js":
/*!********************************!*\
  !*** ./src/mazes/randommap.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ randomMap)
/* harmony export */ });
async function randomMap(grid, delay) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const random = Math.random();
      if (random < 0.3) {
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        grid[row][col].setNodeType('barrier');
      }
    }
  }
  return true; // maze generation finished
}


/***/ }),

/***/ "./src/mazes/recursivedivision.js":
/*!****************************************!*\
  !*** ./src/mazes/recursivedivision.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ recursiveDivision)
/* harmony export */ });
async function recursiveDivision(grid, delay) {
  const rows = grid.length;
  const cols = grid[0].length;
  let isFinished = false; // is recursive process finished?

  function randomEven(a, b) {
    const random = Math.floor(Math.random() * (b - a + 1)) + a;
    return random % 2 === 0 ? random : random + 1;
  }

  function randomOdd(a, b) {
    const random = Math.floor(Math.random() * (b - a + 1)) + a;
    return random % 2 !== 0 ? random : random + 1;
  }

  function chooseOrientation(startRow, endRow, startCol, endCol) {
    const width = endCol - startCol;
    const height = endRow - startRow;
    if (width > height) {
      return 'vertical';
    } else if (width < height) {
      return 'horizontal';
    }

    const random = Math.floor(Math.random() * 2);
    return random === 0 ? 'horizontal' : 'vertical';
  }

  // set edges of grid as barriers
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1) {
        grid[row][col].setNodeType('barrier');
      }
    }
  }

  // the recursive function to divide the grid
  async function divide(startRow, endRow, startCol, endCol) {
    if (endCol - startCol < 1 || endRow - startRow < 1) {
      // base case if sub-maze is too small
      return;
    }

    const wallRow = randomEven(startRow + 1, endRow - 1);
    const wallCol = randomEven(startCol + 1, endCol - 1);

    const passageRow = randomOdd(startRow, endRow);
    const passageCol = randomOdd(startCol, endCol);

    const orientation = chooseOrientation(startRow, endRow, startCol, endCol);

    if (orientation === 'horizontal') {
      // make a horizontal wall
      for (let col = startCol; col <= endCol; col++) {
        if (col !== passageCol) {
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
          grid[wallRow][col].setNodeType('barrier');
        }
      }
    } else if (orientation === 'vertical') {
      // make a vertical wall
      for (let row = startRow; row <= endRow; row++) {
        if (row !== passageRow) {
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
          grid[row][wallCol].setNodeType('barrier');
        }
      }
    }

    if (orientation === 'horizontal') {
      await divide(startRow, wallRow - 1, startCol, endCol);
      await divide(wallRow + 1, endRow, startCol, endCol);
    } else if (orientation === 'vertical') {
      await divide(startRow, endRow, wallCol + 1, endCol);
      await divide(startRow, endRow, startCol, wallCol - 1);
    }

    // Check if this is the last recursive call
    if (startRow === 1 && endRow === rows - 2 && startCol === 1 && endCol === cols - 2) {
      isFinished = true;
    }
  }

  await divide(1, rows - 2, 1, cols - 2);

  return isFinished; // maze generation finished
}


/***/ }),

/***/ "./src/mazes/sidewinder.js":
/*!*********************************!*\
  !*** ./src/mazes/sidewinder.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sidewinder)
/* harmony export */ });
async function sidewinder(grid, delay) {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (row === 1 && col !== 0 && col !== cols - 1) continue;
      if (col % 2 === 0) {
        grid[row][col].setNodeType('barrier');
      }
      if (row % 2 === 0) {
        grid[row][col].setNodeType('barrier');
      }
    }
  }

  for (let row = 1; row < rows; row++) {
    let run = [];
    for (let col = 1; col < cols; col += 2) {
      if (row % 2 === 0) continue;

      if (row === 1) {
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        grid[row][col].setNodeType('empty');
        continue;
      }

      const currentNode = grid[row][col];
      run.push(currentNode);

      if (col < cols - 1) {
        if (Math.random() < 0.6 && col !== cols - 2) {
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
          currentNode.neighbors[0].setNodeType('empty');
        } else if (run.length > 0 && row > 1) {
          const randomIndex = Math.floor(Math.random() * run.length);
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
          run[randomIndex].neighbors[3].setNodeType('empty');
          run = [];
        }
      }
    }
  }
  return true; // maze generation finished
}


/***/ }),

/***/ "./src/node.js":
/*!*********************!*\
  !*** ./src/node.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Node)
/* harmony export */ });
/* harmony import */ var _domhandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domhandler */ "./src/domhandler.js");


class Node {
  constructor(row, col, totalRows, totalCols, grid, nodeSize) {
    this.nodeWidth = null;
    this.setNodeWidth(nodeSize); // px width and height of square
    this.totalRows = totalRows;
    this.totalCols = totalCols;
    this.row = row;
    this.col = col;
    this.y = this.row * this.nodeWidth;
    this.x = this.col * this.nodeWidth;
    this.nodeType = 'empty'; // used to update square display on dom e.g start, end or barrier
    this.neighbors = [];
    this.previousNode = null;
    this.grid = grid;

    // astar scores
    this.f = 0;
    this.g = 0;
    this.h = 0;
  }

  setNodeWidth(nodeSize) {
    if (nodeSize === 'small') {
      this.nodeWidth = 80;
    } else if (nodeSize === 'medium') {
      this.nodeWidth = 30;
    } else if (nodeSize === 'large') {
      this.nodeWidth = 15;
    }
  }

  setNodeType(newNodeType) {
    this.nodeType = newNodeType;
    _domhandler__WEBPACK_IMPORTED_MODULE_0__["default"].displayAlgorithm(this, this.grid, this.nodeWidth);
  }

  // calc f, g and h scores
  calcScores(startNode, endNode) {
    this.g = Math.abs(this.x - startNode.x) + Math.abs(this.y - startNode.y);
    this.h = Math.abs(this.x - endNode.x) + Math.abs(this.y - endNode.y);
    this.f = this.g + this.h;
    return this.f;
  }

  setNeighbors(grid) {
    const tempRow = this.row - 1;
    const tempCol = this.col - 1;

    if (tempCol < this.totalCols - 1) {
      // right
      this.neighbors.push(grid[tempRow][tempCol + 1]);
    }

    if (tempCol > 0) {
      // left
      this.neighbors.push(grid[tempRow][tempCol - 1]);
    }

    if (tempRow < this.totalRows - 1) {
      // down
      this.neighbors.push(grid[tempRow + 1][tempCol]);
    }

    if (tempRow > 0) {
      // up
      this.neighbors.push(grid[tempRow - 1][tempCol]);
    }
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scss/main.scss */ "./src/scss/main.scss");
/* harmony import */ var _mainhandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mainhandler */ "./src/mainhandler.js");



(0,_mainhandler__WEBPACK_IMPORTED_MODULE_1__["default"])();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0Q0FBNEM7O0FBRTVDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0EsNkJBQTZCLGdCQUFnQjtBQUM3QywrQkFBK0IsZ0JBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsZ0JBQWdCO0FBQzFDLDRCQUE0QixnQkFBZ0I7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUN4TGU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixZQUFZO0FBQ2hDLHNCQUFzQixZQUFZO0FBQ2xDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMENBQTBDO0FBQzFDOztBQUVBO0FBQ0EsMENBQTBDO0FBQzFDOztBQUVBO0FBQ0EsMENBQTBDO0FBQzFDOztBQUVBO0FBQ0EsMENBQTBDO0FBQzFDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0VBQXNFO0FBQ3RFO0FBQ0E7QUFDQSxzRUFBc0U7QUFDdEU7QUFDQTtBQUNBLHNFQUFzRTtBQUN0RTtBQUNBO0FBQ0Esc0VBQXNFO0FBQ3RFOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLDhCQUE4QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLHdCQUF3QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsMkJBQTJCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDNUhlO0FBQ2Ysb0JBQW9CLG1CQUFtQjtBQUN2QyxzQkFBc0Isd0JBQXdCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjs7Ozs7Ozs7Ozs7Ozs7O0FDYmU7QUFDZjtBQUNBO0FBQ0EsMEJBQTBCOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEMsc0JBQXNCLFlBQVk7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSwrQkFBK0IsZUFBZTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLCtCQUErQixlQUFlO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHFCQUFxQjtBQUNyQjs7Ozs7Ozs7Ozs7Ozs7O0FDM0ZlO0FBQ2Y7QUFDQTs7QUFFQSxvQkFBb0IsWUFBWTtBQUNoQyxzQkFBc0IsWUFBWTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLFlBQVk7QUFDaEM7QUFDQSxzQkFBc0IsWUFBWTtBQUNsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjs7Ozs7Ozs7Ozs7Ozs7OztBQ2xEc0M7O0FBRXZCO0FBQ2Y7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSSxtREFBVTtBQUNkOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUN0RUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOMEI7QUFDTzs7QUFFakMsd0RBQUkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL3Njc3MvbWFpbi5zY3NzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvYWxnb3JpdGhtcy9hc3Rhci5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2FsZ29yaXRobXMvZGlqa3N0cmEuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9kb21oYW5kbGVyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvZ3JpZC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21haW5oYW5kbGVyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvYmluYXJ5dHJlZS5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL2h1bnRhbmRraWxsLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvcHJpbXMuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9yYW5kb21tYXAuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9yZWN1cnNpdmVkaXZpc2lvbi5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL3NpZGV3aW5kZXIuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9ub2RlLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFzdGFyKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgZGVsYXkpIHtcbiAgY29uc3Qgb3Blbkxpc3QgPSBbXTtcbiAgY29uc3QgY2xvc2VkTGlzdCA9IFtdO1xuICBjb25zdCBmaW5hbFBhdGggPSBbXTtcblxuICBmdW5jdGlvbiByZW1vdmVGcm9tQXJyKG5vZGUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wZW5MaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob3Blbkxpc3RbaV0gPT09IG5vZGUpIHtcbiAgICAgICAgb3Blbkxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGRpc3BsYXlGaW5hbFBhdGgocGF0aCkge1xuICAgIGZvciAobGV0IGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAocGF0aFtpXS5ub2RlVHlwZSA9PT0gJ3N0YXJ0JyB8fCBwYXRoW2ldLm5vZGVUeXBlID09PSAnZW5kJykgY29udGludWU7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMCkpO1xuICAgICAgcGF0aFtpXS5zZXROb2RlVHlwZSgnZmluYWwtcGF0aCcpO1xuICAgIH1cbiAgfVxuXG4gIG9wZW5MaXN0LnB1c2goc3RhcnROb2RlKTtcblxuICBhc3luYyBmdW5jdGlvbiBhbGdvcml0aG0oKSB7XG4gICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICB9XG4gICAgbGV0IGN1cnJlbnROb2RlID0gbnVsbDtcbiAgICBsZXQgbG93ZXN0RiA9IEluZmluaXR5O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3Blbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9wZW5MaXN0W2ldLmNhbGNTY29yZXMoc3RhcnROb2RlLCBlbmROb2RlKTtcbiAgICAgIGlmIChvcGVuTGlzdFtpXS5mIDwgbG93ZXN0Rikge1xuICAgICAgICBsb3dlc3RGID0gb3Blbkxpc3RbaV0uZjtcbiAgICAgICAgY3VycmVudE5vZGUgPSBvcGVuTGlzdFtpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY3VycmVudE5vZGUgPT09IGVuZE5vZGUpIHtcbiAgICAgIGxldCB0ZW1wID0gY3VycmVudE5vZGU7XG4gICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wKTtcbiAgICAgIHdoaWxlICh0ZW1wLnByZXZpb3VzTm9kZSkge1xuICAgICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wLnByZXZpb3VzTm9kZSk7XG4gICAgICAgIHRlbXAgPSB0ZW1wLnByZXZpb3VzTm9kZTtcbiAgICAgIH1cbiAgICAgIGRpc3BsYXlGaW5hbFBhdGgoZmluYWxQYXRoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNsb3NlZExpc3QucHVzaChjdXJyZW50Tm9kZSk7XG4gICAgaWYgKGN1cnJlbnROb2RlLm5vZGVUeXBlICE9PSAnc3RhcnQnICYmIGN1cnJlbnROb2RlLm5vZGVUeXBlICE9PSAnZW5kJykge1xuICAgICAgY3VycmVudE5vZGUuc2V0Tm9kZVR5cGUoJ2Nsb3NlZC1saXN0Jyk7XG4gICAgfVxuICAgIHJlbW92ZUZyb21BcnIoY3VycmVudE5vZGUpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZS5uZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGN1cnJOZWlnaGJvciA9IGN1cnJlbnROb2RlLm5laWdoYm9yc1tpXTtcblxuICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ2JhcnJpZXInICYmICFjbG9zZWRMaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgY29uc3QgdGVtcEcgPSBjdXJyZW50Tm9kZS5nICsgMTtcbiAgICAgICAgaWYgKG9wZW5MaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgICBpZiAodGVtcEcgPCBjdXJyTmVpZ2hib3IuZykge1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSB0ZW1wRztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSB0ZW1wRztcbiAgICAgICAgICBvcGVuTGlzdC5wdXNoKGN1cnJOZWlnaGJvcik7XG4gICAgICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ3N0YXJ0JyAmJiBjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3Iuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJOZWlnaGJvci5wcmV2aW91c05vZGUgPSBjdXJyZW50Tm9kZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3Blbkxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGFsZ29yaXRobSgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhbGdvcml0aG0oKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGRpamtzdHJhKGdyaWQsIHN0YXJ0Tm9kZSwgZW5kTm9kZSwgZGVsYXkpIHtcbiAgY29uc3Qgb3Blbkxpc3RRdWV1ZSA9IFtdOyAvLyB0cmFja3Mgbm9kZXMgdG8gdmlzaXRcbiAgY29uc3QgY2xvc2VkTGlzdCA9IFtdO1xuICBjb25zdCBmaW5hbFBhdGggPSBbXTtcblxuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgZ3JpZFtyb3ddW2NvbF0uZyA9IEluZmluaXR5O1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGRpc3BsYXlGaW5hbFBhdGgocGF0aCkge1xuICAgIGZvciAobGV0IGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAocGF0aFtpXS5ub2RlVHlwZSA9PT0gJ3N0YXJ0JyB8fCBwYXRoW2ldLm5vZGVUeXBlID09PSAnZW5kJykgY29udGludWU7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMCkpO1xuICAgICAgcGF0aFtpXS5zZXROb2RlVHlwZSgnZmluYWwtcGF0aCcpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0Tm9kZS5nID0gMDtcbiAgb3Blbkxpc3RRdWV1ZS5wdXNoKHN0YXJ0Tm9kZSk7XG5cbiAgYXN5bmMgZnVuY3Rpb24gYWxnb3JpdGhtKCkge1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgY29uc3QgY3VycmVudE5vZGUgPSBvcGVuTGlzdFF1ZXVlLnNoaWZ0KCk7XG4gICAgaWYgKGN1cnJlbnROb2RlLm5vZGVUeXBlICE9PSAnc3RhcnQnICYmIGN1cnJlbnROb2RlLm5vZGVUeXBlICE9PSAnZW5kJykge1xuICAgICAgY3VycmVudE5vZGUuc2V0Tm9kZVR5cGUoJ2Nsb3NlZC1saXN0Jyk7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnROb2RlID09PSBlbmROb2RlKSB7XG4gICAgICBsZXQgdGVtcCA9IGN1cnJlbnROb2RlO1xuICAgICAgZmluYWxQYXRoLnB1c2godGVtcCk7XG4gICAgICB3aGlsZSAodGVtcC5wcmV2aW91c05vZGUpIHtcbiAgICAgICAgZmluYWxQYXRoLnB1c2godGVtcC5wcmV2aW91c05vZGUpO1xuICAgICAgICB0ZW1wID0gdGVtcC5wcmV2aW91c05vZGU7XG4gICAgICB9XG4gICAgICBkaXNwbGF5RmluYWxQYXRoKGZpbmFsUGF0aCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnROb2RlLm5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY3Vyck5laWdoYm9yID0gY3VycmVudE5vZGUubmVpZ2hib3JzW2ldO1xuXG4gICAgICBpZiAoY3Vyck5laWdoYm9yLm5vZGVUeXBlICE9PSAnYmFycmllcicgJiYgIWNsb3NlZExpc3QuaW5jbHVkZXMoY3Vyck5laWdoYm9yKSkge1xuICAgICAgICBpZiAoY3Vyck5laWdoYm9yLmcgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSBjdXJyZW50Tm9kZS5nICsgMTtcbiAgICAgICAgICBjdXJyTmVpZ2hib3IucHJldmlvdXNOb2RlID0gY3VycmVudE5vZGU7XG4gICAgICAgICAgb3Blbkxpc3RRdWV1ZS5wdXNoKGN1cnJOZWlnaGJvcik7XG4gICAgICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ3N0YXJ0JyAmJiBjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3Iuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcGVuTGlzdFF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgIGFsZ29yaXRobSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZG9uZSA9IGFsZ29yaXRobSgpO1xuICByZXR1cm4gZG9uZTtcbn1cbiIsImZ1bmN0aW9uIHVwZGF0ZVNxdWFyZShncmlkU3F1YXJlLCBub2RlVHlwZSkge1xuICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQobm9kZVR5cGUpO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5QWxnb3JpdGhtKG5vZGUsIGdyaWQsIHNxdWFyZVNpemUpIHtcbiAgY29uc3QgZG9tU3F1YXJlID0gZ3JpZC5maW5kRG9tU3F1YXJlKG5vZGUucm93IC0gMSwgbm9kZS5jb2wgLSAxKTtcbiAgZG9tU3F1YXJlLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgZG9tU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gIGRvbVNxdWFyZS5jbGFzc0xpc3QuYWRkKG5vZGUubm9kZVR5cGUpO1xuICBpZiAoc3F1YXJlU2l6ZSA9PT0gODApIHtcbiAgICBkb21TcXVhcmUuY2xhc3NMaXN0LmFkZCgnc21hbGwnKTtcbiAgfSBlbHNlIGlmIChzcXVhcmVTaXplID09PSAzMCkge1xuICAgIGRvbVNxdWFyZS5jbGFzc0xpc3QuYWRkKCdtZWRpdW0nKTtcbiAgfSBlbHNlIGlmIChzcXVhcmVTaXplID09PSAxNSkge1xuICAgIGRvbVNxdWFyZS5jbGFzc0xpc3QuYWRkKCdsYXJnZScpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlHcmlkKGdyaWQsIHNxdWFyZVNpemUpIHtcbiAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLWNvbnRhaW5lcicpO1xuICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICBpZiAoc3F1YXJlU2l6ZSA9PT0gJ3NtYWxsJykge1xuICAgIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnbWVkaXVtLWdyaWQnKTtcbiAgICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2xhcmdlLWdyaWQnKTtcbiAgICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NtYWxsLWdyaWQnKTtcbiAgfSBlbHNlIGlmIChzcXVhcmVTaXplID09PSAnbWVkaXVtJykge1xuICAgIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc21hbGwtZ3JpZCcpO1xuICAgIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnbGFyZ2UtZ3JpZCcpO1xuICAgIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnbWVkaXVtLWdyaWQnKTtcbiAgfSBlbHNlIGlmIChzcXVhcmVTaXplID09PSAnbGFyZ2UnKSB7XG4gICAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzbWFsbC1ncmlkJyk7XG4gICAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdtZWRpdW0tZ3JpZCcpO1xuICAgIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnbGFyZ2UtZ3JpZCcpO1xuICB9XG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBjb25zdCBncmlkU3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XG4gICAgICBpZiAoc3F1YXJlU2l6ZSA9PT0gJ3NtYWxsJykge1xuICAgICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ21lZGl1bScpO1xuICAgICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ2xhcmdlJyk7XG4gICAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnc21hbGwnKTtcbiAgICAgIH0gZWxzZSBpZiAoc3F1YXJlU2l6ZSA9PT0gJ21lZGl1bScpIHtcbiAgICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdzbWFsbCcpO1xuICAgICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ2xhcmdlJyk7XG4gICAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnbWVkaXVtJyk7XG4gICAgICB9IGVsc2UgaWYgKHNxdWFyZVNpemUgPT09ICdsYXJnZScpIHtcbiAgICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdzbWFsbCcpO1xuICAgICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ21lZGl1bScpO1xuICAgICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2xhcmdlJyk7XG4gICAgICB9XG4gICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKGdyaWRTcXVhcmUpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZXNldEdyaWQobm9kZVdpZHRoKSB7XG4gIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgY29uc3QgZ3JpZENvbnRhaW5lckNoaWxkcmVuID0gZ3JpZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWRDb250YWluZXJDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGdyaWRDb250YWluZXJDaGlsZHJlbltpXS5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgZ3JpZENvbnRhaW5lckNoaWxkcmVuW2ldLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgZ3JpZENvbnRhaW5lckNoaWxkcmVuW2ldLmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XG4gICAgaWYgKG5vZGVXaWR0aCA9PT0gJ3NtYWxsJykge1xuICAgICAgZ3JpZENvbnRhaW5lckNoaWxkcmVuW2ldLmNsYXNzTGlzdC5hZGQoJ3NtYWxsJyk7XG4gICAgfSBlbHNlIGlmIChub2RlV2lkdGggPT09ICdtZWRpdW0nKSB7XG4gICAgICBncmlkQ29udGFpbmVyQ2hpbGRyZW5baV0uY2xhc3NMaXN0LmFkZCgnbWVkaXVtJyk7XG4gICAgfSBlbHNlIGlmIChub2RlV2lkdGggPT09ICdsYXJnZScpIHtcbiAgICAgIGdyaWRDb250YWluZXJDaGlsZHJlbltpXS5jbGFzc0xpc3QuYWRkKCdsYXJnZScpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBEb21IYW5kbGVyID0ge1xuICBkaXNwbGF5R3JpZCxcbiAgdXBkYXRlU3F1YXJlLFxuICBkaXNwbGF5QWxnb3JpdGhtLFxuICByZXNldEdyaWQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBEb21IYW5kbGVyO1xuIiwiaW1wb3J0IE5vZGUgZnJvbSAnLi9ub2RlJztcbmltcG9ydCBEb21IYW5kbGVyIGZyb20gJy4vZG9taGFuZGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWQge1xuICBjb25zdHJ1Y3Rvcihyb3dzLCBjb2xzLCBub2RlV2lkdGgpIHtcbiAgICB0aGlzLnJvd3MgPSByb3dzO1xuICAgIHRoaXMuY29scyA9IGNvbHM7XG4gICAgdGhpcy5ub2RlV2lkdGggPSBub2RlV2lkdGg7XG4gICAgdGhpcy5zdGFydCA9IHsgbm9kZTogbnVsbCB9O1xuICAgIHRoaXMuZW5kID0geyBub2RlOiBudWxsIH07XG4gICAgdGhpcy5ncmlkID0gW107XG4gICAgdGhpcy5vcGVuTGlzdCA9IFtdO1xuICAgIHRoaXMuY2xvc2VkTGlzdCA9IFtdO1xuICAgIHRoaXMuZmluYWxQYXRoID0gW107XG4gICAgdGhpcy5jcmVhdGVHcmlkKHRoaXMucm93cywgdGhpcy5jb2xzKTtcblxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICB9XG5cbiAgc2V0U3F1YXJlU3RhdHVzKGdyaWRTcXVhcmUsIHJvdywgY29sKSB7XG4gICAgY29uc3QgY3VycmVudE5vZGUgPSB0aGlzLmdyaWRbcm93XVtjb2xdO1xuICAgIGlmIChjdXJyZW50Tm9kZS5ub2RlVHlwZSAhPT0gJ2VtcHR5JykgcmV0dXJuO1xuICAgIGlmICh0aGlzLnN0YXJ0Lm5vZGUgPT09IG51bGwpIHtcbiAgICAgIGN1cnJlbnROb2RlLm5vZGVUeXBlID0gJ3N0YXJ0JztcbiAgICAgIHRoaXMuc3RhcnQubm9kZSA9IGN1cnJlbnROb2RlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lbmQubm9kZSA9PT0gbnVsbCkge1xuICAgICAgY3VycmVudE5vZGUubm9kZVR5cGUgPSAnZW5kJztcbiAgICAgIHRoaXMuZW5kLm5vZGUgPSBjdXJyZW50Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudE5vZGUubm9kZVR5cGUgPSAnYmFycmllcic7XG4gICAgfVxuICAgIERvbUhhbmRsZXIudXBkYXRlU3F1YXJlKGdyaWRTcXVhcmUsIGN1cnJlbnROb2RlLm5vZGVUeXBlKTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlRG93bihncmlkU3F1YXJlLCByb3csIGNvbCkge1xuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgdGhpcy5zZXRTcXVhcmVTdGF0dXMoZ3JpZFNxdWFyZSwgcm93LCBjb2wpO1xuICB9XG5cbiAgaGFuZGxlTW91c2VNb3ZlKGdyaWRTcXVhcmUsIHJvdywgY29sKSB7XG4gICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xuICAgICAgdGhpcy5zZXRTcXVhcmVTdGF0dXMoZ3JpZFNxdWFyZSwgcm93LCBjb2wpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1vdXNlVXAoKSB7XG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gIH1cblxuICBmaW5kRG9tU3F1YXJlKHJvdywgY29sKSB7XG4gICAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLWNvbnRhaW5lcicpO1xuICAgIGNvbnN0IGdyaWRDb250YWluZXJDaGlsZHJlbiA9IGdyaWRDb250YWluZXIuY2hpbGRyZW47XG4gICAgY29uc3QgaW5kZXggPSByb3cgKiB0aGlzLmNvbHMgKyBjb2w7XG4gICAgcmV0dXJuIGdyaWRDb250YWluZXJDaGlsZHJlbltpbmRleF07XG4gIH1cblxuICBhZGRMaXN0ZW5lcnMoY3VycmVudGx5UnVubmluZykge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMucm93czsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgY29uc3QgZ3JpZFNxdWFyZSA9IHRoaXMuZmluZERvbVNxdWFyZShyb3csIGNvbCk7XG4gICAgICAgIGdyaWRTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4ge1xuICAgICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nWzBdKSByZXR1cm47XG4gICAgICAgICAgdGhpcy5oYW5kbGVNb3VzZURvd24oZ3JpZFNxdWFyZSwgcm93LCBjb2wpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3JpZFNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoKSA9PiB7XG4gICAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdbMF0pIHJldHVybjtcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlTW92ZShncmlkU3F1YXJlLCByb3csIGNvbCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZU1vdXNlVXAoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUdyaWQocm93cywgY29scykge1xuICAgIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8PSByb3dzOyByb3crKykge1xuICAgICAgY29uc3QgY3VycmVudFJvdyA9IFtdO1xuICAgICAgZm9yIChsZXQgY29sID0gMTsgY29sIDw9IGNvbHM7IGNvbCsrKSB7XG4gICAgICAgIGN1cnJlbnRSb3cucHVzaChuZXcgTm9kZShyb3csIGNvbCwgdGhpcy5yb3dzLCB0aGlzLmNvbHMsIHRoaXMsIHRoaXMubm9kZVdpZHRoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmdyaWQucHVzaChjdXJyZW50Um93KTtcbiAgICB9XG4gICAgRG9tSGFuZGxlci5kaXNwbGF5R3JpZCh0aGlzLmdyaWQsIHRoaXMubm9kZVdpZHRoKTtcbiAgfVxuXG4gIHNldEFsbE5vZGVOZWlnaGJvcnMoKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5ncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgICAgdGhpcy5ncmlkW3Jvd11bY29sXS5zZXROZWlnaGJvcnModGhpcy5ncmlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXNldEdyaWQoKSB7XG4gICAgLy8gY3JlYXRpbmcgbmV3IGdyaWRcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICBmb3IgKGxldCByb3cgPSAxOyByb3cgPD0gdGhpcy5yb3dzOyByb3crKykge1xuICAgICAgY29uc3QgY3VycmVudFJvdyA9IFtdO1xuICAgICAgZm9yIChsZXQgY29sID0gMTsgY29sIDw9IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgY3VycmVudFJvdy5wdXNoKG5ldyBOb2RlKHJvdywgY29sLCB0aGlzLnJvd3MsIHRoaXMuY29scywgdGhpcywgdGhpcy5ub2RlV2lkdGgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ3JpZC5wdXNoKGN1cnJlbnRSb3cpO1xuICAgIH1cblxuICAgIC8vIHNldHRpbmcgbmVpZ2hib3VycyBhZ2FpblxuICAgIHRoaXMuc2V0QWxsTm9kZU5laWdoYm9ycygpO1xuXG4gICAgLy8gcmVzZXR0aW5nIHN0YXJ0IGFuZCBlbmQgbm9kZVxuICAgIHRoaXMuc3RhcnQubm9kZSA9IG51bGw7XG4gICAgdGhpcy5lbmQubm9kZSA9IG51bGw7XG5cbiAgICAvLyByZXNldGluZyBkb20gc3F1YXJlc1xuICAgIERvbUhhbmRsZXIucmVzZXRHcmlkKHRoaXMubm9kZVdpZHRoKTtcbiAgfVxuXG4gIHJlc2V0UGF0aCgpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnJvd3M7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLmNvbHM7IGNvbCsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJOb2RlID0gdGhpcy5ncmlkW3Jvd11bY29sXTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGN1cnJOb2RlLm5vZGVUeXBlID09PSAnb3Blbi1saXN0JyB8fFxuICAgICAgICAgIGN1cnJOb2RlLm5vZGVUeXBlID09PSAnY2xvc2VkLWxpc3QnIHx8XG4gICAgICAgICAgY3Vyck5vZGUubm9kZVR5cGUgPT09ICdmaW5hbC1wYXRoJ1xuICAgICAgICApIHtcbiAgICAgICAgICBjdXJyTm9kZS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUdyaWRTaXplKHJvd3MsIGNvbHMsIG5vZGVXaWR0aCkge1xuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5jb2xzID0gY29scztcbiAgICB0aGlzLm5vZGVXaWR0aCA9IG5vZGVXaWR0aDtcbiAgICB0aGlzLnJlc2V0R3JpZCgpO1xuICAgIERvbUhhbmRsZXIuZGlzcGxheUdyaWQodGhpcy5ncmlkLCBub2RlV2lkdGgpO1xuICAgIHRoaXMuYWRkTGlzdGVuZXJzKFtmYWxzZV0pO1xuICB9XG59XG4iLCJpbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xuaW1wb3J0IGFzdGFyIGZyb20gJy4vYWxnb3JpdGhtcy9hc3Rhcic7XG5pbXBvcnQgZGlqa3N0cmEgZnJvbSAnLi9hbGdvcml0aG1zL2RpamtzdHJhJztcbmltcG9ydCByYW5kb21NYXAgZnJvbSAnLi9tYXplcy9yYW5kb21tYXAnO1xuaW1wb3J0IGJpbmFyeVRyZWUgZnJvbSAnLi9tYXplcy9iaW5hcnl0cmVlJztcbmltcG9ydCBzaWRld2luZGVyIGZyb20gJy4vbWF6ZXMvc2lkZXdpbmRlcic7XG5pbXBvcnQgcmVjdXJzaXZlRGl2aXNpb24gZnJvbSAnLi9tYXplcy9yZWN1cnNpdmVkaXZpc2lvbic7XG5pbXBvcnQgZ2VuZXJhdGVQcmltcyBmcm9tICcuL21hemVzL3ByaW1zJztcbmltcG9ydCBnZW5lcmF0ZUh1bnRBbmRLaWxsIGZyb20gJy4vbWF6ZXMvaHVudGFuZGtpbGwnO1xuXG5sZXQgZ3JpZE9iaiA9IG51bGw7XG5sZXQgcm93cyA9IDI1O1xubGV0IGNvbHMgPSA2MTtcbmxldCBzZWxlY3RlZEFsZ29yaXRobSA9IG51bGw7XG5sZXQgc2VsZWN0ZWRNYXplID0gbnVsbDtcbmNvbnN0IHJ1bm5pbmcgPSBbZmFsc2VdOyAvLyBjaGVjayBpZiBhbGdvcml0aG0gaXMgY3VycmVudGx5IHJ1bm5pbmdcbmxldCBjdXJyTWF6ZVNwZWVkU2V0dGluZyA9ICdOb3JtYWwnO1xubGV0IGN1cnJQYXRoZmluZGluZ1NwZWVkU2V0dGluZyA9ICdOb3JtYWwnO1xubGV0IG1hemVTcGVlZCA9IDEwO1xubGV0IHBhdGhmaW5kaW5nU3BlZWQgPSAxMDtcbmxldCBncmlkU2l6ZSA9ICdtZWRpdW0nO1xuXG5mdW5jdGlvbiBsb2FkR3JpZCgpIHtcbiAgZ3JpZE9iaiA9IG5ldyBHcmlkKHJvd3MsIGNvbHMsIGdyaWRTaXplKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuQVN0YXIoKSB7XG4gIGNvbnN0IHN0YXJ0Tm9kZSA9IGdyaWRPYmouc3RhcnQubm9kZTtcbiAgY29uc3QgZW5kTm9kZSA9IGdyaWRPYmouZW5kLm5vZGU7XG5cbiAgdHJ5IHtcbiAgICBydW5uaW5nWzBdID0gdHJ1ZTtcbiAgICBjb25zdCBwYXRoRm91bmQgPSBhd2FpdCBhc3RhcihzdGFydE5vZGUsIGVuZE5vZGUsIHBhdGhmaW5kaW5nU3BlZWQpO1xuXG4gICAgaWYgKHBhdGhGb3VuZCkge1xuICAgICAgY29uc29sZS5sb2coJ2ZvdW5kIHBhdGgnKTtcbiAgICAgIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3BhdGggbm90IGZvdW5kJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBydW5uaW5nWzBdID0gZmFsc2U7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuRGlqa3N0cmEoKSB7XG4gIGNvbnN0IHN0YXJ0Tm9kZSA9IGdyaWRPYmouc3RhcnQubm9kZTtcbiAgY29uc3QgZW5kTm9kZSA9IGdyaWRPYmouZW5kLm5vZGU7XG5cbiAgdHJ5IHtcbiAgICBydW5uaW5nWzBdID0gdHJ1ZTtcbiAgICBjb25zdCBwYXRoRm91bmQgPSBhd2FpdCBkaWprc3RyYShncmlkT2JqLmdyaWQsIHN0YXJ0Tm9kZSwgZW5kTm9kZSwgcGF0aGZpbmRpbmdTcGVlZCk7XG5cbiAgICBpZiAocGF0aEZvdW5kKSB7XG4gICAgICBjb25zb2xlLmxvZygnZm91bmQgcGF0aCcpO1xuICAgICAgcnVubmluZ1swXSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygncGF0aCBub3QgZm91bmQnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xuICB9IGZpbmFsbHkge1xuICAgIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbiAgfVxufVxuXG5jb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGFydC1hbGdvcml0aG0nKTtcblxuc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gIGlmIChydW5uaW5nWzBdIHx8IHNlbGVjdGVkQWxnb3JpdGhtID09PSBudWxsKSByZXR1cm47IC8vIGFsZ29yaXRobSBpbiBwcm9ncmVzc1xuICBncmlkT2JqLnNldEFsbE5vZGVOZWlnaGJvcnMoKTtcbiAgZ3JpZE9iai5yZXNldFBhdGgoKTtcblxuICBsZXQgZG9uZTtcbiAgaWYgKGdyaWRPYmouc3RhcnQubm9kZSAmJiBncmlkT2JqLmVuZC5ub2RlKSB7XG4gICAgaWYgKHNlbGVjdGVkQWxnb3JpdGhtID09PSAnQSonKSBkb25lID0gYXdhaXQgcnVuQVN0YXIoKTtcbiAgICBpZiAoc2VsZWN0ZWRBbGdvcml0aG0gPT09ICdEaWprc3RyYScpIGRvbmUgPSBhd2FpdCBydW5EaWprc3RyYSgpO1xuICB9XG5cbiAgaWYgKGRvbmUpIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbn0pO1xuXG5jb25zdCBnZW5lcmF0ZU1hemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2VuZXJhdGUtbWF6ZScpO1xuXG5nZW5lcmF0ZU1hemVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gIGlmIChydW5uaW5nWzBdIHx8IHNlbGVjdGVkTWF6ZSA9PT0gbnVsbCkgcmV0dXJuOyAvLyBhbGdvcml0aG0gaW4gcHJvZ3Jlc3NcbiAgcnVubmluZ1swXSA9IHRydWU7XG4gIGdyaWRPYmoucmVzZXRHcmlkKCk7XG5cbiAgbGV0IGRvbmU7XG4gIGlmIChzZWxlY3RlZE1hemUgPT09ICdSYW5kb20gTWFwJykge1xuICAgIGRvbmUgPSBhd2FpdCByYW5kb21NYXAoZ3JpZE9iai5ncmlkLCBtYXplU3BlZWQpO1xuICB9XG4gIGlmIChzZWxlY3RlZE1hemUgPT09ICdCaW5hcnkgVHJlZScpIHtcbiAgICBkb25lID0gYXdhaXQgYmluYXJ5VHJlZShncmlkT2JqLmdyaWQsIG1hemVTcGVlZCk7XG4gIH1cbiAgaWYgKHNlbGVjdGVkTWF6ZSA9PT0gJ1NpZGV3aW5kZXInKSB7XG4gICAgZG9uZSA9IGF3YWl0IHNpZGV3aW5kZXIoZ3JpZE9iai5ncmlkLCBtYXplU3BlZWQpO1xuICB9XG4gIGlmIChzZWxlY3RlZE1hemUgPT09ICdSZWN1cnNpdmUgRGl2aXNpb24nKSB7XG4gICAgZG9uZSA9IGF3YWl0IHJlY3Vyc2l2ZURpdmlzaW9uKGdyaWRPYmouZ3JpZCwgbWF6ZVNwZWVkKTtcbiAgfVxuICBpZiAoc2VsZWN0ZWRNYXplID09PSBcIlByaW0nc1wiKSB7XG4gICAgZG9uZSA9IGF3YWl0IGdlbmVyYXRlUHJpbXMoZ3JpZE9iai5ncmlkLCBtYXplU3BlZWQpO1xuICB9XG4gIGlmIChzZWxlY3RlZE1hemUgPT09ICdIdW50ICYgS2lsbCcpIHtcbiAgICBkb25lID0gYXdhaXQgZ2VuZXJhdGVIdW50QW5kS2lsbChncmlkT2JqLmdyaWQsIG1hemVTcGVlZCk7XG4gIH1cbiAgaWYgKGRvbmUpIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbn0pO1xuXG5mdW5jdGlvbiB1cGRhdGVNYXplRGVsYXkoc3BlZWQpIHtcbiAgaWYgKGdyaWRTaXplID09PSAnc21hbGwnKSB7XG4gICAgaWYgKHNwZWVkID09PSAnU2xvdycpIG1hemVTcGVlZCA9IDIwMDtcbiAgICBpZiAoc3BlZWQgPT09ICdOb3JtYWwnKSBtYXplU3BlZWQgPSA1MDtcbiAgICBpZiAoc3BlZWQgPT09ICdGYXN0JykgbWF6ZVNwZWVkID0gMjU7XG4gIH1cbiAgaWYgKGdyaWRTaXplID09PSAnbWVkaXVtJykge1xuICAgIGlmIChzcGVlZCA9PT0gJ1Nsb3cnKSBtYXplU3BlZWQgPSAyMDtcbiAgICBpZiAoc3BlZWQgPT09ICdOb3JtYWwnKSBtYXplU3BlZWQgPSAxMDtcbiAgICBpZiAoc3BlZWQgPT09ICdGYXN0JykgbWF6ZVNwZWVkID0gMTtcbiAgfVxuICBpZiAoZ3JpZFNpemUgPT09ICdsYXJnZScpIHtcbiAgICBpZiAoc3BlZWQgPT09ICdTbG93JykgbWF6ZVNwZWVkID0gMTA7XG4gICAgaWYgKHNwZWVkID09PSAnTm9ybWFsJykgbWF6ZVNwZWVkID0gNTtcbiAgICBpZiAoc3BlZWQgPT09ICdGYXN0JykgbWF6ZVNwZWVkID0gMC4xO1xuICB9XG5cbiAgaWYgKHNwZWVkID09PSAnSW5zdGFudCcpIG1hemVTcGVlZCA9IDA7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVBhdGhmaW5kaW5nRGVsYXkoc3BlZWQpIHtcbiAgaWYgKGdyaWRTaXplID09PSAnc21hbGwnKSB7XG4gICAgaWYgKHNwZWVkID09PSAnU2xvdycpIHBhdGhmaW5kaW5nU3BlZWQgPSAyNTA7XG4gICAgaWYgKHNwZWVkID09PSAnTm9ybWFsJykgcGF0aGZpbmRpbmdTcGVlZCA9IDEwMDtcbiAgICBpZiAoc3BlZWQgPT09ICdGYXN0JykgcGF0aGZpbmRpbmdTcGVlZCA9IDMwO1xuICB9XG4gIGlmIChncmlkU2l6ZSA9PT0gJ21lZGl1bScpIHtcbiAgICBpZiAoc3BlZWQgPT09ICdTbG93JykgcGF0aGZpbmRpbmdTcGVlZCA9IDMwO1xuICAgIGlmIChzcGVlZCA9PT0gJ05vcm1hbCcpIHBhdGhmaW5kaW5nU3BlZWQgPSAxMDtcbiAgICBpZiAoc3BlZWQgPT09ICdGYXN0JykgcGF0aGZpbmRpbmdTcGVlZCA9IDU7XG4gIH1cbiAgaWYgKGdyaWRTaXplID09PSAnbGFyZ2UnKSB7XG4gICAgaWYgKHNwZWVkID09PSAnU2xvdycpIHBhdGhmaW5kaW5nU3BlZWQgPSAzMDtcbiAgICBpZiAoc3BlZWQgPT09ICdOb3JtYWwnKSBwYXRoZmluZGluZ1NwZWVkID0gMTA7XG4gICAgaWYgKHNwZWVkID09PSAnRmFzdCcpIHBhdGhmaW5kaW5nU3BlZWQgPSAxO1xuICB9XG5cbiAgaWYgKHNwZWVkID09PSAnSW5zdGFudCcpIHBhdGhmaW5kaW5nU3BlZWQgPSAwO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVHcmlkU2l6ZShzaXplKSB7XG4gIGlmIChzaXplID09PSAnU21hbGwnKSB7XG4gICAgcm93cyA9IDk7XG4gICAgY29scyA9IDIzO1xuICAgIGdyaWRTaXplID0gJ3NtYWxsJztcbiAgICBncmlkT2JqLnVwZGF0ZUdyaWRTaXplKHJvd3MsIGNvbHMsIGdyaWRTaXplKTtcbiAgfVxuICBpZiAoc2l6ZSA9PT0gJ01lZGl1bScpIHtcbiAgICByb3dzID0gMjU7XG4gICAgY29scyA9IDYxO1xuICAgIGdyaWRTaXplID0gJ21lZGl1bSc7XG4gICAgZ3JpZE9iai51cGRhdGVHcmlkU2l6ZShyb3dzLCBjb2xzLCBncmlkU2l6ZSk7XG4gIH1cbiAgaWYgKHNpemUgPT09ICdMYXJnZScpIHtcbiAgICByb3dzID0gNDk7XG4gICAgY29scyA9IDExOTtcbiAgICBncmlkU2l6ZSA9ICdsYXJnZSc7XG4gICAgZ3JpZE9iai51cGRhdGVHcmlkU2l6ZShyb3dzLCBjb2xzLCBncmlkU2l6ZSk7XG4gIH1cblxuICB1cGRhdGVQYXRoZmluZGluZ0RlbGF5KGN1cnJQYXRoZmluZGluZ1NwZWVkU2V0dGluZyk7XG4gIHVwZGF0ZU1hemVEZWxheShjdXJyUGF0aGZpbmRpbmdTcGVlZFNldHRpbmcpO1xufVxuXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnNUb0J0bnMoKSB7XG4gIGNvbnN0IHNlbGVjdEFsZ29CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWFsZ28tYnRuJyk7XG4gIGNvbnN0IHNlbGVjdE1hemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LW1hemUtYnRuJyk7XG4gIGNvbnN0IGdyaWRTaXplQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyaWQtc2l6ZS1idG4nKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZVNwZWVkQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdC1tYXplLXNwZWVkLWJ0bicpO1xuICBjb25zdCBzZWxlY3RBbGdvU3BlZWRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWFsZ28tc3BlZWQtYnRuJyk7XG5cbiAgY29uc3Qgc2VsZWN0QWxnb0J0bkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWxnby1saXN0Jyk7XG4gIGNvbnN0IHNlbGVjdE1hemVCdG5MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1hemUtbGlzdCcpO1xuICBjb25zdCBncmlkU2l6ZUJ0bkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1zaXplLWxpc3QnKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZVNwZWVkQnRuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXplLXNwZWVkLWxpc3QnKTtcbiAgY29uc3Qgc2VsZWN0QWxnb1NwZWVkQnRuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hbGdvLXNwZWVkLWxpc3QnKTtcbiAgY29uc3Qgc2VsZWN0QWxnb0xpc3RJdGVtcyA9IHNlbGVjdEFsZ29CdG5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuICBjb25zdCBzZWxlY3RNYXplTGlzdEl0ZW1zID0gc2VsZWN0TWF6ZUJ0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG4gIGNvbnN0IGdyaWRTaXplTGlzdEl0ZW1zID0gZ3JpZFNpemVCdG5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuICBjb25zdCBzZWxlY3RNYXplU3BlZWRMaXN0SXRlbXMgPSBzZWxlY3RNYXplU3BlZWRCdG5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuICBjb25zdCBzZWxlY3RBbGdvU3BlZWRMaXN0SXRlbXMgPSBzZWxlY3RBbGdvU3BlZWRCdG5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuXG4gIGNvbnN0IGRyb3Bkb3duQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kcm9wZG93bi1idG4nKTtcbiAgY29uc3QgZHJvcGRvd25MaXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kcm9wZG93bi1saXN0Jyk7XG4gIGNvbnN0IGNsZWFyQm9hcmRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xlYXItYm9hcmQnKTtcbiAgY29uc3QgY2xlYXJQYXRoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsZWFyLXBhdGgnKTtcblxuICBmdW5jdGlvbiBjbG9zZURyb3Bkb3ducygpIHtcbiAgICBkcm9wZG93bkxpc3RzLmZvckVhY2goKGxpc3QpID0+IHtcbiAgICAgIGxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgIH0pO1xuICB9XG5cbiAgZHJvcGRvd25CdXR0b25zLmZvckVhY2goKGJ1dHRvbiwgaW5kZXgpID0+IHtcbiAgICBpZiAocnVubmluZ1swXSkgcmV0dXJuOyAvLyBhbGdvcml0aG0gaW4gcHJvZ3Jlc3NcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRMaXN0ID0gZHJvcGRvd25MaXN0c1tpbmRleF07XG4gICAgICBjb25zdCBpc0xpc3RPcGVuID0gY3VycmVudExpc3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93Jyk7XG5cbiAgICAgIGNsb3NlRHJvcGRvd25zKCk7XG5cbiAgICAgIGlmICghaXNMaXN0T3Blbikge1xuICAgICAgICBjdXJyZW50TGlzdC5jbGFzc0xpc3QudG9nZ2xlKCdzaG93Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBjb25zdCBpc0NsaWNrSW5zaWRlRHJvcGRvd24gPSBBcnJheS5mcm9tKGRyb3Bkb3duTGlzdHMpLnNvbWUoKGxpc3QpID0+IGxpc3QuY29udGFpbnMoZS50YXJnZXQpKTtcblxuICAgIGlmICghaXNDbGlja0luc2lkZURyb3Bkb3duKSB7XG4gICAgICBjbG9zZURyb3Bkb3ducygpO1xuICAgIH1cbiAgfSk7XG5cbiAgc2VsZWN0QWxnb0xpc3RJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBzZWxlY3RBbGdvQnRuTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICBzZWxlY3RBbGdvQnRuLnRleHRDb250ZW50ID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgIHNlbGVjdGVkQWxnb3JpdGhtID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGVjdE1hemVMaXN0SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgc2VsZWN0TWF6ZUJ0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0TWF6ZUJ0bi50ZXh0Q29udGVudCA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICBzZWxlY3RlZE1hemUgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZWN0TWF6ZVNwZWVkTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHNlbGVjdE1hemVTcGVlZEJ0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0TWF6ZVNwZWVkQnRuLnRleHRDb250ZW50ID0gJ01hemUgU3BlZWQgJyArIGAoJHtpdGVtLnRleHRDb250ZW50fSlgO1xuICAgICAgY3Vyck1hemVTcGVlZFNldHRpbmcgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgdXBkYXRlTWF6ZURlbGF5KGl0ZW0udGV4dENvbnRlbnQpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZWN0QWxnb1NwZWVkTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHNlbGVjdEFsZ29TcGVlZEJ0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0QWxnb1NwZWVkQnRuLnRleHRDb250ZW50ID0gJ0FsZ29yaXRobSBTcGVlZCAnICsgYCgke2l0ZW0udGV4dENvbnRlbnR9KWA7XG4gICAgICBjdXJyUGF0aGZpbmRpbmdTcGVlZFNldHRpbmcgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgdXBkYXRlUGF0aGZpbmRpbmdEZWxheShpdGVtLnRleHRDb250ZW50KTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGdyaWRTaXplTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGdyaWRTaXplQnRuTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICBncmlkU2l6ZUJ0bi50ZXh0Q29udGVudCA9ICdHcmlkIFNpemUgJyArIGAoJHtpdGVtLnRleHRDb250ZW50fSlgO1xuICAgICAgdXBkYXRlR3JpZFNpemUoaXRlbS50ZXh0Q29udGVudCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuICB9KTtcblxuICBjbGVhckJvYXJkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChydW5uaW5nWzBdKSByZXR1cm47IC8vIGFsZ29yaXRobSBpbiBwcm9ncmVzc1xuICAgIGdyaWRPYmoucmVzZXRHcmlkKCk7XG4gIH0pO1xuXG4gIGNsZWFyUGF0aEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBpZiAocnVubmluZ1swXSkgcmV0dXJuOyAvLyBhbGdvcml0aG0gaW4gcHJvZ3Jlc3NcbiAgICBncmlkT2JqLnJlc2V0UGF0aCgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkTGlzdGVuZXJzVG9HcmlkKCkge1xuICBncmlkT2JqLmFkZExpc3RlbmVycyhydW5uaW5nKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZCgpIHtcbiAgbG9hZEdyaWQoKTtcbiAgYWRkTGlzdGVuZXJzVG9HcmlkKCk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgYWRkTGlzdGVuZXJzVG9CdG5zKCk7XG4gIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYmluYXJ5VHJlZShncmlkLCBkZWxheSkge1xuICBmdW5jdGlvbiBjb25uZWN0KG5vZGUxLCBub2RlMiwgYmFycmllckJldHdlZW4pIHtcbiAgICBub2RlMS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICBub2RlMi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICBiYXJyaWVyQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgfVxuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBpZiAocm93ICUgMiA9PT0gMCB8fCBjb2wgJSAyID09PSAwKSBjb250aW51ZTtcbiAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY3VycmVudFNxdWFyZSA9IGdyaWRbcm93XVtjb2xdO1xuICAgICAgbGV0IG5vcnRoTmVpZ2hib3I7XG4gICAgICBsZXQgd2VzdE5laWdoYm9yO1xuXG4gICAgICBpZiAocm93ID4gMSkge1xuICAgICAgICBub3J0aE5laWdoYm9yID0gZ3JpZFtyb3cgLSAyXVtjb2xdOyAvLyB1cFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9ydGhOZWlnaGJvciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2wgPiAxKSB7XG4gICAgICAgIHdlc3ROZWlnaGJvciA9IGdyaWRbcm93XVtjb2wgLSAyXTsgLy8gbGVmdFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2VzdE5laWdoYm9yID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKG5vcnRoTmVpZ2hib3IgJiYgd2VzdE5laWdoYm9yKSB7XG4gICAgICAgIC8vIGlmIGJvdGggcGF0aHMgYXJlIGF2YWlsYWJsZVxuICAgICAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgICAgaWYgKHJhbmRvbSA9PT0gMCkge1xuICAgICAgICAgIGNvbm5lY3QoY3VycmVudFNxdWFyZSwgbm9ydGhOZWlnaGJvciwgY3VycmVudFNxdWFyZS5uZWlnaGJvcnNbM10pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbm5lY3QoY3VycmVudFNxdWFyZSwgd2VzdE5laWdoYm9yLCBjdXJyZW50U3F1YXJlLm5laWdoYm9yc1sxXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIG9uZSBvZiB0aGUgcGF0aHMgZ28gYmV5b25kIHRoZSBncmlkXG4gICAgICAgIGlmIChyb3cgPT09IDEgJiYgY29sID4gMSkge1xuICAgICAgICAgIGNvbm5lY3QoY3VycmVudFNxdWFyZSwgd2VzdE5laWdoYm9yLCBjdXJyZW50U3F1YXJlLm5laWdoYm9yc1sxXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbCA9PT0gMSAmJiByb3cgPiAxKSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCBub3J0aE5laWdoYm9yLCBjdXJyZW50U3F1YXJlLm5laWdoYm9yc1szXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7IC8vIG1hemUgZ2VuZXJhdGlvbiBmaW5pc2hlZFxufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVIdW50QW5kS2lsbChncmlkLCBkZWxheSkge1xuICBjb25zdCByb3dzID0gZ3JpZC5sZW5ndGg7XG4gIGNvbnN0IGNvbHMgPSBncmlkWzBdLmxlbmd0aDtcbiAgY29uc3QgdmlzaXRlZCA9IFtdO1xuXG4gIC8vIHNldCB0aGUgZW50aXJlIGdyaWQgYXMgYmFycmllcnNcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcm93czsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBjb2xzOyBjb2wrKykge1xuICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICB9XG4gIH1cblxuICAvLyBhZGQgbmVpZ2hib3JzIC0gZGlyZWN0bHkgYWRqYWNlbnQgbmVpZ2hib3JzIGFyZSBza2lwcGVkIHNvIHRoZXkgY2FuIGJlIHdhbGxzIGlmIG5lZWRlZFxuICBmdW5jdGlvbiBnZXRVbnZpc2l0ZWROZWlnaGJvcnMobm9kZSkge1xuICAgIGNvbnN0IG5laWdoYm9ycyA9IFtdO1xuICAgIGNvbnN0IHJvdyA9IG5vZGUucm93IC0gMTtcbiAgICBjb25zdCBjb2wgPSBub2RlLmNvbCAtIDE7XG5cbiAgICBpZiAocm93ID4gMSkge1xuICAgICAgaWYgKCF2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93IC0gMl1bY29sXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgLSAyXVtjb2xdKTsgLy8gdXBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocm93IDwgcm93cyAtIDIpIHtcbiAgICAgIGlmICghdmlzaXRlZC5pbmNsdWRlcyhncmlkW3JvdyArIDJdW2NvbF0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93ICsgMl1bY29sXSk7IC8vIGRvd25cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29sID4gMSkge1xuICAgICAgaWYgKCF2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93XVtjb2wgLSAyXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCAtIDJdKTsgLy8gbGVmdFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2wgPCBjb2xzIC0gMikge1xuICAgICAgaWYgKCF2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93XVtjb2wgKyAyXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCArIDJdKTsgLy8gcmlnaHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VmlzaXRlZE5laWdoYm9ycyhub2RlKSB7XG4gICAgY29uc3QgbmVpZ2hib3JzID0gW107XG4gICAgY29uc3Qgcm93ID0gbm9kZS5yb3cgLSAxO1xuICAgIGNvbnN0IGNvbCA9IG5vZGUuY29sIC0gMTtcblxuICAgIGlmIChyb3cgPiAxKSB7XG4gICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyhncmlkW3JvdyAtIDJdW2NvbF0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93IC0gMl1bY29sXSk7IC8vIHVwXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJvdyA8IHJvd3MgLSAyKSB7XG4gICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyhncmlkW3JvdyArIDJdW2NvbF0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93ICsgMl1bY29sXSk7IC8vIGRvd25cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29sID4gMSkge1xuICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3ddW2NvbCAtIDJdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3Jvd11bY29sIC0gMl0pOyAvLyBsZWZ0XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbCA8IGNvbHMgLSAyKSB7XG4gICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyhncmlkW3Jvd11bY29sICsgMl0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgKyAyXSk7IC8vIHJpZ2h0XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5laWdoYm9ycztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbWx5U2VsZWN0TmVpZ2hib3IobmVpZ2hib3JzKSB7XG4gICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuZWlnaGJvcnMubGVuZ3RoKTtcbiAgICByZXR1cm4gbmVpZ2hib3JzW2luZGV4XTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlU3RhcnRQb2ludCgpIHtcbiAgICAvLyBjaG9vc2UgYSByYW5kb20gcG9pbnQgb24gdGhlIGdyaWQgdG8gc3RhcnQgd2l0aFxuICAgIGxldCByYW5kb21Ob2RlRm91bmQgPSBmYWxzZTtcbiAgICBsZXQgcmFuZG9tRmlyc3ROb2RlID0gbnVsbDtcbiAgICB3aGlsZSAoIXJhbmRvbU5vZGVGb3VuZCkge1xuICAgICAgY29uc3QgcmFuZG9tUm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHJvd3MgLSA0KSkgKyAyO1xuICAgICAgY29uc3QgcmFuZG9tQ29sID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGNvbHMgLSA0KSkgKyAyO1xuICAgICAgaWYgKHJhbmRvbVJvdyAlIDIgIT09IDAgJiYgcmFuZG9tQ29sICUgMiAhPT0gMCkge1xuICAgICAgICByYW5kb21GaXJzdE5vZGUgPSBncmlkW3JhbmRvbVJvd11bcmFuZG9tQ29sXTtcbiAgICAgICAgcmFuZG9tRmlyc3ROb2RlLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgICAgICByYW5kb21Ob2RlRm91bmQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmFuZG9tRmlyc3ROb2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlV2FsbEJldHdlZW4oY3Vyck5vZGUsIG5leHROb2RlKSB7XG4gICAgY29uc3Qgcm93ID0gY3Vyck5vZGUucm93IC0gMTtcbiAgICBjb25zdCBjb2wgPSBjdXJyTm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgIGlmIChncmlkW3JvdyAtIDJdW2NvbF0gPT09IG5leHROb2RlKSB7XG4gICAgICAgIGNvbnN0IHdhbGxCZXR3ZWVuID0gZ3JpZFtyb3cgLSAxXVtjb2xdO1xuICAgICAgICB3YWxsQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJvdyA8IHJvd3MgLSAyKSB7XG4gICAgICBpZiAoZ3JpZFtyb3cgKyAyXVtjb2xdID09PSBuZXh0Tm9kZSkge1xuICAgICAgICBjb25zdCB3YWxsQmV0d2VlbiA9IGdyaWRbcm93ICsgMV1bY29sXTtcbiAgICAgICAgd2FsbEJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjb2wgPiAxKSB7XG4gICAgICBpZiAoZ3JpZFtyb3ddW2NvbCAtIDJdID09PSBuZXh0Tm9kZSkge1xuICAgICAgICBjb25zdCB3YWxsQmV0d2VlbiA9IGdyaWRbcm93XVtjb2wgLSAxXTtcbiAgICAgICAgd2FsbEJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjb2wgPCBjb2xzIC0gMikge1xuICAgICAgaWYgKGdyaWRbcm93XVtjb2wgKyAyXSA9PT0gbmV4dE5vZGUpIHtcbiAgICAgICAgY29uc3Qgd2FsbEJldHdlZW4gPSBncmlkW3Jvd11bY29sICsgMV07XG4gICAgICAgIHdhbGxCZXR3ZWVuLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGN1cnJOb2RlLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgIG5leHROb2RlLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gYWxnb3JpdGhtKCkge1xuICAgIGxldCBjdXJyZW50Tm9kZSA9IGdlbmVyYXRlU3RhcnRQb2ludCgpOyAvLyBnZXQgc3RhcnQgbm9kZVxuXG4gICAgd2hpbGUgKGN1cnJlbnROb2RlKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgdmlzaXRlZC5wdXNoKGN1cnJlbnROb2RlKTtcbiAgICAgIGNvbnN0IG5laWdoYm9ycyA9IGdldFVudmlzaXRlZE5laWdoYm9ycyhjdXJyZW50Tm9kZSk7XG5cbiAgICAgIGlmIChuZWlnaGJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBuZXh0Tm9kZSA9IHJhbmRvbWx5U2VsZWN0TmVpZ2hib3IobmVpZ2hib3JzKTtcbiAgICAgICAgcmVtb3ZlV2FsbEJldHdlZW4oY3VycmVudE5vZGUsIG5leHROb2RlKTtcbiAgICAgICAgY3VycmVudE5vZGUgPSBuZXh0Tm9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnROb2RlID0gbnVsbDtcblxuICAgICAgICAvLyBodW50IHBoYXNlXG4gICAgICAgIC8vIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8IHJvd3MgLSAxOyByb3cgKz0gMikge1xuICAgICAgICAvLyAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8IGNvbHMgLSAxOyBjb2wgKz0gMikge1xuICAgICAgICAvLyAgICAgY29uc3Qgbm9kZSA9IGdyaWRbcm93XVtjb2xdO1xuICAgICAgICAvLyAgICAgY29uc3Qgbm9kZU5laWdoYm9ycyA9IGdldFVudmlzaXRlZE5laWdoYm9ycyhub2RlKTtcbiAgICAgICAgLy8gICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKG5vZGUpICYmIG5vZGVOZWlnaGJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyAgICAgICBjdXJyZW50Tm9kZSA9IG5vZGU7XG4gICAgICAgIC8vICAgICAgIGNvbnN0IHJhbmRvbWx5U2VsZWN0ZWROZWlnaGJvciA9IHJhbmRvbWx5U2VsZWN0TmVpZ2hib3Iobm9kZU5laWdoYm9ycyk7XG4gICAgICAgIC8vICAgICAgIHJlbW92ZVdhbGxCZXR3ZWVuKGN1cnJlbnROb2RlLCByYW5kb21seVNlbGVjdGVkTmVpZ2hib3IpO1xuICAgICAgICAvLyAgICAgICB2aXNpdGVkLnB1c2gocmFuZG9tbHlTZWxlY3RlZE5laWdoYm9yKTtcbiAgICAgICAgLy8gICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyAgIGlmIChjdXJyZW50Tm9kZSkge1xuICAgICAgICAvLyAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8IHJvd3MgLSAxOyByb3cgKz0gMikge1xuICAgICAgICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8IGNvbHMgLSAxOyBjb2wgKz0gMikge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGdyaWRbcm93XVtjb2xdO1xuICAgICAgICAgICAgY29uc3QgdmlzaXRlZE5vZGVOZWlnaGJvcnMgPSBnZXRWaXNpdGVkTmVpZ2hib3JzKG5vZGUpO1xuICAgICAgICAgICAgaWYgKCF2aXNpdGVkLmluY2x1ZGVzKG5vZGUpICYmIHZpc2l0ZWROb2RlTmVpZ2hib3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgY3VycmVudE5vZGUgPSBub2RlO1xuICAgICAgICAgICAgICBjb25zdCByYW5kb21seVNlbGVjdGVkTmVpZ2hib3IgPSByYW5kb21seVNlbGVjdE5laWdoYm9yKHZpc2l0ZWROb2RlTmVpZ2hib3JzKTtcbiAgICAgICAgICAgICAgcmVtb3ZlV2FsbEJldHdlZW4oY3VycmVudE5vZGUsIHJhbmRvbWx5U2VsZWN0ZWROZWlnaGJvcik7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY3VycmVudE5vZGUpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBhbGdvcml0aG0oKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlUHJpbXMoZ3JpZCwgZGVsYXkpIHtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG4gIGNvbnN0IGZyb250aWVyID0gW107XG4gIGNvbnN0IHZpc2l0ZWQgPSBbXTtcblxuICAvLyBzZXQgdGhlIGVudGlyZSBncmlkIGFzIGJhcnJpZXJzXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHJvd3M7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgY29sKyspIHtcbiAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgfVxuICB9XG5cbiAgLy8gYWRkIG5laWdoYm9ycyAtIGRpcmVjdGx5IGFkamFjZW50IG5laWdoYm9ycyBhcmUgc2tpcHBlZCBzbyB0aGV5IGNhbiBiZSB3YWxscyBpZiBuZWVkZWRcbiAgZnVuY3Rpb24gZ2V0TmVpZ2hib3JzKG5vZGUpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBjb25zdCByb3cgPSBub2RlLnJvdyAtIDE7XG4gICAgY29uc3QgY29sID0gbm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93IC0gMl1bY29sXSk7IC8vIHVwXG4gICAgfVxuXG4gICAgaWYgKHJvdyA8IHJvd3MgLSAyKSB7XG4gICAgICBuZWlnaGJvcnMucHVzaChncmlkW3JvdyArIDJdW2NvbF0pOyAvLyBkb3duXG4gICAgfVxuXG4gICAgaWYgKGNvbCA+IDEpIHtcbiAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgLSAyXSk7IC8vIGxlZnRcbiAgICB9XG5cbiAgICBpZiAoY29sIDwgY29scyAtIDIpIHtcbiAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgKyAyXSk7IC8vIHJpZ2h0XG4gICAgfVxuXG4gICAgcmV0dXJuIG5laWdoYm9ycztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFdhbGxCZXR3ZWVuKG5vZGUsIG5laWdoYm9yKSB7XG4gICAgY29uc3Qgcm93ID0gbm9kZS5yb3cgLSAxO1xuICAgIGNvbnN0IGNvbCA9IG5vZGUuY29sIC0gMTtcblxuICAgIGlmIChyb3cgPiAxKSB7XG4gICAgICBpZiAoZ3JpZFtyb3cgLSAyXVtjb2xdID09PSBuZWlnaGJvcikgcmV0dXJuIGdyaWRbcm93IC0gMV1bY29sXTsgLy8gdXBcbiAgICB9XG4gICAgaWYgKHJvdyA8IHJvd3MgLSAyKSB7XG4gICAgICBpZiAoZ3JpZFtyb3cgKyAyXVtjb2xdID09PSBuZWlnaGJvcikgcmV0dXJuIGdyaWRbcm93ICsgMV1bY29sXTsgLy8gZG93blxuICAgIH1cbiAgICBpZiAoY29sID4gMSkge1xuICAgICAgaWYgKGdyaWRbcm93XVtjb2wgLSAyXSA9PT0gbmVpZ2hib3IpIHJldHVybiBncmlkW3Jvd11bY29sIC0gMV07IC8vIGxlZnRcbiAgICB9XG4gICAgaWYgKGNvbCA8IGNvbHMgLSAyKSB7XG4gICAgICBpZiAoZ3JpZFtyb3ddW2NvbCArIDJdID09PSBuZWlnaGJvcikgcmV0dXJuIGdyaWRbcm93XVtjb2wgKyAxXTsgLy8gcmlnaHRcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbm5lY3Qobm9kZTEsIG5vZGUyLCB3YWxsQmV0d2Vlbikge1xuICAgIG5vZGUxLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgIG5vZGUyLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgIHdhbGxCZXR3ZWVuLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICB9XG5cbiAgLy8gY2hvb3NlIGEgcmFuZG9tIHBvaW50IG9uIHRoZSBncmlkIHRvIHN0YXJ0IHdpdGhcbiAgbGV0IHJhbmRvbU5vZGVGb3VuZCA9IGZhbHNlO1xuICBsZXQgcmFuZG9tRmlyc3ROb2RlID0gbnVsbDtcbiAgd2hpbGUgKCFyYW5kb21Ob2RlRm91bmQpIHtcbiAgICBjb25zdCByYW5kb21Sb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAocm93cyAtIDQpKSArIDI7XG4gICAgY29uc3QgcmFuZG9tQ29sID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGNvbHMgLSA0KSkgKyAyO1xuICAgIGlmIChyYW5kb21Sb3cgJSAyICE9PSAwICYmIHJhbmRvbUNvbCAlIDIgIT09IDApIHtcbiAgICAgIHJhbmRvbUZpcnN0Tm9kZSA9IGdyaWRbcmFuZG9tUm93XVtyYW5kb21Db2xdO1xuICAgICAgcmFuZG9tRmlyc3ROb2RlLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgICAgdmlzaXRlZC5wdXNoKHJhbmRvbUZpcnN0Tm9kZSk7XG4gICAgICByYW5kb21Ob2RlRm91bmQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXJ0Tm9kZU5laWdoYm9ycyA9IGdldE5laWdoYm9ycyhyYW5kb21GaXJzdE5vZGUpO1xuICBzdGFydE5vZGVOZWlnaGJvcnMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgIGlmIChub2RlKSB7XG4gICAgICBmcm9udGllci5wdXNoKG5vZGUpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2hpbGUgKGZyb250aWVyLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgIH1cbiAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGZyb250aWVyLmxlbmd0aCk7XG4gICAgY29uc3QgcmFuZG9tRnJvbnRpZXJOb2RlID0gZnJvbnRpZXJbcmFuZG9tSW5kZXhdO1xuICAgIGNvbnN0IGZyb250aWVyTmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKHJhbmRvbUZyb250aWVyTm9kZSk7XG5cbiAgICAvLyBmaW5kIG91dCB3aGljaCAnaW4nIG5vZGVzIChwYXJ0IG9mIG1hemUpIGFyZSBhZGphY2VudFxuICAgIGNvbnN0IGFkamFjZW50SW5zID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcm9udGllck5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXMoZnJvbnRpZXJOZWlnaGJvcnNbaV0pKSB7XG4gICAgICAgIGFkamFjZW50SW5zLnB1c2goZnJvbnRpZXJOZWlnaGJvcnNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNob29zZSBhIHJhbmRvbSBhZGphY2VudCBub2RlIGFuZCBjb25uZWN0IHRoYXQgd2l0aCB0aGUgZnJvbnRpZXIgbm9kZVxuICAgIGNvbnN0IHJhbmRvbUFkamFjZW50SW4gPSBhZGphY2VudEluc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhZGphY2VudElucy5sZW5ndGgpXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFkamFjZW50SW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWRqYWNlbnRJbnNbaV0gPT09IHJhbmRvbUFkamFjZW50SW4pIHtcbiAgICAgICAgY29uc3Qgd2FsbEJldHdlZW4gPSBnZXRXYWxsQmV0d2VlbihyYW5kb21Gcm9udGllck5vZGUsIHJhbmRvbUFkamFjZW50SW4pO1xuICAgICAgICBjb25zdCBpbmRleFRvU3BsaWNlID0gZnJvbnRpZXIuaW5kZXhPZihyYW5kb21Gcm9udGllck5vZGUpO1xuICAgICAgICBjb25uZWN0KHJhbmRvbUZyb250aWVyTm9kZSwgcmFuZG9tQWRqYWNlbnRJbiwgd2FsbEJldHdlZW4pO1xuICAgICAgICB2aXNpdGVkLnB1c2gocmFuZG9tRnJvbnRpZXJOb2RlKTtcbiAgICAgICAgZnJvbnRpZXIuc3BsaWNlKGluZGV4VG9TcGxpY2UsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdldCB0aGUgbmVpZ2hib3JzIG9mIHRoZSBmcm9udGllciBub2RlIGFuZCBhZGQgdGhlbSB0byBmcm9udGllciBsaXN0XG4gICAgY29uc3QgbmVpZ2hib3JzVG9BZGQgPSBnZXROZWlnaGJvcnMocmFuZG9tRnJvbnRpZXJOb2RlKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5laWdoYm9yc1RvQWRkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobmVpZ2hib3JzVG9BZGRbaV0pIHtcbiAgICAgICAgaWYgKCF2aXNpdGVkLmluY2x1ZGVzKG5laWdoYm9yc1RvQWRkW2ldKSAmJiAhZnJvbnRpZXIuaW5jbHVkZXMobmVpZ2hib3JzVG9BZGRbaV0pKSB7XG4gICAgICAgICAgZnJvbnRpZXIucHVzaChuZWlnaGJvcnNUb0FkZFtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiByYW5kb21NYXAoZ3JpZCwgZGVsYXkpIHtcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICBpZiAocmFuZG9tIDwgMC4zKSB7XG4gICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlOyAvLyBtYXplIGdlbmVyYXRpb24gZmluaXNoZWRcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJlY3Vyc2l2ZURpdmlzaW9uKGdyaWQsIGRlbGF5KSB7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuICBsZXQgaXNGaW5pc2hlZCA9IGZhbHNlOyAvLyBpcyByZWN1cnNpdmUgcHJvY2VzcyBmaW5pc2hlZD9cblxuICBmdW5jdGlvbiByYW5kb21FdmVuKGEsIGIpIHtcbiAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoYiAtIGEgKyAxKSkgKyBhO1xuICAgIHJldHVybiByYW5kb20gJSAyID09PSAwID8gcmFuZG9tIDogcmFuZG9tICsgMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbU9kZChhLCBiKSB7XG4gICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGIgLSBhICsgMSkpICsgYTtcbiAgICByZXR1cm4gcmFuZG9tICUgMiAhPT0gMCA/IHJhbmRvbSA6IHJhbmRvbSArIDE7XG4gIH1cblxuICBmdW5jdGlvbiBjaG9vc2VPcmllbnRhdGlvbihzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgZW5kQ29sKSB7XG4gICAgY29uc3Qgd2lkdGggPSBlbmRDb2wgLSBzdGFydENvbDtcbiAgICBjb25zdCBoZWlnaHQgPSBlbmRSb3cgLSBzdGFydFJvdztcbiAgICBpZiAod2lkdGggPiBoZWlnaHQpIHtcbiAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgIH0gZWxzZSBpZiAod2lkdGggPCBoZWlnaHQpIHtcbiAgICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgfVxuXG4gICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgcmV0dXJuIHJhbmRvbSA9PT0gMCA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gIH1cblxuICAvLyBzZXQgZWRnZXMgb2YgZ3JpZCBhcyBiYXJyaWVyc1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCByb3dzOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgICBpZiAocm93ID09PSAwIHx8IHJvdyA9PT0gcm93cyAtIDEgfHwgY29sID09PSAwIHx8IGNvbCA9PT0gY29scyAtIDEpIHtcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyB0aGUgcmVjdXJzaXZlIGZ1bmN0aW9uIHRvIGRpdmlkZSB0aGUgZ3JpZFxuICBhc3luYyBmdW5jdGlvbiBkaXZpZGUoc3RhcnRSb3csIGVuZFJvdywgc3RhcnRDb2wsIGVuZENvbCkge1xuICAgIGlmIChlbmRDb2wgLSBzdGFydENvbCA8IDEgfHwgZW5kUm93IC0gc3RhcnRSb3cgPCAxKSB7XG4gICAgICAvLyBiYXNlIGNhc2UgaWYgc3ViLW1hemUgaXMgdG9vIHNtYWxsXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgd2FsbFJvdyA9IHJhbmRvbUV2ZW4oc3RhcnRSb3cgKyAxLCBlbmRSb3cgLSAxKTtcbiAgICBjb25zdCB3YWxsQ29sID0gcmFuZG9tRXZlbihzdGFydENvbCArIDEsIGVuZENvbCAtIDEpO1xuXG4gICAgY29uc3QgcGFzc2FnZVJvdyA9IHJhbmRvbU9kZChzdGFydFJvdywgZW5kUm93KTtcbiAgICBjb25zdCBwYXNzYWdlQ29sID0gcmFuZG9tT2RkKHN0YXJ0Q29sLCBlbmRDb2wpO1xuXG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBjaG9vc2VPcmllbnRhdGlvbihzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgZW5kQ29sKTtcblxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAvLyBtYWtlIGEgaG9yaXpvbnRhbCB3YWxsXG4gICAgICBmb3IgKGxldCBjb2wgPSBzdGFydENvbDsgY29sIDw9IGVuZENvbDsgY29sKyspIHtcbiAgICAgICAgaWYgKGNvbCAhPT0gcGFzc2FnZUNvbCkge1xuICAgICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGdyaWRbd2FsbFJvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgLy8gbWFrZSBhIHZlcnRpY2FsIHdhbGxcbiAgICAgIGZvciAobGV0IHJvdyA9IHN0YXJ0Um93OyByb3cgPD0gZW5kUm93OyByb3crKykge1xuICAgICAgICBpZiAocm93ICE9PSBwYXNzYWdlUm93KSB7XG4gICAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZ3JpZFtyb3ddW3dhbGxDb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgYXdhaXQgZGl2aWRlKHN0YXJ0Um93LCB3YWxsUm93IC0gMSwgc3RhcnRDb2wsIGVuZENvbCk7XG4gICAgICBhd2FpdCBkaXZpZGUod2FsbFJvdyArIDEsIGVuZFJvdywgc3RhcnRDb2wsIGVuZENvbCk7XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgYXdhaXQgZGl2aWRlKHN0YXJ0Um93LCBlbmRSb3csIHdhbGxDb2wgKyAxLCBlbmRDb2wpO1xuICAgICAgYXdhaXQgZGl2aWRlKHN0YXJ0Um93LCBlbmRSb3csIHN0YXJ0Q29sLCB3YWxsQ29sIC0gMSk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhpcyBpcyB0aGUgbGFzdCByZWN1cnNpdmUgY2FsbFxuICAgIGlmIChzdGFydFJvdyA9PT0gMSAmJiBlbmRSb3cgPT09IHJvd3MgLSAyICYmIHN0YXJ0Q29sID09PSAxICYmIGVuZENvbCA9PT0gY29scyAtIDIpIHtcbiAgICAgIGlzRmluaXNoZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGF3YWl0IGRpdmlkZSgxLCByb3dzIC0gMiwgMSwgY29scyAtIDIpO1xuXG4gIHJldHVybiBpc0ZpbmlzaGVkOyAvLyBtYXplIGdlbmVyYXRpb24gZmluaXNoZWRcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHNpZGV3aW5kZXIoZ3JpZCwgZGVsYXkpIHtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG5cbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcm93czsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBjb2xzOyBjb2wrKykge1xuICAgICAgaWYgKHJvdyA9PT0gMSAmJiBjb2wgIT09IDAgJiYgY29sICE9PSBjb2xzIC0gMSkgY29udGludWU7XG4gICAgICBpZiAoY29sICUgMiA9PT0gMCkge1xuICAgICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgICAgfVxuICAgICAgaWYgKHJvdyAlIDIgPT09IDApIHtcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKGxldCByb3cgPSAxOyByb3cgPCByb3dzOyByb3crKykge1xuICAgIGxldCBydW4gPSBbXTtcbiAgICBmb3IgKGxldCBjb2wgPSAxOyBjb2wgPCBjb2xzOyBjb2wgKz0gMikge1xuICAgICAgaWYgKHJvdyAlIDIgPT09IDApIGNvbnRpbnVlO1xuXG4gICAgICBpZiAocm93ID09PSAxKSB7XG4gICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBncmlkW3Jvd11bY29sXTtcbiAgICAgIHJ1bi5wdXNoKGN1cnJlbnROb2RlKTtcblxuICAgICAgaWYgKGNvbCA8IGNvbHMgLSAxKSB7XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC42ICYmIGNvbCAhPT0gY29scyAtIDIpIHtcbiAgICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50Tm9kZS5uZWlnaGJvcnNbMF0uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAocnVuLmxlbmd0aCA+IDAgJiYgcm93ID4gMSkge1xuICAgICAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcnVuLmxlbmd0aCk7XG4gICAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcnVuW3JhbmRvbUluZGV4XS5uZWlnaGJvcnNbM10uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICAgICAgcnVuID0gW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7IC8vIG1hemUgZ2VuZXJhdGlvbiBmaW5pc2hlZFxufVxuIiwiaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb21oYW5kbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHJvdywgY29sLCB0b3RhbFJvd3MsIHRvdGFsQ29scywgZ3JpZCwgbm9kZVNpemUpIHtcbiAgICB0aGlzLm5vZGVXaWR0aCA9IG51bGw7XG4gICAgdGhpcy5zZXROb2RlV2lkdGgobm9kZVNpemUpOyAvLyBweCB3aWR0aCBhbmQgaGVpZ2h0IG9mIHNxdWFyZVxuICAgIHRoaXMudG90YWxSb3dzID0gdG90YWxSb3dzO1xuICAgIHRoaXMudG90YWxDb2xzID0gdG90YWxDb2xzO1xuICAgIHRoaXMucm93ID0gcm93O1xuICAgIHRoaXMuY29sID0gY29sO1xuICAgIHRoaXMueSA9IHRoaXMucm93ICogdGhpcy5ub2RlV2lkdGg7XG4gICAgdGhpcy54ID0gdGhpcy5jb2wgKiB0aGlzLm5vZGVXaWR0aDtcbiAgICB0aGlzLm5vZGVUeXBlID0gJ2VtcHR5JzsgLy8gdXNlZCB0byB1cGRhdGUgc3F1YXJlIGRpc3BsYXkgb24gZG9tIGUuZyBzdGFydCwgZW5kIG9yIGJhcnJpZXJcbiAgICB0aGlzLm5laWdoYm9ycyA9IFtdO1xuICAgIHRoaXMucHJldmlvdXNOb2RlID0gbnVsbDtcbiAgICB0aGlzLmdyaWQgPSBncmlkO1xuXG4gICAgLy8gYXN0YXIgc2NvcmVzXG4gICAgdGhpcy5mID0gMDtcbiAgICB0aGlzLmcgPSAwO1xuICAgIHRoaXMuaCA9IDA7XG4gIH1cblxuICBzZXROb2RlV2lkdGgobm9kZVNpemUpIHtcbiAgICBpZiAobm9kZVNpemUgPT09ICdzbWFsbCcpIHtcbiAgICAgIHRoaXMubm9kZVdpZHRoID0gODA7XG4gICAgfSBlbHNlIGlmIChub2RlU2l6ZSA9PT0gJ21lZGl1bScpIHtcbiAgICAgIHRoaXMubm9kZVdpZHRoID0gMzA7XG4gICAgfSBlbHNlIGlmIChub2RlU2l6ZSA9PT0gJ2xhcmdlJykge1xuICAgICAgdGhpcy5ub2RlV2lkdGggPSAxNTtcbiAgICB9XG4gIH1cblxuICBzZXROb2RlVHlwZShuZXdOb2RlVHlwZSkge1xuICAgIHRoaXMubm9kZVR5cGUgPSBuZXdOb2RlVHlwZTtcbiAgICBEb21IYW5kbGVyLmRpc3BsYXlBbGdvcml0aG0odGhpcywgdGhpcy5ncmlkLCB0aGlzLm5vZGVXaWR0aCk7XG4gIH1cblxuICAvLyBjYWxjIGYsIGcgYW5kIGggc2NvcmVzXG4gIGNhbGNTY29yZXMoc3RhcnROb2RlLCBlbmROb2RlKSB7XG4gICAgdGhpcy5nID0gTWF0aC5hYnModGhpcy54IC0gc3RhcnROb2RlLngpICsgTWF0aC5hYnModGhpcy55IC0gc3RhcnROb2RlLnkpO1xuICAgIHRoaXMuaCA9IE1hdGguYWJzKHRoaXMueCAtIGVuZE5vZGUueCkgKyBNYXRoLmFicyh0aGlzLnkgLSBlbmROb2RlLnkpO1xuICAgIHRoaXMuZiA9IHRoaXMuZyArIHRoaXMuaDtcbiAgICByZXR1cm4gdGhpcy5mO1xuICB9XG5cbiAgc2V0TmVpZ2hib3JzKGdyaWQpIHtcbiAgICBjb25zdCB0ZW1wUm93ID0gdGhpcy5yb3cgLSAxO1xuICAgIGNvbnN0IHRlbXBDb2wgPSB0aGlzLmNvbCAtIDE7XG5cbiAgICBpZiAodGVtcENvbCA8IHRoaXMudG90YWxDb2xzIC0gMSkge1xuICAgICAgLy8gcmlnaHRcbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93XVt0ZW1wQ29sICsgMV0pO1xuICAgIH1cblxuICAgIGlmICh0ZW1wQ29sID4gMCkge1xuICAgICAgLy8gbGVmdFxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3ddW3RlbXBDb2wgLSAxXSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbXBSb3cgPCB0aGlzLnRvdGFsUm93cyAtIDEpIHtcbiAgICAgIC8vIGRvd25cbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93ICsgMV1bdGVtcENvbF0pO1xuICAgIH1cblxuICAgIGlmICh0ZW1wUm93ID4gMCkge1xuICAgICAgLy8gdXBcbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93IC0gMV1bdGVtcENvbF0pO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vc2Nzcy9tYWluLnNjc3MnO1xuaW1wb3J0IGxvYWQgZnJvbSAnLi9tYWluaGFuZGxlcic7XG5cbmxvYWQoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
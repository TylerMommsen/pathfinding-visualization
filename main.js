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
      algorithm();
    } else {
      return false;
    }
  }

  const done = algorithm();
  return done;
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
    console.log(gridContainerChildren.length);
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
/* harmony import */ var _domhandler__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./domhandler */ "./src/domhandler.js");










let gridObj = null;
let rows = 25;
let cols = 61;
let selectedAlgorithm = null;
let selectedMaze = null;
const running = [false]; // check if algorithm is currently running
let mazeSpeed = 10;
let pathfindingSpeed = 10;

function loadGrid() {
  gridObj = new _grid__WEBPACK_IMPORTED_MODULE_0__["default"](rows, cols, 'medium');
}

function runAStar() {
  const startNode = gridObj.start.node;
  const endNode = gridObj.end.node;

  try {
    running[0] = true;
    const pathFound = (0,_algorithms_astar__WEBPACK_IMPORTED_MODULE_1__["default"])(startNode, endNode, pathfindingSpeed);

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

function runDijkstra() {
  const startNode = gridObj.start.node;
  const endNode = gridObj.end.node;

  try {
    running[0] = true;
    const pathFound = (0,_algorithms_dijkstra__WEBPACK_IMPORTED_MODULE_2__["default"])(gridObj.grid, startNode, endNode, pathfindingSpeed);

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
    if (selectedAlgorithm === 'A*') done = runAStar();
    if (selectedAlgorithm === 'Dijkstra') done = runDijkstra();
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
  if (done) running[0] = false;
});

function updateMazeDelay(speed) {
  if (speed === 'Slow') mazeSpeed = 20;
  if (speed === 'Normal') mazeSpeed = 10;
  if (speed === 'Fast') mazeSpeed = 1;
  if (speed === 'Instant') mazeSpeed = 0;
}

function updatePathfindingDelay(speed) {
  if (speed === 'Slow') pathfindingSpeed = 30;
  if (speed === 'Normal') pathfindingSpeed = 10;
  if (speed === 'Fast') pathfindingSpeed = 5;
  if (speed === 'Instant') pathfindingSpeed = 0;
}

function updateGridSize(size) {
  if (size === 'Small') {
    rows = 9;
    cols = 23;
    gridObj.updateGridSize(rows, cols, 'small');
  }
  if (size === 'Medium') {
    rows = 25;
    cols = 61;
    gridObj.updateGridSize(rows, cols, 'medium');
  }
  if (size === 'Large') {
    rows = 49;
    cols = 119;
    gridObj.updateGridSize(rows, cols, 'large');
  }
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
      updateMazeDelay(item.textContent);
      e.stopPropagation();
    });
  });

  selectAlgoSpeedListItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      selectAlgoSpeedBtnList.classList.remove('show');
      selectAlgoSpeedBtn.textContent = 'Algorithm Speed ' + `(${item.textContent})`;
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
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, 5));
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ04wQjtBQUNPOztBQUVqQyx3REFBSSIsInNvdXJjZXMiOlsid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvc2Nzcy9tYWluLnNjc3MiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9hbGdvcml0aG1zL2FzdGFyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvYWxnb3JpdGhtcy9kaWprc3RyYS5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2RvbWhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9ncmlkLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWFpbmhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9iaW5hcnl0cmVlLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvcHJpbXMuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9yYW5kb21tYXAuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9yZWN1cnNpdmVkaXZpc2lvbi5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL3NpZGV3aW5kZXIuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9ub2RlLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFzdGFyKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgZGVsYXkpIHtcbiAgY29uc3Qgb3Blbkxpc3QgPSBbXTtcbiAgY29uc3QgY2xvc2VkTGlzdCA9IFtdO1xuICBjb25zdCBmaW5hbFBhdGggPSBbXTtcblxuICBmdW5jdGlvbiByZW1vdmVGcm9tQXJyKG5vZGUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wZW5MaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob3Blbkxpc3RbaV0gPT09IG5vZGUpIHtcbiAgICAgICAgb3Blbkxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGRpc3BsYXlGaW5hbFBhdGgocGF0aCkge1xuICAgIGZvciAobGV0IGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAocGF0aFtpXS5ub2RlVHlwZSA9PT0gJ3N0YXJ0JyB8fCBwYXRoW2ldLm5vZGVUeXBlID09PSAnZW5kJykgY29udGludWU7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMCkpO1xuICAgICAgcGF0aFtpXS5zZXROb2RlVHlwZSgnZmluYWwtcGF0aCcpO1xuICAgIH1cbiAgfVxuXG4gIG9wZW5MaXN0LnB1c2goc3RhcnROb2RlKTtcblxuICBhc3luYyBmdW5jdGlvbiBhbGdvcml0aG0oKSB7XG4gICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICB9XG4gICAgbGV0IGN1cnJlbnROb2RlID0gbnVsbDtcbiAgICBsZXQgbG93ZXN0RiA9IEluZmluaXR5O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3Blbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9wZW5MaXN0W2ldLmNhbGNTY29yZXMoc3RhcnROb2RlLCBlbmROb2RlKTtcbiAgICAgIGlmIChvcGVuTGlzdFtpXS5mIDwgbG93ZXN0Rikge1xuICAgICAgICBsb3dlc3RGID0gb3Blbkxpc3RbaV0uZjtcbiAgICAgICAgY3VycmVudE5vZGUgPSBvcGVuTGlzdFtpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY3VycmVudE5vZGUgPT09IGVuZE5vZGUpIHtcbiAgICAgIGxldCB0ZW1wID0gY3VycmVudE5vZGU7XG4gICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wKTtcbiAgICAgIHdoaWxlICh0ZW1wLnByZXZpb3VzTm9kZSkge1xuICAgICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wLnByZXZpb3VzTm9kZSk7XG4gICAgICAgIHRlbXAgPSB0ZW1wLnByZXZpb3VzTm9kZTtcbiAgICAgIH1cbiAgICAgIGRpc3BsYXlGaW5hbFBhdGgoZmluYWxQYXRoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNsb3NlZExpc3QucHVzaChjdXJyZW50Tm9kZSk7XG4gICAgaWYgKGN1cnJlbnROb2RlLm5vZGVUeXBlICE9PSAnc3RhcnQnICYmIGN1cnJlbnROb2RlLm5vZGVUeXBlICE9PSAnZW5kJykge1xuICAgICAgY3VycmVudE5vZGUuc2V0Tm9kZVR5cGUoJ2Nsb3NlZC1saXN0Jyk7XG4gICAgfVxuICAgIHJlbW92ZUZyb21BcnIoY3VycmVudE5vZGUpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZS5uZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGN1cnJOZWlnaGJvciA9IGN1cnJlbnROb2RlLm5laWdoYm9yc1tpXTtcblxuICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ2JhcnJpZXInICYmICFjbG9zZWRMaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgY29uc3QgdGVtcEcgPSBjdXJyZW50Tm9kZS5nICsgMTtcbiAgICAgICAgaWYgKG9wZW5MaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgICBpZiAodGVtcEcgPCBjdXJyTmVpZ2hib3IuZykge1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSB0ZW1wRztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSB0ZW1wRztcbiAgICAgICAgICBvcGVuTGlzdC5wdXNoKGN1cnJOZWlnaGJvcik7XG4gICAgICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ3N0YXJ0JyAmJiBjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3Iuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJOZWlnaGJvci5wcmV2aW91c05vZGUgPSBjdXJyZW50Tm9kZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3Blbkxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgYWxnb3JpdGhtKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBkb25lID0gYWxnb3JpdGhtKCk7XG4gIHJldHVybiBkb25lO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZGlqa3N0cmEoZ3JpZCwgc3RhcnROb2RlLCBlbmROb2RlLCBkZWxheSkge1xuICBjb25zdCBvcGVuTGlzdFF1ZXVlID0gW107IC8vIHRyYWNrcyBub2RlcyB0byB2aXNpdFxuICBjb25zdCBjbG9zZWRMaXN0ID0gW107XG4gIGNvbnN0IGZpbmFsUGF0aCA9IFtdO1xuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBncmlkW3Jvd11bY29sXS5nID0gSW5maW5pdHk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gZGlzcGxheUZpbmFsUGF0aChwYXRoKSB7XG4gICAgZm9yIChsZXQgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChwYXRoW2ldLm5vZGVUeXBlID09PSAnc3RhcnQnIHx8IHBhdGhbaV0ubm9kZVR5cGUgPT09ICdlbmQnKSBjb250aW51ZTtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwKSk7XG4gICAgICBwYXRoW2ldLnNldE5vZGVUeXBlKCdmaW5hbC1wYXRoJyk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnROb2RlLmcgPSAwO1xuICBvcGVuTGlzdFF1ZXVlLnB1c2goc3RhcnROb2RlKTtcblxuICBhc3luYyBmdW5jdGlvbiBhbGdvcml0aG0oKSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IG9wZW5MaXN0UXVldWUuc2hpZnQoKTtcbiAgICBpZiAoY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnY2xvc2VkLWxpc3QnKTtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudE5vZGUgPT09IGVuZE5vZGUpIHtcbiAgICAgIGxldCB0ZW1wID0gY3VycmVudE5vZGU7XG4gICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wKTtcbiAgICAgIHdoaWxlICh0ZW1wLnByZXZpb3VzTm9kZSkge1xuICAgICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wLnByZXZpb3VzTm9kZSk7XG4gICAgICAgIHRlbXAgPSB0ZW1wLnByZXZpb3VzTm9kZTtcbiAgICAgIH1cbiAgICAgIGRpc3BsYXlGaW5hbFBhdGgoZmluYWxQYXRoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudE5vZGUubmVpZ2hib3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjdXJyTmVpZ2hib3IgPSBjdXJyZW50Tm9kZS5uZWlnaGJvcnNbaV07XG5cbiAgICAgIGlmIChjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdiYXJyaWVyJyAmJiAhY2xvc2VkTGlzdC5pbmNsdWRlcyhjdXJyTmVpZ2hib3IpKSB7XG4gICAgICAgIGlmIChjdXJyTmVpZ2hib3IuZyA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICBjdXJyTmVpZ2hib3IuZyA9IGN1cnJlbnROb2RlLmcgKyAxO1xuICAgICAgICAgIGN1cnJOZWlnaGJvci5wcmV2aW91c05vZGUgPSBjdXJyZW50Tm9kZTtcbiAgICAgICAgICBvcGVuTGlzdFF1ZXVlLnB1c2goY3Vyck5laWdoYm9yKTtcbiAgICAgICAgICBpZiAoY3Vyck5laWdoYm9yLm5vZGVUeXBlICE9PSAnc3RhcnQnICYmIGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ2VuZCcpIHtcbiAgICAgICAgICAgIGN1cnJOZWlnaGJvci5zZXROb2RlVHlwZSgnb3Blbi1saXN0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wZW5MaXN0UXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgYWxnb3JpdGhtKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBkb25lID0gYWxnb3JpdGhtKCk7XG4gIHJldHVybiBkb25lO1xufVxuIiwiZnVuY3Rpb24gdXBkYXRlU3F1YXJlKGdyaWRTcXVhcmUsIG5vZGVUeXBlKSB7XG4gIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZChub2RlVHlwZSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlBbGdvcml0aG0obm9kZSwgZ3JpZCwgc3F1YXJlU2l6ZSkge1xuICBjb25zdCBkb21TcXVhcmUgPSBncmlkLmZpbmREb21TcXVhcmUobm9kZS5yb3cgLSAxLCBub2RlLmNvbCAtIDEpO1xuICBkb21TcXVhcmUucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICBkb21TcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgZG9tU3F1YXJlLmNsYXNzTGlzdC5hZGQobm9kZS5ub2RlVHlwZSk7XG4gIGlmIChzcXVhcmVTaXplID09PSA4MCkge1xuICAgIGRvbVNxdWFyZS5jbGFzc0xpc3QuYWRkKCdzbWFsbCcpO1xuICB9IGVsc2UgaWYgKHNxdWFyZVNpemUgPT09IDMwKSB7XG4gICAgZG9tU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ21lZGl1bScpO1xuICB9IGVsc2UgaWYgKHNxdWFyZVNpemUgPT09IDE1KSB7XG4gICAgZG9tU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2xhcmdlJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheUdyaWQoZ3JpZCwgc3F1YXJlU2l6ZSkge1xuICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyaWQtY29udGFpbmVyJyk7XG4gIGdyaWRDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gIGlmIChzcXVhcmVTaXplID09PSAnc21hbGwnKSB7XG4gICAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdtZWRpdW0tZ3JpZCcpO1xuICAgIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnbGFyZ2UtZ3JpZCcpO1xuICAgIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc21hbGwtZ3JpZCcpO1xuICB9IGVsc2UgaWYgKHNxdWFyZVNpemUgPT09ICdtZWRpdW0nKSB7XG4gICAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzbWFsbC1ncmlkJyk7XG4gICAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdsYXJnZS1ncmlkJyk7XG4gICAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdtZWRpdW0tZ3JpZCcpO1xuICB9IGVsc2UgaWYgKHNxdWFyZVNpemUgPT09ICdsYXJnZScpIHtcbiAgICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3NtYWxsLWdyaWQnKTtcbiAgICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ21lZGl1bS1ncmlkJyk7XG4gICAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdsYXJnZS1ncmlkJyk7XG4gIH1cbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgIGNvbnN0IGdyaWRTcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcbiAgICAgIGlmIChzcXVhcmVTaXplID09PSAnc21hbGwnKSB7XG4gICAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnbWVkaXVtJyk7XG4gICAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnbGFyZ2UnKTtcbiAgICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdzbWFsbCcpO1xuICAgICAgfSBlbHNlIGlmIChzcXVhcmVTaXplID09PSAnbWVkaXVtJykge1xuICAgICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ3NtYWxsJyk7XG4gICAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnbGFyZ2UnKTtcbiAgICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdtZWRpdW0nKTtcbiAgICAgIH0gZWxzZSBpZiAoc3F1YXJlU2l6ZSA9PT0gJ2xhcmdlJykge1xuICAgICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ3NtYWxsJyk7XG4gICAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnbWVkaXVtJyk7XG4gICAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnbGFyZ2UnKTtcbiAgICAgIH1cbiAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoZ3JpZFNxdWFyZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlc2V0R3JpZChub2RlV2lkdGgpIHtcbiAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLWNvbnRhaW5lcicpO1xuICBjb25zdCBncmlkQ29udGFpbmVyQ2hpbGRyZW4gPSBncmlkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZScpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JpZENvbnRhaW5lckNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgZ3JpZENvbnRhaW5lckNoaWxkcmVuW2ldLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICBncmlkQ29udGFpbmVyQ2hpbGRyZW5baV0uY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICBncmlkQ29udGFpbmVyQ2hpbGRyZW5baV0uY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcbiAgICBpZiAobm9kZVdpZHRoID09PSAnc21hbGwnKSB7XG4gICAgICBncmlkQ29udGFpbmVyQ2hpbGRyZW5baV0uY2xhc3NMaXN0LmFkZCgnc21hbGwnKTtcbiAgICB9IGVsc2UgaWYgKG5vZGVXaWR0aCA9PT0gJ21lZGl1bScpIHtcbiAgICAgIGdyaWRDb250YWluZXJDaGlsZHJlbltpXS5jbGFzc0xpc3QuYWRkKCdtZWRpdW0nKTtcbiAgICB9IGVsc2UgaWYgKG5vZGVXaWR0aCA9PT0gJ2xhcmdlJykge1xuICAgICAgZ3JpZENvbnRhaW5lckNoaWxkcmVuW2ldLmNsYXNzTGlzdC5hZGQoJ2xhcmdlJyk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IERvbUhhbmRsZXIgPSB7XG4gIGRpc3BsYXlHcmlkLFxuICB1cGRhdGVTcXVhcmUsXG4gIGRpc3BsYXlBbGdvcml0aG0sXG4gIHJlc2V0R3JpZCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERvbUhhbmRsZXI7XG4iLCJpbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnO1xuaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb21oYW5kbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZCB7XG4gIGNvbnN0cnVjdG9yKHJvd3MsIGNvbHMsIG5vZGVXaWR0aCkge1xuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5jb2xzID0gY29scztcbiAgICB0aGlzLm5vZGVXaWR0aCA9IG5vZGVXaWR0aDtcbiAgICB0aGlzLnN0YXJ0ID0geyBub2RlOiBudWxsIH07XG4gICAgdGhpcy5lbmQgPSB7IG5vZGU6IG51bGwgfTtcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICB0aGlzLm9wZW5MaXN0ID0gW107XG4gICAgdGhpcy5jbG9zZWRMaXN0ID0gW107XG4gICAgdGhpcy5maW5hbFBhdGggPSBbXTtcbiAgICB0aGlzLmNyZWF0ZUdyaWQodGhpcy5yb3dzLCB0aGlzLmNvbHMpO1xuXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gIH1cblxuICBzZXRTcXVhcmVTdGF0dXMoZ3JpZFNxdWFyZSwgcm93LCBjb2wpIHtcbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IHRoaXMuZ3JpZFtyb3ddW2NvbF07XG4gICAgaWYgKGN1cnJlbnROb2RlLm5vZGVUeXBlICE9PSAnZW1wdHknKSByZXR1cm47XG4gICAgaWYgKHRoaXMuc3RhcnQubm9kZSA9PT0gbnVsbCkge1xuICAgICAgY3VycmVudE5vZGUubm9kZVR5cGUgPSAnc3RhcnQnO1xuICAgICAgdGhpcy5zdGFydC5ub2RlID0gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVuZC5ub2RlID09PSBudWxsKSB7XG4gICAgICBjdXJyZW50Tm9kZS5ub2RlVHlwZSA9ICdlbmQnO1xuICAgICAgdGhpcy5lbmQubm9kZSA9IGN1cnJlbnROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50Tm9kZS5ub2RlVHlwZSA9ICdiYXJyaWVyJztcbiAgICB9XG4gICAgRG9tSGFuZGxlci51cGRhdGVTcXVhcmUoZ3JpZFNxdWFyZSwgY3VycmVudE5vZGUubm9kZVR5cGUpO1xuICB9XG5cbiAgaGFuZGxlTW91c2VEb3duKGdyaWRTcXVhcmUsIHJvdywgY29sKSB7XG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnNldFNxdWFyZVN0YXR1cyhncmlkU3F1YXJlLCByb3csIGNvbCk7XG4gIH1cblxuICBoYW5kbGVNb3VzZU1vdmUoZ3JpZFNxdWFyZSwgcm93LCBjb2wpIHtcbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICB0aGlzLnNldFNxdWFyZVN0YXR1cyhncmlkU3F1YXJlLCByb3csIGNvbCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW91c2VVcCgpIHtcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGZpbmREb21TcXVhcmUocm93LCBjb2wpIHtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyaWQtY29udGFpbmVyJyk7XG4gICAgY29uc3QgZ3JpZENvbnRhaW5lckNoaWxkcmVuID0gZ3JpZENvbnRhaW5lci5jaGlsZHJlbjtcbiAgICBjb25zdCBpbmRleCA9IHJvdyAqIHRoaXMuY29scyArIGNvbDtcbiAgICBjb25zb2xlLmxvZyhncmlkQ29udGFpbmVyQ2hpbGRyZW4ubGVuZ3RoKTtcbiAgICByZXR1cm4gZ3JpZENvbnRhaW5lckNoaWxkcmVuW2luZGV4XTtcbiAgfVxuXG4gIGFkZExpc3RlbmVycyhjdXJyZW50bHlSdW5uaW5nKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5yb3dzOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5jb2xzOyBjb2wrKykge1xuICAgICAgICBjb25zdCBncmlkU3F1YXJlID0gdGhpcy5maW5kRG9tU3F1YXJlKHJvdywgY29sKTtcbiAgICAgICAgZ3JpZFNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiB7XG4gICAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdbMF0pIHJldHVybjtcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRG93bihncmlkU3F1YXJlLCByb3csIGNvbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBncmlkU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICgpID0+IHtcbiAgICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ1swXSkgcmV0dXJuO1xuICAgICAgICAgIHRoaXMuaGFuZGxlTW91c2VNb3ZlKGdyaWRTcXVhcmUsIHJvdywgY29sKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlTW91c2VVcCgpO1xuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlR3JpZChyb3dzLCBjb2xzKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMTsgcm93IDw9IHJvd3M7IHJvdysrKSB7XG4gICAgICBjb25zdCBjdXJyZW50Um93ID0gW107XG4gICAgICBmb3IgKGxldCBjb2wgPSAxOyBjb2wgPD0gY29sczsgY29sKyspIHtcbiAgICAgICAgY3VycmVudFJvdy5wdXNoKG5ldyBOb2RlKHJvdywgY29sLCB0aGlzLnJvd3MsIHRoaXMuY29scywgdGhpcywgdGhpcy5ub2RlV2lkdGgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ3JpZC5wdXNoKGN1cnJlbnRSb3cpO1xuICAgIH1cbiAgICBEb21IYW5kbGVyLmRpc3BsYXlHcmlkKHRoaXMuZ3JpZCwgdGhpcy5ub2RlV2lkdGgpO1xuICB9XG5cbiAgc2V0QWxsTm9kZU5laWdoYm9ycygpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLmdyaWQubGVuZ3RoOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5ncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLnNldE5laWdoYm9ycyh0aGlzLmdyaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0R3JpZCgpIHtcbiAgICAvLyBjcmVhdGluZyBuZXcgZ3JpZFxuICAgIHRoaXMuZ3JpZCA9IFtdO1xuICAgIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8PSB0aGlzLnJvd3M7IHJvdysrKSB7XG4gICAgICBjb25zdCBjdXJyZW50Um93ID0gW107XG4gICAgICBmb3IgKGxldCBjb2wgPSAxOyBjb2wgPD0gdGhpcy5jb2xzOyBjb2wrKykge1xuICAgICAgICBjdXJyZW50Um93LnB1c2gobmV3IE5vZGUocm93LCBjb2wsIHRoaXMucm93cywgdGhpcy5jb2xzLCB0aGlzLCB0aGlzLm5vZGVXaWR0aCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5ncmlkLnB1c2goY3VycmVudFJvdyk7XG4gICAgfVxuXG4gICAgLy8gc2V0dGluZyBuZWlnaGJvdXJzIGFnYWluXG4gICAgdGhpcy5zZXRBbGxOb2RlTmVpZ2hib3JzKCk7XG5cbiAgICAvLyByZXNldHRpbmcgc3RhcnQgYW5kIGVuZCBub2RlXG4gICAgdGhpcy5zdGFydC5ub2RlID0gbnVsbDtcbiAgICB0aGlzLmVuZC5ub2RlID0gbnVsbDtcblxuICAgIC8vIHJlc2V0aW5nIGRvbSBzcXVhcmVzXG4gICAgRG9tSGFuZGxlci5yZXNldEdyaWQodGhpcy5ub2RlV2lkdGgpO1xuICB9XG5cbiAgcmVzZXRQYXRoKCkge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMucm93czsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgY29uc3QgY3Vyck5vZGUgPSB0aGlzLmdyaWRbcm93XVtjb2xdO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgY3Vyck5vZGUubm9kZVR5cGUgPT09ICdvcGVuLWxpc3QnIHx8XG4gICAgICAgICAgY3Vyck5vZGUubm9kZVR5cGUgPT09ICdjbG9zZWQtbGlzdCcgfHxcbiAgICAgICAgICBjdXJyTm9kZS5ub2RlVHlwZSA9PT0gJ2ZpbmFsLXBhdGgnXG4gICAgICAgICkge1xuICAgICAgICAgIGN1cnJOb2RlLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlR3JpZFNpemUocm93cywgY29scywgbm9kZVdpZHRoKSB7XG4gICAgdGhpcy5yb3dzID0gcm93cztcbiAgICB0aGlzLmNvbHMgPSBjb2xzO1xuICAgIHRoaXMubm9kZVdpZHRoID0gbm9kZVdpZHRoO1xuICAgIHRoaXMucmVzZXRHcmlkKCk7XG4gICAgRG9tSGFuZGxlci5kaXNwbGF5R3JpZCh0aGlzLmdyaWQsIG5vZGVXaWR0aCk7XG4gICAgdGhpcy5hZGRMaXN0ZW5lcnMoW2ZhbHNlXSk7XG4gIH1cbn1cbiIsImltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZCc7XG5pbXBvcnQgYXN0YXIgZnJvbSAnLi9hbGdvcml0aG1zL2FzdGFyJztcbmltcG9ydCBkaWprc3RyYSBmcm9tICcuL2FsZ29yaXRobXMvZGlqa3N0cmEnO1xuaW1wb3J0IHJhbmRvbU1hcCBmcm9tICcuL21hemVzL3JhbmRvbW1hcCc7XG5pbXBvcnQgYmluYXJ5VHJlZSBmcm9tICcuL21hemVzL2JpbmFyeXRyZWUnO1xuaW1wb3J0IHNpZGV3aW5kZXIgZnJvbSAnLi9tYXplcy9zaWRld2luZGVyJztcbmltcG9ydCByZWN1cnNpdmVEaXZpc2lvbiBmcm9tICcuL21hemVzL3JlY3Vyc2l2ZWRpdmlzaW9uJztcbmltcG9ydCBnZW5lcmF0ZVByaW1zIGZyb20gJy4vbWF6ZXMvcHJpbXMnO1xuaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb21oYW5kbGVyJztcblxubGV0IGdyaWRPYmogPSBudWxsO1xubGV0IHJvd3MgPSAyNTtcbmxldCBjb2xzID0gNjE7XG5sZXQgc2VsZWN0ZWRBbGdvcml0aG0gPSBudWxsO1xubGV0IHNlbGVjdGVkTWF6ZSA9IG51bGw7XG5jb25zdCBydW5uaW5nID0gW2ZhbHNlXTsgLy8gY2hlY2sgaWYgYWxnb3JpdGhtIGlzIGN1cnJlbnRseSBydW5uaW5nXG5sZXQgbWF6ZVNwZWVkID0gMTA7XG5sZXQgcGF0aGZpbmRpbmdTcGVlZCA9IDEwO1xuXG5mdW5jdGlvbiBsb2FkR3JpZCgpIHtcbiAgZ3JpZE9iaiA9IG5ldyBHcmlkKHJvd3MsIGNvbHMsICdtZWRpdW0nKTtcbn1cblxuZnVuY3Rpb24gcnVuQVN0YXIoKSB7XG4gIGNvbnN0IHN0YXJ0Tm9kZSA9IGdyaWRPYmouc3RhcnQubm9kZTtcbiAgY29uc3QgZW5kTm9kZSA9IGdyaWRPYmouZW5kLm5vZGU7XG5cbiAgdHJ5IHtcbiAgICBydW5uaW5nWzBdID0gdHJ1ZTtcbiAgICBjb25zdCBwYXRoRm91bmQgPSBhc3RhcihzdGFydE5vZGUsIGVuZE5vZGUsIHBhdGhmaW5kaW5nU3BlZWQpO1xuXG4gICAgaWYgKHBhdGhGb3VuZCkge1xuICAgICAgY29uc29sZS5sb2coJ2ZvdW5kIHBhdGgnKTtcbiAgICAgIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3BhdGggbm90IGZvdW5kJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBydW5uaW5nWzBdID0gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gcnVuRGlqa3N0cmEoKSB7XG4gIGNvbnN0IHN0YXJ0Tm9kZSA9IGdyaWRPYmouc3RhcnQubm9kZTtcbiAgY29uc3QgZW5kTm9kZSA9IGdyaWRPYmouZW5kLm5vZGU7XG5cbiAgdHJ5IHtcbiAgICBydW5uaW5nWzBdID0gdHJ1ZTtcbiAgICBjb25zdCBwYXRoRm91bmQgPSBkaWprc3RyYShncmlkT2JqLmdyaWQsIHN0YXJ0Tm9kZSwgZW5kTm9kZSwgcGF0aGZpbmRpbmdTcGVlZCk7XG5cbiAgICBpZiAocGF0aEZvdW5kKSB7XG4gICAgICBjb25zb2xlLmxvZygnZm91bmQgcGF0aCcpO1xuICAgICAgcnVubmluZ1swXSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygncGF0aCBub3QgZm91bmQnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xuICB9IGZpbmFsbHkge1xuICAgIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbiAgfVxufVxuXG5jb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGFydC1hbGdvcml0aG0nKTtcblxuc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gIGlmIChydW5uaW5nWzBdIHx8IHNlbGVjdGVkQWxnb3JpdGhtID09PSBudWxsKSByZXR1cm47IC8vIGFsZ29yaXRobSBpbiBwcm9ncmVzc1xuICBncmlkT2JqLnNldEFsbE5vZGVOZWlnaGJvcnMoKTtcbiAgZ3JpZE9iai5yZXNldFBhdGgoKTtcblxuICBsZXQgZG9uZTtcbiAgaWYgKGdyaWRPYmouc3RhcnQubm9kZSAmJiBncmlkT2JqLmVuZC5ub2RlKSB7XG4gICAgaWYgKHNlbGVjdGVkQWxnb3JpdGhtID09PSAnQSonKSBkb25lID0gcnVuQVN0YXIoKTtcbiAgICBpZiAoc2VsZWN0ZWRBbGdvcml0aG0gPT09ICdEaWprc3RyYScpIGRvbmUgPSBydW5EaWprc3RyYSgpO1xuICB9XG5cbiAgaWYgKGRvbmUpIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbn0pO1xuXG5jb25zdCBnZW5lcmF0ZU1hemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2VuZXJhdGUtbWF6ZScpO1xuXG5nZW5lcmF0ZU1hemVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gIGlmIChydW5uaW5nWzBdIHx8IHNlbGVjdGVkTWF6ZSA9PT0gbnVsbCkgcmV0dXJuOyAvLyBhbGdvcml0aG0gaW4gcHJvZ3Jlc3NcbiAgcnVubmluZ1swXSA9IHRydWU7XG4gIGdyaWRPYmoucmVzZXRHcmlkKCk7XG5cbiAgbGV0IGRvbmU7XG4gIGlmIChzZWxlY3RlZE1hemUgPT09ICdSYW5kb20gTWFwJykge1xuICAgIGRvbmUgPSBhd2FpdCByYW5kb21NYXAoZ3JpZE9iai5ncmlkLCBtYXplU3BlZWQpO1xuICB9XG4gIGlmIChzZWxlY3RlZE1hemUgPT09ICdCaW5hcnkgVHJlZScpIHtcbiAgICBkb25lID0gYXdhaXQgYmluYXJ5VHJlZShncmlkT2JqLmdyaWQsIG1hemVTcGVlZCk7XG4gIH1cbiAgaWYgKHNlbGVjdGVkTWF6ZSA9PT0gJ1NpZGV3aW5kZXInKSB7XG4gICAgZG9uZSA9IGF3YWl0IHNpZGV3aW5kZXIoZ3JpZE9iai5ncmlkLCBtYXplU3BlZWQpO1xuICB9XG4gIGlmIChzZWxlY3RlZE1hemUgPT09ICdSZWN1cnNpdmUgRGl2aXNpb24nKSB7XG4gICAgZG9uZSA9IGF3YWl0IHJlY3Vyc2l2ZURpdmlzaW9uKGdyaWRPYmouZ3JpZCwgbWF6ZVNwZWVkKTtcbiAgfVxuICBpZiAoc2VsZWN0ZWRNYXplID09PSBcIlByaW0nc1wiKSB7XG4gICAgZG9uZSA9IGF3YWl0IGdlbmVyYXRlUHJpbXMoZ3JpZE9iai5ncmlkLCBtYXplU3BlZWQpO1xuICB9XG4gIGlmIChkb25lKSBydW5uaW5nWzBdID0gZmFsc2U7XG59KTtcblxuZnVuY3Rpb24gdXBkYXRlTWF6ZURlbGF5KHNwZWVkKSB7XG4gIGlmIChzcGVlZCA9PT0gJ1Nsb3cnKSBtYXplU3BlZWQgPSAyMDtcbiAgaWYgKHNwZWVkID09PSAnTm9ybWFsJykgbWF6ZVNwZWVkID0gMTA7XG4gIGlmIChzcGVlZCA9PT0gJ0Zhc3QnKSBtYXplU3BlZWQgPSAxO1xuICBpZiAoc3BlZWQgPT09ICdJbnN0YW50JykgbWF6ZVNwZWVkID0gMDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUGF0aGZpbmRpbmdEZWxheShzcGVlZCkge1xuICBpZiAoc3BlZWQgPT09ICdTbG93JykgcGF0aGZpbmRpbmdTcGVlZCA9IDMwO1xuICBpZiAoc3BlZWQgPT09ICdOb3JtYWwnKSBwYXRoZmluZGluZ1NwZWVkID0gMTA7XG4gIGlmIChzcGVlZCA9PT0gJ0Zhc3QnKSBwYXRoZmluZGluZ1NwZWVkID0gNTtcbiAgaWYgKHNwZWVkID09PSAnSW5zdGFudCcpIHBhdGhmaW5kaW5nU3BlZWQgPSAwO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVHcmlkU2l6ZShzaXplKSB7XG4gIGlmIChzaXplID09PSAnU21hbGwnKSB7XG4gICAgcm93cyA9IDk7XG4gICAgY29scyA9IDIzO1xuICAgIGdyaWRPYmoudXBkYXRlR3JpZFNpemUocm93cywgY29scywgJ3NtYWxsJyk7XG4gIH1cbiAgaWYgKHNpemUgPT09ICdNZWRpdW0nKSB7XG4gICAgcm93cyA9IDI1O1xuICAgIGNvbHMgPSA2MTtcbiAgICBncmlkT2JqLnVwZGF0ZUdyaWRTaXplKHJvd3MsIGNvbHMsICdtZWRpdW0nKTtcbiAgfVxuICBpZiAoc2l6ZSA9PT0gJ0xhcmdlJykge1xuICAgIHJvd3MgPSA0OTtcbiAgICBjb2xzID0gMTE5O1xuICAgIGdyaWRPYmoudXBkYXRlR3JpZFNpemUocm93cywgY29scywgJ2xhcmdlJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkTGlzdGVuZXJzVG9CdG5zKCkge1xuICBjb25zdCBzZWxlY3RBbGdvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdC1hbGdvLWJ0bicpO1xuICBjb25zdCBzZWxlY3RNYXplQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdC1tYXplLWJ0bicpO1xuICBjb25zdCBncmlkU2l6ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLXNpemUtYnRuJyk7XG4gIGNvbnN0IHNlbGVjdE1hemVTcGVlZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtbWF6ZS1zcGVlZC1idG4nKTtcbiAgY29uc3Qgc2VsZWN0QWxnb1NwZWVkQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdC1hbGdvLXNwZWVkLWJ0bicpO1xuXG4gIGNvbnN0IHNlbGVjdEFsZ29CdG5MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsZ28tbGlzdCcpO1xuICBjb25zdCBzZWxlY3RNYXplQnRuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXplLWxpc3QnKTtcbiAgY29uc3QgZ3JpZFNpemVCdG5MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyaWQtc2l6ZS1saXN0Jyk7XG4gIGNvbnN0IHNlbGVjdE1hemVTcGVlZEJ0bkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWF6ZS1zcGVlZC1saXN0Jyk7XG4gIGNvbnN0IHNlbGVjdEFsZ29TcGVlZEJ0bkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWxnby1zcGVlZC1saXN0Jyk7XG4gIGNvbnN0IHNlbGVjdEFsZ29MaXN0SXRlbXMgPSBzZWxlY3RBbGdvQnRuTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC1zZWxlY3Rpb24nKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZUxpc3RJdGVtcyA9IHNlbGVjdE1hemVCdG5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuICBjb25zdCBncmlkU2l6ZUxpc3RJdGVtcyA9IGdyaWRTaXplQnRuTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC1zZWxlY3Rpb24nKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZVNwZWVkTGlzdEl0ZW1zID0gc2VsZWN0TWF6ZVNwZWVkQnRuTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC1zZWxlY3Rpb24nKTtcbiAgY29uc3Qgc2VsZWN0QWxnb1NwZWVkTGlzdEl0ZW1zID0gc2VsZWN0QWxnb1NwZWVkQnRuTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC1zZWxlY3Rpb24nKTtcblxuICBjb25zdCBkcm9wZG93bkJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJvcGRvd24tYnRuJyk7XG4gIGNvbnN0IGRyb3Bkb3duTGlzdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJvcGRvd24tbGlzdCcpO1xuICBjb25zdCBjbGVhckJvYXJkQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsZWFyLWJvYXJkJyk7XG4gIGNvbnN0IGNsZWFyUGF0aEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbGVhci1wYXRoJyk7XG5cbiAgZnVuY3Rpb24gY2xvc2VEcm9wZG93bnMoKSB7XG4gICAgZHJvcGRvd25MaXN0cy5mb3JFYWNoKChsaXN0KSA9PiB7XG4gICAgICBsaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRyb3Bkb3duQnV0dG9ucy5mb3JFYWNoKChidXR0b24sIGluZGV4KSA9PiB7XG4gICAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjsgLy8gYWxnb3JpdGhtIGluIHByb2dyZXNzXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBjb25zdCBjdXJyZW50TGlzdCA9IGRyb3Bkb3duTGlzdHNbaW5kZXhdO1xuICAgICAgY29uc3QgaXNMaXN0T3BlbiA9IGN1cnJlbnRMaXN0LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpO1xuXG4gICAgICBjbG9zZURyb3Bkb3ducygpO1xuXG4gICAgICBpZiAoIWlzTGlzdE9wZW4pIHtcbiAgICAgICAgY3VycmVudExpc3QuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdycpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgY29uc3QgaXNDbGlja0luc2lkZURyb3Bkb3duID0gQXJyYXkuZnJvbShkcm9wZG93bkxpc3RzKS5zb21lKChsaXN0KSA9PiBsaXN0LmNvbnRhaW5zKGUudGFyZ2V0KSk7XG5cbiAgICBpZiAoIWlzQ2xpY2tJbnNpZGVEcm9wZG93bikge1xuICAgICAgY2xvc2VEcm9wZG93bnMoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHNlbGVjdEFsZ29MaXN0SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgc2VsZWN0QWxnb0J0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0QWxnb0J0bi50ZXh0Q29udGVudCA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICBzZWxlY3RlZEFsZ29yaXRobSA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuICB9KTtcblxuICBzZWxlY3RNYXplTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHNlbGVjdE1hemVCdG5MaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgIHNlbGVjdE1hemVCdG4udGV4dENvbnRlbnQgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgc2VsZWN0ZWRNYXplID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGVjdE1hemVTcGVlZExpc3RJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBzZWxlY3RNYXplU3BlZWRCdG5MaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgIHNlbGVjdE1hemVTcGVlZEJ0bi50ZXh0Q29udGVudCA9ICdNYXplIFNwZWVkICcgKyBgKCR7aXRlbS50ZXh0Q29udGVudH0pYDtcbiAgICAgIHVwZGF0ZU1hemVEZWxheShpdGVtLnRleHRDb250ZW50KTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGVjdEFsZ29TcGVlZExpc3RJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBzZWxlY3RBbGdvU3BlZWRCdG5MaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgIHNlbGVjdEFsZ29TcGVlZEJ0bi50ZXh0Q29udGVudCA9ICdBbGdvcml0aG0gU3BlZWQgJyArIGAoJHtpdGVtLnRleHRDb250ZW50fSlgO1xuICAgICAgdXBkYXRlUGF0aGZpbmRpbmdEZWxheShpdGVtLnRleHRDb250ZW50KTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGdyaWRTaXplTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGdyaWRTaXplQnRuTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICBncmlkU2l6ZUJ0bi50ZXh0Q29udGVudCA9ICdHcmlkIFNpemUgJyArIGAoJHtpdGVtLnRleHRDb250ZW50fSlgO1xuICAgICAgdXBkYXRlR3JpZFNpemUoaXRlbS50ZXh0Q29udGVudCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuICB9KTtcblxuICBjbGVhckJvYXJkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChydW5uaW5nWzBdKSByZXR1cm47IC8vIGFsZ29yaXRobSBpbiBwcm9ncmVzc1xuICAgIGdyaWRPYmoucmVzZXRHcmlkKCk7XG4gIH0pO1xuXG4gIGNsZWFyUGF0aEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBpZiAocnVubmluZ1swXSkgcmV0dXJuOyAvLyBhbGdvcml0aG0gaW4gcHJvZ3Jlc3NcbiAgICBncmlkT2JqLnJlc2V0UGF0aCgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkTGlzdGVuZXJzVG9HcmlkKCkge1xuICBncmlkT2JqLmFkZExpc3RlbmVycyhydW5uaW5nKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZCgpIHtcbiAgbG9hZEdyaWQoKTtcbiAgYWRkTGlzdGVuZXJzVG9HcmlkKCk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgYWRkTGlzdGVuZXJzVG9CdG5zKCk7XG4gIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYmluYXJ5VHJlZShncmlkLCBkZWxheSkge1xuICBmdW5jdGlvbiBjb25uZWN0KG5vZGUxLCBub2RlMiwgYmFycmllckJldHdlZW4pIHtcbiAgICBub2RlMS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICBub2RlMi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICBiYXJyaWVyQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgfVxuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBpZiAocm93ICUgMiA9PT0gMCB8fCBjb2wgJSAyID09PSAwKSBjb250aW51ZTtcbiAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY3VycmVudFNxdWFyZSA9IGdyaWRbcm93XVtjb2xdO1xuICAgICAgbGV0IG5vcnRoTmVpZ2hib3I7XG4gICAgICBsZXQgd2VzdE5laWdoYm9yO1xuXG4gICAgICBpZiAocm93ID4gMSkge1xuICAgICAgICBub3J0aE5laWdoYm9yID0gZ3JpZFtyb3cgLSAyXVtjb2xdOyAvLyB1cFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9ydGhOZWlnaGJvciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2wgPiAxKSB7XG4gICAgICAgIHdlc3ROZWlnaGJvciA9IGdyaWRbcm93XVtjb2wgLSAyXTsgLy8gbGVmdFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2VzdE5laWdoYm9yID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKG5vcnRoTmVpZ2hib3IgJiYgd2VzdE5laWdoYm9yKSB7XG4gICAgICAgIC8vIGlmIGJvdGggcGF0aHMgYXJlIGF2YWlsYWJsZVxuICAgICAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgICAgaWYgKHJhbmRvbSA9PT0gMCkge1xuICAgICAgICAgIGNvbm5lY3QoY3VycmVudFNxdWFyZSwgbm9ydGhOZWlnaGJvciwgY3VycmVudFNxdWFyZS5uZWlnaGJvcnNbM10pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbm5lY3QoY3VycmVudFNxdWFyZSwgd2VzdE5laWdoYm9yLCBjdXJyZW50U3F1YXJlLm5laWdoYm9yc1sxXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIG9uZSBvZiB0aGUgcGF0aHMgZ28gYmV5b25kIHRoZSBncmlkXG4gICAgICAgIGlmIChyb3cgPT09IDEgJiYgY29sID4gMSkge1xuICAgICAgICAgIGNvbm5lY3QoY3VycmVudFNxdWFyZSwgd2VzdE5laWdoYm9yLCBjdXJyZW50U3F1YXJlLm5laWdoYm9yc1sxXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbCA9PT0gMSAmJiByb3cgPiAxKSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCBub3J0aE5laWdoYm9yLCBjdXJyZW50U3F1YXJlLm5laWdoYm9yc1szXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7IC8vIG1hemUgZ2VuZXJhdGlvbiBmaW5pc2hlZFxufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVQcmltcyhncmlkLCBkZWxheSkge1xuICBjb25zdCByb3dzID0gZ3JpZC5sZW5ndGg7XG4gIGNvbnN0IGNvbHMgPSBncmlkWzBdLmxlbmd0aDtcbiAgY29uc3QgZnJvbnRpZXIgPSBbXTtcbiAgY29uc3QgdmlzaXRlZCA9IFtdO1xuXG4gIC8vIHNldCB0aGUgZW50aXJlIGdyaWQgYXMgYmFycmllcnNcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcm93czsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBjb2xzOyBjb2wrKykge1xuICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICB9XG4gIH1cblxuICAvLyBhZGQgbmVpZ2hib3JzIC0gZGlyZWN0bHkgYWRqYWNlbnQgbmVpZ2hib3JzIGFyZSBza2lwcGVkIHNvIHRoZXkgY2FuIGJlIHdhbGxzIGlmIG5lZWRlZFxuICBmdW5jdGlvbiBnZXROZWlnaGJvcnMobm9kZSkge1xuICAgIGNvbnN0IG5laWdoYm9ycyA9IFtdO1xuICAgIGNvbnN0IHJvdyA9IG5vZGUucm93IC0gMTtcbiAgICBjb25zdCBjb2wgPSBub2RlLmNvbCAtIDE7XG5cbiAgICBpZiAocm93ID4gMSkge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgLSAyXVtjb2xdKTsgLy8gdXBcbiAgICB9XG5cbiAgICBpZiAocm93IDwgcm93cyAtIDIpIHtcbiAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93ICsgMl1bY29sXSk7IC8vIGRvd25cbiAgICB9XG5cbiAgICBpZiAoY29sID4gMSkge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCAtIDJdKTsgLy8gbGVmdFxuICAgIH1cblxuICAgIGlmIChjb2wgPCBjb2xzIC0gMikge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCArIDJdKTsgLy8gcmlnaHRcbiAgICB9XG5cbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0V2FsbEJldHdlZW4obm9kZSwgbmVpZ2hib3IpIHtcbiAgICBjb25zdCByb3cgPSBub2RlLnJvdyAtIDE7XG4gICAgY29uc3QgY29sID0gbm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgIGlmIChncmlkW3JvdyAtIDJdW2NvbF0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3cgLSAxXVtjb2xdOyAvLyB1cFxuICAgIH1cbiAgICBpZiAocm93IDwgcm93cyAtIDIpIHtcbiAgICAgIGlmIChncmlkW3JvdyArIDJdW2NvbF0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3cgKyAxXVtjb2xdOyAvLyBkb3duXG4gICAgfVxuICAgIGlmIChjb2wgPiAxKSB7XG4gICAgICBpZiAoZ3JpZFtyb3ddW2NvbCAtIDJdID09PSBuZWlnaGJvcikgcmV0dXJuIGdyaWRbcm93XVtjb2wgLSAxXTsgLy8gbGVmdFxuICAgIH1cbiAgICBpZiAoY29sIDwgY29scyAtIDIpIHtcbiAgICAgIGlmIChncmlkW3Jvd11bY29sICsgMl0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3ddW2NvbCArIDFdOyAvLyByaWdodFxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gY29ubmVjdChub2RlMSwgbm9kZTIsIHdhbGxCZXR3ZWVuKSB7XG4gICAgbm9kZTEuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgbm9kZTIuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgd2FsbEJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gIH1cblxuICAvLyBjaG9vc2UgYSByYW5kb20gcG9pbnQgb24gdGhlIGdyaWQgdG8gc3RhcnQgd2l0aFxuICBsZXQgcmFuZG9tTm9kZUZvdW5kID0gZmFsc2U7XG4gIGxldCByYW5kb21GaXJzdE5vZGUgPSBudWxsO1xuICB3aGlsZSAoIXJhbmRvbU5vZGVGb3VuZCkge1xuICAgIGNvbnN0IHJhbmRvbVJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChyb3dzIC0gNCkpICsgMjtcbiAgICBjb25zdCByYW5kb21Db2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoY29scyAtIDQpKSArIDI7XG4gICAgaWYgKHJhbmRvbVJvdyAlIDIgIT09IDAgJiYgcmFuZG9tQ29sICUgMiAhPT0gMCkge1xuICAgICAgcmFuZG9tRmlyc3ROb2RlID0gZ3JpZFtyYW5kb21Sb3ddW3JhbmRvbUNvbF07XG4gICAgICByYW5kb21GaXJzdE5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICB2aXNpdGVkLnB1c2gocmFuZG9tRmlyc3ROb2RlKTtcbiAgICAgIHJhbmRvbU5vZGVGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3RhcnROb2RlTmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKHJhbmRvbUZpcnN0Tm9kZSk7XG4gIHN0YXJ0Tm9kZU5laWdoYm9ycy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgaWYgKG5vZGUpIHtcbiAgICAgIGZyb250aWVyLnB1c2gobm9kZSk7XG4gICAgfVxuICB9KTtcblxuICB3aGlsZSAoZnJvbnRpZXIubGVuZ3RoID4gMCkge1xuICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgfVxuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZnJvbnRpZXIubGVuZ3RoKTtcbiAgICBjb25zdCByYW5kb21Gcm9udGllck5vZGUgPSBmcm9udGllcltyYW5kb21JbmRleF07XG4gICAgY29uc3QgZnJvbnRpZXJOZWlnaGJvcnMgPSBnZXROZWlnaGJvcnMocmFuZG9tRnJvbnRpZXJOb2RlKTtcblxuICAgIC8vIGZpbmQgb3V0IHdoaWNoICdpbicgbm9kZXMgKHBhcnQgb2YgbWF6ZSkgYXJlIGFkamFjZW50XG4gICAgY29uc3QgYWRqYWNlbnRJbnMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyb250aWVyTmVpZ2hib3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyhmcm9udGllck5laWdoYm9yc1tpXSkpIHtcbiAgICAgICAgYWRqYWNlbnRJbnMucHVzaChmcm9udGllck5laWdoYm9yc1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2hvb3NlIGEgcmFuZG9tIGFkamFjZW50IG5vZGUgYW5kIGNvbm5lY3QgdGhhdCB3aXRoIHRoZSBmcm9udGllciBub2RlXG4gICAgY29uc3QgcmFuZG9tQWRqYWNlbnRJbiA9IGFkamFjZW50SW5zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFkamFjZW50SW5zLmxlbmd0aCldO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRqYWNlbnRJbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhZGphY2VudEluc1tpXSA9PT0gcmFuZG9tQWRqYWNlbnRJbikge1xuICAgICAgICBjb25zdCB3YWxsQmV0d2VlbiA9IGdldFdhbGxCZXR3ZWVuKHJhbmRvbUZyb250aWVyTm9kZSwgcmFuZG9tQWRqYWNlbnRJbik7XG4gICAgICAgIGNvbnN0IGluZGV4VG9TcGxpY2UgPSBmcm9udGllci5pbmRleE9mKHJhbmRvbUZyb250aWVyTm9kZSk7XG4gICAgICAgIGNvbm5lY3QocmFuZG9tRnJvbnRpZXJOb2RlLCByYW5kb21BZGphY2VudEluLCB3YWxsQmV0d2Vlbik7XG4gICAgICAgIHZpc2l0ZWQucHVzaChyYW5kb21Gcm9udGllck5vZGUpO1xuICAgICAgICBmcm9udGllci5zcGxpY2UoaW5kZXhUb1NwbGljZSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZ2V0IHRoZSBuZWlnaGJvcnMgb2YgdGhlIGZyb250aWVyIG5vZGUgYW5kIGFkZCB0aGVtIHRvIGZyb250aWVyIGxpc3RcbiAgICBjb25zdCBuZWlnaGJvcnNUb0FkZCA9IGdldE5laWdoYm9ycyhyYW5kb21Gcm9udGllck5vZGUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmVpZ2hib3JzVG9BZGQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChuZWlnaGJvcnNUb0FkZFtpXSkge1xuICAgICAgICBpZiAoIXZpc2l0ZWQuaW5jbHVkZXMobmVpZ2hib3JzVG9BZGRbaV0pICYmICFmcm9udGllci5pbmNsdWRlcyhuZWlnaGJvcnNUb0FkZFtpXSkpIHtcbiAgICAgICAgICBmcm9udGllci5wdXNoKG5laWdoYm9yc1RvQWRkW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJhbmRvbU1hcChncmlkLCBkZWxheSkge1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5yYW5kb20oKTtcbiAgICAgIGlmIChyYW5kb20gPCAwLjMpIHtcbiAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7IC8vIG1hemUgZ2VuZXJhdGlvbiBmaW5pc2hlZFxufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcmVjdXJzaXZlRGl2aXNpb24oZ3JpZCwgZGVsYXkpIHtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG4gIGxldCBpc0ZpbmlzaGVkID0gZmFsc2U7IC8vIGlzIHJlY3Vyc2l2ZSBwcm9jZXNzIGZpbmlzaGVkP1xuXG4gIGZ1bmN0aW9uIHJhbmRvbUV2ZW4oYSwgYikge1xuICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChiIC0gYSArIDEpKSArIGE7XG4gICAgcmV0dXJuIHJhbmRvbSAlIDIgPT09IDAgPyByYW5kb20gOiByYW5kb20gKyAxO1xuICB9XG5cbiAgZnVuY3Rpb24gcmFuZG9tT2RkKGEsIGIpIHtcbiAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoYiAtIGEgKyAxKSkgKyBhO1xuICAgIHJldHVybiByYW5kb20gJSAyICE9PSAwID8gcmFuZG9tIDogcmFuZG9tICsgMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNob29zZU9yaWVudGF0aW9uKHN0YXJ0Um93LCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpIHtcbiAgICBjb25zdCB3aWR0aCA9IGVuZENvbCAtIHN0YXJ0Q29sO1xuICAgIGNvbnN0IGhlaWdodCA9IGVuZFJvdyAtIHN0YXJ0Um93O1xuICAgIGlmICh3aWR0aCA+IGhlaWdodCkge1xuICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgfSBlbHNlIGlmICh3aWR0aCA8IGhlaWdodCkge1xuICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICB9XG5cbiAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICByZXR1cm4gcmFuZG9tID09PSAwID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJztcbiAgfVxuXG4gIC8vIHNldCBlZGdlcyBvZiBncmlkIGFzIGJhcnJpZXJzXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHJvd3M7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgY29sKyspIHtcbiAgICAgIGlmIChyb3cgPT09IDAgfHwgcm93ID09PSByb3dzIC0gMSB8fCBjb2wgPT09IDAgfHwgY29sID09PSBjb2xzIC0gMSkge1xuICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNSkpO1xuICAgICAgICB9XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gdGhlIHJlY3Vyc2l2ZSBmdW5jdGlvbiB0byBkaXZpZGUgdGhlIGdyaWRcbiAgYXN5bmMgZnVuY3Rpb24gZGl2aWRlKHN0YXJ0Um93LCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpIHtcbiAgICBpZiAoZW5kQ29sIC0gc3RhcnRDb2wgPCAxIHx8IGVuZFJvdyAtIHN0YXJ0Um93IDwgMSkge1xuICAgICAgLy8gYmFzZSBjYXNlIGlmIHN1Yi1tYXplIGlzIHRvbyBzbWFsbFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdhbGxSb3cgPSByYW5kb21FdmVuKHN0YXJ0Um93ICsgMSwgZW5kUm93IC0gMSk7XG4gICAgY29uc3Qgd2FsbENvbCA9IHJhbmRvbUV2ZW4oc3RhcnRDb2wgKyAxLCBlbmRDb2wgLSAxKTtcblxuICAgIGNvbnN0IHBhc3NhZ2VSb3cgPSByYW5kb21PZGQoc3RhcnRSb3csIGVuZFJvdyk7XG4gICAgY29uc3QgcGFzc2FnZUNvbCA9IHJhbmRvbU9kZChzdGFydENvbCwgZW5kQ29sKTtcblxuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gY2hvb3NlT3JpZW50YXRpb24oc3RhcnRSb3csIGVuZFJvdywgc3RhcnRDb2wsIGVuZENvbCk7XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgLy8gbWFrZSBhIGhvcml6b250YWwgd2FsbFxuICAgICAgZm9yIChsZXQgY29sID0gc3RhcnRDb2w7IGNvbCA8PSBlbmRDb2w7IGNvbCsrKSB7XG4gICAgICAgIGlmIChjb2wgIT09IHBhc3NhZ2VDb2wpIHtcbiAgICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBncmlkW3dhbGxSb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIC8vIG1ha2UgYSB2ZXJ0aWNhbCB3YWxsXG4gICAgICBmb3IgKGxldCByb3cgPSBzdGFydFJvdzsgcm93IDw9IGVuZFJvdzsgcm93KyspIHtcbiAgICAgICAgaWYgKHJvdyAhPT0gcGFzc2FnZVJvdykge1xuICAgICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGdyaWRbcm93XVt3YWxsQ29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgd2FsbFJvdyAtIDEsIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgICAgYXdhaXQgZGl2aWRlKHdhbGxSb3cgKyAxLCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgZW5kUm93LCB3YWxsQ29sICsgMSwgZW5kQ29sKTtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgd2FsbENvbCAtIDEpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgdGhlIGxhc3QgcmVjdXJzaXZlIGNhbGxcbiAgICBpZiAoc3RhcnRSb3cgPT09IDEgJiYgZW5kUm93ID09PSByb3dzIC0gMiAmJiBzdGFydENvbCA9PT0gMSAmJiBlbmRDb2wgPT09IGNvbHMgLSAyKSB7XG4gICAgICBpc0ZpbmlzaGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBhd2FpdCBkaXZpZGUoMSwgcm93cyAtIDIsIDEsIGNvbHMgLSAyKTtcblxuICByZXR1cm4gaXNGaW5pc2hlZDsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzaWRld2luZGVyKGdyaWQsIGRlbGF5KSB7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHJvd3M7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgY29sKyspIHtcbiAgICAgIGlmIChyb3cgPT09IDEgJiYgY29sICE9PSAwICYmIGNvbCAhPT0gY29scyAtIDEpIGNvbnRpbnVlO1xuICAgICAgaWYgKGNvbCAlIDIgPT09IDApIHtcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgIH1cbiAgICAgIGlmIChyb3cgJSAyID09PSAwKSB7XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgcm93ID0gMTsgcm93IDwgcm93czsgcm93KyspIHtcbiAgICBsZXQgcnVuID0gW107XG4gICAgZm9yIChsZXQgY29sID0gMTsgY29sIDwgY29sczsgY29sICs9IDIpIHtcbiAgICAgIGlmIChyb3cgJSAyID09PSAwKSBjb250aW51ZTtcblxuICAgICAgaWYgKHJvdyA9PT0gMSkge1xuICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGN1cnJlbnROb2RlID0gZ3JpZFtyb3ddW2NvbF07XG4gICAgICBydW4ucHVzaChjdXJyZW50Tm9kZSk7XG5cbiAgICAgIGlmIChjb2wgPCBjb2xzIC0gMSkge1xuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNiAmJiBjb2wgIT09IGNvbHMgLSAyKSB7XG4gICAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudE5vZGUubmVpZ2hib3JzWzBdLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgICAgICB9IGVsc2UgaWYgKHJ1bi5sZW5ndGggPiAwICYmIHJvdyA+IDEpIHtcbiAgICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJ1bi5sZW5ndGgpO1xuICAgICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJ1bltyYW5kb21JbmRleF0ubmVpZ2hib3JzWzNdLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgICAgICAgIHJ1biA9IFtdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlOyAvLyBtYXplIGdlbmVyYXRpb24gZmluaXNoZWRcbn1cbiIsImltcG9ydCBEb21IYW5kbGVyIGZyb20gJy4vZG9taGFuZGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vZGUge1xuICBjb25zdHJ1Y3Rvcihyb3csIGNvbCwgdG90YWxSb3dzLCB0b3RhbENvbHMsIGdyaWQsIG5vZGVTaXplKSB7XG4gICAgdGhpcy5ub2RlV2lkdGggPSBudWxsO1xuICAgIHRoaXMuc2V0Tm9kZVdpZHRoKG5vZGVTaXplKTsgLy8gcHggd2lkdGggYW5kIGhlaWdodCBvZiBzcXVhcmVcbiAgICB0aGlzLnRvdGFsUm93cyA9IHRvdGFsUm93cztcbiAgICB0aGlzLnRvdGFsQ29scyA9IHRvdGFsQ29scztcbiAgICB0aGlzLnJvdyA9IHJvdztcbiAgICB0aGlzLmNvbCA9IGNvbDtcbiAgICB0aGlzLnkgPSB0aGlzLnJvdyAqIHRoaXMubm9kZVdpZHRoO1xuICAgIHRoaXMueCA9IHRoaXMuY29sICogdGhpcy5ub2RlV2lkdGg7XG4gICAgdGhpcy5ub2RlVHlwZSA9ICdlbXB0eSc7IC8vIHVzZWQgdG8gdXBkYXRlIHNxdWFyZSBkaXNwbGF5IG9uIGRvbSBlLmcgc3RhcnQsIGVuZCBvciBiYXJyaWVyXG4gICAgdGhpcy5uZWlnaGJvcnMgPSBbXTtcbiAgICB0aGlzLnByZXZpb3VzTm9kZSA9IG51bGw7XG4gICAgdGhpcy5ncmlkID0gZ3JpZDtcblxuICAgIC8vIGFzdGFyIHNjb3Jlc1xuICAgIHRoaXMuZiA9IDA7XG4gICAgdGhpcy5nID0gMDtcbiAgICB0aGlzLmggPSAwO1xuICB9XG5cbiAgc2V0Tm9kZVdpZHRoKG5vZGVTaXplKSB7XG4gICAgaWYgKG5vZGVTaXplID09PSAnc21hbGwnKSB7XG4gICAgICB0aGlzLm5vZGVXaWR0aCA9IDgwO1xuICAgIH0gZWxzZSBpZiAobm9kZVNpemUgPT09ICdtZWRpdW0nKSB7XG4gICAgICB0aGlzLm5vZGVXaWR0aCA9IDMwO1xuICAgIH0gZWxzZSBpZiAobm9kZVNpemUgPT09ICdsYXJnZScpIHtcbiAgICAgIHRoaXMubm9kZVdpZHRoID0gMTU7XG4gICAgfVxuICB9XG5cbiAgc2V0Tm9kZVR5cGUobmV3Tm9kZVR5cGUpIHtcbiAgICB0aGlzLm5vZGVUeXBlID0gbmV3Tm9kZVR5cGU7XG4gICAgRG9tSGFuZGxlci5kaXNwbGF5QWxnb3JpdGhtKHRoaXMsIHRoaXMuZ3JpZCwgdGhpcy5ub2RlV2lkdGgpO1xuICB9XG5cbiAgLy8gY2FsYyBmLCBnIGFuZCBoIHNjb3Jlc1xuICBjYWxjU2NvcmVzKHN0YXJ0Tm9kZSwgZW5kTm9kZSkge1xuICAgIHRoaXMuZyA9IE1hdGguYWJzKHRoaXMueCAtIHN0YXJ0Tm9kZS54KSArIE1hdGguYWJzKHRoaXMueSAtIHN0YXJ0Tm9kZS55KTtcbiAgICB0aGlzLmggPSBNYXRoLmFicyh0aGlzLnggLSBlbmROb2RlLngpICsgTWF0aC5hYnModGhpcy55IC0gZW5kTm9kZS55KTtcbiAgICB0aGlzLmYgPSB0aGlzLmcgKyB0aGlzLmg7XG4gICAgcmV0dXJuIHRoaXMuZjtcbiAgfVxuXG4gIHNldE5laWdoYm9ycyhncmlkKSB7XG4gICAgY29uc3QgdGVtcFJvdyA9IHRoaXMucm93IC0gMTtcbiAgICBjb25zdCB0ZW1wQ29sID0gdGhpcy5jb2wgLSAxO1xuXG4gICAgaWYgKHRlbXBDb2wgPCB0aGlzLnRvdGFsQ29scyAtIDEpIHtcbiAgICAgIC8vIHJpZ2h0XG4gICAgICB0aGlzLm5laWdoYm9ycy5wdXNoKGdyaWRbdGVtcFJvd11bdGVtcENvbCArIDFdKTtcbiAgICB9XG5cbiAgICBpZiAodGVtcENvbCA+IDApIHtcbiAgICAgIC8vIGxlZnRcbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93XVt0ZW1wQ29sIC0gMV0pO1xuICAgIH1cblxuICAgIGlmICh0ZW1wUm93IDwgdGhpcy50b3RhbFJvd3MgLSAxKSB7XG4gICAgICAvLyBkb3duXG4gICAgICB0aGlzLm5laWdoYm9ycy5wdXNoKGdyaWRbdGVtcFJvdyArIDFdW3RlbXBDb2xdKTtcbiAgICB9XG5cbiAgICBpZiAodGVtcFJvdyA+IDApIHtcbiAgICAgIC8vIHVwXG4gICAgICB0aGlzLm5laWdoYm9ycy5wdXNoKGdyaWRbdGVtcFJvdyAtIDFdW3RlbXBDb2xdKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL3Njc3MvbWFpbi5zY3NzJztcbmltcG9ydCBsb2FkIGZyb20gJy4vbWFpbmhhbmRsZXInO1xuXG5sb2FkKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
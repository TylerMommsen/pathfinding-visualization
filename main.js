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

/***/ "./src/algorithmfactory.js":
/*!*********************************!*\
  !*** ./src/algorithmfactory.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _algorithms_bidirectional__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./algorithms/bidirectional */ "./src/algorithms/bidirectional.js");
/* harmony import */ var _algorithms_astar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./algorithms/astar */ "./src/algorithms/astar.js");
/* harmony import */ var _algorithms_dijkstra__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./algorithms/dijkstra */ "./src/algorithms/dijkstra.js");




class AlgorithmFactory {
  static createAlgorithm(algorithmName) {
    // Map algorithm names to their corresponding implementations
    const algorithms = {
      'A*': _algorithms_astar__WEBPACK_IMPORTED_MODULE_1__["default"],
      Dijkstra: _algorithms_dijkstra__WEBPACK_IMPORTED_MODULE_2__["default"],
      Bidirectional: _algorithms_bidirectional__WEBPACK_IMPORTED_MODULE_0__["default"],
    };

    const AlgorithmClass = algorithms[algorithmName];

    if (!AlgorithmClass) {
      throw new Error(`Algorithm "${algorithmName}" not found`);
    }

    return AlgorithmClass;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AlgorithmFactory);


/***/ }),

/***/ "./src/algorithms/astar.js":
/*!*********************************!*\
  !*** ./src/algorithms/astar.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ runAstar)
/* harmony export */ });
function runAstar(startNode, endNode, delay) {
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
      if (path[i].nodeType !== 'start' && path[i].nodeType !== 'end') {
        await new Promise((resolve) => setTimeout(resolve, 30));
        path[i].setNodeType('final-path', delay);
      }
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
      await displayFinalPath(finalPath);
      return true;
    }

    closedList.push(currentNode);
    if (currentNode.nodeType !== 'start' && currentNode.nodeType !== 'end') {
      currentNode.setNodeType('closed-list', delay);
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
            currNeighbor.setNodeType('open-list', delay);
          }
        }

        currNeighbor.previousNode = currentNode;
      }
    }

    if (openList.length > 0) {
      return algorithm();
    }
    return null;
  }

  return algorithm();
}


/***/ }),

/***/ "./src/algorithms/bidirectional.js":
/*!*****************************************!*\
  !*** ./src/algorithms/bidirectional.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ runBidirectional)
/* harmony export */ });
async function runBidirectional(startNode, endNode, delay) {
  const visitedForwards = new Set();
  const visitedBackwards = new Set();

  const queueForwards = [];
  const queueBackwards = [];

  async function displayFinalPath(backwardNode, forwardNode) {
    let pathForward = [];
    const pathBackward = [];

    let node = backwardNode;
    pathBackward.push(node);
    while (node.previousNode) {
      pathBackward.push(node.previousNode);
      node = node.previousNode;
    }

    let node2 = forwardNode;
    pathForward.push(node2);
    while (node2.previousNode) {
      pathForward.push(node2.previousNode);
      node2 = node2.previousNode;
    }

    const temp = [];
    for (let i = pathForward.length - 1; i >= 0; i--) {
      temp.push(pathForward[i]);
    }
    pathForward = temp;

    const finalPath = pathForward.concat(pathBackward);

    for (let i = 0; i < finalPath.length; i++) {
      if (finalPath[i].nodeType !== 'start' && finalPath[i].nodeType !== 'end') {
        await new Promise((resolve) => setTimeout(resolve, 30));
        finalPath[i].setNodeType('final-path', delay);
      }
    }
  }

  queueForwards.push(startNode);
  queueBackwards.push(endNode);
  visitedForwards.add(startNode);
  visitedBackwards.add(endNode);

  while (queueForwards.length > 0 && queueBackwards.length > 0) {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // forwards
    const currNodeForward = queueForwards.shift();

    if (currNodeForward !== startNode) {
      currNodeForward.setNodeType('closed-list', delay);
    }
    const neighborsForward = currNodeForward.neighbors;
    let currNeighborForward = null;

    for (let i = 0; i < neighborsForward.length; i++) {
      currNeighborForward = neighborsForward[i];
      if (visitedBackwards.has(currNeighborForward)) {
        displayFinalPath(currNeighborForward, currNodeForward);
        return true;
      }

      if (!visitedForwards.has(currNeighborForward) && !queueForwards.includes(currNeighborForward) && currNeighborForward.nodeType !== 'barrier') {
        queueForwards.push(currNeighborForward);
        currNeighborForward.previousNode = currNodeForward;
        currNeighborForward.setNodeType('open-list', delay);
        visitedForwards.add(currNeighborForward);
      }
    }

    // backwards
    const currNodeBackward = queueBackwards.shift();

    if (currNodeBackward !== endNode) {
      currNodeBackward.setNodeType('closed-list', delay);
    }
    const neighborsBackward = currNodeBackward.neighbors;
    let currNeighborBackward = null;

    for (let i = 0; i < neighborsBackward.length; i++) {
      currNeighborBackward = neighborsBackward[i];
      if (visitedForwards.has(currNeighborBackward)) {
        displayFinalPath(currNodeBackward, currNeighborBackward);
        return true;
      }

      if (
        !visitedBackwards.has(currNeighborBackward)
        && !queueBackwards.includes(currNeighborBackward)
        && currNeighborBackward.nodeType !== 'barrier'
      ) {
        queueBackwards.push(currNeighborBackward);
        currNeighborBackward.previousNode = currNodeBackward;
        currNeighborBackward.setNodeType('open-list', delay);
        visitedBackwards.add(currNeighborBackward);
      }
    }
  }

  return false;
}


/***/ }),

/***/ "./src/algorithms/dijkstra.js":
/*!************************************!*\
  !*** ./src/algorithms/dijkstra.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ runDijkstra)
/* harmony export */ });
async function runDijkstra(startNode, endNode, delay) {
  const openListQueue = []; // tracks nodes to visit
  const closedList = [];
  const finalPath = [];

  async function displayFinalPath(path) {
    for (let i = path.length - 1; i >= 0; i--) {
      if (path[i].nodeType !== 'start' && path[i].nodeType !== 'end') {
        await new Promise((resolve) => setTimeout(resolve, 30));
        path[i].setNodeType('final-path', delay);
      }
    }
  }

  startNode.g = 0;
  openListQueue.push(startNode);

  async function algorithm() {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    const currentNode = openListQueue.shift();
    if (currentNode.nodeType !== 'start' && currentNode.nodeType !== 'end') {
      currentNode.setNodeType('closed-list', delay);
    }

    if (currentNode === endNode) {
      let temp = currentNode;
      finalPath.push(temp);
      while (temp.previousNode) {
        finalPath.push(temp.previousNode);
        temp = temp.previousNode;
      }
      await displayFinalPath(finalPath);
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
            currNeighbor.setNodeType('open-list', delay);
          }
        }
      }
    }

    if (openListQueue.length > 0) {
      return algorithm();
    }

    return false;
  }

  return algorithm();
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
// update square display
function displayNode(node, currNodeType, newNodeType, grid, delay) {
  const domSquare = grid.findDomSquare(node.row - 1, node.col - 1);

  if (delay !== 0) {
    domSquare.classList.remove('animated');
    // eslint-disable-next-line no-unused-expressions
    domSquare.offsetWidth;
    if (newNodeType !== 'closed-list') {
      domSquare.classList.add('animated');
    }
  }

  domSquare.classList.toggle(currNodeType, false);
  domSquare.classList.toggle(newNodeType, true);
}

// fill grid completely with barriers
function fillGrid(grid, squareSize) {
  const gridContainer = document.querySelector('.grid-container');
  gridContainer.innerHTML = '';

  // Create a document fragment to batch the updates
  const fragment = document.createDocumentFragment();

  gridContainer.removeAttribute('class');
  gridContainer.classList.add('grid-container');
  gridContainer.classList.add(`${squareSize}-grid`);

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const gridSquare = document.createElement('div');
      gridSquare.classList.add('grid-square');
      gridSquare.classList.add('barrier');
      gridSquare.classList.add(`${squareSize}`);

      fragment.appendChild(gridSquare);
    }
  }

  // Append the entire fragment to the container at once
  gridContainer.appendChild(fragment);
}

// display full grid
function createGrid(grid, squareSize) {
  const gridContainer = document.querySelector('.grid-container');
  gridContainer.innerHTML = '';

  // Create a document fragment to batch the updates
  const fragment = document.createDocumentFragment();

  gridContainer.removeAttribute('class');
  gridContainer.classList.add('grid-container');
  gridContainer.classList.add(`${squareSize}-grid`);

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const gridSquare = document.createElement('div');
      gridSquare.classList.add('grid-square');
      gridSquare.classList.add('empty');
      gridSquare.classList.add(`${squareSize}`);

      fragment.appendChild(gridSquare);
    }
  }

  // Append the entire fragment to the container at once
  gridContainer.appendChild(fragment);
}

const DomHandler = {
  createGrid,
  fillGrid,
  displayNode,
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
  constructor(rows, cols, nodeWidth, currentlyRunning) {
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
    this.currentlyRunning = currentlyRunning; // is an algorithm running?

    this.isDragging = false;
    this.eraseModeOn = false;
  }

  // update square node type and update corresponding dom square
  setSquareStatus(row, col) {
    const currentNode = this.grid[row][col];
    if (this.eraseModeOn) {
      if (currentNode === this.start.node) this.start.node = null;
      if (currentNode === this.end.node) this.end.node = null;
      currentNode.setNodeType('empty');
      return;
    }

    if (currentNode.nodeType !== 'empty') return;

    if (this.start.node === null) {
      currentNode.setNodeType('start');
      this.start.node = currentNode;
    } else if (this.end.node === null) {
      currentNode.setNodeType('end');
      this.end.node = currentNode;
    } else {
      currentNode.setNodeType('barrier');
    }
  }

  handleMouseDown(row, col) {
    this.isDragging = true;
    this.setSquareStatus(row, col);
  }

  handleMouseMove(row, col) {
    if (this.isDragging) {
      this.setSquareStatus(row, col);
    }
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  // find square in the dom
  findDomSquare(row, col) {
    const gridContainer = document.querySelector('.grid-container');
    const gridContainerChildren = gridContainer.children;
    const index = row * this.cols + col;
    return gridContainerChildren[index];
  }

  addListeners() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const gridSquare = this.findDomSquare(row, col);
        gridSquare.addEventListener('mousedown', () => {
          if (this.currentlyRunning[0]) return;
          this.handleMouseDown(row, col);
        });
        gridSquare.addEventListener('mousemove', () => {
          if (this.currentlyRunning[0]) return;
          this.handleMouseMove(row, col);
        });
      }
    }

    document.addEventListener('mouseup', () => {
      this.handleMouseUp();
    });
  }

  // used to create grid of empty or barrier squares
  createGrid(rows, cols) {
    for (let row = 1; row <= rows; row++) {
      const currentRow = [];
      for (let col = 1; col <= cols; col++) {
        currentRow.push(new _node__WEBPACK_IMPORTED_MODULE_0__["default"](row, col, this.rows, this.cols, this, this.nodeWidth));
      }
      this.grid.push(currentRow);
    }
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].createGrid(this.grid, this.nodeWidth);
  }

  // fill grid as barriers
  fillGrid() {
    this.grid = [];
    for (let row = 1; row <= this.rows; row++) {
      const currentRow = [];
      for (let col = 1; col <= this.cols; col++) {
        const node = new _node__WEBPACK_IMPORTED_MODULE_0__["default"](row, col, this.rows, this.cols, this, this.nodeWidth);
        node.nodeType = 'barrier';
        currentRow.push(node);
      }
      this.grid.push(currentRow);
    }

    this.setAllNodeNeighbors();

    this.start.node = null;
    this.end.node = null;

    // reseting dom squares
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].fillGrid(this.grid, this.nodeWidth);
    this.addListeners();
  }

  // update neighbors for every single node in grid
  setAllNodeNeighbors() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        this.grid[row][col].neighbors = [];
        this.grid[row][col].setNeighbors(this.grid);
      }
    }
  }

  // reset grid and all nodes completely
  resetGrid() {
    this.grid = [];
    for (let row = 1; row <= this.rows; row++) {
      const currentRow = [];
      for (let col = 1; col <= this.cols; col++) {
        currentRow.push(new _node__WEBPACK_IMPORTED_MODULE_0__["default"](row, col, this.rows, this.cols, this, this.nodeWidth));
      }
      this.grid.push(currentRow);
    }

    this.setAllNodeNeighbors();

    this.start.node = null;
    this.end.node = null;

    // reseting dom squares
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].createGrid(this.grid, this.nodeWidth);
    this.addListeners();
  }

  // reset algorithm display on grid e.g final path, open-list and closed-list
  resetPath() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const currNode = this.grid[row][col];
        const currType = currNode.nodeType;
        if (currType === 'open-list' || currType === 'closed-list' || currType === 'final-path') {
          currNode.setNodeType('empty', 0);
          currNode.previousNode = null;
        }
      }
    }
  }

  updateGridSize(rows, cols, nodeWidth) {
    this.rows = rows;
    this.cols = cols;
    this.nodeWidth = nodeWidth;
  }

  setEraseMode() {
    this.eraseModeOn = !this.eraseModeOn;
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
/* harmony import */ var _algorithmfactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./algorithmfactory */ "./src/algorithmfactory.js");
/* harmony import */ var _mazefactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mazefactory */ "./src/mazefactory.js");




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
  gridObj = new _grid__WEBPACK_IMPORTED_MODULE_0__["default"](gridSizes.medium.rows, gridSizes.medium.cols, gridSize, running);
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

  const algorithm = _algorithmfactory__WEBPACK_IMPORTED_MODULE_1__["default"].createAlgorithm(pathFindingAlgorithm);
  await algorithm(startNode, endNode, pathfindingSpeed);

  running[0] = false;
}

// run maze generation algorithm
async function generateMaze(mazeGenerationAlgorithm) {
  if (running[0] || mazeGenerationAlgorithm === null) return;
  running[0] = true;
  gridObj.resetGrid();

  const maze = _mazefactory__WEBPACK_IMPORTED_MODULE_2__["default"].createMaze(mazeGenerationAlgorithm);
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

function load() {
  loadGrid();
  addListenersToGrid();
  document.addEventListener('DOMContentLoaded', () => {
    addListenersToBtns();
  });
}


/***/ }),

/***/ "./src/mazefactory.js":
/*!****************************!*\
  !*** ./src/mazefactory.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mazes_recursivedivision__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mazes/recursivedivision */ "./src/mazes/recursivedivision.js");
/* harmony import */ var _mazes_binarytree__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mazes/binarytree */ "./src/mazes/binarytree.js");
/* harmony import */ var _mazes_sidewinder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mazes/sidewinder */ "./src/mazes/sidewinder.js");
/* harmony import */ var _mazes_prims__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mazes/prims */ "./src/mazes/prims.js");
/* harmony import */ var _mazes_huntandkill__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mazes/huntandkill */ "./src/mazes/huntandkill.js");
/* harmony import */ var _mazes_randommap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mazes/randommap */ "./src/mazes/randommap.js");







class MazeFactory {
  static createMaze(mazeAlgorithm) {
    // Map algorithm names to their corresponding implementations
    const algorithms = {
      'Recursive Division': _mazes_recursivedivision__WEBPACK_IMPORTED_MODULE_0__["default"],
      'Binary Tree': _mazes_binarytree__WEBPACK_IMPORTED_MODULE_1__["default"],
      Sidewinder: _mazes_sidewinder__WEBPACK_IMPORTED_MODULE_2__["default"],
      "Prim's": _mazes_prims__WEBPACK_IMPORTED_MODULE_3__["default"],
      'Hunt & Kill': _mazes_huntandkill__WEBPACK_IMPORTED_MODULE_4__["default"],
      'Random Map': _mazes_randommap__WEBPACK_IMPORTED_MODULE_5__["default"],
    };

    const AlgorithmClass = algorithms[mazeAlgorithm];

    if (!AlgorithmClass) {
      throw new Error(`Algorithm "${mazeAlgorithm}" not found`);
    }

    return AlgorithmClass;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MazeFactory);


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
async function binaryTree(gridObj, delay) {
  // fill grid with barriers
  gridObj.fillGrid();

  const grid = gridObj.grid;
  const rows = grid.length;
  const cols = grid[0].length;

  function connect(node1, node2, barrierBetween) {
    node1.setNodeType('empty', delay);
    node2.setNodeType('empty', delay);
    barrierBetween.setNodeType('empty', delay);
  }

  for (let row = 1; row < rows; row += 2) {
    for (let col = 1; col < cols; col += 2) {
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
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
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
async function generateHuntAndKill(gridObj, delay) {
  // set the entire grid as barriers
  gridObj.fillGrid();

  const grid = gridObj.grid;
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = [];

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
        randomFirstNode.setNodeType('empty', delay);
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
        wallBetween.setNodeType('empty', delay);
      }
    }
    if (row < rows - 2) {
      if (grid[row + 2][col] === nextNode) {
        const wallBetween = grid[row + 1][col];
        wallBetween.setNodeType('empty', delay);
      }
    }
    if (col > 1) {
      if (grid[row][col - 2] === nextNode) {
        const wallBetween = grid[row][col - 1];
        wallBetween.setNodeType('empty', delay);
      }
    }
    if (col < cols - 2) {
      if (grid[row][col + 2] === nextNode) {
        const wallBetween = grid[row][col + 1];
        wallBetween.setNodeType('empty', delay);
      }
    }

    currNode.setNodeType('empty', delay);
    nextNode.setNodeType('empty', delay);
  }

  async function algorithm() {
    let currentNode = generateStartPoint(); // get start node

    while (currentNode) {
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      visited.push(currentNode);
      const neighbors = getUnvisitedNeighbors(currentNode);

      if (neighbors.length > 0) {
        const nextNode = randomlySelectNeighbor(neighbors);
        removeWallBetween(currentNode, nextNode);
        currentNode = nextNode;
      } else {
        currentNode = null;

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
async function generatePrims(gridObj, delay) {
  // set the entire grid as barriers
  gridObj.fillGrid();

  const grid = gridObj.grid;
  const rows = grid.length;
  const cols = grid[0].length;
  const frontier = [];
  const visited = new Set();

  // add neighbors - directly adjacent neighbors are skipped so they can be walls if needed
  function getNeighbors(node) {
    const neighbors = [];
    const row = node.row - 1;
    const col = node.col - 1;

    if (row > 1) neighbors.push(grid[row - 2][col]); // up

    if (row < rows - 2) neighbors.push(grid[row + 2][col]); // down

    if (col > 1) neighbors.push(grid[row][col - 2]); // left

    if (col < cols - 2) neighbors.push(grid[row][col + 2]); // right

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
    node1.setNodeType('empty', delay);
    node2.setNodeType('empty', delay);
    wallBetween.setNodeType('empty', delay);
  }

  // choose a random point on the grid to start with
  let randomFirstNode = null;
  while (randomFirstNode === null) {
    const randomRow = Math.floor(Math.random() * (rows - 4)) + 2;
    const randomCol = Math.floor(Math.random() * (cols - 4)) + 2;
    if (randomRow % 2 !== 0 && randomCol % 2 !== 0) {
      randomFirstNode = grid[randomRow][randomCol];
      randomFirstNode.setNodeType('empty', delay);
      visited.add(randomFirstNode);
    }
  }

  const startNodeNeighbors = getNeighbors(randomFirstNode);
  startNodeNeighbors.forEach((node) => {
    if (node) {
      frontier.push(node);
    }
  });

  while (frontier.length > 0) {
    const randomIndex = Math.floor(Math.random() * frontier.length);
    const randomFrontierNode = frontier[randomIndex];
    const frontierNeighbors = getNeighbors(randomFrontierNode);

    // find out which 'in' nodes (part of maze) are adjacent
    const adjacentIns = [];
    for (let i = 0; i < frontierNeighbors.length; i++) {
      if (visited.has(frontierNeighbors[i])) {
        adjacentIns.push(frontierNeighbors[i]);
      }
    }

    // choose a random adjacent node and connect that with the frontier node
    const randomAdjacentIn = adjacentIns[Math.floor(Math.random() * adjacentIns.length)];
    for (let i = 0; i < adjacentIns.length; i++) {
      if (adjacentIns[i] === randomAdjacentIn) {
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        const wallBetween = getWallBetween(randomFrontierNode, randomAdjacentIn);
        const indexToSplice = frontier.indexOf(randomFrontierNode);
        connect(randomFrontierNode, randomAdjacentIn, wallBetween);
        visited.add(randomFrontierNode);
        frontier.splice(indexToSplice, 1);
      }
    }

    // get the neighbors of the frontier node and add them to frontier list
    const neighborsToAdd = getNeighbors(randomFrontierNode);
    for (let i = 0; i < neighborsToAdd.length; i++) {
      if (neighborsToAdd[i]) {
        if (!visited.has(neighborsToAdd[i]) && !frontier.includes(neighborsToAdd[i])) {
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
async function randomMap(gridObj, delay) {
  const grid = gridObj.grid;
  const rows = grid.length;
  const cols = grid[0].length;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const random = Math.random();
      if (random < 0.3) {
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        grid[row][col].setNodeType('barrier', delay);
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
async function recursiveDivision(gridObj, delay) {
  const grid = gridObj.grid;
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

  // choose to place wall vertically or horizontally
  function chooseOrientation(startRow, endRow, startCol, endCol) {
    const width = endCol - startCol;
    const height = endRow - startRow;
    if (width > height) return 'vertical';
    if (width < height) return 'horizontal';
    if (width === height) {
      const random = Math.floor(Math.random() * 2);
      return random === 0 ? 'horizontal' : 'vertical';
    }
    return null;
  }

  // set edges of grid as barriers
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1) {
        grid[row][col].setNodeType('barrier', 0);
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
          grid[wallRow][col].setNodeType('barrier', delay);
        }
      }
    } else if (orientation === 'vertical') {
      // make a vertical wall
      for (let row = startRow; row <= endRow; row++) {
        if (row !== passageRow) {
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
          grid[row][wallCol].setNodeType('barrier', delay);
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
async function sidewinder(gridObj, delay) {
  gridObj.fillGrid(); // set the grid as walls

  const grid = gridObj.grid;
  const rows = grid.length;
  const cols = grid[0].length;

  // leave first row empty
  for (let col = 0; col < cols; col++) {
    if (col !== 0 && col !== cols - 1) {
      grid[1][col].setNodeType('empty', delay);
    }
  }

  for (let row = 1; row < rows; row += 2) {
    let run = [];
    for (let col = 1; col < cols; col += 2) {
      const currentNode = grid[row][col];
      currentNode.setNodeType('empty', delay);
      run.push(currentNode);

      if (Math.random() < 0.6 && col !== cols - 2) {
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        currentNode.neighbors[0].setNodeType('empty', delay);
      } else if (run.length > 0 && row > 1) {
        const randomIndex = Math.floor(Math.random() * run.length);
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        run[randomIndex].neighbors[3].setNodeType('empty', delay);
        run = [];
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
    this.nodeSize = null; // holds px value of node width and height
    this.setNodeWidth(nodeSize);
    this.totalRows = totalRows;
    this.totalCols = totalCols;
    this.row = row;
    this.col = col;
    this.y = this.row * this.nodeSize;
    this.x = this.col * this.nodeSize;
    this.nodeType = 'empty'; // used to update square display on dom e.g start, end or barrier
    this.neighbors = [];
    this.previousNode = null;
    this.grid = grid;

    // used for Astar and Dijsktra
    this.f = 0;
    this.g = 0;
    this.h = 0;
  }

  // adjust size of node in px
  setNodeWidth(nodeSize) {
    if (nodeSize === 'small') {
      this.nodeSize = 50;
    } else if (nodeSize === 'medium') {
      this.nodeSize = 30;
    } else if (nodeSize === 'large') {
      this.nodeSize = 20;
    }
  }

  // change node type e.g barrier, start, end, open-list, closed-list
  setNodeType(newNodeType, delay) {
    _domhandler__WEBPACK_IMPORTED_MODULE_0__["default"].displayNode(this, this.nodeType, newNodeType, this.grid, delay);
    this.nodeType = newNodeType;
  }

  // calc f, g and h scores
  calcScores(startNode, endNode) {
    this.g = Math.abs(this.x - startNode.x) + Math.abs(this.y - startNode.y);
    this.h = Math.abs(this.x - endNode.x) + Math.abs(this.y - endNode.y);
    this.f = this.g + this.h;
    return this.f;
  }

  // set neighbors for current node (no diagonals)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBMEQ7QUFDaEI7QUFDTTs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLHlEQUFRO0FBQ3BCLGdCQUFnQiw0REFBVztBQUMzQixxQkFBcUIsaUVBQWdCO0FBQ3JDOztBQUVBOztBQUVBO0FBQ0Esb0NBQW9DLGNBQWM7QUFDbEQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlFQUFlLGdCQUFnQixFQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN2QmpCO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLHFCQUFxQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLFFBQVE7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixxQkFBcUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLGtDQUFrQztBQUN0RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ25GZTtBQUNmO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlDQUF5QyxRQUFRO0FBQ2pEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLDZCQUE2QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsOEJBQThCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3pHZTtBQUNmLDRCQUE0QjtBQUM1QjtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLFFBQVE7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0Isa0NBQWtDO0FBQ3REOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDNURBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQ0FBaUMsV0FBVzs7QUFFNUMsb0JBQW9CLG1CQUFtQjtBQUN2QyxzQkFBc0Isd0JBQXdCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxXQUFXOztBQUU3QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlDQUFpQyxXQUFXOztBQUU1QyxvQkFBb0IsbUJBQW1CO0FBQ3ZDLHNCQUFzQix3QkFBd0I7QUFDOUM7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLFdBQVc7O0FBRTdDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxVQUFVLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0VBO0FBQ1k7O0FBRXZCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7O0FBRTlDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLGlCQUFpQjtBQUN2Qyx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQixhQUFhO0FBQ25DO0FBQ0Esd0JBQXdCLGFBQWE7QUFDckMsNEJBQTRCLDZDQUFJO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBLElBQUksbURBQVU7QUFDZDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isa0JBQWtCO0FBQ3hDO0FBQ0Esd0JBQXdCLGtCQUFrQjtBQUMxQyx5QkFBeUIsNkNBQUk7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSxtREFBVTtBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQix3QkFBd0I7QUFDOUMsd0JBQXdCLDZCQUE2QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixrQkFBa0I7QUFDeEM7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDLDRCQUE0Qiw2Q0FBSTtBQUNoQztBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLElBQUksbURBQVU7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0IsaUJBQWlCO0FBQ3ZDLHdCQUF3QixpQkFBaUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hMMEI7QUFDd0I7QUFDVjs7QUFFeEM7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsb0JBQW9CO0FBQy9CLFlBQVksb0JBQW9CO0FBQ2hDLFdBQVcsb0JBQW9CO0FBQy9COztBQUVBO0FBQ0E7QUFDQSxVQUFVLG1DQUFtQztBQUM3QyxZQUFZLGtDQUFrQztBQUM5QyxVQUFVLGdDQUFnQztBQUMxQztBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVLG1DQUFtQztBQUM3QyxZQUFZLGlDQUFpQztBQUM3QyxVQUFVLGtDQUFrQztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsNkNBQUk7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHNCQUFzQiwyQkFBMkI7QUFDakQsd0JBQXdCLDhCQUE4QjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQix5REFBZ0I7QUFDcEM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWUsb0RBQVc7QUFDMUI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsaUJBQWlCO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCxpQkFBaUI7QUFDOUU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsaUJBQWlCO0FBQy9EO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNVQwRDtBQUNkO0FBQ0E7QUFDRjtBQUNZO0FBQ1o7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLGdFQUFpQjtBQUM3QyxxQkFBcUIseURBQVU7QUFDL0Isa0JBQWtCLHlEQUFVO0FBQzVCLGdCQUFnQixvREFBYTtBQUM3QixxQkFBcUIsMERBQW1CO0FBQ3hDLG9CQUFvQix3REFBUztBQUM3Qjs7QUFFQTs7QUFFQTtBQUNBLG9DQUFvQyxjQUFjO0FBQ2xEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxXQUFXLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQzdCWjtBQUNmO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLFlBQVk7QUFDaEMsc0JBQXNCLFlBQVk7QUFDbEM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNENBQTRDO0FBQzVDLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0EsMkNBQTJDO0FBQzNDLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjs7Ozs7Ozs7Ozs7Ozs7O0FDdkRlO0FBQ2Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRDQUE0Qzs7QUFFNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBLDBCQUEwQixnQkFBZ0I7QUFDMUMsNEJBQTRCLGdCQUFn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O0FBRUE7QUFDQTtBQUNBLElBQUksbURBQVU7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQ3pFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ04wQjtBQUNPOztBQUVqQyx3REFBSSIsInNvdXJjZXMiOlsid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvc2Nzcy9tYWluLnNjc3MiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9hbGdvcml0aG1mYWN0b3J5LmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvYWxnb3JpdGhtcy9hc3Rhci5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2FsZ29yaXRobXMvYmlkaXJlY3Rpb25hbC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2FsZ29yaXRobXMvZGlqa3N0cmEuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9kb21oYW5kbGVyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvZ3JpZC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21haW5oYW5kbGVyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZWZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9iaW5hcnl0cmVlLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvaHVudGFuZGtpbGwuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9wcmltcy5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL3JhbmRvbW1hcC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL3JlY3Vyc2l2ZWRpdmlzaW9uLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvc2lkZXdpbmRlci5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IHJ1bkJpZGlyZWN0aW9uYWwgZnJvbSAnLi9hbGdvcml0aG1zL2JpZGlyZWN0aW9uYWwnO1xuaW1wb3J0IHJ1bkFzdGFyIGZyb20gJy4vYWxnb3JpdGhtcy9hc3Rhcic7XG5pbXBvcnQgcnVuRGlqa3N0cmEgZnJvbSAnLi9hbGdvcml0aG1zL2RpamtzdHJhJztcblxuY2xhc3MgQWxnb3JpdGhtRmFjdG9yeSB7XG4gIHN0YXRpYyBjcmVhdGVBbGdvcml0aG0oYWxnb3JpdGhtTmFtZSkge1xuICAgIC8vIE1hcCBhbGdvcml0aG0gbmFtZXMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBpbXBsZW1lbnRhdGlvbnNcbiAgICBjb25zdCBhbGdvcml0aG1zID0ge1xuICAgICAgJ0EqJzogcnVuQXN0YXIsXG4gICAgICBEaWprc3RyYTogcnVuRGlqa3N0cmEsXG4gICAgICBCaWRpcmVjdGlvbmFsOiBydW5CaWRpcmVjdGlvbmFsLFxuICAgIH07XG5cbiAgICBjb25zdCBBbGdvcml0aG1DbGFzcyA9IGFsZ29yaXRobXNbYWxnb3JpdGhtTmFtZV07XG5cbiAgICBpZiAoIUFsZ29yaXRobUNsYXNzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFsZ29yaXRobSBcIiR7YWxnb3JpdGhtTmFtZX1cIiBub3QgZm91bmRgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gQWxnb3JpdGhtQ2xhc3M7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWxnb3JpdGhtRmFjdG9yeTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJ1bkFzdGFyKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgZGVsYXkpIHtcbiAgY29uc3Qgb3Blbkxpc3QgPSBbXTtcbiAgY29uc3QgY2xvc2VkTGlzdCA9IFtdO1xuICBjb25zdCBmaW5hbFBhdGggPSBbXTtcblxuICBmdW5jdGlvbiByZW1vdmVGcm9tQXJyKG5vZGUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wZW5MaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob3Blbkxpc3RbaV0gPT09IG5vZGUpIHtcbiAgICAgICAgb3Blbkxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGRpc3BsYXlGaW5hbFBhdGgocGF0aCkge1xuICAgIGZvciAobGV0IGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAocGF0aFtpXS5ub2RlVHlwZSAhPT0gJ3N0YXJ0JyAmJiBwYXRoW2ldLm5vZGVUeXBlICE9PSAnZW5kJykge1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMCkpO1xuICAgICAgICBwYXRoW2ldLnNldE5vZGVUeXBlKCdmaW5hbC1wYXRoJywgZGVsYXkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9wZW5MaXN0LnB1c2goc3RhcnROb2RlKTtcblxuICBhc3luYyBmdW5jdGlvbiBhbGdvcml0aG0oKSB7XG4gICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICB9XG4gICAgbGV0IGN1cnJlbnROb2RlID0gbnVsbDtcbiAgICBsZXQgbG93ZXN0RiA9IEluZmluaXR5O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3Blbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9wZW5MaXN0W2ldLmNhbGNTY29yZXMoc3RhcnROb2RlLCBlbmROb2RlKTtcbiAgICAgIGlmIChvcGVuTGlzdFtpXS5mIDwgbG93ZXN0Rikge1xuICAgICAgICBsb3dlc3RGID0gb3Blbkxpc3RbaV0uZjtcbiAgICAgICAgY3VycmVudE5vZGUgPSBvcGVuTGlzdFtpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY3VycmVudE5vZGUgPT09IGVuZE5vZGUpIHtcbiAgICAgIGxldCB0ZW1wID0gY3VycmVudE5vZGU7XG4gICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wKTtcbiAgICAgIHdoaWxlICh0ZW1wLnByZXZpb3VzTm9kZSkge1xuICAgICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wLnByZXZpb3VzTm9kZSk7XG4gICAgICAgIHRlbXAgPSB0ZW1wLnByZXZpb3VzTm9kZTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IGRpc3BsYXlGaW5hbFBhdGgoZmluYWxQYXRoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNsb3NlZExpc3QucHVzaChjdXJyZW50Tm9kZSk7XG4gICAgaWYgKGN1cnJlbnROb2RlLm5vZGVUeXBlICE9PSAnc3RhcnQnICYmIGN1cnJlbnROb2RlLm5vZGVUeXBlICE9PSAnZW5kJykge1xuICAgICAgY3VycmVudE5vZGUuc2V0Tm9kZVR5cGUoJ2Nsb3NlZC1saXN0JywgZGVsYXkpO1xuICAgIH1cbiAgICByZW1vdmVGcm9tQXJyKGN1cnJlbnROb2RlKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudE5vZGUubmVpZ2hib3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjdXJyTmVpZ2hib3IgPSBjdXJyZW50Tm9kZS5uZWlnaGJvcnNbaV07XG5cbiAgICAgIGlmIChjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdiYXJyaWVyJyAmJiAhY2xvc2VkTGlzdC5pbmNsdWRlcyhjdXJyTmVpZ2hib3IpKSB7XG4gICAgICAgIGNvbnN0IHRlbXBHID0gY3VycmVudE5vZGUuZyArIDE7XG4gICAgICAgIGlmIChvcGVuTGlzdC5pbmNsdWRlcyhjdXJyTmVpZ2hib3IpKSB7XG4gICAgICAgICAgaWYgKHRlbXBHIDwgY3Vyck5laWdoYm9yLmcpIHtcbiAgICAgICAgICAgIGN1cnJOZWlnaGJvci5nID0gdGVtcEc7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1cnJOZWlnaGJvci5nID0gdGVtcEc7XG4gICAgICAgICAgb3Blbkxpc3QucHVzaChjdXJyTmVpZ2hib3IpO1xuICAgICAgICAgIGlmIChjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgY3Vyck5laWdoYm9yLm5vZGVUeXBlICE9PSAnZW5kJykge1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLnNldE5vZGVUeXBlKCdvcGVuLWxpc3QnLCBkZWxheSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY3Vyck5laWdoYm9yLnByZXZpb3VzTm9kZSA9IGN1cnJlbnROb2RlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcGVuTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gYWxnb3JpdGhtKCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGFsZ29yaXRobSgpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcnVuQmlkaXJlY3Rpb25hbChzdGFydE5vZGUsIGVuZE5vZGUsIGRlbGF5KSB7XG4gIGNvbnN0IHZpc2l0ZWRGb3J3YXJkcyA9IG5ldyBTZXQoKTtcbiAgY29uc3QgdmlzaXRlZEJhY2t3YXJkcyA9IG5ldyBTZXQoKTtcblxuICBjb25zdCBxdWV1ZUZvcndhcmRzID0gW107XG4gIGNvbnN0IHF1ZXVlQmFja3dhcmRzID0gW107XG5cbiAgYXN5bmMgZnVuY3Rpb24gZGlzcGxheUZpbmFsUGF0aChiYWNrd2FyZE5vZGUsIGZvcndhcmROb2RlKSB7XG4gICAgbGV0IHBhdGhGb3J3YXJkID0gW107XG4gICAgY29uc3QgcGF0aEJhY2t3YXJkID0gW107XG5cbiAgICBsZXQgbm9kZSA9IGJhY2t3YXJkTm9kZTtcbiAgICBwYXRoQmFja3dhcmQucHVzaChub2RlKTtcbiAgICB3aGlsZSAobm9kZS5wcmV2aW91c05vZGUpIHtcbiAgICAgIHBhdGhCYWNrd2FyZC5wdXNoKG5vZGUucHJldmlvdXNOb2RlKTtcbiAgICAgIG5vZGUgPSBub2RlLnByZXZpb3VzTm9kZTtcbiAgICB9XG5cbiAgICBsZXQgbm9kZTIgPSBmb3J3YXJkTm9kZTtcbiAgICBwYXRoRm9yd2FyZC5wdXNoKG5vZGUyKTtcbiAgICB3aGlsZSAobm9kZTIucHJldmlvdXNOb2RlKSB7XG4gICAgICBwYXRoRm9yd2FyZC5wdXNoKG5vZGUyLnByZXZpb3VzTm9kZSk7XG4gICAgICBub2RlMiA9IG5vZGUyLnByZXZpb3VzTm9kZTtcbiAgICB9XG5cbiAgICBjb25zdCB0ZW1wID0gW107XG4gICAgZm9yIChsZXQgaSA9IHBhdGhGb3J3YXJkLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0ZW1wLnB1c2gocGF0aEZvcndhcmRbaV0pO1xuICAgIH1cbiAgICBwYXRoRm9yd2FyZCA9IHRlbXA7XG5cbiAgICBjb25zdCBmaW5hbFBhdGggPSBwYXRoRm9yd2FyZC5jb25jYXQocGF0aEJhY2t3YXJkKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmluYWxQYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZmluYWxQYXRoW2ldLm5vZGVUeXBlICE9PSAnc3RhcnQnICYmIGZpbmFsUGF0aFtpXS5ub2RlVHlwZSAhPT0gJ2VuZCcpIHtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMzApKTtcbiAgICAgICAgZmluYWxQYXRoW2ldLnNldE5vZGVUeXBlKCdmaW5hbC1wYXRoJywgZGVsYXkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHF1ZXVlRm9yd2FyZHMucHVzaChzdGFydE5vZGUpO1xuICBxdWV1ZUJhY2t3YXJkcy5wdXNoKGVuZE5vZGUpO1xuICB2aXNpdGVkRm9yd2FyZHMuYWRkKHN0YXJ0Tm9kZSk7XG4gIHZpc2l0ZWRCYWNrd2FyZHMuYWRkKGVuZE5vZGUpO1xuXG4gIHdoaWxlIChxdWV1ZUZvcndhcmRzLmxlbmd0aCA+IDAgJiYgcXVldWVCYWNrd2FyZHMubGVuZ3RoID4gMCkge1xuICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgfVxuXG4gICAgLy8gZm9yd2FyZHNcbiAgICBjb25zdCBjdXJyTm9kZUZvcndhcmQgPSBxdWV1ZUZvcndhcmRzLnNoaWZ0KCk7XG5cbiAgICBpZiAoY3Vyck5vZGVGb3J3YXJkICE9PSBzdGFydE5vZGUpIHtcbiAgICAgIGN1cnJOb2RlRm9yd2FyZC5zZXROb2RlVHlwZSgnY2xvc2VkLWxpc3QnLCBkZWxheSk7XG4gICAgfVxuICAgIGNvbnN0IG5laWdoYm9yc0ZvcndhcmQgPSBjdXJyTm9kZUZvcndhcmQubmVpZ2hib3JzO1xuICAgIGxldCBjdXJyTmVpZ2hib3JGb3J3YXJkID0gbnVsbDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmVpZ2hib3JzRm9yd2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgY3Vyck5laWdoYm9yRm9yd2FyZCA9IG5laWdoYm9yc0ZvcndhcmRbaV07XG4gICAgICBpZiAodmlzaXRlZEJhY2t3YXJkcy5oYXMoY3Vyck5laWdoYm9yRm9yd2FyZCkpIHtcbiAgICAgICAgZGlzcGxheUZpbmFsUGF0aChjdXJyTmVpZ2hib3JGb3J3YXJkLCBjdXJyTm9kZUZvcndhcmQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF2aXNpdGVkRm9yd2FyZHMuaGFzKGN1cnJOZWlnaGJvckZvcndhcmQpICYmICFxdWV1ZUZvcndhcmRzLmluY2x1ZGVzKGN1cnJOZWlnaGJvckZvcndhcmQpICYmIGN1cnJOZWlnaGJvckZvcndhcmQubm9kZVR5cGUgIT09ICdiYXJyaWVyJykge1xuICAgICAgICBxdWV1ZUZvcndhcmRzLnB1c2goY3Vyck5laWdoYm9yRm9yd2FyZCk7XG4gICAgICAgIGN1cnJOZWlnaGJvckZvcndhcmQucHJldmlvdXNOb2RlID0gY3Vyck5vZGVGb3J3YXJkO1xuICAgICAgICBjdXJyTmVpZ2hib3JGb3J3YXJkLnNldE5vZGVUeXBlKCdvcGVuLWxpc3QnLCBkZWxheSk7XG4gICAgICAgIHZpc2l0ZWRGb3J3YXJkcy5hZGQoY3Vyck5laWdoYm9yRm9yd2FyZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYmFja3dhcmRzXG4gICAgY29uc3QgY3Vyck5vZGVCYWNrd2FyZCA9IHF1ZXVlQmFja3dhcmRzLnNoaWZ0KCk7XG5cbiAgICBpZiAoY3Vyck5vZGVCYWNrd2FyZCAhPT0gZW5kTm9kZSkge1xuICAgICAgY3Vyck5vZGVCYWNrd2FyZC5zZXROb2RlVHlwZSgnY2xvc2VkLWxpc3QnLCBkZWxheSk7XG4gICAgfVxuICAgIGNvbnN0IG5laWdoYm9yc0JhY2t3YXJkID0gY3Vyck5vZGVCYWNrd2FyZC5uZWlnaGJvcnM7XG4gICAgbGV0IGN1cnJOZWlnaGJvckJhY2t3YXJkID0gbnVsbDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmVpZ2hib3JzQmFja3dhcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGN1cnJOZWlnaGJvckJhY2t3YXJkID0gbmVpZ2hib3JzQmFja3dhcmRbaV07XG4gICAgICBpZiAodmlzaXRlZEZvcndhcmRzLmhhcyhjdXJyTmVpZ2hib3JCYWNrd2FyZCkpIHtcbiAgICAgICAgZGlzcGxheUZpbmFsUGF0aChjdXJyTm9kZUJhY2t3YXJkLCBjdXJyTmVpZ2hib3JCYWNrd2FyZCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgICF2aXNpdGVkQmFja3dhcmRzLmhhcyhjdXJyTmVpZ2hib3JCYWNrd2FyZClcbiAgICAgICAgJiYgIXF1ZXVlQmFja3dhcmRzLmluY2x1ZGVzKGN1cnJOZWlnaGJvckJhY2t3YXJkKVxuICAgICAgICAmJiBjdXJyTmVpZ2hib3JCYWNrd2FyZC5ub2RlVHlwZSAhPT0gJ2JhcnJpZXInXG4gICAgICApIHtcbiAgICAgICAgcXVldWVCYWNrd2FyZHMucHVzaChjdXJyTmVpZ2hib3JCYWNrd2FyZCk7XG4gICAgICAgIGN1cnJOZWlnaGJvckJhY2t3YXJkLnByZXZpb3VzTm9kZSA9IGN1cnJOb2RlQmFja3dhcmQ7XG4gICAgICAgIGN1cnJOZWlnaGJvckJhY2t3YXJkLnNldE5vZGVUeXBlKCdvcGVuLWxpc3QnLCBkZWxheSk7XG4gICAgICAgIHZpc2l0ZWRCYWNrd2FyZHMuYWRkKGN1cnJOZWlnaGJvckJhY2t3YXJkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBydW5EaWprc3RyYShzdGFydE5vZGUsIGVuZE5vZGUsIGRlbGF5KSB7XG4gIGNvbnN0IG9wZW5MaXN0UXVldWUgPSBbXTsgLy8gdHJhY2tzIG5vZGVzIHRvIHZpc2l0XG4gIGNvbnN0IGNsb3NlZExpc3QgPSBbXTtcbiAgY29uc3QgZmluYWxQYXRoID0gW107XG5cbiAgYXN5bmMgZnVuY3Rpb24gZGlzcGxheUZpbmFsUGF0aChwYXRoKSB7XG4gICAgZm9yIChsZXQgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChwYXRoW2ldLm5vZGVUeXBlICE9PSAnc3RhcnQnICYmIHBhdGhbaV0ubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwKSk7XG4gICAgICAgIHBhdGhbaV0uc2V0Tm9kZVR5cGUoJ2ZpbmFsLXBhdGgnLCBkZWxheSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhcnROb2RlLmcgPSAwO1xuICBvcGVuTGlzdFF1ZXVlLnB1c2goc3RhcnROb2RlKTtcblxuICBhc3luYyBmdW5jdGlvbiBhbGdvcml0aG0oKSB7XG4gICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICB9XG4gICAgY29uc3QgY3VycmVudE5vZGUgPSBvcGVuTGlzdFF1ZXVlLnNoaWZ0KCk7XG4gICAgaWYgKGN1cnJlbnROb2RlLm5vZGVUeXBlICE9PSAnc3RhcnQnICYmIGN1cnJlbnROb2RlLm5vZGVUeXBlICE9PSAnZW5kJykge1xuICAgICAgY3VycmVudE5vZGUuc2V0Tm9kZVR5cGUoJ2Nsb3NlZC1saXN0JywgZGVsYXkpO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gZW5kTm9kZSkge1xuICAgICAgbGV0IHRlbXAgPSBjdXJyZW50Tm9kZTtcbiAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXApO1xuICAgICAgd2hpbGUgKHRlbXAucHJldmlvdXNOb2RlKSB7XG4gICAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXAucHJldmlvdXNOb2RlKTtcbiAgICAgICAgdGVtcCA9IHRlbXAucHJldmlvdXNOb2RlO1xuICAgICAgfVxuICAgICAgYXdhaXQgZGlzcGxheUZpbmFsUGF0aChmaW5hbFBhdGgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZS5uZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGN1cnJOZWlnaGJvciA9IGN1cnJlbnROb2RlLm5laWdoYm9yc1tpXTtcblxuICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ2JhcnJpZXInICYmICFjbG9zZWRMaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgaWYgKGN1cnJOZWlnaGJvci5nID09PSBJbmZpbml0eSkge1xuICAgICAgICAgIGN1cnJOZWlnaGJvci5nID0gY3VycmVudE5vZGUuZyArIDE7XG4gICAgICAgICAgY3Vyck5laWdoYm9yLnByZXZpb3VzTm9kZSA9IGN1cnJlbnROb2RlO1xuICAgICAgICAgIG9wZW5MaXN0UXVldWUucHVzaChjdXJyTmVpZ2hib3IpO1xuICAgICAgICAgIGlmIChjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgY3Vyck5laWdoYm9yLm5vZGVUeXBlICE9PSAnZW5kJykge1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLnNldE5vZGVUeXBlKCdvcGVuLWxpc3QnLCBkZWxheSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wZW5MaXN0UXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGFsZ29yaXRobSgpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBhbGdvcml0aG0oKTtcbn1cbiIsIi8vIHVwZGF0ZSBzcXVhcmUgZGlzcGxheVxuZnVuY3Rpb24gZGlzcGxheU5vZGUobm9kZSwgY3Vyck5vZGVUeXBlLCBuZXdOb2RlVHlwZSwgZ3JpZCwgZGVsYXkpIHtcbiAgY29uc3QgZG9tU3F1YXJlID0gZ3JpZC5maW5kRG9tU3F1YXJlKG5vZGUucm93IC0gMSwgbm9kZS5jb2wgLSAxKTtcblxuICBpZiAoZGVsYXkgIT09IDApIHtcbiAgICBkb21TcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0ZWQnKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG4gICAgZG9tU3F1YXJlLm9mZnNldFdpZHRoO1xuICAgIGlmIChuZXdOb2RlVHlwZSAhPT0gJ2Nsb3NlZC1saXN0Jykge1xuICAgICAgZG9tU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGVkJyk7XG4gICAgfVxuICB9XG5cbiAgZG9tU3F1YXJlLmNsYXNzTGlzdC50b2dnbGUoY3Vyck5vZGVUeXBlLCBmYWxzZSk7XG4gIGRvbVNxdWFyZS5jbGFzc0xpc3QudG9nZ2xlKG5ld05vZGVUeXBlLCB0cnVlKTtcbn1cblxuLy8gZmlsbCBncmlkIGNvbXBsZXRlbHkgd2l0aCBiYXJyaWVyc1xuZnVuY3Rpb24gZmlsbEdyaWQoZ3JpZCwgc3F1YXJlU2l6ZSkge1xuICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyaWQtY29udGFpbmVyJyk7XG4gIGdyaWRDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cbiAgLy8gQ3JlYXRlIGEgZG9jdW1lbnQgZnJhZ21lbnQgdG8gYmF0Y2ggdGhlIHVwZGF0ZXNcbiAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgZ3JpZENvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZ3JpZC1jb250YWluZXInKTtcbiAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGAke3NxdWFyZVNpemV9LWdyaWRgKTtcblxuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgY29uc3QgZ3JpZFNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdncmlkLXNxdWFyZScpO1xuICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdiYXJyaWVyJyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoYCR7c3F1YXJlU2l6ZX1gKTtcblxuICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZ3JpZFNxdWFyZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQXBwZW5kIHRoZSBlbnRpcmUgZnJhZ21lbnQgdG8gdGhlIGNvbnRhaW5lciBhdCBvbmNlXG4gIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xufVxuXG4vLyBkaXNwbGF5IGZ1bGwgZ3JpZFxuZnVuY3Rpb24gY3JlYXRlR3JpZChncmlkLCBzcXVhcmVTaXplKSB7XG4gIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAvLyBDcmVhdGUgYSBkb2N1bWVudCBmcmFnbWVudCB0byBiYXRjaCB0aGUgdXBkYXRlc1xuICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICBncmlkQ29udGFpbmVyLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdncmlkLWNvbnRhaW5lcicpO1xuICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYCR7c3F1YXJlU2l6ZX0tZ3JpZGApO1xuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBjb25zdCBncmlkU3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoYCR7c3F1YXJlU2l6ZX1gKTtcblxuICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZ3JpZFNxdWFyZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQXBwZW5kIHRoZSBlbnRpcmUgZnJhZ21lbnQgdG8gdGhlIGNvbnRhaW5lciBhdCBvbmNlXG4gIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xufVxuXG5jb25zdCBEb21IYW5kbGVyID0ge1xuICBjcmVhdGVHcmlkLFxuICBmaWxsR3JpZCxcbiAgZGlzcGxheU5vZGUsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBEb21IYW5kbGVyO1xuIiwiaW1wb3J0IE5vZGUgZnJvbSAnLi9ub2RlJztcbmltcG9ydCBEb21IYW5kbGVyIGZyb20gJy4vZG9taGFuZGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWQge1xuICBjb25zdHJ1Y3Rvcihyb3dzLCBjb2xzLCBub2RlV2lkdGgsIGN1cnJlbnRseVJ1bm5pbmcpIHtcbiAgICB0aGlzLnJvd3MgPSByb3dzO1xuICAgIHRoaXMuY29scyA9IGNvbHM7XG4gICAgdGhpcy5ub2RlV2lkdGggPSBub2RlV2lkdGg7XG4gICAgdGhpcy5zdGFydCA9IHsgbm9kZTogbnVsbCB9O1xuICAgIHRoaXMuZW5kID0geyBub2RlOiBudWxsIH07XG4gICAgdGhpcy5ncmlkID0gW107XG4gICAgdGhpcy5vcGVuTGlzdCA9IFtdO1xuICAgIHRoaXMuY2xvc2VkTGlzdCA9IFtdO1xuICAgIHRoaXMuZmluYWxQYXRoID0gW107XG4gICAgdGhpcy5jcmVhdGVHcmlkKHRoaXMucm93cywgdGhpcy5jb2xzKTtcbiAgICB0aGlzLmN1cnJlbnRseVJ1bm5pbmcgPSBjdXJyZW50bHlSdW5uaW5nOyAvLyBpcyBhbiBhbGdvcml0aG0gcnVubmluZz9cblxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgIHRoaXMuZXJhc2VNb2RlT24gPSBmYWxzZTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBzcXVhcmUgbm9kZSB0eXBlIGFuZCB1cGRhdGUgY29ycmVzcG9uZGluZyBkb20gc3F1YXJlXG4gIHNldFNxdWFyZVN0YXR1cyhyb3csIGNvbCkge1xuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gdGhpcy5ncmlkW3Jvd11bY29sXTtcbiAgICBpZiAodGhpcy5lcmFzZU1vZGVPbikge1xuICAgICAgaWYgKGN1cnJlbnROb2RlID09PSB0aGlzLnN0YXJ0Lm5vZGUpIHRoaXMuc3RhcnQubm9kZSA9IG51bGw7XG4gICAgICBpZiAoY3VycmVudE5vZGUgPT09IHRoaXMuZW5kLm5vZGUpIHRoaXMuZW5kLm5vZGUgPSBudWxsO1xuICAgICAgY3VycmVudE5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnROb2RlLm5vZGVUeXBlICE9PSAnZW1wdHknKSByZXR1cm47XG5cbiAgICBpZiAodGhpcy5zdGFydC5ub2RlID09PSBudWxsKSB7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnc3RhcnQnKTtcbiAgICAgIHRoaXMuc3RhcnQubm9kZSA9IGN1cnJlbnROb2RlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lbmQubm9kZSA9PT0gbnVsbCkge1xuICAgICAgY3VycmVudE5vZGUuc2V0Tm9kZVR5cGUoJ2VuZCcpO1xuICAgICAgdGhpcy5lbmQubm9kZSA9IGN1cnJlbnROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1vdXNlRG93bihyb3csIGNvbCkge1xuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgdGhpcy5zZXRTcXVhcmVTdGF0dXMocm93LCBjb2wpO1xuICB9XG5cbiAgaGFuZGxlTW91c2VNb3ZlKHJvdywgY29sKSB7XG4gICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xuICAgICAgdGhpcy5zZXRTcXVhcmVTdGF0dXMocm93LCBjb2wpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1vdXNlVXAoKSB7XG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gIH1cblxuICAvLyBmaW5kIHNxdWFyZSBpbiB0aGUgZG9tXG4gIGZpbmREb21TcXVhcmUocm93LCBjb2wpIHtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyaWQtY29udGFpbmVyJyk7XG4gICAgY29uc3QgZ3JpZENvbnRhaW5lckNoaWxkcmVuID0gZ3JpZENvbnRhaW5lci5jaGlsZHJlbjtcbiAgICBjb25zdCBpbmRleCA9IHJvdyAqIHRoaXMuY29scyArIGNvbDtcbiAgICByZXR1cm4gZ3JpZENvbnRhaW5lckNoaWxkcmVuW2luZGV4XTtcbiAgfVxuXG4gIGFkZExpc3RlbmVycygpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnJvd3M7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLmNvbHM7IGNvbCsrKSB7XG4gICAgICAgIGNvbnN0IGdyaWRTcXVhcmUgPSB0aGlzLmZpbmREb21TcXVhcmUocm93LCBjb2wpO1xuICAgICAgICBncmlkU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50bHlSdW5uaW5nWzBdKSByZXR1cm47XG4gICAgICAgICAgdGhpcy5oYW5kbGVNb3VzZURvd24ocm93LCBjb2wpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3JpZFNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudGx5UnVubmluZ1swXSkgcmV0dXJuO1xuICAgICAgICAgIHRoaXMuaGFuZGxlTW91c2VNb3ZlKHJvdywgY29sKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlTW91c2VVcCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gdXNlZCB0byBjcmVhdGUgZ3JpZCBvZiBlbXB0eSBvciBiYXJyaWVyIHNxdWFyZXNcbiAgY3JlYXRlR3JpZChyb3dzLCBjb2xzKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMTsgcm93IDw9IHJvd3M7IHJvdysrKSB7XG4gICAgICBjb25zdCBjdXJyZW50Um93ID0gW107XG4gICAgICBmb3IgKGxldCBjb2wgPSAxOyBjb2wgPD0gY29sczsgY29sKyspIHtcbiAgICAgICAgY3VycmVudFJvdy5wdXNoKG5ldyBOb2RlKHJvdywgY29sLCB0aGlzLnJvd3MsIHRoaXMuY29scywgdGhpcywgdGhpcy5ub2RlV2lkdGgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ3JpZC5wdXNoKGN1cnJlbnRSb3cpO1xuICAgIH1cbiAgICBEb21IYW5kbGVyLmNyZWF0ZUdyaWQodGhpcy5ncmlkLCB0aGlzLm5vZGVXaWR0aCk7XG4gIH1cblxuICAvLyBmaWxsIGdyaWQgYXMgYmFycmllcnNcbiAgZmlsbEdyaWQoKSB7XG4gICAgdGhpcy5ncmlkID0gW107XG4gICAgZm9yIChsZXQgcm93ID0gMTsgcm93IDw9IHRoaXMucm93czsgcm93KyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBbXTtcbiAgICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8PSB0aGlzLmNvbHM7IGNvbCsrKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBuZXcgTm9kZShyb3csIGNvbCwgdGhpcy5yb3dzLCB0aGlzLmNvbHMsIHRoaXMsIHRoaXMubm9kZVdpZHRoKTtcbiAgICAgICAgbm9kZS5ub2RlVHlwZSA9ICdiYXJyaWVyJztcbiAgICAgICAgY3VycmVudFJvdy5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5ncmlkLnB1c2goY3VycmVudFJvdyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRBbGxOb2RlTmVpZ2hib3JzKCk7XG5cbiAgICB0aGlzLnN0YXJ0Lm5vZGUgPSBudWxsO1xuICAgIHRoaXMuZW5kLm5vZGUgPSBudWxsO1xuXG4gICAgLy8gcmVzZXRpbmcgZG9tIHNxdWFyZXNcbiAgICBEb21IYW5kbGVyLmZpbGxHcmlkKHRoaXMuZ3JpZCwgdGhpcy5ub2RlV2lkdGgpO1xuICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG4gIH1cblxuICAvLyB1cGRhdGUgbmVpZ2hib3JzIGZvciBldmVyeSBzaW5nbGUgbm9kZSBpbiBncmlkXG4gIHNldEFsbE5vZGVOZWlnaGJvcnMoKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5ncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgICAgdGhpcy5ncmlkW3Jvd11bY29sXS5uZWlnaGJvcnMgPSBbXTtcbiAgICAgICAgdGhpcy5ncmlkW3Jvd11bY29sXS5zZXROZWlnaGJvcnModGhpcy5ncmlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyByZXNldCBncmlkIGFuZCBhbGwgbm9kZXMgY29tcGxldGVseVxuICByZXNldEdyaWQoKSB7XG4gICAgdGhpcy5ncmlkID0gW107XG4gICAgZm9yIChsZXQgcm93ID0gMTsgcm93IDw9IHRoaXMucm93czsgcm93KyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBbXTtcbiAgICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8PSB0aGlzLmNvbHM7IGNvbCsrKSB7XG4gICAgICAgIGN1cnJlbnRSb3cucHVzaChuZXcgTm9kZShyb3csIGNvbCwgdGhpcy5yb3dzLCB0aGlzLmNvbHMsIHRoaXMsIHRoaXMubm9kZVdpZHRoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmdyaWQucHVzaChjdXJyZW50Um93KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldEFsbE5vZGVOZWlnaGJvcnMoKTtcblxuICAgIHRoaXMuc3RhcnQubm9kZSA9IG51bGw7XG4gICAgdGhpcy5lbmQubm9kZSA9IG51bGw7XG5cbiAgICAvLyByZXNldGluZyBkb20gc3F1YXJlc1xuICAgIERvbUhhbmRsZXIuY3JlYXRlR3JpZCh0aGlzLmdyaWQsIHRoaXMubm9kZVdpZHRoKTtcbiAgICB0aGlzLmFkZExpc3RlbmVycygpO1xuICB9XG5cbiAgLy8gcmVzZXQgYWxnb3JpdGhtIGRpc3BsYXkgb24gZ3JpZCBlLmcgZmluYWwgcGF0aCwgb3Blbi1saXN0IGFuZCBjbG9zZWQtbGlzdFxuICByZXNldFBhdGgoKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5yb3dzOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5jb2xzOyBjb2wrKykge1xuICAgICAgICBjb25zdCBjdXJyTm9kZSA9IHRoaXMuZ3JpZFtyb3ddW2NvbF07XG4gICAgICAgIGNvbnN0IGN1cnJUeXBlID0gY3Vyck5vZGUubm9kZVR5cGU7XG4gICAgICAgIGlmIChjdXJyVHlwZSA9PT0gJ29wZW4tbGlzdCcgfHwgY3VyclR5cGUgPT09ICdjbG9zZWQtbGlzdCcgfHwgY3VyclR5cGUgPT09ICdmaW5hbC1wYXRoJykge1xuICAgICAgICAgIGN1cnJOb2RlLnNldE5vZGVUeXBlKCdlbXB0eScsIDApO1xuICAgICAgICAgIGN1cnJOb2RlLnByZXZpb3VzTm9kZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVHcmlkU2l6ZShyb3dzLCBjb2xzLCBub2RlV2lkdGgpIHtcbiAgICB0aGlzLnJvd3MgPSByb3dzO1xuICAgIHRoaXMuY29scyA9IGNvbHM7XG4gICAgdGhpcy5ub2RlV2lkdGggPSBub2RlV2lkdGg7XG4gIH1cblxuICBzZXRFcmFzZU1vZGUoKSB7XG4gICAgdGhpcy5lcmFzZU1vZGVPbiA9ICF0aGlzLmVyYXNlTW9kZU9uO1xuICB9XG59XG4iLCJpbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xuaW1wb3J0IEFsZ29yaXRobUZhY3RvcnkgZnJvbSAnLi9hbGdvcml0aG1mYWN0b3J5JztcbmltcG9ydCBNYXplRmFjdG9yeSBmcm9tICcuL21hemVmYWN0b3J5JztcblxubGV0IGdyaWRPYmogPSBudWxsO1xubGV0IHNlbGVjdGVkQWxnb3JpdGhtID0gbnVsbDtcbmxldCBzZWxlY3RlZE1hemUgPSBudWxsO1xuY29uc3QgcnVubmluZyA9IFtmYWxzZV07IC8vIGNoZWNrIGlmIHBhdGggb3IgbWF6ZSBhbGdvcml0aG0gaXMgY3VycmVudGx5IHJ1bm5pbmdcbmxldCBjdXJyTWF6ZVNwZWVkU2V0dGluZyA9ICdOb3JtYWwnO1xubGV0IGN1cnJQYXRoZmluZGluZ1NwZWVkU2V0dGluZyA9ICdOb3JtYWwnO1xubGV0IG1hemVTcGVlZCA9IDEwO1xubGV0IHBhdGhmaW5kaW5nU3BlZWQgPSAxMDtcbmxldCBncmlkU2l6ZSA9ICdtZWRpdW0nO1xuXG4vLyBjb250YWlucyBpbmZvIGFzc29jaWF0ZWQgd2l0aCBlYWNoIGdyaWQgc2l6ZVxuY29uc3QgZ3JpZFNpemVzID0ge1xuICBzbWFsbDogeyByb3dzOiAxNSwgY29sczogMzcgfSxcbiAgbWVkaXVtOiB7IHJvd3M6IDI1LCBjb2xzOiA2MSB9LFxuICBsYXJnZTogeyByb3dzOiAzNywgY29sczogOTEgfSxcbn07XG5cbi8vIHBhdGhmaW5kaW5nIHNwZWVkcyBmb3IgZGlmZmVyZW50IGdyaWQgc2l6ZXNcbmNvbnN0IHBhdGhmaW5kaW5nU3BlZWRzID0ge1xuICBzbG93OiB7IHNtYWxsOiAxNTAsIG1lZGl1bTogMzAsIGxhcmdlOiAzMCB9LFxuICBub3JtYWw6IHsgc21hbGw6IDUwLCBtZWRpdW06IDEwLCBsYXJnZTogMTAgfSxcbiAgZmFzdDogeyBzbWFsbDogMjAsIG1lZGl1bTogNSwgbGFyZ2U6IDEgfSxcbiAgaW5zdGFudDogMCxcbn07XG5cbi8vIG1hemUgZ2VuZXJhdGlvbiBzcGVlZHMgZm9yIGRpZmZlcmVudCBncmlkIHNpemVzXG5jb25zdCBtYXplR2VuU3BlZWRzID0ge1xuICBzbG93OiB7IHNtYWxsOiAxMjAsIG1lZGl1bTogMjAsIGxhcmdlOiAxMCB9LFxuICBub3JtYWw6IHsgc21hbGw6IDMwLCBtZWRpdW06IDEwLCBsYXJnZTogMyB9LFxuICBmYXN0OiB7IHNtYWxsOiAxNSwgbWVkaXVtOiAxLCBsYXJnZTogMC4xIH0sXG4gIGluc3RhbnQ6IDAsXG59O1xuXG4vLyBpbml0aWFsbHkgbG9hZGVkIGdyaWRcbmZ1bmN0aW9uIGxvYWRHcmlkKCkge1xuICBncmlkT2JqID0gbmV3IEdyaWQoZ3JpZFNpemVzLm1lZGl1bS5yb3dzLCBncmlkU2l6ZXMubWVkaXVtLmNvbHMsIGdyaWRTaXplLCBydW5uaW5nKTtcbiAgZ3JpZE9iai5zZXRBbGxOb2RlTmVpZ2hib3JzKCk7XG59XG5cbi8vIHJ1biBwYXRoZmluZGluZyBhbGdvcml0aG1cbmFzeW5jIGZ1bmN0aW9uIHJ1bkFsZ29yaXRobShwYXRoRmluZGluZ0FsZ29yaXRobSkge1xuICBpZiAocnVubmluZ1swXSB8fCAhcGF0aEZpbmRpbmdBbGdvcml0aG0gfHwgIWdyaWRPYmouc3RhcnQubm9kZSB8fCAhZ3JpZE9iai5lbmQubm9kZSkgcmV0dXJuO1xuICBydW5uaW5nWzBdID0gdHJ1ZTtcblxuICBncmlkT2JqLnJlc2V0UGF0aCgpO1xuXG4gIGlmIChwYXRoRmluZGluZ0FsZ29yaXRobSA9PT0gJ0RpamtzdHJhJykge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWRPYmouZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBncmlkT2JqLmdyaWRbMF0ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgICBncmlkT2JqLmdyaWRbcm93XVtjb2xdLmcgPSBJbmZpbml0eTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBzdGFydE5vZGUgPSBncmlkT2JqLnN0YXJ0Lm5vZGU7XG4gIGNvbnN0IGVuZE5vZGUgPSBncmlkT2JqLmVuZC5ub2RlO1xuXG4gIGNvbnN0IGFsZ29yaXRobSA9IEFsZ29yaXRobUZhY3RvcnkuY3JlYXRlQWxnb3JpdGhtKHBhdGhGaW5kaW5nQWxnb3JpdGhtKTtcbiAgYXdhaXQgYWxnb3JpdGhtKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgcGF0aGZpbmRpbmdTcGVlZCk7XG5cbiAgcnVubmluZ1swXSA9IGZhbHNlO1xufVxuXG4vLyBydW4gbWF6ZSBnZW5lcmF0aW9uIGFsZ29yaXRobVxuYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVNYXplKG1hemVHZW5lcmF0aW9uQWxnb3JpdGhtKSB7XG4gIGlmIChydW5uaW5nWzBdIHx8IG1hemVHZW5lcmF0aW9uQWxnb3JpdGhtID09PSBudWxsKSByZXR1cm47XG4gIHJ1bm5pbmdbMF0gPSB0cnVlO1xuICBncmlkT2JqLnJlc2V0R3JpZCgpO1xuXG4gIGNvbnN0IG1hemUgPSBNYXplRmFjdG9yeS5jcmVhdGVNYXplKG1hemVHZW5lcmF0aW9uQWxnb3JpdGhtKTtcbiAgYXdhaXQgbWF6ZShncmlkT2JqLCBtYXplU3BlZWQpO1xuXG4gIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbn1cblxuLy8gdXBkYXRlIGhvdyBmYXN0IG1hemUgZ2VuZXJhdGVzXG5mdW5jdGlvbiB1cGRhdGVNYXplRGVsYXkoc3BlZWQpIHtcbiAgY29uc3QgbmV3U3BlZWQgPSBzcGVlZC50b0xvd2VyQ2FzZSgpO1xuICBpZiAoZ3JpZFNpemUgPT09ICdzbWFsbCcpIHtcbiAgICBtYXplU3BlZWQgPSBtYXplR2VuU3BlZWRzW25ld1NwZWVkXS5zbWFsbDtcbiAgfVxuICBpZiAoZ3JpZFNpemUgPT09ICdtZWRpdW0nKSB7XG4gICAgbWF6ZVNwZWVkID0gbWF6ZUdlblNwZWVkc1tuZXdTcGVlZF0ubWVkaXVtO1xuICB9XG4gIGlmIChncmlkU2l6ZSA9PT0gJ2xhcmdlJykge1xuICAgIG1hemVTcGVlZCA9IG1hemVHZW5TcGVlZHNbbmV3U3BlZWRdLmxhcmdlO1xuICB9XG5cbiAgaWYgKHNwZWVkID09PSAnSW5zdGFudCcpIG1hemVTcGVlZCA9IG1hemVHZW5TcGVlZHMuaW5zdGFudDtcbn1cblxuLy8gdXBkYXRlIGhvdyBmYXN0IHBhdGggYWxnb3JpdGhtIGV4cGxvcmVzIG5vZGVzXG5mdW5jdGlvbiB1cGRhdGVQYXRoZmluZGluZ0RlbGF5KHNwZWVkKSB7XG4gIGNvbnN0IG5ld1NwZWVkID0gc3BlZWQudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGdyaWRTaXplID09PSAnc21hbGwnKSB7XG4gICAgcGF0aGZpbmRpbmdTcGVlZCA9IHBhdGhmaW5kaW5nU3BlZWRzW25ld1NwZWVkXS5zbWFsbDtcbiAgfVxuICBpZiAoZ3JpZFNpemUgPT09ICdtZWRpdW0nKSB7XG4gICAgcGF0aGZpbmRpbmdTcGVlZCA9IHBhdGhmaW5kaW5nU3BlZWRzW25ld1NwZWVkXS5tZWRpdW07XG4gIH1cbiAgaWYgKGdyaWRTaXplID09PSAnbGFyZ2UnKSB7XG4gICAgcGF0aGZpbmRpbmdTcGVlZCA9IHBhdGhmaW5kaW5nU3BlZWRzW25ld1NwZWVkXS5sYXJnZTtcbiAgfVxuXG4gIGlmIChzcGVlZCA9PT0gJ0luc3RhbnQnKSBwYXRoZmluZGluZ1NwZWVkID0gcGF0aGZpbmRpbmdTcGVlZHMuaW5zdGFudDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlR3JpZFNpemUoc2l6ZSkge1xuICBjb25zdCBuZXdTaXplID0gc2l6ZS50b0xvd2VyQ2FzZSgpO1xuICBncmlkU2l6ZSA9IG5ld1NpemU7XG5cbiAgZ3JpZE9iai51cGRhdGVHcmlkU2l6ZShncmlkU2l6ZXNbbmV3U2l6ZV0ucm93cywgZ3JpZFNpemVzW25ld1NpemVdLmNvbHMsIG5ld1NpemUpO1xuXG4gIGdyaWRPYmoucmVzZXRHcmlkKCk7XG5cbiAgdXBkYXRlUGF0aGZpbmRpbmdEZWxheShjdXJyUGF0aGZpbmRpbmdTcGVlZFNldHRpbmcpO1xuICB1cGRhdGVNYXplRGVsYXkoY3Vyck1hemVTcGVlZFNldHRpbmcpO1xufVxuXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnNUb0J0bnMoKSB7XG4gIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXJ0LWFsZ29yaXRobScpO1xuICBjb25zdCBnZW5lcmF0ZU1hemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2VuZXJhdGUtbWF6ZScpO1xuXG4gIGNvbnN0IHNlbGVjdEFsZ29CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWFsZ28tYnRuJyk7XG4gIGNvbnN0IHNlbGVjdE1hemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LW1hemUtYnRuJyk7XG4gIGNvbnN0IGdyaWRTaXplQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyaWQtc2l6ZS1idG4nKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZVNwZWVkQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdC1tYXplLXNwZWVkLWJ0bicpO1xuICBjb25zdCBzZWxlY3RBbGdvU3BlZWRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWFsZ28tc3BlZWQtYnRuJyk7XG5cbiAgY29uc3Qgc2VsZWN0QWxnb0J0bkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWxnby1saXN0Jyk7XG4gIGNvbnN0IHNlbGVjdE1hemVCdG5MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1hemUtbGlzdCcpO1xuICBjb25zdCBncmlkU2l6ZUJ0bkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1zaXplLWxpc3QnKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZVNwZWVkQnRuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXplLXNwZWVkLWxpc3QnKTtcbiAgY29uc3Qgc2VsZWN0QWxnb1NwZWVkQnRuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hbGdvLXNwZWVkLWxpc3QnKTtcbiAgY29uc3Qgc2VsZWN0QWxnb0xpc3RJdGVtcyA9IHNlbGVjdEFsZ29CdG5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuICBjb25zdCBzZWxlY3RNYXplTGlzdEl0ZW1zID0gc2VsZWN0TWF6ZUJ0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG4gIGNvbnN0IGdyaWRTaXplTGlzdEl0ZW1zID0gZ3JpZFNpemVCdG5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuICBjb25zdCBzZWxlY3RNYXplU3BlZWRMaXN0SXRlbXMgPSBzZWxlY3RNYXplU3BlZWRCdG5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuICBjb25zdCBzZWxlY3RBbGdvU3BlZWRMaXN0SXRlbXMgPSBzZWxlY3RBbGdvU3BlZWRCdG5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuXG4gIGNvbnN0IGRyb3Bkb3duQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kcm9wZG93bi1idG4nKTtcbiAgY29uc3QgZHJvcGRvd25MaXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kcm9wZG93bi1saXN0Jyk7XG4gIGNvbnN0IGNsZWFyQm9hcmRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xlYXItYm9hcmQnKTtcbiAgY29uc3QgY2xlYXJQYXRoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsZWFyLXBhdGgnKTtcbiAgY29uc3QgZXJhc2VNb2RlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVyYXNlLW1vZGUnKTtcblxuICBsZXQgY3VycmVudFBhZ2UgPSAwO1xuICBjb25zdCBkYXJrT3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXJrLW92ZXJsYXknKTtcbiAgY29uc3QgaGVscEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlbHAtYm9hcmQnKTtcbiAgY29uc3QgcGFnZXMgPSBoZWxwQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2UnKTtcbiAgY29uc3Qgc2tpcEJ0bnMgPSBoZWxwQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLnNraXAtYnRuJyk7XG4gIGNvbnN0IG5leHRCdG5zID0gaGVscEJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5uZXh0LWJ0bicpO1xuICBjb25zdCBwcmV2aW91c0J0bnMgPSBoZWxwQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLnByZXZpb3VzLWJ0bicpO1xuICBjb25zdCBjb250aW51ZUJ0biA9IGhlbHBCb2FyZC5xdWVyeVNlbGVjdG9yKCcuY29udGludWUtYnRuJyk7XG4gIGNvbnN0IGhlbHBCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVscC1idG4nKTtcblxuICBzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBydW5BbGdvcml0aG0oc2VsZWN0ZWRBbGdvcml0aG0pO1xuICB9KTtcblxuICBnZW5lcmF0ZU1hemVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgZ2VuZXJhdGVNYXplKHNlbGVjdGVkTWF6ZSk7XG4gIH0pO1xuXG4gIHNraXBCdG5zLmZvckVhY2goKHNraXBCdG4pID0+IHtcbiAgICBza2lwQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaGVscEJvYXJkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBkYXJrT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0pO1xuICB9KTtcblxuICBwcmV2aW91c0J0bnMuZm9yRWFjaCgocHJldmlvdXNCdG4pID0+IHtcbiAgICBwcmV2aW91c0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGlmIChjdXJyZW50UGFnZSA+IDApIHtcbiAgICAgICAgcGFnZXNbY3VycmVudFBhZ2VdLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgY3VycmVudFBhZ2UgLT0gMTtcbiAgICAgICAgcGFnZXNbY3VycmVudFBhZ2VdLnNldEF0dHJpYnV0ZSgnaWQnLCAnc2hvdy1wYWdlJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIG5leHRCdG5zLmZvckVhY2goKG5leHRCdG4pID0+IHtcbiAgICBuZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKGN1cnJlbnRQYWdlIDwgcGFnZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICBwYWdlc1tjdXJyZW50UGFnZV0ucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuICAgICAgICBjdXJyZW50UGFnZSArPSAxO1xuICAgICAgICBwYWdlc1tjdXJyZW50UGFnZV0uc2V0QXR0cmlidXRlKCdpZCcsICdzaG93LXBhZ2UnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgY29udGludWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgaGVscEJvYXJkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgZGFya092ZXJsYXkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfSk7XG5cbiAgZnVuY3Rpb24gY2xvc2VEcm9wZG93bnMoKSB7XG4gICAgZHJvcGRvd25MaXN0cy5mb3JFYWNoKChsaXN0KSA9PiB7XG4gICAgICBsaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRyb3Bkb3duQnV0dG9ucy5mb3JFYWNoKChidXR0b24sIGluZGV4KSA9PiB7XG4gICAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjsgLy8gYWxnb3JpdGhtIGluIHByb2dyZXNzXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBjb25zdCBjdXJyZW50TGlzdCA9IGRyb3Bkb3duTGlzdHNbaW5kZXhdO1xuICAgICAgY29uc3QgaXNMaXN0T3BlbiA9IGN1cnJlbnRMaXN0LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpO1xuXG4gICAgICBjbG9zZURyb3Bkb3ducygpO1xuXG4gICAgICBpZiAoIWlzTGlzdE9wZW4pIHtcbiAgICAgICAgY3VycmVudExpc3QuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdycpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgY29uc3QgaXNDbGlja0luc2lkZURyb3Bkb3duID0gQXJyYXkuZnJvbShkcm9wZG93bkxpc3RzKS5zb21lKChsaXN0KSA9PiBsaXN0LmNvbnRhaW5zKGUudGFyZ2V0KSk7XG5cbiAgICBpZiAoIWlzQ2xpY2tJbnNpZGVEcm9wZG93bikge1xuICAgICAgY2xvc2VEcm9wZG93bnMoKTtcbiAgICB9XG4gIH0pO1xuXG4gIGhlbHBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgZGFya092ZXJsYXkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgaGVscEJvYXJkLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG5cbiAgICBwYWdlc1tjdXJyZW50UGFnZV0ucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuICAgIGN1cnJlbnRQYWdlID0gMDtcbiAgICBwYWdlc1tjdXJyZW50UGFnZV0uc2V0QXR0cmlidXRlKCdpZCcsICdzaG93LXBhZ2UnKTtcbiAgfSk7XG5cbiAgc2VsZWN0QWxnb0xpc3RJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBzZWxlY3RBbGdvQnRuTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICBzZWxlY3RBbGdvQnRuLnRleHRDb250ZW50ID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgIHNlbGVjdGVkQWxnb3JpdGhtID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGVjdE1hemVMaXN0SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgc2VsZWN0TWF6ZUJ0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0TWF6ZUJ0bi50ZXh0Q29udGVudCA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICBzZWxlY3RlZE1hemUgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZWN0TWF6ZVNwZWVkTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHNlbGVjdE1hemVTcGVlZEJ0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0TWF6ZVNwZWVkQnRuLnRleHRDb250ZW50ID0gYE1hemUgU3BlZWQ6ICR7aXRlbS50ZXh0Q29udGVudH1gO1xuICAgICAgY3Vyck1hemVTcGVlZFNldHRpbmcgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgdXBkYXRlTWF6ZURlbGF5KGl0ZW0udGV4dENvbnRlbnQpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZWN0QWxnb1NwZWVkTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHNlbGVjdEFsZ29TcGVlZEJ0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0QWxnb1NwZWVkQnRuLnRleHRDb250ZW50ID0gYFBhdGhmaW5kaW5nIFNwZWVkOiAke2l0ZW0udGV4dENvbnRlbnR9YDtcbiAgICAgIGN1cnJQYXRoZmluZGluZ1NwZWVkU2V0dGluZyA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICB1cGRhdGVQYXRoZmluZGluZ0RlbGF5KGl0ZW0udGV4dENvbnRlbnQpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZ3JpZFNpemVMaXN0SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjtcbiAgICAgIGdyaWRTaXplQnRuTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICBncmlkU2l6ZUJ0bi50ZXh0Q29udGVudCA9IGBHcmlkIFNpemU6ICR7aXRlbS50ZXh0Q29udGVudH1gO1xuICAgICAgdXBkYXRlR3JpZFNpemUoaXRlbS50ZXh0Q29udGVudCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuICB9KTtcblxuICBjbGVhckJvYXJkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChydW5uaW5nWzBdKSByZXR1cm47XG4gICAgZ3JpZE9iai5yZXNldEdyaWQoKTtcbiAgfSk7XG5cbiAgY2xlYXJQYXRoQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChydW5uaW5nWzBdKSByZXR1cm47XG4gICAgZ3JpZE9iai5yZXNldFBhdGgoKTtcbiAgfSk7XG5cbiAgZXJhc2VNb2RlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBpZiAoZS50YXJnZXQudGV4dENvbnRlbnQgPT09ICdFcmFzZTogT2ZmJykge1xuICAgICAgZS50YXJnZXQudGV4dENvbnRlbnQgPSAnRXJhc2U6IE9uJztcbiAgICB9IGVsc2UgaWYgKGUudGFyZ2V0LnRleHRDb250ZW50ID09PSAnRXJhc2U6IE9uJykge1xuICAgICAgZS50YXJnZXQudGV4dENvbnRlbnQgPSAnRXJhc2U6IE9mZic7XG4gICAgfVxuICAgIGdyaWRPYmouc2V0RXJhc2VNb2RlKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnNUb0dyaWQoKSB7XG4gIGdyaWRPYmouYWRkTGlzdGVuZXJzKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWQoKSB7XG4gIGxvYWRHcmlkKCk7XG4gIGFkZExpc3RlbmVyc1RvR3JpZCgpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIGFkZExpc3RlbmVyc1RvQnRucygpO1xuICB9KTtcbn1cbiIsImltcG9ydCByZWN1cnNpdmVEaXZpc2lvbiBmcm9tICcuL21hemVzL3JlY3Vyc2l2ZWRpdmlzaW9uJztcbmltcG9ydCBiaW5hcnlUcmVlIGZyb20gJy4vbWF6ZXMvYmluYXJ5dHJlZSc7XG5pbXBvcnQgc2lkZXdpbmRlciBmcm9tICcuL21hemVzL3NpZGV3aW5kZXInO1xuaW1wb3J0IGdlbmVyYXRlUHJpbXMgZnJvbSAnLi9tYXplcy9wcmltcyc7XG5pbXBvcnQgZ2VuZXJhdGVIdW50QW5kS2lsbCBmcm9tICcuL21hemVzL2h1bnRhbmRraWxsJztcbmltcG9ydCByYW5kb21NYXAgZnJvbSAnLi9tYXplcy9yYW5kb21tYXAnO1xuXG5jbGFzcyBNYXplRmFjdG9yeSB7XG4gIHN0YXRpYyBjcmVhdGVNYXplKG1hemVBbGdvcml0aG0pIHtcbiAgICAvLyBNYXAgYWxnb3JpdGhtIG5hbWVzIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgaW1wbGVtZW50YXRpb25zXG4gICAgY29uc3QgYWxnb3JpdGhtcyA9IHtcbiAgICAgICdSZWN1cnNpdmUgRGl2aXNpb24nOiByZWN1cnNpdmVEaXZpc2lvbixcbiAgICAgICdCaW5hcnkgVHJlZSc6IGJpbmFyeVRyZWUsXG4gICAgICBTaWRld2luZGVyOiBzaWRld2luZGVyLFxuICAgICAgXCJQcmltJ3NcIjogZ2VuZXJhdGVQcmltcyxcbiAgICAgICdIdW50ICYgS2lsbCc6IGdlbmVyYXRlSHVudEFuZEtpbGwsXG4gICAgICAnUmFuZG9tIE1hcCc6IHJhbmRvbU1hcCxcbiAgICB9O1xuXG4gICAgY29uc3QgQWxnb3JpdGhtQ2xhc3MgPSBhbGdvcml0aG1zW21hemVBbGdvcml0aG1dO1xuXG4gICAgaWYgKCFBbGdvcml0aG1DbGFzcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbGdvcml0aG0gXCIke21hemVBbGdvcml0aG19XCIgbm90IGZvdW5kYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEFsZ29yaXRobUNsYXNzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hemVGYWN0b3J5O1xuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYmluYXJ5VHJlZShncmlkT2JqLCBkZWxheSkge1xuICAvLyBmaWxsIGdyaWQgd2l0aCBiYXJyaWVyc1xuICBncmlkT2JqLmZpbGxHcmlkKCk7XG5cbiAgY29uc3QgZ3JpZCA9IGdyaWRPYmouZ3JpZDtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG5cbiAgZnVuY3Rpb24gY29ubmVjdChub2RlMSwgbm9kZTIsIGJhcnJpZXJCZXR3ZWVuKSB7XG4gICAgbm9kZTEuc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgIG5vZGUyLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgICBiYXJyaWVyQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gIH1cblxuICBmb3IgKGxldCByb3cgPSAxOyByb3cgPCByb3dzOyByb3cgKz0gMikge1xuICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8IGNvbHM7IGNvbCArPSAyKSB7XG4gICAgICBjb25zdCBjdXJyZW50U3F1YXJlID0gZ3JpZFtyb3ddW2NvbF07XG4gICAgICBsZXQgbm9ydGhOZWlnaGJvcjtcbiAgICAgIGxldCB3ZXN0TmVpZ2hib3I7XG5cbiAgICAgIGlmIChyb3cgPiAxKSB7XG4gICAgICAgIG5vcnRoTmVpZ2hib3IgPSBncmlkW3JvdyAtIDJdW2NvbF07IC8vIHVwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub3J0aE5laWdoYm9yID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbCA+IDEpIHtcbiAgICAgICAgd2VzdE5laWdoYm9yID0gZ3JpZFtyb3ddW2NvbCAtIDJdOyAvLyBsZWZ0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3ZXN0TmVpZ2hib3IgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAobm9ydGhOZWlnaGJvciAmJiB3ZXN0TmVpZ2hib3IpIHtcbiAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgYm90aCBwYXRocyBhcmUgYXZhaWxhYmxlXG4gICAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICAgICAgICBpZiAocmFuZG9tID09PSAwKSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCBub3J0aE5laWdoYm9yLCBjdXJyZW50U3F1YXJlLm5laWdoYm9yc1szXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCB3ZXN0TmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzFdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgb25lIG9mIHRoZSBwYXRocyBnbyBiZXlvbmQgdGhlIGdyaWRcbiAgICAgICAgaWYgKHJvdyA9PT0gMSAmJiBjb2wgPiAxKSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCB3ZXN0TmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzFdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sID09PSAxICYmIHJvdyA+IDEpIHtcbiAgICAgICAgICBjb25uZWN0KGN1cnJlbnRTcXVhcmUsIG5vcnRoTmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzNdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZUh1bnRBbmRLaWxsKGdyaWRPYmosIGRlbGF5KSB7XG4gIC8vIHNldCB0aGUgZW50aXJlIGdyaWQgYXMgYmFycmllcnNcbiAgZ3JpZE9iai5maWxsR3JpZCgpO1xuXG4gIGNvbnN0IGdyaWQgPSBncmlkT2JqLmdyaWQ7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuICBjb25zdCB2aXNpdGVkID0gW107XG5cbiAgLy8gYWRkIG5laWdoYm9ycyAtIGRpcmVjdGx5IGFkamFjZW50IG5laWdoYm9ycyBhcmUgc2tpcHBlZCBzbyB0aGV5IGNhbiBiZSB3YWxscyBpZiBuZWVkZWRcbiAgZnVuY3Rpb24gZ2V0VW52aXNpdGVkTmVpZ2hib3JzKG5vZGUpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBjb25zdCByb3cgPSBub2RlLnJvdyAtIDE7XG4gICAgY29uc3QgY29sID0gbm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgIGlmICghdmlzaXRlZC5pbmNsdWRlcyhncmlkW3JvdyAtIDJdW2NvbF0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93IC0gMl1bY29sXSk7IC8vIHVwXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJvdyA8IHJvd3MgLSAyKSB7XG4gICAgICBpZiAoIXZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3cgKyAyXVtjb2xdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3JvdyArIDJdW2NvbF0pOyAvLyBkb3duXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbCA+IDEpIHtcbiAgICAgIGlmICghdmlzaXRlZC5pbmNsdWRlcyhncmlkW3Jvd11bY29sIC0gMl0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgLSAyXSk7IC8vIGxlZnRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29sIDwgY29scyAtIDIpIHtcbiAgICAgIGlmICghdmlzaXRlZC5pbmNsdWRlcyhncmlkW3Jvd11bY29sICsgMl0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgKyAyXSk7IC8vIHJpZ2h0XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5laWdoYm9ycztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZpc2l0ZWROZWlnaGJvcnMobm9kZSkge1xuICAgIGNvbnN0IG5laWdoYm9ycyA9IFtdO1xuICAgIGNvbnN0IHJvdyA9IG5vZGUucm93IC0gMTtcbiAgICBjb25zdCBjb2wgPSBub2RlLmNvbCAtIDE7XG5cbiAgICBpZiAocm93ID4gMSkge1xuICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3cgLSAyXVtjb2xdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3JvdyAtIDJdW2NvbF0pOyAvLyB1cFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyb3cgPCByb3dzIC0gMikge1xuICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3cgKyAyXVtjb2xdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3JvdyArIDJdW2NvbF0pOyAvLyBkb3duXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbCA+IDEpIHtcbiAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93XVtjb2wgLSAyXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCAtIDJdKTsgLy8gbGVmdFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2wgPCBjb2xzIC0gMikge1xuICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3ddW2NvbCArIDJdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3Jvd11bY29sICsgMl0pOyAvLyByaWdodFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZWlnaGJvcnM7XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21seVNlbGVjdE5laWdoYm9yKG5laWdoYm9ycykge1xuICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbmVpZ2hib3JzLmxlbmd0aCk7XG4gICAgcmV0dXJuIG5laWdoYm9yc1tpbmRleF07XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZVN0YXJ0UG9pbnQoKSB7XG4gICAgLy8gY2hvb3NlIGEgcmFuZG9tIHBvaW50IG9uIHRoZSBncmlkIHRvIHN0YXJ0IHdpdGhcbiAgICBsZXQgcmFuZG9tTm9kZUZvdW5kID0gZmFsc2U7XG4gICAgbGV0IHJhbmRvbUZpcnN0Tm9kZSA9IG51bGw7XG4gICAgd2hpbGUgKCFyYW5kb21Ob2RlRm91bmQpIHtcbiAgICAgIGNvbnN0IHJhbmRvbVJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChyb3dzIC0gNCkpICsgMjtcbiAgICAgIGNvbnN0IHJhbmRvbUNvbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChjb2xzIC0gNCkpICsgMjtcbiAgICAgIGlmIChyYW5kb21Sb3cgJSAyICE9PSAwICYmIHJhbmRvbUNvbCAlIDIgIT09IDApIHtcbiAgICAgICAgcmFuZG9tRmlyc3ROb2RlID0gZ3JpZFtyYW5kb21Sb3ddW3JhbmRvbUNvbF07XG4gICAgICAgIHJhbmRvbUZpcnN0Tm9kZS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgICAgIHJhbmRvbU5vZGVGb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByYW5kb21GaXJzdE5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVXYWxsQmV0d2VlbihjdXJyTm9kZSwgbmV4dE5vZGUpIHtcbiAgICBjb25zdCByb3cgPSBjdXJyTm9kZS5yb3cgLSAxO1xuICAgIGNvbnN0IGNvbCA9IGN1cnJOb2RlLmNvbCAtIDE7XG5cbiAgICBpZiAocm93ID4gMSkge1xuICAgICAgaWYgKGdyaWRbcm93IC0gMl1bY29sXSA9PT0gbmV4dE5vZGUpIHtcbiAgICAgICAgY29uc3Qgd2FsbEJldHdlZW4gPSBncmlkW3JvdyAtIDFdW2NvbF07XG4gICAgICAgIHdhbGxCZXR3ZWVuLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJvdyA8IHJvd3MgLSAyKSB7XG4gICAgICBpZiAoZ3JpZFtyb3cgKyAyXVtjb2xdID09PSBuZXh0Tm9kZSkge1xuICAgICAgICBjb25zdCB3YWxsQmV0d2VlbiA9IGdyaWRbcm93ICsgMV1bY29sXTtcbiAgICAgICAgd2FsbEJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY29sID4gMSkge1xuICAgICAgaWYgKGdyaWRbcm93XVtjb2wgLSAyXSA9PT0gbmV4dE5vZGUpIHtcbiAgICAgICAgY29uc3Qgd2FsbEJldHdlZW4gPSBncmlkW3Jvd11bY29sIC0gMV07XG4gICAgICAgIHdhbGxCZXR3ZWVuLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvbCA8IGNvbHMgLSAyKSB7XG4gICAgICBpZiAoZ3JpZFtyb3ddW2NvbCArIDJdID09PSBuZXh0Tm9kZSkge1xuICAgICAgICBjb25zdCB3YWxsQmV0d2VlbiA9IGdyaWRbcm93XVtjb2wgKyAxXTtcbiAgICAgICAgd2FsbEJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGN1cnJOb2RlLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgICBuZXh0Tm9kZS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBhbGdvcml0aG0oKSB7XG4gICAgbGV0IGN1cnJlbnROb2RlID0gZ2VuZXJhdGVTdGFydFBvaW50KCk7IC8vIGdldCBzdGFydCBub2RlXG5cbiAgICB3aGlsZSAoY3VycmVudE5vZGUpIHtcbiAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgIH1cbiAgICAgIHZpc2l0ZWQucHVzaChjdXJyZW50Tm9kZSk7XG4gICAgICBjb25zdCBuZWlnaGJvcnMgPSBnZXRVbnZpc2l0ZWROZWlnaGJvcnMoY3VycmVudE5vZGUpO1xuXG4gICAgICBpZiAobmVpZ2hib3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgbmV4dE5vZGUgPSByYW5kb21seVNlbGVjdE5laWdoYm9yKG5laWdoYm9ycyk7XG4gICAgICAgIHJlbW92ZVdhbGxCZXR3ZWVuKGN1cnJlbnROb2RlLCBuZXh0Tm9kZSk7XG4gICAgICAgIGN1cnJlbnROb2RlID0gbmV4dE5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZSA9IG51bGw7XG5cbiAgICAgICAgZm9yIChsZXQgcm93ID0gMTsgcm93IDwgcm93cyAtIDE7IHJvdyArPSAyKSB7XG4gICAgICAgICAgZm9yIChsZXQgY29sID0gMTsgY29sIDwgY29scyAtIDE7IGNvbCArPSAyKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gZ3JpZFtyb3ddW2NvbF07XG4gICAgICAgICAgICBjb25zdCB2aXNpdGVkTm9kZU5laWdoYm9ycyA9IGdldFZpc2l0ZWROZWlnaGJvcnMobm9kZSk7XG4gICAgICAgICAgICBpZiAoIXZpc2l0ZWQuaW5jbHVkZXMobm9kZSkgJiYgdmlzaXRlZE5vZGVOZWlnaGJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBjdXJyZW50Tm9kZSA9IG5vZGU7XG4gICAgICAgICAgICAgIGNvbnN0IHJhbmRvbWx5U2VsZWN0ZWROZWlnaGJvciA9IHJhbmRvbWx5U2VsZWN0TmVpZ2hib3IodmlzaXRlZE5vZGVOZWlnaGJvcnMpO1xuICAgICAgICAgICAgICByZW1vdmVXYWxsQmV0d2VlbihjdXJyZW50Tm9kZSwgcmFuZG9tbHlTZWxlY3RlZE5laWdoYm9yKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50Tm9kZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGFsZ29yaXRobSgpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVQcmltcyhncmlkT2JqLCBkZWxheSkge1xuICAvLyBzZXQgdGhlIGVudGlyZSBncmlkIGFzIGJhcnJpZXJzXG4gIGdyaWRPYmouZmlsbEdyaWQoKTtcblxuICBjb25zdCBncmlkID0gZ3JpZE9iai5ncmlkO1xuICBjb25zdCByb3dzID0gZ3JpZC5sZW5ndGg7XG4gIGNvbnN0IGNvbHMgPSBncmlkWzBdLmxlbmd0aDtcbiAgY29uc3QgZnJvbnRpZXIgPSBbXTtcbiAgY29uc3QgdmlzaXRlZCA9IG5ldyBTZXQoKTtcblxuICAvLyBhZGQgbmVpZ2hib3JzIC0gZGlyZWN0bHkgYWRqYWNlbnQgbmVpZ2hib3JzIGFyZSBza2lwcGVkIHNvIHRoZXkgY2FuIGJlIHdhbGxzIGlmIG5lZWRlZFxuICBmdW5jdGlvbiBnZXROZWlnaGJvcnMobm9kZSkge1xuICAgIGNvbnN0IG5laWdoYm9ycyA9IFtdO1xuICAgIGNvbnN0IHJvdyA9IG5vZGUucm93IC0gMTtcbiAgICBjb25zdCBjb2wgPSBub2RlLmNvbCAtIDE7XG5cbiAgICBpZiAocm93ID4gMSkgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgLSAyXVtjb2xdKTsgLy8gdXBcblxuICAgIGlmIChyb3cgPCByb3dzIC0gMikgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgKyAyXVtjb2xdKTsgLy8gZG93blxuXG4gICAgaWYgKGNvbCA+IDEpIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgLSAyXSk7IC8vIGxlZnRcblxuICAgIGlmIChjb2wgPCBjb2xzIC0gMikgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCArIDJdKTsgLy8gcmlnaHRcblxuICAgIHJldHVybiBuZWlnaGJvcnM7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRXYWxsQmV0d2Vlbihub2RlLCBuZWlnaGJvcikge1xuICAgIGNvbnN0IHJvdyA9IG5vZGUucm93IC0gMTtcbiAgICBjb25zdCBjb2wgPSBub2RlLmNvbCAtIDE7XG5cbiAgICBpZiAocm93ID4gMSkge1xuICAgICAgaWYgKGdyaWRbcm93IC0gMl1bY29sXSA9PT0gbmVpZ2hib3IpIHJldHVybiBncmlkW3JvdyAtIDFdW2NvbF07IC8vIHVwXG4gICAgfVxuICAgIGlmIChyb3cgPCByb3dzIC0gMikge1xuICAgICAgaWYgKGdyaWRbcm93ICsgMl1bY29sXSA9PT0gbmVpZ2hib3IpIHJldHVybiBncmlkW3JvdyArIDFdW2NvbF07IC8vIGRvd25cbiAgICB9XG4gICAgaWYgKGNvbCA+IDEpIHtcbiAgICAgIGlmIChncmlkW3Jvd11bY29sIC0gMl0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3ddW2NvbCAtIDFdOyAvLyBsZWZ0XG4gICAgfVxuICAgIGlmIChjb2wgPCBjb2xzIC0gMikge1xuICAgICAgaWYgKGdyaWRbcm93XVtjb2wgKyAyXSA9PT0gbmVpZ2hib3IpIHJldHVybiBncmlkW3Jvd11bY29sICsgMV07IC8vIHJpZ2h0XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBjb25uZWN0KG5vZGUxLCBub2RlMiwgd2FsbEJldHdlZW4pIHtcbiAgICBub2RlMS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgbm9kZTIuc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgIHdhbGxCZXR3ZWVuLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgfVxuXG4gIC8vIGNob29zZSBhIHJhbmRvbSBwb2ludCBvbiB0aGUgZ3JpZCB0byBzdGFydCB3aXRoXG4gIGxldCByYW5kb21GaXJzdE5vZGUgPSBudWxsO1xuICB3aGlsZSAocmFuZG9tRmlyc3ROb2RlID09PSBudWxsKSB7XG4gICAgY29uc3QgcmFuZG9tUm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHJvd3MgLSA0KSkgKyAyO1xuICAgIGNvbnN0IHJhbmRvbUNvbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChjb2xzIC0gNCkpICsgMjtcbiAgICBpZiAocmFuZG9tUm93ICUgMiAhPT0gMCAmJiByYW5kb21Db2wgJSAyICE9PSAwKSB7XG4gICAgICByYW5kb21GaXJzdE5vZGUgPSBncmlkW3JhbmRvbVJvd11bcmFuZG9tQ29sXTtcbiAgICAgIHJhbmRvbUZpcnN0Tm9kZS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgICB2aXNpdGVkLmFkZChyYW5kb21GaXJzdE5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXJ0Tm9kZU5laWdoYm9ycyA9IGdldE5laWdoYm9ycyhyYW5kb21GaXJzdE5vZGUpO1xuICBzdGFydE5vZGVOZWlnaGJvcnMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgIGlmIChub2RlKSB7XG4gICAgICBmcm9udGllci5wdXNoKG5vZGUpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2hpbGUgKGZyb250aWVyLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGZyb250aWVyLmxlbmd0aCk7XG4gICAgY29uc3QgcmFuZG9tRnJvbnRpZXJOb2RlID0gZnJvbnRpZXJbcmFuZG9tSW5kZXhdO1xuICAgIGNvbnN0IGZyb250aWVyTmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKHJhbmRvbUZyb250aWVyTm9kZSk7XG5cbiAgICAvLyBmaW5kIG91dCB3aGljaCAnaW4nIG5vZGVzIChwYXJ0IG9mIG1hemUpIGFyZSBhZGphY2VudFxuICAgIGNvbnN0IGFkamFjZW50SW5zID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcm9udGllck5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZpc2l0ZWQuaGFzKGZyb250aWVyTmVpZ2hib3JzW2ldKSkge1xuICAgICAgICBhZGphY2VudElucy5wdXNoKGZyb250aWVyTmVpZ2hib3JzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjaG9vc2UgYSByYW5kb20gYWRqYWNlbnQgbm9kZSBhbmQgY29ubmVjdCB0aGF0IHdpdGggdGhlIGZyb250aWVyIG5vZGVcbiAgICBjb25zdCByYW5kb21BZGphY2VudEluID0gYWRqYWNlbnRJbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYWRqYWNlbnRJbnMubGVuZ3RoKV07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGphY2VudElucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFkamFjZW50SW5zW2ldID09PSByYW5kb21BZGphY2VudEluKSB7XG4gICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHdhbGxCZXR3ZWVuID0gZ2V0V2FsbEJldHdlZW4ocmFuZG9tRnJvbnRpZXJOb2RlLCByYW5kb21BZGphY2VudEluKTtcbiAgICAgICAgY29uc3QgaW5kZXhUb1NwbGljZSA9IGZyb250aWVyLmluZGV4T2YocmFuZG9tRnJvbnRpZXJOb2RlKTtcbiAgICAgICAgY29ubmVjdChyYW5kb21Gcm9udGllck5vZGUsIHJhbmRvbUFkamFjZW50SW4sIHdhbGxCZXR3ZWVuKTtcbiAgICAgICAgdmlzaXRlZC5hZGQocmFuZG9tRnJvbnRpZXJOb2RlKTtcbiAgICAgICAgZnJvbnRpZXIuc3BsaWNlKGluZGV4VG9TcGxpY2UsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdldCB0aGUgbmVpZ2hib3JzIG9mIHRoZSBmcm9udGllciBub2RlIGFuZCBhZGQgdGhlbSB0byBmcm9udGllciBsaXN0XG4gICAgY29uc3QgbmVpZ2hib3JzVG9BZGQgPSBnZXROZWlnaGJvcnMocmFuZG9tRnJvbnRpZXJOb2RlKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5laWdoYm9yc1RvQWRkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobmVpZ2hib3JzVG9BZGRbaV0pIHtcbiAgICAgICAgaWYgKCF2aXNpdGVkLmhhcyhuZWlnaGJvcnNUb0FkZFtpXSkgJiYgIWZyb250aWVyLmluY2x1ZGVzKG5laWdoYm9yc1RvQWRkW2ldKSkge1xuICAgICAgICAgIGZyb250aWVyLnB1c2gobmVpZ2hib3JzVG9BZGRbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcmFuZG9tTWFwKGdyaWRPYmosIGRlbGF5KSB7XG4gIGNvbnN0IGdyaWQgPSBncmlkT2JqLmdyaWQ7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCByb3dzOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgaWYgKHJhbmRvbSA8IDAuMykge1xuICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicsIGRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7IC8vIG1hemUgZ2VuZXJhdGlvbiBmaW5pc2hlZFxufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcmVjdXJzaXZlRGl2aXNpb24oZ3JpZE9iaiwgZGVsYXkpIHtcbiAgY29uc3QgZ3JpZCA9IGdyaWRPYmouZ3JpZDtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG4gIGxldCBpc0ZpbmlzaGVkID0gZmFsc2U7IC8vIGlzIHJlY3Vyc2l2ZSBwcm9jZXNzIGZpbmlzaGVkP1xuXG4gIGZ1bmN0aW9uIHJhbmRvbUV2ZW4oYSwgYikge1xuICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChiIC0gYSArIDEpKSArIGE7XG4gICAgcmV0dXJuIHJhbmRvbSAlIDIgPT09IDAgPyByYW5kb20gOiByYW5kb20gKyAxO1xuICB9XG5cbiAgZnVuY3Rpb24gcmFuZG9tT2RkKGEsIGIpIHtcbiAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoYiAtIGEgKyAxKSkgKyBhO1xuICAgIHJldHVybiByYW5kb20gJSAyICE9PSAwID8gcmFuZG9tIDogcmFuZG9tICsgMTtcbiAgfVxuXG4gIC8vIGNob29zZSB0byBwbGFjZSB3YWxsIHZlcnRpY2FsbHkgb3IgaG9yaXpvbnRhbGx5XG4gIGZ1bmN0aW9uIGNob29zZU9yaWVudGF0aW9uKHN0YXJ0Um93LCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpIHtcbiAgICBjb25zdCB3aWR0aCA9IGVuZENvbCAtIHN0YXJ0Q29sO1xuICAgIGNvbnN0IGhlaWdodCA9IGVuZFJvdyAtIHN0YXJ0Um93O1xuICAgIGlmICh3aWR0aCA+IGhlaWdodCkgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgaWYgKHdpZHRoIDwgaGVpZ2h0KSByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgIGlmICh3aWR0aCA9PT0gaGVpZ2h0KSB7XG4gICAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgIHJldHVybiByYW5kb20gPT09IDAgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIHNldCBlZGdlcyBvZiBncmlkIGFzIGJhcnJpZXJzXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHJvd3M7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgY29sKyspIHtcbiAgICAgIGlmIChyb3cgPT09IDAgfHwgcm93ID09PSByb3dzIC0gMSB8fCBjb2wgPT09IDAgfHwgY29sID09PSBjb2xzIC0gMSkge1xuICAgICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicsIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHRoZSByZWN1cnNpdmUgZnVuY3Rpb24gdG8gZGl2aWRlIHRoZSBncmlkXG4gIGFzeW5jIGZ1bmN0aW9uIGRpdmlkZShzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgZW5kQ29sKSB7XG4gICAgaWYgKGVuZENvbCAtIHN0YXJ0Q29sIDwgMSB8fCBlbmRSb3cgLSBzdGFydFJvdyA8IDEpIHtcbiAgICAgIC8vIGJhc2UgY2FzZSBpZiBzdWItbWF6ZSBpcyB0b28gc21hbGxcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3YWxsUm93ID0gcmFuZG9tRXZlbihzdGFydFJvdyArIDEsIGVuZFJvdyAtIDEpO1xuICAgIGNvbnN0IHdhbGxDb2wgPSByYW5kb21FdmVuKHN0YXJ0Q29sICsgMSwgZW5kQ29sIC0gMSk7XG5cbiAgICBjb25zdCBwYXNzYWdlUm93ID0gcmFuZG9tT2RkKHN0YXJ0Um93LCBlbmRSb3cpO1xuICAgIGNvbnN0IHBhc3NhZ2VDb2wgPSByYW5kb21PZGQoc3RhcnRDb2wsIGVuZENvbCk7XG5cbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGNob29zZU9yaWVudGF0aW9uKHN0YXJ0Um93LCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpO1xuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIC8vIG1ha2UgYSBob3Jpem9udGFsIHdhbGxcbiAgICAgIGZvciAobGV0IGNvbCA9IHN0YXJ0Q29sOyBjb2wgPD0gZW5kQ29sOyBjb2wrKykge1xuICAgICAgICBpZiAoY29sICE9PSBwYXNzYWdlQ29sKSB7XG4gICAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZ3JpZFt3YWxsUm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJywgZGVsYXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgLy8gbWFrZSBhIHZlcnRpY2FsIHdhbGxcbiAgICAgIGZvciAobGV0IHJvdyA9IHN0YXJ0Um93OyByb3cgPD0gZW5kUm93OyByb3crKykge1xuICAgICAgICBpZiAocm93ICE9PSBwYXNzYWdlUm93KSB7XG4gICAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZ3JpZFtyb3ddW3dhbGxDb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJywgZGVsYXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgd2FsbFJvdyAtIDEsIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgICAgYXdhaXQgZGl2aWRlKHdhbGxSb3cgKyAxLCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgZW5kUm93LCB3YWxsQ29sICsgMSwgZW5kQ29sKTtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgd2FsbENvbCAtIDEpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgdGhlIGxhc3QgcmVjdXJzaXZlIGNhbGxcbiAgICBpZiAoc3RhcnRSb3cgPT09IDEgJiYgZW5kUm93ID09PSByb3dzIC0gMiAmJiBzdGFydENvbCA9PT0gMSAmJiBlbmRDb2wgPT09IGNvbHMgLSAyKSB7XG4gICAgICBpc0ZpbmlzaGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBhd2FpdCBkaXZpZGUoMSwgcm93cyAtIDIsIDEsIGNvbHMgLSAyKTtcblxuICByZXR1cm4gaXNGaW5pc2hlZDsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzaWRld2luZGVyKGdyaWRPYmosIGRlbGF5KSB7XG4gIGdyaWRPYmouZmlsbEdyaWQoKTsgLy8gc2V0IHRoZSBncmlkIGFzIHdhbGxzXG5cbiAgY29uc3QgZ3JpZCA9IGdyaWRPYmouZ3JpZDtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG5cbiAgLy8gbGVhdmUgZmlyc3Qgcm93IGVtcHR5XG4gIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgaWYgKGNvbCAhPT0gMCAmJiBjb2wgIT09IGNvbHMgLSAxKSB7XG4gICAgICBncmlkWzFdW2NvbF0uc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8IHJvd3M7IHJvdyArPSAyKSB7XG4gICAgbGV0IHJ1biA9IFtdO1xuICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8IGNvbHM7IGNvbCArPSAyKSB7XG4gICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGdyaWRbcm93XVtjb2xdO1xuICAgICAgY3VycmVudE5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgICAgcnVuLnB1c2goY3VycmVudE5vZGUpO1xuXG4gICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNiAmJiBjb2wgIT09IGNvbHMgLSAyKSB7XG4gICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnROb2RlLm5laWdoYm9yc1swXS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgICB9IGVsc2UgaWYgKHJ1bi5sZW5ndGggPiAwICYmIHJvdyA+IDEpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBydW4ubGVuZ3RoKTtcbiAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgcnVuW3JhbmRvbUluZGV4XS5uZWlnaGJvcnNbM10uc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgICAgICBydW4gPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7IC8vIG1hemUgZ2VuZXJhdGlvbiBmaW5pc2hlZFxufVxuIiwiaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb21oYW5kbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHJvdywgY29sLCB0b3RhbFJvd3MsIHRvdGFsQ29scywgZ3JpZCwgbm9kZVNpemUpIHtcbiAgICB0aGlzLm5vZGVTaXplID0gbnVsbDsgLy8gaG9sZHMgcHggdmFsdWUgb2Ygbm9kZSB3aWR0aCBhbmQgaGVpZ2h0XG4gICAgdGhpcy5zZXROb2RlV2lkdGgobm9kZVNpemUpO1xuICAgIHRoaXMudG90YWxSb3dzID0gdG90YWxSb3dzO1xuICAgIHRoaXMudG90YWxDb2xzID0gdG90YWxDb2xzO1xuICAgIHRoaXMucm93ID0gcm93O1xuICAgIHRoaXMuY29sID0gY29sO1xuICAgIHRoaXMueSA9IHRoaXMucm93ICogdGhpcy5ub2RlU2l6ZTtcbiAgICB0aGlzLnggPSB0aGlzLmNvbCAqIHRoaXMubm9kZVNpemU7XG4gICAgdGhpcy5ub2RlVHlwZSA9ICdlbXB0eSc7IC8vIHVzZWQgdG8gdXBkYXRlIHNxdWFyZSBkaXNwbGF5IG9uIGRvbSBlLmcgc3RhcnQsIGVuZCBvciBiYXJyaWVyXG4gICAgdGhpcy5uZWlnaGJvcnMgPSBbXTtcbiAgICB0aGlzLnByZXZpb3VzTm9kZSA9IG51bGw7XG4gICAgdGhpcy5ncmlkID0gZ3JpZDtcblxuICAgIC8vIHVzZWQgZm9yIEFzdGFyIGFuZCBEaWpza3RyYVxuICAgIHRoaXMuZiA9IDA7XG4gICAgdGhpcy5nID0gMDtcbiAgICB0aGlzLmggPSAwO1xuICB9XG5cbiAgLy8gYWRqdXN0IHNpemUgb2Ygbm9kZSBpbiBweFxuICBzZXROb2RlV2lkdGgobm9kZVNpemUpIHtcbiAgICBpZiAobm9kZVNpemUgPT09ICdzbWFsbCcpIHtcbiAgICAgIHRoaXMubm9kZVNpemUgPSA1MDtcbiAgICB9IGVsc2UgaWYgKG5vZGVTaXplID09PSAnbWVkaXVtJykge1xuICAgICAgdGhpcy5ub2RlU2l6ZSA9IDMwO1xuICAgIH0gZWxzZSBpZiAobm9kZVNpemUgPT09ICdsYXJnZScpIHtcbiAgICAgIHRoaXMubm9kZVNpemUgPSAyMDtcbiAgICB9XG4gIH1cblxuICAvLyBjaGFuZ2Ugbm9kZSB0eXBlIGUuZyBiYXJyaWVyLCBzdGFydCwgZW5kLCBvcGVuLWxpc3QsIGNsb3NlZC1saXN0XG4gIHNldE5vZGVUeXBlKG5ld05vZGVUeXBlLCBkZWxheSkge1xuICAgIERvbUhhbmRsZXIuZGlzcGxheU5vZGUodGhpcywgdGhpcy5ub2RlVHlwZSwgbmV3Tm9kZVR5cGUsIHRoaXMuZ3JpZCwgZGVsYXkpO1xuICAgIHRoaXMubm9kZVR5cGUgPSBuZXdOb2RlVHlwZTtcbiAgfVxuXG4gIC8vIGNhbGMgZiwgZyBhbmQgaCBzY29yZXNcbiAgY2FsY1Njb3JlcyhzdGFydE5vZGUsIGVuZE5vZGUpIHtcbiAgICB0aGlzLmcgPSBNYXRoLmFicyh0aGlzLnggLSBzdGFydE5vZGUueCkgKyBNYXRoLmFicyh0aGlzLnkgLSBzdGFydE5vZGUueSk7XG4gICAgdGhpcy5oID0gTWF0aC5hYnModGhpcy54IC0gZW5kTm9kZS54KSArIE1hdGguYWJzKHRoaXMueSAtIGVuZE5vZGUueSk7XG4gICAgdGhpcy5mID0gdGhpcy5nICsgdGhpcy5oO1xuICAgIHJldHVybiB0aGlzLmY7XG4gIH1cblxuICAvLyBzZXQgbmVpZ2hib3JzIGZvciBjdXJyZW50IG5vZGUgKG5vIGRpYWdvbmFscylcbiAgc2V0TmVpZ2hib3JzKGdyaWQpIHtcbiAgICBjb25zdCB0ZW1wUm93ID0gdGhpcy5yb3cgLSAxO1xuICAgIGNvbnN0IHRlbXBDb2wgPSB0aGlzLmNvbCAtIDE7XG5cbiAgICBpZiAodGVtcENvbCA8IHRoaXMudG90YWxDb2xzIC0gMSkge1xuICAgICAgLy8gcmlnaHRcbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93XVt0ZW1wQ29sICsgMV0pO1xuICAgIH1cblxuICAgIGlmICh0ZW1wQ29sID4gMCkge1xuICAgICAgLy8gbGVmdFxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3ddW3RlbXBDb2wgLSAxXSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbXBSb3cgPCB0aGlzLnRvdGFsUm93cyAtIDEpIHtcbiAgICAgIC8vIGRvd25cbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93ICsgMV1bdGVtcENvbF0pO1xuICAgIH1cblxuICAgIGlmICh0ZW1wUm93ID4gMCkge1xuICAgICAgLy8gdXBcbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93IC0gMV1bdGVtcENvbF0pO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vc2Nzcy9tYWluLnNjc3MnO1xuaW1wb3J0IGxvYWQgZnJvbSAnLi9tYWluaGFuZGxlcic7XG5cbmxvYWQoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
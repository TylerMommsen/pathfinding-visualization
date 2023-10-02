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
  const done = await algorithm(startNode, endNode, pathfindingSpeed);

  if (done) running[0] = false;
}

// run maze generation algorithm
async function generateMaze(mazeGenerationAlgorithm) {
  if (running[0] || mazeGenerationAlgorithm === null) return;
  running[0] = true;
  gridObj.resetGrid();

  const maze = _mazefactory__WEBPACK_IMPORTED_MODULE_2__["default"].createMaze(mazeGenerationAlgorithm);
  const done = await maze(gridObj, mazeSpeed);

  if (done) running[0] = false;
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
        grid[row][col].setNodeType('barrier', delay);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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REFBZ0I7QUFDcEM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWUsb0RBQVc7QUFDMUI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxpQkFBaUI7QUFDdkU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELGlCQUFpQjtBQUM5RTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxpQkFBaUI7QUFDL0Q7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4VDBEO0FBQ2Q7QUFDQTtBQUNGO0FBQ1k7QUFDWjs7QUFFMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsZ0VBQWlCO0FBQzdDLHFCQUFxQix5REFBVTtBQUMvQixrQkFBa0IseURBQVU7QUFDNUIsZ0JBQWdCLG9EQUFhO0FBQzdCLHFCQUFxQiwwREFBbUI7QUFDeEMsb0JBQW9CLHdEQUFTO0FBQzdCOztBQUVBOztBQUVBO0FBQ0Esb0NBQW9DLGNBQWM7QUFDbEQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlFQUFlLFdBQVcsRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDN0JaO0FBQ2Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsWUFBWTtBQUNoQyxzQkFBc0IsWUFBWTtBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0Q0FBNEM7QUFDNUMsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMkM7QUFDM0MsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmOzs7Ozs7Ozs7Ozs7Ozs7QUN2RGU7QUFDZjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNENBQTRDOztBQUU1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7O0FBRUEsMEJBQTBCLGdCQUFnQjtBQUMxQyw0QkFBNEIsZ0JBQWdCO0FBQzVDO0FBQ0E7QUFD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SUFBSSxtREFBVTtBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDekVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTjBCO0FBQ087O0FBRWpDLHdEQUFJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9zY3NzL21haW4uc2NzcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2FsZ29yaXRobWZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9hbGdvcml0aG1zL2FzdGFyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvYWxnb3JpdGhtcy9iaWRpcmVjdGlvbmFsLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvYWxnb3JpdGhtcy9kaWprc3RyYS5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2RvbWhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9ncmlkLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWFpbmhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplZmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL2JpbmFyeXRyZWUuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9odW50YW5ka2lsbC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL3ByaW1zLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvcmFuZG9tbWFwLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvcmVjdXJzaXZlZGl2aXNpb24uanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9zaWRld2luZGVyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbm9kZS5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgcnVuQmlkaXJlY3Rpb25hbCBmcm9tICcuL2FsZ29yaXRobXMvYmlkaXJlY3Rpb25hbCc7XG5pbXBvcnQgcnVuQXN0YXIgZnJvbSAnLi9hbGdvcml0aG1zL2FzdGFyJztcbmltcG9ydCBydW5EaWprc3RyYSBmcm9tICcuL2FsZ29yaXRobXMvZGlqa3N0cmEnO1xuXG5jbGFzcyBBbGdvcml0aG1GYWN0b3J5IHtcbiAgc3RhdGljIGNyZWF0ZUFsZ29yaXRobShhbGdvcml0aG1OYW1lKSB7XG4gICAgLy8gTWFwIGFsZ29yaXRobSBuYW1lcyB0byB0aGVpciBjb3JyZXNwb25kaW5nIGltcGxlbWVudGF0aW9uc1xuICAgIGNvbnN0IGFsZ29yaXRobXMgPSB7XG4gICAgICAnQSonOiBydW5Bc3RhcixcbiAgICAgIERpamtzdHJhOiBydW5EaWprc3RyYSxcbiAgICAgIEJpZGlyZWN0aW9uYWw6IHJ1bkJpZGlyZWN0aW9uYWwsXG4gICAgfTtcblxuICAgIGNvbnN0IEFsZ29yaXRobUNsYXNzID0gYWxnb3JpdGhtc1thbGdvcml0aG1OYW1lXTtcblxuICAgIGlmICghQWxnb3JpdGhtQ2xhc3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQWxnb3JpdGhtIFwiJHthbGdvcml0aG1OYW1lfVwiIG5vdCBmb3VuZGApO1xuICAgIH1cblxuICAgIHJldHVybiBBbGdvcml0aG1DbGFzcztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBbGdvcml0aG1GYWN0b3J5O1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcnVuQXN0YXIoc3RhcnROb2RlLCBlbmROb2RlLCBkZWxheSkge1xuICBjb25zdCBvcGVuTGlzdCA9IFtdO1xuICBjb25zdCBjbG9zZWRMaXN0ID0gW107XG4gIGNvbnN0IGZpbmFsUGF0aCA9IFtdO1xuXG4gIGZ1bmN0aW9uIHJlbW92ZUZyb21BcnIobm9kZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3Blbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChvcGVuTGlzdFtpXSA9PT0gbm9kZSkge1xuICAgICAgICBvcGVuTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gZGlzcGxheUZpbmFsUGF0aChwYXRoKSB7XG4gICAgZm9yIChsZXQgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChwYXRoW2ldLm5vZGVUeXBlICE9PSAnc3RhcnQnICYmIHBhdGhbaV0ubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwKSk7XG4gICAgICAgIHBhdGhbaV0uc2V0Tm9kZVR5cGUoJ2ZpbmFsLXBhdGgnLCBkZWxheSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3Blbkxpc3QucHVzaChzdGFydE5vZGUpO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGFsZ29yaXRobSgpIHtcbiAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgIH1cbiAgICBsZXQgY3VycmVudE5vZGUgPSBudWxsO1xuICAgIGxldCBsb3dlc3RGID0gSW5maW5pdHk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcGVuTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgb3Blbkxpc3RbaV0uY2FsY1Njb3JlcyhzdGFydE5vZGUsIGVuZE5vZGUpO1xuICAgICAgaWYgKG9wZW5MaXN0W2ldLmYgPCBsb3dlc3RGKSB7XG4gICAgICAgIGxvd2VzdEYgPSBvcGVuTGlzdFtpXS5mO1xuICAgICAgICBjdXJyZW50Tm9kZSA9IG9wZW5MaXN0W2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gZW5kTm9kZSkge1xuICAgICAgbGV0IHRlbXAgPSBjdXJyZW50Tm9kZTtcbiAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXApO1xuICAgICAgd2hpbGUgKHRlbXAucHJldmlvdXNOb2RlKSB7XG4gICAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXAucHJldmlvdXNOb2RlKTtcbiAgICAgICAgdGVtcCA9IHRlbXAucHJldmlvdXNOb2RlO1xuICAgICAgfVxuICAgICAgYXdhaXQgZGlzcGxheUZpbmFsUGF0aChmaW5hbFBhdGgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY2xvc2VkTGlzdC5wdXNoKGN1cnJlbnROb2RlKTtcbiAgICBpZiAoY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnY2xvc2VkLWxpc3QnLCBkZWxheSk7XG4gICAgfVxuICAgIHJlbW92ZUZyb21BcnIoY3VycmVudE5vZGUpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZS5uZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGN1cnJOZWlnaGJvciA9IGN1cnJlbnROb2RlLm5laWdoYm9yc1tpXTtcblxuICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ2JhcnJpZXInICYmICFjbG9zZWRMaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgY29uc3QgdGVtcEcgPSBjdXJyZW50Tm9kZS5nICsgMTtcbiAgICAgICAgaWYgKG9wZW5MaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgICBpZiAodGVtcEcgPCBjdXJyTmVpZ2hib3IuZykge1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSB0ZW1wRztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSB0ZW1wRztcbiAgICAgICAgICBvcGVuTGlzdC5wdXNoKGN1cnJOZWlnaGJvcik7XG4gICAgICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ3N0YXJ0JyAmJiBjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3Iuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcsIGRlbGF5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyTmVpZ2hib3IucHJldmlvdXNOb2RlID0gY3VycmVudE5vZGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wZW5MaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBhbGdvcml0aG0oKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gYWxnb3JpdGhtKCk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBydW5CaWRpcmVjdGlvbmFsKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgZGVsYXkpIHtcbiAgY29uc3QgdmlzaXRlZEZvcndhcmRzID0gbmV3IFNldCgpO1xuICBjb25zdCB2aXNpdGVkQmFja3dhcmRzID0gbmV3IFNldCgpO1xuXG4gIGNvbnN0IHF1ZXVlRm9yd2FyZHMgPSBbXTtcbiAgY29uc3QgcXVldWVCYWNrd2FyZHMgPSBbXTtcblxuICBhc3luYyBmdW5jdGlvbiBkaXNwbGF5RmluYWxQYXRoKGJhY2t3YXJkTm9kZSwgZm9yd2FyZE5vZGUpIHtcbiAgICBsZXQgcGF0aEZvcndhcmQgPSBbXTtcbiAgICBjb25zdCBwYXRoQmFja3dhcmQgPSBbXTtcblxuICAgIGxldCBub2RlID0gYmFja3dhcmROb2RlO1xuICAgIHBhdGhCYWNrd2FyZC5wdXNoKG5vZGUpO1xuICAgIHdoaWxlIChub2RlLnByZXZpb3VzTm9kZSkge1xuICAgICAgcGF0aEJhY2t3YXJkLnB1c2gobm9kZS5wcmV2aW91c05vZGUpO1xuICAgICAgbm9kZSA9IG5vZGUucHJldmlvdXNOb2RlO1xuICAgIH1cblxuICAgIGxldCBub2RlMiA9IGZvcndhcmROb2RlO1xuICAgIHBhdGhGb3J3YXJkLnB1c2gobm9kZTIpO1xuICAgIHdoaWxlIChub2RlMi5wcmV2aW91c05vZGUpIHtcbiAgICAgIHBhdGhGb3J3YXJkLnB1c2gobm9kZTIucHJldmlvdXNOb2RlKTtcbiAgICAgIG5vZGUyID0gbm9kZTIucHJldmlvdXNOb2RlO1xuICAgIH1cblxuICAgIGNvbnN0IHRlbXAgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gcGF0aEZvcndhcmQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRlbXAucHVzaChwYXRoRm9yd2FyZFtpXSk7XG4gICAgfVxuICAgIHBhdGhGb3J3YXJkID0gdGVtcDtcblxuICAgIGNvbnN0IGZpbmFsUGF0aCA9IHBhdGhGb3J3YXJkLmNvbmNhdChwYXRoQmFja3dhcmQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaW5hbFBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChmaW5hbFBhdGhbaV0ubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgZmluYWxQYXRoW2ldLm5vZGVUeXBlICE9PSAnZW5kJykge1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMCkpO1xuICAgICAgICBmaW5hbFBhdGhbaV0uc2V0Tm9kZVR5cGUoJ2ZpbmFsLXBhdGgnLCBkZWxheSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcXVldWVGb3J3YXJkcy5wdXNoKHN0YXJ0Tm9kZSk7XG4gIHF1ZXVlQmFja3dhcmRzLnB1c2goZW5kTm9kZSk7XG4gIHZpc2l0ZWRGb3J3YXJkcy5hZGQoc3RhcnROb2RlKTtcbiAgdmlzaXRlZEJhY2t3YXJkcy5hZGQoZW5kTm9kZSk7XG5cbiAgd2hpbGUgKHF1ZXVlRm9yd2FyZHMubGVuZ3RoID4gMCAmJiBxdWV1ZUJhY2t3YXJkcy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICB9XG5cbiAgICAvLyBmb3J3YXJkc1xuICAgIGNvbnN0IGN1cnJOb2RlRm9yd2FyZCA9IHF1ZXVlRm9yd2FyZHMuc2hpZnQoKTtcblxuICAgIGlmIChjdXJyTm9kZUZvcndhcmQgIT09IHN0YXJ0Tm9kZSkge1xuICAgICAgY3Vyck5vZGVGb3J3YXJkLnNldE5vZGVUeXBlKCdjbG9zZWQtbGlzdCcsIGRlbGF5KTtcbiAgICB9XG4gICAgY29uc3QgbmVpZ2hib3JzRm9yd2FyZCA9IGN1cnJOb2RlRm9yd2FyZC5uZWlnaGJvcnM7XG4gICAgbGV0IGN1cnJOZWlnaGJvckZvcndhcmQgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZWlnaGJvcnNGb3J3YXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjdXJyTmVpZ2hib3JGb3J3YXJkID0gbmVpZ2hib3JzRm9yd2FyZFtpXTtcbiAgICAgIGlmICh2aXNpdGVkQmFja3dhcmRzLmhhcyhjdXJyTmVpZ2hib3JGb3J3YXJkKSkge1xuICAgICAgICBkaXNwbGF5RmluYWxQYXRoKGN1cnJOZWlnaGJvckZvcndhcmQsIGN1cnJOb2RlRm9yd2FyZCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXZpc2l0ZWRGb3J3YXJkcy5oYXMoY3Vyck5laWdoYm9yRm9yd2FyZCkgJiYgIXF1ZXVlRm9yd2FyZHMuaW5jbHVkZXMoY3Vyck5laWdoYm9yRm9yd2FyZCkgJiYgY3Vyck5laWdoYm9yRm9yd2FyZC5ub2RlVHlwZSAhPT0gJ2JhcnJpZXInKSB7XG4gICAgICAgIHF1ZXVlRm9yd2FyZHMucHVzaChjdXJyTmVpZ2hib3JGb3J3YXJkKTtcbiAgICAgICAgY3Vyck5laWdoYm9yRm9yd2FyZC5wcmV2aW91c05vZGUgPSBjdXJyTm9kZUZvcndhcmQ7XG4gICAgICAgIGN1cnJOZWlnaGJvckZvcndhcmQuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcsIGRlbGF5KTtcbiAgICAgICAgdmlzaXRlZEZvcndhcmRzLmFkZChjdXJyTmVpZ2hib3JGb3J3YXJkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBiYWNrd2FyZHNcbiAgICBjb25zdCBjdXJyTm9kZUJhY2t3YXJkID0gcXVldWVCYWNrd2FyZHMuc2hpZnQoKTtcblxuICAgIGlmIChjdXJyTm9kZUJhY2t3YXJkICE9PSBlbmROb2RlKSB7XG4gICAgICBjdXJyTm9kZUJhY2t3YXJkLnNldE5vZGVUeXBlKCdjbG9zZWQtbGlzdCcsIGRlbGF5KTtcbiAgICB9XG4gICAgY29uc3QgbmVpZ2hib3JzQmFja3dhcmQgPSBjdXJyTm9kZUJhY2t3YXJkLm5laWdoYm9ycztcbiAgICBsZXQgY3Vyck5laWdoYm9yQmFja3dhcmQgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZWlnaGJvcnNCYWNrd2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgY3Vyck5laWdoYm9yQmFja3dhcmQgPSBuZWlnaGJvcnNCYWNrd2FyZFtpXTtcbiAgICAgIGlmICh2aXNpdGVkRm9yd2FyZHMuaGFzKGN1cnJOZWlnaGJvckJhY2t3YXJkKSkge1xuICAgICAgICBkaXNwbGF5RmluYWxQYXRoKGN1cnJOb2RlQmFja3dhcmQsIGN1cnJOZWlnaGJvckJhY2t3YXJkKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgIXZpc2l0ZWRCYWNrd2FyZHMuaGFzKGN1cnJOZWlnaGJvckJhY2t3YXJkKVxuICAgICAgICAmJiAhcXVldWVCYWNrd2FyZHMuaW5jbHVkZXMoY3Vyck5laWdoYm9yQmFja3dhcmQpXG4gICAgICAgICYmIGN1cnJOZWlnaGJvckJhY2t3YXJkLm5vZGVUeXBlICE9PSAnYmFycmllcidcbiAgICAgICkge1xuICAgICAgICBxdWV1ZUJhY2t3YXJkcy5wdXNoKGN1cnJOZWlnaGJvckJhY2t3YXJkKTtcbiAgICAgICAgY3Vyck5laWdoYm9yQmFja3dhcmQucHJldmlvdXNOb2RlID0gY3Vyck5vZGVCYWNrd2FyZDtcbiAgICAgICAgY3Vyck5laWdoYm9yQmFja3dhcmQuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcsIGRlbGF5KTtcbiAgICAgICAgdmlzaXRlZEJhY2t3YXJkcy5hZGQoY3Vyck5laWdoYm9yQmFja3dhcmQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJ1bkRpamtzdHJhKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgZGVsYXkpIHtcbiAgY29uc3Qgb3Blbkxpc3RRdWV1ZSA9IFtdOyAvLyB0cmFja3Mgbm9kZXMgdG8gdmlzaXRcbiAgY29uc3QgY2xvc2VkTGlzdCA9IFtdO1xuICBjb25zdCBmaW5hbFBhdGggPSBbXTtcblxuICBhc3luYyBmdW5jdGlvbiBkaXNwbGF5RmluYWxQYXRoKHBhdGgpIHtcbiAgICBmb3IgKGxldCBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKHBhdGhbaV0ubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgcGF0aFtpXS5ub2RlVHlwZSAhPT0gJ2VuZCcpIHtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMzApKTtcbiAgICAgICAgcGF0aFtpXS5zZXROb2RlVHlwZSgnZmluYWwtcGF0aCcsIGRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdGFydE5vZGUuZyA9IDA7XG4gIG9wZW5MaXN0UXVldWUucHVzaChzdGFydE5vZGUpO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGFsZ29yaXRobSgpIHtcbiAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgIH1cbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IG9wZW5MaXN0UXVldWUuc2hpZnQoKTtcbiAgICBpZiAoY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnY2xvc2VkLWxpc3QnLCBkZWxheSk7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnROb2RlID09PSBlbmROb2RlKSB7XG4gICAgICBsZXQgdGVtcCA9IGN1cnJlbnROb2RlO1xuICAgICAgZmluYWxQYXRoLnB1c2godGVtcCk7XG4gICAgICB3aGlsZSAodGVtcC5wcmV2aW91c05vZGUpIHtcbiAgICAgICAgZmluYWxQYXRoLnB1c2godGVtcC5wcmV2aW91c05vZGUpO1xuICAgICAgICB0ZW1wID0gdGVtcC5wcmV2aW91c05vZGU7XG4gICAgICB9XG4gICAgICBhd2FpdCBkaXNwbGF5RmluYWxQYXRoKGZpbmFsUGF0aCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnROb2RlLm5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY3Vyck5laWdoYm9yID0gY3VycmVudE5vZGUubmVpZ2hib3JzW2ldO1xuXG4gICAgICBpZiAoY3Vyck5laWdoYm9yLm5vZGVUeXBlICE9PSAnYmFycmllcicgJiYgIWNsb3NlZExpc3QuaW5jbHVkZXMoY3Vyck5laWdoYm9yKSkge1xuICAgICAgICBpZiAoY3Vyck5laWdoYm9yLmcgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSBjdXJyZW50Tm9kZS5nICsgMTtcbiAgICAgICAgICBjdXJyTmVpZ2hib3IucHJldmlvdXNOb2RlID0gY3VycmVudE5vZGU7XG4gICAgICAgICAgb3Blbkxpc3RRdWV1ZS5wdXNoKGN1cnJOZWlnaGJvcik7XG4gICAgICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ3N0YXJ0JyAmJiBjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3Iuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcsIGRlbGF5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3Blbkxpc3RRdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gYWxnb3JpdGhtKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGFsZ29yaXRobSgpO1xufVxuIiwiLy8gdXBkYXRlIHNxdWFyZSBkaXNwbGF5XG5mdW5jdGlvbiBkaXNwbGF5Tm9kZShub2RlLCBjdXJyTm9kZVR5cGUsIG5ld05vZGVUeXBlLCBncmlkLCBkZWxheSkge1xuICBjb25zdCBkb21TcXVhcmUgPSBncmlkLmZpbmREb21TcXVhcmUobm9kZS5yb3cgLSAxLCBub2RlLmNvbCAtIDEpO1xuXG4gIGlmIChkZWxheSAhPT0gMCkge1xuICAgIGRvbVNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlZCcpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbiAgICBkb21TcXVhcmUub2Zmc2V0V2lkdGg7XG4gICAgaWYgKG5ld05vZGVUeXBlICE9PSAnY2xvc2VkLWxpc3QnKSB7XG4gICAgICBkb21TcXVhcmUuY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZWQnKTtcbiAgICB9XG4gIH1cblxuICBkb21TcXVhcmUuY2xhc3NMaXN0LnRvZ2dsZShjdXJyTm9kZVR5cGUsIGZhbHNlKTtcbiAgZG9tU3F1YXJlLmNsYXNzTGlzdC50b2dnbGUobmV3Tm9kZVR5cGUsIHRydWUpO1xufVxuXG4vLyBmaWxsIGdyaWQgY29tcGxldGVseSB3aXRoIGJhcnJpZXJzXG5mdW5jdGlvbiBmaWxsR3JpZChncmlkLCBzcXVhcmVTaXplKSB7XG4gIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAvLyBDcmVhdGUgYSBkb2N1bWVudCBmcmFnbWVudCB0byBiYXRjaCB0aGUgdXBkYXRlc1xuICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICBncmlkQ29udGFpbmVyLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdncmlkLWNvbnRhaW5lcicpO1xuICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYCR7c3F1YXJlU2l6ZX0tZ3JpZGApO1xuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBjb25zdCBncmlkU3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2JhcnJpZXInKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZChgJHtzcXVhcmVTaXplfWApO1xuXG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChncmlkU3F1YXJlKTtcbiAgICB9XG4gIH1cblxuICAvLyBBcHBlbmQgdGhlIGVudGlyZSBmcmFnbWVudCB0byB0aGUgY29udGFpbmVyIGF0IG9uY2VcbiAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG59XG5cbi8vIGRpc3BsYXkgZnVsbCBncmlkXG5mdW5jdGlvbiBjcmVhdGVHcmlkKGdyaWQsIHNxdWFyZVNpemUpIHtcbiAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLWNvbnRhaW5lcicpO1xuICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gIC8vIENyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50IHRvIGJhdGNoIHRoZSB1cGRhdGVzXG4gIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gIGdyaWRDb250YWluZXIucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2dyaWQtY29udGFpbmVyJyk7XG4gIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LmFkZChgJHtzcXVhcmVTaXplfS1ncmlkYCk7XG5cbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgIGNvbnN0IGdyaWRTcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZChgJHtzcXVhcmVTaXplfWApO1xuXG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChncmlkU3F1YXJlKTtcbiAgICB9XG4gIH1cblxuICAvLyBBcHBlbmQgdGhlIGVudGlyZSBmcmFnbWVudCB0byB0aGUgY29udGFpbmVyIGF0IG9uY2VcbiAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG59XG5cbmNvbnN0IERvbUhhbmRsZXIgPSB7XG4gIGNyZWF0ZUdyaWQsXG4gIGZpbGxHcmlkLFxuICBkaXNwbGF5Tm9kZSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERvbUhhbmRsZXI7XG4iLCJpbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnO1xuaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb21oYW5kbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZCB7XG4gIGNvbnN0cnVjdG9yKHJvd3MsIGNvbHMsIG5vZGVXaWR0aCwgY3VycmVudGx5UnVubmluZykge1xuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5jb2xzID0gY29scztcbiAgICB0aGlzLm5vZGVXaWR0aCA9IG5vZGVXaWR0aDtcbiAgICB0aGlzLnN0YXJ0ID0geyBub2RlOiBudWxsIH07XG4gICAgdGhpcy5lbmQgPSB7IG5vZGU6IG51bGwgfTtcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICB0aGlzLm9wZW5MaXN0ID0gW107XG4gICAgdGhpcy5jbG9zZWRMaXN0ID0gW107XG4gICAgdGhpcy5maW5hbFBhdGggPSBbXTtcbiAgICB0aGlzLmNyZWF0ZUdyaWQodGhpcy5yb3dzLCB0aGlzLmNvbHMpO1xuICAgIHRoaXMuY3VycmVudGx5UnVubmluZyA9IGN1cnJlbnRseVJ1bm5pbmc7IC8vIGlzIGFuIGFsZ29yaXRobSBydW5uaW5nP1xuXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgdGhpcy5lcmFzZU1vZGVPbiA9IGZhbHNlO1xuICB9XG5cbiAgLy8gdXBkYXRlIHNxdWFyZSBub2RlIHR5cGUgYW5kIHVwZGF0ZSBjb3JyZXNwb25kaW5nIGRvbSBzcXVhcmVcbiAgc2V0U3F1YXJlU3RhdHVzKHJvdywgY29sKSB7XG4gICAgY29uc3QgY3VycmVudE5vZGUgPSB0aGlzLmdyaWRbcm93XVtjb2xdO1xuICAgIGlmICh0aGlzLmVyYXNlTW9kZU9uKSB7XG4gICAgICBpZiAoY3VycmVudE5vZGUgPT09IHRoaXMuc3RhcnQubm9kZSkgdGhpcy5zdGFydC5ub2RlID0gbnVsbDtcbiAgICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gdGhpcy5lbmQubm9kZSkgdGhpcy5lbmQubm9kZSA9IG51bGw7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdlbXB0eScpIHJldHVybjtcblxuICAgIGlmICh0aGlzLnN0YXJ0Lm5vZGUgPT09IG51bGwpIHtcbiAgICAgIGN1cnJlbnROb2RlLnNldE5vZGVUeXBlKCdzdGFydCcpO1xuICAgICAgdGhpcy5zdGFydC5ub2RlID0gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVuZC5ub2RlID09PSBudWxsKSB7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnZW5kJyk7XG4gICAgICB0aGlzLmVuZC5ub2RlID0gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnROb2RlLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW91c2VEb3duKHJvdywgY29sKSB7XG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnNldFNxdWFyZVN0YXR1cyhyb3csIGNvbCk7XG4gIH1cblxuICBoYW5kbGVNb3VzZU1vdmUocm93LCBjb2wpIHtcbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICB0aGlzLnNldFNxdWFyZVN0YXR1cyhyb3csIGNvbCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW91c2VVcCgpIHtcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIGZpbmQgc3F1YXJlIGluIHRoZSBkb21cbiAgZmluZERvbVNxdWFyZShyb3csIGNvbCkge1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyQ2hpbGRyZW4gPSBncmlkQ29udGFpbmVyLmNoaWxkcmVuO1xuICAgIGNvbnN0IGluZGV4ID0gcm93ICogdGhpcy5jb2xzICsgY29sO1xuICAgIHJldHVybiBncmlkQ29udGFpbmVyQ2hpbGRyZW5baW5kZXhdO1xuICB9XG5cbiAgYWRkTGlzdGVuZXJzKCkge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMucm93czsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgY29uc3QgZ3JpZFNxdWFyZSA9IHRoaXMuZmluZERvbVNxdWFyZShyb3csIGNvbCk7XG4gICAgICAgIGdyaWRTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRseVJ1bm5pbmdbMF0pIHJldHVybjtcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRG93bihyb3csIGNvbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBncmlkU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50bHlSdW5uaW5nWzBdKSByZXR1cm47XG4gICAgICAgICAgdGhpcy5oYW5kbGVNb3VzZU1vdmUocm93LCBjb2wpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVNb3VzZVVwKCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyB1c2VkIHRvIGNyZWF0ZSBncmlkIG9mIGVtcHR5IG9yIGJhcnJpZXIgc3F1YXJlc1xuICBjcmVhdGVHcmlkKHJvd3MsIGNvbHMpIHtcbiAgICBmb3IgKGxldCByb3cgPSAxOyByb3cgPD0gcm93czsgcm93KyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBbXTtcbiAgICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8PSBjb2xzOyBjb2wrKykge1xuICAgICAgICBjdXJyZW50Um93LnB1c2gobmV3IE5vZGUocm93LCBjb2wsIHRoaXMucm93cywgdGhpcy5jb2xzLCB0aGlzLCB0aGlzLm5vZGVXaWR0aCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5ncmlkLnB1c2goY3VycmVudFJvdyk7XG4gICAgfVxuICAgIERvbUhhbmRsZXIuY3JlYXRlR3JpZCh0aGlzLmdyaWQsIHRoaXMubm9kZVdpZHRoKTtcbiAgfVxuXG4gIC8vIGZpbGwgZ3JpZCBhcyBiYXJyaWVyc1xuICBmaWxsR3JpZCgpIHtcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICBmb3IgKGxldCByb3cgPSAxOyByb3cgPD0gdGhpcy5yb3dzOyByb3crKykge1xuICAgICAgY29uc3QgY3VycmVudFJvdyA9IFtdO1xuICAgICAgZm9yIChsZXQgY29sID0gMTsgY29sIDw9IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5ldyBOb2RlKHJvdywgY29sLCB0aGlzLnJvd3MsIHRoaXMuY29scywgdGhpcywgdGhpcy5ub2RlV2lkdGgpO1xuICAgICAgICBub2RlLm5vZGVUeXBlID0gJ2JhcnJpZXInO1xuICAgICAgICBjdXJyZW50Um93LnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmdyaWQucHVzaChjdXJyZW50Um93KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldEFsbE5vZGVOZWlnaGJvcnMoKTtcblxuICAgIHRoaXMuc3RhcnQubm9kZSA9IG51bGw7XG4gICAgdGhpcy5lbmQubm9kZSA9IG51bGw7XG5cbiAgICAvLyByZXNldGluZyBkb20gc3F1YXJlc1xuICAgIERvbUhhbmRsZXIuZmlsbEdyaWQodGhpcy5ncmlkLCB0aGlzLm5vZGVXaWR0aCk7XG4gICAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBuZWlnaGJvcnMgZm9yIGV2ZXJ5IHNpbmdsZSBub2RlIGluIGdyaWRcbiAgc2V0QWxsTm9kZU5laWdoYm9ycygpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLmdyaWQubGVuZ3RoOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5ncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLm5laWdoYm9ycyA9IFtdO1xuICAgICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLnNldE5laWdoYm9ycyh0aGlzLmdyaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHJlc2V0IGdyaWQgYW5kIGFsbCBub2RlcyBjb21wbGV0ZWx5XG4gIHJlc2V0R3JpZCgpIHtcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICBmb3IgKGxldCByb3cgPSAxOyByb3cgPD0gdGhpcy5yb3dzOyByb3crKykge1xuICAgICAgY29uc3QgY3VycmVudFJvdyA9IFtdO1xuICAgICAgZm9yIChsZXQgY29sID0gMTsgY29sIDw9IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgY3VycmVudFJvdy5wdXNoKG5ldyBOb2RlKHJvdywgY29sLCB0aGlzLnJvd3MsIHRoaXMuY29scywgdGhpcywgdGhpcy5ub2RlV2lkdGgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ3JpZC5wdXNoKGN1cnJlbnRSb3cpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0QWxsTm9kZU5laWdoYm9ycygpO1xuXG4gICAgdGhpcy5zdGFydC5ub2RlID0gbnVsbDtcbiAgICB0aGlzLmVuZC5ub2RlID0gbnVsbDtcblxuICAgIC8vIHJlc2V0aW5nIGRvbSBzcXVhcmVzXG4gICAgRG9tSGFuZGxlci5jcmVhdGVHcmlkKHRoaXMuZ3JpZCwgdGhpcy5ub2RlV2lkdGgpO1xuICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG4gIH1cblxuICAvLyByZXNldCBhbGdvcml0aG0gZGlzcGxheSBvbiBncmlkIGUuZyBmaW5hbCBwYXRoLCBvcGVuLWxpc3QgYW5kIGNsb3NlZC1saXN0XG4gIHJlc2V0UGF0aCgpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnJvd3M7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLmNvbHM7IGNvbCsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJOb2RlID0gdGhpcy5ncmlkW3Jvd11bY29sXTtcbiAgICAgICAgY29uc3QgY3VyclR5cGUgPSBjdXJyTm9kZS5ub2RlVHlwZTtcbiAgICAgICAgaWYgKGN1cnJUeXBlID09PSAnb3Blbi1saXN0JyB8fCBjdXJyVHlwZSA9PT0gJ2Nsb3NlZC1saXN0JyB8fCBjdXJyVHlwZSA9PT0gJ2ZpbmFsLXBhdGgnKSB7XG4gICAgICAgICAgY3Vyck5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5JywgMCk7XG4gICAgICAgICAgY3Vyck5vZGUucHJldmlvdXNOb2RlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUdyaWRTaXplKHJvd3MsIGNvbHMsIG5vZGVXaWR0aCkge1xuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5jb2xzID0gY29scztcbiAgICB0aGlzLm5vZGVXaWR0aCA9IG5vZGVXaWR0aDtcbiAgfVxuXG4gIHNldEVyYXNlTW9kZSgpIHtcbiAgICB0aGlzLmVyYXNlTW9kZU9uID0gIXRoaXMuZXJhc2VNb2RlT247XG4gIH1cbn1cbiIsImltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZCc7XG5pbXBvcnQgQWxnb3JpdGhtRmFjdG9yeSBmcm9tICcuL2FsZ29yaXRobWZhY3RvcnknO1xuaW1wb3J0IE1hemVGYWN0b3J5IGZyb20gJy4vbWF6ZWZhY3RvcnknO1xuXG5sZXQgZ3JpZE9iaiA9IG51bGw7XG5sZXQgc2VsZWN0ZWRBbGdvcml0aG0gPSBudWxsO1xubGV0IHNlbGVjdGVkTWF6ZSA9IG51bGw7XG5jb25zdCBydW5uaW5nID0gW2ZhbHNlXTsgLy8gY2hlY2sgaWYgcGF0aCBvciBtYXplIGFsZ29yaXRobSBpcyBjdXJyZW50bHkgcnVubmluZ1xubGV0IGN1cnJNYXplU3BlZWRTZXR0aW5nID0gJ05vcm1hbCc7XG5sZXQgY3VyclBhdGhmaW5kaW5nU3BlZWRTZXR0aW5nID0gJ05vcm1hbCc7XG5sZXQgbWF6ZVNwZWVkID0gMTA7XG5sZXQgcGF0aGZpbmRpbmdTcGVlZCA9IDEwO1xubGV0IGdyaWRTaXplID0gJ21lZGl1bSc7XG5cbi8vIGNvbnRhaW5zIGluZm8gYXNzb2NpYXRlZCB3aXRoIGVhY2ggZ3JpZCBzaXplXG5jb25zdCBncmlkU2l6ZXMgPSB7XG4gIHNtYWxsOiB7IHJvd3M6IDE1LCBjb2xzOiAzNyB9LFxuICBtZWRpdW06IHsgcm93czogMjUsIGNvbHM6IDYxIH0sXG4gIGxhcmdlOiB7IHJvd3M6IDM3LCBjb2xzOiA5MSB9LFxufTtcblxuLy8gcGF0aGZpbmRpbmcgc3BlZWRzIGZvciBkaWZmZXJlbnQgZ3JpZCBzaXplc1xuY29uc3QgcGF0aGZpbmRpbmdTcGVlZHMgPSB7XG4gIHNsb3c6IHsgc21hbGw6IDE1MCwgbWVkaXVtOiAzMCwgbGFyZ2U6IDMwIH0sXG4gIG5vcm1hbDogeyBzbWFsbDogNTAsIG1lZGl1bTogMTAsIGxhcmdlOiAxMCB9LFxuICBmYXN0OiB7IHNtYWxsOiAyMCwgbWVkaXVtOiA1LCBsYXJnZTogMSB9LFxuICBpbnN0YW50OiAwLFxufTtcblxuLy8gbWF6ZSBnZW5lcmF0aW9uIHNwZWVkcyBmb3IgZGlmZmVyZW50IGdyaWQgc2l6ZXNcbmNvbnN0IG1hemVHZW5TcGVlZHMgPSB7XG4gIHNsb3c6IHsgc21hbGw6IDEyMCwgbWVkaXVtOiAyMCwgbGFyZ2U6IDEwIH0sXG4gIG5vcm1hbDogeyBzbWFsbDogMzAsIG1lZGl1bTogMTAsIGxhcmdlOiAzIH0sXG4gIGZhc3Q6IHsgc21hbGw6IDE1LCBtZWRpdW06IDEsIGxhcmdlOiAwLjEgfSxcbiAgaW5zdGFudDogMCxcbn07XG5cbi8vIGluaXRpYWxseSBsb2FkZWQgZ3JpZFxuZnVuY3Rpb24gbG9hZEdyaWQoKSB7XG4gIGdyaWRPYmogPSBuZXcgR3JpZChncmlkU2l6ZXMubWVkaXVtLnJvd3MsIGdyaWRTaXplcy5tZWRpdW0uY29scywgZ3JpZFNpemUsIHJ1bm5pbmcpO1xuICBncmlkT2JqLnNldEFsbE5vZGVOZWlnaGJvcnMoKTtcbn1cblxuLy8gcnVuIHBhdGhmaW5kaW5nIGFsZ29yaXRobVxuYXN5bmMgZnVuY3Rpb24gcnVuQWxnb3JpdGhtKHBhdGhGaW5kaW5nQWxnb3JpdGhtKSB7XG4gIGlmIChydW5uaW5nWzBdIHx8ICFwYXRoRmluZGluZ0FsZ29yaXRobSB8fCAhZ3JpZE9iai5zdGFydC5ub2RlIHx8ICFncmlkT2JqLmVuZC5ub2RlKSByZXR1cm47XG4gIHJ1bm5pbmdbMF0gPSB0cnVlO1xuXG4gIGdyaWRPYmoucmVzZXRQYXRoKCk7XG5cbiAgaWYgKHBhdGhGaW5kaW5nQWxnb3JpdGhtID09PSAnRGlqa3N0cmEnKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZE9iai5ncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRPYmouZ3JpZFswXS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICAgIGdyaWRPYmouZ3JpZFtyb3ddW2NvbF0uZyA9IEluZmluaXR5O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXJ0Tm9kZSA9IGdyaWRPYmouc3RhcnQubm9kZTtcbiAgY29uc3QgZW5kTm9kZSA9IGdyaWRPYmouZW5kLm5vZGU7XG5cbiAgY29uc3QgYWxnb3JpdGhtID0gQWxnb3JpdGhtRmFjdG9yeS5jcmVhdGVBbGdvcml0aG0ocGF0aEZpbmRpbmdBbGdvcml0aG0pO1xuICBjb25zdCBkb25lID0gYXdhaXQgYWxnb3JpdGhtKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgcGF0aGZpbmRpbmdTcGVlZCk7XG5cbiAgaWYgKGRvbmUpIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbn1cblxuLy8gcnVuIG1hemUgZ2VuZXJhdGlvbiBhbGdvcml0aG1cbmFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlTWF6ZShtYXplR2VuZXJhdGlvbkFsZ29yaXRobSkge1xuICBpZiAocnVubmluZ1swXSB8fCBtYXplR2VuZXJhdGlvbkFsZ29yaXRobSA9PT0gbnVsbCkgcmV0dXJuO1xuICBydW5uaW5nWzBdID0gdHJ1ZTtcbiAgZ3JpZE9iai5yZXNldEdyaWQoKTtcblxuICBjb25zdCBtYXplID0gTWF6ZUZhY3RvcnkuY3JlYXRlTWF6ZShtYXplR2VuZXJhdGlvbkFsZ29yaXRobSk7XG4gIGNvbnN0IGRvbmUgPSBhd2FpdCBtYXplKGdyaWRPYmosIG1hemVTcGVlZCk7XG5cbiAgaWYgKGRvbmUpIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbn1cblxuLy8gdXBkYXRlIGhvdyBmYXN0IG1hemUgZ2VuZXJhdGVzXG5mdW5jdGlvbiB1cGRhdGVNYXplRGVsYXkoc3BlZWQpIHtcbiAgY29uc3QgbmV3U3BlZWQgPSBzcGVlZC50b0xvd2VyQ2FzZSgpO1xuICBpZiAoZ3JpZFNpemUgPT09ICdzbWFsbCcpIHtcbiAgICBtYXplU3BlZWQgPSBtYXplR2VuU3BlZWRzW25ld1NwZWVkXS5zbWFsbDtcbiAgfVxuICBpZiAoZ3JpZFNpemUgPT09ICdtZWRpdW0nKSB7XG4gICAgbWF6ZVNwZWVkID0gbWF6ZUdlblNwZWVkc1tuZXdTcGVlZF0ubWVkaXVtO1xuICB9XG4gIGlmIChncmlkU2l6ZSA9PT0gJ2xhcmdlJykge1xuICAgIG1hemVTcGVlZCA9IG1hemVHZW5TcGVlZHNbbmV3U3BlZWRdLmxhcmdlO1xuICB9XG5cbiAgaWYgKHNwZWVkID09PSAnSW5zdGFudCcpIG1hemVTcGVlZCA9IG1hemVHZW5TcGVlZHMuaW5zdGFudDtcbn1cblxuLy8gdXBkYXRlIGhvdyBmYXN0IHBhdGggYWxnb3JpdGhtIGV4cGxvcmVzIG5vZGVzXG5mdW5jdGlvbiB1cGRhdGVQYXRoZmluZGluZ0RlbGF5KHNwZWVkKSB7XG4gIGNvbnN0IG5ld1NwZWVkID0gc3BlZWQudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGdyaWRTaXplID09PSAnc21hbGwnKSB7XG4gICAgcGF0aGZpbmRpbmdTcGVlZCA9IHBhdGhmaW5kaW5nU3BlZWRzW25ld1NwZWVkXS5zbWFsbDtcbiAgfVxuICBpZiAoZ3JpZFNpemUgPT09ICdtZWRpdW0nKSB7XG4gICAgcGF0aGZpbmRpbmdTcGVlZCA9IHBhdGhmaW5kaW5nU3BlZWRzW25ld1NwZWVkXS5tZWRpdW07XG4gIH1cbiAgaWYgKGdyaWRTaXplID09PSAnbGFyZ2UnKSB7XG4gICAgcGF0aGZpbmRpbmdTcGVlZCA9IHBhdGhmaW5kaW5nU3BlZWRzW25ld1NwZWVkXS5sYXJnZTtcbiAgfVxuXG4gIGlmIChzcGVlZCA9PT0gJ0luc3RhbnQnKSBwYXRoZmluZGluZ1NwZWVkID0gcGF0aGZpbmRpbmdTcGVlZHMuaW5zdGFudDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlR3JpZFNpemUoc2l6ZSkge1xuICBjb25zdCBuZXdTaXplID0gc2l6ZS50b0xvd2VyQ2FzZSgpO1xuICBncmlkU2l6ZSA9IG5ld1NpemU7XG5cbiAgZ3JpZE9iai51cGRhdGVHcmlkU2l6ZShncmlkU2l6ZXNbbmV3U2l6ZV0ucm93cywgZ3JpZFNpemVzW25ld1NpemVdLmNvbHMsIG5ld1NpemUpO1xuXG4gIGdyaWRPYmoucmVzZXRHcmlkKCk7XG5cbiAgdXBkYXRlUGF0aGZpbmRpbmdEZWxheShjdXJyUGF0aGZpbmRpbmdTcGVlZFNldHRpbmcpO1xuICB1cGRhdGVNYXplRGVsYXkoY3Vyck1hemVTcGVlZFNldHRpbmcpO1xufVxuXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnNUb0J0bnMoKSB7XG4gIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXJ0LWFsZ29yaXRobScpO1xuICBjb25zdCBnZW5lcmF0ZU1hemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2VuZXJhdGUtbWF6ZScpO1xuXG4gIGNvbnN0IHNlbGVjdEFsZ29CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWFsZ28tYnRuJyk7XG4gIGNvbnN0IHNlbGVjdE1hemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LW1hemUtYnRuJyk7XG4gIGNvbnN0IGdyaWRTaXplQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyaWQtc2l6ZS1idG4nKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZVNwZWVkQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdC1tYXplLXNwZWVkLWJ0bicpO1xuICBjb25zdCBzZWxlY3RBbGdvU3BlZWRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWFsZ28tc3BlZWQtYnRuJyk7XG5cbiAgY29uc3Qgc2VsZWN0QWxnb0J0bkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWxnby1saXN0Jyk7XG4gIGNvbnN0IHNlbGVjdE1hemVCdG5MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1hemUtbGlzdCcpO1xuICBjb25zdCBncmlkU2l6ZUJ0bkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1zaXplLWxpc3QnKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZVNwZWVkQnRuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXplLXNwZWVkLWxpc3QnKTtcbiAgY29uc3Qgc2VsZWN0QWxnb1NwZWVkQnRuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hbGdvLXNwZWVkLWxpc3QnKTtcbiAgY29uc3Qgc2VsZWN0QWxnb0xpc3RJdGVtcyA9IHNlbGVjdEFsZ29CdG5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuICBjb25zdCBzZWxlY3RNYXplTGlzdEl0ZW1zID0gc2VsZWN0TWF6ZUJ0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG4gIGNvbnN0IGdyaWRTaXplTGlzdEl0ZW1zID0gZ3JpZFNpemVCdG5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuICBjb25zdCBzZWxlY3RNYXplU3BlZWRMaXN0SXRlbXMgPSBzZWxlY3RNYXplU3BlZWRCdG5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuICBjb25zdCBzZWxlY3RBbGdvU3BlZWRMaXN0SXRlbXMgPSBzZWxlY3RBbGdvU3BlZWRCdG5MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuXG4gIGNvbnN0IGRyb3Bkb3duQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kcm9wZG93bi1idG4nKTtcbiAgY29uc3QgZHJvcGRvd25MaXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kcm9wZG93bi1saXN0Jyk7XG4gIGNvbnN0IGNsZWFyQm9hcmRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xlYXItYm9hcmQnKTtcbiAgY29uc3QgY2xlYXJQYXRoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsZWFyLXBhdGgnKTtcbiAgY29uc3QgZXJhc2VNb2RlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVyYXNlLW1vZGUnKTtcblxuICBsZXQgY3VycmVudFBhZ2UgPSAwO1xuICBjb25zdCBkYXJrT3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXJrLW92ZXJsYXknKTtcbiAgY29uc3QgaGVscEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlbHAtYm9hcmQnKTtcbiAgY29uc3QgcGFnZXMgPSBoZWxwQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2UnKTtcbiAgY29uc3Qgc2tpcEJ0bnMgPSBoZWxwQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLnNraXAtYnRuJyk7XG4gIGNvbnN0IG5leHRCdG5zID0gaGVscEJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5uZXh0LWJ0bicpO1xuICBjb25zdCBwcmV2aW91c0J0bnMgPSBoZWxwQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLnByZXZpb3VzLWJ0bicpO1xuICBjb25zdCBjb250aW51ZUJ0biA9IGhlbHBCb2FyZC5xdWVyeVNlbGVjdG9yKCcuY29udGludWUtYnRuJyk7XG4gIGNvbnN0IGhlbHBCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVscC1idG4nKTtcblxuICBzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBydW5BbGdvcml0aG0oc2VsZWN0ZWRBbGdvcml0aG0pO1xuICB9KTtcblxuICBnZW5lcmF0ZU1hemVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgZ2VuZXJhdGVNYXplKHNlbGVjdGVkTWF6ZSk7XG4gIH0pO1xuXG4gIHNraXBCdG5zLmZvckVhY2goKHNraXBCdG4pID0+IHtcbiAgICBza2lwQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaGVscEJvYXJkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBkYXJrT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0pO1xuICB9KTtcblxuICBwcmV2aW91c0J0bnMuZm9yRWFjaCgocHJldmlvdXNCdG4pID0+IHtcbiAgICBwcmV2aW91c0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGlmIChjdXJyZW50UGFnZSA+IDApIHtcbiAgICAgICAgcGFnZXNbY3VycmVudFBhZ2VdLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgY3VycmVudFBhZ2UgLT0gMTtcbiAgICAgICAgcGFnZXNbY3VycmVudFBhZ2VdLnNldEF0dHJpYnV0ZSgnaWQnLCAnc2hvdy1wYWdlJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIG5leHRCdG5zLmZvckVhY2goKG5leHRCdG4pID0+IHtcbiAgICBuZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKGN1cnJlbnRQYWdlIDwgcGFnZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICBwYWdlc1tjdXJyZW50UGFnZV0ucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuICAgICAgICBjdXJyZW50UGFnZSArPSAxO1xuICAgICAgICBwYWdlc1tjdXJyZW50UGFnZV0uc2V0QXR0cmlidXRlKCdpZCcsICdzaG93LXBhZ2UnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgY29udGludWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgaGVscEJvYXJkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgZGFya092ZXJsYXkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfSk7XG5cbiAgZnVuY3Rpb24gY2xvc2VEcm9wZG93bnMoKSB7XG4gICAgZHJvcGRvd25MaXN0cy5mb3JFYWNoKChsaXN0KSA9PiB7XG4gICAgICBsaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRyb3Bkb3duQnV0dG9ucy5mb3JFYWNoKChidXR0b24sIGluZGV4KSA9PiB7XG4gICAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjsgLy8gYWxnb3JpdGhtIGluIHByb2dyZXNzXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBjb25zdCBjdXJyZW50TGlzdCA9IGRyb3Bkb3duTGlzdHNbaW5kZXhdO1xuICAgICAgY29uc3QgaXNMaXN0T3BlbiA9IGN1cnJlbnRMaXN0LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpO1xuXG4gICAgICBjbG9zZURyb3Bkb3ducygpO1xuXG4gICAgICBpZiAoIWlzTGlzdE9wZW4pIHtcbiAgICAgICAgY3VycmVudExpc3QuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdycpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgY29uc3QgaXNDbGlja0luc2lkZURyb3Bkb3duID0gQXJyYXkuZnJvbShkcm9wZG93bkxpc3RzKS5zb21lKChsaXN0KSA9PiBsaXN0LmNvbnRhaW5zKGUudGFyZ2V0KSk7XG5cbiAgICBpZiAoIWlzQ2xpY2tJbnNpZGVEcm9wZG93bikge1xuICAgICAgY2xvc2VEcm9wZG93bnMoKTtcbiAgICB9XG4gIH0pO1xuXG4gIGhlbHBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgZGFya092ZXJsYXkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgaGVscEJvYXJkLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gIH0pO1xuXG4gIHNlbGVjdEFsZ29MaXN0SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgc2VsZWN0QWxnb0J0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0QWxnb0J0bi50ZXh0Q29udGVudCA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICBzZWxlY3RlZEFsZ29yaXRobSA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuICB9KTtcblxuICBzZWxlY3RNYXplTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHNlbGVjdE1hemVCdG5MaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgIHNlbGVjdE1hemVCdG4udGV4dENvbnRlbnQgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgc2VsZWN0ZWRNYXplID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGVjdE1hemVTcGVlZExpc3RJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBzZWxlY3RNYXplU3BlZWRCdG5MaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgIHNlbGVjdE1hemVTcGVlZEJ0bi50ZXh0Q29udGVudCA9IGBNYXplIFNwZWVkOiAke2l0ZW0udGV4dENvbnRlbnR9YDtcbiAgICAgIGN1cnJNYXplU3BlZWRTZXR0aW5nID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgIHVwZGF0ZU1hemVEZWxheShpdGVtLnRleHRDb250ZW50KTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGVjdEFsZ29TcGVlZExpc3RJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBzZWxlY3RBbGdvU3BlZWRCdG5MaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgIHNlbGVjdEFsZ29TcGVlZEJ0bi50ZXh0Q29udGVudCA9IGBQYXRoZmluZGluZyBTcGVlZDogJHtpdGVtLnRleHRDb250ZW50fWA7XG4gICAgICBjdXJyUGF0aGZpbmRpbmdTcGVlZFNldHRpbmcgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgdXBkYXRlUGF0aGZpbmRpbmdEZWxheShpdGVtLnRleHRDb250ZW50KTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGdyaWRTaXplTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGlmIChydW5uaW5nWzBdKSByZXR1cm47XG4gICAgICBncmlkU2l6ZUJ0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgZ3JpZFNpemVCdG4udGV4dENvbnRlbnQgPSBgR3JpZCBTaXplOiAke2l0ZW0udGV4dENvbnRlbnR9YDtcbiAgICAgIHVwZGF0ZUdyaWRTaXplKGl0ZW0udGV4dENvbnRlbnQpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgY2xlYXJCb2FyZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBpZiAocnVubmluZ1swXSkgcmV0dXJuO1xuICAgIGdyaWRPYmoucmVzZXRHcmlkKCk7XG4gIH0pO1xuXG4gIGNsZWFyUGF0aEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBpZiAocnVubmluZ1swXSkgcmV0dXJuO1xuICAgIGdyaWRPYmoucmVzZXRQYXRoKCk7XG4gIH0pO1xuXG4gIGVyYXNlTW9kZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0LnRleHRDb250ZW50ID09PSAnRXJhc2U6IE9mZicpIHtcbiAgICAgIGUudGFyZ2V0LnRleHRDb250ZW50ID0gJ0VyYXNlOiBPbic7XG4gICAgfSBlbHNlIGlmIChlLnRhcmdldC50ZXh0Q29udGVudCA9PT0gJ0VyYXNlOiBPbicpIHtcbiAgICAgIGUudGFyZ2V0LnRleHRDb250ZW50ID0gJ0VyYXNlOiBPZmYnO1xuICAgIH1cbiAgICBncmlkT2JqLnNldEVyYXNlTW9kZSgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkTGlzdGVuZXJzVG9HcmlkKCkge1xuICBncmlkT2JqLmFkZExpc3RlbmVycygpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkKCkge1xuICBsb2FkR3JpZCgpO1xuICBhZGRMaXN0ZW5lcnNUb0dyaWQoKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICBhZGRMaXN0ZW5lcnNUb0J0bnMoKTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgcmVjdXJzaXZlRGl2aXNpb24gZnJvbSAnLi9tYXplcy9yZWN1cnNpdmVkaXZpc2lvbic7XG5pbXBvcnQgYmluYXJ5VHJlZSBmcm9tICcuL21hemVzL2JpbmFyeXRyZWUnO1xuaW1wb3J0IHNpZGV3aW5kZXIgZnJvbSAnLi9tYXplcy9zaWRld2luZGVyJztcbmltcG9ydCBnZW5lcmF0ZVByaW1zIGZyb20gJy4vbWF6ZXMvcHJpbXMnO1xuaW1wb3J0IGdlbmVyYXRlSHVudEFuZEtpbGwgZnJvbSAnLi9tYXplcy9odW50YW5ka2lsbCc7XG5pbXBvcnQgcmFuZG9tTWFwIGZyb20gJy4vbWF6ZXMvcmFuZG9tbWFwJztcblxuY2xhc3MgTWF6ZUZhY3Rvcnkge1xuICBzdGF0aWMgY3JlYXRlTWF6ZShtYXplQWxnb3JpdGhtKSB7XG4gICAgLy8gTWFwIGFsZ29yaXRobSBuYW1lcyB0byB0aGVpciBjb3JyZXNwb25kaW5nIGltcGxlbWVudGF0aW9uc1xuICAgIGNvbnN0IGFsZ29yaXRobXMgPSB7XG4gICAgICAnUmVjdXJzaXZlIERpdmlzaW9uJzogcmVjdXJzaXZlRGl2aXNpb24sXG4gICAgICAnQmluYXJ5IFRyZWUnOiBiaW5hcnlUcmVlLFxuICAgICAgU2lkZXdpbmRlcjogc2lkZXdpbmRlcixcbiAgICAgIFwiUHJpbSdzXCI6IGdlbmVyYXRlUHJpbXMsXG4gICAgICAnSHVudCAmIEtpbGwnOiBnZW5lcmF0ZUh1bnRBbmRLaWxsLFxuICAgICAgJ1JhbmRvbSBNYXAnOiByYW5kb21NYXAsXG4gICAgfTtcblxuICAgIGNvbnN0IEFsZ29yaXRobUNsYXNzID0gYWxnb3JpdGhtc1ttYXplQWxnb3JpdGhtXTtcblxuICAgIGlmICghQWxnb3JpdGhtQ2xhc3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQWxnb3JpdGhtIFwiJHttYXplQWxnb3JpdGhtfVwiIG5vdCBmb3VuZGApO1xuICAgIH1cblxuICAgIHJldHVybiBBbGdvcml0aG1DbGFzcztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXplRmFjdG9yeTtcbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGJpbmFyeVRyZWUoZ3JpZE9iaiwgZGVsYXkpIHtcbiAgLy8gZmlsbCBncmlkIHdpdGggYmFycmllcnNcbiAgZ3JpZE9iai5maWxsR3JpZCgpO1xuXG4gIGNvbnN0IGdyaWQgPSBncmlkT2JqLmdyaWQ7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuXG4gIGZ1bmN0aW9uIGNvbm5lY3Qobm9kZTEsIG5vZGUyLCBiYXJyaWVyQmV0d2Vlbikge1xuICAgIG5vZGUxLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgICBub2RlMi5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgYmFycmllckJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICB9XG5cbiAgZm9yIChsZXQgcm93ID0gMTsgcm93IDwgcm93czsgcm93ICs9IDIpIHtcbiAgICBmb3IgKGxldCBjb2wgPSAxOyBjb2wgPCBjb2xzOyBjb2wgKz0gMikge1xuICAgICAgY29uc3QgY3VycmVudFNxdWFyZSA9IGdyaWRbcm93XVtjb2xdO1xuICAgICAgbGV0IG5vcnRoTmVpZ2hib3I7XG4gICAgICBsZXQgd2VzdE5laWdoYm9yO1xuXG4gICAgICBpZiAocm93ID4gMSkge1xuICAgICAgICBub3J0aE5laWdoYm9yID0gZ3JpZFtyb3cgLSAyXVtjb2xdOyAvLyB1cFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9ydGhOZWlnaGJvciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2wgPiAxKSB7XG4gICAgICAgIHdlc3ROZWlnaGJvciA9IGdyaWRbcm93XVtjb2wgLSAyXTsgLy8gbGVmdFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2VzdE5laWdoYm9yID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKG5vcnRoTmVpZ2hib3IgJiYgd2VzdE5laWdoYm9yKSB7XG4gICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIGJvdGggcGF0aHMgYXJlIGF2YWlsYWJsZVxuICAgICAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgICAgaWYgKHJhbmRvbSA9PT0gMCkge1xuICAgICAgICAgIGNvbm5lY3QoY3VycmVudFNxdWFyZSwgbm9ydGhOZWlnaGJvciwgY3VycmVudFNxdWFyZS5uZWlnaGJvcnNbM10pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbm5lY3QoY3VycmVudFNxdWFyZSwgd2VzdE5laWdoYm9yLCBjdXJyZW50U3F1YXJlLm5laWdoYm9yc1sxXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIG9uZSBvZiB0aGUgcGF0aHMgZ28gYmV5b25kIHRoZSBncmlkXG4gICAgICAgIGlmIChyb3cgPT09IDEgJiYgY29sID4gMSkge1xuICAgICAgICAgIGNvbm5lY3QoY3VycmVudFNxdWFyZSwgd2VzdE5laWdoYm9yLCBjdXJyZW50U3F1YXJlLm5laWdoYm9yc1sxXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbCA9PT0gMSAmJiByb3cgPiAxKSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCBub3J0aE5laWdoYm9yLCBjdXJyZW50U3F1YXJlLm5laWdoYm9yc1szXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7IC8vIG1hemUgZ2VuZXJhdGlvbiBmaW5pc2hlZFxufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVIdW50QW5kS2lsbChncmlkT2JqLCBkZWxheSkge1xuICAvLyBzZXQgdGhlIGVudGlyZSBncmlkIGFzIGJhcnJpZXJzXG4gIGdyaWRPYmouZmlsbEdyaWQoKTtcblxuICBjb25zdCBncmlkID0gZ3JpZE9iai5ncmlkO1xuICBjb25zdCByb3dzID0gZ3JpZC5sZW5ndGg7XG4gIGNvbnN0IGNvbHMgPSBncmlkWzBdLmxlbmd0aDtcbiAgY29uc3QgdmlzaXRlZCA9IFtdO1xuXG4gIC8vIGFkZCBuZWlnaGJvcnMgLSBkaXJlY3RseSBhZGphY2VudCBuZWlnaGJvcnMgYXJlIHNraXBwZWQgc28gdGhleSBjYW4gYmUgd2FsbHMgaWYgbmVlZGVkXG4gIGZ1bmN0aW9uIGdldFVudmlzaXRlZE5laWdoYm9ycyhub2RlKSB7XG4gICAgY29uc3QgbmVpZ2hib3JzID0gW107XG4gICAgY29uc3Qgcm93ID0gbm9kZS5yb3cgLSAxO1xuICAgIGNvbnN0IGNvbCA9IG5vZGUuY29sIC0gMTtcblxuICAgIGlmIChyb3cgPiAxKSB7XG4gICAgICBpZiAoIXZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3cgLSAyXVtjb2xdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3JvdyAtIDJdW2NvbF0pOyAvLyB1cFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyb3cgPCByb3dzIC0gMikge1xuICAgICAgaWYgKCF2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93ICsgMl1bY29sXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgKyAyXVtjb2xdKTsgLy8gZG93blxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2wgPiAxKSB7XG4gICAgICBpZiAoIXZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3ddW2NvbCAtIDJdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3Jvd11bY29sIC0gMl0pOyAvLyBsZWZ0XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbCA8IGNvbHMgLSAyKSB7XG4gICAgICBpZiAoIXZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3ddW2NvbCArIDJdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3Jvd11bY29sICsgMl0pOyAvLyByaWdodFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZWlnaGJvcnM7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRWaXNpdGVkTmVpZ2hib3JzKG5vZGUpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBjb25zdCByb3cgPSBub2RlLnJvdyAtIDE7XG4gICAgY29uc3QgY29sID0gbm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93IC0gMl1bY29sXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgLSAyXVtjb2xdKTsgLy8gdXBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocm93IDwgcm93cyAtIDIpIHtcbiAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93ICsgMl1bY29sXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgKyAyXVtjb2xdKTsgLy8gZG93blxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2wgPiAxKSB7XG4gICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyhncmlkW3Jvd11bY29sIC0gMl0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgLSAyXSk7IC8vIGxlZnRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29sIDwgY29scyAtIDIpIHtcbiAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93XVtjb2wgKyAyXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCArIDJdKTsgLy8gcmlnaHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG5cbiAgZnVuY3Rpb24gcmFuZG9tbHlTZWxlY3ROZWlnaGJvcihuZWlnaGJvcnMpIHtcbiAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5laWdoYm9ycy5sZW5ndGgpO1xuICAgIHJldHVybiBuZWlnaGJvcnNbaW5kZXhdO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVTdGFydFBvaW50KCkge1xuICAgIC8vIGNob29zZSBhIHJhbmRvbSBwb2ludCBvbiB0aGUgZ3JpZCB0byBzdGFydCB3aXRoXG4gICAgbGV0IHJhbmRvbU5vZGVGb3VuZCA9IGZhbHNlO1xuICAgIGxldCByYW5kb21GaXJzdE5vZGUgPSBudWxsO1xuICAgIHdoaWxlICghcmFuZG9tTm9kZUZvdW5kKSB7XG4gICAgICBjb25zdCByYW5kb21Sb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAocm93cyAtIDQpKSArIDI7XG4gICAgICBjb25zdCByYW5kb21Db2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoY29scyAtIDQpKSArIDI7XG4gICAgICBpZiAocmFuZG9tUm93ICUgMiAhPT0gMCAmJiByYW5kb21Db2wgJSAyICE9PSAwKSB7XG4gICAgICAgIHJhbmRvbUZpcnN0Tm9kZSA9IGdyaWRbcmFuZG9tUm93XVtyYW5kb21Db2xdO1xuICAgICAgICByYW5kb21GaXJzdE5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgICAgICByYW5kb21Ob2RlRm91bmQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmFuZG9tRmlyc3ROb2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlV2FsbEJldHdlZW4oY3Vyck5vZGUsIG5leHROb2RlKSB7XG4gICAgY29uc3Qgcm93ID0gY3Vyck5vZGUucm93IC0gMTtcbiAgICBjb25zdCBjb2wgPSBjdXJyTm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgIGlmIChncmlkW3JvdyAtIDJdW2NvbF0gPT09IG5leHROb2RlKSB7XG4gICAgICAgIGNvbnN0IHdhbGxCZXR3ZWVuID0gZ3JpZFtyb3cgLSAxXVtjb2xdO1xuICAgICAgICB3YWxsQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChyb3cgPCByb3dzIC0gMikge1xuICAgICAgaWYgKGdyaWRbcm93ICsgMl1bY29sXSA9PT0gbmV4dE5vZGUpIHtcbiAgICAgICAgY29uc3Qgd2FsbEJldHdlZW4gPSBncmlkW3JvdyArIDFdW2NvbF07XG4gICAgICAgIHdhbGxCZXR3ZWVuLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvbCA+IDEpIHtcbiAgICAgIGlmIChncmlkW3Jvd11bY29sIC0gMl0gPT09IG5leHROb2RlKSB7XG4gICAgICAgIGNvbnN0IHdhbGxCZXR3ZWVuID0gZ3JpZFtyb3ddW2NvbCAtIDFdO1xuICAgICAgICB3YWxsQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjb2wgPCBjb2xzIC0gMikge1xuICAgICAgaWYgKGdyaWRbcm93XVtjb2wgKyAyXSA9PT0gbmV4dE5vZGUpIHtcbiAgICAgICAgY29uc3Qgd2FsbEJldHdlZW4gPSBncmlkW3Jvd11bY29sICsgMV07XG4gICAgICAgIHdhbGxCZXR3ZWVuLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjdXJyTm9kZS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgbmV4dE5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gYWxnb3JpdGhtKCkge1xuICAgIGxldCBjdXJyZW50Tm9kZSA9IGdlbmVyYXRlU3RhcnRQb2ludCgpOyAvLyBnZXQgc3RhcnQgbm9kZVxuXG4gICAgd2hpbGUgKGN1cnJlbnROb2RlKSB7XG4gICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICB9XG4gICAgICB2aXNpdGVkLnB1c2goY3VycmVudE5vZGUpO1xuICAgICAgY29uc3QgbmVpZ2hib3JzID0gZ2V0VW52aXNpdGVkTmVpZ2hib3JzKGN1cnJlbnROb2RlKTtcblxuICAgICAgaWYgKG5laWdoYm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IG5leHROb2RlID0gcmFuZG9tbHlTZWxlY3ROZWlnaGJvcihuZWlnaGJvcnMpO1xuICAgICAgICByZW1vdmVXYWxsQmV0d2VlbihjdXJyZW50Tm9kZSwgbmV4dE5vZGUpO1xuICAgICAgICBjdXJyZW50Tm9kZSA9IG5leHROb2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudE5vZGUgPSBudWxsO1xuXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8IHJvd3MgLSAxOyByb3cgKz0gMikge1xuICAgICAgICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8IGNvbHMgLSAxOyBjb2wgKz0gMikge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGdyaWRbcm93XVtjb2xdO1xuICAgICAgICAgICAgY29uc3QgdmlzaXRlZE5vZGVOZWlnaGJvcnMgPSBnZXRWaXNpdGVkTmVpZ2hib3JzKG5vZGUpO1xuICAgICAgICAgICAgaWYgKCF2aXNpdGVkLmluY2x1ZGVzKG5vZGUpICYmIHZpc2l0ZWROb2RlTmVpZ2hib3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgY3VycmVudE5vZGUgPSBub2RlO1xuICAgICAgICAgICAgICBjb25zdCByYW5kb21seVNlbGVjdGVkTmVpZ2hib3IgPSByYW5kb21seVNlbGVjdE5laWdoYm9yKHZpc2l0ZWROb2RlTmVpZ2hib3JzKTtcbiAgICAgICAgICAgICAgcmVtb3ZlV2FsbEJldHdlZW4oY3VycmVudE5vZGUsIHJhbmRvbWx5U2VsZWN0ZWROZWlnaGJvcik7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY3VycmVudE5vZGUpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBhbGdvcml0aG0oKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlUHJpbXMoZ3JpZE9iaiwgZGVsYXkpIHtcbiAgLy8gc2V0IHRoZSBlbnRpcmUgZ3JpZCBhcyBiYXJyaWVyc1xuICBncmlkT2JqLmZpbGxHcmlkKCk7XG5cbiAgY29uc3QgZ3JpZCA9IGdyaWRPYmouZ3JpZDtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG4gIGNvbnN0IGZyb250aWVyID0gW107XG4gIGNvbnN0IHZpc2l0ZWQgPSBuZXcgU2V0KCk7XG5cbiAgLy8gYWRkIG5laWdoYm9ycyAtIGRpcmVjdGx5IGFkamFjZW50IG5laWdoYm9ycyBhcmUgc2tpcHBlZCBzbyB0aGV5IGNhbiBiZSB3YWxscyBpZiBuZWVkZWRcbiAgZnVuY3Rpb24gZ2V0TmVpZ2hib3JzKG5vZGUpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBjb25zdCByb3cgPSBub2RlLnJvdyAtIDE7XG4gICAgY29uc3QgY29sID0gbm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93IC0gMl1bY29sXSk7IC8vIHVwXG5cbiAgICBpZiAocm93IDwgcm93cyAtIDIpIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93ICsgMl1bY29sXSk7IC8vIGRvd25cblxuICAgIGlmIChjb2wgPiAxKSBuZWlnaGJvcnMucHVzaChncmlkW3Jvd11bY29sIC0gMl0pOyAvLyBsZWZ0XG5cbiAgICBpZiAoY29sIDwgY29scyAtIDIpIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgKyAyXSk7IC8vIHJpZ2h0XG5cbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0V2FsbEJldHdlZW4obm9kZSwgbmVpZ2hib3IpIHtcbiAgICBjb25zdCByb3cgPSBub2RlLnJvdyAtIDE7XG4gICAgY29uc3QgY29sID0gbm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgIGlmIChncmlkW3JvdyAtIDJdW2NvbF0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3cgLSAxXVtjb2xdOyAvLyB1cFxuICAgIH1cbiAgICBpZiAocm93IDwgcm93cyAtIDIpIHtcbiAgICAgIGlmIChncmlkW3JvdyArIDJdW2NvbF0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3cgKyAxXVtjb2xdOyAvLyBkb3duXG4gICAgfVxuICAgIGlmIChjb2wgPiAxKSB7XG4gICAgICBpZiAoZ3JpZFtyb3ddW2NvbCAtIDJdID09PSBuZWlnaGJvcikgcmV0dXJuIGdyaWRbcm93XVtjb2wgLSAxXTsgLy8gbGVmdFxuICAgIH1cbiAgICBpZiAoY29sIDwgY29scyAtIDIpIHtcbiAgICAgIGlmIChncmlkW3Jvd11bY29sICsgMl0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3ddW2NvbCArIDFdOyAvLyByaWdodFxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gY29ubmVjdChub2RlMSwgbm9kZTIsIHdhbGxCZXR3ZWVuKSB7XG4gICAgbm9kZTEuc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgIG5vZGUyLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgICB3YWxsQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gIH1cblxuICAvLyBjaG9vc2UgYSByYW5kb20gcG9pbnQgb24gdGhlIGdyaWQgdG8gc3RhcnQgd2l0aFxuICBsZXQgcmFuZG9tRmlyc3ROb2RlID0gbnVsbDtcbiAgd2hpbGUgKHJhbmRvbUZpcnN0Tm9kZSA9PT0gbnVsbCkge1xuICAgIGNvbnN0IHJhbmRvbVJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChyb3dzIC0gNCkpICsgMjtcbiAgICBjb25zdCByYW5kb21Db2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoY29scyAtIDQpKSArIDI7XG4gICAgaWYgKHJhbmRvbVJvdyAlIDIgIT09IDAgJiYgcmFuZG9tQ29sICUgMiAhPT0gMCkge1xuICAgICAgcmFuZG9tRmlyc3ROb2RlID0gZ3JpZFtyYW5kb21Sb3ddW3JhbmRvbUNvbF07XG4gICAgICByYW5kb21GaXJzdE5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgICAgdmlzaXRlZC5hZGQocmFuZG9tRmlyc3ROb2RlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdGFydE5vZGVOZWlnaGJvcnMgPSBnZXROZWlnaGJvcnMocmFuZG9tRmlyc3ROb2RlKTtcbiAgc3RhcnROb2RlTmVpZ2hib3JzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICBpZiAobm9kZSkge1xuICAgICAgZnJvbnRpZXIucHVzaChub2RlKTtcbiAgICB9XG4gIH0pO1xuXG4gIHdoaWxlIChmcm9udGllci5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBmcm9udGllci5sZW5ndGgpO1xuICAgIGNvbnN0IHJhbmRvbUZyb250aWVyTm9kZSA9IGZyb250aWVyW3JhbmRvbUluZGV4XTtcbiAgICBjb25zdCBmcm9udGllck5laWdoYm9ycyA9IGdldE5laWdoYm9ycyhyYW5kb21Gcm9udGllck5vZGUpO1xuXG4gICAgLy8gZmluZCBvdXQgd2hpY2ggJ2luJyBub2RlcyAocGFydCBvZiBtYXplKSBhcmUgYWRqYWNlbnRcbiAgICBjb25zdCBhZGphY2VudElucyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJvbnRpZXJOZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2aXNpdGVkLmhhcyhmcm9udGllck5laWdoYm9yc1tpXSkpIHtcbiAgICAgICAgYWRqYWNlbnRJbnMucHVzaChmcm9udGllck5laWdoYm9yc1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2hvb3NlIGEgcmFuZG9tIGFkamFjZW50IG5vZGUgYW5kIGNvbm5lY3QgdGhhdCB3aXRoIHRoZSBmcm9udGllciBub2RlXG4gICAgY29uc3QgcmFuZG9tQWRqYWNlbnRJbiA9IGFkamFjZW50SW5zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFkamFjZW50SW5zLmxlbmd0aCldO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRqYWNlbnRJbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhZGphY2VudEluc1tpXSA9PT0gcmFuZG9tQWRqYWNlbnRJbikge1xuICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3YWxsQmV0d2VlbiA9IGdldFdhbGxCZXR3ZWVuKHJhbmRvbUZyb250aWVyTm9kZSwgcmFuZG9tQWRqYWNlbnRJbik7XG4gICAgICAgIGNvbnN0IGluZGV4VG9TcGxpY2UgPSBmcm9udGllci5pbmRleE9mKHJhbmRvbUZyb250aWVyTm9kZSk7XG4gICAgICAgIGNvbm5lY3QocmFuZG9tRnJvbnRpZXJOb2RlLCByYW5kb21BZGphY2VudEluLCB3YWxsQmV0d2Vlbik7XG4gICAgICAgIHZpc2l0ZWQuYWRkKHJhbmRvbUZyb250aWVyTm9kZSk7XG4gICAgICAgIGZyb250aWVyLnNwbGljZShpbmRleFRvU3BsaWNlLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBnZXQgdGhlIG5laWdoYm9ycyBvZiB0aGUgZnJvbnRpZXIgbm9kZSBhbmQgYWRkIHRoZW0gdG8gZnJvbnRpZXIgbGlzdFxuICAgIGNvbnN0IG5laWdoYm9yc1RvQWRkID0gZ2V0TmVpZ2hib3JzKHJhbmRvbUZyb250aWVyTm9kZSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZWlnaGJvcnNUb0FkZC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG5laWdoYm9yc1RvQWRkW2ldKSB7XG4gICAgICAgIGlmICghdmlzaXRlZC5oYXMobmVpZ2hib3JzVG9BZGRbaV0pICYmICFmcm9udGllci5pbmNsdWRlcyhuZWlnaGJvcnNUb0FkZFtpXSkpIHtcbiAgICAgICAgICBmcm9udGllci5wdXNoKG5laWdoYm9yc1RvQWRkW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJhbmRvbU1hcChncmlkT2JqLCBkZWxheSkge1xuICBjb25zdCBncmlkID0gZ3JpZE9iai5ncmlkO1xuICBjb25zdCByb3dzID0gZ3JpZC5sZW5ndGg7XG4gIGNvbnN0IGNvbHMgPSBncmlkWzBdLmxlbmd0aDtcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcm93czsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBjb2xzOyBjb2wrKykge1xuICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5yYW5kb20oKTtcbiAgICAgIGlmIChyYW5kb20gPCAwLjMpIHtcbiAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInLCBkZWxheSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlOyAvLyBtYXplIGdlbmVyYXRpb24gZmluaXNoZWRcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJlY3Vyc2l2ZURpdmlzaW9uKGdyaWRPYmosIGRlbGF5KSB7XG4gIGNvbnN0IGdyaWQgPSBncmlkT2JqLmdyaWQ7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuICBsZXQgaXNGaW5pc2hlZCA9IGZhbHNlOyAvLyBpcyByZWN1cnNpdmUgcHJvY2VzcyBmaW5pc2hlZD9cblxuICBmdW5jdGlvbiByYW5kb21FdmVuKGEsIGIpIHtcbiAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoYiAtIGEgKyAxKSkgKyBhO1xuICAgIHJldHVybiByYW5kb20gJSAyID09PSAwID8gcmFuZG9tIDogcmFuZG9tICsgMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbU9kZChhLCBiKSB7XG4gICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGIgLSBhICsgMSkpICsgYTtcbiAgICByZXR1cm4gcmFuZG9tICUgMiAhPT0gMCA/IHJhbmRvbSA6IHJhbmRvbSArIDE7XG4gIH1cblxuICAvLyBjaG9vc2UgdG8gcGxhY2Ugd2FsbCB2ZXJ0aWNhbGx5IG9yIGhvcml6b250YWxseVxuICBmdW5jdGlvbiBjaG9vc2VPcmllbnRhdGlvbihzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgZW5kQ29sKSB7XG4gICAgY29uc3Qgd2lkdGggPSBlbmRDb2wgLSBzdGFydENvbDtcbiAgICBjb25zdCBoZWlnaHQgPSBlbmRSb3cgLSBzdGFydFJvdztcbiAgICBpZiAod2lkdGggPiBoZWlnaHQpIHJldHVybiAndmVydGljYWwnO1xuICAgIGlmICh3aWR0aCA8IGhlaWdodCkgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICBpZiAod2lkdGggPT09IGhlaWdodCkge1xuICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgICByZXR1cm4gcmFuZG9tID09PSAwID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJztcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBzZXQgZWRnZXMgb2YgZ3JpZCBhcyBiYXJyaWVyc1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCByb3dzOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgICBpZiAocm93ID09PSAwIHx8IHJvdyA9PT0gcm93cyAtIDEgfHwgY29sID09PSAwIHx8IGNvbCA9PT0gY29scyAtIDEpIHtcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInLCBkZWxheSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gdGhlIHJlY3Vyc2l2ZSBmdW5jdGlvbiB0byBkaXZpZGUgdGhlIGdyaWRcbiAgYXN5bmMgZnVuY3Rpb24gZGl2aWRlKHN0YXJ0Um93LCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpIHtcbiAgICBpZiAoZW5kQ29sIC0gc3RhcnRDb2wgPCAxIHx8IGVuZFJvdyAtIHN0YXJ0Um93IDwgMSkge1xuICAgICAgLy8gYmFzZSBjYXNlIGlmIHN1Yi1tYXplIGlzIHRvbyBzbWFsbFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdhbGxSb3cgPSByYW5kb21FdmVuKHN0YXJ0Um93ICsgMSwgZW5kUm93IC0gMSk7XG4gICAgY29uc3Qgd2FsbENvbCA9IHJhbmRvbUV2ZW4oc3RhcnRDb2wgKyAxLCBlbmRDb2wgLSAxKTtcblxuICAgIGNvbnN0IHBhc3NhZ2VSb3cgPSByYW5kb21PZGQoc3RhcnRSb3csIGVuZFJvdyk7XG4gICAgY29uc3QgcGFzc2FnZUNvbCA9IHJhbmRvbU9kZChzdGFydENvbCwgZW5kQ29sKTtcblxuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gY2hvb3NlT3JpZW50YXRpb24oc3RhcnRSb3csIGVuZFJvdywgc3RhcnRDb2wsIGVuZENvbCk7XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgLy8gbWFrZSBhIGhvcml6b250YWwgd2FsbFxuICAgICAgZm9yIChsZXQgY29sID0gc3RhcnRDb2w7IGNvbCA8PSBlbmRDb2w7IGNvbCsrKSB7XG4gICAgICAgIGlmIChjb2wgIT09IHBhc3NhZ2VDb2wpIHtcbiAgICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBncmlkW3dhbGxSb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInLCBkZWxheSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAvLyBtYWtlIGEgdmVydGljYWwgd2FsbFxuICAgICAgZm9yIChsZXQgcm93ID0gc3RhcnRSb3c7IHJvdyA8PSBlbmRSb3c7IHJvdysrKSB7XG4gICAgICAgIGlmIChyb3cgIT09IHBhc3NhZ2VSb3cpIHtcbiAgICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBncmlkW3Jvd11bd2FsbENvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInLCBkZWxheSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgYXdhaXQgZGl2aWRlKHN0YXJ0Um93LCB3YWxsUm93IC0gMSwgc3RhcnRDb2wsIGVuZENvbCk7XG4gICAgICBhd2FpdCBkaXZpZGUod2FsbFJvdyArIDEsIGVuZFJvdywgc3RhcnRDb2wsIGVuZENvbCk7XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgYXdhaXQgZGl2aWRlKHN0YXJ0Um93LCBlbmRSb3csIHdhbGxDb2wgKyAxLCBlbmRDb2wpO1xuICAgICAgYXdhaXQgZGl2aWRlKHN0YXJ0Um93LCBlbmRSb3csIHN0YXJ0Q29sLCB3YWxsQ29sIC0gMSk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhpcyBpcyB0aGUgbGFzdCByZWN1cnNpdmUgY2FsbFxuICAgIGlmIChzdGFydFJvdyA9PT0gMSAmJiBlbmRSb3cgPT09IHJvd3MgLSAyICYmIHN0YXJ0Q29sID09PSAxICYmIGVuZENvbCA9PT0gY29scyAtIDIpIHtcbiAgICAgIGlzRmluaXNoZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGF3YWl0IGRpdmlkZSgxLCByb3dzIC0gMiwgMSwgY29scyAtIDIpO1xuXG4gIHJldHVybiBpc0ZpbmlzaGVkOyAvLyBtYXplIGdlbmVyYXRpb24gZmluaXNoZWRcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHNpZGV3aW5kZXIoZ3JpZE9iaiwgZGVsYXkpIHtcbiAgZ3JpZE9iai5maWxsR3JpZCgpOyAvLyBzZXQgdGhlIGdyaWQgYXMgd2FsbHNcblxuICBjb25zdCBncmlkID0gZ3JpZE9iai5ncmlkO1xuICBjb25zdCByb3dzID0gZ3JpZC5sZW5ndGg7XG4gIGNvbnN0IGNvbHMgPSBncmlkWzBdLmxlbmd0aDtcblxuICAvLyBsZWF2ZSBmaXJzdCByb3cgZW1wdHlcbiAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgY29sKyspIHtcbiAgICBpZiAoY29sICE9PSAwICYmIGNvbCAhPT0gY29scyAtIDEpIHtcbiAgICAgIGdyaWRbMV1bY29sXS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgcm93ID0gMTsgcm93IDwgcm93czsgcm93ICs9IDIpIHtcbiAgICBsZXQgcnVuID0gW107XG4gICAgZm9yIChsZXQgY29sID0gMTsgY29sIDwgY29sczsgY29sICs9IDIpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnROb2RlID0gZ3JpZFtyb3ddW2NvbF07XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgICBydW4ucHVzaChjdXJyZW50Tm9kZSk7XG5cbiAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC42ICYmIGNvbCAhPT0gY29scyAtIDIpIHtcbiAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudE5vZGUubmVpZ2hib3JzWzBdLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgICAgIH0gZWxzZSBpZiAocnVuLmxlbmd0aCA+IDAgJiYgcm93ID4gMSkge1xuICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJ1bi5sZW5ndGgpO1xuICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBydW5bcmFuZG9tSW5kZXhdLm5laWdoYm9yc1szXS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgICAgIHJ1biA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJpbXBvcnQgRG9tSGFuZGxlciBmcm9tICcuL2RvbWhhbmRsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2RlIHtcbiAgY29uc3RydWN0b3Iocm93LCBjb2wsIHRvdGFsUm93cywgdG90YWxDb2xzLCBncmlkLCBub2RlU2l6ZSkge1xuICAgIHRoaXMubm9kZVNpemUgPSBudWxsOyAvLyBob2xkcyBweCB2YWx1ZSBvZiBub2RlIHdpZHRoIGFuZCBoZWlnaHRcbiAgICB0aGlzLnNldE5vZGVXaWR0aChub2RlU2l6ZSk7XG4gICAgdGhpcy50b3RhbFJvd3MgPSB0b3RhbFJvd3M7XG4gICAgdGhpcy50b3RhbENvbHMgPSB0b3RhbENvbHM7XG4gICAgdGhpcy5yb3cgPSByb3c7XG4gICAgdGhpcy5jb2wgPSBjb2w7XG4gICAgdGhpcy55ID0gdGhpcy5yb3cgKiB0aGlzLm5vZGVTaXplO1xuICAgIHRoaXMueCA9IHRoaXMuY29sICogdGhpcy5ub2RlU2l6ZTtcbiAgICB0aGlzLm5vZGVUeXBlID0gJ2VtcHR5JzsgLy8gdXNlZCB0byB1cGRhdGUgc3F1YXJlIGRpc3BsYXkgb24gZG9tIGUuZyBzdGFydCwgZW5kIG9yIGJhcnJpZXJcbiAgICB0aGlzLm5laWdoYm9ycyA9IFtdO1xuICAgIHRoaXMucHJldmlvdXNOb2RlID0gbnVsbDtcbiAgICB0aGlzLmdyaWQgPSBncmlkO1xuXG4gICAgLy8gdXNlZCBmb3IgQXN0YXIgYW5kIERpanNrdHJhXG4gICAgdGhpcy5mID0gMDtcbiAgICB0aGlzLmcgPSAwO1xuICAgIHRoaXMuaCA9IDA7XG4gIH1cblxuICAvLyBhZGp1c3Qgc2l6ZSBvZiBub2RlIGluIHB4XG4gIHNldE5vZGVXaWR0aChub2RlU2l6ZSkge1xuICAgIGlmIChub2RlU2l6ZSA9PT0gJ3NtYWxsJykge1xuICAgICAgdGhpcy5ub2RlU2l6ZSA9IDUwO1xuICAgIH0gZWxzZSBpZiAobm9kZVNpemUgPT09ICdtZWRpdW0nKSB7XG4gICAgICB0aGlzLm5vZGVTaXplID0gMzA7XG4gICAgfSBlbHNlIGlmIChub2RlU2l6ZSA9PT0gJ2xhcmdlJykge1xuICAgICAgdGhpcy5ub2RlU2l6ZSA9IDIwO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNoYW5nZSBub2RlIHR5cGUgZS5nIGJhcnJpZXIsIHN0YXJ0LCBlbmQsIG9wZW4tbGlzdCwgY2xvc2VkLWxpc3RcbiAgc2V0Tm9kZVR5cGUobmV3Tm9kZVR5cGUsIGRlbGF5KSB7XG4gICAgRG9tSGFuZGxlci5kaXNwbGF5Tm9kZSh0aGlzLCB0aGlzLm5vZGVUeXBlLCBuZXdOb2RlVHlwZSwgdGhpcy5ncmlkLCBkZWxheSk7XG4gICAgdGhpcy5ub2RlVHlwZSA9IG5ld05vZGVUeXBlO1xuICB9XG5cbiAgLy8gY2FsYyBmLCBnIGFuZCBoIHNjb3Jlc1xuICBjYWxjU2NvcmVzKHN0YXJ0Tm9kZSwgZW5kTm9kZSkge1xuICAgIHRoaXMuZyA9IE1hdGguYWJzKHRoaXMueCAtIHN0YXJ0Tm9kZS54KSArIE1hdGguYWJzKHRoaXMueSAtIHN0YXJ0Tm9kZS55KTtcbiAgICB0aGlzLmggPSBNYXRoLmFicyh0aGlzLnggLSBlbmROb2RlLngpICsgTWF0aC5hYnModGhpcy55IC0gZW5kTm9kZS55KTtcbiAgICB0aGlzLmYgPSB0aGlzLmcgKyB0aGlzLmg7XG4gICAgcmV0dXJuIHRoaXMuZjtcbiAgfVxuXG4gIC8vIHNldCBuZWlnaGJvcnMgZm9yIGN1cnJlbnQgbm9kZSAobm8gZGlhZ29uYWxzKVxuICBzZXROZWlnaGJvcnMoZ3JpZCkge1xuICAgIGNvbnN0IHRlbXBSb3cgPSB0aGlzLnJvdyAtIDE7XG4gICAgY29uc3QgdGVtcENvbCA9IHRoaXMuY29sIC0gMTtcblxuICAgIGlmICh0ZW1wQ29sIDwgdGhpcy50b3RhbENvbHMgLSAxKSB7XG4gICAgICAvLyByaWdodFxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3ddW3RlbXBDb2wgKyAxXSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbXBDb2wgPiAwKSB7XG4gICAgICAvLyBsZWZ0XG4gICAgICB0aGlzLm5laWdoYm9ycy5wdXNoKGdyaWRbdGVtcFJvd11bdGVtcENvbCAtIDFdKTtcbiAgICB9XG5cbiAgICBpZiAodGVtcFJvdyA8IHRoaXMudG90YWxSb3dzIC0gMSkge1xuICAgICAgLy8gZG93blxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3cgKyAxXVt0ZW1wQ29sXSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbXBSb3cgPiAwKSB7XG4gICAgICAvLyB1cFxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3cgLSAxXVt0ZW1wQ29sXSk7XG4gICAgfVxuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9zY3NzL21haW4uc2Nzcyc7XG5pbXBvcnQgbG9hZCBmcm9tICcuL21haW5oYW5kbGVyJztcblxubG9hZCgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
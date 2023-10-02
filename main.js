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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBMEQ7QUFDaEI7QUFDTTs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLHlEQUFRO0FBQ3BCLGdCQUFnQiw0REFBVztBQUMzQixxQkFBcUIsaUVBQWdCO0FBQ3JDOztBQUVBOztBQUVBO0FBQ0Esb0NBQW9DLGNBQWM7QUFDbEQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlFQUFlLGdCQUFnQixFQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN2QmpCO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLHFCQUFxQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLFFBQVE7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixxQkFBcUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLGtDQUFrQztBQUN0RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ25GZTtBQUNmO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlDQUF5QyxRQUFRO0FBQ2pEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLDZCQUE2QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsOEJBQThCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3pHZTtBQUNmLDRCQUE0QjtBQUM1QjtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLFFBQVE7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0Isa0NBQWtDO0FBQ3REOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDNURBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQ0FBaUMsV0FBVzs7QUFFNUMsb0JBQW9CLG1CQUFtQjtBQUN2QyxzQkFBc0Isd0JBQXdCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxXQUFXOztBQUU3QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlDQUFpQyxXQUFXOztBQUU1QyxvQkFBb0IsbUJBQW1CO0FBQ3ZDLHNCQUFzQix3QkFBd0I7QUFDOUM7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLFdBQVc7O0FBRTdDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxVQUFVLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0VBO0FBQ1k7O0FBRXZCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7O0FBRTlDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLGlCQUFpQjtBQUN2Qyx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQixhQUFhO0FBQ25DO0FBQ0Esd0JBQXdCLGFBQWE7QUFDckMsNEJBQTRCLDZDQUFJO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBLElBQUksbURBQVU7QUFDZDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isa0JBQWtCO0FBQ3hDO0FBQ0Esd0JBQXdCLGtCQUFrQjtBQUMxQyx5QkFBeUIsNkNBQUk7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSxtREFBVTtBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQix3QkFBd0I7QUFDOUMsd0JBQXdCLDZCQUE2QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixrQkFBa0I7QUFDeEM7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDLDRCQUE0Qiw2Q0FBSTtBQUNoQztBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLElBQUksbURBQVU7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0IsaUJBQWlCO0FBQ3ZDLHdCQUF3QixpQkFBaUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hMMEI7QUFDd0I7QUFDVjs7QUFFeEM7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsb0JBQW9CO0FBQy9CLFlBQVksb0JBQW9CO0FBQ2hDLFdBQVcsb0JBQW9CO0FBQy9COztBQUVBO0FBQ0E7QUFDQSxVQUFVLG1DQUFtQztBQUM3QyxZQUFZLGtDQUFrQztBQUM5QyxVQUFVLGdDQUFnQztBQUMxQztBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVLG1DQUFtQztBQUM3QyxZQUFZLGlDQUFpQztBQUM3QyxVQUFVLGtDQUFrQztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsNkNBQUk7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHNCQUFzQiwyQkFBMkI7QUFDakQsd0JBQXdCLDhCQUE4QjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQix5REFBZ0I7QUFDcEM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWUsb0RBQVc7QUFDMUI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxpQkFBaUI7QUFDdkU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELGlCQUFpQjtBQUM5RTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxpQkFBaUI7QUFDL0Q7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4VDBEO0FBQ2Q7QUFDQTtBQUNGO0FBQ1k7QUFDWjs7QUFFMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsZ0VBQWlCO0FBQzdDLHFCQUFxQix5REFBVTtBQUMvQixrQkFBa0IseURBQVU7QUFDNUIsZ0JBQWdCLG9EQUFhO0FBQzdCLHFCQUFxQiwwREFBbUI7QUFDeEMsb0JBQW9CLHdEQUFTO0FBQzdCOztBQUVBOztBQUVBO0FBQ0Esb0NBQW9DLGNBQWM7QUFDbEQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlFQUFlLFdBQVcsRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDN0JaO0FBQ2Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsWUFBWTtBQUNoQyxzQkFBc0IsWUFBWTtBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0Q0FBNEM7QUFDNUMsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMkM7QUFDM0MsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmOzs7Ozs7Ozs7Ozs7Ozs7QUN2RGU7QUFDZjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNENBQTRDOztBQUU1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7O0FBRUEsMEJBQTBCLGdCQUFnQjtBQUMxQyw0QkFBNEIsZ0JBQWdCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDdEtlO0FBQ2Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscURBQXFEOztBQUVyRCw0REFBNEQ7O0FBRTVELHFEQUFxRDs7QUFFckQsNERBQTREOztBQUU1RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNFQUFzRTtBQUN0RTtBQUNBO0FBQ0Esc0VBQXNFO0FBQ3RFO0FBQ0E7QUFDQSxzRUFBc0U7QUFDdEU7QUFDQTtBQUNBLHNFQUFzRTtBQUN0RTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLDhCQUE4QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLHdCQUF3QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsMkJBQTJCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDL0dlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEMsc0JBQXNCLFlBQVk7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmOzs7Ozs7Ozs7Ozs7Ozs7QUNoQmU7QUFDZjtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixZQUFZO0FBQ2hDLHNCQUFzQixZQUFZO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCLGVBQWU7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSwrQkFBK0IsZUFBZTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxxQkFBcUI7QUFDckI7Ozs7Ozs7Ozs7Ozs7OztBQzVGZTtBQUNmLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLFlBQVk7QUFDaEM7QUFDQSxzQkFBc0IsWUFBWTtBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyQ3NDOztBQUV2QjtBQUNmO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSSxtREFBVTtBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDekVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTjBCO0FBQ087O0FBRWpDLHdEQUFJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9zY3NzL21haW4uc2NzcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2FsZ29yaXRobWZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9hbGdvcml0aG1zL2FzdGFyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvYWxnb3JpdGhtcy9iaWRpcmVjdGlvbmFsLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvYWxnb3JpdGhtcy9kaWprc3RyYS5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2RvbWhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9ncmlkLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWFpbmhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplZmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL2JpbmFyeXRyZWUuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9odW50YW5ka2lsbC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL3ByaW1zLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvcmFuZG9tbWFwLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvcmVjdXJzaXZlZGl2aXNpb24uanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9zaWRld2luZGVyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbm9kZS5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgcnVuQmlkaXJlY3Rpb25hbCBmcm9tICcuL2FsZ29yaXRobXMvYmlkaXJlY3Rpb25hbCc7XG5pbXBvcnQgcnVuQXN0YXIgZnJvbSAnLi9hbGdvcml0aG1zL2FzdGFyJztcbmltcG9ydCBydW5EaWprc3RyYSBmcm9tICcuL2FsZ29yaXRobXMvZGlqa3N0cmEnO1xuXG5jbGFzcyBBbGdvcml0aG1GYWN0b3J5IHtcbiAgc3RhdGljIGNyZWF0ZUFsZ29yaXRobShhbGdvcml0aG1OYW1lKSB7XG4gICAgLy8gTWFwIGFsZ29yaXRobSBuYW1lcyB0byB0aGVpciBjb3JyZXNwb25kaW5nIGltcGxlbWVudGF0aW9uc1xuICAgIGNvbnN0IGFsZ29yaXRobXMgPSB7XG4gICAgICAnQSonOiBydW5Bc3RhcixcbiAgICAgIERpamtzdHJhOiBydW5EaWprc3RyYSxcbiAgICAgIEJpZGlyZWN0aW9uYWw6IHJ1bkJpZGlyZWN0aW9uYWwsXG4gICAgfTtcblxuICAgIGNvbnN0IEFsZ29yaXRobUNsYXNzID0gYWxnb3JpdGhtc1thbGdvcml0aG1OYW1lXTtcblxuICAgIGlmICghQWxnb3JpdGhtQ2xhc3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQWxnb3JpdGhtIFwiJHthbGdvcml0aG1OYW1lfVwiIG5vdCBmb3VuZGApO1xuICAgIH1cblxuICAgIHJldHVybiBBbGdvcml0aG1DbGFzcztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBbGdvcml0aG1GYWN0b3J5O1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcnVuQXN0YXIoc3RhcnROb2RlLCBlbmROb2RlLCBkZWxheSkge1xuICBjb25zdCBvcGVuTGlzdCA9IFtdO1xuICBjb25zdCBjbG9zZWRMaXN0ID0gW107XG4gIGNvbnN0IGZpbmFsUGF0aCA9IFtdO1xuXG4gIGZ1bmN0aW9uIHJlbW92ZUZyb21BcnIobm9kZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3Blbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChvcGVuTGlzdFtpXSA9PT0gbm9kZSkge1xuICAgICAgICBvcGVuTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gZGlzcGxheUZpbmFsUGF0aChwYXRoKSB7XG4gICAgZm9yIChsZXQgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChwYXRoW2ldLm5vZGVUeXBlICE9PSAnc3RhcnQnICYmIHBhdGhbaV0ubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwKSk7XG4gICAgICAgIHBhdGhbaV0uc2V0Tm9kZVR5cGUoJ2ZpbmFsLXBhdGgnLCBkZWxheSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3Blbkxpc3QucHVzaChzdGFydE5vZGUpO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGFsZ29yaXRobSgpIHtcbiAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgIH1cbiAgICBsZXQgY3VycmVudE5vZGUgPSBudWxsO1xuICAgIGxldCBsb3dlc3RGID0gSW5maW5pdHk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcGVuTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgb3Blbkxpc3RbaV0uY2FsY1Njb3JlcyhzdGFydE5vZGUsIGVuZE5vZGUpO1xuICAgICAgaWYgKG9wZW5MaXN0W2ldLmYgPCBsb3dlc3RGKSB7XG4gICAgICAgIGxvd2VzdEYgPSBvcGVuTGlzdFtpXS5mO1xuICAgICAgICBjdXJyZW50Tm9kZSA9IG9wZW5MaXN0W2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gZW5kTm9kZSkge1xuICAgICAgbGV0IHRlbXAgPSBjdXJyZW50Tm9kZTtcbiAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXApO1xuICAgICAgd2hpbGUgKHRlbXAucHJldmlvdXNOb2RlKSB7XG4gICAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXAucHJldmlvdXNOb2RlKTtcbiAgICAgICAgdGVtcCA9IHRlbXAucHJldmlvdXNOb2RlO1xuICAgICAgfVxuICAgICAgYXdhaXQgZGlzcGxheUZpbmFsUGF0aChmaW5hbFBhdGgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY2xvc2VkTGlzdC5wdXNoKGN1cnJlbnROb2RlKTtcbiAgICBpZiAoY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnY2xvc2VkLWxpc3QnLCBkZWxheSk7XG4gICAgfVxuICAgIHJlbW92ZUZyb21BcnIoY3VycmVudE5vZGUpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZS5uZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGN1cnJOZWlnaGJvciA9IGN1cnJlbnROb2RlLm5laWdoYm9yc1tpXTtcblxuICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ2JhcnJpZXInICYmICFjbG9zZWRMaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgY29uc3QgdGVtcEcgPSBjdXJyZW50Tm9kZS5nICsgMTtcbiAgICAgICAgaWYgKG9wZW5MaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgICBpZiAodGVtcEcgPCBjdXJyTmVpZ2hib3IuZykge1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSB0ZW1wRztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSB0ZW1wRztcbiAgICAgICAgICBvcGVuTGlzdC5wdXNoKGN1cnJOZWlnaGJvcik7XG4gICAgICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ3N0YXJ0JyAmJiBjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3Iuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcsIGRlbGF5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyTmVpZ2hib3IucHJldmlvdXNOb2RlID0gY3VycmVudE5vZGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wZW5MaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBhbGdvcml0aG0oKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gYWxnb3JpdGhtKCk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBydW5CaWRpcmVjdGlvbmFsKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgZGVsYXkpIHtcbiAgY29uc3QgdmlzaXRlZEZvcndhcmRzID0gbmV3IFNldCgpO1xuICBjb25zdCB2aXNpdGVkQmFja3dhcmRzID0gbmV3IFNldCgpO1xuXG4gIGNvbnN0IHF1ZXVlRm9yd2FyZHMgPSBbXTtcbiAgY29uc3QgcXVldWVCYWNrd2FyZHMgPSBbXTtcblxuICBhc3luYyBmdW5jdGlvbiBkaXNwbGF5RmluYWxQYXRoKGJhY2t3YXJkTm9kZSwgZm9yd2FyZE5vZGUpIHtcbiAgICBsZXQgcGF0aEZvcndhcmQgPSBbXTtcbiAgICBjb25zdCBwYXRoQmFja3dhcmQgPSBbXTtcblxuICAgIGxldCBub2RlID0gYmFja3dhcmROb2RlO1xuICAgIHBhdGhCYWNrd2FyZC5wdXNoKG5vZGUpO1xuICAgIHdoaWxlIChub2RlLnByZXZpb3VzTm9kZSkge1xuICAgICAgcGF0aEJhY2t3YXJkLnB1c2gobm9kZS5wcmV2aW91c05vZGUpO1xuICAgICAgbm9kZSA9IG5vZGUucHJldmlvdXNOb2RlO1xuICAgIH1cblxuICAgIGxldCBub2RlMiA9IGZvcndhcmROb2RlO1xuICAgIHBhdGhGb3J3YXJkLnB1c2gobm9kZTIpO1xuICAgIHdoaWxlIChub2RlMi5wcmV2aW91c05vZGUpIHtcbiAgICAgIHBhdGhGb3J3YXJkLnB1c2gobm9kZTIucHJldmlvdXNOb2RlKTtcbiAgICAgIG5vZGUyID0gbm9kZTIucHJldmlvdXNOb2RlO1xuICAgIH1cblxuICAgIGNvbnN0IHRlbXAgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gcGF0aEZvcndhcmQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRlbXAucHVzaChwYXRoRm9yd2FyZFtpXSk7XG4gICAgfVxuICAgIHBhdGhGb3J3YXJkID0gdGVtcDtcblxuICAgIGNvbnN0IGZpbmFsUGF0aCA9IHBhdGhGb3J3YXJkLmNvbmNhdChwYXRoQmFja3dhcmQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaW5hbFBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChmaW5hbFBhdGhbaV0ubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgZmluYWxQYXRoW2ldLm5vZGVUeXBlICE9PSAnZW5kJykge1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMCkpO1xuICAgICAgICBmaW5hbFBhdGhbaV0uc2V0Tm9kZVR5cGUoJ2ZpbmFsLXBhdGgnLCBkZWxheSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcXVldWVGb3J3YXJkcy5wdXNoKHN0YXJ0Tm9kZSk7XG4gIHF1ZXVlQmFja3dhcmRzLnB1c2goZW5kTm9kZSk7XG4gIHZpc2l0ZWRGb3J3YXJkcy5hZGQoc3RhcnROb2RlKTtcbiAgdmlzaXRlZEJhY2t3YXJkcy5hZGQoZW5kTm9kZSk7XG5cbiAgd2hpbGUgKHF1ZXVlRm9yd2FyZHMubGVuZ3RoID4gMCAmJiBxdWV1ZUJhY2t3YXJkcy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICB9XG5cbiAgICAvLyBmb3J3YXJkc1xuICAgIGNvbnN0IGN1cnJOb2RlRm9yd2FyZCA9IHF1ZXVlRm9yd2FyZHMuc2hpZnQoKTtcblxuICAgIGlmIChjdXJyTm9kZUZvcndhcmQgIT09IHN0YXJ0Tm9kZSkge1xuICAgICAgY3Vyck5vZGVGb3J3YXJkLnNldE5vZGVUeXBlKCdjbG9zZWQtbGlzdCcsIGRlbGF5KTtcbiAgICB9XG4gICAgY29uc3QgbmVpZ2hib3JzRm9yd2FyZCA9IGN1cnJOb2RlRm9yd2FyZC5uZWlnaGJvcnM7XG4gICAgbGV0IGN1cnJOZWlnaGJvckZvcndhcmQgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZWlnaGJvcnNGb3J3YXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjdXJyTmVpZ2hib3JGb3J3YXJkID0gbmVpZ2hib3JzRm9yd2FyZFtpXTtcbiAgICAgIGlmICh2aXNpdGVkQmFja3dhcmRzLmhhcyhjdXJyTmVpZ2hib3JGb3J3YXJkKSkge1xuICAgICAgICBkaXNwbGF5RmluYWxQYXRoKGN1cnJOZWlnaGJvckZvcndhcmQsIGN1cnJOb2RlRm9yd2FyZCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXZpc2l0ZWRGb3J3YXJkcy5oYXMoY3Vyck5laWdoYm9yRm9yd2FyZCkgJiYgIXF1ZXVlRm9yd2FyZHMuaW5jbHVkZXMoY3Vyck5laWdoYm9yRm9yd2FyZCkgJiYgY3Vyck5laWdoYm9yRm9yd2FyZC5ub2RlVHlwZSAhPT0gJ2JhcnJpZXInKSB7XG4gICAgICAgIHF1ZXVlRm9yd2FyZHMucHVzaChjdXJyTmVpZ2hib3JGb3J3YXJkKTtcbiAgICAgICAgY3Vyck5laWdoYm9yRm9yd2FyZC5wcmV2aW91c05vZGUgPSBjdXJyTm9kZUZvcndhcmQ7XG4gICAgICAgIGN1cnJOZWlnaGJvckZvcndhcmQuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcsIGRlbGF5KTtcbiAgICAgICAgdmlzaXRlZEZvcndhcmRzLmFkZChjdXJyTmVpZ2hib3JGb3J3YXJkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBiYWNrd2FyZHNcbiAgICBjb25zdCBjdXJyTm9kZUJhY2t3YXJkID0gcXVldWVCYWNrd2FyZHMuc2hpZnQoKTtcblxuICAgIGlmIChjdXJyTm9kZUJhY2t3YXJkICE9PSBlbmROb2RlKSB7XG4gICAgICBjdXJyTm9kZUJhY2t3YXJkLnNldE5vZGVUeXBlKCdjbG9zZWQtbGlzdCcsIGRlbGF5KTtcbiAgICB9XG4gICAgY29uc3QgbmVpZ2hib3JzQmFja3dhcmQgPSBjdXJyTm9kZUJhY2t3YXJkLm5laWdoYm9ycztcbiAgICBsZXQgY3Vyck5laWdoYm9yQmFja3dhcmQgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZWlnaGJvcnNCYWNrd2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgY3Vyck5laWdoYm9yQmFja3dhcmQgPSBuZWlnaGJvcnNCYWNrd2FyZFtpXTtcbiAgICAgIGlmICh2aXNpdGVkRm9yd2FyZHMuaGFzKGN1cnJOZWlnaGJvckJhY2t3YXJkKSkge1xuICAgICAgICBkaXNwbGF5RmluYWxQYXRoKGN1cnJOb2RlQmFja3dhcmQsIGN1cnJOZWlnaGJvckJhY2t3YXJkKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgIXZpc2l0ZWRCYWNrd2FyZHMuaGFzKGN1cnJOZWlnaGJvckJhY2t3YXJkKVxuICAgICAgICAmJiAhcXVldWVCYWNrd2FyZHMuaW5jbHVkZXMoY3Vyck5laWdoYm9yQmFja3dhcmQpXG4gICAgICAgICYmIGN1cnJOZWlnaGJvckJhY2t3YXJkLm5vZGVUeXBlICE9PSAnYmFycmllcidcbiAgICAgICkge1xuICAgICAgICBxdWV1ZUJhY2t3YXJkcy5wdXNoKGN1cnJOZWlnaGJvckJhY2t3YXJkKTtcbiAgICAgICAgY3Vyck5laWdoYm9yQmFja3dhcmQucHJldmlvdXNOb2RlID0gY3Vyck5vZGVCYWNrd2FyZDtcbiAgICAgICAgY3Vyck5laWdoYm9yQmFja3dhcmQuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcsIGRlbGF5KTtcbiAgICAgICAgdmlzaXRlZEJhY2t3YXJkcy5hZGQoY3Vyck5laWdoYm9yQmFja3dhcmQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJ1bkRpamtzdHJhKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgZGVsYXkpIHtcbiAgY29uc3Qgb3Blbkxpc3RRdWV1ZSA9IFtdOyAvLyB0cmFja3Mgbm9kZXMgdG8gdmlzaXRcbiAgY29uc3QgY2xvc2VkTGlzdCA9IFtdO1xuICBjb25zdCBmaW5hbFBhdGggPSBbXTtcblxuICBhc3luYyBmdW5jdGlvbiBkaXNwbGF5RmluYWxQYXRoKHBhdGgpIHtcbiAgICBmb3IgKGxldCBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKHBhdGhbaV0ubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgcGF0aFtpXS5ub2RlVHlwZSAhPT0gJ2VuZCcpIHtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMzApKTtcbiAgICAgICAgcGF0aFtpXS5zZXROb2RlVHlwZSgnZmluYWwtcGF0aCcsIGRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdGFydE5vZGUuZyA9IDA7XG4gIG9wZW5MaXN0UXVldWUucHVzaChzdGFydE5vZGUpO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGFsZ29yaXRobSgpIHtcbiAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgIH1cbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IG9wZW5MaXN0UXVldWUuc2hpZnQoKTtcbiAgICBpZiAoY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnY2xvc2VkLWxpc3QnLCBkZWxheSk7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnROb2RlID09PSBlbmROb2RlKSB7XG4gICAgICBsZXQgdGVtcCA9IGN1cnJlbnROb2RlO1xuICAgICAgZmluYWxQYXRoLnB1c2godGVtcCk7XG4gICAgICB3aGlsZSAodGVtcC5wcmV2aW91c05vZGUpIHtcbiAgICAgICAgZmluYWxQYXRoLnB1c2godGVtcC5wcmV2aW91c05vZGUpO1xuICAgICAgICB0ZW1wID0gdGVtcC5wcmV2aW91c05vZGU7XG4gICAgICB9XG4gICAgICBhd2FpdCBkaXNwbGF5RmluYWxQYXRoKGZpbmFsUGF0aCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnROb2RlLm5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY3Vyck5laWdoYm9yID0gY3VycmVudE5vZGUubmVpZ2hib3JzW2ldO1xuXG4gICAgICBpZiAoY3Vyck5laWdoYm9yLm5vZGVUeXBlICE9PSAnYmFycmllcicgJiYgIWNsb3NlZExpc3QuaW5jbHVkZXMoY3Vyck5laWdoYm9yKSkge1xuICAgICAgICBpZiAoY3Vyck5laWdoYm9yLmcgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSBjdXJyZW50Tm9kZS5nICsgMTtcbiAgICAgICAgICBjdXJyTmVpZ2hib3IucHJldmlvdXNOb2RlID0gY3VycmVudE5vZGU7XG4gICAgICAgICAgb3Blbkxpc3RRdWV1ZS5wdXNoKGN1cnJOZWlnaGJvcik7XG4gICAgICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ3N0YXJ0JyAmJiBjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3Iuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcsIGRlbGF5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3Blbkxpc3RRdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gYWxnb3JpdGhtKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGFsZ29yaXRobSgpO1xufVxuIiwiLy8gdXBkYXRlIHNxdWFyZSBkaXNwbGF5XG5mdW5jdGlvbiBkaXNwbGF5Tm9kZShub2RlLCBjdXJyTm9kZVR5cGUsIG5ld05vZGVUeXBlLCBncmlkLCBkZWxheSkge1xuICBjb25zdCBkb21TcXVhcmUgPSBncmlkLmZpbmREb21TcXVhcmUobm9kZS5yb3cgLSAxLCBub2RlLmNvbCAtIDEpO1xuXG4gIGlmIChkZWxheSAhPT0gMCkge1xuICAgIGRvbVNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlZCcpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbiAgICBkb21TcXVhcmUub2Zmc2V0V2lkdGg7XG4gICAgaWYgKG5ld05vZGVUeXBlICE9PSAnY2xvc2VkLWxpc3QnKSB7XG4gICAgICBkb21TcXVhcmUuY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZWQnKTtcbiAgICB9XG4gIH1cblxuICBkb21TcXVhcmUuY2xhc3NMaXN0LnRvZ2dsZShjdXJyTm9kZVR5cGUsIGZhbHNlKTtcbiAgZG9tU3F1YXJlLmNsYXNzTGlzdC50b2dnbGUobmV3Tm9kZVR5cGUsIHRydWUpO1xufVxuXG4vLyBmaWxsIGdyaWQgY29tcGxldGVseSB3aXRoIGJhcnJpZXJzXG5mdW5jdGlvbiBmaWxsR3JpZChncmlkLCBzcXVhcmVTaXplKSB7XG4gIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAvLyBDcmVhdGUgYSBkb2N1bWVudCBmcmFnbWVudCB0byBiYXRjaCB0aGUgdXBkYXRlc1xuICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICBncmlkQ29udGFpbmVyLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdncmlkLWNvbnRhaW5lcicpO1xuICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYCR7c3F1YXJlU2l6ZX0tZ3JpZGApO1xuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBjb25zdCBncmlkU3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2JhcnJpZXInKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZChgJHtzcXVhcmVTaXplfWApO1xuXG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChncmlkU3F1YXJlKTtcbiAgICB9XG4gIH1cblxuICAvLyBBcHBlbmQgdGhlIGVudGlyZSBmcmFnbWVudCB0byB0aGUgY29udGFpbmVyIGF0IG9uY2VcbiAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG59XG5cbi8vIGRpc3BsYXkgZnVsbCBncmlkXG5mdW5jdGlvbiBjcmVhdGVHcmlkKGdyaWQsIHNxdWFyZVNpemUpIHtcbiAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLWNvbnRhaW5lcicpO1xuICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gIC8vIENyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50IHRvIGJhdGNoIHRoZSB1cGRhdGVzXG4gIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gIGdyaWRDb250YWluZXIucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2dyaWQtY29udGFpbmVyJyk7XG4gIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LmFkZChgJHtzcXVhcmVTaXplfS1ncmlkYCk7XG5cbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgIGNvbnN0IGdyaWRTcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZChgJHtzcXVhcmVTaXplfWApO1xuXG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChncmlkU3F1YXJlKTtcbiAgICB9XG4gIH1cblxuICAvLyBBcHBlbmQgdGhlIGVudGlyZSBmcmFnbWVudCB0byB0aGUgY29udGFpbmVyIGF0IG9uY2VcbiAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG59XG5cbmNvbnN0IERvbUhhbmRsZXIgPSB7XG4gIGNyZWF0ZUdyaWQsXG4gIGZpbGxHcmlkLFxuICBkaXNwbGF5Tm9kZSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERvbUhhbmRsZXI7XG4iLCJpbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnO1xuaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb21oYW5kbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZCB7XG4gIGNvbnN0cnVjdG9yKHJvd3MsIGNvbHMsIG5vZGVXaWR0aCwgY3VycmVudGx5UnVubmluZykge1xuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5jb2xzID0gY29scztcbiAgICB0aGlzLm5vZGVXaWR0aCA9IG5vZGVXaWR0aDtcbiAgICB0aGlzLnN0YXJ0ID0geyBub2RlOiBudWxsIH07XG4gICAgdGhpcy5lbmQgPSB7IG5vZGU6IG51bGwgfTtcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICB0aGlzLm9wZW5MaXN0ID0gW107XG4gICAgdGhpcy5jbG9zZWRMaXN0ID0gW107XG4gICAgdGhpcy5maW5hbFBhdGggPSBbXTtcbiAgICB0aGlzLmNyZWF0ZUdyaWQodGhpcy5yb3dzLCB0aGlzLmNvbHMpO1xuICAgIHRoaXMuY3VycmVudGx5UnVubmluZyA9IGN1cnJlbnRseVJ1bm5pbmc7IC8vIGlzIGFuIGFsZ29yaXRobSBydW5uaW5nP1xuXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgdGhpcy5lcmFzZU1vZGVPbiA9IGZhbHNlO1xuICB9XG5cbiAgLy8gdXBkYXRlIHNxdWFyZSBub2RlIHR5cGUgYW5kIHVwZGF0ZSBjb3JyZXNwb25kaW5nIGRvbSBzcXVhcmVcbiAgc2V0U3F1YXJlU3RhdHVzKHJvdywgY29sKSB7XG4gICAgY29uc3QgY3VycmVudE5vZGUgPSB0aGlzLmdyaWRbcm93XVtjb2xdO1xuICAgIGlmICh0aGlzLmVyYXNlTW9kZU9uKSB7XG4gICAgICBpZiAoY3VycmVudE5vZGUgPT09IHRoaXMuc3RhcnQubm9kZSkgdGhpcy5zdGFydC5ub2RlID0gbnVsbDtcbiAgICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gdGhpcy5lbmQubm9kZSkgdGhpcy5lbmQubm9kZSA9IG51bGw7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdlbXB0eScpIHJldHVybjtcblxuICAgIGlmICh0aGlzLnN0YXJ0Lm5vZGUgPT09IG51bGwpIHtcbiAgICAgIGN1cnJlbnROb2RlLnNldE5vZGVUeXBlKCdzdGFydCcpO1xuICAgICAgdGhpcy5zdGFydC5ub2RlID0gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVuZC5ub2RlID09PSBudWxsKSB7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnZW5kJyk7XG4gICAgICB0aGlzLmVuZC5ub2RlID0gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnROb2RlLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW91c2VEb3duKHJvdywgY29sKSB7XG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnNldFNxdWFyZVN0YXR1cyhyb3csIGNvbCk7XG4gIH1cblxuICBoYW5kbGVNb3VzZU1vdmUocm93LCBjb2wpIHtcbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICB0aGlzLnNldFNxdWFyZVN0YXR1cyhyb3csIGNvbCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW91c2VVcCgpIHtcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIGZpbmQgc3F1YXJlIGluIHRoZSBkb21cbiAgZmluZERvbVNxdWFyZShyb3csIGNvbCkge1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyQ2hpbGRyZW4gPSBncmlkQ29udGFpbmVyLmNoaWxkcmVuO1xuICAgIGNvbnN0IGluZGV4ID0gcm93ICogdGhpcy5jb2xzICsgY29sO1xuICAgIHJldHVybiBncmlkQ29udGFpbmVyQ2hpbGRyZW5baW5kZXhdO1xuICB9XG5cbiAgYWRkTGlzdGVuZXJzKCkge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMucm93czsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgY29uc3QgZ3JpZFNxdWFyZSA9IHRoaXMuZmluZERvbVNxdWFyZShyb3csIGNvbCk7XG4gICAgICAgIGdyaWRTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRseVJ1bm5pbmdbMF0pIHJldHVybjtcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRG93bihyb3csIGNvbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBncmlkU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50bHlSdW5uaW5nWzBdKSByZXR1cm47XG4gICAgICAgICAgdGhpcy5oYW5kbGVNb3VzZU1vdmUocm93LCBjb2wpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVNb3VzZVVwKCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyB1c2VkIHRvIGNyZWF0ZSBncmlkIG9mIGVtcHR5IG9yIGJhcnJpZXIgc3F1YXJlc1xuICBjcmVhdGVHcmlkKHJvd3MsIGNvbHMpIHtcbiAgICBmb3IgKGxldCByb3cgPSAxOyByb3cgPD0gcm93czsgcm93KyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBbXTtcbiAgICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8PSBjb2xzOyBjb2wrKykge1xuICAgICAgICBjdXJyZW50Um93LnB1c2gobmV3IE5vZGUocm93LCBjb2wsIHRoaXMucm93cywgdGhpcy5jb2xzLCB0aGlzLCB0aGlzLm5vZGVXaWR0aCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5ncmlkLnB1c2goY3VycmVudFJvdyk7XG4gICAgfVxuICAgIERvbUhhbmRsZXIuY3JlYXRlR3JpZCh0aGlzLmdyaWQsIHRoaXMubm9kZVdpZHRoKTtcbiAgfVxuXG4gIC8vIGZpbGwgZ3JpZCBhcyBiYXJyaWVyc1xuICBmaWxsR3JpZCgpIHtcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICBmb3IgKGxldCByb3cgPSAxOyByb3cgPD0gdGhpcy5yb3dzOyByb3crKykge1xuICAgICAgY29uc3QgY3VycmVudFJvdyA9IFtdO1xuICAgICAgZm9yIChsZXQgY29sID0gMTsgY29sIDw9IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5ldyBOb2RlKHJvdywgY29sLCB0aGlzLnJvd3MsIHRoaXMuY29scywgdGhpcywgdGhpcy5ub2RlV2lkdGgpO1xuICAgICAgICBub2RlLm5vZGVUeXBlID0gJ2JhcnJpZXInO1xuICAgICAgICBjdXJyZW50Um93LnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmdyaWQucHVzaChjdXJyZW50Um93KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldEFsbE5vZGVOZWlnaGJvcnMoKTtcblxuICAgIHRoaXMuc3RhcnQubm9kZSA9IG51bGw7XG4gICAgdGhpcy5lbmQubm9kZSA9IG51bGw7XG5cbiAgICAvLyByZXNldGluZyBkb20gc3F1YXJlc1xuICAgIERvbUhhbmRsZXIuZmlsbEdyaWQodGhpcy5ncmlkLCB0aGlzLm5vZGVXaWR0aCk7XG4gICAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBuZWlnaGJvcnMgZm9yIGV2ZXJ5IHNpbmdsZSBub2RlIGluIGdyaWRcbiAgc2V0QWxsTm9kZU5laWdoYm9ycygpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLmdyaWQubGVuZ3RoOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5ncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLm5laWdoYm9ycyA9IFtdO1xuICAgICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLnNldE5laWdoYm9ycyh0aGlzLmdyaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHJlc2V0IGdyaWQgYW5kIGFsbCBub2RlcyBjb21wbGV0ZWx5XG4gIHJlc2V0R3JpZCgpIHtcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICBmb3IgKGxldCByb3cgPSAxOyByb3cgPD0gdGhpcy5yb3dzOyByb3crKykge1xuICAgICAgY29uc3QgY3VycmVudFJvdyA9IFtdO1xuICAgICAgZm9yIChsZXQgY29sID0gMTsgY29sIDw9IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgY3VycmVudFJvdy5wdXNoKG5ldyBOb2RlKHJvdywgY29sLCB0aGlzLnJvd3MsIHRoaXMuY29scywgdGhpcywgdGhpcy5ub2RlV2lkdGgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ3JpZC5wdXNoKGN1cnJlbnRSb3cpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0QWxsTm9kZU5laWdoYm9ycygpO1xuXG4gICAgdGhpcy5zdGFydC5ub2RlID0gbnVsbDtcbiAgICB0aGlzLmVuZC5ub2RlID0gbnVsbDtcblxuICAgIC8vIHJlc2V0aW5nIGRvbSBzcXVhcmVzXG4gICAgRG9tSGFuZGxlci5jcmVhdGVHcmlkKHRoaXMuZ3JpZCwgdGhpcy5ub2RlV2lkdGgpO1xuICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG4gIH1cblxuICAvLyByZXNldCBhbGdvcml0aG0gZGlzcGxheSBvbiBncmlkIGUuZyBmaW5hbCBwYXRoLCBvcGVuLWxpc3QgYW5kIGNsb3NlZC1saXN0XG4gIHJlc2V0UGF0aCgpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnJvd3M7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLmNvbHM7IGNvbCsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJOb2RlID0gdGhpcy5ncmlkW3Jvd11bY29sXTtcbiAgICAgICAgY29uc3QgY3VyclR5cGUgPSBjdXJyTm9kZS5ub2RlVHlwZTtcbiAgICAgICAgaWYgKGN1cnJUeXBlID09PSAnb3Blbi1saXN0JyB8fCBjdXJyVHlwZSA9PT0gJ2Nsb3NlZC1saXN0JyB8fCBjdXJyVHlwZSA9PT0gJ2ZpbmFsLXBhdGgnKSB7XG4gICAgICAgICAgY3Vyck5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5JywgMCk7XG4gICAgICAgICAgY3Vyck5vZGUucHJldmlvdXNOb2RlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUdyaWRTaXplKHJvd3MsIGNvbHMsIG5vZGVXaWR0aCkge1xuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5jb2xzID0gY29scztcbiAgICB0aGlzLm5vZGVXaWR0aCA9IG5vZGVXaWR0aDtcbiAgfVxuXG4gIHNldEVyYXNlTW9kZSgpIHtcbiAgICB0aGlzLmVyYXNlTW9kZU9uID0gIXRoaXMuZXJhc2VNb2RlT247XG4gIH1cbn1cbiIsImltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZCc7XG5pbXBvcnQgQWxnb3JpdGhtRmFjdG9yeSBmcm9tICcuL2FsZ29yaXRobWZhY3RvcnknO1xuaW1wb3J0IE1hemVGYWN0b3J5IGZyb20gJy4vbWF6ZWZhY3RvcnknO1xuXG5sZXQgZ3JpZE9iaiA9IG51bGw7XG5sZXQgc2VsZWN0ZWRBbGdvcml0aG0gPSBudWxsO1xubGV0IHNlbGVjdGVkTWF6ZSA9IG51bGw7XG5jb25zdCBydW5uaW5nID0gW2ZhbHNlXTsgLy8gY2hlY2sgaWYgcGF0aCBvciBtYXplIGFsZ29yaXRobSBpcyBjdXJyZW50bHkgcnVubmluZ1xubGV0IGN1cnJNYXplU3BlZWRTZXR0aW5nID0gJ05vcm1hbCc7XG5sZXQgY3VyclBhdGhmaW5kaW5nU3BlZWRTZXR0aW5nID0gJ05vcm1hbCc7XG5sZXQgbWF6ZVNwZWVkID0gMTA7XG5sZXQgcGF0aGZpbmRpbmdTcGVlZCA9IDEwO1xubGV0IGdyaWRTaXplID0gJ21lZGl1bSc7XG5cbi8vIGNvbnRhaW5zIGluZm8gYXNzb2NpYXRlZCB3aXRoIGVhY2ggZ3JpZCBzaXplXG5jb25zdCBncmlkU2l6ZXMgPSB7XG4gIHNtYWxsOiB7IHJvd3M6IDE1LCBjb2xzOiAzNyB9LFxuICBtZWRpdW06IHsgcm93czogMjUsIGNvbHM6IDYxIH0sXG4gIGxhcmdlOiB7IHJvd3M6IDM3LCBjb2xzOiA5MSB9LFxufTtcblxuLy8gcGF0aGZpbmRpbmcgc3BlZWRzIGZvciBkaWZmZXJlbnQgZ3JpZCBzaXplc1xuY29uc3QgcGF0aGZpbmRpbmdTcGVlZHMgPSB7XG4gIHNsb3c6IHsgc21hbGw6IDE1MCwgbWVkaXVtOiAzMCwgbGFyZ2U6IDMwIH0sXG4gIG5vcm1hbDogeyBzbWFsbDogNTAsIG1lZGl1bTogMTAsIGxhcmdlOiAxMCB9LFxuICBmYXN0OiB7IHNtYWxsOiAyMCwgbWVkaXVtOiA1LCBsYXJnZTogMSB9LFxuICBpbnN0YW50OiAwLFxufTtcblxuLy8gbWF6ZSBnZW5lcmF0aW9uIHNwZWVkcyBmb3IgZGlmZmVyZW50IGdyaWQgc2l6ZXNcbmNvbnN0IG1hemVHZW5TcGVlZHMgPSB7XG4gIHNsb3c6IHsgc21hbGw6IDEyMCwgbWVkaXVtOiAyMCwgbGFyZ2U6IDEwIH0sXG4gIG5vcm1hbDogeyBzbWFsbDogMzAsIG1lZGl1bTogMTAsIGxhcmdlOiAzIH0sXG4gIGZhc3Q6IHsgc21hbGw6IDE1LCBtZWRpdW06IDEsIGxhcmdlOiAwLjEgfSxcbiAgaW5zdGFudDogMCxcbn07XG5cbi8vIGluaXRpYWxseSBsb2FkZWQgZ3JpZFxuZnVuY3Rpb24gbG9hZEdyaWQoKSB7XG4gIGdyaWRPYmogPSBuZXcgR3JpZChncmlkU2l6ZXMubWVkaXVtLnJvd3MsIGdyaWRTaXplcy5tZWRpdW0uY29scywgZ3JpZFNpemUsIHJ1bm5pbmcpO1xuICBncmlkT2JqLnNldEFsbE5vZGVOZWlnaGJvcnMoKTtcbn1cblxuLy8gcnVuIHBhdGhmaW5kaW5nIGFsZ29yaXRobVxuYXN5bmMgZnVuY3Rpb24gcnVuQWxnb3JpdGhtKHBhdGhGaW5kaW5nQWxnb3JpdGhtKSB7XG4gIGlmIChydW5uaW5nWzBdIHx8ICFwYXRoRmluZGluZ0FsZ29yaXRobSB8fCAhZ3JpZE9iai5zdGFydC5ub2RlIHx8ICFncmlkT2JqLmVuZC5ub2RlKSByZXR1cm47XG4gIHJ1bm5pbmdbMF0gPSB0cnVlO1xuXG4gIGdyaWRPYmoucmVzZXRQYXRoKCk7XG5cbiAgaWYgKHBhdGhGaW5kaW5nQWxnb3JpdGhtID09PSAnRGlqa3N0cmEnKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZE9iai5ncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRPYmouZ3JpZFswXS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICAgIGdyaWRPYmouZ3JpZFtyb3ddW2NvbF0uZyA9IEluZmluaXR5O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXJ0Tm9kZSA9IGdyaWRPYmouc3RhcnQubm9kZTtcbiAgY29uc3QgZW5kTm9kZSA9IGdyaWRPYmouZW5kLm5vZGU7XG5cbiAgY29uc3QgYWxnb3JpdGhtID0gQWxnb3JpdGhtRmFjdG9yeS5jcmVhdGVBbGdvcml0aG0ocGF0aEZpbmRpbmdBbGdvcml0aG0pO1xuICBhd2FpdCBhbGdvcml0aG0oc3RhcnROb2RlLCBlbmROb2RlLCBwYXRoZmluZGluZ1NwZWVkKTtcblxuICBydW5uaW5nWzBdID0gZmFsc2U7XG59XG5cbi8vIHJ1biBtYXplIGdlbmVyYXRpb24gYWxnb3JpdGhtXG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZU1hemUobWF6ZUdlbmVyYXRpb25BbGdvcml0aG0pIHtcbiAgaWYgKHJ1bm5pbmdbMF0gfHwgbWF6ZUdlbmVyYXRpb25BbGdvcml0aG0gPT09IG51bGwpIHJldHVybjtcbiAgcnVubmluZ1swXSA9IHRydWU7XG4gIGdyaWRPYmoucmVzZXRHcmlkKCk7XG5cbiAgY29uc3QgbWF6ZSA9IE1hemVGYWN0b3J5LmNyZWF0ZU1hemUobWF6ZUdlbmVyYXRpb25BbGdvcml0aG0pO1xuICBhd2FpdCBtYXplKGdyaWRPYmosIG1hemVTcGVlZCk7XG5cbiAgcnVubmluZ1swXSA9IGZhbHNlO1xufVxuXG4vLyB1cGRhdGUgaG93IGZhc3QgbWF6ZSBnZW5lcmF0ZXNcbmZ1bmN0aW9uIHVwZGF0ZU1hemVEZWxheShzcGVlZCkge1xuICBjb25zdCBuZXdTcGVlZCA9IHNwZWVkLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChncmlkU2l6ZSA9PT0gJ3NtYWxsJykge1xuICAgIG1hemVTcGVlZCA9IG1hemVHZW5TcGVlZHNbbmV3U3BlZWRdLnNtYWxsO1xuICB9XG4gIGlmIChncmlkU2l6ZSA9PT0gJ21lZGl1bScpIHtcbiAgICBtYXplU3BlZWQgPSBtYXplR2VuU3BlZWRzW25ld1NwZWVkXS5tZWRpdW07XG4gIH1cbiAgaWYgKGdyaWRTaXplID09PSAnbGFyZ2UnKSB7XG4gICAgbWF6ZVNwZWVkID0gbWF6ZUdlblNwZWVkc1tuZXdTcGVlZF0ubGFyZ2U7XG4gIH1cblxuICBpZiAoc3BlZWQgPT09ICdJbnN0YW50JykgbWF6ZVNwZWVkID0gbWF6ZUdlblNwZWVkcy5pbnN0YW50O1xufVxuXG4vLyB1cGRhdGUgaG93IGZhc3QgcGF0aCBhbGdvcml0aG0gZXhwbG9yZXMgbm9kZXNcbmZ1bmN0aW9uIHVwZGF0ZVBhdGhmaW5kaW5nRGVsYXkoc3BlZWQpIHtcbiAgY29uc3QgbmV3U3BlZWQgPSBzcGVlZC50b0xvd2VyQ2FzZSgpO1xuICBpZiAoZ3JpZFNpemUgPT09ICdzbWFsbCcpIHtcbiAgICBwYXRoZmluZGluZ1NwZWVkID0gcGF0aGZpbmRpbmdTcGVlZHNbbmV3U3BlZWRdLnNtYWxsO1xuICB9XG4gIGlmIChncmlkU2l6ZSA9PT0gJ21lZGl1bScpIHtcbiAgICBwYXRoZmluZGluZ1NwZWVkID0gcGF0aGZpbmRpbmdTcGVlZHNbbmV3U3BlZWRdLm1lZGl1bTtcbiAgfVxuICBpZiAoZ3JpZFNpemUgPT09ICdsYXJnZScpIHtcbiAgICBwYXRoZmluZGluZ1NwZWVkID0gcGF0aGZpbmRpbmdTcGVlZHNbbmV3U3BlZWRdLmxhcmdlO1xuICB9XG5cbiAgaWYgKHNwZWVkID09PSAnSW5zdGFudCcpIHBhdGhmaW5kaW5nU3BlZWQgPSBwYXRoZmluZGluZ1NwZWVkcy5pbnN0YW50O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVHcmlkU2l6ZShzaXplKSB7XG4gIGNvbnN0IG5ld1NpemUgPSBzaXplLnRvTG93ZXJDYXNlKCk7XG4gIGdyaWRTaXplID0gbmV3U2l6ZTtcblxuICBncmlkT2JqLnVwZGF0ZUdyaWRTaXplKGdyaWRTaXplc1tuZXdTaXplXS5yb3dzLCBncmlkU2l6ZXNbbmV3U2l6ZV0uY29scywgbmV3U2l6ZSk7XG5cbiAgZ3JpZE9iai5yZXNldEdyaWQoKTtcblxuICB1cGRhdGVQYXRoZmluZGluZ0RlbGF5KGN1cnJQYXRoZmluZGluZ1NwZWVkU2V0dGluZyk7XG4gIHVwZGF0ZU1hemVEZWxheShjdXJyTWF6ZVNwZWVkU2V0dGluZyk7XG59XG5cbmZ1bmN0aW9uIGFkZExpc3RlbmVyc1RvQnRucygpIHtcbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnQtYWxnb3JpdGhtJyk7XG4gIGNvbnN0IGdlbmVyYXRlTWF6ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nZW5lcmF0ZS1tYXplJyk7XG5cbiAgY29uc3Qgc2VsZWN0QWxnb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtYWxnby1idG4nKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtbWF6ZS1idG4nKTtcbiAgY29uc3QgZ3JpZFNpemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1zaXplLWJ0bicpO1xuICBjb25zdCBzZWxlY3RNYXplU3BlZWRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LW1hemUtc3BlZWQtYnRuJyk7XG4gIGNvbnN0IHNlbGVjdEFsZ29TcGVlZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtYWxnby1zcGVlZC1idG4nKTtcblxuICBjb25zdCBzZWxlY3RBbGdvQnRuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hbGdvLWxpc3QnKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZUJ0bkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWF6ZS1saXN0Jyk7XG4gIGNvbnN0IGdyaWRTaXplQnRuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLXNpemUtbGlzdCcpO1xuICBjb25zdCBzZWxlY3RNYXplU3BlZWRCdG5MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1hemUtc3BlZWQtbGlzdCcpO1xuICBjb25zdCBzZWxlY3RBbGdvU3BlZWRCdG5MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsZ28tc3BlZWQtbGlzdCcpO1xuICBjb25zdCBzZWxlY3RBbGdvTGlzdEl0ZW1zID0gc2VsZWN0QWxnb0J0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG4gIGNvbnN0IHNlbGVjdE1hemVMaXN0SXRlbXMgPSBzZWxlY3RNYXplQnRuTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC1zZWxlY3Rpb24nKTtcbiAgY29uc3QgZ3JpZFNpemVMaXN0SXRlbXMgPSBncmlkU2l6ZUJ0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG4gIGNvbnN0IHNlbGVjdE1hemVTcGVlZExpc3RJdGVtcyA9IHNlbGVjdE1hemVTcGVlZEJ0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG4gIGNvbnN0IHNlbGVjdEFsZ29TcGVlZExpc3RJdGVtcyA9IHNlbGVjdEFsZ29TcGVlZEJ0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG5cbiAgY29uc3QgZHJvcGRvd25CdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Bkb3duLWJ0bicpO1xuICBjb25zdCBkcm9wZG93bkxpc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Bkb3duLWxpc3QnKTtcbiAgY29uc3QgY2xlYXJCb2FyZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbGVhci1ib2FyZCcpO1xuICBjb25zdCBjbGVhclBhdGhCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xlYXItcGF0aCcpO1xuICBjb25zdCBlcmFzZU1vZGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZXJhc2UtbW9kZScpO1xuXG4gIGxldCBjdXJyZW50UGFnZSA9IDA7XG4gIGNvbnN0IGRhcmtPdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRhcmstb3ZlcmxheScpO1xuICBjb25zdCBoZWxwQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVscC1ib2FyZCcpO1xuICBjb25zdCBwYWdlcyA9IGhlbHBCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnZScpO1xuICBjb25zdCBza2lwQnRucyA9IGhlbHBCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2tpcC1idG4nKTtcbiAgY29uc3QgbmV4dEJ0bnMgPSBoZWxwQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLm5leHQtYnRuJyk7XG4gIGNvbnN0IHByZXZpb3VzQnRucyA9IGhlbHBCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcucHJldmlvdXMtYnRuJyk7XG4gIGNvbnN0IGNvbnRpbnVlQnRuID0gaGVscEJvYXJkLnF1ZXJ5U2VsZWN0b3IoJy5jb250aW51ZS1idG4nKTtcbiAgY29uc3QgaGVscEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWxwLWJ0bicpO1xuXG4gIHN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIHJ1bkFsZ29yaXRobShzZWxlY3RlZEFsZ29yaXRobSk7XG4gIH0pO1xuXG4gIGdlbmVyYXRlTWF6ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBnZW5lcmF0ZU1hemUoc2VsZWN0ZWRNYXplKTtcbiAgfSk7XG5cbiAgc2tpcEJ0bnMuZm9yRWFjaCgoc2tpcEJ0bikgPT4ge1xuICAgIHNraXBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBoZWxwQm9hcmQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGRhcmtPdmVybGF5LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHByZXZpb3VzQnRucy5mb3JFYWNoKChwcmV2aW91c0J0bikgPT4ge1xuICAgIHByZXZpb3VzQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKGN1cnJlbnRQYWdlID4gMCkge1xuICAgICAgICBwYWdlc1tjdXJyZW50UGFnZV0ucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuICAgICAgICBjdXJyZW50UGFnZSAtPSAxO1xuICAgICAgICBwYWdlc1tjdXJyZW50UGFnZV0uc2V0QXR0cmlidXRlKCdpZCcsICdzaG93LXBhZ2UnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgbmV4dEJ0bnMuZm9yRWFjaCgobmV4dEJ0bikgPT4ge1xuICAgIG5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAoY3VycmVudFBhZ2UgPCBwYWdlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHBhZ2VzW2N1cnJlbnRQYWdlXS5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgIGN1cnJlbnRQYWdlICs9IDE7XG4gICAgICAgIHBhZ2VzW2N1cnJlbnRQYWdlXS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3Nob3ctcGFnZScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBjb250aW51ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBoZWxwQm9hcmQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBkYXJrT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9KTtcblxuICBmdW5jdGlvbiBjbG9zZURyb3Bkb3ducygpIHtcbiAgICBkcm9wZG93bkxpc3RzLmZvckVhY2goKGxpc3QpID0+IHtcbiAgICAgIGxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgIH0pO1xuICB9XG5cbiAgZHJvcGRvd25CdXR0b25zLmZvckVhY2goKGJ1dHRvbiwgaW5kZXgpID0+IHtcbiAgICBpZiAocnVubmluZ1swXSkgcmV0dXJuOyAvLyBhbGdvcml0aG0gaW4gcHJvZ3Jlc3NcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRMaXN0ID0gZHJvcGRvd25MaXN0c1tpbmRleF07XG4gICAgICBjb25zdCBpc0xpc3RPcGVuID0gY3VycmVudExpc3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93Jyk7XG5cbiAgICAgIGNsb3NlRHJvcGRvd25zKCk7XG5cbiAgICAgIGlmICghaXNMaXN0T3Blbikge1xuICAgICAgICBjdXJyZW50TGlzdC5jbGFzc0xpc3QudG9nZ2xlKCdzaG93Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBjb25zdCBpc0NsaWNrSW5zaWRlRHJvcGRvd24gPSBBcnJheS5mcm9tKGRyb3Bkb3duTGlzdHMpLnNvbWUoKGxpc3QpID0+IGxpc3QuY29udGFpbnMoZS50YXJnZXQpKTtcblxuICAgIGlmICghaXNDbGlja0luc2lkZURyb3Bkb3duKSB7XG4gICAgICBjbG9zZURyb3Bkb3ducygpO1xuICAgIH1cbiAgfSk7XG5cbiAgaGVscEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBkYXJrT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBoZWxwQm9hcmQuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgfSk7XG5cbiAgc2VsZWN0QWxnb0xpc3RJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBzZWxlY3RBbGdvQnRuTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICBzZWxlY3RBbGdvQnRuLnRleHRDb250ZW50ID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgIHNlbGVjdGVkQWxnb3JpdGhtID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGVjdE1hemVMaXN0SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgc2VsZWN0TWF6ZUJ0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0TWF6ZUJ0bi50ZXh0Q29udGVudCA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICBzZWxlY3RlZE1hemUgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZWN0TWF6ZVNwZWVkTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHNlbGVjdE1hemVTcGVlZEJ0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0TWF6ZVNwZWVkQnRuLnRleHRDb250ZW50ID0gYE1hemUgU3BlZWQ6ICR7aXRlbS50ZXh0Q29udGVudH1gO1xuICAgICAgY3Vyck1hemVTcGVlZFNldHRpbmcgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgdXBkYXRlTWF6ZURlbGF5KGl0ZW0udGV4dENvbnRlbnQpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZWN0QWxnb1NwZWVkTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHNlbGVjdEFsZ29TcGVlZEJ0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0QWxnb1NwZWVkQnRuLnRleHRDb250ZW50ID0gYFBhdGhmaW5kaW5nIFNwZWVkOiAke2l0ZW0udGV4dENvbnRlbnR9YDtcbiAgICAgIGN1cnJQYXRoZmluZGluZ1NwZWVkU2V0dGluZyA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICB1cGRhdGVQYXRoZmluZGluZ0RlbGF5KGl0ZW0udGV4dENvbnRlbnQpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZ3JpZFNpemVMaXN0SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjtcbiAgICAgIGdyaWRTaXplQnRuTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICBncmlkU2l6ZUJ0bi50ZXh0Q29udGVudCA9IGBHcmlkIFNpemU6ICR7aXRlbS50ZXh0Q29udGVudH1gO1xuICAgICAgdXBkYXRlR3JpZFNpemUoaXRlbS50ZXh0Q29udGVudCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuICB9KTtcblxuICBjbGVhckJvYXJkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChydW5uaW5nWzBdKSByZXR1cm47XG4gICAgZ3JpZE9iai5yZXNldEdyaWQoKTtcbiAgfSk7XG5cbiAgY2xlYXJQYXRoQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChydW5uaW5nWzBdKSByZXR1cm47XG4gICAgZ3JpZE9iai5yZXNldFBhdGgoKTtcbiAgfSk7XG5cbiAgZXJhc2VNb2RlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBpZiAoZS50YXJnZXQudGV4dENvbnRlbnQgPT09ICdFcmFzZTogT2ZmJykge1xuICAgICAgZS50YXJnZXQudGV4dENvbnRlbnQgPSAnRXJhc2U6IE9uJztcbiAgICB9IGVsc2UgaWYgKGUudGFyZ2V0LnRleHRDb250ZW50ID09PSAnRXJhc2U6IE9uJykge1xuICAgICAgZS50YXJnZXQudGV4dENvbnRlbnQgPSAnRXJhc2U6IE9mZic7XG4gICAgfVxuICAgIGdyaWRPYmouc2V0RXJhc2VNb2RlKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnNUb0dyaWQoKSB7XG4gIGdyaWRPYmouYWRkTGlzdGVuZXJzKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWQoKSB7XG4gIGxvYWRHcmlkKCk7XG4gIGFkZExpc3RlbmVyc1RvR3JpZCgpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIGFkZExpc3RlbmVyc1RvQnRucygpO1xuICB9KTtcbn1cbiIsImltcG9ydCByZWN1cnNpdmVEaXZpc2lvbiBmcm9tICcuL21hemVzL3JlY3Vyc2l2ZWRpdmlzaW9uJztcbmltcG9ydCBiaW5hcnlUcmVlIGZyb20gJy4vbWF6ZXMvYmluYXJ5dHJlZSc7XG5pbXBvcnQgc2lkZXdpbmRlciBmcm9tICcuL21hemVzL3NpZGV3aW5kZXInO1xuaW1wb3J0IGdlbmVyYXRlUHJpbXMgZnJvbSAnLi9tYXplcy9wcmltcyc7XG5pbXBvcnQgZ2VuZXJhdGVIdW50QW5kS2lsbCBmcm9tICcuL21hemVzL2h1bnRhbmRraWxsJztcbmltcG9ydCByYW5kb21NYXAgZnJvbSAnLi9tYXplcy9yYW5kb21tYXAnO1xuXG5jbGFzcyBNYXplRmFjdG9yeSB7XG4gIHN0YXRpYyBjcmVhdGVNYXplKG1hemVBbGdvcml0aG0pIHtcbiAgICAvLyBNYXAgYWxnb3JpdGhtIG5hbWVzIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgaW1wbGVtZW50YXRpb25zXG4gICAgY29uc3QgYWxnb3JpdGhtcyA9IHtcbiAgICAgICdSZWN1cnNpdmUgRGl2aXNpb24nOiByZWN1cnNpdmVEaXZpc2lvbixcbiAgICAgICdCaW5hcnkgVHJlZSc6IGJpbmFyeVRyZWUsXG4gICAgICBTaWRld2luZGVyOiBzaWRld2luZGVyLFxuICAgICAgXCJQcmltJ3NcIjogZ2VuZXJhdGVQcmltcyxcbiAgICAgICdIdW50ICYgS2lsbCc6IGdlbmVyYXRlSHVudEFuZEtpbGwsXG4gICAgICAnUmFuZG9tIE1hcCc6IHJhbmRvbU1hcCxcbiAgICB9O1xuXG4gICAgY29uc3QgQWxnb3JpdGhtQ2xhc3MgPSBhbGdvcml0aG1zW21hemVBbGdvcml0aG1dO1xuXG4gICAgaWYgKCFBbGdvcml0aG1DbGFzcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbGdvcml0aG0gXCIke21hemVBbGdvcml0aG19XCIgbm90IGZvdW5kYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEFsZ29yaXRobUNsYXNzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hemVGYWN0b3J5O1xuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYmluYXJ5VHJlZShncmlkT2JqLCBkZWxheSkge1xuICAvLyBmaWxsIGdyaWQgd2l0aCBiYXJyaWVyc1xuICBncmlkT2JqLmZpbGxHcmlkKCk7XG5cbiAgY29uc3QgZ3JpZCA9IGdyaWRPYmouZ3JpZDtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG5cbiAgZnVuY3Rpb24gY29ubmVjdChub2RlMSwgbm9kZTIsIGJhcnJpZXJCZXR3ZWVuKSB7XG4gICAgbm9kZTEuc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgIG5vZGUyLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgICBiYXJyaWVyQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gIH1cblxuICBmb3IgKGxldCByb3cgPSAxOyByb3cgPCByb3dzOyByb3cgKz0gMikge1xuICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8IGNvbHM7IGNvbCArPSAyKSB7XG4gICAgICBjb25zdCBjdXJyZW50U3F1YXJlID0gZ3JpZFtyb3ddW2NvbF07XG4gICAgICBsZXQgbm9ydGhOZWlnaGJvcjtcbiAgICAgIGxldCB3ZXN0TmVpZ2hib3I7XG5cbiAgICAgIGlmIChyb3cgPiAxKSB7XG4gICAgICAgIG5vcnRoTmVpZ2hib3IgPSBncmlkW3JvdyAtIDJdW2NvbF07IC8vIHVwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub3J0aE5laWdoYm9yID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbCA+IDEpIHtcbiAgICAgICAgd2VzdE5laWdoYm9yID0gZ3JpZFtyb3ddW2NvbCAtIDJdOyAvLyBsZWZ0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3ZXN0TmVpZ2hib3IgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAobm9ydGhOZWlnaGJvciAmJiB3ZXN0TmVpZ2hib3IpIHtcbiAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgYm90aCBwYXRocyBhcmUgYXZhaWxhYmxlXG4gICAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICAgICAgICBpZiAocmFuZG9tID09PSAwKSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCBub3J0aE5laWdoYm9yLCBjdXJyZW50U3F1YXJlLm5laWdoYm9yc1szXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCB3ZXN0TmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzFdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgb25lIG9mIHRoZSBwYXRocyBnbyBiZXlvbmQgdGhlIGdyaWRcbiAgICAgICAgaWYgKHJvdyA9PT0gMSAmJiBjb2wgPiAxKSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCB3ZXN0TmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzFdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sID09PSAxICYmIHJvdyA+IDEpIHtcbiAgICAgICAgICBjb25uZWN0KGN1cnJlbnRTcXVhcmUsIG5vcnRoTmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzNdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZUh1bnRBbmRLaWxsKGdyaWRPYmosIGRlbGF5KSB7XG4gIC8vIHNldCB0aGUgZW50aXJlIGdyaWQgYXMgYmFycmllcnNcbiAgZ3JpZE9iai5maWxsR3JpZCgpO1xuXG4gIGNvbnN0IGdyaWQgPSBncmlkT2JqLmdyaWQ7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuICBjb25zdCB2aXNpdGVkID0gW107XG5cbiAgLy8gYWRkIG5laWdoYm9ycyAtIGRpcmVjdGx5IGFkamFjZW50IG5laWdoYm9ycyBhcmUgc2tpcHBlZCBzbyB0aGV5IGNhbiBiZSB3YWxscyBpZiBuZWVkZWRcbiAgZnVuY3Rpb24gZ2V0VW52aXNpdGVkTmVpZ2hib3JzKG5vZGUpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBjb25zdCByb3cgPSBub2RlLnJvdyAtIDE7XG4gICAgY29uc3QgY29sID0gbm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgIGlmICghdmlzaXRlZC5pbmNsdWRlcyhncmlkW3JvdyAtIDJdW2NvbF0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93IC0gMl1bY29sXSk7IC8vIHVwXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJvdyA8IHJvd3MgLSAyKSB7XG4gICAgICBpZiAoIXZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3cgKyAyXVtjb2xdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3JvdyArIDJdW2NvbF0pOyAvLyBkb3duXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbCA+IDEpIHtcbiAgICAgIGlmICghdmlzaXRlZC5pbmNsdWRlcyhncmlkW3Jvd11bY29sIC0gMl0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgLSAyXSk7IC8vIGxlZnRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29sIDwgY29scyAtIDIpIHtcbiAgICAgIGlmICghdmlzaXRlZC5pbmNsdWRlcyhncmlkW3Jvd11bY29sICsgMl0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgKyAyXSk7IC8vIHJpZ2h0XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5laWdoYm9ycztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZpc2l0ZWROZWlnaGJvcnMobm9kZSkge1xuICAgIGNvbnN0IG5laWdoYm9ycyA9IFtdO1xuICAgIGNvbnN0IHJvdyA9IG5vZGUucm93IC0gMTtcbiAgICBjb25zdCBjb2wgPSBub2RlLmNvbCAtIDE7XG5cbiAgICBpZiAocm93ID4gMSkge1xuICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3cgLSAyXVtjb2xdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3JvdyAtIDJdW2NvbF0pOyAvLyB1cFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyb3cgPCByb3dzIC0gMikge1xuICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3cgKyAyXVtjb2xdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3JvdyArIDJdW2NvbF0pOyAvLyBkb3duXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbCA+IDEpIHtcbiAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93XVtjb2wgLSAyXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCAtIDJdKTsgLy8gbGVmdFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2wgPCBjb2xzIC0gMikge1xuICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3ddW2NvbCArIDJdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3Jvd11bY29sICsgMl0pOyAvLyByaWdodFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZWlnaGJvcnM7XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21seVNlbGVjdE5laWdoYm9yKG5laWdoYm9ycykge1xuICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbmVpZ2hib3JzLmxlbmd0aCk7XG4gICAgcmV0dXJuIG5laWdoYm9yc1tpbmRleF07XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZVN0YXJ0UG9pbnQoKSB7XG4gICAgLy8gY2hvb3NlIGEgcmFuZG9tIHBvaW50IG9uIHRoZSBncmlkIHRvIHN0YXJ0IHdpdGhcbiAgICBsZXQgcmFuZG9tTm9kZUZvdW5kID0gZmFsc2U7XG4gICAgbGV0IHJhbmRvbUZpcnN0Tm9kZSA9IG51bGw7XG4gICAgd2hpbGUgKCFyYW5kb21Ob2RlRm91bmQpIHtcbiAgICAgIGNvbnN0IHJhbmRvbVJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChyb3dzIC0gNCkpICsgMjtcbiAgICAgIGNvbnN0IHJhbmRvbUNvbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChjb2xzIC0gNCkpICsgMjtcbiAgICAgIGlmIChyYW5kb21Sb3cgJSAyICE9PSAwICYmIHJhbmRvbUNvbCAlIDIgIT09IDApIHtcbiAgICAgICAgcmFuZG9tRmlyc3ROb2RlID0gZ3JpZFtyYW5kb21Sb3ddW3JhbmRvbUNvbF07XG4gICAgICAgIHJhbmRvbUZpcnN0Tm9kZS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgICAgIHJhbmRvbU5vZGVGb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByYW5kb21GaXJzdE5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVXYWxsQmV0d2VlbihjdXJyTm9kZSwgbmV4dE5vZGUpIHtcbiAgICBjb25zdCByb3cgPSBjdXJyTm9kZS5yb3cgLSAxO1xuICAgIGNvbnN0IGNvbCA9IGN1cnJOb2RlLmNvbCAtIDE7XG5cbiAgICBpZiAocm93ID4gMSkge1xuICAgICAgaWYgKGdyaWRbcm93IC0gMl1bY29sXSA9PT0gbmV4dE5vZGUpIHtcbiAgICAgICAgY29uc3Qgd2FsbEJldHdlZW4gPSBncmlkW3JvdyAtIDFdW2NvbF07XG4gICAgICAgIHdhbGxCZXR3ZWVuLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJvdyA8IHJvd3MgLSAyKSB7XG4gICAgICBpZiAoZ3JpZFtyb3cgKyAyXVtjb2xdID09PSBuZXh0Tm9kZSkge1xuICAgICAgICBjb25zdCB3YWxsQmV0d2VlbiA9IGdyaWRbcm93ICsgMV1bY29sXTtcbiAgICAgICAgd2FsbEJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY29sID4gMSkge1xuICAgICAgaWYgKGdyaWRbcm93XVtjb2wgLSAyXSA9PT0gbmV4dE5vZGUpIHtcbiAgICAgICAgY29uc3Qgd2FsbEJldHdlZW4gPSBncmlkW3Jvd11bY29sIC0gMV07XG4gICAgICAgIHdhbGxCZXR3ZWVuLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvbCA8IGNvbHMgLSAyKSB7XG4gICAgICBpZiAoZ3JpZFtyb3ddW2NvbCArIDJdID09PSBuZXh0Tm9kZSkge1xuICAgICAgICBjb25zdCB3YWxsQmV0d2VlbiA9IGdyaWRbcm93XVtjb2wgKyAxXTtcbiAgICAgICAgd2FsbEJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGN1cnJOb2RlLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgICBuZXh0Tm9kZS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBhbGdvcml0aG0oKSB7XG4gICAgbGV0IGN1cnJlbnROb2RlID0gZ2VuZXJhdGVTdGFydFBvaW50KCk7IC8vIGdldCBzdGFydCBub2RlXG5cbiAgICB3aGlsZSAoY3VycmVudE5vZGUpIHtcbiAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgIH1cbiAgICAgIHZpc2l0ZWQucHVzaChjdXJyZW50Tm9kZSk7XG4gICAgICBjb25zdCBuZWlnaGJvcnMgPSBnZXRVbnZpc2l0ZWROZWlnaGJvcnMoY3VycmVudE5vZGUpO1xuXG4gICAgICBpZiAobmVpZ2hib3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgbmV4dE5vZGUgPSByYW5kb21seVNlbGVjdE5laWdoYm9yKG5laWdoYm9ycyk7XG4gICAgICAgIHJlbW92ZVdhbGxCZXR3ZWVuKGN1cnJlbnROb2RlLCBuZXh0Tm9kZSk7XG4gICAgICAgIGN1cnJlbnROb2RlID0gbmV4dE5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZSA9IG51bGw7XG5cbiAgICAgICAgZm9yIChsZXQgcm93ID0gMTsgcm93IDwgcm93cyAtIDE7IHJvdyArPSAyKSB7XG4gICAgICAgICAgZm9yIChsZXQgY29sID0gMTsgY29sIDwgY29scyAtIDE7IGNvbCArPSAyKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gZ3JpZFtyb3ddW2NvbF07XG4gICAgICAgICAgICBjb25zdCB2aXNpdGVkTm9kZU5laWdoYm9ycyA9IGdldFZpc2l0ZWROZWlnaGJvcnMobm9kZSk7XG4gICAgICAgICAgICBpZiAoIXZpc2l0ZWQuaW5jbHVkZXMobm9kZSkgJiYgdmlzaXRlZE5vZGVOZWlnaGJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBjdXJyZW50Tm9kZSA9IG5vZGU7XG4gICAgICAgICAgICAgIGNvbnN0IHJhbmRvbWx5U2VsZWN0ZWROZWlnaGJvciA9IHJhbmRvbWx5U2VsZWN0TmVpZ2hib3IodmlzaXRlZE5vZGVOZWlnaGJvcnMpO1xuICAgICAgICAgICAgICByZW1vdmVXYWxsQmV0d2VlbihjdXJyZW50Tm9kZSwgcmFuZG9tbHlTZWxlY3RlZE5laWdoYm9yKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50Tm9kZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGFsZ29yaXRobSgpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVQcmltcyhncmlkT2JqLCBkZWxheSkge1xuICAvLyBzZXQgdGhlIGVudGlyZSBncmlkIGFzIGJhcnJpZXJzXG4gIGdyaWRPYmouZmlsbEdyaWQoKTtcblxuICBjb25zdCBncmlkID0gZ3JpZE9iai5ncmlkO1xuICBjb25zdCByb3dzID0gZ3JpZC5sZW5ndGg7XG4gIGNvbnN0IGNvbHMgPSBncmlkWzBdLmxlbmd0aDtcbiAgY29uc3QgZnJvbnRpZXIgPSBbXTtcbiAgY29uc3QgdmlzaXRlZCA9IG5ldyBTZXQoKTtcblxuICAvLyBhZGQgbmVpZ2hib3JzIC0gZGlyZWN0bHkgYWRqYWNlbnQgbmVpZ2hib3JzIGFyZSBza2lwcGVkIHNvIHRoZXkgY2FuIGJlIHdhbGxzIGlmIG5lZWRlZFxuICBmdW5jdGlvbiBnZXROZWlnaGJvcnMobm9kZSkge1xuICAgIGNvbnN0IG5laWdoYm9ycyA9IFtdO1xuICAgIGNvbnN0IHJvdyA9IG5vZGUucm93IC0gMTtcbiAgICBjb25zdCBjb2wgPSBub2RlLmNvbCAtIDE7XG5cbiAgICBpZiAocm93ID4gMSkgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgLSAyXVtjb2xdKTsgLy8gdXBcblxuICAgIGlmIChyb3cgPCByb3dzIC0gMikgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgKyAyXVtjb2xdKTsgLy8gZG93blxuXG4gICAgaWYgKGNvbCA+IDEpIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgLSAyXSk7IC8vIGxlZnRcblxuICAgIGlmIChjb2wgPCBjb2xzIC0gMikgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCArIDJdKTsgLy8gcmlnaHRcblxuICAgIHJldHVybiBuZWlnaGJvcnM7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRXYWxsQmV0d2Vlbihub2RlLCBuZWlnaGJvcikge1xuICAgIGNvbnN0IHJvdyA9IG5vZGUucm93IC0gMTtcbiAgICBjb25zdCBjb2wgPSBub2RlLmNvbCAtIDE7XG5cbiAgICBpZiAocm93ID4gMSkge1xuICAgICAgaWYgKGdyaWRbcm93IC0gMl1bY29sXSA9PT0gbmVpZ2hib3IpIHJldHVybiBncmlkW3JvdyAtIDFdW2NvbF07IC8vIHVwXG4gICAgfVxuICAgIGlmIChyb3cgPCByb3dzIC0gMikge1xuICAgICAgaWYgKGdyaWRbcm93ICsgMl1bY29sXSA9PT0gbmVpZ2hib3IpIHJldHVybiBncmlkW3JvdyArIDFdW2NvbF07IC8vIGRvd25cbiAgICB9XG4gICAgaWYgKGNvbCA+IDEpIHtcbiAgICAgIGlmIChncmlkW3Jvd11bY29sIC0gMl0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3ddW2NvbCAtIDFdOyAvLyBsZWZ0XG4gICAgfVxuICAgIGlmIChjb2wgPCBjb2xzIC0gMikge1xuICAgICAgaWYgKGdyaWRbcm93XVtjb2wgKyAyXSA9PT0gbmVpZ2hib3IpIHJldHVybiBncmlkW3Jvd11bY29sICsgMV07IC8vIHJpZ2h0XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBjb25uZWN0KG5vZGUxLCBub2RlMiwgd2FsbEJldHdlZW4pIHtcbiAgICBub2RlMS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgbm9kZTIuc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgIHdhbGxCZXR3ZWVuLnNldE5vZGVUeXBlKCdlbXB0eScsIGRlbGF5KTtcbiAgfVxuXG4gIC8vIGNob29zZSBhIHJhbmRvbSBwb2ludCBvbiB0aGUgZ3JpZCB0byBzdGFydCB3aXRoXG4gIGxldCByYW5kb21GaXJzdE5vZGUgPSBudWxsO1xuICB3aGlsZSAocmFuZG9tRmlyc3ROb2RlID09PSBudWxsKSB7XG4gICAgY29uc3QgcmFuZG9tUm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHJvd3MgLSA0KSkgKyAyO1xuICAgIGNvbnN0IHJhbmRvbUNvbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChjb2xzIC0gNCkpICsgMjtcbiAgICBpZiAocmFuZG9tUm93ICUgMiAhPT0gMCAmJiByYW5kb21Db2wgJSAyICE9PSAwKSB7XG4gICAgICByYW5kb21GaXJzdE5vZGUgPSBncmlkW3JhbmRvbVJvd11bcmFuZG9tQ29sXTtcbiAgICAgIHJhbmRvbUZpcnN0Tm9kZS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgICB2aXNpdGVkLmFkZChyYW5kb21GaXJzdE5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXJ0Tm9kZU5laWdoYm9ycyA9IGdldE5laWdoYm9ycyhyYW5kb21GaXJzdE5vZGUpO1xuICBzdGFydE5vZGVOZWlnaGJvcnMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgIGlmIChub2RlKSB7XG4gICAgICBmcm9udGllci5wdXNoKG5vZGUpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2hpbGUgKGZyb250aWVyLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGZyb250aWVyLmxlbmd0aCk7XG4gICAgY29uc3QgcmFuZG9tRnJvbnRpZXJOb2RlID0gZnJvbnRpZXJbcmFuZG9tSW5kZXhdO1xuICAgIGNvbnN0IGZyb250aWVyTmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKHJhbmRvbUZyb250aWVyTm9kZSk7XG5cbiAgICAvLyBmaW5kIG91dCB3aGljaCAnaW4nIG5vZGVzIChwYXJ0IG9mIG1hemUpIGFyZSBhZGphY2VudFxuICAgIGNvbnN0IGFkamFjZW50SW5zID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcm9udGllck5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZpc2l0ZWQuaGFzKGZyb250aWVyTmVpZ2hib3JzW2ldKSkge1xuICAgICAgICBhZGphY2VudElucy5wdXNoKGZyb250aWVyTmVpZ2hib3JzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjaG9vc2UgYSByYW5kb20gYWRqYWNlbnQgbm9kZSBhbmQgY29ubmVjdCB0aGF0IHdpdGggdGhlIGZyb250aWVyIG5vZGVcbiAgICBjb25zdCByYW5kb21BZGphY2VudEluID0gYWRqYWNlbnRJbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYWRqYWNlbnRJbnMubGVuZ3RoKV07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGphY2VudElucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFkamFjZW50SW5zW2ldID09PSByYW5kb21BZGphY2VudEluKSB7XG4gICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHdhbGxCZXR3ZWVuID0gZ2V0V2FsbEJldHdlZW4ocmFuZG9tRnJvbnRpZXJOb2RlLCByYW5kb21BZGphY2VudEluKTtcbiAgICAgICAgY29uc3QgaW5kZXhUb1NwbGljZSA9IGZyb250aWVyLmluZGV4T2YocmFuZG9tRnJvbnRpZXJOb2RlKTtcbiAgICAgICAgY29ubmVjdChyYW5kb21Gcm9udGllck5vZGUsIHJhbmRvbUFkamFjZW50SW4sIHdhbGxCZXR3ZWVuKTtcbiAgICAgICAgdmlzaXRlZC5hZGQocmFuZG9tRnJvbnRpZXJOb2RlKTtcbiAgICAgICAgZnJvbnRpZXIuc3BsaWNlKGluZGV4VG9TcGxpY2UsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdldCB0aGUgbmVpZ2hib3JzIG9mIHRoZSBmcm9udGllciBub2RlIGFuZCBhZGQgdGhlbSB0byBmcm9udGllciBsaXN0XG4gICAgY29uc3QgbmVpZ2hib3JzVG9BZGQgPSBnZXROZWlnaGJvcnMocmFuZG9tRnJvbnRpZXJOb2RlKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5laWdoYm9yc1RvQWRkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobmVpZ2hib3JzVG9BZGRbaV0pIHtcbiAgICAgICAgaWYgKCF2aXNpdGVkLmhhcyhuZWlnaGJvcnNUb0FkZFtpXSkgJiYgIWZyb250aWVyLmluY2x1ZGVzKG5laWdoYm9yc1RvQWRkW2ldKSkge1xuICAgICAgICAgIGZyb250aWVyLnB1c2gobmVpZ2hib3JzVG9BZGRbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcmFuZG9tTWFwKGdyaWRPYmosIGRlbGF5KSB7XG4gIGNvbnN0IGdyaWQgPSBncmlkT2JqLmdyaWQ7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCByb3dzOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgaWYgKHJhbmRvbSA8IDAuMykge1xuICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicsIGRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7IC8vIG1hemUgZ2VuZXJhdGlvbiBmaW5pc2hlZFxufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcmVjdXJzaXZlRGl2aXNpb24oZ3JpZE9iaiwgZGVsYXkpIHtcbiAgY29uc3QgZ3JpZCA9IGdyaWRPYmouZ3JpZDtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG4gIGxldCBpc0ZpbmlzaGVkID0gZmFsc2U7IC8vIGlzIHJlY3Vyc2l2ZSBwcm9jZXNzIGZpbmlzaGVkP1xuXG4gIGZ1bmN0aW9uIHJhbmRvbUV2ZW4oYSwgYikge1xuICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChiIC0gYSArIDEpKSArIGE7XG4gICAgcmV0dXJuIHJhbmRvbSAlIDIgPT09IDAgPyByYW5kb20gOiByYW5kb20gKyAxO1xuICB9XG5cbiAgZnVuY3Rpb24gcmFuZG9tT2RkKGEsIGIpIHtcbiAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoYiAtIGEgKyAxKSkgKyBhO1xuICAgIHJldHVybiByYW5kb20gJSAyICE9PSAwID8gcmFuZG9tIDogcmFuZG9tICsgMTtcbiAgfVxuXG4gIC8vIGNob29zZSB0byBwbGFjZSB3YWxsIHZlcnRpY2FsbHkgb3IgaG9yaXpvbnRhbGx5XG4gIGZ1bmN0aW9uIGNob29zZU9yaWVudGF0aW9uKHN0YXJ0Um93LCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpIHtcbiAgICBjb25zdCB3aWR0aCA9IGVuZENvbCAtIHN0YXJ0Q29sO1xuICAgIGNvbnN0IGhlaWdodCA9IGVuZFJvdyAtIHN0YXJ0Um93O1xuICAgIGlmICh3aWR0aCA+IGhlaWdodCkgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgaWYgKHdpZHRoIDwgaGVpZ2h0KSByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgIGlmICh3aWR0aCA9PT0gaGVpZ2h0KSB7XG4gICAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgIHJldHVybiByYW5kb20gPT09IDAgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIHNldCBlZGdlcyBvZiBncmlkIGFzIGJhcnJpZXJzXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHJvd3M7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgY29sKyspIHtcbiAgICAgIGlmIChyb3cgPT09IDAgfHwgcm93ID09PSByb3dzIC0gMSB8fCBjb2wgPT09IDAgfHwgY29sID09PSBjb2xzIC0gMSkge1xuICAgICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicsIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHRoZSByZWN1cnNpdmUgZnVuY3Rpb24gdG8gZGl2aWRlIHRoZSBncmlkXG4gIGFzeW5jIGZ1bmN0aW9uIGRpdmlkZShzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgZW5kQ29sKSB7XG4gICAgaWYgKGVuZENvbCAtIHN0YXJ0Q29sIDwgMSB8fCBlbmRSb3cgLSBzdGFydFJvdyA8IDEpIHtcbiAgICAgIC8vIGJhc2UgY2FzZSBpZiBzdWItbWF6ZSBpcyB0b28gc21hbGxcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3YWxsUm93ID0gcmFuZG9tRXZlbihzdGFydFJvdyArIDEsIGVuZFJvdyAtIDEpO1xuICAgIGNvbnN0IHdhbGxDb2wgPSByYW5kb21FdmVuKHN0YXJ0Q29sICsgMSwgZW5kQ29sIC0gMSk7XG5cbiAgICBjb25zdCBwYXNzYWdlUm93ID0gcmFuZG9tT2RkKHN0YXJ0Um93LCBlbmRSb3cpO1xuICAgIGNvbnN0IHBhc3NhZ2VDb2wgPSByYW5kb21PZGQoc3RhcnRDb2wsIGVuZENvbCk7XG5cbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGNob29zZU9yaWVudGF0aW9uKHN0YXJ0Um93LCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpO1xuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIC8vIG1ha2UgYSBob3Jpem9udGFsIHdhbGxcbiAgICAgIGZvciAobGV0IGNvbCA9IHN0YXJ0Q29sOyBjb2wgPD0gZW5kQ29sOyBjb2wrKykge1xuICAgICAgICBpZiAoY29sICE9PSBwYXNzYWdlQ29sKSB7XG4gICAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZ3JpZFt3YWxsUm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJywgZGVsYXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgLy8gbWFrZSBhIHZlcnRpY2FsIHdhbGxcbiAgICAgIGZvciAobGV0IHJvdyA9IHN0YXJ0Um93OyByb3cgPD0gZW5kUm93OyByb3crKykge1xuICAgICAgICBpZiAocm93ICE9PSBwYXNzYWdlUm93KSB7XG4gICAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZ3JpZFtyb3ddW3dhbGxDb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJywgZGVsYXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgd2FsbFJvdyAtIDEsIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgICAgYXdhaXQgZGl2aWRlKHdhbGxSb3cgKyAxLCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgZW5kUm93LCB3YWxsQ29sICsgMSwgZW5kQ29sKTtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgd2FsbENvbCAtIDEpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgdGhlIGxhc3QgcmVjdXJzaXZlIGNhbGxcbiAgICBpZiAoc3RhcnRSb3cgPT09IDEgJiYgZW5kUm93ID09PSByb3dzIC0gMiAmJiBzdGFydENvbCA9PT0gMSAmJiBlbmRDb2wgPT09IGNvbHMgLSAyKSB7XG4gICAgICBpc0ZpbmlzaGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBhd2FpdCBkaXZpZGUoMSwgcm93cyAtIDIsIDEsIGNvbHMgLSAyKTtcblxuICByZXR1cm4gaXNGaW5pc2hlZDsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzaWRld2luZGVyKGdyaWRPYmosIGRlbGF5KSB7XG4gIGdyaWRPYmouZmlsbEdyaWQoKTsgLy8gc2V0IHRoZSBncmlkIGFzIHdhbGxzXG5cbiAgY29uc3QgZ3JpZCA9IGdyaWRPYmouZ3JpZDtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG5cbiAgLy8gbGVhdmUgZmlyc3Qgcm93IGVtcHR5XG4gIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgaWYgKGNvbCAhPT0gMCAmJiBjb2wgIT09IGNvbHMgLSAxKSB7XG4gICAgICBncmlkWzFdW2NvbF0uc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8IHJvd3M7IHJvdyArPSAyKSB7XG4gICAgbGV0IHJ1biA9IFtdO1xuICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8IGNvbHM7IGNvbCArPSAyKSB7XG4gICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGdyaWRbcm93XVtjb2xdO1xuICAgICAgY3VycmVudE5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgICAgcnVuLnB1c2goY3VycmVudE5vZGUpO1xuXG4gICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNiAmJiBjb2wgIT09IGNvbHMgLSAyKSB7XG4gICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnROb2RlLm5laWdoYm9yc1swXS5zZXROb2RlVHlwZSgnZW1wdHknLCBkZWxheSk7XG4gICAgICB9IGVsc2UgaWYgKHJ1bi5sZW5ndGggPiAwICYmIHJvdyA+IDEpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBydW4ubGVuZ3RoKTtcbiAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgcnVuW3JhbmRvbUluZGV4XS5uZWlnaGJvcnNbM10uc2V0Tm9kZVR5cGUoJ2VtcHR5JywgZGVsYXkpO1xuICAgICAgICBydW4gPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7IC8vIG1hemUgZ2VuZXJhdGlvbiBmaW5pc2hlZFxufVxuIiwiaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb21oYW5kbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHJvdywgY29sLCB0b3RhbFJvd3MsIHRvdGFsQ29scywgZ3JpZCwgbm9kZVNpemUpIHtcbiAgICB0aGlzLm5vZGVTaXplID0gbnVsbDsgLy8gaG9sZHMgcHggdmFsdWUgb2Ygbm9kZSB3aWR0aCBhbmQgaGVpZ2h0XG4gICAgdGhpcy5zZXROb2RlV2lkdGgobm9kZVNpemUpO1xuICAgIHRoaXMudG90YWxSb3dzID0gdG90YWxSb3dzO1xuICAgIHRoaXMudG90YWxDb2xzID0gdG90YWxDb2xzO1xuICAgIHRoaXMucm93ID0gcm93O1xuICAgIHRoaXMuY29sID0gY29sO1xuICAgIHRoaXMueSA9IHRoaXMucm93ICogdGhpcy5ub2RlU2l6ZTtcbiAgICB0aGlzLnggPSB0aGlzLmNvbCAqIHRoaXMubm9kZVNpemU7XG4gICAgdGhpcy5ub2RlVHlwZSA9ICdlbXB0eSc7IC8vIHVzZWQgdG8gdXBkYXRlIHNxdWFyZSBkaXNwbGF5IG9uIGRvbSBlLmcgc3RhcnQsIGVuZCBvciBiYXJyaWVyXG4gICAgdGhpcy5uZWlnaGJvcnMgPSBbXTtcbiAgICB0aGlzLnByZXZpb3VzTm9kZSA9IG51bGw7XG4gICAgdGhpcy5ncmlkID0gZ3JpZDtcblxuICAgIC8vIHVzZWQgZm9yIEFzdGFyIGFuZCBEaWpza3RyYVxuICAgIHRoaXMuZiA9IDA7XG4gICAgdGhpcy5nID0gMDtcbiAgICB0aGlzLmggPSAwO1xuICB9XG5cbiAgLy8gYWRqdXN0IHNpemUgb2Ygbm9kZSBpbiBweFxuICBzZXROb2RlV2lkdGgobm9kZVNpemUpIHtcbiAgICBpZiAobm9kZVNpemUgPT09ICdzbWFsbCcpIHtcbiAgICAgIHRoaXMubm9kZVNpemUgPSA1MDtcbiAgICB9IGVsc2UgaWYgKG5vZGVTaXplID09PSAnbWVkaXVtJykge1xuICAgICAgdGhpcy5ub2RlU2l6ZSA9IDMwO1xuICAgIH0gZWxzZSBpZiAobm9kZVNpemUgPT09ICdsYXJnZScpIHtcbiAgICAgIHRoaXMubm9kZVNpemUgPSAyMDtcbiAgICB9XG4gIH1cblxuICAvLyBjaGFuZ2Ugbm9kZSB0eXBlIGUuZyBiYXJyaWVyLCBzdGFydCwgZW5kLCBvcGVuLWxpc3QsIGNsb3NlZC1saXN0XG4gIHNldE5vZGVUeXBlKG5ld05vZGVUeXBlLCBkZWxheSkge1xuICAgIERvbUhhbmRsZXIuZGlzcGxheU5vZGUodGhpcywgdGhpcy5ub2RlVHlwZSwgbmV3Tm9kZVR5cGUsIHRoaXMuZ3JpZCwgZGVsYXkpO1xuICAgIHRoaXMubm9kZVR5cGUgPSBuZXdOb2RlVHlwZTtcbiAgfVxuXG4gIC8vIGNhbGMgZiwgZyBhbmQgaCBzY29yZXNcbiAgY2FsY1Njb3JlcyhzdGFydE5vZGUsIGVuZE5vZGUpIHtcbiAgICB0aGlzLmcgPSBNYXRoLmFicyh0aGlzLnggLSBzdGFydE5vZGUueCkgKyBNYXRoLmFicyh0aGlzLnkgLSBzdGFydE5vZGUueSk7XG4gICAgdGhpcy5oID0gTWF0aC5hYnModGhpcy54IC0gZW5kTm9kZS54KSArIE1hdGguYWJzKHRoaXMueSAtIGVuZE5vZGUueSk7XG4gICAgdGhpcy5mID0gdGhpcy5nICsgdGhpcy5oO1xuICAgIHJldHVybiB0aGlzLmY7XG4gIH1cblxuICAvLyBzZXQgbmVpZ2hib3JzIGZvciBjdXJyZW50IG5vZGUgKG5vIGRpYWdvbmFscylcbiAgc2V0TmVpZ2hib3JzKGdyaWQpIHtcbiAgICBjb25zdCB0ZW1wUm93ID0gdGhpcy5yb3cgLSAxO1xuICAgIGNvbnN0IHRlbXBDb2wgPSB0aGlzLmNvbCAtIDE7XG5cbiAgICBpZiAodGVtcENvbCA8IHRoaXMudG90YWxDb2xzIC0gMSkge1xuICAgICAgLy8gcmlnaHRcbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93XVt0ZW1wQ29sICsgMV0pO1xuICAgIH1cblxuICAgIGlmICh0ZW1wQ29sID4gMCkge1xuICAgICAgLy8gbGVmdFxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3ddW3RlbXBDb2wgLSAxXSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbXBSb3cgPCB0aGlzLnRvdGFsUm93cyAtIDEpIHtcbiAgICAgIC8vIGRvd25cbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93ICsgMV1bdGVtcENvbF0pO1xuICAgIH1cblxuICAgIGlmICh0ZW1wUm93ID4gMCkge1xuICAgICAgLy8gdXBcbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93IC0gMV1bdGVtcENvbF0pO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vc2Nzcy9tYWluLnNjc3MnO1xuaW1wb3J0IGxvYWQgZnJvbSAnLi9tYWluaGFuZGxlcic7XG5cbmxvYWQoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
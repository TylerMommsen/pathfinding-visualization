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
        path[i].setNodeType('final-path');
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

  async function dispayFinalPath(meetingPoint) {
    const finalPathForward = [];
    const finalPathBackward = [];
    const joinedFinalPath = [];

    let node = null;
    // get path from start to meeting point
    if (visitedForwards.has(meetingPoint.neighbors[0])) {
      node = meetingPoint.neighbors[0]; // right
    } else if (visitedForwards.has(meetingPoint.neighbors[1])) {
      node = meetingPoint.neighbors[1]; // left
    } else if (visitedForwards.has(meetingPoint.neighbors[2])) {
      node = meetingPoint.neighbors[2]; // down
    } else if (visitedForwards.has(meetingPoint.neighbors[3])) {
      node = meetingPoint.neighbors[3]; // up
    }
    finalPathForward.push(node);
    while (node.previousNode) {
      finalPathForward.push(node.previousNode);
      node = node.previousNode;
    }

    // get path from meeting point to end
    if (visitedBackwards.has(meetingPoint.neighbors[0])) {
      node = meetingPoint.neighbors[0]; // right
    } else if (visitedBackwards.has(meetingPoint.neighbors[1])) {
      node = meetingPoint.neighbors[1]; // left
    } else if (visitedBackwards.has(meetingPoint.neighbors[2])) {
      node = meetingPoint.neighbors[2]; // down
    } else if (visitedBackwards.has(meetingPoint.neighbors[3])) {
      node = meetingPoint.neighbors[3]; // up
    }
    finalPathBackward.push(node);
    while (node.previousNode) {
      finalPathBackward.push(node.previousNode);
      node = node.previousNode;
    }

    for (let i = finalPathForward.length - 1; i >= 0; i--) {
      joinedFinalPath.push(finalPathForward[i]);
    }
    joinedFinalPath.push(meetingPoint);
    for (let i = 0; i < finalPathBackward.length; i++) {
      joinedFinalPath.push(finalPathBackward[i]);
    }

    for (let i = 0; i < joinedFinalPath.length; i++) {
      if (joinedFinalPath[i].nodeType !== 'start' && joinedFinalPath[i].nodeType !== 'end') {
        await new Promise((resolve) => setTimeout(resolve, 30));
        joinedFinalPath[i].setNodeType('final-path');
      }
    }
  }

  queueForwards.push(startNode);
  visitedForwards.add(startNode);

  queueBackwards.push(endNode);
  visitedBackwards.add(endNode);

  while (queueForwards.length > 0 && queueBackwards.length > 0) {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // forwards
    const currNodeForward = queueForwards.shift();
    if (currNodeForward !== startNode) {
      currNodeForward.setNodeType('closed-list');
    }
    const neighborsForward = currNodeForward.neighbors;
    let currNeighborForward = null;

    for (let i = 0; i < neighborsForward.length; i++) {
      currNeighborForward = neighborsForward[i];
      if (!visitedForwards.has(currNeighborForward) && currNeighborForward.nodeType !== 'barrier') {
        queueForwards.push(currNeighborForward);
        currNeighborForward.previousNode = currNodeForward;
        currNeighborForward.setNodeType('open-list');
        visitedForwards.add(currNeighborForward);
      }

      if (visitedBackwards.has(currNeighborForward)) {
        dispayFinalPath(currNeighborForward);
        return true;
      }
    }

    // backwards
    const currNodeBackward = queueBackwards.shift();
    if (currNodeBackward !== endNode) {
      currNodeBackward.setNodeType('closed-list');
    }
    const neighborsBackward = currNodeBackward.neighbors;
    let currNeighborBackward = null;

    for (let i = 0; i < neighborsBackward.length; i++) {
      currNeighborBackward = neighborsBackward[i];
      if (
        !visitedBackwards.has(currNeighborBackward) &&
        currNeighborBackward.nodeType !== 'barrier'
      ) {
        queueBackwards.push(currNeighborBackward);
        currNeighborBackward.previousNode = currNodeBackward;
        currNeighborBackward.setNodeType('open-list');
        visitedBackwards.add(currNeighborBackward);
      }

      if (visitedForwards.has(currNeighborBackward)) {
        dispayFinalPath(currNeighborBackward);
        return true;
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
    }

    return false;
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
// update square display
function displayNode(node, currNodeType, newNodeType, grid) {
  const domSquare = grid.findDomSquare(node.row - 1, node.col - 1);

  domSquare.classList.remove('animated');
  // eslint-disable-next-line no-unused-expressions
  domSquare.offsetWidth;
  if (newNodeType !== 'closed-list') {
    domSquare.classList.add('animated');
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
          currNode.setNodeType('empty');
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
const running = [false]; // check if algorithm is currently running
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
}

// run pathfinding algorithm
async function runAlgorithm(pathFindingAlgorithm) {
  if (running[0] || !pathFindingAlgorithm || !gridObj.start.node || !gridObj.end.node) return;
  running[0] = true;

  gridObj.setAllNodeNeighbors();
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
  if (gridSize === 'small') {
    if (speed === 'Slow') mazeSpeed = mazeGenSpeeds.slow.small;
    if (speed === 'Normal') mazeSpeed = mazeGenSpeeds.normal.small;
    if (speed === 'Fast') mazeSpeed = mazeGenSpeeds.fast.small;
  }
  if (gridSize === 'medium') {
    if (speed === 'Slow') mazeSpeed = mazeGenSpeeds.slow.medium;
    if (speed === 'Normal') mazeSpeed = mazeGenSpeeds.normal.medium;
    if (speed === 'Fast') mazeSpeed = mazeGenSpeeds.fast.medium;
  }
  if (gridSize === 'large') {
    if (speed === 'Slow') mazeSpeed = mazeGenSpeeds.slow.large;
    if (speed === 'Normal') mazeSpeed = mazeGenSpeeds.normal.large;
    if (speed === 'Fast') mazeSpeed = mazeGenSpeeds.fast.large;
  }

  if (speed === 'Instant') mazeSpeed = mazeGenSpeeds.instant;
}

// update how fast path algorithm explores nodes
function updatePathfindingDelay(speed) {
  if (gridSize === 'small') {
    if (speed === 'Slow') pathfindingSpeed = pathfindingSpeeds.slow.small;
    if (speed === 'Normal') pathfindingSpeed = pathfindingSpeeds.normal.small;
    if (speed === 'Fast') pathfindingSpeed = pathfindingSpeeds.fast.small;
  }
  if (gridSize === 'medium') {
    if (speed === 'Slow') pathfindingSpeed = pathfindingSpeeds.slow.medium;
    if (speed === 'Normal') pathfindingSpeed = pathfindingSpeeds.normal.medium;
    if (speed === 'Fast') pathfindingSpeed = pathfindingSpeeds.fast.medium;
  }
  if (gridSize === 'large') {
    if (speed === 'Slow') pathfindingSpeed = pathfindingSpeeds.slow.large;
    if (speed === 'Normal') pathfindingSpeed = pathfindingSpeeds.normal.large;
    if (speed === 'Fast') pathfindingSpeed = pathfindingSpeeds.fast.large;
  }

  if (speed === 'Instant') pathfindingSpeed = pathfindingSpeeds.instant;
}

function updateGridSize(size) {
  const newSize = size.toLowerCase();
  gridSize = newSize;
  if (size === 'Small') {
    gridObj.updateGridSize(gridSizes.small.rows, gridSizes.small.cols, gridSize);
  }
  if (size === 'Medium') {
    gridObj.updateGridSize(gridSizes.medium.rows, gridSizes.medium.cols, gridSize);
  }
  if (size === 'Large') {
    gridObj.updateGridSize(gridSizes.large.rows, gridSizes.large.cols, gridSize);
  }

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
    if (running[0]) return;
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
    node1.setNodeType('empty');
    node2.setNodeType('empty');
    barrierBetween.setNodeType('empty');
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
    node1.setNodeType('empty');
    node2.setNodeType('empty');
    wallBetween.setNodeType('empty');
  }

  // choose a random point on the grid to start with
  let randomFirstNode = null;
  while (randomFirstNode === null) {
    const randomRow = Math.floor(Math.random() * (rows - 4)) + 2;
    const randomCol = Math.floor(Math.random() * (cols - 4)) + 2;
    if (randomRow % 2 !== 0 && randomCol % 2 !== 0) {
      randomFirstNode = grid[randomRow][randomCol];
      randomFirstNode.setNodeType('empty');
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
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
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
async function sidewinder(gridObj, delay) {
  gridObj.fillGrid(); // set the grid as walls

  const grid = gridObj.grid;
  const rows = grid.length;
  const cols = grid[0].length;

  // leave first row empty
  for (let col = 0; col < cols; col++) {
    if (col !== 0 && col !== cols - 1) {
      grid[1][col].setNodeType('empty');
    }
  }

  for (let row = 1; row < rows; row += 2) {
    let run = [];
    for (let col = 1; col < cols; col += 2) {
      const currentNode = grid[row][col];
      currentNode.setNodeType('empty');
      run.push(currentNode);

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
  setNodeType(newNodeType) {
    _domhandler__WEBPACK_IMPORTED_MODULE_0__["default"].displayNode(this, this.nodeType, newNodeType, this.grid);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmOzs7Ozs7Ozs7Ozs7Ozs7O0FDckNzQzs7QUFFdkI7QUFDZjtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUksbURBQVU7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQ3pFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ04wQjtBQUNPOztBQUVqQyx3REFBSSIsInNvdXJjZXMiOlsid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvc2Nzcy9tYWluLnNjc3MiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9hbGdvcml0aG1mYWN0b3J5LmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvYWxnb3JpdGhtcy9hc3Rhci5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2FsZ29yaXRobXMvYmlkaXJlY3Rpb25hbC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2FsZ29yaXRobXMvZGlqa3N0cmEuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9kb21oYW5kbGVyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvZ3JpZC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21haW5oYW5kbGVyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZWZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9iaW5hcnl0cmVlLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvaHVudGFuZGtpbGwuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9wcmltcy5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL3JhbmRvbW1hcC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL3JlY3Vyc2l2ZWRpdmlzaW9uLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvc2lkZXdpbmRlci5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IHJ1bkJpZGlyZWN0aW9uYWwgZnJvbSAnLi9hbGdvcml0aG1zL2JpZGlyZWN0aW9uYWwnO1xuaW1wb3J0IHJ1bkFzdGFyIGZyb20gJy4vYWxnb3JpdGhtcy9hc3Rhcic7XG5pbXBvcnQgcnVuRGlqa3N0cmEgZnJvbSAnLi9hbGdvcml0aG1zL2RpamtzdHJhJztcblxuY2xhc3MgQWxnb3JpdGhtRmFjdG9yeSB7XG4gIHN0YXRpYyBjcmVhdGVBbGdvcml0aG0oYWxnb3JpdGhtTmFtZSkge1xuICAgIC8vIE1hcCBhbGdvcml0aG0gbmFtZXMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBpbXBsZW1lbnRhdGlvbnNcbiAgICBjb25zdCBhbGdvcml0aG1zID0ge1xuICAgICAgJ0EqJzogcnVuQXN0YXIsXG4gICAgICBEaWprc3RyYTogcnVuRGlqa3N0cmEsXG4gICAgICBCaWRpcmVjdGlvbmFsOiBydW5CaWRpcmVjdGlvbmFsLFxuICAgIH07XG5cbiAgICBjb25zdCBBbGdvcml0aG1DbGFzcyA9IGFsZ29yaXRobXNbYWxnb3JpdGhtTmFtZV07XG5cbiAgICBpZiAoIUFsZ29yaXRobUNsYXNzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFsZ29yaXRobSBcIiR7YWxnb3JpdGhtTmFtZX1cIiBub3QgZm91bmRgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gQWxnb3JpdGhtQ2xhc3M7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWxnb3JpdGhtRmFjdG9yeTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJ1bkFzdGFyKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgZGVsYXkpIHtcbiAgY29uc3Qgb3Blbkxpc3QgPSBbXTtcbiAgY29uc3QgY2xvc2VkTGlzdCA9IFtdO1xuICBjb25zdCBmaW5hbFBhdGggPSBbXTtcblxuICBmdW5jdGlvbiByZW1vdmVGcm9tQXJyKG5vZGUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wZW5MaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob3Blbkxpc3RbaV0gPT09IG5vZGUpIHtcbiAgICAgICAgb3Blbkxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGRpc3BsYXlGaW5hbFBhdGgocGF0aCkge1xuICAgIGZvciAobGV0IGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAocGF0aFtpXS5ub2RlVHlwZSAhPT0gJ3N0YXJ0JyAmJiBwYXRoW2ldLm5vZGVUeXBlICE9PSAnZW5kJykge1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMCkpO1xuICAgICAgICBwYXRoW2ldLnNldE5vZGVUeXBlKCdmaW5hbC1wYXRoJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3Blbkxpc3QucHVzaChzdGFydE5vZGUpO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGFsZ29yaXRobSgpIHtcbiAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgIH1cbiAgICBsZXQgY3VycmVudE5vZGUgPSBudWxsO1xuICAgIGxldCBsb3dlc3RGID0gSW5maW5pdHk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcGVuTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgb3Blbkxpc3RbaV0uY2FsY1Njb3JlcyhzdGFydE5vZGUsIGVuZE5vZGUpO1xuICAgICAgaWYgKG9wZW5MaXN0W2ldLmYgPCBsb3dlc3RGKSB7XG4gICAgICAgIGxvd2VzdEYgPSBvcGVuTGlzdFtpXS5mO1xuICAgICAgICBjdXJyZW50Tm9kZSA9IG9wZW5MaXN0W2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gZW5kTm9kZSkge1xuICAgICAgbGV0IHRlbXAgPSBjdXJyZW50Tm9kZTtcbiAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXApO1xuICAgICAgd2hpbGUgKHRlbXAucHJldmlvdXNOb2RlKSB7XG4gICAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXAucHJldmlvdXNOb2RlKTtcbiAgICAgICAgdGVtcCA9IHRlbXAucHJldmlvdXNOb2RlO1xuICAgICAgfVxuICAgICAgYXdhaXQgZGlzcGxheUZpbmFsUGF0aChmaW5hbFBhdGgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY2xvc2VkTGlzdC5wdXNoKGN1cnJlbnROb2RlKTtcbiAgICBpZiAoY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnY2xvc2VkLWxpc3QnKTtcbiAgICB9XG4gICAgcmVtb3ZlRnJvbUFycihjdXJyZW50Tm9kZSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnROb2RlLm5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY3Vyck5laWdoYm9yID0gY3VycmVudE5vZGUubmVpZ2hib3JzW2ldO1xuXG4gICAgICBpZiAoY3Vyck5laWdoYm9yLm5vZGVUeXBlICE9PSAnYmFycmllcicgJiYgIWNsb3NlZExpc3QuaW5jbHVkZXMoY3Vyck5laWdoYm9yKSkge1xuICAgICAgICBjb25zdCB0ZW1wRyA9IGN1cnJlbnROb2RlLmcgKyAxO1xuICAgICAgICBpZiAob3Blbkxpc3QuaW5jbHVkZXMoY3Vyck5laWdoYm9yKSkge1xuICAgICAgICAgIGlmICh0ZW1wRyA8IGN1cnJOZWlnaGJvci5nKSB7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3IuZyA9IHRlbXBHO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXJyTmVpZ2hib3IuZyA9IHRlbXBHO1xuICAgICAgICAgIG9wZW5MaXN0LnB1c2goY3Vyck5laWdoYm9yKTtcbiAgICAgICAgICBpZiAoY3Vyck5laWdoYm9yLm5vZGVUeXBlICE9PSAnc3RhcnQnICYmIGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ2VuZCcpIHtcbiAgICAgICAgICAgIGN1cnJOZWlnaGJvci5zZXROb2RlVHlwZSgnb3Blbi1saXN0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY3Vyck5laWdoYm9yLnByZXZpb3VzTm9kZSA9IGN1cnJlbnROb2RlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcGVuTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gYWxnb3JpdGhtKCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGFsZ29yaXRobSgpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcnVuQmlkaXJlY3Rpb25hbChzdGFydE5vZGUsIGVuZE5vZGUsIGRlbGF5KSB7XG4gIGNvbnN0IHZpc2l0ZWRGb3J3YXJkcyA9IG5ldyBTZXQoKTtcbiAgY29uc3QgdmlzaXRlZEJhY2t3YXJkcyA9IG5ldyBTZXQoKTtcblxuICBjb25zdCBxdWV1ZUZvcndhcmRzID0gW107XG4gIGNvbnN0IHF1ZXVlQmFja3dhcmRzID0gW107XG5cbiAgYXN5bmMgZnVuY3Rpb24gZGlzcGF5RmluYWxQYXRoKG1lZXRpbmdQb2ludCkge1xuICAgIGNvbnN0IGZpbmFsUGF0aEZvcndhcmQgPSBbXTtcbiAgICBjb25zdCBmaW5hbFBhdGhCYWNrd2FyZCA9IFtdO1xuICAgIGNvbnN0IGpvaW5lZEZpbmFsUGF0aCA9IFtdO1xuXG4gICAgbGV0IG5vZGUgPSBudWxsO1xuICAgIC8vIGdldCBwYXRoIGZyb20gc3RhcnQgdG8gbWVldGluZyBwb2ludFxuICAgIGlmICh2aXNpdGVkRm9yd2FyZHMuaGFzKG1lZXRpbmdQb2ludC5uZWlnaGJvcnNbMF0pKSB7XG4gICAgICBub2RlID0gbWVldGluZ1BvaW50Lm5laWdoYm9yc1swXTsgLy8gcmlnaHRcbiAgICB9IGVsc2UgaWYgKHZpc2l0ZWRGb3J3YXJkcy5oYXMobWVldGluZ1BvaW50Lm5laWdoYm9yc1sxXSkpIHtcbiAgICAgIG5vZGUgPSBtZWV0aW5nUG9pbnQubmVpZ2hib3JzWzFdOyAvLyBsZWZ0XG4gICAgfSBlbHNlIGlmICh2aXNpdGVkRm9yd2FyZHMuaGFzKG1lZXRpbmdQb2ludC5uZWlnaGJvcnNbMl0pKSB7XG4gICAgICBub2RlID0gbWVldGluZ1BvaW50Lm5laWdoYm9yc1syXTsgLy8gZG93blxuICAgIH0gZWxzZSBpZiAodmlzaXRlZEZvcndhcmRzLmhhcyhtZWV0aW5nUG9pbnQubmVpZ2hib3JzWzNdKSkge1xuICAgICAgbm9kZSA9IG1lZXRpbmdQb2ludC5uZWlnaGJvcnNbM107IC8vIHVwXG4gICAgfVxuICAgIGZpbmFsUGF0aEZvcndhcmQucHVzaChub2RlKTtcbiAgICB3aGlsZSAobm9kZS5wcmV2aW91c05vZGUpIHtcbiAgICAgIGZpbmFsUGF0aEZvcndhcmQucHVzaChub2RlLnByZXZpb3VzTm9kZSk7XG4gICAgICBub2RlID0gbm9kZS5wcmV2aW91c05vZGU7XG4gICAgfVxuXG4gICAgLy8gZ2V0IHBhdGggZnJvbSBtZWV0aW5nIHBvaW50IHRvIGVuZFxuICAgIGlmICh2aXNpdGVkQmFja3dhcmRzLmhhcyhtZWV0aW5nUG9pbnQubmVpZ2hib3JzWzBdKSkge1xuICAgICAgbm9kZSA9IG1lZXRpbmdQb2ludC5uZWlnaGJvcnNbMF07IC8vIHJpZ2h0XG4gICAgfSBlbHNlIGlmICh2aXNpdGVkQmFja3dhcmRzLmhhcyhtZWV0aW5nUG9pbnQubmVpZ2hib3JzWzFdKSkge1xuICAgICAgbm9kZSA9IG1lZXRpbmdQb2ludC5uZWlnaGJvcnNbMV07IC8vIGxlZnRcbiAgICB9IGVsc2UgaWYgKHZpc2l0ZWRCYWNrd2FyZHMuaGFzKG1lZXRpbmdQb2ludC5uZWlnaGJvcnNbMl0pKSB7XG4gICAgICBub2RlID0gbWVldGluZ1BvaW50Lm5laWdoYm9yc1syXTsgLy8gZG93blxuICAgIH0gZWxzZSBpZiAodmlzaXRlZEJhY2t3YXJkcy5oYXMobWVldGluZ1BvaW50Lm5laWdoYm9yc1szXSkpIHtcbiAgICAgIG5vZGUgPSBtZWV0aW5nUG9pbnQubmVpZ2hib3JzWzNdOyAvLyB1cFxuICAgIH1cbiAgICBmaW5hbFBhdGhCYWNrd2FyZC5wdXNoKG5vZGUpO1xuICAgIHdoaWxlIChub2RlLnByZXZpb3VzTm9kZSkge1xuICAgICAgZmluYWxQYXRoQmFja3dhcmQucHVzaChub2RlLnByZXZpb3VzTm9kZSk7XG4gICAgICBub2RlID0gbm9kZS5wcmV2aW91c05vZGU7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGZpbmFsUGF0aEZvcndhcmQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGpvaW5lZEZpbmFsUGF0aC5wdXNoKGZpbmFsUGF0aEZvcndhcmRbaV0pO1xuICAgIH1cbiAgICBqb2luZWRGaW5hbFBhdGgucHVzaChtZWV0aW5nUG9pbnQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmluYWxQYXRoQmFja3dhcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGpvaW5lZEZpbmFsUGF0aC5wdXNoKGZpbmFsUGF0aEJhY2t3YXJkW2ldKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGpvaW5lZEZpbmFsUGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGpvaW5lZEZpbmFsUGF0aFtpXS5ub2RlVHlwZSAhPT0gJ3N0YXJ0JyAmJiBqb2luZWRGaW5hbFBhdGhbaV0ubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwKSk7XG4gICAgICAgIGpvaW5lZEZpbmFsUGF0aFtpXS5zZXROb2RlVHlwZSgnZmluYWwtcGF0aCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHF1ZXVlRm9yd2FyZHMucHVzaChzdGFydE5vZGUpO1xuICB2aXNpdGVkRm9yd2FyZHMuYWRkKHN0YXJ0Tm9kZSk7XG5cbiAgcXVldWVCYWNrd2FyZHMucHVzaChlbmROb2RlKTtcbiAgdmlzaXRlZEJhY2t3YXJkcy5hZGQoZW5kTm9kZSk7XG5cbiAgd2hpbGUgKHF1ZXVlRm9yd2FyZHMubGVuZ3RoID4gMCAmJiBxdWV1ZUJhY2t3YXJkcy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICB9XG5cbiAgICAvLyBmb3J3YXJkc1xuICAgIGNvbnN0IGN1cnJOb2RlRm9yd2FyZCA9IHF1ZXVlRm9yd2FyZHMuc2hpZnQoKTtcbiAgICBpZiAoY3Vyck5vZGVGb3J3YXJkICE9PSBzdGFydE5vZGUpIHtcbiAgICAgIGN1cnJOb2RlRm9yd2FyZC5zZXROb2RlVHlwZSgnY2xvc2VkLWxpc3QnKTtcbiAgICB9XG4gICAgY29uc3QgbmVpZ2hib3JzRm9yd2FyZCA9IGN1cnJOb2RlRm9yd2FyZC5uZWlnaGJvcnM7XG4gICAgbGV0IGN1cnJOZWlnaGJvckZvcndhcmQgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZWlnaGJvcnNGb3J3YXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjdXJyTmVpZ2hib3JGb3J3YXJkID0gbmVpZ2hib3JzRm9yd2FyZFtpXTtcbiAgICAgIGlmICghdmlzaXRlZEZvcndhcmRzLmhhcyhjdXJyTmVpZ2hib3JGb3J3YXJkKSAmJiBjdXJyTmVpZ2hib3JGb3J3YXJkLm5vZGVUeXBlICE9PSAnYmFycmllcicpIHtcbiAgICAgICAgcXVldWVGb3J3YXJkcy5wdXNoKGN1cnJOZWlnaGJvckZvcndhcmQpO1xuICAgICAgICBjdXJyTmVpZ2hib3JGb3J3YXJkLnByZXZpb3VzTm9kZSA9IGN1cnJOb2RlRm9yd2FyZDtcbiAgICAgICAgY3Vyck5laWdoYm9yRm9yd2FyZC5zZXROb2RlVHlwZSgnb3Blbi1saXN0Jyk7XG4gICAgICAgIHZpc2l0ZWRGb3J3YXJkcy5hZGQoY3Vyck5laWdoYm9yRm9yd2FyZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2aXNpdGVkQmFja3dhcmRzLmhhcyhjdXJyTmVpZ2hib3JGb3J3YXJkKSkge1xuICAgICAgICBkaXNwYXlGaW5hbFBhdGgoY3Vyck5laWdoYm9yRm9yd2FyZCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGJhY2t3YXJkc1xuICAgIGNvbnN0IGN1cnJOb2RlQmFja3dhcmQgPSBxdWV1ZUJhY2t3YXJkcy5zaGlmdCgpO1xuICAgIGlmIChjdXJyTm9kZUJhY2t3YXJkICE9PSBlbmROb2RlKSB7XG4gICAgICBjdXJyTm9kZUJhY2t3YXJkLnNldE5vZGVUeXBlKCdjbG9zZWQtbGlzdCcpO1xuICAgIH1cbiAgICBjb25zdCBuZWlnaGJvcnNCYWNrd2FyZCA9IGN1cnJOb2RlQmFja3dhcmQubmVpZ2hib3JzO1xuICAgIGxldCBjdXJyTmVpZ2hib3JCYWNrd2FyZCA9IG51bGw7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5laWdoYm9yc0JhY2t3YXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjdXJyTmVpZ2hib3JCYWNrd2FyZCA9IG5laWdoYm9yc0JhY2t3YXJkW2ldO1xuICAgICAgaWYgKFxuICAgICAgICAhdmlzaXRlZEJhY2t3YXJkcy5oYXMoY3Vyck5laWdoYm9yQmFja3dhcmQpICYmXG4gICAgICAgIGN1cnJOZWlnaGJvckJhY2t3YXJkLm5vZGVUeXBlICE9PSAnYmFycmllcidcbiAgICAgICkge1xuICAgICAgICBxdWV1ZUJhY2t3YXJkcy5wdXNoKGN1cnJOZWlnaGJvckJhY2t3YXJkKTtcbiAgICAgICAgY3Vyck5laWdoYm9yQmFja3dhcmQucHJldmlvdXNOb2RlID0gY3Vyck5vZGVCYWNrd2FyZDtcbiAgICAgICAgY3Vyck5laWdoYm9yQmFja3dhcmQuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcpO1xuICAgICAgICB2aXNpdGVkQmFja3dhcmRzLmFkZChjdXJyTmVpZ2hib3JCYWNrd2FyZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2aXNpdGVkRm9yd2FyZHMuaGFzKGN1cnJOZWlnaGJvckJhY2t3YXJkKSkge1xuICAgICAgICBkaXNwYXlGaW5hbFBhdGgoY3Vyck5laWdoYm9yQmFja3dhcmQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBydW5EaWprc3RyYShzdGFydE5vZGUsIGVuZE5vZGUsIGRlbGF5KSB7XG4gIGNvbnN0IG9wZW5MaXN0UXVldWUgPSBbXTsgLy8gdHJhY2tzIG5vZGVzIHRvIHZpc2l0XG4gIGNvbnN0IGNsb3NlZExpc3QgPSBbXTtcbiAgY29uc3QgZmluYWxQYXRoID0gW107XG5cbiAgYXN5bmMgZnVuY3Rpb24gZGlzcGxheUZpbmFsUGF0aChwYXRoKSB7XG4gICAgZm9yIChsZXQgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChwYXRoW2ldLm5vZGVUeXBlID09PSAnc3RhcnQnIHx8IHBhdGhbaV0ubm9kZVR5cGUgPT09ICdlbmQnKSBjb250aW51ZTtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwKSk7XG4gICAgICBwYXRoW2ldLnNldE5vZGVUeXBlKCdmaW5hbC1wYXRoJyk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnROb2RlLmcgPSAwO1xuICBvcGVuTGlzdFF1ZXVlLnB1c2goc3RhcnROb2RlKTtcblxuICBhc3luYyBmdW5jdGlvbiBhbGdvcml0aG0oKSB7XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IG9wZW5MaXN0UXVldWUuc2hpZnQoKTtcbiAgICBpZiAoY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdlbmQnKSB7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnY2xvc2VkLWxpc3QnKTtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudE5vZGUgPT09IGVuZE5vZGUpIHtcbiAgICAgIGxldCB0ZW1wID0gY3VycmVudE5vZGU7XG4gICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wKTtcbiAgICAgIHdoaWxlICh0ZW1wLnByZXZpb3VzTm9kZSkge1xuICAgICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wLnByZXZpb3VzTm9kZSk7XG4gICAgICAgIHRlbXAgPSB0ZW1wLnByZXZpb3VzTm9kZTtcbiAgICAgIH1cbiAgICAgIGRpc3BsYXlGaW5hbFBhdGgoZmluYWxQYXRoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudE5vZGUubmVpZ2hib3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjdXJyTmVpZ2hib3IgPSBjdXJyZW50Tm9kZS5uZWlnaGJvcnNbaV07XG5cbiAgICAgIGlmIChjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdiYXJyaWVyJyAmJiAhY2xvc2VkTGlzdC5pbmNsdWRlcyhjdXJyTmVpZ2hib3IpKSB7XG4gICAgICAgIGlmIChjdXJyTmVpZ2hib3IuZyA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICBjdXJyTmVpZ2hib3IuZyA9IGN1cnJlbnROb2RlLmcgKyAxO1xuICAgICAgICAgIGN1cnJOZWlnaGJvci5wcmV2aW91c05vZGUgPSBjdXJyZW50Tm9kZTtcbiAgICAgICAgICBvcGVuTGlzdFF1ZXVlLnB1c2goY3Vyck5laWdoYm9yKTtcbiAgICAgICAgICBpZiAoY3Vyck5laWdoYm9yLm5vZGVUeXBlICE9PSAnc3RhcnQnICYmIGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ2VuZCcpIHtcbiAgICAgICAgICAgIGN1cnJOZWlnaGJvci5zZXROb2RlVHlwZSgnb3Blbi1saXN0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wZW5MaXN0UXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgYWxnb3JpdGhtKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgZG9uZSA9IGFsZ29yaXRobSgpO1xuICByZXR1cm4gZG9uZTtcbn1cbiIsIi8vIHVwZGF0ZSBzcXVhcmUgZGlzcGxheVxuZnVuY3Rpb24gZGlzcGxheU5vZGUobm9kZSwgY3Vyck5vZGVUeXBlLCBuZXdOb2RlVHlwZSwgZ3JpZCkge1xuICBjb25zdCBkb21TcXVhcmUgPSBncmlkLmZpbmREb21TcXVhcmUobm9kZS5yb3cgLSAxLCBub2RlLmNvbCAtIDEpO1xuXG4gIGRvbVNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlZCcpO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG4gIGRvbVNxdWFyZS5vZmZzZXRXaWR0aDtcbiAgaWYgKG5ld05vZGVUeXBlICE9PSAnY2xvc2VkLWxpc3QnKSB7XG4gICAgZG9tU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGVkJyk7XG4gIH1cblxuICBkb21TcXVhcmUuY2xhc3NMaXN0LnRvZ2dsZShjdXJyTm9kZVR5cGUsIGZhbHNlKTtcbiAgZG9tU3F1YXJlLmNsYXNzTGlzdC50b2dnbGUobmV3Tm9kZVR5cGUsIHRydWUpO1xufVxuXG4vLyBmaWxsIGdyaWQgY29tcGxldGVseSB3aXRoIGJhcnJpZXJzXG5mdW5jdGlvbiBmaWxsR3JpZChncmlkLCBzcXVhcmVTaXplKSB7XG4gIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAvLyBDcmVhdGUgYSBkb2N1bWVudCBmcmFnbWVudCB0byBiYXRjaCB0aGUgdXBkYXRlc1xuICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICBncmlkQ29udGFpbmVyLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdncmlkLWNvbnRhaW5lcicpO1xuICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYCR7c3F1YXJlU2l6ZX0tZ3JpZGApO1xuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBjb25zdCBncmlkU3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2JhcnJpZXInKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZChgJHtzcXVhcmVTaXplfWApO1xuXG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChncmlkU3F1YXJlKTtcbiAgICB9XG4gIH1cblxuICAvLyBBcHBlbmQgdGhlIGVudGlyZSBmcmFnbWVudCB0byB0aGUgY29udGFpbmVyIGF0IG9uY2VcbiAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG59XG5cbi8vIGRpc3BsYXkgZnVsbCBncmlkXG5mdW5jdGlvbiBjcmVhdGVHcmlkKGdyaWQsIHNxdWFyZVNpemUpIHtcbiAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLWNvbnRhaW5lcicpO1xuICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gIC8vIENyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50IHRvIGJhdGNoIHRoZSB1cGRhdGVzXG4gIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gIGdyaWRDb250YWluZXIucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2dyaWQtY29udGFpbmVyJyk7XG4gIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LmFkZChgJHtzcXVhcmVTaXplfS1ncmlkYCk7XG5cbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgIGNvbnN0IGdyaWRTcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZChgJHtzcXVhcmVTaXplfWApO1xuXG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChncmlkU3F1YXJlKTtcbiAgICB9XG4gIH1cblxuICAvLyBBcHBlbmQgdGhlIGVudGlyZSBmcmFnbWVudCB0byB0aGUgY29udGFpbmVyIGF0IG9uY2VcbiAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG59XG5cbmNvbnN0IERvbUhhbmRsZXIgPSB7XG4gIGNyZWF0ZUdyaWQsXG4gIGZpbGxHcmlkLFxuICBkaXNwbGF5Tm9kZSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERvbUhhbmRsZXI7XG4iLCJpbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnO1xuaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb21oYW5kbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZCB7XG4gIGNvbnN0cnVjdG9yKHJvd3MsIGNvbHMsIG5vZGVXaWR0aCwgY3VycmVudGx5UnVubmluZykge1xuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5jb2xzID0gY29scztcbiAgICB0aGlzLm5vZGVXaWR0aCA9IG5vZGVXaWR0aDtcbiAgICB0aGlzLnN0YXJ0ID0geyBub2RlOiBudWxsIH07XG4gICAgdGhpcy5lbmQgPSB7IG5vZGU6IG51bGwgfTtcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICB0aGlzLm9wZW5MaXN0ID0gW107XG4gICAgdGhpcy5jbG9zZWRMaXN0ID0gW107XG4gICAgdGhpcy5maW5hbFBhdGggPSBbXTtcbiAgICB0aGlzLmNyZWF0ZUdyaWQodGhpcy5yb3dzLCB0aGlzLmNvbHMpO1xuICAgIHRoaXMuY3VycmVudGx5UnVubmluZyA9IGN1cnJlbnRseVJ1bm5pbmc7IC8vIGlzIGFuIGFsZ29yaXRobSBydW5uaW5nP1xuXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgdGhpcy5lcmFzZU1vZGVPbiA9IGZhbHNlO1xuICB9XG5cbiAgLy8gdXBkYXRlIHNxdWFyZSBub2RlIHR5cGUgYW5kIHVwZGF0ZSBjb3JyZXNwb25kaW5nIGRvbSBzcXVhcmVcbiAgc2V0U3F1YXJlU3RhdHVzKHJvdywgY29sKSB7XG4gICAgY29uc3QgY3VycmVudE5vZGUgPSB0aGlzLmdyaWRbcm93XVtjb2xdO1xuICAgIGlmICh0aGlzLmVyYXNlTW9kZU9uKSB7XG4gICAgICBpZiAoY3VycmVudE5vZGUgPT09IHRoaXMuc3RhcnQubm9kZSkgdGhpcy5zdGFydC5ub2RlID0gbnVsbDtcbiAgICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gdGhpcy5lbmQubm9kZSkgdGhpcy5lbmQubm9kZSA9IG51bGw7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdlbXB0eScpIHJldHVybjtcblxuICAgIGlmICh0aGlzLnN0YXJ0Lm5vZGUgPT09IG51bGwpIHtcbiAgICAgIGN1cnJlbnROb2RlLnNldE5vZGVUeXBlKCdzdGFydCcpO1xuICAgICAgdGhpcy5zdGFydC5ub2RlID0gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVuZC5ub2RlID09PSBudWxsKSB7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnZW5kJyk7XG4gICAgICB0aGlzLmVuZC5ub2RlID0gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnROb2RlLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW91c2VEb3duKHJvdywgY29sKSB7XG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnNldFNxdWFyZVN0YXR1cyhyb3csIGNvbCk7XG4gIH1cblxuICBoYW5kbGVNb3VzZU1vdmUocm93LCBjb2wpIHtcbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICB0aGlzLnNldFNxdWFyZVN0YXR1cyhyb3csIGNvbCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW91c2VVcCgpIHtcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIGZpbmQgc3F1YXJlIGluIHRoZSBkb21cbiAgZmluZERvbVNxdWFyZShyb3csIGNvbCkge1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyQ2hpbGRyZW4gPSBncmlkQ29udGFpbmVyLmNoaWxkcmVuO1xuICAgIGNvbnN0IGluZGV4ID0gcm93ICogdGhpcy5jb2xzICsgY29sO1xuICAgIHJldHVybiBncmlkQ29udGFpbmVyQ2hpbGRyZW5baW5kZXhdO1xuICB9XG5cbiAgYWRkTGlzdGVuZXJzKCkge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMucm93czsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgY29uc3QgZ3JpZFNxdWFyZSA9IHRoaXMuZmluZERvbVNxdWFyZShyb3csIGNvbCk7XG4gICAgICAgIGdyaWRTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRseVJ1bm5pbmdbMF0pIHJldHVybjtcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRG93bihyb3csIGNvbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBncmlkU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50bHlSdW5uaW5nWzBdKSByZXR1cm47XG4gICAgICAgICAgdGhpcy5oYW5kbGVNb3VzZU1vdmUocm93LCBjb2wpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVNb3VzZVVwKCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyB1c2VkIHRvIGNyZWF0ZSBncmlkIG9mIGVtcHR5IG9yIGJhcnJpZXIgc3F1YXJlc1xuICBjcmVhdGVHcmlkKHJvd3MsIGNvbHMpIHtcbiAgICBmb3IgKGxldCByb3cgPSAxOyByb3cgPD0gcm93czsgcm93KyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBbXTtcbiAgICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8PSBjb2xzOyBjb2wrKykge1xuICAgICAgICBjdXJyZW50Um93LnB1c2gobmV3IE5vZGUocm93LCBjb2wsIHRoaXMucm93cywgdGhpcy5jb2xzLCB0aGlzLCB0aGlzLm5vZGVXaWR0aCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5ncmlkLnB1c2goY3VycmVudFJvdyk7XG4gICAgfVxuICAgIERvbUhhbmRsZXIuY3JlYXRlR3JpZCh0aGlzLmdyaWQsIHRoaXMubm9kZVdpZHRoKTtcbiAgfVxuXG4gIC8vIGZpbGwgZ3JpZCBhcyBiYXJyaWVyc1xuICBmaWxsR3JpZCgpIHtcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICBmb3IgKGxldCByb3cgPSAxOyByb3cgPD0gdGhpcy5yb3dzOyByb3crKykge1xuICAgICAgY29uc3QgY3VycmVudFJvdyA9IFtdO1xuICAgICAgZm9yIChsZXQgY29sID0gMTsgY29sIDw9IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5ldyBOb2RlKHJvdywgY29sLCB0aGlzLnJvd3MsIHRoaXMuY29scywgdGhpcywgdGhpcy5ub2RlV2lkdGgpO1xuICAgICAgICBub2RlLm5vZGVUeXBlID0gJ2JhcnJpZXInO1xuICAgICAgICBjdXJyZW50Um93LnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmdyaWQucHVzaChjdXJyZW50Um93KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldEFsbE5vZGVOZWlnaGJvcnMoKTtcblxuICAgIHRoaXMuc3RhcnQubm9kZSA9IG51bGw7XG4gICAgdGhpcy5lbmQubm9kZSA9IG51bGw7XG5cbiAgICAvLyByZXNldGluZyBkb20gc3F1YXJlc1xuICAgIERvbUhhbmRsZXIuZmlsbEdyaWQodGhpcy5ncmlkLCB0aGlzLm5vZGVXaWR0aCk7XG4gICAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBuZWlnaGJvcnMgZm9yIGV2ZXJ5IHNpbmdsZSBub2RlIGluIGdyaWRcbiAgc2V0QWxsTm9kZU5laWdoYm9ycygpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLmdyaWQubGVuZ3RoOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5ncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLnNldE5laWdoYm9ycyh0aGlzLmdyaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHJlc2V0IGdyaWQgYW5kIGFsbCBub2RlcyBjb21wbGV0ZWx5XG4gIHJlc2V0R3JpZCgpIHtcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICBmb3IgKGxldCByb3cgPSAxOyByb3cgPD0gdGhpcy5yb3dzOyByb3crKykge1xuICAgICAgY29uc3QgY3VycmVudFJvdyA9IFtdO1xuICAgICAgZm9yIChsZXQgY29sID0gMTsgY29sIDw9IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgY3VycmVudFJvdy5wdXNoKG5ldyBOb2RlKHJvdywgY29sLCB0aGlzLnJvd3MsIHRoaXMuY29scywgdGhpcywgdGhpcy5ub2RlV2lkdGgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ3JpZC5wdXNoKGN1cnJlbnRSb3cpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0QWxsTm9kZU5laWdoYm9ycygpO1xuXG4gICAgdGhpcy5zdGFydC5ub2RlID0gbnVsbDtcbiAgICB0aGlzLmVuZC5ub2RlID0gbnVsbDtcblxuICAgIC8vIHJlc2V0aW5nIGRvbSBzcXVhcmVzXG4gICAgRG9tSGFuZGxlci5jcmVhdGVHcmlkKHRoaXMuZ3JpZCwgdGhpcy5ub2RlV2lkdGgpO1xuICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG4gIH1cblxuICAvLyByZXNldCBhbGdvcml0aG0gZGlzcGxheSBvbiBncmlkIGUuZyBmaW5hbCBwYXRoLCBvcGVuLWxpc3QgYW5kIGNsb3NlZC1saXN0XG4gIHJlc2V0UGF0aCgpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnJvd3M7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLmNvbHM7IGNvbCsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJOb2RlID0gdGhpcy5ncmlkW3Jvd11bY29sXTtcbiAgICAgICAgY29uc3QgY3VyclR5cGUgPSBjdXJyTm9kZS5ub2RlVHlwZTtcbiAgICAgICAgaWYgKGN1cnJUeXBlID09PSAnb3Blbi1saXN0JyB8fCBjdXJyVHlwZSA9PT0gJ2Nsb3NlZC1saXN0JyB8fCBjdXJyVHlwZSA9PT0gJ2ZpbmFsLXBhdGgnKSB7XG4gICAgICAgICAgY3Vyck5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVHcmlkU2l6ZShyb3dzLCBjb2xzLCBub2RlV2lkdGgpIHtcbiAgICB0aGlzLnJvd3MgPSByb3dzO1xuICAgIHRoaXMuY29scyA9IGNvbHM7XG4gICAgdGhpcy5ub2RlV2lkdGggPSBub2RlV2lkdGg7XG4gIH1cblxuICBzZXRFcmFzZU1vZGUoKSB7XG4gICAgdGhpcy5lcmFzZU1vZGVPbiA9ICF0aGlzLmVyYXNlTW9kZU9uO1xuICB9XG59XG4iLCJpbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xuaW1wb3J0IEFsZ29yaXRobUZhY3RvcnkgZnJvbSAnLi9hbGdvcml0aG1mYWN0b3J5JztcbmltcG9ydCBNYXplRmFjdG9yeSBmcm9tICcuL21hemVmYWN0b3J5JztcblxubGV0IGdyaWRPYmogPSBudWxsO1xubGV0IHNlbGVjdGVkQWxnb3JpdGhtID0gbnVsbDtcbmxldCBzZWxlY3RlZE1hemUgPSBudWxsO1xuY29uc3QgcnVubmluZyA9IFtmYWxzZV07IC8vIGNoZWNrIGlmIGFsZ29yaXRobSBpcyBjdXJyZW50bHkgcnVubmluZ1xubGV0IGN1cnJNYXplU3BlZWRTZXR0aW5nID0gJ05vcm1hbCc7XG5sZXQgY3VyclBhdGhmaW5kaW5nU3BlZWRTZXR0aW5nID0gJ05vcm1hbCc7XG5sZXQgbWF6ZVNwZWVkID0gMTA7XG5sZXQgcGF0aGZpbmRpbmdTcGVlZCA9IDEwO1xubGV0IGdyaWRTaXplID0gJ21lZGl1bSc7XG5cbi8vIGNvbnRhaW5zIGluZm8gYXNzb2NpYXRlZCB3aXRoIGVhY2ggZ3JpZCBzaXplXG5jb25zdCBncmlkU2l6ZXMgPSB7XG4gIHNtYWxsOiB7IHJvd3M6IDE1LCBjb2xzOiAzNyB9LFxuICBtZWRpdW06IHsgcm93czogMjUsIGNvbHM6IDYxIH0sXG4gIGxhcmdlOiB7IHJvd3M6IDM3LCBjb2xzOiA5MSB9LFxufTtcblxuLy8gcGF0aGZpbmRpbmcgc3BlZWRzIGZvciBkaWZmZXJlbnQgZ3JpZCBzaXplc1xuY29uc3QgcGF0aGZpbmRpbmdTcGVlZHMgPSB7XG4gIHNsb3c6IHsgc21hbGw6IDE1MCwgbWVkaXVtOiAzMCwgbGFyZ2U6IDMwIH0sXG4gIG5vcm1hbDogeyBzbWFsbDogNTAsIG1lZGl1bTogMTAsIGxhcmdlOiAxMCB9LFxuICBmYXN0OiB7IHNtYWxsOiAyMCwgbWVkaXVtOiA1LCBsYXJnZTogMSB9LFxuICBpbnN0YW50OiAwLFxufTtcblxuLy8gbWF6ZSBnZW5lcmF0aW9uIHNwZWVkcyBmb3IgZGlmZmVyZW50IGdyaWQgc2l6ZXNcbmNvbnN0IG1hemVHZW5TcGVlZHMgPSB7XG4gIHNsb3c6IHsgc21hbGw6IDEyMCwgbWVkaXVtOiAyMCwgbGFyZ2U6IDEwIH0sXG4gIG5vcm1hbDogeyBzbWFsbDogMzAsIG1lZGl1bTogMTAsIGxhcmdlOiAzIH0sXG4gIGZhc3Q6IHsgc21hbGw6IDE1LCBtZWRpdW06IDEsIGxhcmdlOiAwLjEgfSxcbiAgaW5zdGFudDogMCxcbn07XG5cbi8vIGluaXRpYWxseSBsb2FkZWQgZ3JpZFxuZnVuY3Rpb24gbG9hZEdyaWQoKSB7XG4gIGdyaWRPYmogPSBuZXcgR3JpZChncmlkU2l6ZXMubWVkaXVtLnJvd3MsIGdyaWRTaXplcy5tZWRpdW0uY29scywgZ3JpZFNpemUsIHJ1bm5pbmcpO1xufVxuXG4vLyBydW4gcGF0aGZpbmRpbmcgYWxnb3JpdGhtXG5hc3luYyBmdW5jdGlvbiBydW5BbGdvcml0aG0ocGF0aEZpbmRpbmdBbGdvcml0aG0pIHtcbiAgaWYgKHJ1bm5pbmdbMF0gfHwgIXBhdGhGaW5kaW5nQWxnb3JpdGhtIHx8ICFncmlkT2JqLnN0YXJ0Lm5vZGUgfHwgIWdyaWRPYmouZW5kLm5vZGUpIHJldHVybjtcbiAgcnVubmluZ1swXSA9IHRydWU7XG5cbiAgZ3JpZE9iai5zZXRBbGxOb2RlTmVpZ2hib3JzKCk7XG4gIGdyaWRPYmoucmVzZXRQYXRoKCk7XG5cbiAgaWYgKHBhdGhGaW5kaW5nQWxnb3JpdGhtID09PSAnRGlqa3N0cmEnKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZE9iai5ncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRPYmouZ3JpZFswXS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICAgIGdyaWRPYmouZ3JpZFtyb3ddW2NvbF0uZyA9IEluZmluaXR5O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXJ0Tm9kZSA9IGdyaWRPYmouc3RhcnQubm9kZTtcbiAgY29uc3QgZW5kTm9kZSA9IGdyaWRPYmouZW5kLm5vZGU7XG5cbiAgY29uc3QgYWxnb3JpdGhtID0gQWxnb3JpdGhtRmFjdG9yeS5jcmVhdGVBbGdvcml0aG0ocGF0aEZpbmRpbmdBbGdvcml0aG0pO1xuICBjb25zdCBkb25lID0gYXdhaXQgYWxnb3JpdGhtKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgcGF0aGZpbmRpbmdTcGVlZCk7XG5cbiAgaWYgKGRvbmUpIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbn1cblxuLy8gcnVuIG1hemUgZ2VuZXJhdGlvbiBhbGdvcml0aG1cbmFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlTWF6ZShtYXplR2VuZXJhdGlvbkFsZ29yaXRobSkge1xuICBpZiAocnVubmluZ1swXSB8fCBtYXplR2VuZXJhdGlvbkFsZ29yaXRobSA9PT0gbnVsbCkgcmV0dXJuO1xuICBydW5uaW5nWzBdID0gdHJ1ZTtcbiAgZ3JpZE9iai5yZXNldEdyaWQoKTtcblxuICBjb25zdCBtYXplID0gTWF6ZUZhY3RvcnkuY3JlYXRlTWF6ZShtYXplR2VuZXJhdGlvbkFsZ29yaXRobSk7XG4gIGNvbnN0IGRvbmUgPSBhd2FpdCBtYXplKGdyaWRPYmosIG1hemVTcGVlZCk7XG5cbiAgaWYgKGRvbmUpIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbn1cblxuLy8gdXBkYXRlIGhvdyBmYXN0IG1hemUgZ2VuZXJhdGVzXG5mdW5jdGlvbiB1cGRhdGVNYXplRGVsYXkoc3BlZWQpIHtcbiAgaWYgKGdyaWRTaXplID09PSAnc21hbGwnKSB7XG4gICAgaWYgKHNwZWVkID09PSAnU2xvdycpIG1hemVTcGVlZCA9IG1hemVHZW5TcGVlZHMuc2xvdy5zbWFsbDtcbiAgICBpZiAoc3BlZWQgPT09ICdOb3JtYWwnKSBtYXplU3BlZWQgPSBtYXplR2VuU3BlZWRzLm5vcm1hbC5zbWFsbDtcbiAgICBpZiAoc3BlZWQgPT09ICdGYXN0JykgbWF6ZVNwZWVkID0gbWF6ZUdlblNwZWVkcy5mYXN0LnNtYWxsO1xuICB9XG4gIGlmIChncmlkU2l6ZSA9PT0gJ21lZGl1bScpIHtcbiAgICBpZiAoc3BlZWQgPT09ICdTbG93JykgbWF6ZVNwZWVkID0gbWF6ZUdlblNwZWVkcy5zbG93Lm1lZGl1bTtcbiAgICBpZiAoc3BlZWQgPT09ICdOb3JtYWwnKSBtYXplU3BlZWQgPSBtYXplR2VuU3BlZWRzLm5vcm1hbC5tZWRpdW07XG4gICAgaWYgKHNwZWVkID09PSAnRmFzdCcpIG1hemVTcGVlZCA9IG1hemVHZW5TcGVlZHMuZmFzdC5tZWRpdW07XG4gIH1cbiAgaWYgKGdyaWRTaXplID09PSAnbGFyZ2UnKSB7XG4gICAgaWYgKHNwZWVkID09PSAnU2xvdycpIG1hemVTcGVlZCA9IG1hemVHZW5TcGVlZHMuc2xvdy5sYXJnZTtcbiAgICBpZiAoc3BlZWQgPT09ICdOb3JtYWwnKSBtYXplU3BlZWQgPSBtYXplR2VuU3BlZWRzLm5vcm1hbC5sYXJnZTtcbiAgICBpZiAoc3BlZWQgPT09ICdGYXN0JykgbWF6ZVNwZWVkID0gbWF6ZUdlblNwZWVkcy5mYXN0LmxhcmdlO1xuICB9XG5cbiAgaWYgKHNwZWVkID09PSAnSW5zdGFudCcpIG1hemVTcGVlZCA9IG1hemVHZW5TcGVlZHMuaW5zdGFudDtcbn1cblxuLy8gdXBkYXRlIGhvdyBmYXN0IHBhdGggYWxnb3JpdGhtIGV4cGxvcmVzIG5vZGVzXG5mdW5jdGlvbiB1cGRhdGVQYXRoZmluZGluZ0RlbGF5KHNwZWVkKSB7XG4gIGlmIChncmlkU2l6ZSA9PT0gJ3NtYWxsJykge1xuICAgIGlmIChzcGVlZCA9PT0gJ1Nsb3cnKSBwYXRoZmluZGluZ1NwZWVkID0gcGF0aGZpbmRpbmdTcGVlZHMuc2xvdy5zbWFsbDtcbiAgICBpZiAoc3BlZWQgPT09ICdOb3JtYWwnKSBwYXRoZmluZGluZ1NwZWVkID0gcGF0aGZpbmRpbmdTcGVlZHMubm9ybWFsLnNtYWxsO1xuICAgIGlmIChzcGVlZCA9PT0gJ0Zhc3QnKSBwYXRoZmluZGluZ1NwZWVkID0gcGF0aGZpbmRpbmdTcGVlZHMuZmFzdC5zbWFsbDtcbiAgfVxuICBpZiAoZ3JpZFNpemUgPT09ICdtZWRpdW0nKSB7XG4gICAgaWYgKHNwZWVkID09PSAnU2xvdycpIHBhdGhmaW5kaW5nU3BlZWQgPSBwYXRoZmluZGluZ1NwZWVkcy5zbG93Lm1lZGl1bTtcbiAgICBpZiAoc3BlZWQgPT09ICdOb3JtYWwnKSBwYXRoZmluZGluZ1NwZWVkID0gcGF0aGZpbmRpbmdTcGVlZHMubm9ybWFsLm1lZGl1bTtcbiAgICBpZiAoc3BlZWQgPT09ICdGYXN0JykgcGF0aGZpbmRpbmdTcGVlZCA9IHBhdGhmaW5kaW5nU3BlZWRzLmZhc3QubWVkaXVtO1xuICB9XG4gIGlmIChncmlkU2l6ZSA9PT0gJ2xhcmdlJykge1xuICAgIGlmIChzcGVlZCA9PT0gJ1Nsb3cnKSBwYXRoZmluZGluZ1NwZWVkID0gcGF0aGZpbmRpbmdTcGVlZHMuc2xvdy5sYXJnZTtcbiAgICBpZiAoc3BlZWQgPT09ICdOb3JtYWwnKSBwYXRoZmluZGluZ1NwZWVkID0gcGF0aGZpbmRpbmdTcGVlZHMubm9ybWFsLmxhcmdlO1xuICAgIGlmIChzcGVlZCA9PT0gJ0Zhc3QnKSBwYXRoZmluZGluZ1NwZWVkID0gcGF0aGZpbmRpbmdTcGVlZHMuZmFzdC5sYXJnZTtcbiAgfVxuXG4gIGlmIChzcGVlZCA9PT0gJ0luc3RhbnQnKSBwYXRoZmluZGluZ1NwZWVkID0gcGF0aGZpbmRpbmdTcGVlZHMuaW5zdGFudDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlR3JpZFNpemUoc2l6ZSkge1xuICBjb25zdCBuZXdTaXplID0gc2l6ZS50b0xvd2VyQ2FzZSgpO1xuICBncmlkU2l6ZSA9IG5ld1NpemU7XG4gIGlmIChzaXplID09PSAnU21hbGwnKSB7XG4gICAgZ3JpZE9iai51cGRhdGVHcmlkU2l6ZShncmlkU2l6ZXMuc21hbGwucm93cywgZ3JpZFNpemVzLnNtYWxsLmNvbHMsIGdyaWRTaXplKTtcbiAgfVxuICBpZiAoc2l6ZSA9PT0gJ01lZGl1bScpIHtcbiAgICBncmlkT2JqLnVwZGF0ZUdyaWRTaXplKGdyaWRTaXplcy5tZWRpdW0ucm93cywgZ3JpZFNpemVzLm1lZGl1bS5jb2xzLCBncmlkU2l6ZSk7XG4gIH1cbiAgaWYgKHNpemUgPT09ICdMYXJnZScpIHtcbiAgICBncmlkT2JqLnVwZGF0ZUdyaWRTaXplKGdyaWRTaXplcy5sYXJnZS5yb3dzLCBncmlkU2l6ZXMubGFyZ2UuY29scywgZ3JpZFNpemUpO1xuICB9XG5cbiAgZ3JpZE9iai5yZXNldEdyaWQoKTtcblxuICB1cGRhdGVQYXRoZmluZGluZ0RlbGF5KGN1cnJQYXRoZmluZGluZ1NwZWVkU2V0dGluZyk7XG4gIHVwZGF0ZU1hemVEZWxheShjdXJyTWF6ZVNwZWVkU2V0dGluZyk7XG59XG5cbmZ1bmN0aW9uIGFkZExpc3RlbmVyc1RvQnRucygpIHtcbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnQtYWxnb3JpdGhtJyk7XG4gIGNvbnN0IGdlbmVyYXRlTWF6ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nZW5lcmF0ZS1tYXplJyk7XG5cbiAgY29uc3Qgc2VsZWN0QWxnb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtYWxnby1idG4nKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtbWF6ZS1idG4nKTtcbiAgY29uc3QgZ3JpZFNpemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1zaXplLWJ0bicpO1xuICBjb25zdCBzZWxlY3RNYXplU3BlZWRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LW1hemUtc3BlZWQtYnRuJyk7XG4gIGNvbnN0IHNlbGVjdEFsZ29TcGVlZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtYWxnby1zcGVlZC1idG4nKTtcblxuICBjb25zdCBzZWxlY3RBbGdvQnRuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hbGdvLWxpc3QnKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZUJ0bkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWF6ZS1saXN0Jyk7XG4gIGNvbnN0IGdyaWRTaXplQnRuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLXNpemUtbGlzdCcpO1xuICBjb25zdCBzZWxlY3RNYXplU3BlZWRCdG5MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1hemUtc3BlZWQtbGlzdCcpO1xuICBjb25zdCBzZWxlY3RBbGdvU3BlZWRCdG5MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsZ28tc3BlZWQtbGlzdCcpO1xuICBjb25zdCBzZWxlY3RBbGdvTGlzdEl0ZW1zID0gc2VsZWN0QWxnb0J0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG4gIGNvbnN0IHNlbGVjdE1hemVMaXN0SXRlbXMgPSBzZWxlY3RNYXplQnRuTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC1zZWxlY3Rpb24nKTtcbiAgY29uc3QgZ3JpZFNpemVMaXN0SXRlbXMgPSBncmlkU2l6ZUJ0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG4gIGNvbnN0IHNlbGVjdE1hemVTcGVlZExpc3RJdGVtcyA9IHNlbGVjdE1hemVTcGVlZEJ0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG4gIGNvbnN0IHNlbGVjdEFsZ29TcGVlZExpc3RJdGVtcyA9IHNlbGVjdEFsZ29TcGVlZEJ0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG5cbiAgY29uc3QgZHJvcGRvd25CdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Bkb3duLWJ0bicpO1xuICBjb25zdCBkcm9wZG93bkxpc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Bkb3duLWxpc3QnKTtcbiAgY29uc3QgY2xlYXJCb2FyZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbGVhci1ib2FyZCcpO1xuICBjb25zdCBjbGVhclBhdGhCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xlYXItcGF0aCcpO1xuICBjb25zdCBlcmFzZU1vZGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZXJhc2UtbW9kZScpO1xuXG4gIGxldCBjdXJyZW50UGFnZSA9IDA7XG4gIGNvbnN0IGRhcmtPdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRhcmstb3ZlcmxheScpO1xuICBjb25zdCBoZWxwQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVscC1ib2FyZCcpO1xuICBjb25zdCBwYWdlcyA9IGhlbHBCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnZScpO1xuICBjb25zdCBza2lwQnRucyA9IGhlbHBCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2tpcC1idG4nKTtcbiAgY29uc3QgbmV4dEJ0bnMgPSBoZWxwQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLm5leHQtYnRuJyk7XG4gIGNvbnN0IHByZXZpb3VzQnRucyA9IGhlbHBCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcucHJldmlvdXMtYnRuJyk7XG4gIGNvbnN0IGNvbnRpbnVlQnRuID0gaGVscEJvYXJkLnF1ZXJ5U2VsZWN0b3IoJy5jb250aW51ZS1idG4nKTtcbiAgY29uc3QgaGVscEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWxwLWJ0bicpO1xuXG4gIHN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIHJ1bkFsZ29yaXRobShzZWxlY3RlZEFsZ29yaXRobSk7XG4gIH0pO1xuXG4gIGdlbmVyYXRlTWF6ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBnZW5lcmF0ZU1hemUoc2VsZWN0ZWRNYXplKTtcbiAgfSk7XG5cbiAgc2tpcEJ0bnMuZm9yRWFjaCgoc2tpcEJ0bikgPT4ge1xuICAgIHNraXBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBoZWxwQm9hcmQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGRhcmtPdmVybGF5LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHByZXZpb3VzQnRucy5mb3JFYWNoKChwcmV2aW91c0J0bikgPT4ge1xuICAgIHByZXZpb3VzQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKGN1cnJlbnRQYWdlID4gMCkge1xuICAgICAgICBwYWdlc1tjdXJyZW50UGFnZV0ucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuICAgICAgICBjdXJyZW50UGFnZSAtPSAxO1xuICAgICAgICBwYWdlc1tjdXJyZW50UGFnZV0uc2V0QXR0cmlidXRlKCdpZCcsICdzaG93LXBhZ2UnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgbmV4dEJ0bnMuZm9yRWFjaCgobmV4dEJ0bikgPT4ge1xuICAgIG5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAoY3VycmVudFBhZ2UgPCBwYWdlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHBhZ2VzW2N1cnJlbnRQYWdlXS5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgIGN1cnJlbnRQYWdlICs9IDE7XG4gICAgICAgIHBhZ2VzW2N1cnJlbnRQYWdlXS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3Nob3ctcGFnZScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBjb250aW51ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBoZWxwQm9hcmQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBkYXJrT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9KTtcblxuICBmdW5jdGlvbiBjbG9zZURyb3Bkb3ducygpIHtcbiAgICBkcm9wZG93bkxpc3RzLmZvckVhY2goKGxpc3QpID0+IHtcbiAgICAgIGxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgIH0pO1xuICB9XG5cbiAgZHJvcGRvd25CdXR0b25zLmZvckVhY2goKGJ1dHRvbiwgaW5kZXgpID0+IHtcbiAgICBpZiAocnVubmluZ1swXSkgcmV0dXJuOyAvLyBhbGdvcml0aG0gaW4gcHJvZ3Jlc3NcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRMaXN0ID0gZHJvcGRvd25MaXN0c1tpbmRleF07XG4gICAgICBjb25zdCBpc0xpc3RPcGVuID0gY3VycmVudExpc3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93Jyk7XG5cbiAgICAgIGNsb3NlRHJvcGRvd25zKCk7XG5cbiAgICAgIGlmICghaXNMaXN0T3Blbikge1xuICAgICAgICBjdXJyZW50TGlzdC5jbGFzc0xpc3QudG9nZ2xlKCdzaG93Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBjb25zdCBpc0NsaWNrSW5zaWRlRHJvcGRvd24gPSBBcnJheS5mcm9tKGRyb3Bkb3duTGlzdHMpLnNvbWUoKGxpc3QpID0+IGxpc3QuY29udGFpbnMoZS50YXJnZXQpKTtcblxuICAgIGlmICghaXNDbGlja0luc2lkZURyb3Bkb3duKSB7XG4gICAgICBjbG9zZURyb3Bkb3ducygpO1xuICAgIH1cbiAgfSk7XG5cbiAgaGVscEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBkYXJrT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBoZWxwQm9hcmQuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgfSk7XG5cbiAgc2VsZWN0QWxnb0xpc3RJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBzZWxlY3RBbGdvQnRuTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICBzZWxlY3RBbGdvQnRuLnRleHRDb250ZW50ID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgIHNlbGVjdGVkQWxnb3JpdGhtID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGVjdE1hemVMaXN0SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgc2VsZWN0TWF6ZUJ0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0TWF6ZUJ0bi50ZXh0Q29udGVudCA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICBzZWxlY3RlZE1hemUgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZWN0TWF6ZVNwZWVkTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHNlbGVjdE1hemVTcGVlZEJ0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0TWF6ZVNwZWVkQnRuLnRleHRDb250ZW50ID0gYE1hemUgU3BlZWQ6ICR7aXRlbS50ZXh0Q29udGVudH1gO1xuICAgICAgY3Vyck1hemVTcGVlZFNldHRpbmcgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgdXBkYXRlTWF6ZURlbGF5KGl0ZW0udGV4dENvbnRlbnQpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZWN0QWxnb1NwZWVkTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHNlbGVjdEFsZ29TcGVlZEJ0bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgc2VsZWN0QWxnb1NwZWVkQnRuLnRleHRDb250ZW50ID0gYFBhdGhmaW5kaW5nIFNwZWVkOiAke2l0ZW0udGV4dENvbnRlbnR9YDtcbiAgICAgIGN1cnJQYXRoZmluZGluZ1NwZWVkU2V0dGluZyA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICB1cGRhdGVQYXRoZmluZGluZ0RlbGF5KGl0ZW0udGV4dENvbnRlbnQpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZ3JpZFNpemVMaXN0SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjtcbiAgICAgIGdyaWRTaXplQnRuTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICBncmlkU2l6ZUJ0bi50ZXh0Q29udGVudCA9IGBHcmlkIFNpemU6ICR7aXRlbS50ZXh0Q29udGVudH1gO1xuICAgICAgdXBkYXRlR3JpZFNpemUoaXRlbS50ZXh0Q29udGVudCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuICB9KTtcblxuICBjbGVhckJvYXJkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChydW5uaW5nWzBdKSByZXR1cm47XG4gICAgZ3JpZE9iai5yZXNldEdyaWQoKTtcbiAgfSk7XG5cbiAgY2xlYXJQYXRoQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChydW5uaW5nWzBdKSByZXR1cm47XG4gICAgZ3JpZE9iai5yZXNldFBhdGgoKTtcbiAgfSk7XG5cbiAgZXJhc2VNb2RlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBpZiAocnVubmluZ1swXSkgcmV0dXJuO1xuICAgIGlmIChlLnRhcmdldC50ZXh0Q29udGVudCA9PT0gJ0VyYXNlOiBPZmYnKSB7XG4gICAgICBlLnRhcmdldC50ZXh0Q29udGVudCA9ICdFcmFzZTogT24nO1xuICAgIH0gZWxzZSBpZiAoZS50YXJnZXQudGV4dENvbnRlbnQgPT09ICdFcmFzZTogT24nKSB7XG4gICAgICBlLnRhcmdldC50ZXh0Q29udGVudCA9ICdFcmFzZTogT2ZmJztcbiAgICB9XG4gICAgZ3JpZE9iai5zZXRFcmFzZU1vZGUoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZExpc3RlbmVyc1RvR3JpZCgpIHtcbiAgZ3JpZE9iai5hZGRMaXN0ZW5lcnMoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZCgpIHtcbiAgbG9hZEdyaWQoKTtcbiAgYWRkTGlzdGVuZXJzVG9HcmlkKCk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgYWRkTGlzdGVuZXJzVG9CdG5zKCk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHJlY3Vyc2l2ZURpdmlzaW9uIGZyb20gJy4vbWF6ZXMvcmVjdXJzaXZlZGl2aXNpb24nO1xuaW1wb3J0IGJpbmFyeVRyZWUgZnJvbSAnLi9tYXplcy9iaW5hcnl0cmVlJztcbmltcG9ydCBzaWRld2luZGVyIGZyb20gJy4vbWF6ZXMvc2lkZXdpbmRlcic7XG5pbXBvcnQgZ2VuZXJhdGVQcmltcyBmcm9tICcuL21hemVzL3ByaW1zJztcbmltcG9ydCBnZW5lcmF0ZUh1bnRBbmRLaWxsIGZyb20gJy4vbWF6ZXMvaHVudGFuZGtpbGwnO1xuaW1wb3J0IHJhbmRvbU1hcCBmcm9tICcuL21hemVzL3JhbmRvbW1hcCc7XG5cbmNsYXNzIE1hemVGYWN0b3J5IHtcbiAgc3RhdGljIGNyZWF0ZU1hemUobWF6ZUFsZ29yaXRobSkge1xuICAgIC8vIE1hcCBhbGdvcml0aG0gbmFtZXMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBpbXBsZW1lbnRhdGlvbnNcbiAgICBjb25zdCBhbGdvcml0aG1zID0ge1xuICAgICAgJ1JlY3Vyc2l2ZSBEaXZpc2lvbic6IHJlY3Vyc2l2ZURpdmlzaW9uLFxuICAgICAgJ0JpbmFyeSBUcmVlJzogYmluYXJ5VHJlZSxcbiAgICAgIFNpZGV3aW5kZXI6IHNpZGV3aW5kZXIsXG4gICAgICBcIlByaW0nc1wiOiBnZW5lcmF0ZVByaW1zLFxuICAgICAgJ0h1bnQgJiBLaWxsJzogZ2VuZXJhdGVIdW50QW5kS2lsbCxcbiAgICAgICdSYW5kb20gTWFwJzogcmFuZG9tTWFwLFxuICAgIH07XG5cbiAgICBjb25zdCBBbGdvcml0aG1DbGFzcyA9IGFsZ29yaXRobXNbbWF6ZUFsZ29yaXRobV07XG5cbiAgICBpZiAoIUFsZ29yaXRobUNsYXNzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFsZ29yaXRobSBcIiR7bWF6ZUFsZ29yaXRobX1cIiBub3QgZm91bmRgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gQWxnb3JpdGhtQ2xhc3M7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWF6ZUZhY3Rvcnk7XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBiaW5hcnlUcmVlKGdyaWRPYmosIGRlbGF5KSB7XG4gIC8vIGZpbGwgZ3JpZCB3aXRoIGJhcnJpZXJzXG4gIGdyaWRPYmouZmlsbEdyaWQoKTtcblxuICBjb25zdCBncmlkID0gZ3JpZE9iai5ncmlkO1xuICBjb25zdCByb3dzID0gZ3JpZC5sZW5ndGg7XG4gIGNvbnN0IGNvbHMgPSBncmlkWzBdLmxlbmd0aDtcblxuICBmdW5jdGlvbiBjb25uZWN0KG5vZGUxLCBub2RlMiwgYmFycmllckJldHdlZW4pIHtcbiAgICBub2RlMS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICBub2RlMi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICBiYXJyaWVyQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgfVxuXG4gIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8IHJvd3M7IHJvdyArPSAyKSB7XG4gICAgZm9yIChsZXQgY29sID0gMTsgY29sIDwgY29sczsgY29sICs9IDIpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRTcXVhcmUgPSBncmlkW3Jvd11bY29sXTtcbiAgICAgIGxldCBub3J0aE5laWdoYm9yO1xuICAgICAgbGV0IHdlc3ROZWlnaGJvcjtcblxuICAgICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgICAgbm9ydGhOZWlnaGJvciA9IGdyaWRbcm93IC0gMl1bY29sXTsgLy8gdXBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vcnRoTmVpZ2hib3IgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29sID4gMSkge1xuICAgICAgICB3ZXN0TmVpZ2hib3IgPSBncmlkW3Jvd11bY29sIC0gMl07IC8vIGxlZnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdlc3ROZWlnaGJvciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChub3J0aE5laWdoYm9yICYmIHdlc3ROZWlnaGJvcikge1xuICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiBib3RoIHBhdGhzIGFyZSBhdmFpbGFibGVcbiAgICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgICAgIGlmIChyYW5kb20gPT09IDApIHtcbiAgICAgICAgICBjb25uZWN0KGN1cnJlbnRTcXVhcmUsIG5vcnRoTmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzNdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25uZWN0KGN1cnJlbnRTcXVhcmUsIHdlc3ROZWlnaGJvciwgY3VycmVudFNxdWFyZS5uZWlnaGJvcnNbMV0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBvbmUgb2YgdGhlIHBhdGhzIGdvIGJleW9uZCB0aGUgZ3JpZFxuICAgICAgICBpZiAocm93ID09PSAxICYmIGNvbCA+IDEpIHtcbiAgICAgICAgICBjb25uZWN0KGN1cnJlbnRTcXVhcmUsIHdlc3ROZWlnaGJvciwgY3VycmVudFNxdWFyZS5uZWlnaGJvcnNbMV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2wgPT09IDEgJiYgcm93ID4gMSkge1xuICAgICAgICAgIGNvbm5lY3QoY3VycmVudFNxdWFyZSwgbm9ydGhOZWlnaGJvciwgY3VycmVudFNxdWFyZS5uZWlnaGJvcnNbM10pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlOyAvLyBtYXplIGdlbmVyYXRpb24gZmluaXNoZWRcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlSHVudEFuZEtpbGwoZ3JpZE9iaiwgZGVsYXkpIHtcbiAgLy8gc2V0IHRoZSBlbnRpcmUgZ3JpZCBhcyBiYXJyaWVyc1xuICBncmlkT2JqLmZpbGxHcmlkKCk7XG5cbiAgY29uc3QgZ3JpZCA9IGdyaWRPYmouZ3JpZDtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG4gIGNvbnN0IHZpc2l0ZWQgPSBbXTtcblxuICAvLyBhZGQgbmVpZ2hib3JzIC0gZGlyZWN0bHkgYWRqYWNlbnQgbmVpZ2hib3JzIGFyZSBza2lwcGVkIHNvIHRoZXkgY2FuIGJlIHdhbGxzIGlmIG5lZWRlZFxuICBmdW5jdGlvbiBnZXRVbnZpc2l0ZWROZWlnaGJvcnMobm9kZSkge1xuICAgIGNvbnN0IG5laWdoYm9ycyA9IFtdO1xuICAgIGNvbnN0IHJvdyA9IG5vZGUucm93IC0gMTtcbiAgICBjb25zdCBjb2wgPSBub2RlLmNvbCAtIDE7XG5cbiAgICBpZiAocm93ID4gMSkge1xuICAgICAgaWYgKCF2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93IC0gMl1bY29sXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgLSAyXVtjb2xdKTsgLy8gdXBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocm93IDwgcm93cyAtIDIpIHtcbiAgICAgIGlmICghdmlzaXRlZC5pbmNsdWRlcyhncmlkW3JvdyArIDJdW2NvbF0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93ICsgMl1bY29sXSk7IC8vIGRvd25cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29sID4gMSkge1xuICAgICAgaWYgKCF2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93XVtjb2wgLSAyXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCAtIDJdKTsgLy8gbGVmdFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2wgPCBjb2xzIC0gMikge1xuICAgICAgaWYgKCF2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93XVtjb2wgKyAyXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCArIDJdKTsgLy8gcmlnaHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VmlzaXRlZE5laWdoYm9ycyhub2RlKSB7XG4gICAgY29uc3QgbmVpZ2hib3JzID0gW107XG4gICAgY29uc3Qgcm93ID0gbm9kZS5yb3cgLSAxO1xuICAgIGNvbnN0IGNvbCA9IG5vZGUuY29sIC0gMTtcblxuICAgIGlmIChyb3cgPiAxKSB7XG4gICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyhncmlkW3JvdyAtIDJdW2NvbF0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93IC0gMl1bY29sXSk7IC8vIHVwXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJvdyA8IHJvd3MgLSAyKSB7XG4gICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyhncmlkW3JvdyArIDJdW2NvbF0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93ICsgMl1bY29sXSk7IC8vIGRvd25cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29sID4gMSkge1xuICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3ddW2NvbCAtIDJdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3Jvd11bY29sIC0gMl0pOyAvLyBsZWZ0XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbCA8IGNvbHMgLSAyKSB7XG4gICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyhncmlkW3Jvd11bY29sICsgMl0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgKyAyXSk7IC8vIHJpZ2h0XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5laWdoYm9ycztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbWx5U2VsZWN0TmVpZ2hib3IobmVpZ2hib3JzKSB7XG4gICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuZWlnaGJvcnMubGVuZ3RoKTtcbiAgICByZXR1cm4gbmVpZ2hib3JzW2luZGV4XTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlU3RhcnRQb2ludCgpIHtcbiAgICAvLyBjaG9vc2UgYSByYW5kb20gcG9pbnQgb24gdGhlIGdyaWQgdG8gc3RhcnQgd2l0aFxuICAgIGxldCByYW5kb21Ob2RlRm91bmQgPSBmYWxzZTtcbiAgICBsZXQgcmFuZG9tRmlyc3ROb2RlID0gbnVsbDtcbiAgICB3aGlsZSAoIXJhbmRvbU5vZGVGb3VuZCkge1xuICAgICAgY29uc3QgcmFuZG9tUm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHJvd3MgLSA0KSkgKyAyO1xuICAgICAgY29uc3QgcmFuZG9tQ29sID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGNvbHMgLSA0KSkgKyAyO1xuICAgICAgaWYgKHJhbmRvbVJvdyAlIDIgIT09IDAgJiYgcmFuZG9tQ29sICUgMiAhPT0gMCkge1xuICAgICAgICByYW5kb21GaXJzdE5vZGUgPSBncmlkW3JhbmRvbVJvd11bcmFuZG9tQ29sXTtcbiAgICAgICAgcmFuZG9tRmlyc3ROb2RlLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgICAgICByYW5kb21Ob2RlRm91bmQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmFuZG9tRmlyc3ROb2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlV2FsbEJldHdlZW4oY3Vyck5vZGUsIG5leHROb2RlKSB7XG4gICAgY29uc3Qgcm93ID0gY3Vyck5vZGUucm93IC0gMTtcbiAgICBjb25zdCBjb2wgPSBjdXJyTm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgIGlmIChncmlkW3JvdyAtIDJdW2NvbF0gPT09IG5leHROb2RlKSB7XG4gICAgICAgIGNvbnN0IHdhbGxCZXR3ZWVuID0gZ3JpZFtyb3cgLSAxXVtjb2xdO1xuICAgICAgICB3YWxsQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJvdyA8IHJvd3MgLSAyKSB7XG4gICAgICBpZiAoZ3JpZFtyb3cgKyAyXVtjb2xdID09PSBuZXh0Tm9kZSkge1xuICAgICAgICBjb25zdCB3YWxsQmV0d2VlbiA9IGdyaWRbcm93ICsgMV1bY29sXTtcbiAgICAgICAgd2FsbEJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjb2wgPiAxKSB7XG4gICAgICBpZiAoZ3JpZFtyb3ddW2NvbCAtIDJdID09PSBuZXh0Tm9kZSkge1xuICAgICAgICBjb25zdCB3YWxsQmV0d2VlbiA9IGdyaWRbcm93XVtjb2wgLSAxXTtcbiAgICAgICAgd2FsbEJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjb2wgPCBjb2xzIC0gMikge1xuICAgICAgaWYgKGdyaWRbcm93XVtjb2wgKyAyXSA9PT0gbmV4dE5vZGUpIHtcbiAgICAgICAgY29uc3Qgd2FsbEJldHdlZW4gPSBncmlkW3Jvd11bY29sICsgMV07XG4gICAgICAgIHdhbGxCZXR3ZWVuLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGN1cnJOb2RlLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgIG5leHROb2RlLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gYWxnb3JpdGhtKCkge1xuICAgIGxldCBjdXJyZW50Tm9kZSA9IGdlbmVyYXRlU3RhcnRQb2ludCgpOyAvLyBnZXQgc3RhcnQgbm9kZVxuXG4gICAgd2hpbGUgKGN1cnJlbnROb2RlKSB7XG4gICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICB9XG4gICAgICB2aXNpdGVkLnB1c2goY3VycmVudE5vZGUpO1xuICAgICAgY29uc3QgbmVpZ2hib3JzID0gZ2V0VW52aXNpdGVkTmVpZ2hib3JzKGN1cnJlbnROb2RlKTtcblxuICAgICAgaWYgKG5laWdoYm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IG5leHROb2RlID0gcmFuZG9tbHlTZWxlY3ROZWlnaGJvcihuZWlnaGJvcnMpO1xuICAgICAgICByZW1vdmVXYWxsQmV0d2VlbihjdXJyZW50Tm9kZSwgbmV4dE5vZGUpO1xuICAgICAgICBjdXJyZW50Tm9kZSA9IG5leHROb2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudE5vZGUgPSBudWxsO1xuXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8IHJvd3MgLSAxOyByb3cgKz0gMikge1xuICAgICAgICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8IGNvbHMgLSAxOyBjb2wgKz0gMikge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGdyaWRbcm93XVtjb2xdO1xuICAgICAgICAgICAgY29uc3QgdmlzaXRlZE5vZGVOZWlnaGJvcnMgPSBnZXRWaXNpdGVkTmVpZ2hib3JzKG5vZGUpO1xuICAgICAgICAgICAgaWYgKCF2aXNpdGVkLmluY2x1ZGVzKG5vZGUpICYmIHZpc2l0ZWROb2RlTmVpZ2hib3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgY3VycmVudE5vZGUgPSBub2RlO1xuICAgICAgICAgICAgICBjb25zdCByYW5kb21seVNlbGVjdGVkTmVpZ2hib3IgPSByYW5kb21seVNlbGVjdE5laWdoYm9yKHZpc2l0ZWROb2RlTmVpZ2hib3JzKTtcbiAgICAgICAgICAgICAgcmVtb3ZlV2FsbEJldHdlZW4oY3VycmVudE5vZGUsIHJhbmRvbWx5U2VsZWN0ZWROZWlnaGJvcik7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY3VycmVudE5vZGUpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBhbGdvcml0aG0oKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlUHJpbXMoZ3JpZE9iaiwgZGVsYXkpIHtcbiAgLy8gc2V0IHRoZSBlbnRpcmUgZ3JpZCBhcyBiYXJyaWVyc1xuICBncmlkT2JqLmZpbGxHcmlkKCk7XG5cbiAgY29uc3QgZ3JpZCA9IGdyaWRPYmouZ3JpZDtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG4gIGNvbnN0IGZyb250aWVyID0gW107XG4gIGNvbnN0IHZpc2l0ZWQgPSBuZXcgU2V0KCk7XG5cbiAgLy8gYWRkIG5laWdoYm9ycyAtIGRpcmVjdGx5IGFkamFjZW50IG5laWdoYm9ycyBhcmUgc2tpcHBlZCBzbyB0aGV5IGNhbiBiZSB3YWxscyBpZiBuZWVkZWRcbiAgZnVuY3Rpb24gZ2V0TmVpZ2hib3JzKG5vZGUpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBjb25zdCByb3cgPSBub2RlLnJvdyAtIDE7XG4gICAgY29uc3QgY29sID0gbm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93IC0gMl1bY29sXSk7IC8vIHVwXG5cbiAgICBpZiAocm93IDwgcm93cyAtIDIpIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93ICsgMl1bY29sXSk7IC8vIGRvd25cblxuICAgIGlmIChjb2wgPiAxKSBuZWlnaGJvcnMucHVzaChncmlkW3Jvd11bY29sIC0gMl0pOyAvLyBsZWZ0XG5cbiAgICBpZiAoY29sIDwgY29scyAtIDIpIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgKyAyXSk7IC8vIHJpZ2h0XG5cbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0V2FsbEJldHdlZW4obm9kZSwgbmVpZ2hib3IpIHtcbiAgICBjb25zdCByb3cgPSBub2RlLnJvdyAtIDE7XG4gICAgY29uc3QgY29sID0gbm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgIGlmIChncmlkW3JvdyAtIDJdW2NvbF0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3cgLSAxXVtjb2xdOyAvLyB1cFxuICAgIH1cbiAgICBpZiAocm93IDwgcm93cyAtIDIpIHtcbiAgICAgIGlmIChncmlkW3JvdyArIDJdW2NvbF0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3cgKyAxXVtjb2xdOyAvLyBkb3duXG4gICAgfVxuICAgIGlmIChjb2wgPiAxKSB7XG4gICAgICBpZiAoZ3JpZFtyb3ddW2NvbCAtIDJdID09PSBuZWlnaGJvcikgcmV0dXJuIGdyaWRbcm93XVtjb2wgLSAxXTsgLy8gbGVmdFxuICAgIH1cbiAgICBpZiAoY29sIDwgY29scyAtIDIpIHtcbiAgICAgIGlmIChncmlkW3Jvd11bY29sICsgMl0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3ddW2NvbCArIDFdOyAvLyByaWdodFxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gY29ubmVjdChub2RlMSwgbm9kZTIsIHdhbGxCZXR3ZWVuKSB7XG4gICAgbm9kZTEuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgbm9kZTIuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgd2FsbEJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gIH1cblxuICAvLyBjaG9vc2UgYSByYW5kb20gcG9pbnQgb24gdGhlIGdyaWQgdG8gc3RhcnQgd2l0aFxuICBsZXQgcmFuZG9tRmlyc3ROb2RlID0gbnVsbDtcbiAgd2hpbGUgKHJhbmRvbUZpcnN0Tm9kZSA9PT0gbnVsbCkge1xuICAgIGNvbnN0IHJhbmRvbVJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChyb3dzIC0gNCkpICsgMjtcbiAgICBjb25zdCByYW5kb21Db2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoY29scyAtIDQpKSArIDI7XG4gICAgaWYgKHJhbmRvbVJvdyAlIDIgIT09IDAgJiYgcmFuZG9tQ29sICUgMiAhPT0gMCkge1xuICAgICAgcmFuZG9tRmlyc3ROb2RlID0gZ3JpZFtyYW5kb21Sb3ddW3JhbmRvbUNvbF07XG4gICAgICByYW5kb21GaXJzdE5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICB2aXNpdGVkLmFkZChyYW5kb21GaXJzdE5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXJ0Tm9kZU5laWdoYm9ycyA9IGdldE5laWdoYm9ycyhyYW5kb21GaXJzdE5vZGUpO1xuICBzdGFydE5vZGVOZWlnaGJvcnMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgIGlmIChub2RlKSB7XG4gICAgICBmcm9udGllci5wdXNoKG5vZGUpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2hpbGUgKGZyb250aWVyLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgIH1cbiAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGZyb250aWVyLmxlbmd0aCk7XG4gICAgY29uc3QgcmFuZG9tRnJvbnRpZXJOb2RlID0gZnJvbnRpZXJbcmFuZG9tSW5kZXhdO1xuICAgIGNvbnN0IGZyb250aWVyTmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKHJhbmRvbUZyb250aWVyTm9kZSk7XG5cbiAgICAvLyBmaW5kIG91dCB3aGljaCAnaW4nIG5vZGVzIChwYXJ0IG9mIG1hemUpIGFyZSBhZGphY2VudFxuICAgIGNvbnN0IGFkamFjZW50SW5zID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcm9udGllck5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZpc2l0ZWQuaGFzKGZyb250aWVyTmVpZ2hib3JzW2ldKSkge1xuICAgICAgICBhZGphY2VudElucy5wdXNoKGZyb250aWVyTmVpZ2hib3JzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjaG9vc2UgYSByYW5kb20gYWRqYWNlbnQgbm9kZSBhbmQgY29ubmVjdCB0aGF0IHdpdGggdGhlIGZyb250aWVyIG5vZGVcbiAgICBjb25zdCByYW5kb21BZGphY2VudEluID0gYWRqYWNlbnRJbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYWRqYWNlbnRJbnMubGVuZ3RoKV07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGphY2VudElucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFkamFjZW50SW5zW2ldID09PSByYW5kb21BZGphY2VudEluKSB7XG4gICAgICAgIGNvbnN0IHdhbGxCZXR3ZWVuID0gZ2V0V2FsbEJldHdlZW4ocmFuZG9tRnJvbnRpZXJOb2RlLCByYW5kb21BZGphY2VudEluKTtcbiAgICAgICAgY29uc3QgaW5kZXhUb1NwbGljZSA9IGZyb250aWVyLmluZGV4T2YocmFuZG9tRnJvbnRpZXJOb2RlKTtcbiAgICAgICAgY29ubmVjdChyYW5kb21Gcm9udGllck5vZGUsIHJhbmRvbUFkamFjZW50SW4sIHdhbGxCZXR3ZWVuKTtcbiAgICAgICAgdmlzaXRlZC5hZGQocmFuZG9tRnJvbnRpZXJOb2RlKTtcbiAgICAgICAgZnJvbnRpZXIuc3BsaWNlKGluZGV4VG9TcGxpY2UsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdldCB0aGUgbmVpZ2hib3JzIG9mIHRoZSBmcm9udGllciBub2RlIGFuZCBhZGQgdGhlbSB0byBmcm9udGllciBsaXN0XG4gICAgY29uc3QgbmVpZ2hib3JzVG9BZGQgPSBnZXROZWlnaGJvcnMocmFuZG9tRnJvbnRpZXJOb2RlKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5laWdoYm9yc1RvQWRkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobmVpZ2hib3JzVG9BZGRbaV0pIHtcbiAgICAgICAgaWYgKCF2aXNpdGVkLmhhcyhuZWlnaGJvcnNUb0FkZFtpXSkgJiYgIWZyb250aWVyLmluY2x1ZGVzKG5laWdoYm9yc1RvQWRkW2ldKSkge1xuICAgICAgICAgIGZyb250aWVyLnB1c2gobmVpZ2hib3JzVG9BZGRbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcmFuZG9tTWFwKGdyaWRPYmosIGRlbGF5KSB7XG4gIGNvbnN0IGdyaWQgPSBncmlkT2JqLmdyaWQ7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCByb3dzOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgaWYgKHJhbmRvbSA8IDAuMykge1xuICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiByZWN1cnNpdmVEaXZpc2lvbihncmlkT2JqLCBkZWxheSkge1xuICBjb25zdCBncmlkID0gZ3JpZE9iai5ncmlkO1xuICBjb25zdCByb3dzID0gZ3JpZC5sZW5ndGg7XG4gIGNvbnN0IGNvbHMgPSBncmlkWzBdLmxlbmd0aDtcbiAgbGV0IGlzRmluaXNoZWQgPSBmYWxzZTsgLy8gaXMgcmVjdXJzaXZlIHByb2Nlc3MgZmluaXNoZWQ/XG5cbiAgZnVuY3Rpb24gcmFuZG9tRXZlbihhLCBiKSB7XG4gICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGIgLSBhICsgMSkpICsgYTtcbiAgICByZXR1cm4gcmFuZG9tICUgMiA9PT0gMCA/IHJhbmRvbSA6IHJhbmRvbSArIDE7XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21PZGQoYSwgYikge1xuICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChiIC0gYSArIDEpKSArIGE7XG4gICAgcmV0dXJuIHJhbmRvbSAlIDIgIT09IDAgPyByYW5kb20gOiByYW5kb20gKyAxO1xuICB9XG5cbiAgLy8gY2hvb3NlIHRvIHBsYWNlIHdhbGwgdmVydGljYWxseSBvciBob3Jpem9udGFsbHlcbiAgZnVuY3Rpb24gY2hvb3NlT3JpZW50YXRpb24oc3RhcnRSb3csIGVuZFJvdywgc3RhcnRDb2wsIGVuZENvbCkge1xuICAgIGNvbnN0IHdpZHRoID0gZW5kQ29sIC0gc3RhcnRDb2w7XG4gICAgY29uc3QgaGVpZ2h0ID0gZW5kUm93IC0gc3RhcnRSb3c7XG4gICAgaWYgKHdpZHRoID4gaGVpZ2h0KSByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICBpZiAod2lkdGggPCBoZWlnaHQpIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgaWYgKHdpZHRoID09PSBoZWlnaHQpIHtcbiAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICAgICAgcmV0dXJuIHJhbmRvbSA9PT0gMCA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gc2V0IGVkZ2VzIG9mIGdyaWQgYXMgYmFycmllcnNcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcm93czsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBjb2xzOyBjb2wrKykge1xuICAgICAgaWYgKHJvdyA9PT0gMCB8fCByb3cgPT09IHJvd3MgLSAxIHx8IGNvbCA9PT0gMCB8fCBjb2wgPT09IGNvbHMgLSAxKSB7XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gdGhlIHJlY3Vyc2l2ZSBmdW5jdGlvbiB0byBkaXZpZGUgdGhlIGdyaWRcbiAgYXN5bmMgZnVuY3Rpb24gZGl2aWRlKHN0YXJ0Um93LCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpIHtcbiAgICBpZiAoZW5kQ29sIC0gc3RhcnRDb2wgPCAxIHx8IGVuZFJvdyAtIHN0YXJ0Um93IDwgMSkge1xuICAgICAgLy8gYmFzZSBjYXNlIGlmIHN1Yi1tYXplIGlzIHRvbyBzbWFsbFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdhbGxSb3cgPSByYW5kb21FdmVuKHN0YXJ0Um93ICsgMSwgZW5kUm93IC0gMSk7XG4gICAgY29uc3Qgd2FsbENvbCA9IHJhbmRvbUV2ZW4oc3RhcnRDb2wgKyAxLCBlbmRDb2wgLSAxKTtcblxuICAgIGNvbnN0IHBhc3NhZ2VSb3cgPSByYW5kb21PZGQoc3RhcnRSb3csIGVuZFJvdyk7XG4gICAgY29uc3QgcGFzc2FnZUNvbCA9IHJhbmRvbU9kZChzdGFydENvbCwgZW5kQ29sKTtcblxuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gY2hvb3NlT3JpZW50YXRpb24oc3RhcnRSb3csIGVuZFJvdywgc3RhcnRDb2wsIGVuZENvbCk7XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgLy8gbWFrZSBhIGhvcml6b250YWwgd2FsbFxuICAgICAgZm9yIChsZXQgY29sID0gc3RhcnRDb2w7IGNvbCA8PSBlbmRDb2w7IGNvbCsrKSB7XG4gICAgICAgIGlmIChjb2wgIT09IHBhc3NhZ2VDb2wpIHtcbiAgICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBncmlkW3dhbGxSb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIC8vIG1ha2UgYSB2ZXJ0aWNhbCB3YWxsXG4gICAgICBmb3IgKGxldCByb3cgPSBzdGFydFJvdzsgcm93IDw9IGVuZFJvdzsgcm93KyspIHtcbiAgICAgICAgaWYgKHJvdyAhPT0gcGFzc2FnZVJvdykge1xuICAgICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGdyaWRbcm93XVt3YWxsQ29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgd2FsbFJvdyAtIDEsIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgICAgYXdhaXQgZGl2aWRlKHdhbGxSb3cgKyAxLCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgZW5kUm93LCB3YWxsQ29sICsgMSwgZW5kQ29sKTtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgd2FsbENvbCAtIDEpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgdGhlIGxhc3QgcmVjdXJzaXZlIGNhbGxcbiAgICBpZiAoc3RhcnRSb3cgPT09IDEgJiYgZW5kUm93ID09PSByb3dzIC0gMiAmJiBzdGFydENvbCA9PT0gMSAmJiBlbmRDb2wgPT09IGNvbHMgLSAyKSB7XG4gICAgICBpc0ZpbmlzaGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBhd2FpdCBkaXZpZGUoMSwgcm93cyAtIDIsIDEsIGNvbHMgLSAyKTtcblxuICByZXR1cm4gaXNGaW5pc2hlZDsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzaWRld2luZGVyKGdyaWRPYmosIGRlbGF5KSB7XG4gIGdyaWRPYmouZmlsbEdyaWQoKTsgLy8gc2V0IHRoZSBncmlkIGFzIHdhbGxzXG5cbiAgY29uc3QgZ3JpZCA9IGdyaWRPYmouZ3JpZDtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG5cbiAgLy8gbGVhdmUgZmlyc3Qgcm93IGVtcHR5XG4gIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgaWYgKGNvbCAhPT0gMCAmJiBjb2wgIT09IGNvbHMgLSAxKSB7XG4gICAgICBncmlkWzFdW2NvbF0uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgcm93ID0gMTsgcm93IDwgcm93czsgcm93ICs9IDIpIHtcbiAgICBsZXQgcnVuID0gW107XG4gICAgZm9yIChsZXQgY29sID0gMTsgY29sIDwgY29sczsgY29sICs9IDIpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnROb2RlID0gZ3JpZFtyb3ddW2NvbF07XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgIHJ1bi5wdXNoKGN1cnJlbnROb2RlKTtcblxuICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjYgJiYgY29sICE9PSBjb2xzIC0gMikge1xuICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50Tm9kZS5uZWlnaGJvcnNbMF0uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICB9IGVsc2UgaWYgKHJ1bi5sZW5ndGggPiAwICYmIHJvdyA+IDEpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBydW4ubGVuZ3RoKTtcbiAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgcnVuW3JhbmRvbUluZGV4XS5uZWlnaGJvcnNbM10uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICAgIHJ1biA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJpbXBvcnQgRG9tSGFuZGxlciBmcm9tICcuL2RvbWhhbmRsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2RlIHtcbiAgY29uc3RydWN0b3Iocm93LCBjb2wsIHRvdGFsUm93cywgdG90YWxDb2xzLCBncmlkLCBub2RlU2l6ZSkge1xuICAgIHRoaXMubm9kZVNpemUgPSBudWxsOyAvLyBob2xkcyBweCB2YWx1ZSBvZiBub2RlIHdpZHRoIGFuZCBoZWlnaHRcbiAgICB0aGlzLnNldE5vZGVXaWR0aChub2RlU2l6ZSk7XG4gICAgdGhpcy50b3RhbFJvd3MgPSB0b3RhbFJvd3M7XG4gICAgdGhpcy50b3RhbENvbHMgPSB0b3RhbENvbHM7XG4gICAgdGhpcy5yb3cgPSByb3c7XG4gICAgdGhpcy5jb2wgPSBjb2w7XG4gICAgdGhpcy55ID0gdGhpcy5yb3cgKiB0aGlzLm5vZGVTaXplO1xuICAgIHRoaXMueCA9IHRoaXMuY29sICogdGhpcy5ub2RlU2l6ZTtcbiAgICB0aGlzLm5vZGVUeXBlID0gJ2VtcHR5JzsgLy8gdXNlZCB0byB1cGRhdGUgc3F1YXJlIGRpc3BsYXkgb24gZG9tIGUuZyBzdGFydCwgZW5kIG9yIGJhcnJpZXJcbiAgICB0aGlzLm5laWdoYm9ycyA9IFtdO1xuICAgIHRoaXMucHJldmlvdXNOb2RlID0gbnVsbDtcbiAgICB0aGlzLmdyaWQgPSBncmlkO1xuXG4gICAgLy8gdXNlZCBmb3IgQXN0YXIgYW5kIERpanNrdHJhXG4gICAgdGhpcy5mID0gMDtcbiAgICB0aGlzLmcgPSAwO1xuICAgIHRoaXMuaCA9IDA7XG4gIH1cblxuICAvLyBhZGp1c3Qgc2l6ZSBvZiBub2RlIGluIHB4XG4gIHNldE5vZGVXaWR0aChub2RlU2l6ZSkge1xuICAgIGlmIChub2RlU2l6ZSA9PT0gJ3NtYWxsJykge1xuICAgICAgdGhpcy5ub2RlU2l6ZSA9IDUwO1xuICAgIH0gZWxzZSBpZiAobm9kZVNpemUgPT09ICdtZWRpdW0nKSB7XG4gICAgICB0aGlzLm5vZGVTaXplID0gMzA7XG4gICAgfSBlbHNlIGlmIChub2RlU2l6ZSA9PT0gJ2xhcmdlJykge1xuICAgICAgdGhpcy5ub2RlU2l6ZSA9IDIwO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNoYW5nZSBub2RlIHR5cGUgZS5nIGJhcnJpZXIsIHN0YXJ0LCBlbmQsIG9wZW4tbGlzdCwgY2xvc2VkLWxpc3RcbiAgc2V0Tm9kZVR5cGUobmV3Tm9kZVR5cGUpIHtcbiAgICBEb21IYW5kbGVyLmRpc3BsYXlOb2RlKHRoaXMsIHRoaXMubm9kZVR5cGUsIG5ld05vZGVUeXBlLCB0aGlzLmdyaWQpO1xuICAgIHRoaXMubm9kZVR5cGUgPSBuZXdOb2RlVHlwZTtcbiAgfVxuXG4gIC8vIGNhbGMgZiwgZyBhbmQgaCBzY29yZXNcbiAgY2FsY1Njb3JlcyhzdGFydE5vZGUsIGVuZE5vZGUpIHtcbiAgICB0aGlzLmcgPSBNYXRoLmFicyh0aGlzLnggLSBzdGFydE5vZGUueCkgKyBNYXRoLmFicyh0aGlzLnkgLSBzdGFydE5vZGUueSk7XG4gICAgdGhpcy5oID0gTWF0aC5hYnModGhpcy54IC0gZW5kTm9kZS54KSArIE1hdGguYWJzKHRoaXMueSAtIGVuZE5vZGUueSk7XG4gICAgdGhpcy5mID0gdGhpcy5nICsgdGhpcy5oO1xuICAgIHJldHVybiB0aGlzLmY7XG4gIH1cblxuICAvLyBzZXQgbmVpZ2hib3JzIGZvciBjdXJyZW50IG5vZGUgKG5vIGRpYWdvbmFscylcbiAgc2V0TmVpZ2hib3JzKGdyaWQpIHtcbiAgICBjb25zdCB0ZW1wUm93ID0gdGhpcy5yb3cgLSAxO1xuICAgIGNvbnN0IHRlbXBDb2wgPSB0aGlzLmNvbCAtIDE7XG5cbiAgICBpZiAodGVtcENvbCA8IHRoaXMudG90YWxDb2xzIC0gMSkge1xuICAgICAgLy8gcmlnaHRcbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93XVt0ZW1wQ29sICsgMV0pO1xuICAgIH1cblxuICAgIGlmICh0ZW1wQ29sID4gMCkge1xuICAgICAgLy8gbGVmdFxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3ddW3RlbXBDb2wgLSAxXSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbXBSb3cgPCB0aGlzLnRvdGFsUm93cyAtIDEpIHtcbiAgICAgIC8vIGRvd25cbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93ICsgMV1bdGVtcENvbF0pO1xuICAgIH1cblxuICAgIGlmICh0ZW1wUm93ID4gMCkge1xuICAgICAgLy8gdXBcbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93IC0gMV1bdGVtcENvbF0pO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vc2Nzcy9tYWluLnNjc3MnO1xuaW1wb3J0IGxvYWQgZnJvbSAnLi9tYWluaGFuZGxlcic7XG5cbmxvYWQoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
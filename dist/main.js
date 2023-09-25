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

/***/ "./src/algorithms/bidirectional.js":
/*!*****************************************!*\
  !*** ./src/algorithms/bidirectional.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ bidirectional)
/* harmony export */ });
async function bidirectional(startNode, endNode, delay) {
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
      if (joinedFinalPath[i].nodeType === 'start' || joinedFinalPath[i].nodeType === 'end')
        continue;
      await new Promise((resolve) => setTimeout(resolve, 30));
      joinedFinalPath[i].setNodeType('final-path');
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
/* harmony import */ var _algorithms_bidirectional__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./algorithms/bidirectional */ "./src/algorithms/bidirectional.js");











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

async function runBidirectional() {
  const startNode = gridObj.start.node;
  const endNode = gridObj.end.node;

  try {
    running[0] = true;
    const pathFound = await (0,_algorithms_bidirectional__WEBPACK_IMPORTED_MODULE_9__["default"])(startNode, endNode, pathfindingSpeed);

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
    if (selectedAlgorithm === 'Bidirectional') done = await runBidirectional();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDdEVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTjBCO0FBQ087O0FBRWpDLHdEQUFJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9zY3NzL21haW4uc2NzcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2FsZ29yaXRobXMvYXN0YXIuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9hbGdvcml0aG1zL2JpZGlyZWN0aW9uYWwuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9hbGdvcml0aG1zL2RpamtzdHJhLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvZG9taGFuZGxlci5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2dyaWQuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYWluaGFuZGxlci5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL2JpbmFyeXRyZWUuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9odW50YW5ka2lsbC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL3ByaW1zLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvcmFuZG9tbWFwLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvcmVjdXJzaXZlZGl2aXNpb24uanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9zaWRld2luZGVyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbm9kZS5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhc3RhcihzdGFydE5vZGUsIGVuZE5vZGUsIGRlbGF5KSB7XG4gIGNvbnN0IG9wZW5MaXN0ID0gW107XG4gIGNvbnN0IGNsb3NlZExpc3QgPSBbXTtcbiAgY29uc3QgZmluYWxQYXRoID0gW107XG5cbiAgZnVuY3Rpb24gcmVtb3ZlRnJvbUFycihub2RlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcGVuTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG9wZW5MaXN0W2ldID09PSBub2RlKSB7XG4gICAgICAgIG9wZW5MaXN0LnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBkaXNwbGF5RmluYWxQYXRoKHBhdGgpIHtcbiAgICBmb3IgKGxldCBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKHBhdGhbaV0ubm9kZVR5cGUgPT09ICdzdGFydCcgfHwgcGF0aFtpXS5ub2RlVHlwZSA9PT0gJ2VuZCcpIGNvbnRpbnVlO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMzApKTtcbiAgICAgIHBhdGhbaV0uc2V0Tm9kZVR5cGUoJ2ZpbmFsLXBhdGgnKTtcbiAgICB9XG4gIH1cblxuICBvcGVuTGlzdC5wdXNoKHN0YXJ0Tm9kZSk7XG5cbiAgYXN5bmMgZnVuY3Rpb24gYWxnb3JpdGhtKCkge1xuICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgfVxuICAgIGxldCBjdXJyZW50Tm9kZSA9IG51bGw7XG4gICAgbGV0IGxvd2VzdEYgPSBJbmZpbml0eTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wZW5MaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBvcGVuTGlzdFtpXS5jYWxjU2NvcmVzKHN0YXJ0Tm9kZSwgZW5kTm9kZSk7XG4gICAgICBpZiAob3Blbkxpc3RbaV0uZiA8IGxvd2VzdEYpIHtcbiAgICAgICAgbG93ZXN0RiA9IG9wZW5MaXN0W2ldLmY7XG4gICAgICAgIGN1cnJlbnROb2RlID0gb3Blbkxpc3RbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnROb2RlID09PSBlbmROb2RlKSB7XG4gICAgICBsZXQgdGVtcCA9IGN1cnJlbnROb2RlO1xuICAgICAgZmluYWxQYXRoLnB1c2godGVtcCk7XG4gICAgICB3aGlsZSAodGVtcC5wcmV2aW91c05vZGUpIHtcbiAgICAgICAgZmluYWxQYXRoLnB1c2godGVtcC5wcmV2aW91c05vZGUpO1xuICAgICAgICB0ZW1wID0gdGVtcC5wcmV2aW91c05vZGU7XG4gICAgICB9XG4gICAgICBkaXNwbGF5RmluYWxQYXRoKGZpbmFsUGF0aCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjbG9zZWRMaXN0LnB1c2goY3VycmVudE5vZGUpO1xuICAgIGlmIChjdXJyZW50Tm9kZS5ub2RlVHlwZSAhPT0gJ3N0YXJ0JyAmJiBjdXJyZW50Tm9kZS5ub2RlVHlwZSAhPT0gJ2VuZCcpIHtcbiAgICAgIGN1cnJlbnROb2RlLnNldE5vZGVUeXBlKCdjbG9zZWQtbGlzdCcpO1xuICAgIH1cbiAgICByZW1vdmVGcm9tQXJyKGN1cnJlbnROb2RlKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudE5vZGUubmVpZ2hib3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjdXJyTmVpZ2hib3IgPSBjdXJyZW50Tm9kZS5uZWlnaGJvcnNbaV07XG5cbiAgICAgIGlmIChjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdiYXJyaWVyJyAmJiAhY2xvc2VkTGlzdC5pbmNsdWRlcyhjdXJyTmVpZ2hib3IpKSB7XG4gICAgICAgIGNvbnN0IHRlbXBHID0gY3VycmVudE5vZGUuZyArIDE7XG4gICAgICAgIGlmIChvcGVuTGlzdC5pbmNsdWRlcyhjdXJyTmVpZ2hib3IpKSB7XG4gICAgICAgICAgaWYgKHRlbXBHIDwgY3Vyck5laWdoYm9yLmcpIHtcbiAgICAgICAgICAgIGN1cnJOZWlnaGJvci5nID0gdGVtcEc7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1cnJOZWlnaGJvci5nID0gdGVtcEc7XG4gICAgICAgICAgb3Blbkxpc3QucHVzaChjdXJyTmVpZ2hib3IpO1xuICAgICAgICAgIGlmIChjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgY3Vyck5laWdoYm9yLm5vZGVUeXBlICE9PSAnZW5kJykge1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLnNldE5vZGVUeXBlKCdvcGVuLWxpc3QnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyTmVpZ2hib3IucHJldmlvdXNOb2RlID0gY3VycmVudE5vZGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wZW5MaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBhbGdvcml0aG0oKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYWxnb3JpdGhtKCk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBiaWRpcmVjdGlvbmFsKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgZGVsYXkpIHtcbiAgY29uc3QgdmlzaXRlZEZvcndhcmRzID0gbmV3IFNldCgpO1xuICBjb25zdCB2aXNpdGVkQmFja3dhcmRzID0gbmV3IFNldCgpO1xuXG4gIGNvbnN0IHF1ZXVlRm9yd2FyZHMgPSBbXTtcbiAgY29uc3QgcXVldWVCYWNrd2FyZHMgPSBbXTtcblxuICBhc3luYyBmdW5jdGlvbiBkaXNwYXlGaW5hbFBhdGgobWVldGluZ1BvaW50KSB7XG4gICAgY29uc3QgZmluYWxQYXRoRm9yd2FyZCA9IFtdO1xuICAgIGNvbnN0IGZpbmFsUGF0aEJhY2t3YXJkID0gW107XG4gICAgY29uc3Qgam9pbmVkRmluYWxQYXRoID0gW107XG5cbiAgICBsZXQgbm9kZSA9IG51bGw7XG4gICAgLy8gZ2V0IHBhdGggZnJvbSBzdGFydCB0byBtZWV0aW5nIHBvaW50XG4gICAgaWYgKHZpc2l0ZWRGb3J3YXJkcy5oYXMobWVldGluZ1BvaW50Lm5laWdoYm9yc1swXSkpIHtcbiAgICAgIG5vZGUgPSBtZWV0aW5nUG9pbnQubmVpZ2hib3JzWzBdOyAvLyByaWdodFxuICAgIH0gZWxzZSBpZiAodmlzaXRlZEZvcndhcmRzLmhhcyhtZWV0aW5nUG9pbnQubmVpZ2hib3JzWzFdKSkge1xuICAgICAgbm9kZSA9IG1lZXRpbmdQb2ludC5uZWlnaGJvcnNbMV07IC8vIGxlZnRcbiAgICB9IGVsc2UgaWYgKHZpc2l0ZWRGb3J3YXJkcy5oYXMobWVldGluZ1BvaW50Lm5laWdoYm9yc1syXSkpIHtcbiAgICAgIG5vZGUgPSBtZWV0aW5nUG9pbnQubmVpZ2hib3JzWzJdOyAvLyBkb3duXG4gICAgfSBlbHNlIGlmICh2aXNpdGVkRm9yd2FyZHMuaGFzKG1lZXRpbmdQb2ludC5uZWlnaGJvcnNbM10pKSB7XG4gICAgICBub2RlID0gbWVldGluZ1BvaW50Lm5laWdoYm9yc1szXTsgLy8gdXBcbiAgICB9XG4gICAgZmluYWxQYXRoRm9yd2FyZC5wdXNoKG5vZGUpO1xuICAgIHdoaWxlIChub2RlLnByZXZpb3VzTm9kZSkge1xuICAgICAgZmluYWxQYXRoRm9yd2FyZC5wdXNoKG5vZGUucHJldmlvdXNOb2RlKTtcbiAgICAgIG5vZGUgPSBub2RlLnByZXZpb3VzTm9kZTtcbiAgICB9XG5cbiAgICAvLyBnZXQgcGF0aCBmcm9tIG1lZXRpbmcgcG9pbnQgdG8gZW5kXG4gICAgaWYgKHZpc2l0ZWRCYWNrd2FyZHMuaGFzKG1lZXRpbmdQb2ludC5uZWlnaGJvcnNbMF0pKSB7XG4gICAgICBub2RlID0gbWVldGluZ1BvaW50Lm5laWdoYm9yc1swXTsgLy8gcmlnaHRcbiAgICB9IGVsc2UgaWYgKHZpc2l0ZWRCYWNrd2FyZHMuaGFzKG1lZXRpbmdQb2ludC5uZWlnaGJvcnNbMV0pKSB7XG4gICAgICBub2RlID0gbWVldGluZ1BvaW50Lm5laWdoYm9yc1sxXTsgLy8gbGVmdFxuICAgIH0gZWxzZSBpZiAodmlzaXRlZEJhY2t3YXJkcy5oYXMobWVldGluZ1BvaW50Lm5laWdoYm9yc1syXSkpIHtcbiAgICAgIG5vZGUgPSBtZWV0aW5nUG9pbnQubmVpZ2hib3JzWzJdOyAvLyBkb3duXG4gICAgfSBlbHNlIGlmICh2aXNpdGVkQmFja3dhcmRzLmhhcyhtZWV0aW5nUG9pbnQubmVpZ2hib3JzWzNdKSkge1xuICAgICAgbm9kZSA9IG1lZXRpbmdQb2ludC5uZWlnaGJvcnNbM107IC8vIHVwXG4gICAgfVxuICAgIGZpbmFsUGF0aEJhY2t3YXJkLnB1c2gobm9kZSk7XG4gICAgd2hpbGUgKG5vZGUucHJldmlvdXNOb2RlKSB7XG4gICAgICBmaW5hbFBhdGhCYWNrd2FyZC5wdXNoKG5vZGUucHJldmlvdXNOb2RlKTtcbiAgICAgIG5vZGUgPSBub2RlLnByZXZpb3VzTm9kZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gZmluYWxQYXRoRm9yd2FyZC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgam9pbmVkRmluYWxQYXRoLnB1c2goZmluYWxQYXRoRm9yd2FyZFtpXSk7XG4gICAgfVxuICAgIGpvaW5lZEZpbmFsUGF0aC5wdXNoKG1lZXRpbmdQb2ludCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaW5hbFBhdGhCYWNrd2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgam9pbmVkRmluYWxQYXRoLnB1c2goZmluYWxQYXRoQmFja3dhcmRbaV0pO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgam9pbmVkRmluYWxQYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoam9pbmVkRmluYWxQYXRoW2ldLm5vZGVUeXBlID09PSAnc3RhcnQnIHx8IGpvaW5lZEZpbmFsUGF0aFtpXS5ub2RlVHlwZSA9PT0gJ2VuZCcpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMzApKTtcbiAgICAgIGpvaW5lZEZpbmFsUGF0aFtpXS5zZXROb2RlVHlwZSgnZmluYWwtcGF0aCcpO1xuICAgIH1cbiAgfVxuXG4gIHF1ZXVlRm9yd2FyZHMucHVzaChzdGFydE5vZGUpO1xuICB2aXNpdGVkRm9yd2FyZHMuYWRkKHN0YXJ0Tm9kZSk7XG5cbiAgcXVldWVCYWNrd2FyZHMucHVzaChlbmROb2RlKTtcbiAgdmlzaXRlZEJhY2t3YXJkcy5hZGQoZW5kTm9kZSk7XG5cbiAgd2hpbGUgKHF1ZXVlRm9yd2FyZHMubGVuZ3RoID4gMCAmJiBxdWV1ZUJhY2t3YXJkcy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICB9XG5cbiAgICAvLyBmb3J3YXJkc1xuICAgIGNvbnN0IGN1cnJOb2RlRm9yd2FyZCA9IHF1ZXVlRm9yd2FyZHMuc2hpZnQoKTtcbiAgICBpZiAoY3Vyck5vZGVGb3J3YXJkICE9PSBzdGFydE5vZGUpIHtcbiAgICAgIGN1cnJOb2RlRm9yd2FyZC5zZXROb2RlVHlwZSgnY2xvc2VkLWxpc3QnKTtcbiAgICB9XG4gICAgY29uc3QgbmVpZ2hib3JzRm9yd2FyZCA9IGN1cnJOb2RlRm9yd2FyZC5uZWlnaGJvcnM7XG4gICAgbGV0IGN1cnJOZWlnaGJvckZvcndhcmQgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZWlnaGJvcnNGb3J3YXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjdXJyTmVpZ2hib3JGb3J3YXJkID0gbmVpZ2hib3JzRm9yd2FyZFtpXTtcbiAgICAgIGlmICghdmlzaXRlZEZvcndhcmRzLmhhcyhjdXJyTmVpZ2hib3JGb3J3YXJkKSAmJiBjdXJyTmVpZ2hib3JGb3J3YXJkLm5vZGVUeXBlICE9PSAnYmFycmllcicpIHtcbiAgICAgICAgcXVldWVGb3J3YXJkcy5wdXNoKGN1cnJOZWlnaGJvckZvcndhcmQpO1xuICAgICAgICBjdXJyTmVpZ2hib3JGb3J3YXJkLnByZXZpb3VzTm9kZSA9IGN1cnJOb2RlRm9yd2FyZDtcbiAgICAgICAgY3Vyck5laWdoYm9yRm9yd2FyZC5zZXROb2RlVHlwZSgnb3Blbi1saXN0Jyk7XG4gICAgICAgIHZpc2l0ZWRGb3J3YXJkcy5hZGQoY3Vyck5laWdoYm9yRm9yd2FyZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2aXNpdGVkQmFja3dhcmRzLmhhcyhjdXJyTmVpZ2hib3JGb3J3YXJkKSkge1xuICAgICAgICBkaXNwYXlGaW5hbFBhdGgoY3Vyck5laWdoYm9yRm9yd2FyZCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGJhY2t3YXJkc1xuICAgIGNvbnN0IGN1cnJOb2RlQmFja3dhcmQgPSBxdWV1ZUJhY2t3YXJkcy5zaGlmdCgpO1xuICAgIGlmIChjdXJyTm9kZUJhY2t3YXJkICE9PSBlbmROb2RlKSB7XG4gICAgICBjdXJyTm9kZUJhY2t3YXJkLnNldE5vZGVUeXBlKCdjbG9zZWQtbGlzdCcpO1xuICAgIH1cbiAgICBjb25zdCBuZWlnaGJvcnNCYWNrd2FyZCA9IGN1cnJOb2RlQmFja3dhcmQubmVpZ2hib3JzO1xuICAgIGxldCBjdXJyTmVpZ2hib3JCYWNrd2FyZCA9IG51bGw7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5laWdoYm9yc0JhY2t3YXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjdXJyTmVpZ2hib3JCYWNrd2FyZCA9IG5laWdoYm9yc0JhY2t3YXJkW2ldO1xuICAgICAgaWYgKFxuICAgICAgICAhdmlzaXRlZEJhY2t3YXJkcy5oYXMoY3Vyck5laWdoYm9yQmFja3dhcmQpICYmXG4gICAgICAgIGN1cnJOZWlnaGJvckJhY2t3YXJkLm5vZGVUeXBlICE9PSAnYmFycmllcidcbiAgICAgICkge1xuICAgICAgICBxdWV1ZUJhY2t3YXJkcy5wdXNoKGN1cnJOZWlnaGJvckJhY2t3YXJkKTtcbiAgICAgICAgY3Vyck5laWdoYm9yQmFja3dhcmQucHJldmlvdXNOb2RlID0gY3Vyck5vZGVCYWNrd2FyZDtcbiAgICAgICAgY3Vyck5laWdoYm9yQmFja3dhcmQuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcpO1xuICAgICAgICB2aXNpdGVkQmFja3dhcmRzLmFkZChjdXJyTmVpZ2hib3JCYWNrd2FyZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2aXNpdGVkRm9yd2FyZHMuaGFzKGN1cnJOZWlnaGJvckJhY2t3YXJkKSkge1xuICAgICAgICBkaXNwYXlGaW5hbFBhdGgoY3Vyck5laWdoYm9yQmFja3dhcmQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBkaWprc3RyYShncmlkLCBzdGFydE5vZGUsIGVuZE5vZGUsIGRlbGF5KSB7XG4gIGNvbnN0IG9wZW5MaXN0UXVldWUgPSBbXTsgLy8gdHJhY2tzIG5vZGVzIHRvIHZpc2l0XG4gIGNvbnN0IGNsb3NlZExpc3QgPSBbXTtcbiAgY29uc3QgZmluYWxQYXRoID0gW107XG5cbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgIGdyaWRbcm93XVtjb2xdLmcgPSBJbmZpbml0eTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBkaXNwbGF5RmluYWxQYXRoKHBhdGgpIHtcbiAgICBmb3IgKGxldCBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKHBhdGhbaV0ubm9kZVR5cGUgPT09ICdzdGFydCcgfHwgcGF0aFtpXS5ub2RlVHlwZSA9PT0gJ2VuZCcpIGNvbnRpbnVlO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMzApKTtcbiAgICAgIHBhdGhbaV0uc2V0Tm9kZVR5cGUoJ2ZpbmFsLXBhdGgnKTtcbiAgICB9XG4gIH1cblxuICBzdGFydE5vZGUuZyA9IDA7XG4gIG9wZW5MaXN0UXVldWUucHVzaChzdGFydE5vZGUpO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGFsZ29yaXRobSgpIHtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gb3Blbkxpc3RRdWV1ZS5zaGlmdCgpO1xuICAgIGlmIChjdXJyZW50Tm9kZS5ub2RlVHlwZSAhPT0gJ3N0YXJ0JyAmJiBjdXJyZW50Tm9kZS5ub2RlVHlwZSAhPT0gJ2VuZCcpIHtcbiAgICAgIGN1cnJlbnROb2RlLnNldE5vZGVUeXBlKCdjbG9zZWQtbGlzdCcpO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gZW5kTm9kZSkge1xuICAgICAgbGV0IHRlbXAgPSBjdXJyZW50Tm9kZTtcbiAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXApO1xuICAgICAgd2hpbGUgKHRlbXAucHJldmlvdXNOb2RlKSB7XG4gICAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXAucHJldmlvdXNOb2RlKTtcbiAgICAgICAgdGVtcCA9IHRlbXAucHJldmlvdXNOb2RlO1xuICAgICAgfVxuICAgICAgZGlzcGxheUZpbmFsUGF0aChmaW5hbFBhdGgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZS5uZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGN1cnJOZWlnaGJvciA9IGN1cnJlbnROb2RlLm5laWdoYm9yc1tpXTtcblxuICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ2JhcnJpZXInICYmICFjbG9zZWRMaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgaWYgKGN1cnJOZWlnaGJvci5nID09PSBJbmZpbml0eSkge1xuICAgICAgICAgIGN1cnJOZWlnaGJvci5nID0gY3VycmVudE5vZGUuZyArIDE7XG4gICAgICAgICAgY3Vyck5laWdoYm9yLnByZXZpb3VzTm9kZSA9IGN1cnJlbnROb2RlO1xuICAgICAgICAgIG9wZW5MaXN0UXVldWUucHVzaChjdXJyTmVpZ2hib3IpO1xuICAgICAgICAgIGlmIChjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdzdGFydCcgJiYgY3Vyck5laWdoYm9yLm5vZGVUeXBlICE9PSAnZW5kJykge1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLnNldE5vZGVUeXBlKCdvcGVuLWxpc3QnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3Blbkxpc3RRdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBhbGdvcml0aG0oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGRvbmUgPSBhbGdvcml0aG0oKTtcbiAgcmV0dXJuIGRvbmU7XG59XG4iLCJmdW5jdGlvbiB1cGRhdGVTcXVhcmUoZ3JpZFNxdWFyZSwgbm9kZVR5cGUpIHtcbiAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKG5vZGVUeXBlKTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheUFsZ29yaXRobShub2RlLCBncmlkLCBzcXVhcmVTaXplKSB7XG4gIGNvbnN0IGRvbVNxdWFyZSA9IGdyaWQuZmluZERvbVNxdWFyZShub2RlLnJvdyAtIDEsIG5vZGUuY29sIC0gMSk7XG4gIGRvbVNxdWFyZS5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gIGRvbVNxdWFyZS5jbGFzc0xpc3QuYWRkKCdncmlkLXNxdWFyZScpO1xuICBkb21TcXVhcmUuY2xhc3NMaXN0LmFkZChub2RlLm5vZGVUeXBlKTtcbiAgaWYgKHNxdWFyZVNpemUgPT09IDgwKSB7XG4gICAgZG9tU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ3NtYWxsJyk7XG4gIH0gZWxzZSBpZiAoc3F1YXJlU2l6ZSA9PT0gMzApIHtcbiAgICBkb21TcXVhcmUuY2xhc3NMaXN0LmFkZCgnbWVkaXVtJyk7XG4gIH0gZWxzZSBpZiAoc3F1YXJlU2l6ZSA9PT0gMTUpIHtcbiAgICBkb21TcXVhcmUuY2xhc3NMaXN0LmFkZCgnbGFyZ2UnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkaXNwbGF5R3JpZChncmlkLCBzcXVhcmVTaXplKSB7XG4gIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgaWYgKHNxdWFyZVNpemUgPT09ICdzbWFsbCcpIHtcbiAgICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ21lZGl1bS1ncmlkJyk7XG4gICAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdsYXJnZS1ncmlkJyk7XG4gICAgZ3JpZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzbWFsbC1ncmlkJyk7XG4gIH0gZWxzZSBpZiAoc3F1YXJlU2l6ZSA9PT0gJ21lZGl1bScpIHtcbiAgICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3NtYWxsLWdyaWQnKTtcbiAgICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2xhcmdlLWdyaWQnKTtcbiAgICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ21lZGl1bS1ncmlkJyk7XG4gIH0gZWxzZSBpZiAoc3F1YXJlU2l6ZSA9PT0gJ2xhcmdlJykge1xuICAgIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc21hbGwtZ3JpZCcpO1xuICAgIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnbWVkaXVtLWdyaWQnKTtcbiAgICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2xhcmdlLWdyaWQnKTtcbiAgfVxuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgY29uc3QgZ3JpZFNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdncmlkLXNxdWFyZScpO1xuICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xuICAgICAgaWYgKHNxdWFyZVNpemUgPT09ICdzbWFsbCcpIHtcbiAgICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdtZWRpdW0nKTtcbiAgICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdsYXJnZScpO1xuICAgICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ3NtYWxsJyk7XG4gICAgICB9IGVsc2UgaWYgKHNxdWFyZVNpemUgPT09ICdtZWRpdW0nKSB7XG4gICAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnc21hbGwnKTtcbiAgICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdsYXJnZScpO1xuICAgICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ21lZGl1bScpO1xuICAgICAgfSBlbHNlIGlmIChzcXVhcmVTaXplID09PSAnbGFyZ2UnKSB7XG4gICAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnc21hbGwnKTtcbiAgICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdtZWRpdW0nKTtcbiAgICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdsYXJnZScpO1xuICAgICAgfVxuICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChncmlkU3F1YXJlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzZXRHcmlkKG5vZGVXaWR0aCkge1xuICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyaWQtY29udGFpbmVyJyk7XG4gIGNvbnN0IGdyaWRDb250YWluZXJDaGlsZHJlbiA9IGdyaWRDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlJyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmlkQ29udGFpbmVyQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBncmlkQ29udGFpbmVyQ2hpbGRyZW5baV0ucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgIGdyaWRDb250YWluZXJDaGlsZHJlbltpXS5jbGFzc0xpc3QuYWRkKCdncmlkLXNxdWFyZScpO1xuICAgIGdyaWRDb250YWluZXJDaGlsZHJlbltpXS5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xuICAgIGlmIChub2RlV2lkdGggPT09ICdzbWFsbCcpIHtcbiAgICAgIGdyaWRDb250YWluZXJDaGlsZHJlbltpXS5jbGFzc0xpc3QuYWRkKCdzbWFsbCcpO1xuICAgIH0gZWxzZSBpZiAobm9kZVdpZHRoID09PSAnbWVkaXVtJykge1xuICAgICAgZ3JpZENvbnRhaW5lckNoaWxkcmVuW2ldLmNsYXNzTGlzdC5hZGQoJ21lZGl1bScpO1xuICAgIH0gZWxzZSBpZiAobm9kZVdpZHRoID09PSAnbGFyZ2UnKSB7XG4gICAgICBncmlkQ29udGFpbmVyQ2hpbGRyZW5baV0uY2xhc3NMaXN0LmFkZCgnbGFyZ2UnKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgRG9tSGFuZGxlciA9IHtcbiAgZGlzcGxheUdyaWQsXG4gIHVwZGF0ZVNxdWFyZSxcbiAgZGlzcGxheUFsZ29yaXRobSxcbiAgcmVzZXRHcmlkLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRG9tSGFuZGxlcjtcbiIsImltcG9ydCBOb2RlIGZyb20gJy4vbm9kZSc7XG5pbXBvcnQgRG9tSGFuZGxlciBmcm9tICcuL2RvbWhhbmRsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmlkIHtcbiAgY29uc3RydWN0b3Iocm93cywgY29scywgbm9kZVdpZHRoKSB7XG4gICAgdGhpcy5yb3dzID0gcm93cztcbiAgICB0aGlzLmNvbHMgPSBjb2xzO1xuICAgIHRoaXMubm9kZVdpZHRoID0gbm9kZVdpZHRoO1xuICAgIHRoaXMuc3RhcnQgPSB7IG5vZGU6IG51bGwgfTtcbiAgICB0aGlzLmVuZCA9IHsgbm9kZTogbnVsbCB9O1xuICAgIHRoaXMuZ3JpZCA9IFtdO1xuICAgIHRoaXMub3Blbkxpc3QgPSBbXTtcbiAgICB0aGlzLmNsb3NlZExpc3QgPSBbXTtcbiAgICB0aGlzLmZpbmFsUGF0aCA9IFtdO1xuICAgIHRoaXMuY3JlYXRlR3JpZCh0aGlzLnJvd3MsIHRoaXMuY29scyk7XG5cbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHNldFNxdWFyZVN0YXR1cyhncmlkU3F1YXJlLCByb3csIGNvbCkge1xuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gdGhpcy5ncmlkW3Jvd11bY29sXTtcbiAgICBpZiAoY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdlbXB0eScpIHJldHVybjtcbiAgICBpZiAodGhpcy5zdGFydC5ub2RlID09PSBudWxsKSB7XG4gICAgICBjdXJyZW50Tm9kZS5ub2RlVHlwZSA9ICdzdGFydCc7XG4gICAgICB0aGlzLnN0YXJ0Lm5vZGUgPSBjdXJyZW50Tm9kZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZW5kLm5vZGUgPT09IG51bGwpIHtcbiAgICAgIGN1cnJlbnROb2RlLm5vZGVUeXBlID0gJ2VuZCc7XG4gICAgICB0aGlzLmVuZC5ub2RlID0gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnROb2RlLm5vZGVUeXBlID0gJ2JhcnJpZXInO1xuICAgIH1cbiAgICBEb21IYW5kbGVyLnVwZGF0ZVNxdWFyZShncmlkU3F1YXJlLCBjdXJyZW50Tm9kZS5ub2RlVHlwZSk7XG4gIH1cblxuICBoYW5kbGVNb3VzZURvd24oZ3JpZFNxdWFyZSwgcm93LCBjb2wpIHtcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgIHRoaXMuc2V0U3F1YXJlU3RhdHVzKGdyaWRTcXVhcmUsIHJvdywgY29sKTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlTW92ZShncmlkU3F1YXJlLCByb3csIGNvbCkge1xuICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgIHRoaXMuc2V0U3F1YXJlU3RhdHVzKGdyaWRTcXVhcmUsIHJvdywgY29sKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVNb3VzZVVwKCkge1xuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICB9XG5cbiAgZmluZERvbVNxdWFyZShyb3csIGNvbCkge1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyQ2hpbGRyZW4gPSBncmlkQ29udGFpbmVyLmNoaWxkcmVuO1xuICAgIGNvbnN0IGluZGV4ID0gcm93ICogdGhpcy5jb2xzICsgY29sO1xuICAgIHJldHVybiBncmlkQ29udGFpbmVyQ2hpbGRyZW5baW5kZXhdO1xuICB9XG5cbiAgYWRkTGlzdGVuZXJzKGN1cnJlbnRseVJ1bm5pbmcpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnJvd3M7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLmNvbHM7IGNvbCsrKSB7XG4gICAgICAgIGNvbnN0IGdyaWRTcXVhcmUgPSB0aGlzLmZpbmREb21TcXVhcmUocm93LCBjb2wpO1xuICAgICAgICBncmlkU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHtcbiAgICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ1swXSkgcmV0dXJuO1xuICAgICAgICAgIHRoaXMuaGFuZGxlTW91c2VEb3duKGdyaWRTcXVhcmUsIHJvdywgY29sKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGdyaWRTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKCkgPT4ge1xuICAgICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nWzBdKSByZXR1cm47XG4gICAgICAgICAgdGhpcy5oYW5kbGVNb3VzZU1vdmUoZ3JpZFNxdWFyZSwgcm93LCBjb2wpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVNb3VzZVVwKCk7XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVHcmlkKHJvd3MsIGNvbHMpIHtcbiAgICBmb3IgKGxldCByb3cgPSAxOyByb3cgPD0gcm93czsgcm93KyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBbXTtcbiAgICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8PSBjb2xzOyBjb2wrKykge1xuICAgICAgICBjdXJyZW50Um93LnB1c2gobmV3IE5vZGUocm93LCBjb2wsIHRoaXMucm93cywgdGhpcy5jb2xzLCB0aGlzLCB0aGlzLm5vZGVXaWR0aCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5ncmlkLnB1c2goY3VycmVudFJvdyk7XG4gICAgfVxuICAgIERvbUhhbmRsZXIuZGlzcGxheUdyaWQodGhpcy5ncmlkLCB0aGlzLm5vZGVXaWR0aCk7XG4gIH1cblxuICBzZXRBbGxOb2RlTmVpZ2hib3JzKCkge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLmdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICAgIHRoaXMuZ3JpZFtyb3ddW2NvbF0uc2V0TmVpZ2hib3JzKHRoaXMuZ3JpZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzZXRHcmlkKCkge1xuICAgIC8vIGNyZWF0aW5nIG5ldyBncmlkXG4gICAgdGhpcy5ncmlkID0gW107XG4gICAgZm9yIChsZXQgcm93ID0gMTsgcm93IDw9IHRoaXMucm93czsgcm93KyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBbXTtcbiAgICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8PSB0aGlzLmNvbHM7IGNvbCsrKSB7XG4gICAgICAgIGN1cnJlbnRSb3cucHVzaChuZXcgTm9kZShyb3csIGNvbCwgdGhpcy5yb3dzLCB0aGlzLmNvbHMsIHRoaXMsIHRoaXMubm9kZVdpZHRoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmdyaWQucHVzaChjdXJyZW50Um93KTtcbiAgICB9XG5cbiAgICAvLyBzZXR0aW5nIG5laWdoYm91cnMgYWdhaW5cbiAgICB0aGlzLnNldEFsbE5vZGVOZWlnaGJvcnMoKTtcblxuICAgIC8vIHJlc2V0dGluZyBzdGFydCBhbmQgZW5kIG5vZGVcbiAgICB0aGlzLnN0YXJ0Lm5vZGUgPSBudWxsO1xuICAgIHRoaXMuZW5kLm5vZGUgPSBudWxsO1xuXG4gICAgLy8gcmVzZXRpbmcgZG9tIHNxdWFyZXNcbiAgICBEb21IYW5kbGVyLnJlc2V0R3JpZCh0aGlzLm5vZGVXaWR0aCk7XG4gIH1cblxuICByZXNldFBhdGgoKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5yb3dzOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5jb2xzOyBjb2wrKykge1xuICAgICAgICBjb25zdCBjdXJyTm9kZSA9IHRoaXMuZ3JpZFtyb3ddW2NvbF07XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjdXJyTm9kZS5ub2RlVHlwZSA9PT0gJ29wZW4tbGlzdCcgfHxcbiAgICAgICAgICBjdXJyTm9kZS5ub2RlVHlwZSA9PT0gJ2Nsb3NlZC1saXN0JyB8fFxuICAgICAgICAgIGN1cnJOb2RlLm5vZGVUeXBlID09PSAnZmluYWwtcGF0aCdcbiAgICAgICAgKSB7XG4gICAgICAgICAgY3Vyck5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVHcmlkU2l6ZShyb3dzLCBjb2xzLCBub2RlV2lkdGgpIHtcbiAgICB0aGlzLnJvd3MgPSByb3dzO1xuICAgIHRoaXMuY29scyA9IGNvbHM7XG4gICAgdGhpcy5ub2RlV2lkdGggPSBub2RlV2lkdGg7XG4gICAgdGhpcy5yZXNldEdyaWQoKTtcbiAgICBEb21IYW5kbGVyLmRpc3BsYXlHcmlkKHRoaXMuZ3JpZCwgbm9kZVdpZHRoKTtcbiAgICB0aGlzLmFkZExpc3RlbmVycyhbZmFsc2VdKTtcbiAgfVxufVxuIiwiaW1wb3J0IEdyaWQgZnJvbSAnLi9ncmlkJztcbmltcG9ydCBhc3RhciBmcm9tICcuL2FsZ29yaXRobXMvYXN0YXInO1xuaW1wb3J0IGRpamtzdHJhIGZyb20gJy4vYWxnb3JpdGhtcy9kaWprc3RyYSc7XG5pbXBvcnQgcmFuZG9tTWFwIGZyb20gJy4vbWF6ZXMvcmFuZG9tbWFwJztcbmltcG9ydCBiaW5hcnlUcmVlIGZyb20gJy4vbWF6ZXMvYmluYXJ5dHJlZSc7XG5pbXBvcnQgc2lkZXdpbmRlciBmcm9tICcuL21hemVzL3NpZGV3aW5kZXInO1xuaW1wb3J0IHJlY3Vyc2l2ZURpdmlzaW9uIGZyb20gJy4vbWF6ZXMvcmVjdXJzaXZlZGl2aXNpb24nO1xuaW1wb3J0IGdlbmVyYXRlUHJpbXMgZnJvbSAnLi9tYXplcy9wcmltcyc7XG5pbXBvcnQgZ2VuZXJhdGVIdW50QW5kS2lsbCBmcm9tICcuL21hemVzL2h1bnRhbmRraWxsJztcbmltcG9ydCBiaWRpcmVjdGlvbmFsIGZyb20gJy4vYWxnb3JpdGhtcy9iaWRpcmVjdGlvbmFsJztcblxubGV0IGdyaWRPYmogPSBudWxsO1xubGV0IHJvd3MgPSAyNTtcbmxldCBjb2xzID0gNjE7XG5sZXQgc2VsZWN0ZWRBbGdvcml0aG0gPSBudWxsO1xubGV0IHNlbGVjdGVkTWF6ZSA9IG51bGw7XG5jb25zdCBydW5uaW5nID0gW2ZhbHNlXTsgLy8gY2hlY2sgaWYgYWxnb3JpdGhtIGlzIGN1cnJlbnRseSBydW5uaW5nXG5sZXQgY3Vyck1hemVTcGVlZFNldHRpbmcgPSAnTm9ybWFsJztcbmxldCBjdXJyUGF0aGZpbmRpbmdTcGVlZFNldHRpbmcgPSAnTm9ybWFsJztcbmxldCBtYXplU3BlZWQgPSAxMDtcbmxldCBwYXRoZmluZGluZ1NwZWVkID0gMTA7XG5sZXQgZ3JpZFNpemUgPSAnbWVkaXVtJztcblxuZnVuY3Rpb24gbG9hZEdyaWQoKSB7XG4gIGdyaWRPYmogPSBuZXcgR3JpZChyb3dzLCBjb2xzLCBncmlkU2l6ZSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bkFTdGFyKCkge1xuICBjb25zdCBzdGFydE5vZGUgPSBncmlkT2JqLnN0YXJ0Lm5vZGU7XG4gIGNvbnN0IGVuZE5vZGUgPSBncmlkT2JqLmVuZC5ub2RlO1xuXG4gIHRyeSB7XG4gICAgcnVubmluZ1swXSA9IHRydWU7XG4gICAgY29uc3QgcGF0aEZvdW5kID0gYXdhaXQgYXN0YXIoc3RhcnROb2RlLCBlbmROb2RlLCBwYXRoZmluZGluZ1NwZWVkKTtcblxuICAgIGlmIChwYXRoRm91bmQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmb3VuZCBwYXRoJyk7XG4gICAgICBydW5uaW5nWzBdID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdwYXRoIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0gZmluYWxseSB7XG4gICAgcnVubmluZ1swXSA9IGZhbHNlO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bkRpamtzdHJhKCkge1xuICBjb25zdCBzdGFydE5vZGUgPSBncmlkT2JqLnN0YXJ0Lm5vZGU7XG4gIGNvbnN0IGVuZE5vZGUgPSBncmlkT2JqLmVuZC5ub2RlO1xuXG4gIHRyeSB7XG4gICAgcnVubmluZ1swXSA9IHRydWU7XG4gICAgY29uc3QgcGF0aEZvdW5kID0gYXdhaXQgZGlqa3N0cmEoZ3JpZE9iai5ncmlkLCBzdGFydE5vZGUsIGVuZE5vZGUsIHBhdGhmaW5kaW5nU3BlZWQpO1xuXG4gICAgaWYgKHBhdGhGb3VuZCkge1xuICAgICAgY29uc29sZS5sb2coJ2ZvdW5kIHBhdGgnKTtcbiAgICAgIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3BhdGggbm90IGZvdW5kJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBydW5uaW5nWzBdID0gZmFsc2U7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuQmlkaXJlY3Rpb25hbCgpIHtcbiAgY29uc3Qgc3RhcnROb2RlID0gZ3JpZE9iai5zdGFydC5ub2RlO1xuICBjb25zdCBlbmROb2RlID0gZ3JpZE9iai5lbmQubm9kZTtcblxuICB0cnkge1xuICAgIHJ1bm5pbmdbMF0gPSB0cnVlO1xuICAgIGNvbnN0IHBhdGhGb3VuZCA9IGF3YWl0IGJpZGlyZWN0aW9uYWwoc3RhcnROb2RlLCBlbmROb2RlLCBwYXRoZmluZGluZ1NwZWVkKTtcblxuICAgIGlmIChwYXRoRm91bmQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmb3VuZCBwYXRoJyk7XG4gICAgICBydW5uaW5nWzBdID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdwYXRoIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0gZmluYWxseSB7XG4gICAgcnVubmluZ1swXSA9IGZhbHNlO1xuICB9XG59XG5cbmNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXJ0LWFsZ29yaXRobScpO1xuXG5zdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgaWYgKHJ1bm5pbmdbMF0gfHwgc2VsZWN0ZWRBbGdvcml0aG0gPT09IG51bGwpIHJldHVybjsgLy8gYWxnb3JpdGhtIGluIHByb2dyZXNzXG4gIGdyaWRPYmouc2V0QWxsTm9kZU5laWdoYm9ycygpO1xuICBncmlkT2JqLnJlc2V0UGF0aCgpO1xuXG4gIGxldCBkb25lO1xuICBpZiAoZ3JpZE9iai5zdGFydC5ub2RlICYmIGdyaWRPYmouZW5kLm5vZGUpIHtcbiAgICBpZiAoc2VsZWN0ZWRBbGdvcml0aG0gPT09ICdBKicpIGRvbmUgPSBhd2FpdCBydW5BU3RhcigpO1xuICAgIGlmIChzZWxlY3RlZEFsZ29yaXRobSA9PT0gJ0RpamtzdHJhJykgZG9uZSA9IGF3YWl0IHJ1bkRpamtzdHJhKCk7XG4gICAgaWYgKHNlbGVjdGVkQWxnb3JpdGhtID09PSAnQmlkaXJlY3Rpb25hbCcpIGRvbmUgPSBhd2FpdCBydW5CaWRpcmVjdGlvbmFsKCk7XG4gIH1cblxuICBpZiAoZG9uZSkgcnVubmluZ1swXSA9IGZhbHNlO1xufSk7XG5cbmNvbnN0IGdlbmVyYXRlTWF6ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nZW5lcmF0ZS1tYXplJyk7XG5cbmdlbmVyYXRlTWF6ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgaWYgKHJ1bm5pbmdbMF0gfHwgc2VsZWN0ZWRNYXplID09PSBudWxsKSByZXR1cm47IC8vIGFsZ29yaXRobSBpbiBwcm9ncmVzc1xuICBydW5uaW5nWzBdID0gdHJ1ZTtcbiAgZ3JpZE9iai5yZXNldEdyaWQoKTtcblxuICBsZXQgZG9uZTtcbiAgaWYgKHNlbGVjdGVkTWF6ZSA9PT0gJ1JhbmRvbSBNYXAnKSB7XG4gICAgZG9uZSA9IGF3YWl0IHJhbmRvbU1hcChncmlkT2JqLmdyaWQsIG1hemVTcGVlZCk7XG4gIH1cbiAgaWYgKHNlbGVjdGVkTWF6ZSA9PT0gJ0JpbmFyeSBUcmVlJykge1xuICAgIGRvbmUgPSBhd2FpdCBiaW5hcnlUcmVlKGdyaWRPYmouZ3JpZCwgbWF6ZVNwZWVkKTtcbiAgfVxuICBpZiAoc2VsZWN0ZWRNYXplID09PSAnU2lkZXdpbmRlcicpIHtcbiAgICBkb25lID0gYXdhaXQgc2lkZXdpbmRlcihncmlkT2JqLmdyaWQsIG1hemVTcGVlZCk7XG4gIH1cbiAgaWYgKHNlbGVjdGVkTWF6ZSA9PT0gJ1JlY3Vyc2l2ZSBEaXZpc2lvbicpIHtcbiAgICBkb25lID0gYXdhaXQgcmVjdXJzaXZlRGl2aXNpb24oZ3JpZE9iai5ncmlkLCBtYXplU3BlZWQpO1xuICB9XG4gIGlmIChzZWxlY3RlZE1hemUgPT09IFwiUHJpbSdzXCIpIHtcbiAgICBkb25lID0gYXdhaXQgZ2VuZXJhdGVQcmltcyhncmlkT2JqLmdyaWQsIG1hemVTcGVlZCk7XG4gIH1cbiAgaWYgKHNlbGVjdGVkTWF6ZSA9PT0gJ0h1bnQgJiBLaWxsJykge1xuICAgIGRvbmUgPSBhd2FpdCBnZW5lcmF0ZUh1bnRBbmRLaWxsKGdyaWRPYmouZ3JpZCwgbWF6ZVNwZWVkKTtcbiAgfVxuICBpZiAoZG9uZSkgcnVubmluZ1swXSA9IGZhbHNlO1xufSk7XG5cbmZ1bmN0aW9uIHVwZGF0ZU1hemVEZWxheShzcGVlZCkge1xuICBpZiAoZ3JpZFNpemUgPT09ICdzbWFsbCcpIHtcbiAgICBpZiAoc3BlZWQgPT09ICdTbG93JykgbWF6ZVNwZWVkID0gMjAwO1xuICAgIGlmIChzcGVlZCA9PT0gJ05vcm1hbCcpIG1hemVTcGVlZCA9IDUwO1xuICAgIGlmIChzcGVlZCA9PT0gJ0Zhc3QnKSBtYXplU3BlZWQgPSAyNTtcbiAgfVxuICBpZiAoZ3JpZFNpemUgPT09ICdtZWRpdW0nKSB7XG4gICAgaWYgKHNwZWVkID09PSAnU2xvdycpIG1hemVTcGVlZCA9IDIwO1xuICAgIGlmIChzcGVlZCA9PT0gJ05vcm1hbCcpIG1hemVTcGVlZCA9IDEwO1xuICAgIGlmIChzcGVlZCA9PT0gJ0Zhc3QnKSBtYXplU3BlZWQgPSAxO1xuICB9XG4gIGlmIChncmlkU2l6ZSA9PT0gJ2xhcmdlJykge1xuICAgIGlmIChzcGVlZCA9PT0gJ1Nsb3cnKSBtYXplU3BlZWQgPSAxMDtcbiAgICBpZiAoc3BlZWQgPT09ICdOb3JtYWwnKSBtYXplU3BlZWQgPSA1O1xuICAgIGlmIChzcGVlZCA9PT0gJ0Zhc3QnKSBtYXplU3BlZWQgPSAwLjE7XG4gIH1cblxuICBpZiAoc3BlZWQgPT09ICdJbnN0YW50JykgbWF6ZVNwZWVkID0gMDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUGF0aGZpbmRpbmdEZWxheShzcGVlZCkge1xuICBpZiAoZ3JpZFNpemUgPT09ICdzbWFsbCcpIHtcbiAgICBpZiAoc3BlZWQgPT09ICdTbG93JykgcGF0aGZpbmRpbmdTcGVlZCA9IDI1MDtcbiAgICBpZiAoc3BlZWQgPT09ICdOb3JtYWwnKSBwYXRoZmluZGluZ1NwZWVkID0gMTAwO1xuICAgIGlmIChzcGVlZCA9PT0gJ0Zhc3QnKSBwYXRoZmluZGluZ1NwZWVkID0gMzA7XG4gIH1cbiAgaWYgKGdyaWRTaXplID09PSAnbWVkaXVtJykge1xuICAgIGlmIChzcGVlZCA9PT0gJ1Nsb3cnKSBwYXRoZmluZGluZ1NwZWVkID0gMzA7XG4gICAgaWYgKHNwZWVkID09PSAnTm9ybWFsJykgcGF0aGZpbmRpbmdTcGVlZCA9IDEwO1xuICAgIGlmIChzcGVlZCA9PT0gJ0Zhc3QnKSBwYXRoZmluZGluZ1NwZWVkID0gNTtcbiAgfVxuICBpZiAoZ3JpZFNpemUgPT09ICdsYXJnZScpIHtcbiAgICBpZiAoc3BlZWQgPT09ICdTbG93JykgcGF0aGZpbmRpbmdTcGVlZCA9IDMwO1xuICAgIGlmIChzcGVlZCA9PT0gJ05vcm1hbCcpIHBhdGhmaW5kaW5nU3BlZWQgPSAxMDtcbiAgICBpZiAoc3BlZWQgPT09ICdGYXN0JykgcGF0aGZpbmRpbmdTcGVlZCA9IDE7XG4gIH1cblxuICBpZiAoc3BlZWQgPT09ICdJbnN0YW50JykgcGF0aGZpbmRpbmdTcGVlZCA9IDA7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUdyaWRTaXplKHNpemUpIHtcbiAgaWYgKHNpemUgPT09ICdTbWFsbCcpIHtcbiAgICByb3dzID0gOTtcbiAgICBjb2xzID0gMjM7XG4gICAgZ3JpZFNpemUgPSAnc21hbGwnO1xuICAgIGdyaWRPYmoudXBkYXRlR3JpZFNpemUocm93cywgY29scywgZ3JpZFNpemUpO1xuICB9XG4gIGlmIChzaXplID09PSAnTWVkaXVtJykge1xuICAgIHJvd3MgPSAyNTtcbiAgICBjb2xzID0gNjE7XG4gICAgZ3JpZFNpemUgPSAnbWVkaXVtJztcbiAgICBncmlkT2JqLnVwZGF0ZUdyaWRTaXplKHJvd3MsIGNvbHMsIGdyaWRTaXplKTtcbiAgfVxuICBpZiAoc2l6ZSA9PT0gJ0xhcmdlJykge1xuICAgIHJvd3MgPSA0OTtcbiAgICBjb2xzID0gMTE5O1xuICAgIGdyaWRTaXplID0gJ2xhcmdlJztcbiAgICBncmlkT2JqLnVwZGF0ZUdyaWRTaXplKHJvd3MsIGNvbHMsIGdyaWRTaXplKTtcbiAgfVxuXG4gIHVwZGF0ZVBhdGhmaW5kaW5nRGVsYXkoY3VyclBhdGhmaW5kaW5nU3BlZWRTZXR0aW5nKTtcbiAgdXBkYXRlTWF6ZURlbGF5KGN1cnJQYXRoZmluZGluZ1NwZWVkU2V0dGluZyk7XG59XG5cbmZ1bmN0aW9uIGFkZExpc3RlbmVyc1RvQnRucygpIHtcbiAgY29uc3Qgc2VsZWN0QWxnb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtYWxnby1idG4nKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtbWF6ZS1idG4nKTtcbiAgY29uc3QgZ3JpZFNpemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1zaXplLWJ0bicpO1xuICBjb25zdCBzZWxlY3RNYXplU3BlZWRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LW1hemUtc3BlZWQtYnRuJyk7XG4gIGNvbnN0IHNlbGVjdEFsZ29TcGVlZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtYWxnby1zcGVlZC1idG4nKTtcblxuICBjb25zdCBzZWxlY3RBbGdvQnRuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hbGdvLWxpc3QnKTtcbiAgY29uc3Qgc2VsZWN0TWF6ZUJ0bkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWF6ZS1saXN0Jyk7XG4gIGNvbnN0IGdyaWRTaXplQnRuTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLXNpemUtbGlzdCcpO1xuICBjb25zdCBzZWxlY3RNYXplU3BlZWRCdG5MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1hemUtc3BlZWQtbGlzdCcpO1xuICBjb25zdCBzZWxlY3RBbGdvU3BlZWRCdG5MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsZ28tc3BlZWQtbGlzdCcpO1xuICBjb25zdCBzZWxlY3RBbGdvTGlzdEl0ZW1zID0gc2VsZWN0QWxnb0J0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG4gIGNvbnN0IHNlbGVjdE1hemVMaXN0SXRlbXMgPSBzZWxlY3RNYXplQnRuTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC1zZWxlY3Rpb24nKTtcbiAgY29uc3QgZ3JpZFNpemVMaXN0SXRlbXMgPSBncmlkU2l6ZUJ0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG4gIGNvbnN0IHNlbGVjdE1hemVTcGVlZExpc3RJdGVtcyA9IHNlbGVjdE1hemVTcGVlZEJ0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG4gIGNvbnN0IHNlbGVjdEFsZ29TcGVlZExpc3RJdGVtcyA9IHNlbGVjdEFsZ29TcGVlZEJ0bkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG5cbiAgY29uc3QgZHJvcGRvd25CdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Bkb3duLWJ0bicpO1xuICBjb25zdCBkcm9wZG93bkxpc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Bkb3duLWxpc3QnKTtcbiAgY29uc3QgY2xlYXJCb2FyZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbGVhci1ib2FyZCcpO1xuICBjb25zdCBjbGVhclBhdGhCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xlYXItcGF0aCcpO1xuXG4gIGZ1bmN0aW9uIGNsb3NlRHJvcGRvd25zKCkge1xuICAgIGRyb3Bkb3duTGlzdHMuZm9yRWFjaCgobGlzdCkgPT4ge1xuICAgICAgbGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgfSk7XG4gIH1cblxuICBkcm9wZG93bkJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uLCBpbmRleCkgPT4ge1xuICAgIGlmIChydW5uaW5nWzBdKSByZXR1cm47IC8vIGFsZ29yaXRobSBpbiBwcm9ncmVzc1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgY29uc3QgY3VycmVudExpc3QgPSBkcm9wZG93bkxpc3RzW2luZGV4XTtcbiAgICAgIGNvbnN0IGlzTGlzdE9wZW4gPSBjdXJyZW50TGlzdC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKTtcblxuICAgICAgY2xvc2VEcm9wZG93bnMoKTtcblxuICAgICAgaWYgKCFpc0xpc3RPcGVuKSB7XG4gICAgICAgIGN1cnJlbnRMaXN0LmNsYXNzTGlzdC50b2dnbGUoJ3Nob3cnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGNvbnN0IGlzQ2xpY2tJbnNpZGVEcm9wZG93biA9IEFycmF5LmZyb20oZHJvcGRvd25MaXN0cykuc29tZSgobGlzdCkgPT4gbGlzdC5jb250YWlucyhlLnRhcmdldCkpO1xuXG4gICAgaWYgKCFpc0NsaWNrSW5zaWRlRHJvcGRvd24pIHtcbiAgICAgIGNsb3NlRHJvcGRvd25zKCk7XG4gICAgfVxuICB9KTtcblxuICBzZWxlY3RBbGdvTGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHNlbGVjdEFsZ29CdG5MaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgIHNlbGVjdEFsZ29CdG4udGV4dENvbnRlbnQgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgc2VsZWN0ZWRBbGdvcml0aG0gPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZWN0TWF6ZUxpc3RJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBzZWxlY3RNYXplQnRuTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICBzZWxlY3RNYXplQnRuLnRleHRDb250ZW50ID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgIHNlbGVjdGVkTWF6ZSA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuICB9KTtcblxuICBzZWxlY3RNYXplU3BlZWRMaXN0SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgc2VsZWN0TWF6ZVNwZWVkQnRuTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICBzZWxlY3RNYXplU3BlZWRCdG4udGV4dENvbnRlbnQgPSAnTWF6ZSBTcGVlZCAnICsgYCgke2l0ZW0udGV4dENvbnRlbnR9KWA7XG4gICAgICBjdXJyTWF6ZVNwZWVkU2V0dGluZyA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICB1cGRhdGVNYXplRGVsYXkoaXRlbS50ZXh0Q29udGVudCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuICB9KTtcblxuICBzZWxlY3RBbGdvU3BlZWRMaXN0SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgc2VsZWN0QWxnb1NwZWVkQnRuTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICBzZWxlY3RBbGdvU3BlZWRCdG4udGV4dENvbnRlbnQgPSAnQWxnb3JpdGhtIFNwZWVkICcgKyBgKCR7aXRlbS50ZXh0Q29udGVudH0pYDtcbiAgICAgIGN1cnJQYXRoZmluZGluZ1NwZWVkU2V0dGluZyA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICB1cGRhdGVQYXRoZmluZGluZ0RlbGF5KGl0ZW0udGV4dENvbnRlbnQpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZ3JpZFNpemVMaXN0SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZ3JpZFNpemVCdG5MaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgIGdyaWRTaXplQnRuLnRleHRDb250ZW50ID0gJ0dyaWQgU2l6ZSAnICsgYCgke2l0ZW0udGV4dENvbnRlbnR9KWA7XG4gICAgICB1cGRhdGVHcmlkU2l6ZShpdGVtLnRleHRDb250ZW50KTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGNsZWFyQm9hcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjsgLy8gYWxnb3JpdGhtIGluIHByb2dyZXNzXG4gICAgZ3JpZE9iai5yZXNldEdyaWQoKTtcbiAgfSk7XG5cbiAgY2xlYXJQYXRoQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChydW5uaW5nWzBdKSByZXR1cm47IC8vIGFsZ29yaXRobSBpbiBwcm9ncmVzc1xuICAgIGdyaWRPYmoucmVzZXRQYXRoKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnNUb0dyaWQoKSB7XG4gIGdyaWRPYmouYWRkTGlzdGVuZXJzKHJ1bm5pbmcpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkKCkge1xuICBsb2FkR3JpZCgpO1xuICBhZGRMaXN0ZW5lcnNUb0dyaWQoKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICBhZGRMaXN0ZW5lcnNUb0J0bnMoKTtcbiAgfSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBiaW5hcnlUcmVlKGdyaWQsIGRlbGF5KSB7XG4gIGZ1bmN0aW9uIGNvbm5lY3Qobm9kZTEsIG5vZGUyLCBiYXJyaWVyQmV0d2Vlbikge1xuICAgIG5vZGUxLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgIG5vZGUyLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgIGJhcnJpZXJCZXR3ZWVuLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICB9XG5cbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgIGlmIChyb3cgJSAyID09PSAwIHx8IGNvbCAlIDIgPT09IDApIGNvbnRpbnVlO1xuICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJyZW50U3F1YXJlID0gZ3JpZFtyb3ddW2NvbF07XG4gICAgICBsZXQgbm9ydGhOZWlnaGJvcjtcbiAgICAgIGxldCB3ZXN0TmVpZ2hib3I7XG5cbiAgICAgIGlmIChyb3cgPiAxKSB7XG4gICAgICAgIG5vcnRoTmVpZ2hib3IgPSBncmlkW3JvdyAtIDJdW2NvbF07IC8vIHVwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub3J0aE5laWdoYm9yID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbCA+IDEpIHtcbiAgICAgICAgd2VzdE5laWdoYm9yID0gZ3JpZFtyb3ddW2NvbCAtIDJdOyAvLyBsZWZ0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3ZXN0TmVpZ2hib3IgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAobm9ydGhOZWlnaGJvciAmJiB3ZXN0TmVpZ2hib3IpIHtcbiAgICAgICAgLy8gaWYgYm90aCBwYXRocyBhcmUgYXZhaWxhYmxlXG4gICAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICAgICAgICBpZiAocmFuZG9tID09PSAwKSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCBub3J0aE5laWdoYm9yLCBjdXJyZW50U3F1YXJlLm5laWdoYm9yc1szXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCB3ZXN0TmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzFdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgb25lIG9mIHRoZSBwYXRocyBnbyBiZXlvbmQgdGhlIGdyaWRcbiAgICAgICAgaWYgKHJvdyA9PT0gMSAmJiBjb2wgPiAxKSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCB3ZXN0TmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzFdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sID09PSAxICYmIHJvdyA+IDEpIHtcbiAgICAgICAgICBjb25uZWN0KGN1cnJlbnRTcXVhcmUsIG5vcnRoTmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzNdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZUh1bnRBbmRLaWxsKGdyaWQsIGRlbGF5KSB7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuICBjb25zdCB2aXNpdGVkID0gW107XG5cbiAgLy8gc2V0IHRoZSBlbnRpcmUgZ3JpZCBhcyBiYXJyaWVyc1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCByb3dzOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFkZCBuZWlnaGJvcnMgLSBkaXJlY3RseSBhZGphY2VudCBuZWlnaGJvcnMgYXJlIHNraXBwZWQgc28gdGhleSBjYW4gYmUgd2FsbHMgaWYgbmVlZGVkXG4gIGZ1bmN0aW9uIGdldFVudmlzaXRlZE5laWdoYm9ycyhub2RlKSB7XG4gICAgY29uc3QgbmVpZ2hib3JzID0gW107XG4gICAgY29uc3Qgcm93ID0gbm9kZS5yb3cgLSAxO1xuICAgIGNvbnN0IGNvbCA9IG5vZGUuY29sIC0gMTtcblxuICAgIGlmIChyb3cgPiAxKSB7XG4gICAgICBpZiAoIXZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3cgLSAyXVtjb2xdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3JvdyAtIDJdW2NvbF0pOyAvLyB1cFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyb3cgPCByb3dzIC0gMikge1xuICAgICAgaWYgKCF2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93ICsgMl1bY29sXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgKyAyXVtjb2xdKTsgLy8gZG93blxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2wgPiAxKSB7XG4gICAgICBpZiAoIXZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3ddW2NvbCAtIDJdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3Jvd11bY29sIC0gMl0pOyAvLyBsZWZ0XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbCA8IGNvbHMgLSAyKSB7XG4gICAgICBpZiAoIXZpc2l0ZWQuaW5jbHVkZXMoZ3JpZFtyb3ddW2NvbCArIDJdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChncmlkW3Jvd11bY29sICsgMl0pOyAvLyByaWdodFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZWlnaGJvcnM7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRWaXNpdGVkTmVpZ2hib3JzKG5vZGUpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBjb25zdCByb3cgPSBub2RlLnJvdyAtIDE7XG4gICAgY29uc3QgY29sID0gbm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93IC0gMl1bY29sXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgLSAyXVtjb2xdKTsgLy8gdXBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocm93IDwgcm93cyAtIDIpIHtcbiAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93ICsgMl1bY29sXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgKyAyXVtjb2xdKTsgLy8gZG93blxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2wgPiAxKSB7XG4gICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyhncmlkW3Jvd11bY29sIC0gMl0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93XVtjb2wgLSAyXSk7IC8vIGxlZnRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29sIDwgY29scyAtIDIpIHtcbiAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKGdyaWRbcm93XVtjb2wgKyAyXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCArIDJdKTsgLy8gcmlnaHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG5cbiAgZnVuY3Rpb24gcmFuZG9tbHlTZWxlY3ROZWlnaGJvcihuZWlnaGJvcnMpIHtcbiAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5laWdoYm9ycy5sZW5ndGgpO1xuICAgIHJldHVybiBuZWlnaGJvcnNbaW5kZXhdO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVTdGFydFBvaW50KCkge1xuICAgIC8vIGNob29zZSBhIHJhbmRvbSBwb2ludCBvbiB0aGUgZ3JpZCB0byBzdGFydCB3aXRoXG4gICAgbGV0IHJhbmRvbU5vZGVGb3VuZCA9IGZhbHNlO1xuICAgIGxldCByYW5kb21GaXJzdE5vZGUgPSBudWxsO1xuICAgIHdoaWxlICghcmFuZG9tTm9kZUZvdW5kKSB7XG4gICAgICBjb25zdCByYW5kb21Sb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAocm93cyAtIDQpKSArIDI7XG4gICAgICBjb25zdCByYW5kb21Db2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoY29scyAtIDQpKSArIDI7XG4gICAgICBpZiAocmFuZG9tUm93ICUgMiAhPT0gMCAmJiByYW5kb21Db2wgJSAyICE9PSAwKSB7XG4gICAgICAgIHJhbmRvbUZpcnN0Tm9kZSA9IGdyaWRbcmFuZG9tUm93XVtyYW5kb21Db2xdO1xuICAgICAgICByYW5kb21GaXJzdE5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICAgIHJhbmRvbU5vZGVGb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByYW5kb21GaXJzdE5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVXYWxsQmV0d2VlbihjdXJyTm9kZSwgbmV4dE5vZGUpIHtcbiAgICBjb25zdCByb3cgPSBjdXJyTm9kZS5yb3cgLSAxO1xuICAgIGNvbnN0IGNvbCA9IGN1cnJOb2RlLmNvbCAtIDE7XG5cbiAgICBpZiAocm93ID4gMSkge1xuICAgICAgaWYgKGdyaWRbcm93IC0gMl1bY29sXSA9PT0gbmV4dE5vZGUpIHtcbiAgICAgICAgY29uc3Qgd2FsbEJldHdlZW4gPSBncmlkW3JvdyAtIDFdW2NvbF07XG4gICAgICAgIHdhbGxCZXR3ZWVuLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocm93IDwgcm93cyAtIDIpIHtcbiAgICAgIGlmIChncmlkW3JvdyArIDJdW2NvbF0gPT09IG5leHROb2RlKSB7XG4gICAgICAgIGNvbnN0IHdhbGxCZXR3ZWVuID0gZ3JpZFtyb3cgKyAxXVtjb2xdO1xuICAgICAgICB3YWxsQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvbCA+IDEpIHtcbiAgICAgIGlmIChncmlkW3Jvd11bY29sIC0gMl0gPT09IG5leHROb2RlKSB7XG4gICAgICAgIGNvbnN0IHdhbGxCZXR3ZWVuID0gZ3JpZFtyb3ddW2NvbCAtIDFdO1xuICAgICAgICB3YWxsQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvbCA8IGNvbHMgLSAyKSB7XG4gICAgICBpZiAoZ3JpZFtyb3ddW2NvbCArIDJdID09PSBuZXh0Tm9kZSkge1xuICAgICAgICBjb25zdCB3YWxsQmV0d2VlbiA9IGdyaWRbcm93XVtjb2wgKyAxXTtcbiAgICAgICAgd2FsbEJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY3Vyck5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgbmV4dE5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBhbGdvcml0aG0oKSB7XG4gICAgbGV0IGN1cnJlbnROb2RlID0gZ2VuZXJhdGVTdGFydFBvaW50KCk7IC8vIGdldCBzdGFydCBub2RlXG5cbiAgICB3aGlsZSAoY3VycmVudE5vZGUpIHtcbiAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgIH1cbiAgICAgIHZpc2l0ZWQucHVzaChjdXJyZW50Tm9kZSk7XG4gICAgICBjb25zdCBuZWlnaGJvcnMgPSBnZXRVbnZpc2l0ZWROZWlnaGJvcnMoY3VycmVudE5vZGUpO1xuXG4gICAgICBpZiAobmVpZ2hib3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgbmV4dE5vZGUgPSByYW5kb21seVNlbGVjdE5laWdoYm9yKG5laWdoYm9ycyk7XG4gICAgICAgIHJlbW92ZVdhbGxCZXR3ZWVuKGN1cnJlbnROb2RlLCBuZXh0Tm9kZSk7XG4gICAgICAgIGN1cnJlbnROb2RlID0gbmV4dE5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZSA9IG51bGw7XG5cbiAgICAgICAgZm9yIChsZXQgcm93ID0gMTsgcm93IDwgcm93cyAtIDE7IHJvdyArPSAyKSB7XG4gICAgICAgICAgZm9yIChsZXQgY29sID0gMTsgY29sIDwgY29scyAtIDE7IGNvbCArPSAyKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gZ3JpZFtyb3ddW2NvbF07XG4gICAgICAgICAgICBjb25zdCB2aXNpdGVkTm9kZU5laWdoYm9ycyA9IGdldFZpc2l0ZWROZWlnaGJvcnMobm9kZSk7XG4gICAgICAgICAgICBpZiAoIXZpc2l0ZWQuaW5jbHVkZXMobm9kZSkgJiYgdmlzaXRlZE5vZGVOZWlnaGJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBjdXJyZW50Tm9kZSA9IG5vZGU7XG4gICAgICAgICAgICAgIGNvbnN0IHJhbmRvbWx5U2VsZWN0ZWROZWlnaGJvciA9IHJhbmRvbWx5U2VsZWN0TmVpZ2hib3IodmlzaXRlZE5vZGVOZWlnaGJvcnMpO1xuICAgICAgICAgICAgICByZW1vdmVXYWxsQmV0d2VlbihjdXJyZW50Tm9kZSwgcmFuZG9tbHlTZWxlY3RlZE5laWdoYm9yKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50Tm9kZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGFsZ29yaXRobSgpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVQcmltcyhncmlkLCBkZWxheSkge1xuICBjb25zdCByb3dzID0gZ3JpZC5sZW5ndGg7XG4gIGNvbnN0IGNvbHMgPSBncmlkWzBdLmxlbmd0aDtcbiAgY29uc3QgZnJvbnRpZXIgPSBbXTtcbiAgY29uc3QgdmlzaXRlZCA9IFtdO1xuXG4gIC8vIHNldCB0aGUgZW50aXJlIGdyaWQgYXMgYmFycmllcnNcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcm93czsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBjb2xzOyBjb2wrKykge1xuICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICB9XG4gIH1cblxuICAvLyBhZGQgbmVpZ2hib3JzIC0gZGlyZWN0bHkgYWRqYWNlbnQgbmVpZ2hib3JzIGFyZSBza2lwcGVkIHNvIHRoZXkgY2FuIGJlIHdhbGxzIGlmIG5lZWRlZFxuICBmdW5jdGlvbiBnZXROZWlnaGJvcnMobm9kZSkge1xuICAgIGNvbnN0IG5laWdoYm9ycyA9IFtdO1xuICAgIGNvbnN0IHJvdyA9IG5vZGUucm93IC0gMTtcbiAgICBjb25zdCBjb2wgPSBub2RlLmNvbCAtIDE7XG5cbiAgICBpZiAocm93ID4gMSkge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3cgLSAyXVtjb2xdKTsgLy8gdXBcbiAgICB9XG5cbiAgICBpZiAocm93IDwgcm93cyAtIDIpIHtcbiAgICAgIG5laWdoYm9ycy5wdXNoKGdyaWRbcm93ICsgMl1bY29sXSk7IC8vIGRvd25cbiAgICB9XG5cbiAgICBpZiAoY29sID4gMSkge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCAtIDJdKTsgLy8gbGVmdFxuICAgIH1cblxuICAgIGlmIChjb2wgPCBjb2xzIC0gMikge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZ3JpZFtyb3ddW2NvbCArIDJdKTsgLy8gcmlnaHRcbiAgICB9XG5cbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0V2FsbEJldHdlZW4obm9kZSwgbmVpZ2hib3IpIHtcbiAgICBjb25zdCByb3cgPSBub2RlLnJvdyAtIDE7XG4gICAgY29uc3QgY29sID0gbm9kZS5jb2wgLSAxO1xuXG4gICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgIGlmIChncmlkW3JvdyAtIDJdW2NvbF0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3cgLSAxXVtjb2xdOyAvLyB1cFxuICAgIH1cbiAgICBpZiAocm93IDwgcm93cyAtIDIpIHtcbiAgICAgIGlmIChncmlkW3JvdyArIDJdW2NvbF0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3cgKyAxXVtjb2xdOyAvLyBkb3duXG4gICAgfVxuICAgIGlmIChjb2wgPiAxKSB7XG4gICAgICBpZiAoZ3JpZFtyb3ddW2NvbCAtIDJdID09PSBuZWlnaGJvcikgcmV0dXJuIGdyaWRbcm93XVtjb2wgLSAxXTsgLy8gbGVmdFxuICAgIH1cbiAgICBpZiAoY29sIDwgY29scyAtIDIpIHtcbiAgICAgIGlmIChncmlkW3Jvd11bY29sICsgMl0gPT09IG5laWdoYm9yKSByZXR1cm4gZ3JpZFtyb3ddW2NvbCArIDFdOyAvLyByaWdodFxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gY29ubmVjdChub2RlMSwgbm9kZTIsIHdhbGxCZXR3ZWVuKSB7XG4gICAgbm9kZTEuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgbm9kZTIuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgd2FsbEJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gIH1cblxuICAvLyBjaG9vc2UgYSByYW5kb20gcG9pbnQgb24gdGhlIGdyaWQgdG8gc3RhcnQgd2l0aFxuICBsZXQgcmFuZG9tTm9kZUZvdW5kID0gZmFsc2U7XG4gIGxldCByYW5kb21GaXJzdE5vZGUgPSBudWxsO1xuICB3aGlsZSAoIXJhbmRvbU5vZGVGb3VuZCkge1xuICAgIGNvbnN0IHJhbmRvbVJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChyb3dzIC0gNCkpICsgMjtcbiAgICBjb25zdCByYW5kb21Db2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoY29scyAtIDQpKSArIDI7XG4gICAgaWYgKHJhbmRvbVJvdyAlIDIgIT09IDAgJiYgcmFuZG9tQ29sICUgMiAhPT0gMCkge1xuICAgICAgcmFuZG9tRmlyc3ROb2RlID0gZ3JpZFtyYW5kb21Sb3ddW3JhbmRvbUNvbF07XG4gICAgICByYW5kb21GaXJzdE5vZGUuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICB2aXNpdGVkLnB1c2gocmFuZG9tRmlyc3ROb2RlKTtcbiAgICAgIHJhbmRvbU5vZGVGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3RhcnROb2RlTmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKHJhbmRvbUZpcnN0Tm9kZSk7XG4gIHN0YXJ0Tm9kZU5laWdoYm9ycy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgaWYgKG5vZGUpIHtcbiAgICAgIGZyb250aWVyLnB1c2gobm9kZSk7XG4gICAgfVxuICB9KTtcblxuICB3aGlsZSAoZnJvbnRpZXIubGVuZ3RoID4gMCkge1xuICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgfVxuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZnJvbnRpZXIubGVuZ3RoKTtcbiAgICBjb25zdCByYW5kb21Gcm9udGllck5vZGUgPSBmcm9udGllcltyYW5kb21JbmRleF07XG4gICAgY29uc3QgZnJvbnRpZXJOZWlnaGJvcnMgPSBnZXROZWlnaGJvcnMocmFuZG9tRnJvbnRpZXJOb2RlKTtcblxuICAgIC8vIGZpbmQgb3V0IHdoaWNoICdpbicgbm9kZXMgKHBhcnQgb2YgbWF6ZSkgYXJlIGFkamFjZW50XG4gICAgY29uc3QgYWRqYWNlbnRJbnMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyb250aWVyTmVpZ2hib3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyhmcm9udGllck5laWdoYm9yc1tpXSkpIHtcbiAgICAgICAgYWRqYWNlbnRJbnMucHVzaChmcm9udGllck5laWdoYm9yc1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2hvb3NlIGEgcmFuZG9tIGFkamFjZW50IG5vZGUgYW5kIGNvbm5lY3QgdGhhdCB3aXRoIHRoZSBmcm9udGllciBub2RlXG4gICAgY29uc3QgcmFuZG9tQWRqYWNlbnRJbiA9IGFkamFjZW50SW5zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFkamFjZW50SW5zLmxlbmd0aCldO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRqYWNlbnRJbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhZGphY2VudEluc1tpXSA9PT0gcmFuZG9tQWRqYWNlbnRJbikge1xuICAgICAgICBjb25zdCB3YWxsQmV0d2VlbiA9IGdldFdhbGxCZXR3ZWVuKHJhbmRvbUZyb250aWVyTm9kZSwgcmFuZG9tQWRqYWNlbnRJbik7XG4gICAgICAgIGNvbnN0IGluZGV4VG9TcGxpY2UgPSBmcm9udGllci5pbmRleE9mKHJhbmRvbUZyb250aWVyTm9kZSk7XG4gICAgICAgIGNvbm5lY3QocmFuZG9tRnJvbnRpZXJOb2RlLCByYW5kb21BZGphY2VudEluLCB3YWxsQmV0d2Vlbik7XG4gICAgICAgIHZpc2l0ZWQucHVzaChyYW5kb21Gcm9udGllck5vZGUpO1xuICAgICAgICBmcm9udGllci5zcGxpY2UoaW5kZXhUb1NwbGljZSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZ2V0IHRoZSBuZWlnaGJvcnMgb2YgdGhlIGZyb250aWVyIG5vZGUgYW5kIGFkZCB0aGVtIHRvIGZyb250aWVyIGxpc3RcbiAgICBjb25zdCBuZWlnaGJvcnNUb0FkZCA9IGdldE5laWdoYm9ycyhyYW5kb21Gcm9udGllck5vZGUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmVpZ2hib3JzVG9BZGQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChuZWlnaGJvcnNUb0FkZFtpXSkge1xuICAgICAgICBpZiAoIXZpc2l0ZWQuaW5jbHVkZXMobmVpZ2hib3JzVG9BZGRbaV0pICYmICFmcm9udGllci5pbmNsdWRlcyhuZWlnaGJvcnNUb0FkZFtpXSkpIHtcbiAgICAgICAgICBmcm9udGllci5wdXNoKG5laWdoYm9yc1RvQWRkW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJhbmRvbU1hcChncmlkLCBkZWxheSkge1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5yYW5kb20oKTtcbiAgICAgIGlmIChyYW5kb20gPCAwLjMpIHtcbiAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7IC8vIG1hemUgZ2VuZXJhdGlvbiBmaW5pc2hlZFxufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcmVjdXJzaXZlRGl2aXNpb24oZ3JpZCwgZGVsYXkpIHtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG4gIGxldCBpc0ZpbmlzaGVkID0gZmFsc2U7IC8vIGlzIHJlY3Vyc2l2ZSBwcm9jZXNzIGZpbmlzaGVkP1xuXG4gIGZ1bmN0aW9uIHJhbmRvbUV2ZW4oYSwgYikge1xuICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChiIC0gYSArIDEpKSArIGE7XG4gICAgcmV0dXJuIHJhbmRvbSAlIDIgPT09IDAgPyByYW5kb20gOiByYW5kb20gKyAxO1xuICB9XG5cbiAgZnVuY3Rpb24gcmFuZG9tT2RkKGEsIGIpIHtcbiAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoYiAtIGEgKyAxKSkgKyBhO1xuICAgIHJldHVybiByYW5kb20gJSAyICE9PSAwID8gcmFuZG9tIDogcmFuZG9tICsgMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNob29zZU9yaWVudGF0aW9uKHN0YXJ0Um93LCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpIHtcbiAgICBjb25zdCB3aWR0aCA9IGVuZENvbCAtIHN0YXJ0Q29sO1xuICAgIGNvbnN0IGhlaWdodCA9IGVuZFJvdyAtIHN0YXJ0Um93O1xuICAgIGlmICh3aWR0aCA+IGhlaWdodCkge1xuICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgfSBlbHNlIGlmICh3aWR0aCA8IGhlaWdodCkge1xuICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICB9XG5cbiAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICByZXR1cm4gcmFuZG9tID09PSAwID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJztcbiAgfVxuXG4gIC8vIHNldCBlZGdlcyBvZiBncmlkIGFzIGJhcnJpZXJzXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHJvd3M7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgY29sKyspIHtcbiAgICAgIGlmIChyb3cgPT09IDAgfHwgcm93ID09PSByb3dzIC0gMSB8fCBjb2wgPT09IDAgfHwgY29sID09PSBjb2xzIC0gMSkge1xuICAgICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHRoZSByZWN1cnNpdmUgZnVuY3Rpb24gdG8gZGl2aWRlIHRoZSBncmlkXG4gIGFzeW5jIGZ1bmN0aW9uIGRpdmlkZShzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgZW5kQ29sKSB7XG4gICAgaWYgKGVuZENvbCAtIHN0YXJ0Q29sIDwgMSB8fCBlbmRSb3cgLSBzdGFydFJvdyA8IDEpIHtcbiAgICAgIC8vIGJhc2UgY2FzZSBpZiBzdWItbWF6ZSBpcyB0b28gc21hbGxcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3YWxsUm93ID0gcmFuZG9tRXZlbihzdGFydFJvdyArIDEsIGVuZFJvdyAtIDEpO1xuICAgIGNvbnN0IHdhbGxDb2wgPSByYW5kb21FdmVuKHN0YXJ0Q29sICsgMSwgZW5kQ29sIC0gMSk7XG5cbiAgICBjb25zdCBwYXNzYWdlUm93ID0gcmFuZG9tT2RkKHN0YXJ0Um93LCBlbmRSb3cpO1xuICAgIGNvbnN0IHBhc3NhZ2VDb2wgPSByYW5kb21PZGQoc3RhcnRDb2wsIGVuZENvbCk7XG5cbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGNob29zZU9yaWVudGF0aW9uKHN0YXJ0Um93LCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpO1xuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIC8vIG1ha2UgYSBob3Jpem9udGFsIHdhbGxcbiAgICAgIGZvciAobGV0IGNvbCA9IHN0YXJ0Q29sOyBjb2wgPD0gZW5kQ29sOyBjb2wrKykge1xuICAgICAgICBpZiAoY29sICE9PSBwYXNzYWdlQ29sKSB7XG4gICAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZ3JpZFt3YWxsUm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAvLyBtYWtlIGEgdmVydGljYWwgd2FsbFxuICAgICAgZm9yIChsZXQgcm93ID0gc3RhcnRSb3c7IHJvdyA8PSBlbmRSb3c7IHJvdysrKSB7XG4gICAgICAgIGlmIChyb3cgIT09IHBhc3NhZ2VSb3cpIHtcbiAgICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBncmlkW3Jvd11bd2FsbENvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBhd2FpdCBkaXZpZGUoc3RhcnRSb3csIHdhbGxSb3cgLSAxLCBzdGFydENvbCwgZW5kQ29sKTtcbiAgICAgIGF3YWl0IGRpdmlkZSh3YWxsUm93ICsgMSwgZW5kUm93LCBzdGFydENvbCwgZW5kQ29sKTtcbiAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICBhd2FpdCBkaXZpZGUoc3RhcnRSb3csIGVuZFJvdywgd2FsbENvbCArIDEsIGVuZENvbCk7XG4gICAgICBhd2FpdCBkaXZpZGUoc3RhcnRSb3csIGVuZFJvdywgc3RhcnRDb2wsIHdhbGxDb2wgLSAxKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB0aGlzIGlzIHRoZSBsYXN0IHJlY3Vyc2l2ZSBjYWxsXG4gICAgaWYgKHN0YXJ0Um93ID09PSAxICYmIGVuZFJvdyA9PT0gcm93cyAtIDIgJiYgc3RhcnRDb2wgPT09IDEgJiYgZW5kQ29sID09PSBjb2xzIC0gMikge1xuICAgICAgaXNGaW5pc2hlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgYXdhaXQgZGl2aWRlKDEsIHJvd3MgLSAyLCAxLCBjb2xzIC0gMik7XG5cbiAgcmV0dXJuIGlzRmluaXNoZWQ7IC8vIG1hemUgZ2VuZXJhdGlvbiBmaW5pc2hlZFxufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gc2lkZXdpbmRlcihncmlkLCBkZWxheSkge1xuICBjb25zdCByb3dzID0gZ3JpZC5sZW5ndGg7XG4gIGNvbnN0IGNvbHMgPSBncmlkWzBdLmxlbmd0aDtcblxuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCByb3dzOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgICBpZiAocm93ID09PSAxICYmIGNvbCAhPT0gMCAmJiBjb2wgIT09IGNvbHMgLSAxKSBjb250aW51ZTtcbiAgICAgIGlmIChjb2wgJSAyID09PSAwKSB7XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgICB9XG4gICAgICBpZiAocm93ICUgMiA9PT0gMCkge1xuICAgICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8IHJvd3M7IHJvdysrKSB7XG4gICAgbGV0IHJ1biA9IFtdO1xuICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8IGNvbHM7IGNvbCArPSAyKSB7XG4gICAgICBpZiAocm93ICUgMiA9PT0gMCkgY29udGludWU7XG5cbiAgICAgIGlmIChyb3cgPT09IDEpIHtcbiAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGdyaWRbcm93XVtjb2xdO1xuICAgICAgcnVuLnB1c2goY3VycmVudE5vZGUpO1xuXG4gICAgICBpZiAoY29sIDwgY29scyAtIDEpIHtcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjYgJiYgY29sICE9PSBjb2xzIC0gMikge1xuICAgICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnROb2RlLm5laWdoYm9yc1swXS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgICAgfSBlbHNlIGlmIChydW4ubGVuZ3RoID4gMCAmJiByb3cgPiAxKSB7XG4gICAgICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBydW4ubGVuZ3RoKTtcbiAgICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBydW5bcmFuZG9tSW5kZXhdLm5laWdoYm9yc1szXS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgICAgICBydW4gPSBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJpbXBvcnQgRG9tSGFuZGxlciBmcm9tICcuL2RvbWhhbmRsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2RlIHtcbiAgY29uc3RydWN0b3Iocm93LCBjb2wsIHRvdGFsUm93cywgdG90YWxDb2xzLCBncmlkLCBub2RlU2l6ZSkge1xuICAgIHRoaXMubm9kZVdpZHRoID0gbnVsbDtcbiAgICB0aGlzLnNldE5vZGVXaWR0aChub2RlU2l6ZSk7IC8vIHB4IHdpZHRoIGFuZCBoZWlnaHQgb2Ygc3F1YXJlXG4gICAgdGhpcy50b3RhbFJvd3MgPSB0b3RhbFJvd3M7XG4gICAgdGhpcy50b3RhbENvbHMgPSB0b3RhbENvbHM7XG4gICAgdGhpcy5yb3cgPSByb3c7XG4gICAgdGhpcy5jb2wgPSBjb2w7XG4gICAgdGhpcy55ID0gdGhpcy5yb3cgKiB0aGlzLm5vZGVXaWR0aDtcbiAgICB0aGlzLnggPSB0aGlzLmNvbCAqIHRoaXMubm9kZVdpZHRoO1xuICAgIHRoaXMubm9kZVR5cGUgPSAnZW1wdHknOyAvLyB1c2VkIHRvIHVwZGF0ZSBzcXVhcmUgZGlzcGxheSBvbiBkb20gZS5nIHN0YXJ0LCBlbmQgb3IgYmFycmllclxuICAgIHRoaXMubmVpZ2hib3JzID0gW107XG4gICAgdGhpcy5wcmV2aW91c05vZGUgPSBudWxsO1xuICAgIHRoaXMuZ3JpZCA9IGdyaWQ7XG5cbiAgICAvLyBhc3RhciBzY29yZXNcbiAgICB0aGlzLmYgPSAwO1xuICAgIHRoaXMuZyA9IDA7XG4gICAgdGhpcy5oID0gMDtcbiAgfVxuXG4gIHNldE5vZGVXaWR0aChub2RlU2l6ZSkge1xuICAgIGlmIChub2RlU2l6ZSA9PT0gJ3NtYWxsJykge1xuICAgICAgdGhpcy5ub2RlV2lkdGggPSA4MDtcbiAgICB9IGVsc2UgaWYgKG5vZGVTaXplID09PSAnbWVkaXVtJykge1xuICAgICAgdGhpcy5ub2RlV2lkdGggPSAzMDtcbiAgICB9IGVsc2UgaWYgKG5vZGVTaXplID09PSAnbGFyZ2UnKSB7XG4gICAgICB0aGlzLm5vZGVXaWR0aCA9IDE1O1xuICAgIH1cbiAgfVxuXG4gIHNldE5vZGVUeXBlKG5ld05vZGVUeXBlKSB7XG4gICAgdGhpcy5ub2RlVHlwZSA9IG5ld05vZGVUeXBlO1xuICAgIERvbUhhbmRsZXIuZGlzcGxheUFsZ29yaXRobSh0aGlzLCB0aGlzLmdyaWQsIHRoaXMubm9kZVdpZHRoKTtcbiAgfVxuXG4gIC8vIGNhbGMgZiwgZyBhbmQgaCBzY29yZXNcbiAgY2FsY1Njb3JlcyhzdGFydE5vZGUsIGVuZE5vZGUpIHtcbiAgICB0aGlzLmcgPSBNYXRoLmFicyh0aGlzLnggLSBzdGFydE5vZGUueCkgKyBNYXRoLmFicyh0aGlzLnkgLSBzdGFydE5vZGUueSk7XG4gICAgdGhpcy5oID0gTWF0aC5hYnModGhpcy54IC0gZW5kTm9kZS54KSArIE1hdGguYWJzKHRoaXMueSAtIGVuZE5vZGUueSk7XG4gICAgdGhpcy5mID0gdGhpcy5nICsgdGhpcy5oO1xuICAgIHJldHVybiB0aGlzLmY7XG4gIH1cblxuICBzZXROZWlnaGJvcnMoZ3JpZCkge1xuICAgIGNvbnN0IHRlbXBSb3cgPSB0aGlzLnJvdyAtIDE7XG4gICAgY29uc3QgdGVtcENvbCA9IHRoaXMuY29sIC0gMTtcblxuICAgIGlmICh0ZW1wQ29sIDwgdGhpcy50b3RhbENvbHMgLSAxKSB7XG4gICAgICAvLyByaWdodFxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3ddW3RlbXBDb2wgKyAxXSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbXBDb2wgPiAwKSB7XG4gICAgICAvLyBsZWZ0XG4gICAgICB0aGlzLm5laWdoYm9ycy5wdXNoKGdyaWRbdGVtcFJvd11bdGVtcENvbCAtIDFdKTtcbiAgICB9XG5cbiAgICBpZiAodGVtcFJvdyA8IHRoaXMudG90YWxSb3dzIC0gMSkge1xuICAgICAgLy8gZG93blxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3cgKyAxXVt0ZW1wQ29sXSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbXBSb3cgPiAwKSB7XG4gICAgICAvLyB1cFxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3cgLSAxXVt0ZW1wQ29sXSk7XG4gICAgfVxuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9zY3NzL21haW4uc2Nzcyc7XG5pbXBvcnQgbG9hZCBmcm9tICcuL21haW5oYW5kbGVyJztcblxubG9hZCgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
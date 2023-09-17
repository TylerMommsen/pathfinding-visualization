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
function astar(startNode, endNode) {
  return new Promise((resolve) => {
    const openList = [];
    const closedList = [];
    const finalPath = [];
    let animationFrameId = null;

    function removeFromArr(node) {
      for (let i = 0; i < openList.length; i++) {
        if (openList[i] === node) {
          openList.splice(i, 1);
        }
      }
    }

    openList.push(startNode);
    startNode.setNodeType('open-list');
    function algorithm() {
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
        temp.setNodeType('final-path');
        while (temp.previousNode) {
          finalPath.push(temp.previousNode);
          temp.previousNode.setNodeType('final-path');
          temp = temp.previousNode;
        }
        resolve(true);
        return;
      }

      closedList.push(currentNode);
      currentNode.setNodeType('closed-list');
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
            currNeighbor.setNodeType('open-list');
          }

          currNeighbor.previousNode = currentNode;
        }
      }

      if (openList.length > 0) {
        animationFrameId = requestAnimationFrame(algorithm);
      } else {
        resolve(false);
      }
    }

    algorithm();
  });
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
function dijkstra(grid, startNode, endNode) {
  return new Promise((resolve) => {
    const openListQueue = []; // tracks nodes to visit
    const closedList = [];
    const finalPath = [];
    let animationFrameId = null;

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        grid[row][col].g = Infinity;
      }
    }

    startNode.g = 0;
    openListQueue.push(startNode);
    startNode.setNodeType('open-list');

    function algorithm() {
      const currentNode = openListQueue.shift();
      currentNode.setNodeType('closed-list');

      if (currentNode === endNode) {
        let temp = currentNode;
        finalPath.push(temp);
        temp.setNodeType('final-path');
        while (temp.previousNode) {
          finalPath.push(temp.previousNode);
          temp.previousNode.setNodeType('final-path');
          temp = temp.previousNode;
        }
        resolve(true);
        return;
      }

      for (let i = 0; i < currentNode.neighbors.length; i++) {
        const currNeighbor = currentNode.neighbors[i];

        if (currNeighbor.nodeType !== 'barrier' && !closedList.includes(currNeighbor)) {
          if (currNeighbor.g === Infinity) {
            currNeighbor.g = currentNode.g + 1;
            currNeighbor.previousNode = currentNode;
            openListQueue.push(currNeighbor);
            currNeighbor.setNodeType('open-list');
          }
        }
      }

      if (openListQueue.length > 0) {
        animationFrameId = requestAnimationFrame(algorithm);
      } else {
        resolve(false);
      }
    }

    algorithm();
  });
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

function displayAlgorithm(node, grid) {
  const domSquare = grid.findDomSquare(node.row - 1, node.col - 1);
  domSquare.removeAttribute('class');
  domSquare.classList.add('grid-square');
  domSquare.classList.add(node.nodeType);
}

function displayGrid(grid) {
  const gridContainer = document.querySelector('.grid-container');
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const gridSquare = document.createElement('div');
      gridSquare.classList.add('grid-square');
      gridSquare.classList.add('empty');
      gridContainer.appendChild(gridSquare);
    }
  }
}

function resetGrid() {
  const gridContainer = document.querySelector('.grid-container');
  const gridContainerChildren = gridContainer.querySelectorAll('.grid-square');

  for (let i = 0; i < gridContainerChildren.length; i++) {
    gridContainerChildren[i].removeAttribute('class');
    gridContainerChildren[i].classList.add('grid-square');
    gridContainerChildren[i].classList.add('empty');
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
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
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
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
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
        currentRow.push(new _node__WEBPACK_IMPORTED_MODULE_0__["default"](row, col, this));
      }
      this.grid.push(currentRow);
    }
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].displayGrid(this.grid);
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
        currentRow.push(new _node__WEBPACK_IMPORTED_MODULE_0__["default"](row, col, this));
      }
      this.grid.push(currentRow);
    }

    // setting neighbours again
    this.setAllNodeNeighbors();

    // resetting start and end node
    this.start.node = null;
    this.end.node = null;

    // reseting dom squares
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].resetGrid();
  }
}


/***/ }),

/***/ "./src/mainloop.js":
/*!*************************!*\
  !*** ./src/mainloop.js ***!
  \*************************/
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








let gridObj = null;
const ROWS = 25;
const COLS = 61;
let selectedAlgorithm = null;
let selectedMaze = null;
const running = [false]; // check if algorithm is currently running

function loadGrid() {
  gridObj = new _grid__WEBPACK_IMPORTED_MODULE_0__["default"](ROWS, COLS);
}

async function runAStar() {
  const startNode = gridObj.start.node;
  const endNode = gridObj.end.node;

  try {
    running[0] = true;
    const pathFound = await (0,_algorithms_astar__WEBPACK_IMPORTED_MODULE_1__["default"])(startNode, endNode);

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
    const pathFound = await (0,_algorithms_dijkstra__WEBPACK_IMPORTED_MODULE_2__["default"])(gridObj.grid, startNode, endNode);

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
  if (running[0]) return; // algorithm in progress
  gridObj.setAllNodeNeighbors();

  if (gridObj.start.node && gridObj.end.node) {
    if (selectedAlgorithm === 'A*') runAStar();
    if (selectedAlgorithm === 'Dijkstra') runDijkstra();
  }
});

const generateMazeBtn = document.querySelector('.generate-maze');

generateMazeBtn.addEventListener('click', async () => {
  if (running[0]) return; // algorithm in progress
  running[0] = true;
  gridObj.resetGrid();

  let done;
  if (selectedMaze === 'Random Map') {
    done = await (0,_mazes_randommap__WEBPACK_IMPORTED_MODULE_3__["default"])(gridObj.grid);
  }
  if (selectedMaze === 'Binary Tree') {
    done = await (0,_mazes_binarytree__WEBPACK_IMPORTED_MODULE_4__["default"])(gridObj.grid);
  }
  if (selectedMaze === 'Sidewinder') {
    done = await (0,_mazes_sidewinder__WEBPACK_IMPORTED_MODULE_5__["default"])(gridObj.grid);
  }
  if (selectedMaze === 'Recursive Division') {
    done = await (0,_mazes_recursivedivision__WEBPACK_IMPORTED_MODULE_6__["default"])(gridObj.grid);
  }
  if (done) running[0] = false;
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
    if (running[0]) return; // algorithm in progress
    gridObj.resetGrid();
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
async function binaryTree(grid) {
  const delay = 0.1;

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
      await new Promise((resolve) => setTimeout(resolve, delay));

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

/***/ "./src/mazes/randommap.js":
/*!********************************!*\
  !*** ./src/mazes/randommap.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ randomMap)
/* harmony export */ });
function randomMap(grid) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const random = Math.random();
      if (random < 0.3) {
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
async function recursiveDivision(grid) {
  const delay = 10;
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

    await new Promise((resolve) => setTimeout(resolve, delay));

    const wallRow = randomEven(startRow + 1, endRow - 1);
    const wallCol = randomEven(startCol + 1, endCol - 1);

    const passageRow = randomOdd(startRow, endRow);
    const passageCol = randomOdd(startCol, endCol);

    const orientation = chooseOrientation(startRow, endRow, startCol, endCol);

    if (orientation === 'horizontal') {
      // make a horizontal wall
      for (let col = startCol; col <= endCol; col++) {
        if (col !== passageCol) {
          grid[wallRow][col].setNodeType('barrier');
        }
      }
    } else if (orientation === 'vertical') {
      // make a vertical wall
      for (let row = startRow; row <= endRow; row++) {
        if (row !== passageRow) {
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
async function sidewinder(grid) {
  const delay = 0.1;
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

      await new Promise((resolve) => setTimeout(resolve, delay));
      if (row === 1) {
        grid[row][col].setNodeType('empty');
        continue;
      }

      const currentNode = grid[row][col];
      run.push(currentNode);

      if (col < cols - 1) {
        if (Math.random() < 0.6 && col !== cols - 2) {
          currentNode.neighbors[0].setNodeType('empty');
        } else if (run.length > 0 && row > 1) {
          const randomIndex = Math.floor(Math.random() * run.length);
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
  constructor(row, col, grid) {
    this.nodeWidth = 30; // px width and height of square
    this.totalRows = 25;
    this.totalCols = 60;
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

  setNodeType(newNodeType) {
    this.nodeType = newNodeType;
    _domhandler__WEBPACK_IMPORTED_MODULE_0__["default"].displayAlgorithm(this, this.grid);
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

    if (tempCol < this.totalCols) {
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
/* harmony import */ var _mainloop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mainloop */ "./src/mainloop.js");



(0,_mainloop__WEBPACK_IMPORTED_MODULE_1__["default"])();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ04wQjtBQUNJOztBQUU5QixxREFBSSIsInNvdXJjZXMiOlsid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvc2Nzcy9tYWluLnNjc3MiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9hbGdvcml0aG1zL2FzdGFyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvYWxnb3JpdGhtcy9kaWprc3RyYS5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2RvbWhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9ncmlkLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWFpbmxvb3AuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9iaW5hcnl0cmVlLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvcmFuZG9tbWFwLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvcmVjdXJzaXZlZGl2aXNpb24uanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9zaWRld2luZGVyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbm9kZS5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhc3RhcihzdGFydE5vZGUsIGVuZE5vZGUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY29uc3Qgb3Blbkxpc3QgPSBbXTtcbiAgICBjb25zdCBjbG9zZWRMaXN0ID0gW107XG4gICAgY29uc3QgZmluYWxQYXRoID0gW107XG4gICAgbGV0IGFuaW1hdGlvbkZyYW1lSWQgPSBudWxsO1xuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRnJvbUFycihub2RlKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wZW5MaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChvcGVuTGlzdFtpXSA9PT0gbm9kZSkge1xuICAgICAgICAgIG9wZW5MaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIG9wZW5MaXN0LnB1c2goc3RhcnROb2RlKTtcbiAgICBzdGFydE5vZGUuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcpO1xuICAgIGZ1bmN0aW9uIGFsZ29yaXRobSgpIHtcbiAgICAgIGxldCBjdXJyZW50Tm9kZSA9IG51bGw7XG4gICAgICBsZXQgbG93ZXN0RiA9IEluZmluaXR5O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcGVuTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBvcGVuTGlzdFtpXS5jYWxjU2NvcmVzKHN0YXJ0Tm9kZSwgZW5kTm9kZSk7XG4gICAgICAgIGlmIChvcGVuTGlzdFtpXS5mIDwgbG93ZXN0Rikge1xuICAgICAgICAgIGxvd2VzdEYgPSBvcGVuTGlzdFtpXS5mO1xuICAgICAgICAgIGN1cnJlbnROb2RlID0gb3Blbkxpc3RbaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGN1cnJlbnROb2RlID09PSBlbmROb2RlKSB7XG4gICAgICAgIGxldCB0ZW1wID0gY3VycmVudE5vZGU7XG4gICAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXApO1xuICAgICAgICB0ZW1wLnNldE5vZGVUeXBlKCdmaW5hbC1wYXRoJyk7XG4gICAgICAgIHdoaWxlICh0ZW1wLnByZXZpb3VzTm9kZSkge1xuICAgICAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXAucHJldmlvdXNOb2RlKTtcbiAgICAgICAgICB0ZW1wLnByZXZpb3VzTm9kZS5zZXROb2RlVHlwZSgnZmluYWwtcGF0aCcpO1xuICAgICAgICAgIHRlbXAgPSB0ZW1wLnByZXZpb3VzTm9kZTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNsb3NlZExpc3QucHVzaChjdXJyZW50Tm9kZSk7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnY2xvc2VkLWxpc3QnKTtcbiAgICAgIHJlbW92ZUZyb21BcnIoY3VycmVudE5vZGUpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnROb2RlLm5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyTmVpZ2hib3IgPSBjdXJyZW50Tm9kZS5uZWlnaGJvcnNbaV07XG5cbiAgICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ2JhcnJpZXInICYmICFjbG9zZWRMaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgICBjb25zdCB0ZW1wRyA9IGN1cnJlbnROb2RlLmcgKyAxO1xuICAgICAgICAgIGlmIChvcGVuTGlzdC5pbmNsdWRlcyhjdXJyTmVpZ2hib3IpKSB7XG4gICAgICAgICAgICBpZiAodGVtcEcgPCBjdXJyTmVpZ2hib3IuZykge1xuICAgICAgICAgICAgICBjdXJyTmVpZ2hib3IuZyA9IHRlbXBHO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3IuZyA9IHRlbXBHO1xuICAgICAgICAgICAgb3Blbkxpc3QucHVzaChjdXJyTmVpZ2hib3IpO1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLnNldE5vZGVUeXBlKCdvcGVuLWxpc3QnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjdXJyTmVpZ2hib3IucHJldmlvdXNOb2RlID0gY3VycmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wZW5MaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgYW5pbWF0aW9uRnJhbWVJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhbGdvcml0aG0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxnb3JpdGhtKCk7XG4gIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGlqa3N0cmEoZ3JpZCwgc3RhcnROb2RlLCBlbmROb2RlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNvbnN0IG9wZW5MaXN0UXVldWUgPSBbXTsgLy8gdHJhY2tzIG5vZGVzIHRvIHZpc2l0XG4gICAgY29uc3QgY2xvc2VkTGlzdCA9IFtdO1xuICAgIGNvbnN0IGZpbmFsUGF0aCA9IFtdO1xuICAgIGxldCBhbmltYXRpb25GcmFtZUlkID0gbnVsbDtcblxuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uZyA9IEluZmluaXR5O1xuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXJ0Tm9kZS5nID0gMDtcbiAgICBvcGVuTGlzdFF1ZXVlLnB1c2goc3RhcnROb2RlKTtcbiAgICBzdGFydE5vZGUuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcpO1xuXG4gICAgZnVuY3Rpb24gYWxnb3JpdGhtKCkge1xuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBvcGVuTGlzdFF1ZXVlLnNoaWZ0KCk7XG4gICAgICBjdXJyZW50Tm9kZS5zZXROb2RlVHlwZSgnY2xvc2VkLWxpc3QnKTtcblxuICAgICAgaWYgKGN1cnJlbnROb2RlID09PSBlbmROb2RlKSB7XG4gICAgICAgIGxldCB0ZW1wID0gY3VycmVudE5vZGU7XG4gICAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXApO1xuICAgICAgICB0ZW1wLnNldE5vZGVUeXBlKCdmaW5hbC1wYXRoJyk7XG4gICAgICAgIHdoaWxlICh0ZW1wLnByZXZpb3VzTm9kZSkge1xuICAgICAgICAgIGZpbmFsUGF0aC5wdXNoKHRlbXAucHJldmlvdXNOb2RlKTtcbiAgICAgICAgICB0ZW1wLnByZXZpb3VzTm9kZS5zZXROb2RlVHlwZSgnZmluYWwtcGF0aCcpO1xuICAgICAgICAgIHRlbXAgPSB0ZW1wLnByZXZpb3VzTm9kZTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudE5vZGUubmVpZ2hib3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJOZWlnaGJvciA9IGN1cnJlbnROb2RlLm5laWdoYm9yc1tpXTtcblxuICAgICAgICBpZiAoY3Vyck5laWdoYm9yLm5vZGVUeXBlICE9PSAnYmFycmllcicgJiYgIWNsb3NlZExpc3QuaW5jbHVkZXMoY3Vyck5laWdoYm9yKSkge1xuICAgICAgICAgIGlmIChjdXJyTmVpZ2hib3IuZyA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGN1cnJOZWlnaGJvci5nID0gY3VycmVudE5vZGUuZyArIDE7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3IucHJldmlvdXNOb2RlID0gY3VycmVudE5vZGU7XG4gICAgICAgICAgICBvcGVuTGlzdFF1ZXVlLnB1c2goY3Vyck5laWdoYm9yKTtcbiAgICAgICAgICAgIGN1cnJOZWlnaGJvci5zZXROb2RlVHlwZSgnb3Blbi1saXN0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvcGVuTGlzdFF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYW5pbWF0aW9uRnJhbWVJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhbGdvcml0aG0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxnb3JpdGhtKCk7XG4gIH0pO1xufVxuIiwiZnVuY3Rpb24gdXBkYXRlU3F1YXJlKGdyaWRTcXVhcmUsIG5vZGVUeXBlKSB7XG4gIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZChub2RlVHlwZSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlBbGdvcml0aG0obm9kZSwgZ3JpZCkge1xuICBjb25zdCBkb21TcXVhcmUgPSBncmlkLmZpbmREb21TcXVhcmUobm9kZS5yb3cgLSAxLCBub2RlLmNvbCAtIDEpO1xuICBkb21TcXVhcmUucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICBkb21TcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgZG9tU3F1YXJlLmNsYXNzTGlzdC5hZGQobm9kZS5ub2RlVHlwZSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlHcmlkKGdyaWQpIHtcbiAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLWNvbnRhaW5lcicpO1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgY29uc3QgZ3JpZFNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdncmlkLXNxdWFyZScpO1xuICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xuICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChncmlkU3F1YXJlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzZXRHcmlkKCkge1xuICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyaWQtY29udGFpbmVyJyk7XG4gIGNvbnN0IGdyaWRDb250YWluZXJDaGlsZHJlbiA9IGdyaWRDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlJyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmlkQ29udGFpbmVyQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBncmlkQ29udGFpbmVyQ2hpbGRyZW5baV0ucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgIGdyaWRDb250YWluZXJDaGlsZHJlbltpXS5jbGFzc0xpc3QuYWRkKCdncmlkLXNxdWFyZScpO1xuICAgIGdyaWRDb250YWluZXJDaGlsZHJlbltpXS5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xuICB9XG59XG5cbmNvbnN0IERvbUhhbmRsZXIgPSB7XG4gIGRpc3BsYXlHcmlkLFxuICB1cGRhdGVTcXVhcmUsXG4gIGRpc3BsYXlBbGdvcml0aG0sXG4gIHJlc2V0R3JpZCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERvbUhhbmRsZXI7XG4iLCJpbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnO1xuaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb21oYW5kbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZCB7XG4gIGNvbnN0cnVjdG9yKHJvd3MsIGNvbHMpIHtcbiAgICB0aGlzLnJvd3MgPSByb3dzO1xuICAgIHRoaXMuY29scyA9IGNvbHM7XG4gICAgdGhpcy5zdGFydCA9IHsgbm9kZTogbnVsbCB9O1xuICAgIHRoaXMuZW5kID0geyBub2RlOiBudWxsIH07XG4gICAgdGhpcy5ncmlkID0gW107XG4gICAgdGhpcy5vcGVuTGlzdCA9IFtdO1xuICAgIHRoaXMuY2xvc2VkTGlzdCA9IFtdO1xuICAgIHRoaXMuZmluYWxQYXRoID0gW107XG4gICAgdGhpcy5jcmVhdGVHcmlkKHRoaXMucm93cywgdGhpcy5jb2xzKTtcblxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICB9XG5cbiAgc2V0U3F1YXJlU3RhdHVzKGdyaWRTcXVhcmUsIHJvdywgY29sKSB7XG4gICAgY29uc3QgY3VycmVudE5vZGUgPSB0aGlzLmdyaWRbcm93XVtjb2xdO1xuICAgIGlmIChjdXJyZW50Tm9kZS5ub2RlVHlwZSAhPT0gJ2VtcHR5JykgcmV0dXJuO1xuICAgIGlmICh0aGlzLnN0YXJ0Lm5vZGUgPT09IG51bGwpIHtcbiAgICAgIGN1cnJlbnROb2RlLm5vZGVUeXBlID0gJ3N0YXJ0JztcbiAgICAgIHRoaXMuc3RhcnQubm9kZSA9IGN1cnJlbnROb2RlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lbmQubm9kZSA9PT0gbnVsbCkge1xuICAgICAgY3VycmVudE5vZGUubm9kZVR5cGUgPSAnZW5kJztcbiAgICAgIHRoaXMuZW5kLm5vZGUgPSBjdXJyZW50Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudE5vZGUubm9kZVR5cGUgPSAnYmFycmllcic7XG4gICAgfVxuICAgIERvbUhhbmRsZXIudXBkYXRlU3F1YXJlKGdyaWRTcXVhcmUsIGN1cnJlbnROb2RlLm5vZGVUeXBlKTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlRG93bihncmlkU3F1YXJlLCByb3csIGNvbCkge1xuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgdGhpcy5zZXRTcXVhcmVTdGF0dXMoZ3JpZFNxdWFyZSwgcm93LCBjb2wpO1xuICB9XG5cbiAgaGFuZGxlTW91c2VNb3ZlKGdyaWRTcXVhcmUsIHJvdywgY29sKSB7XG4gICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xuICAgICAgdGhpcy5zZXRTcXVhcmVTdGF0dXMoZ3JpZFNxdWFyZSwgcm93LCBjb2wpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1vdXNlVXAoKSB7XG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gIH1cblxuICBmaW5kRG9tU3F1YXJlKHJvdywgY29sKSB7XG4gICAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLWNvbnRhaW5lcicpO1xuICAgIGNvbnN0IGdyaWRDb250YWluZXJDaGlsZHJlbiA9IGdyaWRDb250YWluZXIuY2hpbGRyZW47XG4gICAgY29uc3QgaW5kZXggPSByb3cgKiB0aGlzLmNvbHMgKyBjb2w7XG4gICAgcmV0dXJuIGdyaWRDb250YWluZXJDaGlsZHJlbltpbmRleF07XG4gIH1cblxuICBhZGRMaXN0ZW5lcnMoY3VycmVudGx5UnVubmluZykge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLmdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICAgIGNvbnN0IGdyaWRTcXVhcmUgPSB0aGlzLmZpbmREb21TcXVhcmUocm93LCBjb2wpO1xuICAgICAgICBncmlkU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHtcbiAgICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ1swXSkgcmV0dXJuO1xuICAgICAgICAgIHRoaXMuaGFuZGxlTW91c2VEb3duKGdyaWRTcXVhcmUsIHJvdywgY29sKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGdyaWRTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKCkgPT4ge1xuICAgICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nWzBdKSByZXR1cm47XG4gICAgICAgICAgdGhpcy5oYW5kbGVNb3VzZU1vdmUoZ3JpZFNxdWFyZSwgcm93LCBjb2wpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVNb3VzZVVwKCk7XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVHcmlkKHJvd3MsIGNvbHMpIHtcbiAgICBmb3IgKGxldCByb3cgPSAxOyByb3cgPD0gcm93czsgcm93KyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBbXTtcbiAgICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8PSBjb2xzOyBjb2wrKykge1xuICAgICAgICBjdXJyZW50Um93LnB1c2gobmV3IE5vZGUocm93LCBjb2wsIHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ3JpZC5wdXNoKGN1cnJlbnRSb3cpO1xuICAgIH1cbiAgICBEb21IYW5kbGVyLmRpc3BsYXlHcmlkKHRoaXMuZ3JpZCk7XG4gIH1cblxuICBzZXRBbGxOb2RlTmVpZ2hib3JzKCkge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLmdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICAgIHRoaXMuZ3JpZFtyb3ddW2NvbF0uc2V0TmVpZ2hib3JzKHRoaXMuZ3JpZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzZXRHcmlkKCkge1xuICAgIC8vIGNyZWF0aW5nIG5ldyBncmlkXG4gICAgdGhpcy5ncmlkID0gW107XG4gICAgZm9yIChsZXQgcm93ID0gMTsgcm93IDw9IHRoaXMucm93czsgcm93KyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBbXTtcbiAgICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8PSB0aGlzLmNvbHM7IGNvbCsrKSB7XG4gICAgICAgIGN1cnJlbnRSb3cucHVzaChuZXcgTm9kZShyb3csIGNvbCwgdGhpcykpO1xuICAgICAgfVxuICAgICAgdGhpcy5ncmlkLnB1c2goY3VycmVudFJvdyk7XG4gICAgfVxuXG4gICAgLy8gc2V0dGluZyBuZWlnaGJvdXJzIGFnYWluXG4gICAgdGhpcy5zZXRBbGxOb2RlTmVpZ2hib3JzKCk7XG5cbiAgICAvLyByZXNldHRpbmcgc3RhcnQgYW5kIGVuZCBub2RlXG4gICAgdGhpcy5zdGFydC5ub2RlID0gbnVsbDtcbiAgICB0aGlzLmVuZC5ub2RlID0gbnVsbDtcblxuICAgIC8vIHJlc2V0aW5nIGRvbSBzcXVhcmVzXG4gICAgRG9tSGFuZGxlci5yZXNldEdyaWQoKTtcbiAgfVxufVxuIiwiaW1wb3J0IEdyaWQgZnJvbSAnLi9ncmlkJztcbmltcG9ydCBhc3RhciBmcm9tICcuL2FsZ29yaXRobXMvYXN0YXInO1xuaW1wb3J0IGRpamtzdHJhIGZyb20gJy4vYWxnb3JpdGhtcy9kaWprc3RyYSc7XG5pbXBvcnQgcmFuZG9tTWFwIGZyb20gJy4vbWF6ZXMvcmFuZG9tbWFwJztcbmltcG9ydCBiaW5hcnlUcmVlIGZyb20gJy4vbWF6ZXMvYmluYXJ5dHJlZSc7XG5pbXBvcnQgc2lkZXdpbmRlciBmcm9tICcuL21hemVzL3NpZGV3aW5kZXInO1xuaW1wb3J0IHJlY3Vyc2l2ZURpdmlzaW9uIGZyb20gJy4vbWF6ZXMvcmVjdXJzaXZlZGl2aXNpb24nO1xuXG5sZXQgZ3JpZE9iaiA9IG51bGw7XG5jb25zdCBST1dTID0gMjU7XG5jb25zdCBDT0xTID0gNjE7XG5sZXQgc2VsZWN0ZWRBbGdvcml0aG0gPSBudWxsO1xubGV0IHNlbGVjdGVkTWF6ZSA9IG51bGw7XG5jb25zdCBydW5uaW5nID0gW2ZhbHNlXTsgLy8gY2hlY2sgaWYgYWxnb3JpdGhtIGlzIGN1cnJlbnRseSBydW5uaW5nXG5cbmZ1bmN0aW9uIGxvYWRHcmlkKCkge1xuICBncmlkT2JqID0gbmV3IEdyaWQoUk9XUywgQ09MUyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bkFTdGFyKCkge1xuICBjb25zdCBzdGFydE5vZGUgPSBncmlkT2JqLnN0YXJ0Lm5vZGU7XG4gIGNvbnN0IGVuZE5vZGUgPSBncmlkT2JqLmVuZC5ub2RlO1xuXG4gIHRyeSB7XG4gICAgcnVubmluZ1swXSA9IHRydWU7XG4gICAgY29uc3QgcGF0aEZvdW5kID0gYXdhaXQgYXN0YXIoc3RhcnROb2RlLCBlbmROb2RlKTtcblxuICAgIGlmIChwYXRoRm91bmQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmb3VuZCBwYXRoJyk7XG4gICAgICBydW5uaW5nWzBdID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdwYXRoIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0gZmluYWxseSB7XG4gICAgcnVubmluZ1swXSA9IGZhbHNlO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bkRpamtzdHJhKCkge1xuICBjb25zdCBzdGFydE5vZGUgPSBncmlkT2JqLnN0YXJ0Lm5vZGU7XG4gIGNvbnN0IGVuZE5vZGUgPSBncmlkT2JqLmVuZC5ub2RlO1xuXG4gIHRyeSB7XG4gICAgcnVubmluZ1swXSA9IHRydWU7XG4gICAgY29uc3QgcGF0aEZvdW5kID0gYXdhaXQgZGlqa3N0cmEoZ3JpZE9iai5ncmlkLCBzdGFydE5vZGUsIGVuZE5vZGUpO1xuXG4gICAgaWYgKHBhdGhGb3VuZCkge1xuICAgICAgY29uc29sZS5sb2coJ2ZvdW5kIHBhdGgnKTtcbiAgICAgIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3BhdGggbm90IGZvdW5kJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBydW5uaW5nWzBdID0gZmFsc2U7XG4gIH1cbn1cblxuY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnQtYWxnb3JpdGhtJyk7XG5cbnN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICBpZiAocnVubmluZ1swXSkgcmV0dXJuOyAvLyBhbGdvcml0aG0gaW4gcHJvZ3Jlc3NcbiAgZ3JpZE9iai5zZXRBbGxOb2RlTmVpZ2hib3JzKCk7XG5cbiAgaWYgKGdyaWRPYmouc3RhcnQubm9kZSAmJiBncmlkT2JqLmVuZC5ub2RlKSB7XG4gICAgaWYgKHNlbGVjdGVkQWxnb3JpdGhtID09PSAnQSonKSBydW5BU3RhcigpO1xuICAgIGlmIChzZWxlY3RlZEFsZ29yaXRobSA9PT0gJ0RpamtzdHJhJykgcnVuRGlqa3N0cmEoKTtcbiAgfVxufSk7XG5cbmNvbnN0IGdlbmVyYXRlTWF6ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nZW5lcmF0ZS1tYXplJyk7XG5cbmdlbmVyYXRlTWF6ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjsgLy8gYWxnb3JpdGhtIGluIHByb2dyZXNzXG4gIHJ1bm5pbmdbMF0gPSB0cnVlO1xuICBncmlkT2JqLnJlc2V0R3JpZCgpO1xuXG4gIGxldCBkb25lO1xuICBpZiAoc2VsZWN0ZWRNYXplID09PSAnUmFuZG9tIE1hcCcpIHtcbiAgICBkb25lID0gYXdhaXQgcmFuZG9tTWFwKGdyaWRPYmouZ3JpZCk7XG4gIH1cbiAgaWYgKHNlbGVjdGVkTWF6ZSA9PT0gJ0JpbmFyeSBUcmVlJykge1xuICAgIGRvbmUgPSBhd2FpdCBiaW5hcnlUcmVlKGdyaWRPYmouZ3JpZCk7XG4gIH1cbiAgaWYgKHNlbGVjdGVkTWF6ZSA9PT0gJ1NpZGV3aW5kZXInKSB7XG4gICAgZG9uZSA9IGF3YWl0IHNpZGV3aW5kZXIoZ3JpZE9iai5ncmlkKTtcbiAgfVxuICBpZiAoc2VsZWN0ZWRNYXplID09PSAnUmVjdXJzaXZlIERpdmlzaW9uJykge1xuICAgIGRvbmUgPSBhd2FpdCByZWN1cnNpdmVEaXZpc2lvbihncmlkT2JqLmdyaWQpO1xuICB9XG4gIGlmIChkb25lKSBydW5uaW5nWzBdID0gZmFsc2U7XG59KTtcblxuZnVuY3Rpb24gYWRkTGlzdGVuZXJzVG9CdG5zKCkge1xuICBjb25zdCBkcm9wZG93bkJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJvcGRvd24tYnRuJyk7XG4gIGNvbnN0IGRyb3Bkb3duTGlzdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJvcGRvd24tbGlzdCcpO1xuICBjb25zdCBjbGVhckJvYXJkQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsZWFyLWJvYXJkJyk7XG5cbiAgZnVuY3Rpb24gY2xvc2VEcm9wZG93bnMoKSB7XG4gICAgZHJvcGRvd25MaXN0cy5mb3JFYWNoKChsaXN0KSA9PiB7XG4gICAgICBsaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRyb3Bkb3duQnV0dG9ucy5mb3JFYWNoKChidXR0b24sIGluZGV4KSA9PiB7XG4gICAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjsgLy8gYWxnb3JpdGhtIGluIHByb2dyZXNzXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBjb25zdCBjdXJyZW50TGlzdCA9IGRyb3Bkb3duTGlzdHNbaW5kZXhdO1xuICAgICAgY29uc3QgaXNMaXN0T3BlbiA9IGN1cnJlbnRMaXN0LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpO1xuXG4gICAgICBjbG9zZURyb3Bkb3ducygpO1xuXG4gICAgICBpZiAoIWlzTGlzdE9wZW4pIHtcbiAgICAgICAgY3VycmVudExpc3QuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdycpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgY29uc3QgaXNDbGlja0luc2lkZURyb3Bkb3duID0gQXJyYXkuZnJvbShkcm9wZG93bkxpc3RzKS5zb21lKChsaXN0KSA9PiBsaXN0LmNvbnRhaW5zKGUudGFyZ2V0KSk7XG5cbiAgICBpZiAoIWlzQ2xpY2tJbnNpZGVEcm9wZG93bikge1xuICAgICAgY2xvc2VEcm9wZG93bnMoKTtcbiAgICB9XG4gIH0pO1xuXG4gIGRyb3Bkb3duTGlzdHMuZm9yRWFjaCgobGlzdCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBsaXN0SXRlbXMgPSBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuXG4gICAgbGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBkcm9wZG93bkxpc3RzW2luZGV4XS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIGRyb3Bkb3duQnV0dG9uc1tpbmRleF0udGV4dENvbnRlbnQgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgICBpZiAoaW5kZXggPT09IDApIHNlbGVjdGVkQWxnb3JpdGhtID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgICAgaWYgKGluZGV4ID09PSAxKSBzZWxlY3RlZE1hemUgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGNsZWFyQm9hcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjsgLy8gYWxnb3JpdGhtIGluIHByb2dyZXNzXG4gICAgZ3JpZE9iai5yZXNldEdyaWQoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZExpc3RlbmVyc1RvR3JpZCgpIHtcbiAgZ3JpZE9iai5hZGRMaXN0ZW5lcnMocnVubmluZyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWQoKSB7XG4gIGxvYWRHcmlkKCk7XG4gIGFkZExpc3RlbmVyc1RvR3JpZCgpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIGFkZExpc3RlbmVyc1RvQnRucygpO1xuICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGJpbmFyeVRyZWUoZ3JpZCkge1xuICBjb25zdCBkZWxheSA9IDAuMTtcblxuICBmdW5jdGlvbiBjb25uZWN0KG5vZGUxLCBub2RlMiwgYmFycmllckJldHdlZW4pIHtcbiAgICBub2RlMS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICBub2RlMi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICBiYXJyaWVyQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgfVxuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBpZiAocm93ICUgMiA9PT0gMCB8fCBjb2wgJSAyID09PSAwKSBjb250aW51ZTtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG5cbiAgICAgIGNvbnN0IGN1cnJlbnRTcXVhcmUgPSBncmlkW3Jvd11bY29sXTtcbiAgICAgIGxldCBub3J0aE5laWdoYm9yO1xuICAgICAgbGV0IHdlc3ROZWlnaGJvcjtcblxuICAgICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgICAgbm9ydGhOZWlnaGJvciA9IGdyaWRbcm93IC0gMl1bY29sXTsgLy8gdXBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vcnRoTmVpZ2hib3IgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29sID4gMSkge1xuICAgICAgICB3ZXN0TmVpZ2hib3IgPSBncmlkW3Jvd11bY29sIC0gMl07IC8vIGxlZnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdlc3ROZWlnaGJvciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChub3J0aE5laWdoYm9yICYmIHdlc3ROZWlnaGJvcikge1xuICAgICAgICAvLyBpZiBib3RoIHBhdGhzIGFyZSBhdmFpbGFibGVcbiAgICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgICAgIGlmIChyYW5kb20gPT09IDApIHtcbiAgICAgICAgICBjb25uZWN0KGN1cnJlbnRTcXVhcmUsIG5vcnRoTmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzNdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25uZWN0KGN1cnJlbnRTcXVhcmUsIHdlc3ROZWlnaGJvciwgY3VycmVudFNxdWFyZS5uZWlnaGJvcnNbMV0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBvbmUgb2YgdGhlIHBhdGhzIGdvIGJleW9uZCB0aGUgZ3JpZFxuICAgICAgICBpZiAocm93ID09PSAxICYmIGNvbCA+IDEpIHtcbiAgICAgICAgICBjb25uZWN0KGN1cnJlbnRTcXVhcmUsIHdlc3ROZWlnaGJvciwgY3VycmVudFNxdWFyZS5uZWlnaGJvcnNbMV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2wgPT09IDEgJiYgcm93ID4gMSkge1xuICAgICAgICAgIGNvbm5lY3QoY3VycmVudFNxdWFyZSwgbm9ydGhOZWlnaGJvciwgY3VycmVudFNxdWFyZS5uZWlnaGJvcnNbM10pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlOyAvLyBtYXplIGdlbmVyYXRpb24gZmluaXNoZWRcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJhbmRvbU1hcChncmlkKSB7XG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgaWYgKHJhbmRvbSA8IDAuMykge1xuICAgICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiByZWN1cnNpdmVEaXZpc2lvbihncmlkKSB7XG4gIGNvbnN0IGRlbGF5ID0gMTA7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuICBsZXQgaXNGaW5pc2hlZCA9IGZhbHNlOyAvLyBpcyByZWN1cnNpdmUgcHJvY2VzcyBmaW5pc2hlZD9cblxuICBmdW5jdGlvbiByYW5kb21FdmVuKGEsIGIpIHtcbiAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoYiAtIGEgKyAxKSkgKyBhO1xuICAgIHJldHVybiByYW5kb20gJSAyID09PSAwID8gcmFuZG9tIDogcmFuZG9tICsgMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbU9kZChhLCBiKSB7XG4gICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGIgLSBhICsgMSkpICsgYTtcbiAgICByZXR1cm4gcmFuZG9tICUgMiAhPT0gMCA/IHJhbmRvbSA6IHJhbmRvbSArIDE7XG4gIH1cblxuICBmdW5jdGlvbiBjaG9vc2VPcmllbnRhdGlvbihzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgZW5kQ29sKSB7XG4gICAgY29uc3Qgd2lkdGggPSBlbmRDb2wgLSBzdGFydENvbDtcbiAgICBjb25zdCBoZWlnaHQgPSBlbmRSb3cgLSBzdGFydFJvdztcbiAgICBpZiAod2lkdGggPiBoZWlnaHQpIHtcbiAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgIH0gZWxzZSBpZiAod2lkdGggPCBoZWlnaHQpIHtcbiAgICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgfVxuXG4gICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgcmV0dXJuIHJhbmRvbSA9PT0gMCA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gIH1cblxuICAvLyBzZXQgZWRnZXMgb2YgZ3JpZCBhcyBiYXJyaWVyc1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCByb3dzOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgICBpZiAocm93ID09PSAwIHx8IHJvdyA9PT0gcm93cyAtIDEgfHwgY29sID09PSAwIHx8IGNvbCA9PT0gY29scyAtIDEpIHtcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyB0aGUgcmVjdXJzaXZlIGZ1bmN0aW9uIHRvIGRpdmlkZSB0aGUgZ3JpZFxuICBhc3luYyBmdW5jdGlvbiBkaXZpZGUoc3RhcnRSb3csIGVuZFJvdywgc3RhcnRDb2wsIGVuZENvbCkge1xuICAgIGlmIChlbmRDb2wgLSBzdGFydENvbCA8IDEgfHwgZW5kUm93IC0gc3RhcnRSb3cgPCAxKSB7XG4gICAgICAvLyBiYXNlIGNhc2UgaWYgc3ViLW1hemUgaXMgdG9vIHNtYWxsXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcblxuICAgIGNvbnN0IHdhbGxSb3cgPSByYW5kb21FdmVuKHN0YXJ0Um93ICsgMSwgZW5kUm93IC0gMSk7XG4gICAgY29uc3Qgd2FsbENvbCA9IHJhbmRvbUV2ZW4oc3RhcnRDb2wgKyAxLCBlbmRDb2wgLSAxKTtcblxuICAgIGNvbnN0IHBhc3NhZ2VSb3cgPSByYW5kb21PZGQoc3RhcnRSb3csIGVuZFJvdyk7XG4gICAgY29uc3QgcGFzc2FnZUNvbCA9IHJhbmRvbU9kZChzdGFydENvbCwgZW5kQ29sKTtcblxuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gY2hvb3NlT3JpZW50YXRpb24oc3RhcnRSb3csIGVuZFJvdywgc3RhcnRDb2wsIGVuZENvbCk7XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgLy8gbWFrZSBhIGhvcml6b250YWwgd2FsbFxuICAgICAgZm9yIChsZXQgY29sID0gc3RhcnRDb2w7IGNvbCA8PSBlbmRDb2w7IGNvbCsrKSB7XG4gICAgICAgIGlmIChjb2wgIT09IHBhc3NhZ2VDb2wpIHtcbiAgICAgICAgICBncmlkW3dhbGxSb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIC8vIG1ha2UgYSB2ZXJ0aWNhbCB3YWxsXG4gICAgICBmb3IgKGxldCByb3cgPSBzdGFydFJvdzsgcm93IDw9IGVuZFJvdzsgcm93KyspIHtcbiAgICAgICAgaWYgKHJvdyAhPT0gcGFzc2FnZVJvdykge1xuICAgICAgICAgIGdyaWRbcm93XVt3YWxsQ29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgd2FsbFJvdyAtIDEsIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgICAgYXdhaXQgZGl2aWRlKHdhbGxSb3cgKyAxLCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgZW5kUm93LCB3YWxsQ29sICsgMSwgZW5kQ29sKTtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgd2FsbENvbCAtIDEpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgdGhlIGxhc3QgcmVjdXJzaXZlIGNhbGxcbiAgICBpZiAoc3RhcnRSb3cgPT09IDEgJiYgZW5kUm93ID09PSByb3dzIC0gMiAmJiBzdGFydENvbCA9PT0gMSAmJiBlbmRDb2wgPT09IGNvbHMgLSAyKSB7XG4gICAgICBpc0ZpbmlzaGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBhd2FpdCBkaXZpZGUoMSwgcm93cyAtIDIsIDEsIGNvbHMgLSAyKTtcblxuICByZXR1cm4gaXNGaW5pc2hlZDsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzaWRld2luZGVyKGdyaWQpIHtcbiAgY29uc3QgZGVsYXkgPSAwLjE7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHJvd3M7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgY29sKyspIHtcbiAgICAgIGlmIChyb3cgPT09IDEgJiYgY29sICE9PSAwICYmIGNvbCAhPT0gY29scyAtIDEpIGNvbnRpbnVlO1xuICAgICAgaWYgKGNvbCAlIDIgPT09IDApIHtcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgIH1cbiAgICAgIGlmIChyb3cgJSAyID09PSAwKSB7XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgcm93ID0gMTsgcm93IDwgcm93czsgcm93KyspIHtcbiAgICBsZXQgcnVuID0gW107XG4gICAgZm9yIChsZXQgY29sID0gMTsgY29sIDwgY29sczsgY29sICs9IDIpIHtcbiAgICAgIGlmIChyb3cgJSAyID09PSAwKSBjb250aW51ZTtcblxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgIGlmIChyb3cgPT09IDEpIHtcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGdyaWRbcm93XVtjb2xdO1xuICAgICAgcnVuLnB1c2goY3VycmVudE5vZGUpO1xuXG4gICAgICBpZiAoY29sIDwgY29scyAtIDEpIHtcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjYgJiYgY29sICE9PSBjb2xzIC0gMikge1xuICAgICAgICAgIGN1cnJlbnROb2RlLm5laWdoYm9yc1swXS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgICAgfSBlbHNlIGlmIChydW4ubGVuZ3RoID4gMCAmJiByb3cgPiAxKSB7XG4gICAgICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBydW4ubGVuZ3RoKTtcbiAgICAgICAgICBydW5bcmFuZG9tSW5kZXhdLm5laWdoYm9yc1szXS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgICAgICBydW4gPSBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJpbXBvcnQgRG9tSGFuZGxlciBmcm9tICcuL2RvbWhhbmRsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2RlIHtcbiAgY29uc3RydWN0b3Iocm93LCBjb2wsIGdyaWQpIHtcbiAgICB0aGlzLm5vZGVXaWR0aCA9IDMwOyAvLyBweCB3aWR0aCBhbmQgaGVpZ2h0IG9mIHNxdWFyZVxuICAgIHRoaXMudG90YWxSb3dzID0gMjU7XG4gICAgdGhpcy50b3RhbENvbHMgPSA2MDtcbiAgICB0aGlzLnJvdyA9IHJvdztcbiAgICB0aGlzLmNvbCA9IGNvbDtcbiAgICB0aGlzLnkgPSB0aGlzLnJvdyAqIHRoaXMubm9kZVdpZHRoO1xuICAgIHRoaXMueCA9IHRoaXMuY29sICogdGhpcy5ub2RlV2lkdGg7XG4gICAgdGhpcy5ub2RlVHlwZSA9ICdlbXB0eSc7IC8vIHVzZWQgdG8gdXBkYXRlIHNxdWFyZSBkaXNwbGF5IG9uIGRvbSBlLmcgc3RhcnQsIGVuZCBvciBiYXJyaWVyXG4gICAgdGhpcy5uZWlnaGJvcnMgPSBbXTtcbiAgICB0aGlzLnByZXZpb3VzTm9kZSA9IG51bGw7XG4gICAgdGhpcy5ncmlkID0gZ3JpZDtcblxuICAgIC8vIGFzdGFyIHNjb3Jlc1xuICAgIHRoaXMuZiA9IDA7XG4gICAgdGhpcy5nID0gMDtcbiAgICB0aGlzLmggPSAwO1xuICB9XG5cbiAgc2V0Tm9kZVR5cGUobmV3Tm9kZVR5cGUpIHtcbiAgICB0aGlzLm5vZGVUeXBlID0gbmV3Tm9kZVR5cGU7XG4gICAgRG9tSGFuZGxlci5kaXNwbGF5QWxnb3JpdGhtKHRoaXMsIHRoaXMuZ3JpZCk7XG4gIH1cblxuICAvLyBjYWxjIGYsIGcgYW5kIGggc2NvcmVzXG4gIGNhbGNTY29yZXMoc3RhcnROb2RlLCBlbmROb2RlKSB7XG4gICAgdGhpcy5nID0gTWF0aC5hYnModGhpcy54IC0gc3RhcnROb2RlLngpICsgTWF0aC5hYnModGhpcy55IC0gc3RhcnROb2RlLnkpO1xuICAgIHRoaXMuaCA9IE1hdGguYWJzKHRoaXMueCAtIGVuZE5vZGUueCkgKyBNYXRoLmFicyh0aGlzLnkgLSBlbmROb2RlLnkpO1xuICAgIHRoaXMuZiA9IHRoaXMuZyArIHRoaXMuaDtcbiAgICByZXR1cm4gdGhpcy5mO1xuICB9XG5cbiAgc2V0TmVpZ2hib3JzKGdyaWQpIHtcbiAgICBjb25zdCB0ZW1wUm93ID0gdGhpcy5yb3cgLSAxO1xuICAgIGNvbnN0IHRlbXBDb2wgPSB0aGlzLmNvbCAtIDE7XG5cbiAgICBpZiAodGVtcENvbCA8IHRoaXMudG90YWxDb2xzKSB7XG4gICAgICAvLyByaWdodFxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3ddW3RlbXBDb2wgKyAxXSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbXBDb2wgPiAwKSB7XG4gICAgICAvLyBsZWZ0XG4gICAgICB0aGlzLm5laWdoYm9ycy5wdXNoKGdyaWRbdGVtcFJvd11bdGVtcENvbCAtIDFdKTtcbiAgICB9XG5cbiAgICBpZiAodGVtcFJvdyA8IHRoaXMudG90YWxSb3dzIC0gMSkge1xuICAgICAgLy8gZG93blxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3cgKyAxXVt0ZW1wQ29sXSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbXBSb3cgPiAwKSB7XG4gICAgICAvLyB1cFxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3cgLSAxXVt0ZW1wQ29sXSk7XG4gICAgfVxuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9zY3NzL21haW4uc2Nzcyc7XG5pbXBvcnQgbG9hZCBmcm9tICcuL21haW5sb29wJztcblxubG9hZCgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9